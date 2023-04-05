import type { WechatPayV3Base } from 'src/base'
import { BasePay } from './basePay'
import type { NativeOrder_Business, NativeOrder_Provider } from './basePay.types'

const UrlMap = {
  order: {
    provider: `https://api.mch.weixin.qq.com/v3/pay/partner/transactions/native`,
    business: `https://api.mch.weixin.qq.com/v3/pay/transactions/native`,
  },
}

export class NativePay extends BasePay {
  constructor(base: WechatPayV3Base) {
    super(base)
  }

  private async _exOrder(params: any) {
    const isBusiness = params.appid !== undefined
    const apiUrl = isBusiness ? UrlMap.order.business : UrlMap.order.provider
    const result = await this.base.request.post<{ code_url: string }>(apiUrl, params)
    return result.data
  }
  /**
   * Native支付下单 直连
   */
  async order(params: NativeOrder_Business) {
    return this._exOrder(params)
  }
  /**
   * Native支付下单 服务商
   */
  async orderOnProvider(data: NativeOrder_Provider) {
    return this._exOrder(data)
  }
}
