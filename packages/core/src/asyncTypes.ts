import { nanoid } from "nanoid"

// https://github.com/krzkaczor/ts-essentials/blob/53e73d56cccb8585a84c431e0c8558ed1f440dfe/lib/types.ts#L392
/**
 * @ignore
 */
type MarkRequired<T, RK extends keyof T> = Exclude<T, RK> &
  Required<Pick<T, RK>>

/**
 * Represents the status of an async job.
 */
export enum AsyncStatus {
  /**
   * @description when the job has been first made
   * and the actual async job has not been started.
   *
   * for example, you could have a network request
   * scheduled to be sent after one minute later.
   * in that case, you would want to create it first,
   * and then fire it later.
   */
  CREATED = `CREATED`,
  /**
   * @description when an async job is started and waiting for the result.
   */
  PENDING = `PENDING`,
  /**
   * @description when an async job is successful.
   */
  SUCCESS = `SUCCESS`,
  /**
   * @description when an async job is failed.
   */
  FAILURE = `FAILURE`,
  /**
   * @description when an async job is cancelled.
   */
  CANCELLED = `CANCELLED`,
}

/**
 * Information about an async job. Every single async job will have this information available.
 */
export type AsyncMeta<RequestName extends string, Err = Error> = {
  /**
   * @description the unique id of an async job.
   * Many jobs can have the same name, but not the same id.
   */
  id: ReturnType<typeof nanoid>
  status: AsyncStatus
  /**
   * @description error will be stored here once it happens
   */
  error?: Err
  /**
   * @description The name of a specific async job.
   * @example `DELETE_USER`
   * @warning an async job name should be unique across your application.
   */
  name: RequestName
  /**
   * time at which each action of the async job took place.
   * not all timestamps will be available because not all actions need to be dispatched.
   */
  timestamp: {
    [AsyncStatus.CREATED]?: number
    [AsyncStatus.PENDING]?: number
    [AsyncStatus.SUCCESS]?: number
    [AsyncStatus.FAILURE]?: number
    [AsyncStatus.CANCELLED]?: number
  }
}

/**
 * Represents the action that can be done on an async job.
 */
export enum AsyncJobActions {
  /**
   * @description when the job has been first made
   * and the actual async job has not been started.
   *
   * for example, you could have a network request
   * scheduled to be sent after one minute later.
   * In that case, you would want to create it first,
   * and then fire it later.
   */
  CREATE = `CREATE`,
  /**
   * @description when an async job is started.
   */
  START = `START`,
  /**
   * @description when an async job is completed successfully.
   */
  SUCCEED = `SUCCEED`,
  /**
   * @description when an async job is completed unsuccessfully.
   */
  FAIL = `FAIL`,
  /**
   * @description when an async job is cancelled.
   */
  CANCEL = `CANCEL`,
  /**
   * @description used to remove an async job from the store.
   */
  REMOVE = `REMOVE`,
}

/**
 * @ignore
 */
export const ASYNC_JOBS_PREFIX = `@AJ` as const

/**
 * @ignore
 */
export type ActionTypeCreator<
  JobAction extends AsyncJobActions,
  JobName extends string
> = `${typeof ASYNC_JOBS_PREFIX}/${JobAction}/${JobName}`

/**
 * @ignore
 */
export const asyncActionTypeCreator: <
  JobAction extends AsyncJobActions,
  JobName extends string
>(
  jobAction: JobAction,
  name: JobName
) => ActionTypeCreator<JobAction, JobName> = (jobAction, name) =>
  `${ASYNC_JOBS_PREFIX}/${jobAction}/${name}`

/**
 * @ignore
 */
export type AsyncJobParams<JobName extends string, Payload> = Pick<
  AsyncMeta<JobName>,
  `name`
> &
  Partial<Pick<AsyncMeta<JobName>, `id`>> & {
    payload?: Payload | undefined
  }

/**
 * @ignore
 */
export type AsyncJobReturns<JobName extends string, Payload> =
  | Pick<AsyncMeta<JobName>, `id` | `name`> &
      (Payload extends undefined | never
        ? // eslint-disable-next-line @typescript-eslint/ban-types
          {}
        : {
            payload: Payload
          })

/**
 * @ignore
 * @description used to create `createJob` and `startJob` actions.
 */
export type CreateOrStartJobActionCreator<JobAction extends AsyncJobActions> = <
  JobName extends string,
  Payload
>(
  params: AsyncJobParams<JobName, Payload>
) => AsyncJobReturns<JobName, Payload> & {
  type: ActionTypeCreator<JobAction, JobName>
}

/**
 * @ignore
 * @description same as {@link CreateOrStartJobActionCreator} but
 * eagerly requires three generic arguments
 */
export type CreateOrStartJobActionEagerCreator<
  JobAction extends AsyncJobActions,
  JobName extends string,
  Payload
> = (params: AsyncJobParams<JobName, Payload>) => AsyncJobReturns<
  JobName,
  Payload
> & {
  type: ActionTypeCreator<JobAction, JobName>
}

/**
 * @ignore
 * used to create async job actions for
 * succeed, fail, cancel and remove actions
 */
export type GeneralJobActionCreator<JobAction extends AsyncJobActions> = <
  JobName extends string,
  Payload
