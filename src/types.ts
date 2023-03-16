import type { KeyObject } from 'crypto'

export interface UploadImageResult {
  media_id: string
}

/**
 * 加密证书对象
 */
export interface EncryptCertificate {
  /** ciphertext应用的加密算法 */
  algorithm: string
  /** 加密使用的随机串 */
  nonce: string
  /** 加密使用的附加数据 */
  associated_data: string
  /** 密文 */
  ciphertext: string
}

/**
 * 证书
 */
export interface Certificate {
  /** 证书序列号 */
  serial_no: string
  /** 证书有效期起始时间 */
  effective_time: string
  /** 证书有效期截止时间 */
  expire_time: string
  /** 加密后的证书 */
  encrypt_certificate: EncryptCertificate
}

/**
 * 附带解密后的证书
 */
export interface DecryptCertificates {
  /** 证书序列号 */
  serial_no: string
  /** 证书有效期起始时间 */
  effective_time: string
  /** 证书有效期截止时间 */
  expire_time: string
  /** 解密后的证书 */
  certificate: string
  /** 证书上的公钥 */
  publicKey: KeyObject
}

/**
 * 证书列表
 */
export type Certificates = Certificate[]
/**
 * 获取证书列表返回结果
 */
export type GetCertificatesResult = {
  data: Certificates
}
