import {
  AnyAction,
  AsyncMeta,
  AsyncStatus,
  GeneralJobActionEagerCreator,
  JobActions,
  ASYNC_JOBS_PREFIX,
} from "./asyncTypes"
import { asyncReducerErrorReporter } from "./asyncReducerErrors"
import { Reducer } from "."

export type AsyncReducerState = {
  asyncJobs: Record<string, AsyncMeta<string, Error>>
}

export const asyncReducer: Reducer<AsyncReducerState, AnyAction> = (
  state = { asyncJobs: {} },
  action
) => {
  if (isAsyncActionType(action, JobActions.CREATE)) {
    if (action.id in state.asyncJobs) {
      asyncReducerErrorReporter.jobExistsOnCreate.describe(action)
      return state
    }

    return {
      ...state,
      asyncJobs: {
        ...state.asyncJobs,
        [action.id]: {
          id: action.id,
          status: AsyncStatus.NOT_STARTED,
          name: action.name,
          timestamp: {
            [AsyncStatus.NOT_STARTED]: Date.now(),
          },
        },
      },
    }
  } else if (isAsyncActionType(action, JobActions.START)) {
    if (action.id in state.asyncJobs) {
      // for typescript to understand the type correctly
      const maybeUndefinedJob = state.asyncJobs[action.id]
      if (!maybeUndefinedJob) return state

      const job = {
        ...maybeUndefinedJob,
      }
      job.status = AsyncStatus.LOADING
      job.timestamp = { ...job.timestamp }
      job.timestamp[AsyncStatus.LOADING] = Date.now()
      return {
        ...state,
        asyncJobs: {
          ...state.asyncJobs,
          [action.id]: job,
        },
      }
    }

    // if not found, return a new job
    return {
      ...state,
      asyncJobs: {
        ...state.asyncJobs,
        [action.id]: {
          id: action.id,
          status: AsyncStatus.LOADING,
          name: action.name,
          timestamp: {
            [AsyncStatus.LOADING]: Date.now(),
          },
        },
      },
    }
  } else if (isAsyncActionType(action, JobActions.FAIL)) {
    if (!(action.id in state.asyncJobs)) {
      asyncReducerErrorReporter.jobDoesNotExistError.describe(action)
      return state
    }
    // for typescript to understand the type correctly
    const maybeUndefinedJob = state.asyncJobs[action.id]
    if (!maybeUndefinedJob) return state

    const job = {
      ...maybeUndefinedJob,
    }

    job.error = action.payload
    job.status = AsyncStatus.FAILURE
    job.timestamp = { ...job.timestamp }
    job.timestamp[AsyncStatus.FAILURE] = Date.now()

    return {
      ...state,
      asyncJobs: {
        ...state.asyncJobs,
        [action.id]: job,
      },
    }
  } else if (isAsyncActionType(action, JobActions.REMOVE)) {
    if (!(action.id in state.asyncJobs)) {
      asyncReducerErrorReporter.jobDoesNotExistWarning.describe(action)
      return state
    }

    const asyncJobs = { ...state.asyncJobs }
    delete asyncJobs[action.id]

    return {
      ...state,
      asyncJobs,
    }
  } else if (isAsyncActionType(action, JobActions.CANCEL)) {
    if (!(action.id in state.asyncJobs)) {
      asyncReducerErrorReporter.jobDoesNotExistWarning.describe(action)
      return state
    }
    // for typescript to understand the type correctly
    const maybeUndefinedJob = state.asyncJobs[action.id]
    if (!maybeUndefinedJob) return state

    const job = {
      ...maybeUndefinedJob,
    }

    job.status = AsyncStatus.CANCELLED
    job.timestamp = { ...job.timestamp }
    job.timestamp[AsyncStatus.CANCELLED] = Date.now()

    return {
      ...state,
      asyncJobs: {
        ...state.asyncJobs,
        [action.id]: job,
      },
    }
  } else if (isAsyncActionType(action, JobActions.SUCCEED)) {
    if (!(action.id in state.asyncJobs)) {
      asyncReducerErrorReporter.jobDoesNotExistError.describe(action)
      return state
    }
    // for typescript to understand the type correctly
    const maybeUndefinedJob = state.asyncJobs[action.id]
    if (!maybeUndefinedJob) return state

    const job = {
      ...maybeUndefinedJob,
    }

    job.status = AsyncStatus.SUCCESS
    job.timestamp = { ...job.timestamp }
    job.timestamp[AsyncStatus.SUCCESS] = Date.now()

    return {
      ...state,
      asyncJobs: {
        ...state.asyncJobs,
        [action.id]: job,
      },
    }
  }

  return state
}

function isAsyncActionType<JobAction extends JobActions>(
  action: Record<string | number | symbol, any> & {
    type: string
  },
  jobAction: JobAction
): action is ReturnType<
  GeneralJobActionEagerCreator<JobAction, string, any>
> & { name: string; id: string; payload?: any } {
  return (
    typeof action.type === `string` &&
    action.type.startsWith(`${ASYNC_JOBS_PREFIX}/${jobAction}`)
  )
}
