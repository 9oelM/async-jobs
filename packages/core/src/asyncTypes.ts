import { nanoid } from "nanoid"

// https://github.com/krzkaczor/ts-essentials/blob/53e73d56cccb8585a84c431e0c8558ed1f440dfe/lib/types.ts#L392
export type MarkRequired<T, RK extends keyof T> = Exclude<T, RK> &
  Required<Pick<T, RK>>

export enum AsyncStatus {
  /**
   * @description when the Job has been first made
   * and the actual async Job has not been started
   */
  NOT_STARTED = `NOT_STARTED`,
  LOADING = `LOADING`,
  SUCCESS = `SUCCESS`,
  FAILURE = `FAILURE`,
  CANCELLED = `CANCELLED`,
}

export type AsyncMeta<RequestName extends string, Err = Error> = {
  /**
   * @description the unique id of a Job.
   * Many jobs can have the same name, but not the same id.
   */
  id: ReturnType<typeof nanoid>
  status: AsyncStatus
  /**
   * @description error will be stored here once it happens
   */
  error?: Err
  /**
   * @description The name of a specific Job.
   * @example `DELETE_USER`
   * @warning a Job name should be unique across your application.
   */
  name: RequestName
  /**
   * time at which each action of the Job took place
   */
  timestamp: {
    [AsyncStatus.NOT_STARTED]?: number
    [AsyncStatus.LOADING]?: number
    [AsyncStatus.SUCCESS]?: number
    [AsyncStatus.FAILURE]?: number
    [AsyncStatus.CANCELLED]?: number
  }
}

export enum JobActions {
  CREATE = `CREATE`,
  START = `START`,
  SUCCEED = `SUCCEED`,
  FAIL = `FAIL`,
  CANCEL = `CANCEL`,
  /**
   * @description used to remove the Job from reducer.
   */
  REMOVE = `REMOVE`,
}

export const ASYNC_JOBS_PREFIX = `@RA` as const

export type ActionTypeCreator<
  JobAction extends JobActions,
  JobName extends string
> = `${typeof ASYNC_JOBS_PREFIX}/${JobAction}/${JobName}`

export const asyncActionTypeCreator: <
  JobAction extends JobActions,
  JobName extends string
>(
  jobAction: JobAction,
  name: JobName
) => ActionTypeCreator<JobAction, JobName> = (jobAction, name) =>
  `${ASYNC_JOBS_PREFIX}/${jobAction}/${name}`

export type AsyncJobParams<JobName extends string, Payload> = Pick<
  AsyncMeta<JobName>,
  `name`
> &
  Partial<Pick<AsyncMeta<JobName>, `id`>> & {
    payload?: Payload | undefined
  }

export type AsyncJobReturns<JobName extends string, Payload> =
  | Pick<AsyncMeta<JobName>, `id` | `name`> &
      (Payload extends undefined | never
        ? // eslint-disable-next-line @typescript-eslint/ban-types
          {}
        : {
            payload: Payload
          })

/**
 * @description used to create `createJob` and `startJob` actions.
 */
export type CreateOrStartJobActionCreator<JobAction extends JobActions> = <
  JobName extends string,
  Payload
>(
  params: AsyncJobParams<JobName, Payload>
) => AsyncJobReturns<JobName, Payload> & {
  type: ActionTypeCreator<JobAction, JobName>
}

/**
 * @description same as {@link CreateOrStartJobActionCreator} but
 * eagerly requires three generic arguments
 */
export type CreateOrStartJobActionEagerCreator<
  JobAction extends JobActions,
  JobName extends string,
  Payload
> = (params: AsyncJobParams<JobName, Payload>) => AsyncJobReturns<
  JobName,
  Payload
> & {
  type: ActionTypeCreator<JobAction, JobName>
}

/**
 * used to create Job actions for
 * succeed, fail, cancel and remove actions
 */
export type GeneralJobActionCreator<JobAction extends JobActions> = <
  JobName extends string,
  Payload
>(
  params: MarkRequired<AsyncJobParams<JobName, Payload>, `id`>
) => AsyncJobReturns<JobName, Payload> & {
  type: ActionTypeCreator<JobAction, JobName>
}

/**
 * @description same as {@link GeneralJobActionCreator} but
 * eagerly requires three generic arguments
 */
export type GeneralJobActionEagerCreator<
  JobAction extends JobActions,
  JobName extends string,
  Payload
> = (
  params: Omit<MarkRequired<AsyncJobParams<JobName, Payload>, `id`>, `name`>
) => AsyncJobReturns<JobName, Payload> & {
  type: ActionTypeCreator<JobAction, JobName>
}

/**
 * @description ts-only user defined typeguard
 * @example
 * ```
 * const action = createJob({ name: `YOUTUBE_LITE`, payload: { is: `awesome` } })
 * if (isSpecificAsyncActionType(action, JobActions.CREATE, `YOUTUBE_LITE`)) {
 *  console.log(action.type === `@RA/CREATE/YOUTUBE_LITE`) // true
 * }
 * ```
 */
export function isSpecificAsyncActionType<
  JobAction extends JobActions,
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

export type CreateOrStartAsyncActionCreatorWithoutNameParameter<
  JobAction extends JobActions,
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

export type GeneralAsyncActionCreatorWithoutNameParameter<
  JobAction extends JobActions,
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

export type WithAsyncJobsType<
  JobAction extends JobActions,
  JobName extends string,
  T
> = T & {
  __ASYNC_JOBS_TYPE__: ActionTypeCreator<JobAction, JobName>
}

export type GeneralAsyncActionCreatorWithoutNameParameterAndWithAsyncJobsType<
  JobAction extends JobActions,
  JobName extends string,
  Payload
> = WithAsyncJobsType<
  JobAction,
  JobName,
  GeneralAsyncActionCreatorWithoutNameParameter<JobAction, JobName, Payload>
>

export type CreateOrStartAsyncActionCreatorWithoutNameParameterAndWithAsyncJobsType<
  JobAction extends JobActions,
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
  JobAction extends JobActions = JobActions,
  JobName extends string = string
>(
  reduxAsyncActionCreator: ActionCreator
): typeof reduxAsyncActionCreator[`__ASYNC_JOBS_TYPE__`] {
  return reduxAsyncActionCreator.__ASYNC_JOBS_TYPE__
}

// https://github.com/reduxjs/redux/blob/d794c56f78eccb56ba3c67971c26df8ee34dacc1/src/types/actions.ts#L18
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Action<T = any> {
  type: T
}

/**
 * An Action type which accepts any other properties.
 * This is mainly for the use of the `Reducer` type.
 * This is not part of `Action` itself to prevent types that extend `Action` from
 * having an index signature.
 */
export interface AnyAction extends Action {
  // Allows any extra properties to be defined in an action.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [extraProps: string]: any
}
