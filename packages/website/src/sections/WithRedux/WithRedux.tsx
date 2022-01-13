import { AsyncStatus } from "@async-jobs/core"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { batch, useDispatch } from "react-redux"
import { SingleNetworkRequestBar } from "../../components/SingleNetworkRequestBar"
import { exampleApiJobSet } from "../../redux/asyncActions"
import { useTypedSelector } from "../../redux/store"
import { pickStyles } from "../../styles"
import { enhance } from "../../utilities/essentials"
import { useSendAndManageRequest } from "./hooks"
import "./withredux.css"

function useSendExampleRequests() {
  const req1 = useSendAndManageRequest(1, 2)
  const req2 = useSendAndManageRequest(2, 3)
  const req3 = useSendAndManageRequest(3, 0, true)
  const req4 = useSendAndManageRequest(4, 3, true)
  const req5 = useSendAndManageRequest(3, 2, false)
  const req6 = useSendAndManageRequest(5, 6, false)
  const req7 = useSendAndManageRequest(8, 8)
  const req8 = useSendAndManageRequest(6, 0, true)
  const req9 = useSendAndManageRequest(5)
  const req10 = useSendAndManageRequest(10)
  const req11 = useSendAndManageRequest(2, 5)
  const req12 = useSendAndManageRequest(12, 2, true)
  const allReqs = useMemo(
    () => [
      req1,
      req2,
      req3,
      req4,
      req5,
      req6,
      req7,
      req8,
      req9,
      req10,
      req11,
      req12,
    ],
    // we know for sure that these will not change, so leave it as an empty deps array
    []
  )
  return allReqs
}

const Basic = enhance(() => {
  const allReqs = useSendExampleRequests()
  const firstRequestBeginTime = useRef(Date.now())

  const allAsyncReqsInfo = useTypedSelector((s) =>
    Object.values(s.async.asyncJobs)
  )

  useEffect(() => {
    allReqs.forEach(({ send }) => send())
  }, [allReqs])

  return (
    <div style={pickStyles(`fullW`)}>
      {allAsyncReqsInfo.map((asyncReq) => {
        return (
          <SingleNetworkRequestBar
            requestId={asyncReq.id}
            key={asyncReq.id}
            firstRequestBeginTime={firstRequestBeginTime.current}
          />
        )
      })}
    </div>
  )
})()

export const WithRedux = enhance(() => {
  const [runAgain, setRunAgain] = useState(0)
  const allAsyncJobIds = useTypedSelector((s) =>
    Object.values(s.async.asyncJobs).map(({ id }) => id)
  )
  const isAnyRequestStillLoading = useTypedSelector((s) =>
    Object.values(s.async.asyncJobs).some(
      ({ status }) => status === AsyncStatus.LOADING
    )
  )
  const dispatch = useDispatch()
  const replayJobs = useCallback(() => {
    if (isAnyRequestStillLoading) return
    batch(() => {
      allAsyncJobIds.forEach((id) => {
        dispatch(exampleApiJobSet.remove({ id }))
      })
    })
    setRunAgain((runAgain) => runAgain + 1)
    setTimeout(() => {
      setRunAgain((runAgain) => runAgain + 1)
    }, 100)
  }, [allAsyncJobIds, isAnyRequestStillLoading])

  return (
    <article style={pickStyles(`mediumMargin`)}>
      <h2 style={pickStyles(`colorBrown`, `mediumFontSize`)}>
        Centralize managing all async jobs
      </h2>
      <ul style={pickStyles(`colorBrown`, `mediumMargin`)}>
        <li style={pickStyles(`colorBrown`)}>
          Track, manage, access all async jobs
        </li>
        <li style={pickStyles(`colorBrown`)}>
          Best used for multiple, long running, error-prone jobs (network
          requests, web workers, etc.)
        </li>
        <li style={pickStyles(`colorBrown`)}>
          Strictly typed everywhere with Typescript
        </li>
        <li style={pickStyles(`colorBrown`)}>
          Check network panel in devtools and compare with the chart below
        </li>
        <button
          onClick={replayJobs}
          disabled={isAnyRequestStillLoading}
          style={
            isAnyRequestStillLoading
              ? pickStyles(`colorBrown`, `smallPadding`)
              : pickStyles(`colorBrown`, `smallPadding`, `cursorPointer`)
          }
        >
          Replay jobs
        </button>
      </ul>
      {runAgain % 2 === 0 ? <Basic /> : null}
    </article>
  )
})()
