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

export interface JSAPI_Oder_Business extends BaseOrderParams, BusinessToken {
  payer: BusinessPayerToken
}

export interface JSAPI_Oder_Provider extends BaseOrderParams, ProviderToken, SubToken {
  payer: ProviderPayerToken
}
export interface BaseQueryOrderWithTid {
  /** 微信支付订单号 */
  transaction_id: string
}
export interface JSAPI_QueryOrder_tid extends BaseQueryOrderWithTid {
  sp_mchid: string
  sub_mchid: string
}
