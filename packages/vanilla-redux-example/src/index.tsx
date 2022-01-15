import React from "react"
import ReactDOM from "react-dom"
import { BookFlightPage } from "./App"
import { Provider, useSelector } from "react-redux"
import { combineReducers, createStore } from "redux"
import { asyncReducer } from "@async-jobs/core"

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

ReactDOM.render(
  <Provider store={store}>
    <BookFlightPage destination="New York" username="Joel" />,
  </Provider>,
  document.getElementById(`root`)
)
