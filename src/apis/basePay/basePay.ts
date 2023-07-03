import type { WechatPayV3Base } from 'src/base'
import { replaceTagText } from 'src/utils/index'
import type {
  BillResult,
  FundflowBillParams,
  JSAPIOder_Business,
  JSAPIOder_Provider,
  JSAPI_QueryOrder_outTradeNo_Business,
  JSAPI_QueryOrder_outTradeNo_Provider,
  JSAPI_QueryOrder_tid_Business,
  JSAPI_QueryOrder_tid_Provider,
  OrderResult,
  QueryOrderResult_Business,
  QueryOrderResult_Provider,
  RefundResult,
  Refund_Business,
  Refund_Provider,
  SubMerchantFundflowBillParams,
  SubMerchantFundflowBillResult,
  TradeBillParams,
} from './basePay.types'

const UrlMap = {
  order: {
    provider: `https://api.mch.weixin.qq.com/v3/pay/partner/transactions/jsapi`,
    business: `https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi`,
  },
  transactionIdQueryOrder: {
    provider: 'https://api.mch.weixin.qq.com/v3/pay/partner/transactions/id/{transaction_id}',
    business: 'https://api.mch.weixin.qq.com/v3/pay/transactions/id/{transaction_id}',
  },
  outTradeNoQueryOrder: {
    provider: 'https://api.mch.weixin.qq.com/v3/pay/partner/transactions/out-trade-no/{out_trade_no}',
    business: 'https://api.mch.weixin.qq.com/v3/pay/transactions/out-trade-no/{out_trade_no}',
  },
  closeOrder: {
    provider: 'https://api.mch.weixin.qq.com/v3/pay/partner/transactions/out-trade-no/{out_trade_no}/close',
    business: 'https://api.mch.weixin.qq.com/v3/pay/transactions/out-trade-no/{out_trade_no}/close',
  },
  refund: {
    apiUrl: 'https://api.mch.weixin.qq.com/v3/refund/domestic/refunds', //退款都是一个
  },
  queryRefund: {
    apiUrl: 'https://api.mch.weixin.qq.com/v3/refund/domestic/refunds/{out_refund_no}', //查询退款都是一个
  },
  applyTradeBill: {
    apiUrl: 'https://api.mch.weixin.qq.com/v3/bill/tradebill',
  },
  fundflowBill: {
    apiUrl: 'https://api.mch.weixin.qq.com/v3/bill/fundflowbill',
  },
  subFundflowBill: {
    apiUrl: 'https://api.mch.weixin.qq.com/v3/bill/sub-merchant-fundflowbill',
  },
} as const
/**
 * 基础支付
 * 默认以JSAPI接口构成,其他接口可继承此类进行扩展。
 * 除开下单接口,其余接口基本一致
 */
export class BasePay {
  constructor(public base: WechatPayV3Base) {}

  //=========================================下单
  protected async _order<T = OrderResult>(data: any) {
    //这里不用类型标注,因为typescript当前版本不会缩减范围
    const isBusiness = data.appid !== undefined
    const apiUrl = isBusiness ? UrlMap.order.business : UrlMap.order.provider
    const result = await this.base.request.post<T>(apiUrl, data)
    return result.data
  }
  /** 下单-直连商户 */
  async order(data: JSAPIOder_Business) {
    return this._order(data)
  }
  /** 下单-服务商 */
  async orderOnProvider(data: JSAPIOder_Provider) {
    return this._order(data)
  }

  //=========================================查询订单_通过微信订单号
  protected async _transactionIdQueryOrder<T = any>(data: any) {
    const { transaction_id, ...query } = data
    const isBusiness = data.mchid !== undefined
    const _ = isBusiness
      ? UrlMap.transactionIdQueryOrder.business + '?mchid=' + query.mchid
      : UrlMap.transactionIdQueryOrder.provider + '?sp_mchid=' + query.sp_mchid + '&sub_mchid=' + query.sub_mchid
    const apiUrl = replaceTagText(_, {
      transaction_id,
    })
    const result = await this.base.request.get<T>(apiUrl)
    return result.data
  }
  /**
   * 查询订单-通过微信订单号
   */
  async transactionIdQueryOrder(data: JSAPI_QueryOrder_tid_Business) {
    return this._transactionIdQueryOrder<QueryOrderResult_Business>(data)
  }
  /**
   * 查询订单-服务商-通过微信订单号
   */
  async transactionIdQueryOrderOnProvider(data: JSAPI_QueryOrder_tid_Provider) {
    return this._transactionIdQueryOrder<QueryOrderResult_Provider>(data)
  }

