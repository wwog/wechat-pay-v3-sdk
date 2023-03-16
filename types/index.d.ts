/// <reference types="node" />

import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { KeyObject } from 'crypto';

export declare interface AppInfo {
    /** 服务商应用APPID */
    app_appid?: string;
    /** 商家应用APPID */
    app_sub_appid?: string;
    /** APP截图 */
    app_pics: string[];
}

/**
 * 子商户 (特约商户)
 */
export declare class Applyment {
    private base;
    constructor(base: WechatPayV3Base);
    /**
     * 提交申请单
     * @notAutoEncrypt <不自动加密>
     * @description 上传图片接口,this.uploadImage
     * @description 加密接口,this.publicEncryptObjectPaths 或者 this.privateEncrypt
     * @param body 请求主体,此接口及其复杂,提供得类型仅作参考,请参考官方文档
     * @doc https://pay.weixin.qq.com/wiki/doc/apiv3_partner/apis/chapter11_1_1.shtml
     */
    submitApplications(body: SubmitApplicationBody): Promise<SubmitApplicationsResult>;
    /**
     * 查询申请单状态
     * @param businessCode 业务申请编号
     */
    queryApplymentState(businessCode: string): Promise<QueryApplymentStateResult>;
    /**
     * 修改结算账户
     * @param sub_mchid 子商户号 特殊规则：长度最小8个字节。
     * @param body 请求主体
     * @returns 是否成功
     */
    modifySettlementAccount(sub_mchid: string, body: ModifySettlementAccountBody): Promise<boolean>;
    /**
     * 查询结算账号
     * @param sub_mchid 子商户号 特殊规则：长度最小8个字节。
     * @returns 结算账号信息
     */
    querySettlementAccount(sub_mchid: string): Promise<QuerySettlementAccountResult>;
}

export declare type ApplymentState = 'APPLYMENT_STATE_EDITTING' | 'APPLYMENT_STATE_AUDITING' | 'APPLYMENT_STATE_REJECTED' | 'APPLYMENT_STATE_TO_BE_CONFIRMED' | 'APPLYMENT_STATE_TO_BE_SIGNED' | 'APPLYMENT_STATE_SIGNING' | 'APPLYMENT_STATE_FINISHED' | 'APPLYMENT_STATE_CANCELED';

export declare type BankAccountType = 'BANK_ACCOUNT_TYPE_CORPORATE' | 'BANK_ACCOUNT_TYPE_PERSONAL';

export declare interface BizStoreInfo {
    /** 线下场所名称 */
    biz_store_name: string;
    /** 线下场所省市编码 */
    biz_address_code: string;
    /** 线下场所地址 */
    biz_store_address: string;
    /** 线下场所门头照片 */
    store_entrance_pic: string[];
    /** 线下场所内部照片 */
    indoor_pic: string[];
    /** 线下场所对应的商家AppID */
    biz_sub_appid?: string;
}

export declare type CertificateType = 'CERTIFICATE_TYPE_2388' | 'CERTIFICATE_TYPE_2389' | 'CERTIFICATE_TYPE_2394' | 'CERTIFICATE_TYPE_2395' | 'CERTIFICATE_TYPE_2396' | 'CERTIFICATE_TYPE_2520' | 'CERTIFICATE_TYPE_2521' | 'CERTIFICATE_TYPE_2522' | 'CERTIFICATE_TYPE_2399' | 'CERTIFICATE_TYPE_2400';

export declare type ContactIdType = 'IDENTIFICATION_TYPE_IDCARD' | 'IDENTIFICATION_TYPE_PASSPORT' | 'IDENTIFICATION_TYPE_OTHERS';

export declare type ContactType = 'LEGAL' | 'SUPER';

export declare interface ContainerOptions extends WechatBaseOptions {
    /**
     * 是否使用单例模式
     * @default true
     */
    singleton?: boolean;
}

/**
 * 附带解密后的证书
 */
declare interface DecryptCertificates {
    /** 证书序列号 */
    serial_no: string;
    /** 证书有效期起始时间 */
    effective_time: string;
    /** 证书有效期截止时间 */
    expire_time: string;
    /** 解密后的证书 */
    certificate: string;
    /** 证书上的公钥 */
    publicKey: KeyObject;
}

declare function decryptToString_AES(options: {
    ciphertext: string;
    key: string;
    nonce: string;
    associated_data: string;
}): string;

/**
 * 解密
 */
