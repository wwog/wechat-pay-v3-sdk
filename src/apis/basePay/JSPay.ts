import { unixTimeStamp, randomStr } from 'src'
import type { ReqPaymentParams } from './basePay.types'
import { BasePay } from './basePay'

export class JSPay extends BasePay {
  /**
   * 获取小程序调起支付参数
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
