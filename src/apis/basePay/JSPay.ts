import { unixTimeStamp, randomStr } from 'src'
import type { JSAPIOder_Business, JSAPIOder_Provider, ReqPaymentParams } from './basePay.types'
import { BasePay } from './basePay'

export class JSPay extends BasePay {
  order(data: JSAPIOder_Business) {
    return super._order<{ prepay_id: string }>(data)
  }
  orderOnProvider(data: JSAPIOder_Provider) {
    return super._order<{ prepay_id: string }>(data)
  }
  /**
   * 获取调起支付参数
   * @param params
   * @returns
   */
  getPayParams(params: ReqPaymentParams) {
    const { appId, prepay_id } = params
    //构造签名串
    const timeStamp = unixTimeStamp()
    const nonceStr = randomStr()
    const packageStr = `prepay_id=${prepay_id}`
    const message = [appId, timeStamp, nonceStr, packageStr].join('\n') + '\n'
    //签名
    const paySign = this.base.sha256WithRSA(message)
    return {
      appId,
      timeStamp,
      nonceStr,
      package: packageStr,
      signType: 'RSA',
      paySign,
    }
  }
}
