import { createSelectorCreator, liteMemoize, lruMemoize } from 'reselect'
import type { RootState } from './testUtils'
import { localTest } from './testUtils'

describe(liteMemoize, () => {
  const createAppSelector = createSelectorCreator({
    memoize: liteMemoize,
    argsMemoize: liteMemoize
  }).withTypes<RootState>()

  localTest('cache hit', ({ state, store }) => {
    const selector = createAppSelector([state => state.todos], todos =>
      todos.map(({ id }) => id)
    )

    const start = performance.now()

    for (let i = 0; i < 1_000_000; i++) {
      selector(state)
    }
    const end = performance.now() - start
    console.log(end)

    expect(selector(state)).toBe(selector.lastResult())

    expect.soft(end).toBeLessThan(500)

    expect.soft(selector.dependencyRecomputations()).toBe(1)

    expect(selector.recomputations()).toBe(1)
  })

  localTest('cache hit and miss', ({ state, store }) => {
    const selector = createAppSelector(
      [state => state.todos, (state, id: number) => id],
      (todos, id) => todos.filter(todo => todo.id === id)
    )

    const start = performance.now()

    for (let i = 0; i < 100_000; i++) {
      selector(state, i)
    }
    const end = performance.now() - start
    console.log(end)

    expect(selector(state, 100_000)).toBe(selector.lastResult())

    selector(state, 1)

    expect.soft(end).toBeLessThan(3000)

    expect.soft(selector.dependencyRecomputations()).toBe(100_001)

    expect(selector.recomputations()).toBe(100_001)
  })

  localTest('with MaxSize', ({ state, store }) => {
    const selector = createAppSelector(
      [state => state.todos, (state, id: number) => id],
      (todos, id) => todos.filter(todo => todo.id === id),
      {
        argsMemoizeOptions: { maxSize: 10 },
        memoizeOptions: { maxSize: 10 }
      }
    )

    const start = performance.now()

    for (let i = 0; i < 100; i++) {
      selector(state, i)
    }
    const end = performance.now() - start
    console.log(end)

    expect(selector(state, 100)).toBe(selector.lastResult())

    selector(state, 1)

    expect.soft(end).toBeLessThan(500)

    expect.soft(selector.dependencyRecomputations()).toBe(102)

    expect(selector.recomputations()).toBe(102)

    console.log(selector.memoizedResultFunc.cache.size)
  })

  localTest('with MaxSize compare with lruMemoize', ({ state, store }) => {
    const selector = createAppSelector(
      [state => state.todos, (state, id: number) => id],
      (todos, id) => todos.filter(todo => todo.id === id),
      {
        memoize: lruMemoize,
        argsMemoize: lruMemoize,
        argsMemoizeOptions: { maxSize: 10 },
        memoizeOptions: { maxSize: 10 }
      }
    )

    const start = performance.now()

    for (let i = 0; i < 100; i++) {
      selector(state, i)
    }
    const end = performance.now() - start
    console.log(end)

    expect(selector(state, 100)).toBe(selector.lastResult())

    selector(state, 1)

    expect.soft(end).toBeLessThan(500)

    expect.soft(selector.dependencyRecomputations()).toBe(102)

    expect(selector.recomputations()).toBe(102)
  })

  localTest('cache hit compare with lruMemoize', ({ state, store }) => {
    const selector = createAppSelector(
      [state => state.todos],
      todos => todos.map(({ id }) => id),
      {
        argsMemoize: lruMemoize,
        memoize: lruMemoize
      }
    )

    const start = performance.now()

    for (let i = 0; i < 1_000_000; i++) {
      selector(state)
    }
    const end = performance.now() - start
    console.log(end)

    expect(end).toBeLessThan(500)
  })

  localTest(
    'cache hit and miss compare with lruMemoize',
    ({ state, store }) => {
      const selector = createAppSelector(
        [state => state.todos, (state, id: number) => id],
        (todos, id) => todos.filter(todo => todo.id === id),
        {
          argsMemoize: lruMemoize,
          memoize: lruMemoize
        }
      )

      const start = performance.now()

      for (let i = 0; i < 100_000; i++) {
        selector(state, i)
      }
      const end = performance.now() - start
      console.log(end)

      expect(selector(state, 100_000)).toBe(selector.lastResult())

      selector(state, 1)

      expect.soft(end).toBeLessThan(1000)

      expect.soft(selector.dependencyRecomputations()).toBe(100_002)

      expect(selector.recomputations()).toBe(100_002)
    }
  )
})