/**
 * 敏感信息加密
 * @param data 待加密数据
 */
declare function encrypt(data: string, key: KeyObject): string;

/**
 * 文件摘要
 * @param buffer
 * @description 对文件的二进制内容进行sha256计算得到的值
 */
declare function fileSha256(buffer: Buffer): string;

/** 金融机构类型 */
export declare type FinanceType = 'BANK_AGENT' | 'PAYMENT_AGENT' | 'INSURANCE' | 'TRADE_AND_SETTLE' | 'OTHER';

/**
 * 获取证书公钥
 */
declare function getCertificatePublicKey(certString: string): KeyObject;

/**
 * 获取证书序列号
 * @param buf
 * @returns
 */
declare function getCertificateSerialNo(buf: Buffer): string;

/**
 * 查看当前内存中的实例
 */
export declare function getInstances(): {
    baseInstanceMap: Map<string, WechatPayV3Base>;
    useInstanceMap: Map<string, any>;
};

/**
 * 获取对象路径值
 * @example
 * const obj = {a: {b: {c: 1}},aa:{bb:{cc:{dd:2}}}}}}};
 * getPathValue(obj, 'a.b.c') // 1
 * getPathValue(obj, 'a.b.d') // undefined
 * getPathValue(obj, 'aa.bb.cc.dd') // 2
 */
declare function getPathValue<T>(obj: Record<string, any>, path: string): T;

declare function getPublicKey(certString: string): KeyObject;

/**
 * 获取系统临时目录
 * @returns
 */
declare function getSysTmpDir(): string;

/**
 * 构造签名信息
 * @param mchid 商户号
 * @param serial_no 商户证书序列号
 * @param nonce_str 随机字符串
 * @param timestamp 时间戳
 * @param signature 签名(buildMessage生成)
 */
declare function getToken(mchid: string, serial_no: string, nonce_str: string, timestamp: string, signature: string): string;

export declare type IdCardInfo = {
    /** 身份证人像面照片 */
    id_card_copy: string;
    /** 身份证国徽面照片 */
    id_card_national: string;
    /** 身份证姓名 */
    id_card_name: string;
    /** 身份证号码 */
    id_card_number: string;
    /** 身份证居住地址 */
    id_card_address?: string;
    /** 身份证有效期开始时间 */
    card_period_begin: string;
    /** 身份证有效期结束时间 */
    card_period_end: string;
};

export declare interface IdDocInfo {
    /** 证件正面照片 */
    id_doc_copy: string;
    /** 证件反面照片 */
    id_doc_copy_back?: string;
    /** 证件姓名 */
    id_doc_name: string;
    /** 证件号码 */
    id_doc_number: string;
    /** 证件居住地址 */
    id_doc_address?: string;
    /** 证件有效期开始时间 */
    doc_period_begin: string;
    /** 证件有效期结束时间 */
    doc_period_end: string;
}

export declare type IdDocType = 'IDENTIFICATION_TYPE_IDCARD' | 'IDENTIFICATION_TYPE_OVERSEA_PASSPORT' | 'IDENTIFICATION_TYPE_HONGKONG_PASSPORT' | 'IDENTIFICATION_TYPE_MACAO_PASSPORT' | 'IDENTIFICATION_TYPE_TAIWAN_PASSPORT' | 'IDENTIFICATION_TYPE_FOREIGN_RESIDENT' | 'IDENTIFICATION_TYPE_HONGKONG_MACAO_RESIDENT' | 'IDENTIFICATION_TYPE_TAIWAN_RESIDENT';

export declare type IdHolderType = 'LEGAL' | 'SUPER';

declare function isUrl(url: string): boolean;

export declare interface MiniProgramInfo {
    /** 服务商小程序APPID */
    mini_program_appid?: string;
    /** 商家小程序APPID */
    mini_program_sub_appid?: string;
    /** 小程序截图 */
    mini_program_pics?: string[];
}

export declare interface ModifySettlementAccountBody {
    /** 账户类型 */
    account_type: 'ACCOUNT_TYPE_BUSINESS' | 'ACCOUNT_TYPE_PRIVATE';
    /** 开户名称 */
    account_name?: string;
    /** 开户银行 */
    account_bank: string;
    /** 开户银行省市编码 */
    bank_address_code: string;
    /** 开户银行全称（含支行）  */
    bank_name?: string;
    /** 开户银行联行号  */
    bank_branch_id?: string;
    /** 银行账号 */
    account_number: string;
}

