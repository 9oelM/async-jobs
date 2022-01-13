import React, { useEffect, useMemo, useState } from "react"
import { Code } from "../../components/Code"
import { useTypedSelector } from "../../redux/store"
import { pickStyles } from "../../styles"
import { enhance } from "../../utilities/essentials"
import { useSendAndManageRequest } from "./hooks"
import "./withredux.css"

function useSendExampleRequests() {
  const req1 = useSendAndManageRequest(1)
  const req2 = useSendAndManageRequest(2)
  const req3 = useSendAndManageRequest(3, 0, true)
  const req4 = useSendAndManageRequest(4, 3, true)
  const req5 = useSendAndManageRequest(3, 2, false)
  const req6 = useSendAndManageRequest(5, 6, false)
  const req7 = useSendAndManageRequest(8, 8)
  const req8 = useSendAndManageRequest(6)
  const req9 = useSendAndManageRequest(5)
  const req10 = useSendAndManageRequest(10)
  const allReqs = useMemo(
    () => [req1, req2, req3, req4, req5, req6, req7, req8, req9, req10],
    // we know for sure that these will not change, so leave it as an empty deps array
    []
  )
  return allReqs
}

const Basic = enhance(() => {
  const allReqs = useSendExampleRequests()

  const allAsyncReqsInfo = useTypedSelector((s) =>
    Object.values(s.async.asyncJobs)
  )

  useEffect(() => {
    allReqs.forEach(({ send }) => send())
  }, [allReqs])

  const timeout = useState(false)

  useEffect(() => {
    setTimeout(() => {
      timeout[1](true)
    }, 3000)
  }, [])

  return (
    <div style={pickStyles(`fullW`)}>
      {allAsyncReqsInfo.map((asyncReq) => {
        return asyncReq.id
      })}
      <div
        id="test"
        style={{
          ...pickStyles(`animatedGrowingBar`),
          animationPlayState: timeout[0] ? `paused` : `running`,
        }}
      ></div>
    </div>
  )
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
