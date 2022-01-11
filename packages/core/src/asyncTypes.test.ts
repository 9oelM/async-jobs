import { createJob, createJobSet, failJob } from "./asyncActions"
import {
  asyncActionTypeCreator,
  getAsyncJobsType,
  isSpecificAsyncActionType,
  JobActions,
  ASYNC_JOBS_PREFIX,
} from "./asyncTypes"

describe(`asyncActionTypeCreator`, () => {
  it(`produces expected combination of strings`, () => {
    expect(asyncActionTypeCreator(JobActions.START, `B`)).toEqual(
      `${ASYNC_JOBS_PREFIX}/${JobActions.START}/B`
    )
  })
})

describe(`isSpecificAsyncActionType`, () => {
  it.each([
    {
      action: { type: `RANDOM` },
      jobAction: JobActions.CANCEL,
      jobName: `TEST`,
    },
    {
      action: { payload: { a: 1 }, type: JobActions.REMOVE },
      jobAction: JobActions.REMOVE,
      jobName: `LOGIN`,
    },
    {
      action: failJob({
        name: `1`,
        payload: { "11": 1, "22": 3 },
        id: `QQQQQ`,
      }),
      jobAction: JobActions.FAIL,
      jobName: `123`,
    },
  ])(
    `should return false if action is not an async action type`,
    ({ action, jobAction, jobName }) => {
      expect(isSpecificAsyncActionType(action, jobAction, jobName)).toBe(false)
    }
  )

  it.each([
    {
      action: createJob({ name: `YOUTUBE_LITE`, payload: { is: `awesome` } }),
      jobAction: JobActions.CREATE,
      jobName: `YOUTUBE_LITE`,
    },
    {
      action: failJob({
        name: `1`,
        payload: { "11": 1, "22": 3 },
        id: `QQQQQ`,
      }),
      jobAction: JobActions.FAIL,
      jobName: `1`,
    },
  ])(
    `should return true if action is an async action type`,
    ({ action, jobAction, jobName }) => {
      expect(isSpecificAsyncActionType(action, jobAction, jobName)).toBe(true)
    }
  )
})

describe(`getAsyncJobsType`, () => {
  const exampleAsyncJob = createJobSet<`EXAMPLE`>(`EXAMPLE`)

  it.each([
    exampleAsyncJob.cancel,
    exampleAsyncJob.create,
    exampleAsyncJob.fail,
    exampleAsyncJob.remove,
    exampleAsyncJob.start,
    exampleAsyncJob.succeed,
  ])(`should return __ASYNC_JOBS_TYPE__`, (actionCreator) => {
    expect(getAsyncJobsType(actionCreator)).toEqual(
      actionCreator.__ASYNC_JOBS_TYPE__
    )
  })
})
