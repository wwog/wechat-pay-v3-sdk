import type { KeyObject } from 'crypto'
import crypto, { X509Certificate } from 'crypto'

/**
 * 排除域名中Origin 例如:http://www.a.com/v3/2?a=2 结果为/v3/2?a=2
 * @param url
 * @returns
 */
export function urlExclueOrigin(url: string) {
  const _url = new URL(url)
  return url.replace(_url.origin, '')
}

/**
 * 返回当前时间戳
 * @returns
 */
export function unixTimeStamp() {
  return Math.floor(Date.now() / 1000).toString()
}
/**
 * 随机字符串
 * @param length
 * @returns
 */
export function randomStr(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const maxPos = chars.length
  let noceStr = ''
  for (let i = 0; i < (length || 32); i++) {
    noceStr += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return noceStr
}

/**
 * 路径取文件名
 * @param path
 * @description 适应于windows和linux
 */
export function path2FileName(path: string) {
  // eslint-disable-next-line no-useless-escape
  return path.replace(/^.*[\\\/]/, '')
}

/**
 * 文件摘要
 * @param buffer
 * @description 对文件的二进制内容进行sha256计算得到的值
 */
export function fileSha256(buffer: Buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

/**
 * 获取证书序列号
 * @param buf
 * @returns
 */
export function getCertificateSerialNo(buf: Buffer) {
  const x509 = new X509Certificate(buf)
  return x509.serialNumber
}

/**
 * 获取证书公钥
 */
export function getCertificatePublicKey(certString: string) {
  const x509 = new X509Certificate(certString)
  return x509.publicKey
}

/**
 * 敏感信息加密
 * @param data 待加密数据
 */
export function encrypt(data: string, key: KeyObject) {
  return crypto
    .publicEncrypt(
      {
        key,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      Buffer.from(data, 'utf8'),
    )
    .toString('base64')
}

/**
 * 构造签名信息
 * @param mchid 商户号
 * @param serial_no 商户证书序列号
 * @param nonce_str 随机字符串
 * @param timestamp 时间戳
 * @param signature 签名(buildMessage生成)
 */
export function getToken(mchid: string, serial_no: string, nonce_str: string, timestamp: string, signature: string) {
  return `mchid="${mchid}",nonce_str="${nonce_str}",signature="${signature}",serial_no="${serial_no}",timestamp="${timestamp}"`
}

/*
 * 解密
 * @param ciphertext 密文
 * @param key 密钥
 * @param nonce 随机串
 * @param associated_data 附加数据
 */
export function decryptToString_AES(options: {
  ciphertext: string
  key: string
  nonce: string
  associated_data: string
}) {
  const { associated_data, ciphertext, key, nonce } = options
  const ciphertextBuffer = Buffer.from(ciphertext, 'base64')
  const authTag = ciphertextBuffer.slice(ciphertextBuffer.length - 16)
  const data = ciphertextBuffer.slice(0, ciphertextBuffer.length - 16)
  const decipherIv = crypto.createDecipheriv('aes-256-gcm', key, nonce)
  decipherIv.setAuthTag(authTag)
  decipherIv.setAAD(Buffer.from(associated_data))
  const decryptBuf = decipherIv.update(data)
  decipherIv.final()
  return decryptBuf.toString('utf8')
}

export function getPublicKey(certString: string) {
  const x509 = new X509Certificate(certString)
  return x509.publicKey
}

export function isUrl(url: string) {
  const reg = /^((https|http|ftp)?:\/\/)[^\s]+/
  return reg.test(url)
}

/**
 * 获取系统临时目录
 * @returns
 */
export function getSysTmpDir() {
  return process.env.TMPDIR || process.env.TMP || process.env.TEMP || '/tmp'
}

/**
 * 获取对象路径值
 * @example
 * const obj = {a: {b: {c: 1}},aa:{bb:{cc:{dd:2}}}}}}};
 * getPathValue(obj, 'a.b.c') // 1
 * getPathValue(obj, 'a.b.d') // undefined
 * getPathValue(obj, 'aa.bb.cc.dd') // 2
 */
export function getPathValue<T>(obj: Record<string, any>, path: string): T {
  return path.split('.').reduce((prev, curr) => prev[curr], obj) as any
}

/**
 * 设置对象路径值
 * @description
 * 1. 如果路径不存在则静默跳过, onSetFail() 会被调用
 * 2. 如果路径存在则设置值
 */
export function setPathValue(
  obj: Record<string, any>,
  path: string,
  value: any,
  options?: {
    onSetFail?: (failPath: string) => void
  },
) {
  //用于标记是否设置
  let setFlag = true
  return path.split('.').reduce((prev, curr, index, array) => {
    if (index === array.length - 1 && setFlag) {
      prev[curr] = value
    }
    if (!prev[curr]) {
      if (options?.onSetFail) options.onSetFail(array.slice(0, index + 1).join('.'))
      // 不存在跳出
      setFlag = false
    }
    return prev[curr]
  }, obj)
}
/**
 * 通过标志位和对象替换字符串
 * @description 例如: ('http://www.baidu.com/{name}/{age}', {name: '张三', age: 18}) => http://www.baidu.com/张三/18
 * @param str
 * @param params 参数对象
 * @param beforeToken 默认为 {
 * @param afterToken 默认为 }
 * @returns
 */
export function replaceTagText<T extends string>(
  str: T,
  params: Record<GetUrlParams<T>, string>,
  beforeToken = '{',
  afterToken = '}',
) {
  const arr = Object.entries(params) as [GetUrlParams<T, typeof beforeToken, typeof afterToken>, string][]
  let result: string = str
  arr.forEach(([key, value]) => {
    result = result.replace(`${beforeToken}${key}${afterToken}`, value)
  })
  return result
}

export type GetUrlParams<
  T extends string,
  L extends string = '{',
  R extends string = '}',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
> = T extends `${infer _}${L}${infer P}${R}${infer R1}` ? P | GetUrlParams<R1, L, R> : never
