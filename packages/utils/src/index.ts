import type { AsyncLocalStorage } from 'async_hooks'
declare global {
  interface Window {
    cancelVideoLimit: {
      startExec: (...args: any[]) => void
      exec: (...args: any[]) => void
    }
  }

}
export const baiduPanVideoCancelLimit = () => {
  const defaultWindow = typeof window === 'undefined' ? undefined : window
  if (defaultWindow) {
    defaultWindow.cancelVideoLimit = (() => {
      const firstElm = document.querySelector<HTMLElement>('#video-wrap')
      const errorReturn = {
        startExec: () => {
          console.log('未找到 #video-wrap')
        },
        exec: () => {
          console.log('未找到 #video-wrap')
        }
      }
      if (!firstElm) {
        return errorReturn
      }
      firstElm.style.cssText += `display: flex;flex-direction: column;`
      const secElm = document.querySelector<HTMLElement>('#video-root')
      if (!secElm) {
        return errorReturn
      }
      secElm.style.cssText += `flex: 1; min-height: 100%; width: 100%; display: flex; flex-direction: column;`
      console.log('------------------------------------------------\n')
      console.log('请在 #video-root 的 shadow-root 下找到 class="werbung-video" 的元素并作为参数1传入 window.cancelVideoLimit.exec ')
      console.log('请在 #video-root 的 shadow-root 下找到 id="video-wrapper" 的元素并作为参数2传入 window.cancelVideoLimit.exec ')
      console.log('请在 #video-root 的 shadow-root 下找到 id="video-player" 的元素并作为参数3传入 window.cancelVideoLimit.exec ')
      console.log('请在 #video-root 的 shadow-root 下找到 id="video-player" 的元素并作为参数3传入 window.cancelVideoLimit.exec ')
      console.log('请在 #video-root 的 shadow-root 下找到 <canvas> 元素并作为参数4传入 window.cancelVideoLimit.exec ')
      console.log('或者在 element panel 上倒序点击上述元素后，执行 window.cancelVideoLimit.startExec() ')
      console.log('------------------------------------------------\n')

      const exec = (elm1, elm2, elm3, elm4) => {
        if (!elm1) {
          throw Error('请在 #video-root 的 shadow-root 下找到 class="werbung-video" 的元素并传入')
        }
        elm1.style.cssText += `flex: 1; min-height: 100%; width: 100%; display: flex; flex-direction: column;`
        if (!elm2) {
          throw Error('请在 #video-root 的 shadow-root 下找到 id="video-wrapper" 的元素并传入')
        }
        elm2.style.cssText += `height: 100%; width: 100%; flex: 1;`
        if (!elm3) {
          throw Error('请在 #video-root 的 shadow-root 下找到 id="video-player" 的元素并传入')
        }
        elm3.style.cssText += `width: 100%;height: 100%;`
        if (!elm4) {
          throw Error('请在 #video-root 的 shadow-root 下找到 <canvas> 的元素并传入')
        }
        elm4.style.cssText += `width: 100%;height: 100%;`
      }
      return {
        startExec() {
          const a = (window as any).$0
          const b = (window as any).$1
          const c = (window as any).$2
          const d = (window as any).$3
          exec(a, b, c, d)
        },
        exec
      }
    })()
    console.log('请手动查看 window.cancelVideoLimit ')
  } else {
    console.log('未处于浏览器环境中, 跳过')
  }
}

export const kgp3UtilsSingleAsyncLocalStorageSymbol =
  '__kgp3_utils_single_async_localStorage_symbol__'

/**
 * ```ts
 *
 * const { AsyncLocalStorage } = require("async_hooks")
 *
 * const asyncLocalStorage = createGlobalAsyncLocalStorage(AsyncLocalStorage)
 *
 * asyncLocalStorage.run({}, () => {
 *   const singleVar = getSingle(() => ({ a: 1 }), { client: 'ssr', key: 'a' })
 * })
 * ```
 *
 * @param storage
 * @returns
 */
export const createGlobalAsyncLocalStorage = <T>(
  storage: typeof AsyncLocalStorage
): typeof AsyncLocalStorage<T> => {
  return (
    global[kgp3UtilsSingleAsyncLocalStorageSymbol] ||
    (global[kgp3UtilsSingleAsyncLocalStorageSymbol] = new storage())
  )
}

export type InSsrSingleType = { client: 'ssr'; globalStoreName?: string; key: string }
export type InBrowserSingleType = { client: 'browser' }
export type GetSingleOptType = InSsrSingleType | InBrowserSingleType

/**
 * SSR 环境下:
 *```ts
 * const { AsyncLocalStorage } = require("async_hooks")
 *
 * const asyncLocalStorage = createGlobalAsyncLocalStorage(AsyncLocalStorage)
 *
 * asyncLocalStorage.run({}, () => {
 *   const singleVar = getSingle(() => ({ a: 1 }), { client: 'ssr', key: 'a' })
 * })
 * ```
 *
 * 浏览器环境下:
 * ```ts
 * const singleVar = getSingle(() => ({ a: 1 }))
 * ```
 */
export const getSingle = function <
  T extends Record<string, any> | ((...args: any[]) => any),
  U extends any[]
>(fn: (...args: U) => T, opt: GetSingleOptType = { client: 'browser' }) {
  let result: T

  if (opt.client === 'browser') {
    return function <V extends string>(
      this: unknown,
      ...args: V extends 'init' ? U : any[]
    ) {
      return result || (result = fn.apply(this, args as U))
    }
  } else if (opt.client === 'ssr') {
    type LocalStorageInstanceType = InstanceType<
      typeof AsyncLocalStorage<{
        [key: string]: T
      }>
    >
    const globalStoreName = opt.globalStoreName || kgp3UtilsSingleAsyncLocalStorageSymbol
    const getGlobalAsyncStorage: () => LocalStorageInstanceType | void = () =>
      (global as any)[globalStoreName]
    const getCurrentStore = () => {
      const globalAsyncStorage = getGlobalAsyncStorage()
      if (!globalAsyncStorage) {
        throw Error(
          `没有在 global 上找到名为 ${globalStoreName} 的 store，请确保已经设置该 ${globalStoreName} 全局变量`
        )
      }
      const currentStore = globalAsyncStorage.getStore()
      if (!currentStore) {
        throw Error(
          `${globalStoreName} 无法 getStore，请不要使用异步逻辑或考虑将相关逻辑放入 setTimeout 中执行`
        )
      }
      return currentStore
    }
    const getResult = () => getCurrentStore()[opt.key]
    const setResult = (val: T) => {
      getCurrentStore()[opt.key] = val
      return val
    }
    return function <V extends string>(
      this: unknown,
      ...args: V extends 'init' ? U : any[]
    ) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this
      const proxyRes = fn.apply(that, args as U)
      return new Proxy<T>(proxyRes, {
        apply(_t, thisArg, argumentList) {
          let result = getResult()
          if (!result) {
            result = setResult(fn.apply(that, args as U))
          }
          return result.apply(thisArg, argumentList)
        },
        get(_t, prop, receiver) {
          let result = getResult()
          if (!result) {
            result = setResult(fn.apply(that, args as U))
          }
          const targetProp = Reflect.get(result, prop, receiver)
          if (typeof targetProp === 'function') {
            return targetProp.bind(result)
          }
          return targetProp
        }
      })
    }
  } else {
    throw Error('getSingle 传入 client 必须为 browser 或 ssr')
  }
}