export declare interface MpInfo {
    /** 服务商公众号AppID */
    mp_appid?: string;
    /** 商家公众号AppID */
    mp_sub_appid?: string;
    /** 公众号页面截图 */
    mp_pics: string[];
}

/**
 * 路径取文件名
 * @param path
 * @description 适应于windows和linux
 */
declare function path2FileName(path: string): string;

export declare interface QueryApplymentStateResult {
    /** 微信支付申请单号 */
    applyment_id: string;
    /** 业务申请编号 */
    business_code: string;
    /** 特约商户号,当申请单状态为APPLYMENT_STATE_FINISHED时才返回*/
    sub_mchid?: string;
    /** 超管签约链接,状态为APPLYMENT_STATE_TO_BE_SIGNED才返回 */
    sign_url?: string;
    /** 申请单状态 */
    applyment_state: ApplymentState;
    /** 申请单状态描述 */
    applyment_state_msg: string;
    /** 审核情况，当申请状态为APPLYMENT_STATE_REJECTED时才返回 */
    audit_detail?: {
        /** 字段名:例如:id_card_copy */
        field: string;
        /** 字段名描述:例如:身份证人像面 */
        field_name: string;
        /** 驳回原因 */
        reject_reason: string;
    }[];
}

export declare interface QuerySettlementAccountResult {
    /** 账户类型 */
    account_type: 'ACCOUNT_TYPE_BUSINESS' | 'ACCOUNT_TYPE_PRIVATE';
    /** 开户银行 */
    account_bank: string;
    /** 开户银行全称（含支行） */
    bank_name?: string;
    /** 开户银行联行号 */
    bank_branch_id?: string;
    /** 银行账号 */
    account_number: string;
    /** 汇款验证结果 */
    verify_result: 'VERIFYING' | 'VERIFY_SUCCESS' | 'VERIFY_FAIL';
    /** 汇款验证失败原因 */
    verify_fail_reason?: string;
}

/**
 * 随机字符串
 * @param length
 * @returns
 */
declare function randomStr(length?: number): string;

/** 经营场景类型 */
export declare type SalesScenesType = 'SALES_SCENES_STORE' | 'SALES_SCENES_MP' | 'SALES_SCENES_MINI_PROGRAM' | 'SALES_SCENES_WEB' | 'SALES_SCENES_APP' | 'SALES_SCENES_WEWORK';

/**
 * 设置对象路径值
 * @description
 * 1. 如果路径不存在则静默跳过, onSetFail() 会被调用
 * 2. 如果路径存在则设置值
 */
declare function setPathValue(obj: Record<string, any>, path: string, value: any, options?: {
    onSetFail?: (failPath: string) => void;
}): Record<string, any>;

/** 主体类型 */
export declare type SubjectType = 'SUBJECT_TYPE_INDIVIDUAL' | 'SUBJECT_TYPE_ENTERPRISE' | 'SUBJECT_TYPE_GOVERNMENT' | 'SUBJECT_TYPE_INSTITUTIONS' | 'SUBJECT_TYPE_OTHERS';

export declare interface SubmitApplicationAdditionInfo {
    /** 法人开户承诺函 */
    legal_person_commitment?: string;
    /** 法人开户意愿视频 */
    legal_person_video?: string;
    /** 补充材料 */
    business_addition_pics?: string[];
    /** 补充说明 */
    business_addition_msg?: string;
}

export declare interface SubmitApplicationBankAccountInfo {
    /** 账户类型 */
    bank_account_type: BankAccountType;
    /** 开户名称 */
    account_name: string;
    /** 开户银行 */
    account_bank: string;
    /** 开户银行省市编码 */
    bank_address_code: string;
    /** 开户银行联行号 */
    bank_branch_id?: string;
    /** 开户银行全称（含支行） */
    bank_name?: string;
    /** 银行账号 */
    account_number: string;
}

export declare interface SubmitApplicationBody {
    /** 业务申请编号 */
    business_code: string;
    /** 超级管理员信息 */
    contact_info: SubmitApplicationContactInfo;
    /** 主体资料 */
    subject_info: SubmitApplicationSubjectInfo;
    /** 经营资料 */
    business_info: SubmitApplicationBusinessInfo;
    /** 结算规则 */
    settlement_info: SubmitApplicationSettlementInfo;
    /** 结算银行账户 */
    bank_account_info: SubmitApplicationBankAccountInfo;
    /** 补充材料 */
    addition_info?: SubmitApplicationAdditionInfo;
}

