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

hook方法传递的参数都是原始引用,请注意不要轻易修改,除非你知道你在做什么。

请求流程：[onRequsetBefore] -> [sdkWork] -> [onRequsetAfter] -> [onResponse]

sdkWork：为请求的核心逻辑,在这个阶段会对参数进行加密,签名,更新证书等操作。

```typescript
wechatpayV3({/* config */},{
  onRequsetBefore(config){
    console.log(config)
  },
  onRequsetAfter(config){
    console.log(config)
  },
  onResponse(res){
    console.log(res)
  }
})
```

### 调用方式 1 (推荐)容器调用

容器默认单例模式,同个商户号只会返回一个实例。如果不想使用单例模式,请在配置中关闭或者采用类调用形式。

```typescript
import wechatpayV3, { ContainerOptions, Applyment } from 'wechat-pay-v3'
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

const b1 = wechatpayV3(businessOne)
//happy coding....
b1.use(Applyment).submitApplications()
```

### 调用方式 2 类调用

```typescript
import { WechatPayV3Base, Applyment } from 'wechat-pay-v3'

new Applyment(new WechatPayV3Base(businessOne)).submitApplications()
```

### 扩展

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
      url: '/v3/certificates',
      method: 'GET',
    })
  }
}

const baseIns = new WechatPayV3Base(businessOne)
const others = new Others(baseIns)
//直接调用
others.test()
//或者通过容器调用
wechatpayV3(businessOne).use(Others).test()
```

### 支持功能列表

| 功能     | 官方链接                                                                             | 库名      | 服务商 | 直连商户 |
| -------- | ------------------------------------------------------------------------------------ | --------- | ------ | -------- |
| 特约商户 | [link](https://pay.weixin.qq.com/wiki/doc/apiv3_partner/open/pay/chapter7_1_4.shtml) | Applyment | √      |          |

### 功能

- 特约商户 Applyment
  - 提交申请单 submitApplications 不自动加密参数
  - 查询申请状态 queryApplymentState
  - 修改结算账户 modifySettlement
  - 查询结算账户 querySettlement

### todo

- [ ] 支付相关接口
