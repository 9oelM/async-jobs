import { asyncReducer } from "@async-jobs/core"
import { createStore, combineReducers } from "redux"

export const store = createStore(
  combineReducers({
    asyncJobs: asyncReducer,
  })
)
