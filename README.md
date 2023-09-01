<p align="center">
<a href="https://www.npmjs.com/package/wechat-pay-v3"><img src="https://img.shields.io/npm/v/wechat-pay-v3.svg" alt="npm package"></a>
</p>

# 微信支付 V3SDK

- 🛠️ 极易扩展

- 🛠️ typescript 编写且类型完备

- 🛠️ 自动更新平台证书

- 🛠️ 支持直连商户体系和服务商体系

- 🛠️ hook 请求过程

## 安装

> 项目使用了 node 自身的 crypto,请确保运行的版本大于 15.6

```dash
npm install wechat-pay-v3
```

## 说明

sdk 公开工具函数,基础类和功能类。工具函数针对应用场景代码封装,基础类是 sdk 的核心,功能类为具体的功能实现。实现的功能类列表可在下方表格中查看。

base 类提供了验签方法`resVerify`,但并没有给功能方法添加自动验签。除了封装的 handleCallback 方法,其他情况下您可以通过 hook 的方式在 onResponse 中进行验签，下方有实例代码。

大多数情况下,提供的方法对于加密参数都是自动的,部分过于复杂的接口,在 JSDOC 提示中会有 notAutoEncrypt 标注。

## 使用

### hook

请求流程：[onRequsetBefore] -> [sdkWork] -> [onRequsetAfter] -> [onResponse]

hook 方法传递的参数都是原始引用,请注意不要轻易修改,除非你知道你在做什么。

sdkWork：为请求的核心逻辑,在这个阶段会对参数进行加密,签名,更新证书等操作。

```typescript
apiController(
  {
    /* config */
  },
  {
    onRequsetBefore(config, instance) {
      console.log(config)
    },
    onRequsetAfter(config, instance) {
      console.log(config)
    },
    onResponse(res, instance) {
      console.log(res)
      //如果需要验签
      const verifyResult = instance.resVerify(res.headers, res.data)

      //部分接口是不需要验签的，不要轻易直接抛错
      //您可以将验签结果加入 res.data 中,大多数方法返回res.data
      res.data.verifyResult = result
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

### 调用方式

调用方式有两种,一种通过封装的容器调用,一种通过类调用。容器实现默认单例(容器调用的类均单例)和自动的依赖注入。
容器函数为`apiController`

```typescript
import { apiController, ContainerOptions, Applyment } from 'wechat-pay-v3'
const Config: ContainerOptions = {
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
//1 容器获取示例
const applyment = apiController(Config).use(Applyment)
//2 类直接new就好,不过请自行管理实例避免重复创建造成性能浪费
const applyment = new Applyment(new WechatPayV3Base(Config))
//Applyment 为特约商户的功能类
//上方两种方式都可以拿到 applyment 实例
//例如调用提交特约商户申请接口
applyment.submitApplications()
```

## 已实现功能

| 功能        | 官方链接                                                                             | 库名            | 服务商 | 直连商户 |
| ----------- | ------------------------------------------------------------------------------------ | --------------- | ------ | -------- |
| 核心类      | 加解密,管理证书,扩展功能使用的基础类                                                 | WechatPayV3Base | √      | √        |
| 特约商户    | [link](https://pay.weixin.qq.com/wiki/doc/apiv3_partner/open/pay/chapter7_1_4.shtml) | Applyment       | √      |          |
| 基础支付    | 因除合单支付外,其余方式仅下单不同,BasePay 为支付基类                                 | BasePay         | √      | √        |
| JSAPI 支付  | [link](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_1.shtml)             | JSPay           | √      | √        |
| 小程序支付  | [link](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_1.shtml)             | MiniProgramPay  | √      | √        |
| APP 支付    | [link](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_1.shtml)             | AppPay          | √      | √        |
| H5 支付     | [link](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_1.shtml)             | H5Pay           | √      | √        |
| Native 支付 | [link](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_1.shtml)             | NativePay       | √      | √        |

> sdk 满足大多数情况下的基本支付功能.扩展其余功能请参考<a href="#addClass">扩展功能类</a>

## TODO

- [ ] 国密支持

## 核心类

- hook 事件 setEvents
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
  - 公钥加密(批量) publicEncryptObjectPaths
  - AESGCM 解密 aesGcmDecrypt
  - SHA256 签名 sha256WithRSA
  - SHA256 验签 sha256WithRsaVerify
- 常用封装
  - 响应验签 resVerify
  - 回调处理 handleCallback

## 示例代码

### 下单接口示例

```typescript
const router = Router()
const appId = '小程序appid'
const wxpay = router.post('/pay/order', async (req, res, next) => {
  try {
    const miniPay = apiController({
      /* xxx */
    }).use(MiniProgramPay)
    const { prepay_id } = await miniPay.order({
      /* xxx */
    })
    //获取小程序支付参数
    const payParams = miniPay.getPayParams({
      appId,
      prepay_id,
    })
    /* 小程序可以调起支付直接传入payParams即可 */
    res.send(payParams)
  } catch (e) {
    next(e)
  }
})
```

### 通知接收

base 实例上封装了通用的 handleCallback,他的功能是进行回调验签,通过后返回的 resource 对象会自动解密。

```typescript
import { apiController } from 'wechat-pay-v3'

//假定这里是一个接口
router.post('/notify', async (req, res) => {
  try {
    const wxapi = apiController({
      /* xxx */
    })
    //handleCallback接收两个参数,第一个是请求头,第二个是请求体。
    //实际并不一定是这样的,请根据实际情况调整。
    const data = await wxapi.handleCallback(req.headers, req.body)
    res.status(204).send()
  } catch (e) {
    res.status(400).send({
      message: e.message,
      code: 'FAIL',
    })
  }
})
```

### <a id="addClass">扩展功能类</a>

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

const baseIns = new WechatPayV3Base({
  /* xxx */
})
const others = new Others(baseIns)
//直接调用
others.test()
//或者通过容器调用
apiController({
  /* xxx */
})
  .use(Others)
  .test()
```

## 贡献须知

- 类型和 JSDOC 完整
- 请求一律返回 data 且描述好 data 的类型,这样取值能看到是个啥,而非把具体值返回去
  - 如果返回的数据没有 data，例如根据状态码返回成功与否的情况返回 boolean 且描述出来
- 命名规范
  - 直连商户命名直接使用具体方法做名称,例如:order
  - 服务商命名使用 [方法名]OnProvider,例如:orderOnProvider
- 直连和服务商的方法分开,不要 类型或来书写,因为 typescript 提示不会缩减范围导致类型提示错误(函数重载也可以实现功能,不过我选择了分开,这样更加清晰)
- 由于直连商户和服务商的调用参数往往不一样,调用参数统一全量填写，而非引用配置的方式。这样可以保证参数的正确性。例如需要 mchid 和 openid,那么就需要传入 mchid 和 openid,而不是引用配置的 mchid。