export declare interface SubmitApplicationBusinessInfo {
    /** 商户简称 */
    merchant_shortname: string;
    /** 客服电话 */
    service_phone: string;
    /** 经营场景 */
    sales_info: {
        /** 经营场景类型 */
        sales_scenes_type: SalesScenesType[];
        /** 线下场所 */
        biz_store_info?: BizStoreInfo;
        /** 公众号 */
        mp_info?: MpInfo;
        /** 小程序 */
        mini_program_info?: MiniProgramInfo;
        /** APP */
        app_info?: AppInfo;
        /** Web */
        web_info?: WebInfo;
        /** 企业微信 */
        wework_info?: WeworkInfo;
    };
}

export declare interface SubmitApplicationBusinessLicenseInfo {
    /** 营业执照照片 */
    license_copy: string;
    /** 注册号/统一社会信用代码 */
    license_number: string;
    /** 商户名称 */
    merchant_name: string;
    /** 个体户经营者/法人姓名 */
    legal_person: string;
    /** 注册地址 */
    license_address?: string;
    /** 有效期限开始日期 */
    period_begin?: string;
    /** 有效期限结束日期 */
    period_end?: string;
}

export declare interface SubmitApplicationCertificateInfo {
    /** 登记证书照片 */
    cert_copy: string;
    /** 登记证书类型 */
    cert_type: CertificateType;
    /** 证书号 */
    cert_number: string;
    /** 商户名称 */
    merchant_name: string;
    /** 注册地址 */
    company_address: string;
    /** 法定代表人 */
    legal_person: string;
    /** 有效期限开始日期 */
    period_begin: string;
    /** 有效期限结束日期 */
    period_end: string;
}

export declare interface SubmitApplicationContactInfo {
    /** 超级管理员类型 */
    contact_type: ContactType;
    /** 超级管理员姓名 */
    contact_name: string;
    /** 超级管理员证件类型 */
    contact_id_type?: ContactIdType;
    /** 超级管理员证件号码 */
    contact_id_number?: string;
    /** 超级管理员证件照片 */
    contact_id_doc_copy?: string;
    /** 超级管理员证件反面照片 */
    contact_id_doc_copy_back?: string;
    /** 超级管理员证件有效期开始时间 */
    contact_period_begin?: string;
    /** 超级管理员证件有效期结束时间 */
    contact_period_end?: string;
    /** 业务办理授权函 */
    business_authorization_letter?: string;
    /** 超级管理员微信OpenID */
    openid?: string;
    /** 联系手机 */
    mobile_phone: string;
    /** 联系邮箱 */
    contact_email: string;
}

export declare interface SubmitApplicationFinanceInstitutionInfo {
    /** 金融机构类型 */
    finance_type: FinanceType;
    /** 金融机构许可证图片 */
    finance_license_pics: string[];
}

export declare interface SubmitApplicationIdentityInfo {
    /** 证件持有人类型 */
    id_holder_type?: IdHolderType;
    /** 证件类型 */
    id_doc_type?: IdDocType;
    /** 法定代表人说明函 */
    authorize_letter_copy?: string;
    /** 身份证信息 */
    id_card_info?: IdCardInfo;
    /** 其他类型证件信息 */
    id_doc_info?: IdDocInfo;
    /** 经营者/法人是否为受益人 */
    owner?: boolean;
}

export declare interface SubmitApplicationSettlementInfo {
    /** 入驻结算规则ID */
    settlement_id: string;
    /** 所属行业 */
    qualification_type: string;
    /** 特殊资质图片 */
    qualifications?: string[];
    /** 优惠费率活动ID */
    activities_id?: string;
    /** 优惠费率活动值 */
    activities_rate?: string;
    /** 优惠费率活动补充材料 */
    activities_additions?: string[];
}

export declare interface SubmitApplicationsResult {
    applyment_id: string;
}

export declare interface SubmitApplicationSubjectInfo {
    /** 主体类型 */
    subject_type: SubjectType;
    /** 是否是金融机构 */
    finance_institution?: boolean;
    /** 营业执照 */
    business_license_info?: SubmitApplicationBusinessLicenseInfo;
    /** 登记证书 */
    certificate_info?: SubmitApplicationCertificateInfo;
    /** 单位证明函照片 */
    certificate_letter_copy?: string;
    /** 金融机构许可证信息 */
    finance_institution_info?: SubmitApplicationFinanceInstitutionInfo;
    /** 经营者/法人身份证件 */
    identity_info: SubmitApplicationIdentityInfo;
    /** 最终受益人信息列表(UBO) */
    ubo_info_list?: SubmitApplicationUboInfo[];
}

