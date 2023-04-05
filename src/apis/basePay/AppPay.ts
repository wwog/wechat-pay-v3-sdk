import type { WechatPayV3Base } from 'src/base'
import { BasePay } from './basePay'
import type { AppOrder_Business, AppOrder_Provider, AppReqPaymentParams } from '.'
import { unixTimeStamp, randomStr } from 'src'

const UrlMap = {
  order: {
    provider: `https://api.mch.weixin.qq.com/v3/pay/partner/transactions/app`,
    business: `https://api.mch.weixin.qq.com/v3/pay/transactions/app`,
  },
}

export class AppPay extends BasePay {
  constructor(base: WechatPayV3Base) {
    super(base)
  }

  private async _exOrder(params: any) {
    const isBusiness = params.appid !== undefined
    const apiUrl = isBusiness ? UrlMap.order.business : UrlMap.order.provider
    const result = await this.base.request.post<{ prepay_id: string }>(apiUrl, params)
    return result.data
  }
  /**
   * App支付下单 直连
   */
  async order(params: AppOrder_Business) {
    return this._exOrder(params)
  }
  /**
   * App支付下单 服务商
   */
  async orderOnProvider(data: AppOrder_Provider) {
    return this._exOrder(data)
  }
  /**
   * 获取App调起支付参数
   * @param params
   * @returns
   */
  getPayParams(params: AppReqPaymentParams) {
    const { appId, prepay_id, partnerId } = params
    //构造签名串
    const timeStamp = unixTimeStamp()
    const nonceStr = randomStr()
    const packageStr = `Sign=WXPay`
    const message = [appId, timeStamp, nonceStr, prepay_id].join('\n') + '\n'

    //签名
    const paySign = this.base.sha256WithRSA(message)
    return {
      appId,
      partnerId,
      prepayId: prepay_id,
      package: packageStr,
      nonceStr,
      timeStamp,
      sign: paySign,
    }
  }
}
