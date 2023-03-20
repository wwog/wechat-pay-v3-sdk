export type { ContainerOptions, WechatBaseEventOPtions, WechatBaseOptions } from './base'
export { getInstances, WechatPayV3Base } from './base'
export { Applyment } from './apis/applyment/applyment'
export { JSAPI } from './apis/basePay/JSAPI'

export * as utils from './utils'
import { apiContainer } from './base'
export { apiContainer }
export default apiContainer
