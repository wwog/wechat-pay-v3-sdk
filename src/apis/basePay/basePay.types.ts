export interface BaseOrderParams {
  /** 商品描述 */
  description: string
  /** 商户系统内部订单号，只能是数字、大小写字母_-*且在同一个商户号下唯一 */
  out_trade_no: string
  /** 订单失效时间，遵循rfc3339标准格式，格式为yyyy-MM-DDTHH:mm:ss+TIMEZONE，yyyy-MM-DD表示年月日，T出现在字符串中，表示time元素的开头，HH:mm:ss表示时分秒，TIMEZONE表示时区（+08:00表示东八区时间，领先UTC8小时，即北京时间）。例如：2015-05-20T13:29:35+08:00表示，北京时间2015年5月20日 13点29分35秒。 */
  time_expire?: string
  /** 附加数据，在查询API和支付通知中原样返回，可作为自定义参数使用，实际情况下只有支付完成状态才会返回该字段。 */
  attach?: string
  /** 异步接收微信支付结果通知的回调地址，通知url必须为外网可访问的url，不能携带参数。 公网域名必须为https，如果是走专线接入，使用专线NAT IP或者私有回调域名可使用http */
  notify_url: string
  /** 订单优惠标记 */
  goods_tag?: string
  /** 电子发票入口开放标识,传入true时，支付成功消息和支付详情页将出现开票入口。需要在微信支付商户平台或微信公众平台开通电子发票功能，传此字段才可生效。 */
  support_fapiao?: boolean
  /** 订单金额信息 */
  amount: OrderParamsAmount
  /** 支付者 */
  payer?: any
  /** 优惠功能 */
  detail?: OrderParamsDetail
  /** 支付场景描述 */
  scene_info?: OrderParamsSceneInfo
  /** 结算信息 */
  settle_info?: OrderParamsSettleInfo
}

export interface OrderParamsAmount {
  /** 总金额,单位为分 */
  total?: number
  /** 货币类型,默认CNY，境内商户号仅支持人名币 */
  currency?: string
}

export interface OrderParamsDetail {
  /** 商品小票ID */
  invoice_id?: string
  /** 订单原价 */
  cost_price?: number
  /** 商品列表 */
  goods_detail?: OrderParamsDetailGoodsDetail[]
}

export interface OrderParamsDetailGoodsDetail {
  /** 商品编码 */
  merchant_goods_id: string
  /** 微信侧商品编码 */
  wechatpay_goods_id?: string
  /** 商品名称 */
  goods_name: string
  /** 商品数量 */
  quantity: number
  /** 商品单价，单位为分 */
  unit_price: number
}

export interface OrderParamsSceneInfo {
  /** 商户端设备号 */
  device_id?: string
  /** 用户终端ip */
  payer_client_ip: string
  /** 商户门店信息 */
  store_info: OrderParamsSceneInfoStoreInfo
}

export interface OrderParamsSceneInfoStoreInfo {
  /** 门店编号 */
  id: string
  /** 门店名称 */
  name?: string
  /** 门店行政区划码 */
  area_code?: string
  /** 门店详细地址 */
  address?: string
}

export interface OrderParamsSettleInfo {
  /** 是否指定分账 */
  profit_sharing?: boolean
}

/**
 * appid && mchid
 */
export interface BusinessToken {
  /** 应用ID */
  appid: string
  /** 直连商户号 */
  mchid: string
}

/**
 * sp_appid && sp_mchid
 */
export interface ProviderToken {
  sp_appid: string
  sp_mchid: string
}
/**
 * sub_mchid && [sub_appid]
 */
export interface SubToken {
  sub_appid?: string
  sub_mchid: string
}

export interface BusinessPayerToken {
  openid: string
}

export interface ProviderPayerToken {
  sp_openid?: string
  sub_openid?: string
}

export interface JSAPIOder_Business extends BaseOrderParams, BusinessToken {
  payer: BusinessPayerToken
}

export interface JSAPIOder_Provider extends BaseOrderParams, ProviderToken, SubToken {
  payer: ProviderPayerToken
}

export interface AppOrder_Business extends Omit<BaseOrderParams, 'payer'>, BusinessToken {}
export interface AppOrder_Provider extends Omit<BaseOrderParams, 'payer'>, ProviderToken, SubToken {}

