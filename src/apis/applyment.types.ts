export interface SubmitApplicationsResult {
  applyment_id: string
}

export type BankAccountType = 'BANK_ACCOUNT_TYPE_CORPORATE' | 'BANK_ACCOUNT_TYPE_PERSONAL'

export type ApplymentState =
  | 'APPLYMENT_STATE_EDITTING'
  | 'APPLYMENT_STATE_AUDITING'
  | 'APPLYMENT_STATE_REJECTED'
  | 'APPLYMENT_STATE_TO_BE_CONFIRMED'
  | 'APPLYMENT_STATE_TO_BE_SIGNED'
  | 'APPLYMENT_STATE_SIGNING'
  | 'APPLYMENT_STATE_FINISHED'
  | 'APPLYMENT_STATE_CANCELED'

export interface QueryApplymentStateResult {
  /** 微信支付申请单号 */
  applyment_id: string
  /** 业务申请编号 */
  business_code: string
  /** 特约商户号,当申请单状态为APPLYMENT_STATE_FINISHED时才返回*/
  sub_mchid?: string
  /** 超管签约链接,状态为APPLYMENT_STATE_TO_BE_SIGNED才返回 */
  sign_url?: string
  /** 申请单状态 */
  applyment_state: ApplymentState
  /** 申请单状态描述 */
  applyment_state_msg: string
  /** 审核情况，当申请状态为APPLYMENT_STATE_REJECTED时才返回 */
  audit_detail?: {
    /** 字段名:例如:id_card_copy */
    field: string
    /** 字段名描述:例如:身份证人像面 */
    field_name: string
    /** 驳回原因 */
    reject_reason: string
  }[]
}

export interface ModifySettlementAccountBody {
  /** 账户类型 */
  account_type: 'ACCOUNT_TYPE_BUSINESS' | 'ACCOUNT_TYPE_PRIVATE'
  /** 开户名称 */
  account_name?: string
  /** 开户银行 */
  account_bank: string
  /** 开户银行省市编码 */
  bank_address_code: string
  /** 开户银行全称（含支行）  */
  bank_name?: string
  /** 开户银行联行号  */
  bank_branch_id?: string
  /** 银行账号 */
  account_number: string
}

export interface QuerySettlementAccountResult {
  /** 账户类型 */
  account_type: 'ACCOUNT_TYPE_BUSINESS' | 'ACCOUNT_TYPE_PRIVATE'
  /** 开户银行 */
  account_bank: string
  /** 开户银行全称（含支行） */
  bank_name?: string
  /** 开户银行联行号 */
  bank_branch_id?: string
  /** 银行账号 */
  account_number: string
  /** 汇款验证结果 */
  verify_result: 'VERIFYING' | 'VERIFY_SUCCESS' | 'VERIFY_FAIL'
  /** 汇款验证失败原因 */
  verify_fail_reason?: string
}

export interface SubmitApplicationBody {
  /** 业务申请编号 */
  business_code: string
  /** 超级管理员信息 */
  contact_info: SubmitApplicationContactInfo
  /** 主体资料 */
  subject_info: SubmitApplicationSubjectInfo
  /** 经营资料 */
  business_info: SubmitApplicationBusinessInfo
  /** 结算规则 */
  settlement_info: SubmitApplicationSettlementInfo
  /** 结算银行账户 */
  bank_account_info: SubmitApplicationBankAccountInfo
  /** 补充材料 */
  addition_info?: SubmitApplicationAdditionInfo
}

export type ContactType = 'LEGAL' | 'SUPER'

export type ContactIdType = 'IDENTIFICATION_TYPE_IDCARD' | 'IDENTIFICATION_TYPE_PASSPORT' | 'IDENTIFICATION_TYPE_OTHERS'

export interface SubmitApplicationContactInfo {
  /** 超级管理员类型 */
  contact_type: ContactType
  /** 超级管理员姓名 */
  contact_name: string
  /** 超级管理员证件类型 */
  contact_id_type?: ContactIdType
  /** 超级管理员证件号码 */
  contact_id_number?: string
  /** 超级管理员证件照片 */
  contact_id_doc_copy?: string
  /** 超级管理员证件反面照片 */
  contact_id_doc_copy_back?: string
  /** 超级管理员证件有效期开始时间 */
  contact_period_begin?: string
  /** 超级管理员证件有效期结束时间 */
  contact_period_end?: string
  /** 业务办理授权函 */
  business_authorization_letter?: string
  /** 超级管理员微信OpenID */
  openid?: string
  /** 联系手机 */
  mobile_phone: string
  /** 联系邮箱 */
  contact_email: string
}

