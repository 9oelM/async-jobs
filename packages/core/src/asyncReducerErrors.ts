import { AnyAction } from "."
import {
  CreateOrStartJobActionEagerCreator,
  GeneralJobActionEagerCreator,
  JobActions,
} from "./asyncTypes"

export type SpecificErrorDescriptor<Payload = unknown> = <
  JobName extends string,
  Action extends
    | ReturnType<GeneralJobActionEagerCreator<JobActions, JobName, Payload>>
    | ReturnType<
        CreateOrStartJobActionEagerCreator<JobActions, JobName, Payload>
      >
>(
  action: Payload extends undefined
    ? Action
    : Omit<Action, `payload`> & Partial<{ payload: Payload }>
) => void

function makeTypeInferredAsyncReducerErrors<Keys extends string>(
  asyncReducerErrors: Record<
    Keys,
    {
      describe: SpecificErrorDescriptor
      code: number
    }
  >
): Record<
  Keys,
  {
    describe: SpecificErrorDescriptor
    code: number
  }
> {
  return asyncReducerErrors
}

export const asyncReducerErrorReporter = makeTypeInferredAsyncReducerErrors({
  jobExistsOnCreate: {
    describe: (action) => {
      console.error(
        `${action.type} will not have any effect. Job with the same id has been already created
Error code: 0`
      )
    },
    code: 0,
  },
  jobDoesNotExistError: {
    describe: (action) => {
      console.error(
        `${action.type} will not have any effect because job with id: ${action.id} does not exist.
Error Code: 1`
      )
    },
    code: 1,
  },
  jobDoesNotExistWarning: {
    describe: (action) => {
      console.warn(
        `${action.type} will not have any effect because job with id: ${action.id} does not exist.
Error Code: 2`
      )
    },
    code: 2,
  },
})

export const asyncReducerGeneralErrorReporter = {
  actionDoesNotExistError: {
    describe: (action: AnyAction) => {
      console.error(
        `${action.type} will not have any effect because it is not a valid action.
Error Code: 3`
      )
    },
    code: 3,
  },
}
