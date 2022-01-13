import React, { useEffect } from "react"
import { API } from "../api"
import { Code } from "../components/Code"
import { pickStyles } from "../styles"
import { enhance } from "../utilities/essentials"

const Basic = enhance(() => {
  useEffect(() => {
    API.sendExampleRequest({})
  }, [])

  return null
})()

export const WithRedux = enhance(() => {
  return (
    <article style={pickStyles(`mediumMargin`)}>
      <Code
        title="redux/store.ts"
        code={`import { asyncReducer } from "@async-jobs/core"
import { createStore, combineReducers } from "redux"

export const store = createStore(
  combineReducers({
    asyncJobs: asyncReducer,
  })
)`}
      />
      <h2 style={pickStyles(`colorBrown`, `mediumFontSize`)}>Basic</h2>
      <Basic />
    </article>
  )
})()
