import type { WechatPayV3Base } from 'src/base'
import type { JSAPI_Oder_Business, JSAPI_Oder_Provider } from './basePay.types'

/**
 * 基础支付-JSAPI
 */
export class JSAPI {
  static UrlMap = {
    order: {
      provider: `https://api.mch.weixin.qq.com/v3/pay/partner/transactions/jsapi`,
      business: `https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi`,
    },
  }
  constructor(private base: WechatPayV3Base) {}
  private async _order(data: any) {
    //这里不用类型标注,因为typescript当前版本不会缩减范围
    const isBusiness = data.appid !== undefined
    const apiUrl = isBusiness ? JSAPI.UrlMap.order.business : JSAPI.UrlMap.order.provider
    const result = await this.base.request.post<{ prepay_id: string }>(apiUrl, data)
    return result.data
  }
  /** 下单-直连商户 */
  async order(data: JSAPI_Oder_Business) {
    return this._order(data)
  }
  /** 下单-直连商户 */
  async orderOnProvider(data: JSAPI_Oder_Provider) {
    return this._order(data)
  }
}
