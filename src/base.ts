import crypto from 'crypto'
import FormData from 'form-data'
import axios from 'axios'
import { join } from 'path'
import { createWriteStream, existsSync, mkdirSync, readFileSync, statSync, unlink } from 'fs'
import {
  decryptToString_AES,
  encrypt,
  fileSha256,
  getCertificateSerialNo,
  getPathValue,
  getPublicKey,
  getSysTmpDir,
  getToken,
  isUrl,
  path2FileName,
  randomStr,
  setPathValue,
  unixTimeStamp,
  urlExclueOrigin,
} from './utils'

import type { InternalAxiosRequestConfig, AxiosInstance } from 'axios'
import type { GetCertificatesResult, DecryptCertificates, UploadImageResult } from './types'

export interface WechatBaseOptions {
  /**
   * 商户号
   */
  mchid: string
  /**
   * pem证书
   */
  apiclient_cret: Buffer
  /**
   * pem私钥
   */
  apiclient_key: Buffer
  /**
   * apiV3密钥
   */
  apiV3Key: string
  /**
   * header中的User-Agent
   */
  userAgent?: string
  /**
   * 自动更新平台证书
   * @default true
   * @description 更偏向于惰性更新,缓存证书并记录过期时间,在每次请求时,比对时间进行更新(简单的时间比对于性能没有啥影响)。
   * @description 如果你需要自己管控,可以关闭此选项,调用updateCertificates(true)方法强制更新实例上的证书
   */
  autoUpdateCertificates?: boolean
  /**
   * 下载文件文件夹
   * @default [systemTempDir]/wxpay-v3-downloads
   * @description 让部分接口更加方便,例如上传文件给微信接口只能从本地上传
   * @description 需要注意的是,sdk并不会保存此文件,于对应功能完毕后
   */
  downloadDir?: string
}

export interface WechatBaseEventOPtions {
  /**
   * 在请求前触发,可以在此处修改请求配置.
   * @description 签名生成在onRequsetBefore之后,此处无法获取到签名
   * @param config 请求的配置
   * @param instance 当前实例
   */
  onRequsetBefore?: (config: InternalAxiosRequestConfig<any>, instance: WechatPayV3Base) => void
  /**
   * 在请求后触发
   * @description 签名生成在onRequsetAfter之前,此处可以获取到签名并修改
   * @param config 请求的配置
   * @param instance 当前实例
   */
  onRequsetAfter?: (config: InternalAxiosRequestConfig<any>, instance: WechatPayV3Base) => void
  /**
   * 在请求成功后触发
   */
  onResponse?: (result: any, instance: WechatPayV3Base) => void
}

/** 微信支付v3 */
export class WechatPayV3Base {
  /** pem私钥 */
  readonly privateKey: Buffer
  /** 加密算法,固定值'WECHATPAY2-SHA256-RSA2048'.国密暂不支持 */
  readonly schema = 'WECHATPAY2-SHA256-RSA2048'
  /** axios请求示例 */
  readonly request: AxiosInstance
  /** 商户号 */
  readonly mchid: string
  /** header -> userAgent (微信可能会拒绝不带userAgent的请求) */
  readonly userAgent: string
  /** apiV3密钥 */
  readonly apiV3Key: string
  /** 平台证书列表 */
  certificates: DecryptCertificates[] = []
  /** 更新证书时间+12小时后的结果,注意此时间并非平台证书本身的过期时间,而是需要更新的时间 */
  certExpiresTime?: Date
  /** 商户Api证书序列号 */
  readonly apiCretSerialNo: string
  /** 下载文件文件夹 */
  readonly downloadDir: string

