# 微信支付 V3SDK

- 🛠️ 极易扩展

- 🛠️ typescript 编写且类型完备

- 🛠️ 自动更新平台证书

- 🛠️ 支持直连商户体系和服务商体系

## 安装

> 项目使用了 node 自身的 crypto,请确保运行的版本大于 15.6

```dash
npm install wechat-pay-v3
```

## 说明

大多数情况下,提供的方法对于加密参数都是自动的,部分过于复杂的接口,在 JSDOC 提示中会有 notAutoEncrypt 标注

## 使用

### hook

sdk 提供了三个 hook,可以在请求前后进行一些操作,比如打印日志,记录请求时间等。

hook 方法传递的参数都是原始引用,请注意不要轻易修改,除非你知道你在做什么。

请求流程：[onRequsetBefore] -> [sdkWork] -> [onRequsetAfter] -> [onResponse]

sdkWork：为请求的核心逻辑,在这个阶段会对参数进行加密,签名,更新证书等操作。

```typescript
apiController(
  {
    /* config */
  },
  {
    onRequsetBefore(config) {
      console.log(config)
    },
    onRequsetAfter(config) {
      console.log(config)
    },
    onResponse(res) {
      console.log(res)
    },
  },
)

//or

const base = new WechatPayV3Base(
  {
    /* config */
  },
  {
    /* hooks */
  },
)
```

### 调用方式 1 (推荐)容器调用

容器默认单例模式,同个商户号只会返回一个实例。容器返回除了 use 方法外,基于 base 实例的部分方法和实例本身也会暴露出来。

```typescript
import { apiController, ContainerOptions, Applyment } from 'wechat-pay-v3'
const businessOne: ContainerOptions = {
  //证书
  apiclient_cret: readFileSync('/xx/apiclient_cret.pem'),
  //证书密钥
  apiclient_key: readFileSync('/xx/apiclient_key.pem'),
  //后台配置的key
  apiV3Key: 'APIv3密钥',
  //商户号
  mchid: '商户号',
  //默认单例模式,开启后同个商户号只会返回一个实例。
  singleton: true,
  //可选:默认系统的tmp目录
  downloadDir: './tmpDownlond',
  //可选: 默认ture。开启后会缓存证书12小时,12小时后惰性更新证书
  autoUpdateCertificates: true,
  //可选，默认'wechatpay-sdk'
  userAgent: 'wechatpay-nodejs-sdk/1.0.0',
}

const b1 = apiController(businessOne)
//happy coding....
b1.use(Applyment).submitApplications()
```

### 调用方式 2 类调用

```typescript
import { WechatPayV3Base, Applyment } from 'wechat-pay-v3'

new Applyment(new WechatPayV3Base(businessOne)).submitApplications()
```

## 支持功能列表

