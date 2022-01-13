/* eslint-disable @typescript-eslint/ban-ts-comment */
import { nanoid } from "nanoid"
import {
  CreateOrStartJobActionCreator,
  asyncActionTypeCreator,
  GeneralJobActionCreator,
  AsyncJobActions,
  CreateOrStartAsyncActionCreatorWithoutNameParameterAndWithAsyncJobsType,
  GeneralAsyncActionCreatorWithoutNameParameterAndWithAsyncJobsType,
} from "./asyncTypes"

/**
 * Sometimes you want to create an async job in some time before in advance to sending the actual job.
 * Use this to create an async job first, and use {@link startJob} to fire the actual job.
 *
 * If you want to immediately fire an async job upon creating it, use {@link startJob} directly instead.
 *
 * @example
 * ```
 * dispatch(createJob({
 *  name: `POST_FLIGHT_TICKET`,
 *  payload: {
 *    flightId: 123,
 *    passengerId: 456,
 *  }
 * }))
 * ```
 */
export const createJob: CreateOrStartJobActionCreator<
  AsyncJobActions.CREATE
> = ({
  id = nanoid(),
  name,
  payload,
  // @ts-ignore
}) => ({
  id,
  name,
  payload,
  type: asyncActionTypeCreator(AsyncJobActions.CREATE, name),
})

/**
 * if you just want to start the async job right away without {@link createJob},
 * use this. Perhaps this is the most common action to use it you don't create an async job in advance.
 *
 * @warning if a new id is supplied and the async job information has been already initiated with {@link createJob},
 * it will ignore the new id and proceed with the existing id.
 */
export const startJob: CreateOrStartJobActionCreator<AsyncJobActions.START> = ({
  id = nanoid(),
  name,
  payload,
  // @ts-ignore
}) => ({
  id,
  name,
  payload,
  type: asyncActionTypeCreator(AsyncJobActions.START, name),
})

/**
 * @description call this action when the async job is successful
 */
export const succeedJob: GeneralJobActionCreator<AsyncJobActions.SUCCEED> = (
  params
  // @ts-ignore
) => ({
  ...params,
  type: asyncActionTypeCreator(AsyncJobActions.SUCCEED, params.name),
})

/**
 * @description call this action when the async job is failed
 * @param params insert error object in params.payload
 */
export const failJob: GeneralJobActionCreator<AsyncJobActions.FAIL> = (
  params
  // @ts-ignore
) => ({
  ...params,
  type: asyncActionTypeCreator(AsyncJobActions.FAIL, params.name),
})

/**
 * @description call this action to cancel an async job
 */
export const cancelJob: GeneralJobActionCreator<AsyncJobActions.CANCEL> = (
  params
  // @ts-ignore
) => ({
  ...params,
  type: asyncActionTypeCreator(AsyncJobActions.CANCEL, params.name),
})

/**
 * @description remove an async job from the store
 */
export const removeJob: GeneralJobActionCreator<AsyncJobActions.REMOVE> = (
  params
  // @ts-ignore
) => ({
  ...params,
  type: asyncActionTypeCreator(AsyncJobActions.REMOVE, params.name),
})

/**
 * It's a common pattern that most async jobs are created, started, and succeed, fail, or get cancelled.
 * This is a helper function to create all of the actions ({@link createJob}, {@link startJob}, {@link succeedJob}, {@link failJob}, {@link cancelJob}, and {@link removeJob}) about a single async job at once.
 * @param jobName The job name. For example, `LOGIN`.
 * @returns set of all async job action creators: `create`, `start`, `succeed`, `fail`, `cancel`, `remove`.
 *
 * @example
 * ```ts
 * enum JobNames {
 *  FLIGHT_TICKET_REQUEST = `FLIGHT_TICKET_REQUEST`
 * }
 *
 * const postFlightTicketJobSet = createJobSet<
 *  JobNames.FLIGHT_TICKET_REQUEST,
 *  never,
 *  {
 *    departureFromHomeDate: Date;
 *    departureFromDestinationDate: Date;
 *    home: string;
 *    destination: string;
 *  },
 *  {
 *    availableTickets: {
 *      airline: string;
 *      price: number;
 *    }[]
 *  },
 *  AxiosError,
 *  never,
 *  never,
 * >(JobNames.FLIGHT_TICKET_REQUEST)
 *
 * const SeeTicketButton = () => {
 *  const dispatch = useDispatch();
 *
 *  return <Button
 *    onClick={() => dispatch(postFlightTicketJobSet.start({
 *      departureFromHomeDate: new Date(`2021/03/03`),
 *      departureFromDestinationDate: new Date(`2021/03/08`),
 *      home: `Seoul`,
 *      destination: `New York`,
 *    }))}
 *  >
 *    See tickets
 *  </Button>
 * }
 *
 * // then in redux saga
 * import { getType } from 'typesafe-actions'
 *
 * yield takeLatest(getType(postFlightTicketJobSet.start), function *(action: ActionType<typeof postFlightTicketJobSet.start>){
 *   const result = yield call(() => window.fetch('flighttickets.com', { method: `POST` }));
 *   ...
 * })
 * ```
 */