  constructor(options: WechatBaseOptions, private events: WechatBaseEventOPtions = {}) {
    this.mchid = options.mchid
    this.userAgent = options.userAgent ?? 'wechatpay-sdk'
    this.privateKey = options.apiclient_key
    this.apiCretSerialNo = getCertificateSerialNo(options.apiclient_cret)
    this.apiV3Key = options.apiV3Key
    if (options.downloadDir) {
      this.downloadDir = options.downloadDir
    } else {
      const tempDir = getSysTmpDir()
      const downloadDir = join(tempDir, './wxpay-v3-downloads')
      //如果不存在则创建
      if (!existsSync(downloadDir)) {
        mkdirSync(downloadDir)
      }
      this.downloadDir = downloadDir
    }
    //给axios添加自定义配置项

    this.request = axios.create({
      timeout: 1000 * 60 * 5,
      timeoutErrorMessage: '请求超时',
      headers: {
        Accept: 'application/json',
        'User-Agent': this.userAgent,
        'Content-Type': 'application/json',
      },
    })

    this.init()
  }
  /**
   * 初始化
   */
  private init() {
    // axios错误拦截
    this.request.interceptors.response.use(
      response => {
        if (this.events.onResponse) {
          this.events.onResponse(response, this)
        }
        return response
      },
      error => {
        if (error.response) {
          return Promise.reject(error.response.data ?? error)
        }
        return Promise.reject(error)
      },
    )
    //axios请求拦截
    this.request.interceptors.request.use(async config => {
      if (this.events.onRequsetBefore) {
        this.events.onRequsetBefore(config, this)
      }
      //如果没有添加auth，则在中间路由添加。因为某些接口需要单独处理签名生成
      if (config.headers?.Authorization === undefined) {
        if (config.method && config.url) {
          const timestamp = unixTimeStamp()
          const nonce = randomStr()
          const signature = this.buildMessageSign(
            config.method.toUpperCase(),
            urlExclueOrigin(config.url),
            timestamp,
            nonce,
            config.data || '',
          )
          const Authorization = this.getAuthorization(nonce, timestamp, signature)
          config.headers.Authorization = Authorization
        }
      }
      //排除掉获取平台证书的请求
      if (config.url?.includes('/v3/certificates')) {
        //只是对比缓存的时间,所以每个请求都附加一次更新方法的调用也不会有什么影响
        return config
      }
      await this.updateCertificates()
      if (this.events.onRequsetAfter) {
        this.events.onRequsetAfter(config, this)
      }
      return config
    })

    this.updateCertificates().catch(error => {
      console.log('init updateCertificates fail', error)
    })
  }
  setEvents(events: WechatBaseEventOPtions) {
    this.events = events
  }
  /**
   * 更新平台证书
   * @description 会判断缓存是否过期,如果过期则更新,否则不更新.
   * @param forceUpdate 强制更新
   */
  async updateCertificates(forceUpdate = false) {
    //如果证书过期时间存在,并且证书过期时间大于当前时间,则不更新证书
    if (forceUpdate === false) {
      if (this.certExpiresTime && this.certExpiresTime > new Date()) {
        return
      }
    }
    const res = await this.getCertificates()
    this.certificates = res
    this.certExpiresTime = new Date(Date.now() + 12 * 60 * 60 * 1000)
  }

  /**
   * 构造签名串并签名
   * @param method 请求方法
   * @param url 请求URL
   * @param timestamp 时间戳
   * @param nonce 随机字符串
   * @param body 请求主体
   */
  protected buildMessageSign(method: string, url: string, timestamp: string, nonce: string, body: string | object) {
    const tmpBody = typeof body === 'object' ? JSON.stringify(body) : body
    const data = method + '\n' + url + '\n' + timestamp + '\n' + nonce + '\n' + tmpBody + '\n'
    return this.sha256WithRSA(data)
  }

  /**
   * 构造验签名串
   * @param timestamp 参数在响应头中对应
   * @param nonce 参数在响应头中对应
   * @param body 参数在响应头中对应
   * @returns
   */
  protected buildMessageVerify(timestamp: string, nonce: string, body: string) {
    return [timestamp, nonce, body].join('\n') + '\n'
  }