export interface SubmitApplicationSubjectInfo {
  /** 主体类型 */
  subject_type: SubjectType
  /** 是否是金融机构 */
  finance_institution?: boolean
  /** 营业执照 */
  business_license_info?: SubmitApplicationBusinessLicenseInfo
  /** 登记证书 */
  certificate_info?: SubmitApplicationCertificateInfo
  /** 单位证明函照片 */
  certificate_letter_copy?: string
  /** 金融机构许可证信息 */
  finance_institution_info?: SubmitApplicationFinanceInstitutionInfo
  /** 经营者/法人身份证件 */
  identity_info: SubmitApplicationIdentityInfo
  /** 最终受益人信息列表(UBO) */
  ubo_info_list?: SubmitApplicationUboInfo[]
}

export interface SubmitApplicationBusinessLicenseInfo {
  /** 营业执照照片 */
  license_copy: string
  /** 注册号/统一社会信用代码 */
  license_number: string
  /** 商户名称 */
  merchant_name: string
  /** 个体户经营者/法人姓名 */
  legal_person: string
  /** 注册地址 */
  license_address?: string
  /** 有效期限开始日期 */
  period_begin?: string
  /** 有效期限结束日期 */
  period_end?: string
}

export type CertificateType =
  | 'CERTIFICATE_TYPE_2388'
  | 'CERTIFICATE_TYPE_2389'
  | 'CERTIFICATE_TYPE_2394'
  | 'CERTIFICATE_TYPE_2395'
  | 'CERTIFICATE_TYPE_2396'
  | 'CERTIFICATE_TYPE_2520'
  | 'CERTIFICATE_TYPE_2521'
  | 'CERTIFICATE_TYPE_2522'
  | 'CERTIFICATE_TYPE_2399'
  | 'CERTIFICATE_TYPE_2400'

export interface SubmitApplicationCertificateInfo {
  /** 登记证书照片 */
  cert_copy: string
  /** 登记证书类型 */
  cert_type: CertificateType
  /** 证书号 */
  cert_number: string
  /** 商户名称 */
  merchant_name: string
  /** 注册地址 */
  company_address: string
  /** 法定代表人 */
  legal_person: string
  /** 有效期限开始日期 */
  period_begin: string
  /** 有效期限结束日期 */
  period_end: string
}

/** 金融机构类型 */
export type FinanceType = 'BANK_AGENT' | 'PAYMENT_AGENT' | 'INSURANCE' | 'TRADE_AND_SETTLE' | 'OTHER'

export interface SubmitApplicationFinanceInstitutionInfo {
  /** 金融机构类型 */
  finance_type: FinanceType
  /** 金融机构许可证图片 */
  finance_license_pics: string[]
}

export type IdHolderType = 'LEGAL' | 'SUPER'

export type IdDocType =
  | 'IDENTIFICATION_TYPE_IDCARD'
  | 'IDENTIFICATION_TYPE_OVERSEA_PASSPORT'
  | 'IDENTIFICATION_TYPE_HONGKONG_PASSPORT'
  | 'IDENTIFICATION_TYPE_MACAO_PASSPORT'
  | 'IDENTIFICATION_TYPE_TAIWAN_PASSPORT'
  | 'IDENTIFICATION_TYPE_FOREIGN_RESIDENT'
  | 'IDENTIFICATION_TYPE_HONGKONG_MACAO_RESIDENT'
  | 'IDENTIFICATION_TYPE_TAIWAN_RESIDENT'

export type IdCardInfo = {
  /** 身份证人像面照片 */
  id_card_copy: string
  /** 身份证国徽面照片 */
  id_card_national: string
  /** 身份证姓名 */
  id_card_name: string
  /** 身份证号码 */
  id_card_number: string
  /** 身份证居住地址 */
  id_card_address?: string
  /** 身份证有效期开始时间 */
  card_period_begin: string
  /** 身份证有效期结束时间 */
  card_period_end: string
}

export interface IdDocInfo {
  /** 证件正面照片 */
  id_doc_copy: string
  /** 证件反面照片 */
  id_doc_copy_back?: string
  /** 证件姓名 */
  id_doc_name: string
  /** 证件号码 */
  id_doc_number: string
  /** 证件居住地址 */
  id_doc_address?: string
  /** 证件有效期开始时间 */
  doc_period_begin: string
  /** 证件有效期结束时间 */
  doc_period_end: string
}

