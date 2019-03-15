import { isDefined } from './is'
import get from './get'

export const isBrowserEnv = (): boolean => {
  // @ts-ignore
  if (!isDefined(process)) return true
  // @ts-ignore
  return get(process, 'browser') === true
}

export const isNodeEnv = (): boolean => !isBrowserEnv()

export const isBeaconEnv = (): boolean => {
  // @ts-ignore
  if (!isDefined(process)) return true
  // @ts-ignore
  return get(process, 'env.BEACON_ENV', false)
}
