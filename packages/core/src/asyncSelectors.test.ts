import { asyncReducer } from "./asyncReducer"
import {
  asyncJobByIdSelector,
  createLatestOrEarliestAsyncJobByNameSelector,
} from "./asyncSelectors"
import { AsyncMeta, AsyncStatus } from "./asyncTypes"

const name = `SEARCH_GOOGLE`
const name2 = `SEARCH_DUCKDUCKGO`
const a: AsyncMeta<typeof name, Error> = {
  id: `A`,
  status: AsyncStatus.PENDING,
  name,
  timestamp: {
    [AsyncStatus.PENDING]: 1,
  },
}
const b: AsyncMeta<typeof name, Error> = {
  id: `B`,
  status: AsyncStatus.PENDING,
  name,
  timestamp: {
    [AsyncStatus.PENDING]: 2,
  },
}
const c: AsyncMeta<typeof name, Error> = {
  id: `C`,
  status: AsyncStatus.PENDING,
  name,
  timestamp: {
    [AsyncStatus.CREATED]: 3,
    [AsyncStatus.PENDING]: 3,
  },
}
const d: AsyncMeta<typeof name, Error> = {
  id: `D`,
  status: AsyncStatus.PENDING,
  name,
  timestamp: {
    [AsyncStatus.PENDING]: 4,
  },
}
const e: AsyncMeta<typeof name2, Error> = {
  id: `E`,
  status: AsyncStatus.CANCELLED,
  name: name2,
  timestamp: {
    [AsyncStatus.PENDING]: 4,
    [AsyncStatus.CANCELLED]: 5,
  },
}
const f: AsyncMeta<typeof name, Error> = {
  id: `F`,
  status: AsyncStatus.SUCCESS,
  name,
  timestamp: {
    [AsyncStatus.CREATED]: 1,
    [AsyncStatus.PENDING]: 4,
    [AsyncStatus.SUCCESS]: 5,
  },
}
const g: AsyncMeta<typeof name, Error> = {
  id: `G`,
  status: AsyncStatus.FAILURE,
  name,
  timestamp: {
    [AsyncStatus.CREATED]: 3,
    [AsyncStatus.PENDING]: 7,
    [AsyncStatus.FAILURE]: 10,
  },
}
const h: AsyncMeta<typeof name2, Error> = {
  id: `H`,
  status: AsyncStatus.FAILURE,
  name: name2,
  timestamp: {
    [AsyncStatus.CREATED]: 10,
    [AsyncStatus.PENDING]: 11,
  },
}

const mockState: {
  async: ReturnType<typeof asyncReducer>
} = {
  async: {
    asyncJobs: {
      [a.id]: a,
      [b.id]: b,
      [c.id]: c,
      [d.id]: d,
      [e.id]: e,
      [f.id]: f,
      [g.id]: g,
      [h.id]: h,
    },
  },
}

describe(`createLatestOrEarliestAsyncJobByNameSelector`, () => {
  const earliestAsyncJobByNameSelector =
    createLatestOrEarliestAsyncJobByNameSelector(`earliest`)()
  const latestAsyncJobByNameSelector =
    createLatestOrEarliestAsyncJobByNameSelector(`latest`)()
  it(`should compare time by earliest if time was specified as earliest`, () => {
    const result = earliestAsyncJobByNameSelector(mockState, {
      name,
      compareTimestamp: AsyncStatus.PENDING,
    })
    expect(result).toStrictEqual(a)
  })

  it(`should compare time by latest if time was specified as latest`, () => {
    const result = latestAsyncJobByNameSelector(mockState, {
      name,
      compareTimestamp: AsyncStatus.PENDING,
    })
    expect(result).toStrictEqual(d)
  })

  it(`should also include job of which status is not equal to compareTimestamp if onlyCurrentStatus option is supplied as false`, () => {
    const result = latestAsyncJobByNameSelector(mockState, {
      name,
      compareTimestamp: AsyncStatus.PENDING,
      onlyCurrentStatus: false,
    })
    expect(result).toStrictEqual(g)
  })
  it(`should select different names of async jobs`, () => {
    const result = earliestAsyncJobByNameSelector(mockState, {
      name: name2,
      compareTimestamp: AsyncStatus.PENDING,
      onlyCurrentStatus: false,
    })
    expect(result).toStrictEqual(e)
  })
  it(`should return undefined if no job of matching name is found`, () => {
    const result = earliestAsyncJobByNameSelector(mockState, {
      name: `NO_MATCHING_NAME`,
      compareTimestamp: AsyncStatus.PENDING,
    })
    const result2 = earliestAsyncJobByNameSelector(mockState, {
      name: `NO_MATCHING_NAME`,
      compareTimestamp: AsyncStatus.PENDING,
      onlyCurrentStatus: false,
    })
    expect(result).toBeUndefined()
    expect(result2).toBeUndefined()
  })
})

describe(`asyncJobByIdSelector`, () => {
  it(`should return undefined if no matching job was found`, () => {
    const result = asyncJobByIdSelector(mockState, `NO_MATCHING_NAME`)

    expect(result).toBeUndefined()
  })

  it(`should return matching job if found`, () => {
    const result = asyncJobByIdSelector(mockState, c.id)

    expect(result).toStrictEqual(c)
  })
})
