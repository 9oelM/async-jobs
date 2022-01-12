import { asyncReducer } from "@async-jobs/core"
import { combineReducers, createStore } from "redux"
import { useSelector } from "react-redux"

const reducers = {
  async: asyncReducer,
}
const rootReducer = combineReducers(reducers)

export type RootState = ReturnType<typeof rootReducer>

export function useTypedSelector<TSelected = unknown>(
  selector: (state: RootState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
): TSelected {
  return useSelector<RootState, TSelected>(selector, equalityFn)
}

export const store = createStore(rootReducer)