export interface SubmitApplicationIdentityInfo {
  /** 证件持有人类型 */
  id_holder_type?: IdHolderType
  /** 证件类型 */
  id_doc_type?: IdDocType
  /** 法定代表人说明函 */
  authorize_letter_copy?: string
  /** 身份证信息 */
  id_card_info?: IdCardInfo
  /** 其他类型证件信息 */
  id_doc_info?: IdDocInfo
  /** 经营者/法人是否为受益人 */
  owner?: boolean
}

/**
 *  UBO信息 估计用的不多,就any了。
 *  https://pay.weixin.qq.com/wiki/doc/apiv3_partner/apis/chapter11_1_1.shtml
 */
export type SubmitApplicationUboInfo = any

/** 主体类型 */
export type SubjectType =
  | 'SUBJECT_TYPE_INDIVIDUAL'
  | 'SUBJECT_TYPE_ENTERPRISE'
  | 'SUBJECT_TYPE_GOVERNMENT'
  | 'SUBJECT_TYPE_INSTITUTIONS'
  | 'SUBJECT_TYPE_OTHERS'

export interface SubmitApplicationBusinessInfo {
  /** 商户简称 */
  merchant_shortname: string
  /** 客服电话 */
  service_phone: string
  /** 经营场景 */
  sales_info: {
    /** 经营场景类型 */
    sales_scenes_type: SalesScenesType[]
    /** 线下场所 */
    biz_store_info?: BizStoreInfo
    /** 公众号 */
    mp_info?: MpInfo
    /** 小程序 */
    mini_program_info?: MiniProgramInfo
    /** APP */
    app_info?: AppInfo
    /** Web */
    web_info?: WebInfo
    /** 企业微信 */
    wework_info?: WeworkInfo
  }
}

/** 经营场景类型 */
export type SalesScenesType =
  | 'SALES_SCENES_STORE'
  | 'SALES_SCENES_MP'
  | 'SALES_SCENES_MINI_PROGRAM'
  | 'SALES_SCENES_WEB'
  | 'SALES_SCENES_APP'
  | 'SALES_SCENES_WEWORK'

export interface BizStoreInfo {
  /** 线下场所名称 */
  biz_store_name: string
  /** 线下场所省市编码 */
  biz_address_code: string
  /** 线下场所地址 */
  biz_store_address: string
  /** 线下场所门头照片 */
  store_entrance_pic: string[]
  /** 线下场所内部照片 */
  indoor_pic: string[]
  /** 线下场所对应的商家AppID */
  biz_sub_appid?: string
}

export interface MpInfo {
  /** 服务商公众号AppID */
  mp_appid?: string
  /** 商家公众号AppID */
  mp_sub_appid?: string
  /** 公众号页面截图 */
  mp_pics: string[]
}

export interface MiniProgramInfo {
  /** 服务商小程序APPID */
  mini_program_appid?: string
  /** 商家小程序APPID */
  mini_program_sub_appid?: string
  /** 小程序截图 */
  mini_program_pics?: string[]
}

export interface AppInfo {
  /** 服务商应用APPID */
  app_appid?: string
  /** 商家应用APPID */
  app_sub_appid?: string
  /** APP截图 */
  app_pics: string[]
}

export interface WebInfo {
  /** 互联网网站域名 */
  domain: string
  /** 网站授权函 */
  web_authorisation?: string
  /** 互联网网站对应的商家APPID */
  web_appid?: string
}

export interface WeworkInfo {
  /** 商家企业微信CorpID */
  sub_corp_id: string
  /** 企业微信页面截图 */
  wework_pics: string[]
}

export interface SubmitApplicationSettlementInfo {
  /** 入驻结算规则ID */
  settlement_id: string
  /** 所属行业 */
  qualification_type: string
  /** 特殊资质图片 */
  qualifications?: string[]
  /** 优惠费率活动ID */
  activities_id?: string
  /** 优惠费率活动值 */
  activities_rate?: string
  /** 优惠费率活动补充材料 */
  activities_additions?: string[]
}

export interface SubmitApplicationBankAccountInfo {
  /** 账户类型 */
  bank_account_type: BankAccountType
  /** 开户名称 */
  account_name: string
  /** 开户银行 */
  account_bank: string
  /** 开户银行省市编码 */
  bank_address_code: string
  /** 开户银行联行号 */
  bank_branch_id?: string
  /** 开户银行全称（含支行） */
  bank_name?: string
  /** 银行账号 */
  account_number: string
}

export interface SubmitApplicationAdditionInfo {
  /** 法人开户承诺函 */
  legal_person_commitment?: string
  /** 法人开户意愿视频 */
  legal_person_video?: string
  /** 补充材料 */
  business_addition_pics?: string[]
  /** 补充说明 */
  business_addition_msg?: string
}
