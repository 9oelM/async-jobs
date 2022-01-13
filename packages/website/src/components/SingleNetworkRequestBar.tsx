import React, { useEffect, useState } from "react"
import { asyncJobByIdSelector, AsyncStatus } from "@async-jobs/core"
import { useTypedSelector } from "../redux/store"
import { enhance } from "../utilities/essentials"
import { Colors, pickStyles } from "../styles"
import { Constants } from "../constants"
import Tippy from "@tippyjs/react"

function getNetworkRequestBarBgColor(asyncStatus: AsyncStatus) {
  switch (asyncStatus) {
    case AsyncStatus.CREATED:
      return Colors.brown
    case AsyncStatus.LOADING:
      return Colors.brown
    case AsyncStatus.FAILURE:
      return `red`
    case AsyncStatus.SUCCESS:
      return `green`
    default:
      return Colors.brown
  }
}

export const SingleNetworkRequestBar = enhance<{
  requestId: string
  firstRequestBeginTime: number
}>(({ requestId, firstRequestBeginTime }) => {
  const singleAsyncRequestInfo = useTypedSelector((s) =>
    asyncJobByIdSelector(s, requestId)
  )
  const [timeDiffUntilRequestFirstSent, setTimeDiffUntilRequestFirstSent] =
    useState<null | number>(null)

  useEffect(() => {
    if (!singleAsyncRequestInfo) return
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
  }, [singleAsyncRequestInfo?.status, timeDiffUntilRequestFirstSent])

  if (!singleAsyncRequestInfo) return null

  const isRequestNotYetStarted =
    singleAsyncRequestInfo.status === AsyncStatus.CREATED

  const queuedText = isRequestNotYetStarted ? (
    <div
      style={{
        maxHeight: `20px`,
        marginLeft: `20px`,
        alignSelf: `center`,
      }}
    >
      <p
        style={{
          ...pickStyles(`colorBrown`, `extraSmallFontSize`),
          textAlign: `center`,
        }}
      >
        Queued
      </p>
    </div>
  ) : null
  const networkRequestProgressBar = isRequestNotYetStarted ? null : (
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
        backgroundColor: getNetworkRequestBarBgColor(
          singleAsyncRequestInfo.status
        ),
      }}
    ></div>
  )

  return (
    <Tippy
      content={
        <pre>
          <code>{JSON.stringify(singleAsyncRequestInfo, null, 2)}</code>
        </pre>
      }
    >
      <article
        style={{
          ...pickStyles(`flex`),
          minHeight: `20px`,
          borderBottom: `1px solid ${Colors[`brown`]}`,
        }}
      >
        <p
          style={{
            ...pickStyles(`colorBrown`, `extraSmallFontSize`),
            width: `90px`,
            textOverflow: `ellipsis`,
            overflow: `hidden`,
            whiteSpace: `nowrap`,
            alignSelf: `center`,
          }}
        >{`Job #${requestId.substring(0, 6)}`}</p>
        {queuedText}
        {networkRequestProgressBar}
      </article>
    </Tippy>
  )
})()