export interface H5Order_Business extends Omit<BaseOrderParams, 'payer'>, BusinessToken {}
export interface H5Order_Provider extends Omit<BaseOrderParams, 'payer'>, ProviderToken, SubToken {}

export interface NativeOrder_Business extends Omit<BaseOrderParams, 'payer'>, BusinessToken {}
export interface NativeOrder_Provider extends Omit<BaseOrderParams, 'payer'>, ProviderToken, SubToken {}

export type OrderResult = { prepay_id: string } | { h5_url: string } | { code_url: string }
export interface BaseQueryOrderWithTid {
  /** 微信支付订单号 */
  transaction_id: string
}

export interface JSAPI_QueryOrder_tid_Business extends BaseQueryOrderWithTid {
  mchid: string
}

export interface JSAPI_QueryOrder_tid_Provider extends BaseQueryOrderWithTid {
  sp_mchid: string
  sub_mchid: string
}

export interface BaseQueryOrderWithOutTradeNo {
  /** 商户订单号 */
  out_trade_no: string
}

export interface JSAPI_QueryOrder_outTradeNo_Business extends BaseQueryOrderWithOutTradeNo {
  mchid: string
}

export interface JSAPI_QueryOrder_outTradeNo_Provider extends BaseQueryOrderWithOutTradeNo {
  sp_mchid: string
  sub_mchid: string
}

export interface BaseQueryOrderResult {
  /** 商户订单号 */
  out_trade_no: string
  /** 微信支付订单号 */
  transaction_id: string
  /** 交易类型 */
  trade_type: TradeTypeEnum
  /** 交易状态 */
  trade_state: TradeStateEnum
  /** 交易状态描述 */
  trade_state_desc: string
  /** 付款银行 */
  bank_type: string
  /** 附加数据 */
  attach: string
  /** 支付完成时间 */
  success_time: string
  /** 支付者信息 */
  payer?: any
  /** 订单金额信息 */
  amount?: QueryOrderAmount
  /** 支付场景描述 */
  scene_info?: {
    /** 商户端设备号 */
    device_id: string
  }
  /** 优惠功能 */
  promotion_detail?: QueryOrderPromotionDetail[]
}

export enum TradeTypeEnum {
  /** 公众号支付 */
  JSAPI = 'JSAPI',
  /** 扫码支付 */
  NATIVE = 'NATIVE',
  /** APP支付 */
  APP = 'APP',
  /** 付款码支付 */
  MICROPAY = 'MICROPAY',
  /** H5支付 */
  MWEB = 'MWEB',
  /** 刷脸支付 */
  FACEPAY = 'FACEPAY',
}

export enum TradeStateEnum {
  /** 支付成功 */
  SUCCESS = 'SUCCESS',
  /** 转入退款 */
  REFUND = 'REFUND',
  /** 未支付 */
  NOTPAY = 'NOTPAY',
  /** 已关闭 */
  CLOSED = 'CLOSED',
  /** 已撤销（仅付款码支付会返回） */
  REVOKED = 'REVOKED',
  /** 用户支付中（仅付款码支付会返回） */
  USERPAYING = 'USERPAYING',
  /** 支付失败（仅付款码支付会返回） */
  PAYERROR = 'PAYERROR',
}

export interface QueryOrderAmount {
  /** 订单金额 */
  total: number
  /** 用户支付金额 */
  payer_total: number
  /** 用户支付币种 */
  payer_currency: string
  /** 货币类型 */
  currency: string
}

export interface QueryOrderPromotionDetail {
  /** 券ID */
  coupon_id: string
  /** 优惠名称 */
  name?: string
  /** 优惠范围 */
  scope?: 'GLOBAL' | 'SINGLE'
  /** 优惠类型 */
  type?: 'CASH' | 'NOCASH'
  /** 优惠券面额 */
  amount: number
  /** 活动id */
  stock_id?: string
  /** 微信出资 */
  wechatpay_contribute?: number
  /** 商户出资 */
  merchant_contribute?: number
  /** 其他出资 */
  other_contribute?: number
  /** 优惠币种 */
  currency?: string
  /** 单品列表 */
  goods_detail?: QueryOrderGoodsDetail[]
}