  /**
   * 构造Authorization
   * @param nonce_str 随机字符串
   * @param timestamp 时间戳
   * @param signature 签名(buildMessage生成)
   */
  protected getAuthorization(nonce_str: string, timestamp: string, signature: string) {
    return `${this.schema} ${getToken(this.mchid, this.apiCretSerialNo, nonce_str, timestamp, signature)}`
  }
  /**
   * 私钥签名
   * @param data 待签名数据
   * @returns base64编码的签名
   */
  sha256WithRSA(data: string) {
    return crypto.createSign('RSA-SHA256').update(data).sign(this.privateKey, 'base64')
  }
  /**
   * 平台证书公钥验签
   * @param serial 证书序列号
   * @param signature 签名
   * @param data 待验签数据
   */
  sha256WithRsaVerify(serial: string, signature: string, data: string) {
    const cert = this.certificates.find(item => item.serial_no === serial)
    if (!cert) {
      //这里直接抛错,因为证书并非api下载使用,过期或不存在逻辑上不会出现。如果出现打印当前证书列表,方便调试
      console.error({
        cerificates: this.certificates,
        certExpiresTime: this.certExpiresTime,
      })
      throw new Error('证书序列号错误')
    }
    return crypto.createVerify('RSA-SHA256').update(data).verify(cert.publicKey, signature, 'base64')
  }
  /**
   * 解密平台响应
   * @param nonce 随机字符串
   * @param associated_data 附加数据
   * @param ciphertext  密文
   * @returns
   */
  aesGcmDecrypt(options: { ciphertext: string; nonce: string; associated_data: string }) {
    return decryptToString_AES({
      ...options,
      key: this.apiV3Key,
    })
  }

  /**
   * 平台证书公钥加密,如果需要同时加密多个字段,请使用publicEncryptObjectPaths
   * @param data 待加密数据
   * @returns
   */
  publicEncrypt(data: string) {
    return encrypt(data, this.certificates[0].publicKey)
  }

  /**
   * 平台证书公钥加密请求主体中指定的字段
   * @description 对字符串类型的路径进行加密
   * @param data 数据
   * @param paths 路径数组
   * @returns 该函数返回一个新的对象,不会修改原对象
   * @example
   * const data = { name: '张三' , idCard: {
   *    number:string //如果这个字段需要加密
   * }}
   * const newData = publicEncryptObjectPaths(data,['idCard.number'])
   */
  publicEncryptObjectPaths<T extends Record<string, any>>(data: T, paths: string[]) {
    const json = JSON.stringify(data)
    const newData = JSON.parse(json)
    paths.forEach(path => {
      const value = getPathValue(newData, path)
      if (value && typeof value === 'string') {
        setPathValue(newData, path, this.publicEncrypt(value), {
          onSetFail(failPath) {
            console.log(`设置路径:${failPath}失败 : ${json}`)
          },
        })
      }
    })
    return newData
  }

  /**
   * 下载文件
   * @param url
   * @param fileName 提供文件名,包括后缀。如果不提供,则从url中获取文件名
   * @returns
   */
  async downloadFile(url: string, fileName?: string) {
    let tmpFileName: string = fileName || ''
    //获取文件名
    if (!fileName) {
      tmpFileName = url.split('/').pop() as string
      if (tmpFileName === '') {
        throw new Error('文件名获取失败,请手动指定文件名')
      }
    }
    const response = await this.request.get(url, {
      responseType: 'stream',
    })
    //从content-type类型确认文件后缀
    const contentType = response.headers['content-type']
    const suffix = contentType.split('/').pop()
    if (suffix) {
      //如果suffix是jpeg,则需要转换为jpg
      if (suffix === 'jpeg') {
        tmpFileName = `${tmpFileName}.jpg`
      } else {
        tmpFileName = `${tmpFileName}.${suffix}`
      }
    }
    const filePath = join(this.downloadDir, tmpFileName)
    const writer = createWriteStream(filePath)
    response.data.pipe(writer)
    return new Promise<{ filePath: string; fileName: string }>((resolve, reject) => {
      writer.on('finish', () => {
        //关闭文件流
        writer.close()
        resolve({
          filePath,
          fileName: tmpFileName,
        })
      })
      writer.on('error', reject)
    })
  }

  /**
   * 响应验签
   * @description 该函数会验证签名,返回true表示验签成功,返回false表示验签失败
   * @param headers 请求头
   * @param body  请求体
   */
  resVerify<H extends Record<string, any>, B extends Record<string, any>>(headers: H, body?: B) {
    const {
      'wechatpay-timestamp': timestamp,
      'wechatpay-nonce': nonce,
      'wechatpay-signature': signature,
      'wechatpay-serial': serial,
    } = headers
    let bodyStr = ''
    if (body) {
      bodyStr = Object.keys(body).length !== 0 ? JSON.stringify(body) : ''
    }
    //构建验签名串
    const signStr = this.buildMessageVerify(timestamp, nonce, bodyStr)
    //验证签名
    return this.sha256WithRsaVerify(serial, signature, signStr)
  }