  //=========================================查询订单_通过商户订单号
  async _outTradeNoQueryOrder<T = any>(data: any) {
    const { out_trade_no, ...query } = data
    const isBusiness = data.mchid !== undefined
    const _ = isBusiness
      ? UrlMap.outTradeNoQueryOrder.business + '?mchid=' + query.mchid
      : UrlMap.outTradeNoQueryOrder.provider + '?sp_mchid=' + query.sp_mchid + '&sub_mchid=' + query.sub_mchid
    const apiUrl = replaceTagText(_, {
      out_trade_no,
    })
    const result = await this.base.request.get<T>(apiUrl)
    return result.data
  }
  /**
   * 查询订单-通过商户订单号
   */
  async outTradeNoQueryOrder(data: JSAPI_QueryOrder_outTradeNo_Business) {
    return this._outTradeNoQueryOrder<QueryOrderResult_Business>(data)
  }
  /**
   * 查询订单-服务商-通过商户订单号
   */
  async outTradeNoQueryOrderOnProvider(data: JSAPI_QueryOrder_outTradeNo_Provider) {
    return this._outTradeNoQueryOrder<QueryOrderResult_Provider>(data)
  }

  //=========================================关闭订单
  protected async _closeOrder(data: any) {
    const { out_trade_no, ...body } = data
    const isBusiness = data.mchid !== undefined
    const _ = isBusiness ? UrlMap.closeOrder.business : UrlMap.closeOrder.provider
    const apiUrl = replaceTagText(_, {
      out_trade_no,
    })
    const result = await this.base.request.post(apiUrl, body)
    return result.status
  }
  /**
   * 关闭订单-直连商户
   * @returns status 如果为204,则关闭成功
   */
  async closeOrder(data: JSAPI_QueryOrder_outTradeNo_Business) {
    return this._closeOrder(data)
  }
  /**
   * 关闭订单-服务商
   * @returns status 如果为204,则关闭成功
   */
  async closeOrderOnProvider(data: JSAPI_QueryOrder_outTradeNo_Provider) {
    return this._closeOrder(data)
  }

  //=========================================退款
  protected async _refund<T = any>(data: any) {
    const { apiUrl } = UrlMap.refund
    const result = await this.base.request.post<T>(apiUrl, data)
    return result.data
  }

  /**
   * 退款-直连商户
   */
  async refund(data: Refund_Business) {
    return this._refund<RefundResult>(data)
  }

  /**
   * 退款-服务商
   */
  async refundOnProvider(data: Refund_Provider) {
    return this._refund<RefundResult>(data)
  }
  //=========================================查询退款
  protected async _queryRefund<T = any>(data: any) {
    const { out_refund_no, sub_mchid } = data
    let apiUrl = replaceTagText(UrlMap.queryRefund.apiUrl, {
      out_refund_no,
    })
    if (sub_mchid) {
      apiUrl += `?sub_mchid=${sub_mchid}`
    }
    const result = await this.base.request.get<T>(apiUrl)
    return result.data
  }
  /**
   * 查询退款-直连商户
   */
  async queryRefund(data: { out_refund_no: string }) {
    return this._queryRefund<RefundResult>(data)
  }
  /**
   * 查询退款-服务商
   */
  async queryRefundOnProvider(data: { out_refund_no: string; sub_mchid: string }) {
    return this._queryRefund<RefundResult>(data)
  }
  //=========================================申请交易账单
  protected async _applyTradeBill(data: any) {
    const { apiUrl } = UrlMap.applyTradeBill
    const result = await this.base.request.get<BillResult>(apiUrl, {
      params: data,
    })
    return result.data
  }
  /**
   * 申请交易账单-直连商户
   */
  async applyTradeBill(data: Omit<TradeBillParams, 'sub_mchid'>) {
    return this._applyTradeBill(data)
  }
  /**
   * 申请交易账单-服务商
   */
  async applyTradeBillOnProvider(data: TradeBillParams) {
    return this._applyTradeBill(data)
  }
  //=========================================申请资金账单
  protected async _applyFundFlowBill(data: any) {
    const { apiUrl } = UrlMap.fundflowBill
    const result = await this.base.request.get<BillResult>(apiUrl, {
      params: data,
    })
    return result.data
  }
  /**
   * 申请资金账单-直连商户
   */
  async applyFundFlowBill(data: FundflowBillParams) {
    return this._applyFundFlowBill(data)
  }
  /**
   * 申请资金账单-服务商
   */
  async applyFundFlowBillOnProvider(data: FundflowBillParams) {
    return this._applyFundFlowBill(data)
  }
  //=========================================申请单个子商户资金账单
  /**
   * 申请单个子商户资金账单 仅限服务商
   */
  async applySubMerchantFundFlowBill(data: SubMerchantFundflowBillParams) {
    const { apiUrl } = UrlMap.subFundflowBill
    const result = await this.base.request.get<SubMerchantFundflowBillResult>(apiUrl, {
      params: data,
    })
    return result.data
  }
  //=========================================下载账单
  /**
   * 下载账单(通用)
   */
  async downloadBill(download_url: string) {
    const result = await this.base.request.get<ArrayBuffer>(download_url, {
      responseType: 'arraybuffer',
    })
    return result.data
  }
}
