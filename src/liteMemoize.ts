import type { AnyFunction } from './types'

export function liteMemoize(
  callback: AnyFunction,
  options: { maxSize?: number } = {}
) {
  if (typeof callback !== 'function') {
    throw new Error('`callback` should be a function')
  }

  // if (resolver !== undefined && typeof resolver !== 'function') {
  //   throw new Error('`resolver` should be a function')
  // }

  const cache = new Map()
  // const cache = {} satisfies Record<string, any> as Record<string, any>

  function memoized(this: any, ...args: any[]) {
    // const args = Array.prototype.slice.call(arguments) // to simplify JSON.stringify
    const key: string = args.join()
    // const key: string = resolver ? resolver.apply(this, args) : JSON.stringify(args)

    if (!cache.size) {
      return cache.set(key, callback.apply(this, args)).get(key)
    }

    // if (node === undefined) {
    if (!cache.has(key)) {
      cache.set(key, callback.apply(this, args))
    }

    if (options.maxSize != null && cache.size > options.maxSize) {
      cache.delete(cache.keys().next().value)
    }
    return cache.get(key)

    // if (!(args in cache)) {
    //   cache[args] = callback.apply(this, args)
    // }

    // return cache[args]
  }

  memoized.cache = cache

  return memoized
  // return Object.assign(memoized, { cache })
}
