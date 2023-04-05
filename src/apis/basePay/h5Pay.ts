import type { WechatPayV3Base } from 'src/base'
import { BasePay } from './basePay'
import type { H5Order_Business, H5Order_Provider } from './basePay.types'

const UrlMap = {
  order: {
    provider: `https://api.mch.weixin.qq.com/v3/pay/partner/transactions/h5`,
    business: `https://api.mch.weixin.qq.com/v3/pay/transactions/h5`,
  },
}

export class H5Pay extends BasePay {
  constructor(base: WechatPayV3Base) {
    super(base)
  }

  private async _exOrder(params: any) {
    const isBusiness = params.appid !== undefined
    const apiUrl = isBusiness ? UrlMap.order.business : UrlMap.order.provider
    const result = await this.base.request.post<{ h5_url: string }>(apiUrl, params)
    return result.data
  }
  /**
   * H5支付下单 直连
   */
  async order(params: H5Order_Business) {
    return this._exOrder(params)
  }
  /**
   * H5支付下单 服务商
   */
  async orderOnProvider(data: H5Order_Provider) {
    return this._exOrder(data)
  }
}