| 功能     | 官方链接                                                                             | 库名      | 服务商 | 直连商户 |
| -------- | ------------------------------------------------------------------------------------ | --------- | ------ | -------- |
| 特约商户 | [link](https://pay.weixin.qq.com/wiki/doc/apiv3_partner/open/pay/chapter7_1_4.shtml) | Applyment | √      |          |
| 基础支付 | [link](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_1.shtml)             | BasePay   | √      | √        |

## 功能

- Base ↓↓↓ 均为 WechatPayV3Base 的实例方法或属性
  - 证书相关
    - 获取证书 getCertificates
    - 更新证书 updateCertificates
  - 请求相关
    - 请求实例 request
    - 下载文件 downloadFile
    - 上传图片 uploadImage
    - 上传视频 uploadVideo
  - 加解密
    - 公钥加密 publicEncrypt
    - 公钥加密(批量) publicEncryptObjectPaths example: publicEncryptObjectPaths({a: 1,b:2}, ['a']) //提供对象属性路径的数组即可返回加密后的对象,具体看 JSDOC
    - AESGCM 解密 aesGcmDecrypt
    - SHA256 签名 sha256WithRSA
    - SHA256 验签 sha256WithRsaVerify
  - 常用封装
    - 响应验签 resVerify
    - 回调处理 handleCallback
- 特约商户 Applyment
  - 提交申请单 submitApplications 不自动加密参数
  - 查询申请状态 queryApplymentState
  - 修改结算账户 modifySettlement
  - 查询结算账户 querySettlement
- 基础支付 BasePay(不同类型除了下单基本调用接口一致,如果想扩展,可以继承 BasePay，重写下单方法)[扩展基础支付](#addPayClass)
  - JSAPI 支付 JSPay
  - 小程序支付 MiniProgram

## todo

- [ ] 支付相关接口

## 贡献须知

- 类型和 JSDOC 完整
- 请求一律返回 data 且描述好 data 的类型,这样取值能看到是个啥,而非把具体值返回去
  - 如果返回的数据没有 data，例如根据状态码返回成功与否的情况返回 boolean 且描述出来
- 命名规范
  - 直连商户命名直接使用具体方法做名称,例如:order
  - 服务商命名使用 [方法名]OnProvider,例如:orderOnProvider
- 直连和服务商的方法分开,不要 类型或来书写,因为 typescript 提示不会缩减范围导致类型提示错误(函数重载也可以实现功能,不过我选择了分开,这样更加清晰)
- 由于直连商户和服务商的调用参数往往不一样,调用参数统一全量填写，而非引用配置的方式。这样可以保证参数的正确性。例如需要 mchid 和 openid,那么就需要传入 mchid 和 openid,而不是引用配置的 mchid。
- 封装了 replaceStrWithTokenObject,这个方法会将文本中的{token}替换为对象中的 token 属性,用来合成调用时需要参数的 url, 而不是在调用时拼接,也和微信的文档中 url 保持一致

## 关于发布及测试

因为哪怕是沙盒环境也需要真实的敏感信息作为提交数据,这些东西并不能放出来,如果有人愿意贡献一个可公开不用的商户请联系我,这并不会明文保存项目里。

提交发布仅为我项目实际用到了或者测试着写过确认了无误才会发布,所以源码里有的功能不一定会发布到 npm。

其余的工具方法没有写单元测试，都很简单且具体。

## 实例代码

### <a id="addPayClass">扩展功能类</a>

封装 sdk 的目的是解决现有项目的需求,所以优先保证的是架构的扩展性,而非接口完整。

当你遇到 sdk 未提供的接口时,可以注入 WechatPayV3Base 实例来完成。

```typescript
import { WechatPayV3Base } from 'wechat-pay-v3'

class Others {
  //将WechatPayV3Base实例作为依赖
  constructor(public base: WechatPayV3Base) {}

  async test() {
    //调用base的request进行请求.自动签名满足大多数情况下的请求.
    //如果签名串并非data对象的内容,请自行计算
    //可以参照源码中_upload的实现
    return this.base.request({
      url: 'https://xxx.xxx.xxx/xxx', //需要为完整的url而非接口路径
      method: 'GET',
    })
  }
}

const baseIns = new WechatPayV3Base(businessOne)
const others = new Others(baseIns)
//直接调用
others.test()
//或者通过容器调用
apiController(businessOne).use(Others).test()
```

### <a id="addPayClass">扩展基础支付</a>

支付类其实和上方的扩展功能类一样,只是为了方便使用,所以提供了一个 BasePay 类,继承 BasePay 类,重写下单方法即可。
请注意,BasePay 默认按照 JSApiPay 完成，不修改其他方法的前提是其他方法的接口同 JSAPI 支付一致。(大多相同,没一个个看)
或者你可以完整的编写新的支付类,这样可以保证你的代码更加清晰,查看上方的扩展功能类或basePay源码。

```typescript
import { BasePay } from 'wechat-pay-v3'

export class MyPay extends BasePay {
  //重写下单方法
  async order(data: any) {
    return this.base.request.post('xxx', data)
  }
}

//使用
//推荐使用容器,容器调用的类会自动注入 WechatPayV3Base 实例且默认单例
//下单
apiController(businessOne).use(MyPay).order(/* ... */)
//查询订单
apiController(businessOne).use(MyPay).transactionIdQueryOrder({
  /* ... */
})
```