export interface QueryOrderGoodsDetail {
  /** 商品编码 */
  goods_id: string
  /** 商品数量 */
  quantity: number
  /** 商品单价 */
  unit_price: number
  /** 商品优惠金额 */
  discount_amount: number
  /** 商品备注 */
  goods_remark?: string
}

export interface QueryOrderResult_Business extends BaseQueryOrderResult, BusinessToken {}

export interface QueryOrderResult_Provider extends BaseQueryOrderResult, ProviderToken, SubToken {}

export interface ReqPaymentParams {
  /** appid,若下单时候传了sub_appid,须为sub_appid的值 */
  appId: string
  /** 预支付订单号,下单接口返回 */
  prepay_id: string
}

export interface AppReqPaymentParams extends ReqPaymentParams {
  /** 商户号,若下单时候传了sub_mchid,须为sub_mchid的值 */
  partnerId: string
}

export interface GoodsDetail {
  /** 商户侧商品编码 */
  merchant_goods_id: string
  /** 微信侧商品编码 */
  wechatpay_goods_id?: string
  /** 商品名称 */
  goods_name?: string
  /** 商品单价 */
  unit_price: number
  /** 商品退款金额 */
  refund_amount: number
  /** 商品退款数量 */
  refund_quantity: number
}

export interface RefundAmount {
  /** 订单总金额，单位为分 */
  total: number
  /** 订单退款金额，单位为分 */
  refund: number
  /** 货币类型，符合ISO4217标准的三位字母代码，默认人民币：CNY */
  currency: string
}

export interface Refund_Business {
  /** 微信支付订单号 */
  transaction_id?: string
  /** 商户订单号 */
  out_trade_no?: string
  /** 商户退款单号 */
  out_refund_no: string
  /** 退款原因 */
  reason?: string
  /** 退款结果通知url */
  notify_url?: string
  /** 资金账户 */
  funds_account?: string
  /** 退款金额信息 */
  amount: RefundAmount
  /** 单品列表信息，微信支付后台会根据此参数控制向用户展示商品详情 */
  goods_detail?: GoodsDetail[]
}

export interface Refund_Provider extends Refund_Business {
  /** 子商户号，服务商模式下必填 */
  sub_mchid: string
}

export interface RefundResult {
  /** 微信支付退款单号 */
  refund_id: string
  /** 商户退款单号 */
  out_refund_no: string
  /** 微信支付订单号 */
  transaction_id: string
  /** 商户订单号 */
  out_trade_no: string
  /** 退款渠道 */
  channel: ResultRefundChannelEnum
  /** 退款入账账户 */
  user_received_account: string
  /** 退款成功时间 */
  success_time?: string
  /** 退款创建时间 */
  create_time: string
  /** 退款状态 */
  status: ResultRefundStatusEnum
  /** 资金账户 */
  funds_account?: ResultFundsAccountEnum
  /** 金额信息 */
  amount: ResultRefundAmount
  /** 优惠退款信息 */
  promotion_detail: any
}

export enum ResultRefundStatusEnum {
  /** 退款成功 */
  SUCCESS = 'SUCCESS',
  /** 退款关闭 */
  CLOSED = 'CLOSED',
  /** 退款处理中 */
  PROCESSING = 'PROCESSING',
  /** 退款异常 */
  ABNORMAL = 'ABNORMAL',
}

export enum ResultRefundChannelEnum {
  /** 原路退款 */
  ORIGINAL = 'ORIGINAL',
  /** 退回到余额 */
  BALANCE = 'BALANCE',
  /** 原账户异常退到其他余额账户 */
  OTHER_BALANCE = 'OTHER_BALANCE',
  /** 原银行卡异常退到其他银行卡 */
  OTHER_BANKCARD = 'OTHER_BANKCARD',
}

export enum ResultFundsAccountEnum {
  /** 未结算资金 */
  UNSETTLED = 'UNSETTLED',
  /** 可用余额 */
  AVAILABLE = 'AVAILABLE',
  /** 不可用余额 */
  UNAVAILABLE = 'UNAVAILABLE',
  /** 运营户 */
  OPERATION = 'OPERATION',
  /** 基本账户（含可用余额和不可用余额） */
  BASIC = 'BASIC',
}