/**
 *  UBO信息 估计用的不多,就any了。
 *  https://pay.weixin.qq.com/wiki/doc/apiv3_partner/apis/chapter11_1_1.shtml
 */
export declare type SubmitApplicationUboInfo = any;

/**
 * 返回当前时间戳
 * @returns
 */
declare function unixTimeStamp(): string;

/**
 * 排除域名中Origin 例如:http://www.a.com/v3/2?a=2 结果为/v3/2?a=2
 * @param url
 * @returns
 */
declare function urlExclueOrigin(url: string): string;

declare namespace utils {
    export {
        urlExclueOrigin,
        unixTimeStamp,
        randomStr,
        path2FileName,
        fileSha256,
        getCertificateSerialNo,
        getCertificatePublicKey,
        encrypt,
        getToken,
        decryptToString_AES,
        getPublicKey,
        isUrl,
        getSysTmpDir,
        getPathValue,
        setPathValue
    }
}
export { utils }

export declare interface WebInfo {
    /** 互联网网站域名 */
    domain: string;
    /** 网站授权函 */
    web_authorisation?: string;
    /** 互联网网站对应的商家APPID */
    web_appid?: string;
}

export declare interface WechatBaseEventOPtions {
    /**
     * 在请求前触发,可以在此处修改请求配置.
     * @description 签名生成在onRequsetBefore之后,此处无法获取到签名
     * @param config 请求的配置
     */
    onRequsetBefore?: (config: InternalAxiosRequestConfig<any>) => void;
    /**
     * 在请求后触发
     * @description 签名生成在onRequsetAfter之前,此处可以获取到签名并修改
     * @param config 请求的配置
     */
    onRequsetAfter?: (config: InternalAxiosRequestConfig<any>) => void;
    /**
     * 在请求成功后触发
     */
    onResponse?: (result: any) => void;
}

export declare interface WechatBaseOptions {
    /**
     * 商户号
     */
    mchid: string;
    /**
     * pem证书
     */
    apiclient_cret: Buffer;
    /**
     * pem私钥
     */
    apiclient_key: Buffer;
    /**
     * apiV3密钥
     */
    apiV3Key: string;
    /**
     * header中的User-Agent
     */
    userAgent?: string;
    /**
     * 自动更新平台证书
     * @default true
     * @description 本库的做法,更偏向于惰性更新,缓存证书并记录过期时间,在每次请求时,比对时间进行更新(简单的时间比对于性能没有啥影响)。
     * @description 如果你需要自己管控,可以关闭此选项,调用updateCertificates(true)方法强制更新实例上的证书
     */
    autoUpdateCertificates?: boolean;
    /**
     * 下载文件文件夹
     * @default [systemTempDir]/wxpay-v3-downloads
     * @description 让部分接口更加方便,例如上传文件给微信接口只能从本地上传
     * @description 需要注意的是,sdk并不会保存此文件,于对应功能完毕后,会自动删除此文件
     */
    downloadDir?: string;
}

/**
 * 实例化Api的容器,默认单例
 * @param options Base的配置
 * @param events Base的事件
 * @returns
 */
export declare function wechatpayV3(options: ContainerOptions, events?: WechatBaseEventOPtions): {
    use: <T extends new (base: WechatPayV3Base) => any>(ApiClass: T) => any;
    base: WechatPayV3Base;
};

