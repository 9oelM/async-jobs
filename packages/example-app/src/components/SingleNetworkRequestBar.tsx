import React, { useEffect, useState } from "react"
import { asyncJobByIdSelector, AsyncStatus } from "@async-jobs/core"
import { useTypedSelector } from "../redux/store"
import { enhance } from "../utilities/essentials"
import { pickStyles } from "../styles"
import { Constants } from "../constants"

export const SingleNetworkRequestBar = enhance<{
  requestId: string
  firstRequestBeginTime: number
}>(({ requestId, firstRequestBeginTime }) => {
  const singleAsyncRequestInfo = useTypedSelector((s) =>
    asyncJobByIdSelector(s, requestId)
  )
  const [timeDiffUntilRequestFirstSent, setTimeDiffUntilRequestFirstSent] =
    useState<null | number>(null)

  console.log(singleAsyncRequestInfo)
  if (!singleAsyncRequestInfo) return null

  useEffect(() => {
    if (
      singleAsyncRequestInfo.status === AsyncStatus.LOADING &&
      singleAsyncRequestInfo.timestamp[`LOADING`] &&
      timeDiffUntilRequestFirstSent === null
    ) {
      setTimeDiffUntilRequestFirstSent(
        singleAsyncRequestInfo.timestamp[`LOADING`] - firstRequestBeginTime
      )
      console.log(
        singleAsyncRequestInfo.timestamp[`LOADING`] - firstRequestBeginTime
      )
    }
  }, [singleAsyncRequestInfo.status, timeDiffUntilRequestFirstSent])

  // const timeDiffUntilRequestFirstSent = (() => {
  //   if (
  //     singleAsyncRequestInfo.status === AsyncStatus.LOADING &&
  //     singleAsyncRequestInfo.timestamp[`LOADING`] &&
  //     singleAsyncRequestInfo.timestamp[`NOT_STARTED`]
  //   ) {
  //     const timeDiffUntilRequestFirstSent =
  //       singleAsyncRequestInfo.timestamp[`LOADING`] -
  //       singleAsyncRequestInfo.timestamp[`NOT_STARTED`]

  //     return timeDiffUntilRequestFirstSent
  //   }
  //   return null
  // })()

  // console.log(firstRequestBeginTime)
  // console.log(timeDiffUntilRequestFirstSent)

  if (singleAsyncRequestInfo.status === AsyncStatus.NOT_STARTED) {
    return <div>Queued (request created but not started)</div>
  }

  return (
    <div
      style={{
        ...pickStyles(`animatedGrowingBar`),
        marginLeft:
          timeDiffUntilRequestFirstSent !== null
            ? `calc(100% * ${timeDiffUntilRequestFirstSent} / ${Constants.NETWORK_REQUEST_MAXIMUM_ANIMATION_DURATION_MS})`
            : 0,
        animationPlayState: [AsyncStatus.FAILURE, AsyncStatus.SUCCESS].includes(
          singleAsyncRequestInfo.status
        )
          ? `paused`
          : `running`,
      }}
    ></div>
  )
})()