export function createJobSet<
  JobName extends string,
  CreatePayload = undefined,
  StartPayload = undefined,
  SucceedPayload = undefined,
  FailPayload = undefined,
  CancelPayload = undefined,
  RemovePayload = undefined
>(
  jobName: JobName
): {
  create: CreateOrStartAsyncActionCreatorWithoutNameParameterAndWithAsyncJobsType<
    AsyncJobActions.CREATE,
    JobName,
    CreatePayload
  >
  start: CreateOrStartAsyncActionCreatorWithoutNameParameterAndWithAsyncJobsType<
    AsyncJobActions.START,
    JobName,
    StartPayload
  >
  succeed: GeneralAsyncActionCreatorWithoutNameParameterAndWithAsyncJobsType<
    AsyncJobActions.SUCCEED,
    JobName,
    SucceedPayload
  >
  fail: GeneralAsyncActionCreatorWithoutNameParameterAndWithAsyncJobsType<
    AsyncJobActions.FAIL,
    JobName,
    FailPayload
  >
  cancel: GeneralAsyncActionCreatorWithoutNameParameterAndWithAsyncJobsType<
    AsyncJobActions.CANCEL,
    JobName,
    CancelPayload
  >
  remove: GeneralAsyncActionCreatorWithoutNameParameterAndWithAsyncJobsType<
    AsyncJobActions.REMOVE,
    JobName,
    RemovePayload
  >
} {
  const create: CreateOrStartAsyncActionCreatorWithoutNameParameterAndWithAsyncJobsType<
    AsyncJobActions.CREATE,
    JobName,
    CreatePayload
  > = (paramsExceptName) =>
    createJob({
      ...paramsExceptName,
      name: jobName,
    })
  create.__ASYNC_JOBS_TYPE__ = asyncActionTypeCreator(
    AsyncJobActions.CREATE,
    jobName
  )

  const start: CreateOrStartAsyncActionCreatorWithoutNameParameterAndWithAsyncJobsType<
    AsyncJobActions.START,
    JobName,
    StartPayload
  > = (paramsExceptName) =>
    startJob({
      ...paramsExceptName,
      name: jobName,
    })
  start.__ASYNC_JOBS_TYPE__ = asyncActionTypeCreator(
    AsyncJobActions.START,
    jobName
  )

  const succeed: GeneralAsyncActionCreatorWithoutNameParameterAndWithAsyncJobsType<
    AsyncJobActions.SUCCEED,
    JobName,
    SucceedPayload
  > = (paramsExceptName) =>
    succeedJob({
      ...paramsExceptName,
      name: jobName,
    })
  succeed.__ASYNC_JOBS_TYPE__ = asyncActionTypeCreator(
    AsyncJobActions.SUCCEED,
    jobName
  )

  const fail: GeneralAsyncActionCreatorWithoutNameParameterAndWithAsyncJobsType<
    AsyncJobActions.FAIL,
    JobName,
    FailPayload
  > = (paramsExceptName) =>
    failJob({
      ...paramsExceptName,
      name: jobName,
    })
  fail.__ASYNC_JOBS_TYPE__ = asyncActionTypeCreator(
    AsyncJobActions.FAIL,
    jobName
  )

  const cancel: GeneralAsyncActionCreatorWithoutNameParameterAndWithAsyncJobsType<
    AsyncJobActions.CANCEL,
    JobName,
    CancelPayload
  > = (paramsExceptName) =>
    cancelJob({
      ...paramsExceptName,
      name: jobName,
    })
  cancel.__ASYNC_JOBS_TYPE__ = asyncActionTypeCreator(
    AsyncJobActions.CANCEL,
    jobName
  )

  const remove: GeneralAsyncActionCreatorWithoutNameParameterAndWithAsyncJobsType<
    AsyncJobActions.REMOVE,
    JobName,
    RemovePayload
  > = (paramsExceptName) =>
    removeJob({
      ...paramsExceptName,
      name: jobName,
    })
  remove.__ASYNC_JOBS_TYPE__ = asyncActionTypeCreator(
    AsyncJobActions.REMOVE,
    jobName
  )
  /**
   * it cannot be `[createJob, startJob, ...].map(() => ...)` because
   * TS cannot infer types correctly
   */
  return {
    create,
    start,
    succeed,
    fail,
    cancel,
    remove,
  }
}