/** 微信支付v3 */
export declare class WechatPayV3Base {
    private events;
    /** pem私钥 */
    readonly privateKey: Buffer;
    /** 加密算法,固定值'WECHATPAY2-SHA256-RSA2048'.国密暂不支持 */
    readonly schema = "WECHATPAY2-SHA256-RSA2048";
    /** axios请求示例 */
    readonly request: axios.AxiosInstance;
    /** 商户号 */
    readonly mchid: string;
    /** header -> userAgent (微信可能会拒绝不带userAgent的请求) */
    readonly userAgent: string;
    /** apiV3密钥 */
    readonly apiV3Key: string;
    /** 平台证书列表 */
    certificates: DecryptCertificates[];
    /** 更新证书时间+12小时后的结果,注意此时间并非平台证书本身的过期时间,而是需要更新的时间 */
    certExpiresTime?: Date;
    /** 商户Api证书序列号 */
    readonly apiCretSerialNo: string;
    /** 下载文件文件夹 */
    readonly downloadDir: string;
    constructor(options: WechatBaseOptions, events?: WechatBaseEventOPtions);
    /**
     * 初始化
     */
    private init;
    /**
     * 更新平台证书
     * @description 会判断缓存是否过期,如果过期则更新,否则不更新.
     * @param forceUpdate 强制更新
     */
    updateCertificates(forceUpdate?: boolean): Promise<void>;
    /**
     * 构造签名串并签名
     * @param method 请求方法
     * @param url 请求URL
     * @param timestamp 时间戳
     * @param nonce 随机字符串
     * @param body 请求主体
     */
    protected buildMessageSign(method: string, url: string, timestamp: string, nonce: string, body: string | object): string;
    /**
     * 构造Authorization
     * @param nonce_str 随机字符串
     * @param timestamp 时间戳
     * @param signature 签名(buildMessage生成)
     */
    protected getAuthorization(nonce_str: string, timestamp: string, signature: string): string;
    /**
     * 私钥签名
     * @param data 待签名数据
     * @returns
     */
    protected sha256WithRSA(data: string): string;
    /**
     * 解密平台响应
     * @param nonce 随机字符串
     * @param associated_data 附加数据
     * @param ciphertext  密文
     * @returns
     */
    protected aesGcmDecrypt(options: {
        ciphertext: string;
        nonce: string;
        associated_data: string;
    }): string;
    /**
     * 平台证书公钥加密,如果需要同时加密多个字段,请使用publicEncryptObjectPaths
     * @param data 待加密数据
     * @returns
     */
    publicEncrypt(data: string): string;
    /**
     * 平台证书公钥加密请求主体中指定的字段
     * @description 对字符串类型的路径进行加密
     * @param data 数据
     * @param paths 路径数组
     * @returns 该函数返回一个新的对象,不会修改原对象
     * @example
     * const data = { name: '张三' , idCard: {
     *    number:string //如果这个字段需要加密
     * }}
     * const newData = publicEncryptObjectPaths(data,['idCard.number'])
     */
    publicEncryptObjectPaths<T extends Record<string, any>>(data: T, paths: string[]): any;
    /**
     * 下载文件
     * @param url
     * @param fileName 提供文件名,包括后缀。如果不提供,则从url中获取文件名
     * @returns
     */
    downloadFile(url: string, fileName?: string): Promise<{
        filePath: string;
        fileName: string;
    }>;
    /**
     * 获取证书
     * @description 获取商户当前可用的平台证书列表。
     * @docUrl https://pay.weixin.qq.com/wiki/doc/apiv3_partner/apis/wechatpay5_1.shtml
     */
    getCertificates(): Promise<DecryptCertificates[]>;
    private _upload;
    /**
     * 图片上传
     * @maxSize 2M
     * @param pathOrUrl 图片路径可以是本地路径,也可以是网络路径
     * @param fileName 商户上传的媒体图片的名称，商户自定义，必须以jpg、bmp、png为后缀,不区分大小写。
     * @description 部分微信支付业务指定商户需要使用图片上传 API来上报图片信息，从而获得必传参数的值：图片MediaID 。
     * @docUrl https://pay.weixin.qq.com/wiki/doc/apiv3_partner/apis/chapter2_1_1.shtml
     */
    uploadImage(pathOrUrl: string, fileName?: string): Promise<string>;
    /**
     * 视频上传
     * @maxSize 5M
     * @param pathOrUrl 视频路径可以是本地路径,也可以是网络路径
     * @param fileName 商户上传的媒体视频的名称，商户自定义，必须以avi、wmv、mpeg、mp4、mov、mkv、flv、f4v、m4v、rmvb为后缀,不区分大小写。
     * @description 部分微信支付业务指定商户需要使用视频上传 API来上报视频信息，从而获得必传参数的值：视频MediaID 。
     * @docUrl https://pay.weixin.qq.com/wiki/doc/apiv3_partner/apis/chapter2_1_2.shtml
     */
    uploadVideo(pathOrUrl: string, fileName?: string): Promise<string>;
}

export declare interface WeworkInfo {
    /** 商家企业微信CorpID */
    sub_corp_id: string;
    /** 企业微信页面截图 */
    wework_pics: string[];
}

export { }
