import type { WechatPayV3Base } from '../../base'
import type {
  SubmitApplicationBody,
  SubmitApplicationsResult,
  QueryApplymentStateResult,
  ModifySettlementAccountBody,
  QuerySettlementAccountResult,
} from '../applyment/applyment.types'

/**
 * 子商户 (特约商户)
 */
export class Applyment {
  constructor(private base: WechatPayV3Base) {}

  /**
   * 提交申请单
   * @notAutoEncrypt <不自动加密>
   * @description 上传图片接口,this.uploadImage
   * @description 加密接口,this.publicEncryptObjectPaths 或者 this.privateEncrypt
   * @param body 请求主体,此接口及其复杂,提供得类型仅作参考,请参考官方文档
   * @doc https://pay.weixin.qq.com/wiki/doc/apiv3_partner/apis/chapter11_1_1.shtml
   */
  async submitApplications(body: SubmitApplicationBody) {
    const apiUrl = 'https://api.mch.weixin.qq.com/v3/applyment4sub/applyment/'
    const res = await this.base.request.post<SubmitApplicationsResult>(apiUrl, body, {
      headers: {
        'Wechatpay-Serial': this.base.certificates[0].serial_no,
      },
    })
    return res.data
  }

  /**
   * 查询申请单状态
   * @param businessCode 业务申请编号
   */
  async queryApplymentState(businessCode: string) {
    const apiUrl = `https://api.mch.weixin.qq.com/v3/applyment4sub/applyment/business_code/${businessCode}`
    const res = await this.base.request.get<QueryApplymentStateResult>(apiUrl)
    return res.data
  }

  /**
   * 修改结算账户
   * @param sub_mchid 子商户号 特殊规则：长度最小8个字节。
   * @param body 请求主体
   * @returns 是否成功
   */
  async modifySettlementAccount(sub_mchid: string, body: ModifySettlementAccountBody) {
    const apiUrl = `https://api.mch.weixin.qq.com/v3/apply4sub/sub_merchants/${sub_mchid}/modify-settlement`
    const res = await this.base.request.post(
      apiUrl,
      this.base.publicEncryptObjectPaths(body, ['account_name', 'account_number']),
    )
    return +res.status === 204
  }

  /**
   * 查询结算账号
   * @param sub_mchid 子商户号 特殊规则：长度最小8个字节。
   * @returns 结算账号信息
   */
  async querySettlementAccount(sub_mchid: string) {
    const apiUrl = `https://api.mch.weixin.qq.com/v3/apply4sub/sub_merchants/${sub_mchid}/settlement`
    const res = await this.base.request.get<QuerySettlementAccountResult>(apiUrl)
    return res.data
  }
}