  /**
   * 处理回调 -验证签名,并使用AEAD_AES_256_GCM解密
   * @param headers
   * @param body
   */
  async handleCallback<H extends Record<string, any>, B extends Record<string, any>>(headers: H, body: B) {
    if (!body.resource) {
      throw new Error('回调数据格式错误')
    }
    const isOk = this.resVerify(headers, body)
    if (!isOk) {
      throw new Error('回调验签失败')
    }
    //解密
    const resource = this.aesGcmDecrypt(body.resource)
    try {
      return {
        ...body,
        resource: JSON.parse(resource),
      }
    } catch (error) {
      throw new Error('回调数据JSON解析失败')
    }
  }
  //================ Base Api

  /**
   * 获取证书
   * @description 获取商户当前可用的平台证书列表。
   * @docUrl https://pay.weixin.qq.com/wiki/doc/apiv3_partner/apis/wechatpay5_1.shtml
   */
  async getCertificates() {
    const apiUrl = 'https://api.mch.weixin.qq.com/v3/certificates'
    const res = await this.request.get<GetCertificatesResult>(apiUrl)
    //加密后的证书列表
    const certificates = res.data.data
    //解密后的证书列表
    const decryptCertificates = certificates.map(item => {
      const { associated_data, ciphertext, nonce } = item.encrypt_certificate
      const certificate = this.aesGcmDecrypt({
        nonce,
        associated_data,
        ciphertext,
      })
      const publicKey = getPublicKey(certificate)
      return {
        expire_time: item.expire_time,
        effective_time: item.effective_time,
        serial_no: item.serial_no,
        certificate,
        publicKey,
      } as DecryptCertificates
    })
    //按照过期时间排序(时间靠后在前),避免极端条件下,过期证书被使用
    decryptCertificates.sort((a, b) => {
      return new Date(b.expire_time).getTime() - new Date(a.expire_time).getTime()
    })
    return decryptCertificates
  }

  //上传视频和图片的方法差不多,封装在一起
  private async _upload(
    path: string,
    options: {
      fileName?: string
      type: 'image' | 'video'
    },
  ) {
    const { fileName, type } = options
    const apiUrl = 'https://api.mch.weixin.qq.com/v3/merchant/media/upload'
    const realyFileName = fileName ?? path2FileName(path)
    const fileSize = statSync(path).size

    if (type === 'image') {
      if (!realyFileName.match(/(jpg|png|bmp)$/i)) {
        throw '图片结尾必须是jpg、png、bmp'
      }
      if (fileSize > 2 * 1024 * 1024) {
        throw '图片大小不能超过2M'
      }
    } else if (type === 'video') {
      if (!realyFileName.match(/(avi|wmv|mpeg|mp4|mov|mkv|flv|f4v|m4v|rmvb)$/i)) {
        throw '视频结尾必须是avi、wmv、mpeg、mp4、mov、mkv、flv、f4v、m4v、rmvb'
      }
      if (fileSize > 5 * 1024 * 1024) {
        throw '视频大小不能超过5M'
      }
    }

    let file: Buffer

    try {
      file = readFileSync(path)
    } catch (error) {
      throw '找不到文件: ' + path
    }
    const body = {
      filename: realyFileName,
      sha256: fileSha256(file),
    }
    const json = JSON.stringify(body)

    const timestamp = unixTimeStamp()
    const nonce = randomStr()

    const signature = this.buildMessageSign('POST', urlExclueOrigin(apiUrl), timestamp, nonce, json)
    const Authorization = this.getAuthorization(nonce, timestamp, signature)

    const formData = new FormData()
    formData.append('meta', json, {
      contentType: 'application/json',
    })
    formData.append('file', file, {
      filename: realyFileName,
    })
    const res = await this.request.post<UploadImageResult>(apiUrl, formData, {
      headers: {
        Authorization,
        'Content-Type': 'multipart/form-data;boundary=' + formData.getBoundary(),
      },
    })
    return res.data
  }