>(
  params: MarkRequired<AsyncJobParams<JobName, Payload>, `id`>
) => AsyncJobReturns<JobName, Payload> & {
  type: ActionTypeCreator<JobAction, JobName>
}

/**
 * @ignore
 * @description same as {@link GeneralJobActionCreator} but
 * eagerly requires three generic arguments
 */
export type GeneralJobActionEagerCreator<
  JobAction extends AsyncJobActions,
  JobName extends string,
  Payload
> = (
  params: Omit<MarkRequired<AsyncJobParams<JobName, Payload>, `id`>, `name`>
) => AsyncJobReturns<JobName, Payload> & {
  type: ActionTypeCreator<JobAction, JobName>
}

/**
 * @description checks if an action is a specific type
 * @example
 * ```
 * const action = createJob({ name: `POST_FLIGHT_TICKET`, payload: { flightId: `123` } })
 * if (isSpecificAsyncActionType(action, AsyncJobActions.CREATE, `POST_FLIGHT_TICKET`)) {
 *  console.log(action.type === `@RA/CREATE/POST_FLIGHT_TICKET`) // true
 * }
 * ```
 */
export function isSpecificAsyncActionType<
  JobAction extends AsyncJobActions,
  JobName extends string,
  Payload
>(
  action: Record<string | number | symbol, unknown> & { type: string },
  jobAction: JobAction,
  jobName: JobName
): action is ReturnType<
  GeneralJobActionEagerCreator<JobAction, JobName, Payload>
> {
  return (
    typeof action.type === `string` &&
    action.type === `${ASYNC_JOBS_PREFIX}/${jobAction}/${jobName}`
  )
}

/**
 * @ignore
 */
export type CreateOrStartAsyncActionCreatorWithoutNameParameter<
  JobAction extends AsyncJobActions,
  JobName extends string,
  Payload
> = (
  params: Payload extends undefined
    ? Omit<
        Parameters<
          CreateOrStartJobActionEagerCreator<JobAction, JobName, Payload>
        >[0],
        `name` | `payload`
      >
    : MarkRequired<
        Omit<
          Parameters<
            CreateOrStartJobActionEagerCreator<JobAction, JobName, Payload>
          >[0],
          `name`
        >,
        `payload`
      >
) => ReturnType<CreateOrStartJobActionEagerCreator<JobAction, JobName, Payload>>

/**
 * @ignore
 */
export type GeneralAsyncActionCreatorWithoutNameParameter<
  JobAction extends AsyncJobActions,
  JobName extends string,
  Payload
> = (
  params: Payload extends undefined
    ? Omit<
        Parameters<
          GeneralJobActionEagerCreator<JobAction, JobName, Payload>
        >[0],
        `name` | `payload`
      >
    : MarkRequired<
        Omit<
          Parameters<
            GeneralJobActionEagerCreator<JobAction, JobName, Payload>
          >[0],
          `name`
        >,
        `payload`
      >
) => ReturnType<GeneralJobActionEagerCreator<JobAction, JobName, Payload>>

/**
 * @ignore
 */
export type WithAsyncJobsType<
  JobAction extends AsyncJobActions,
  JobName extends string,
  T
> = T & {
  __ASYNC_JOBS_TYPE__: ActionTypeCreator<JobAction, JobName>
}

/**
 * @ignore
 */
export type GeneralAsyncActionCreatorWithoutNameParameterAndWithAsyncJobsType<
  JobAction extends AsyncJobActions,
  JobName extends string,
  Payload
> = WithAsyncJobsType<
  JobAction,
  JobName,
  GeneralAsyncActionCreatorWithoutNameParameter<JobAction, JobName, Payload>
>

/**
 * @ignore
 */
export type CreateOrStartAsyncActionCreatorWithoutNameParameterAndWithAsyncJobsType<
  JobAction extends AsyncJobActions,
  JobName extends string,
  Payload
> = WithAsyncJobsType<
  JobAction,
  JobName,
  CreateOrStartAsyncActionCreatorWithoutNameParameter<
    JobAction,
    JobName,
    Payload
  >
>

/**
 * @ignore
 */
export function getAsyncJobsType<
  ActionCreator extends
    | CreateOrStartAsyncActionCreatorWithoutNameParameterAndWithAsyncJobsType<
        JobAction,
        JobName,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any
      >
    | GeneralAsyncActionCreatorWithoutNameParameterAndWithAsyncJobsType<
        JobAction,
        JobName,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any
      >,
  JobAction extends AsyncJobActions = AsyncJobActions,
  JobName extends string = string
>(
  reduxAsyncActionCreator: ActionCreator
): typeof reduxAsyncActionCreator[`__ASYNC_JOBS_TYPE__`] {
  return reduxAsyncActionCreator.__ASYNC_JOBS_TYPE__
}

// https://github.com/reduxjs/redux/blob/d794c56f78eccb56ba3c67971c26df8ee34dacc1/src/types/actions.ts#L18
// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 * @ignore
 */
export interface Action<T = any> {
  type: T
}

/**
 * @ignore
 */
export interface AnyAction extends Action {
  // Allows any extra properties to be defined in an action.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [extraProps: string]: any
}

/**
 * @ignore
 */
export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S | undefined,
  action: A
) => S