export interface ResultRefundAmount {
  /** 订单总金额，单位为分 */
  total: number
  /** 退款标价金额，单位为分，可以做部分退款 */
  refund: number
  /** 退款出资的账户类型及金额信息 */
  from?: {
    /** 资金账户类型 */
    account: 'AVAILABLE' | 'UNAVAILABLE'
    /** 退款金额 */
    amount: number
  }[]
  /** 现金支付金额，单位为分，只能为整数 */
  payer_total: number
  /** 退款给用户的金额，不包含所有优惠券金额 */
  payer_refund: number
  /** 去掉非充值代金券退款金额后的退款金额，单位为分，退款金额=申请退款金额-非充值代金券退款金额，退款金额<=申请退款金额 */
  settlement_refund: number
  /** 应结订单金额=订单金额-免充值代金券金额，应结订单金额<=订单金额，单位为分 */
  settlement_total: number
  /** 优惠退款金额<=退款金额，退款金额-代金券或立减优惠退款金额为现金，说明详见代金券或立减优惠，单位为分 */
  discount_refund: number
  /** 退款币种 */
  currency: string
  /** 手续费退款金额，单位为分 */
  refund_fee?: number
}

export interface ResultPromotionDetail {
  /** 券或者立减优惠id */
  promotion_id: string
  /** 枚举值：GLOBAL：全场代金券 SINGLE：单品优惠 */
  scope: 'GLOBAL' | 'SINGLE'
  /** 枚举值： COUPON：代金券，需要走结算资金的充值型代金券 DISCOUNT：优惠券，不走结算资金的免充值型优惠券 */
  type: 'COUPON' | 'DISCOUNT'
  /** 用户享受优惠的金额（优惠券面额=微信出资金额+商家出资金额+其他出资方金额 ），单位为分 */
  amount: number
  /** 优惠退款金额<=退款金额，退款金额-代金券或立减优惠退款金额为用户支付的现金，说明详见代金券或立减优惠，单位为分 */
  refund_amount: number
  /** 商品列表 */
  goods_detail?: GoodsDetail[]
}

export interface TradeBillParams {
  bill_date: string
  sub_mchid?: string
  /**
   * ALL：返回当日所有订单信息（不含充值退款订单）
   * SUCCESS：返回当日成功支付的订单（不含充值退款订单）
   * REFUND：返回当日退款订单（不含充值退款订单）
   */
  bill_type?: 'ALL' | 'SUCCESS' | 'REFUND'
  tar_type?: 'GZIP'
}

export interface BillResult {
  download_url: string
  hash_type: 'SHA1'
  hash_value: string
}

export interface FundflowBillParams {
  /** 账单日期，最长支持拉取最近三个月的账单 */
  bill_date: string
  /** 资金账户类型，BASIC，基本账户，OPERATION，运营账户，FEES，手续费账户 */
  account_type?: 'BASIC' | 'OPERATION' | 'FEES'
  /** 压缩账单,默认数据流 */
  tar_type?: 'GZIP'
}

export interface SubMerchantFundflowBillParams {
  /** 账单日期，最长支持拉取最近三个月的账单 */
  bill_date: string
  /** 资金账户类型，BASIC，基本账户，OPERATION，运营账户，FEES，手续费账户 */
  account_type?: 'BASIC' | 'OPERATION' | 'FEES'
  /** 压缩账单,默认数据流 */
  tar_type?: 'GZIP'
  /** 加密算法 */
  algorithm?: 'AEAD_AES_256_GCM' | 'SM4_GCM'
  /** 子商户号 */
  sub_mchid: string
}

export interface SubMerchantFundflowBillResult {
  download_bill_count: number
  download_bill_list: {
    /** 账单文件序号 */
    bill_sequence: number
    /** 下载地址30s内有效 */
    download_url: string
    /** 加密密钥,加密账单文件使用的加密密钥。密钥用商户证书的公钥进行加密，然后进行Base64编码 */
    encrypt_key: string
    /** 哈希类型 */
    hash_type: 'SHA1'
    /** 哈希值 */
    hash_value: string
    /** 随机字符串 */
    nonce: string
  }[]
}