  /**
   * 图片上传
   * @maxSize 2M
   * @param pathOrUrl 图片路径可以是本地路径,也可以是网络路径
   * @param fileName 商户上传的媒体图片的名称，商户自定义，必须以jpg、bmp、png为后缀,不区分大小写。
   * @description 部分微信支付业务指定商户需要使用图片上传 API来上报图片信息，从而获得必传参数的值：图片MediaID 。
   * @docUrl https://pay.weixin.qq.com/wiki/doc/apiv3_partner/apis/chapter2_1_1.shtml
   */
  async uploadImage(pathOrUrl: string, fileName?: string) {
    if (isUrl(pathOrUrl)) {
      const { filePath } = await this.downloadFile(pathOrUrl)
      const result = await this._upload(filePath, { fileName, type: 'image' })
      //删除临时文件
      unlink(filePath, e => {
        if (e) console.error('本地文件删除失败', e)
      })
      return result
    } else {
      return this._upload(pathOrUrl, { fileName, type: 'image' })
    }
  }

  /**
   * 视频上传
   * @maxSize 5M
   * @param pathOrUrl 视频路径可以是本地路径,也可以是网络路径
   * @param fileName 商户上传的媒体视频的名称，商户自定义，必须以avi、wmv、mpeg、mp4、mov、mkv、flv、f4v、m4v、rmvb为后缀,不区分大小写。
   * @description 部分微信支付业务指定商户需要使用视频上传 API来上报视频信息，从而获得必传参数的值：视频MediaID 。
   * @docUrl https://pay.weixin.qq.com/wiki/doc/apiv3_partner/apis/chapter2_1_2.shtml
   */
  async uploadVideo(pathOrUrl: string, fileName?: string) {
    if (isUrl(pathOrUrl)) {
      const { filePath } = await this.downloadFile(pathOrUrl)
      const result = this._upload(filePath, { fileName, type: 'video' })
      //删除临时文件
      unlink(filePath, e => {
        if (e) console.error('本地文件删除失败', e)
      })
      return result
    } else {
      return this._upload(pathOrUrl, { fileName, type: 'video' })
    }
  }
}

const baseInstanceMap = new Map<string, WechatPayV3Base>()
const useInstanceMap = new Map<string, any>()

export interface ContainerOptions extends WechatBaseOptions {
  /**
   * 是否使用单例模式
   * @default true
   */
  singleton?: boolean
}

/**
 * 实例化Api的容器,默认单例
 * @param options Base的配置
 * @param events Base的事件
 * @returns
 */
export function apiContainer(options: ContainerOptions, events?: WechatBaseEventOPtions) {
  const { singleton = true, ...wechatPayOptions } = options

  let base: WechatPayV3Base
  if (singleton) {
    const key = wechatPayOptions.mchid
    if (baseInstanceMap.has(key)) {
      base = baseInstanceMap.get(key)!
    } else {
      base = new WechatPayV3Base(wechatPayOptions, events)
      baseInstanceMap.set(key, base)
    }
  } else {
    base = new WechatPayV3Base(wechatPayOptions, events)
  }
  function use<
    T extends {
      new (wechatpay: WechatPayV3Base): any
    },
  >(ApiClass: T): InstanceType<T> {
    if (singleton) {
      const key = ApiClass.name + wechatPayOptions.mchid
      if (useInstanceMap.has(key)) {
        return useInstanceMap.get(key)!
      } else {
        const instance = new ApiClass(base)
        useInstanceMap.set(key, instance)
        return instance
      }
    }
    return new ApiClass(base)
  }
  const {
    downloadFile,
    publicEncrypt,
    publicEncryptObjectPaths,
    uploadImage,
    uploadVideo,
    aesGcmDecrypt,
    sha256WithRSA,
    sha256WithRsaVerify,
    handleCallback,
    resVerify,
    setEvents,
  } = base

  return {
    use,
    downloadFile: downloadFile.bind(base),
    publicEncrypt: publicEncrypt.bind(base),
    publicEncryptObjectPaths: publicEncryptObjectPaths.bind(base),
    uploadImage: uploadImage.bind(base),
    uploadVideo: uploadVideo.bind(base),
    sha256WithRSA: sha256WithRSA.bind(base),
    aesGcmDecrypt: aesGcmDecrypt.bind(base),
    sha256WithRsaVerify: sha256WithRsaVerify.bind(base),
    handleCallback: handleCallback.bind(base),
    resVerify: resVerify.bind(base),
    setEvents: setEvents.bind(base),
    base: base!,
  }
}

/**
 * 查看当前内存中的实例
 */
export function getInstances() {
  return {
    baseInstanceMap,
    useInstanceMap,
  }
}
