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

type InSsrSingleType = { ssr: boolean, globalStoreName?: string, key: string }
type InBrowserSingleType = {}
type GetSingleOptType = InSsrSingleType | InBrowserSingleType


const isSsrOpt = (x: any): x is InSsrSingleType => {
  return x.ssr
}

export const getSingle = function <
  T extends Record<string, any>,
  U extends any[]
>(fn: (...args: U) => T, opt: GetSingleOptType = {}) {
  let result: T
  if (!isSsrOpt(opt)) {
    return function <V extends string>(
      this: unknown,
      ...args: V extends 'init' ? U : any[]
    ) {
      return result || (result = fn.apply(this, args as U))
    }
  } else {
    return function <V extends string>(this: unknown, ...args: V extends 'init' ? U : any[]) {
      return new Proxy({}, {
        get(t, prop) {
          type LocalStorageInstanceType = InstanceType<typeof AsyncLocalStorage<{
            [key: string]: T
          }>>
          const globalStoreName = opt.globalStoreName || '__custom_lb_utils_asyncLocalStorage__'
          const globalAsyncStorage: LocalStorageInstanceType | void = (global as any)[globalStoreName]
          if (!globalAsyncStorage) {
            throw Error(`没有在 global 上找到名为 ${globalStoreName} 的 store，请确保已经设置该 ${globalStoreName} 全局变量`)
          }
          const currentStore = globalAsyncStorage.getStore()
          if (!currentStore) {
            throw Error(`${globalStoreName} 无法 getStore，请不要使用异步逻辑或考虑将相关逻辑放入 setTimeout 中执行`)
          }
          const getResult = () => currentStore[opt.key]
          const setResult = (val: T) => {
            currentStore[opt.key] = val
            return val
          }
          let result = getResult()
          if (!result) {
            result = setResult(fn.apply(this, args as U))
          }
          return result[prop as string]
        }
      })
    }
  }
}

