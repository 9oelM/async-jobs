import React, { useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import {
  asyncJobByIdSelector,
  AsyncStatus,
  createJobSet,
} from "@async-jobs/core"
import { TcResult, tcAsync } from "./utilities/essentials"
import { useTypedSelector } from "."

export class API {
  static baseUrl = `https://example-api-six.vercel.app`

  static async bookFlightTicket({
    timeout_secs = 0,
    make_error = false,
  }: {
    timeout_secs?: number
    make_error?: boolean
  }): Promise<TcResult<string, Error>> {
    return tcAsync(
      window
        .fetch(
          `${API.baseUrl}/api/main?timeout_secs=${timeout_secs}&make_error=${make_error}`
        )
        .then((response) => {
          if (response.ok) {
            return response.text()
          } else {
            throw new Error(`Error happened: ${response.statusText}`)
          }
        })
    )
  }
}

enum AsyncJobNames {
  POST_BOOK_FLIGHT_TICKET = `POST_BOOK_FLIGHT_TICKET`,
}

export const postBookFlightTicketJobSet = createJobSet<
  AsyncJobNames.POST_BOOK_FLIGHT_TICKET,
  {
    destination: string
    username: string
  },
  {
    destination: string
    username: string
  },
  string,
  Error,
  void
>(AsyncJobNames.POST_BOOK_FLIGHT_TICKET)

export const BookFlightPage: React.FC<{
  destination: string
  username: string
}> = ({ destination, username }) => {
  const bookFlightTicketCreatedJob = useRef(
    postBookFlightTicketJobSet.create({
      payload: {
        destination,
        username,
      },
    })
  )
  const dispatch = useDispatch()
  const currentAsyncJob = useTypedSelector((s) =>
    asyncJobByIdSelector(s, bookFlightTicketCreatedJob.current.id)
  )

  useEffect(() => {
    async function bookFlightTicketOnMount() {
      dispatch(bookFlightTicketCreatedJob.current)
      await new Promise((resolve) => {
        setTimeout(resolve, 3000)
      })
      dispatch(
        postBookFlightTicketJobSet.start({
          id: bookFlightTicketCreatedJob.current.id,
          payload: bookFlightTicketCreatedJob.current.payload,
        })
      )
      const [err, postBookFlightTicketResult] = await API.bookFlightTicket({
        timeout_secs: 5,
        make_error: false,
      })

      if (!err && postBookFlightTicketResult) {
        dispatch(
          postBookFlightTicketJobSet.succeed({
            id: bookFlightTicketCreatedJob.current.id,
            payload: postBookFlightTicketResult,
          })
        )
      } else {
        dispatch(
          postBookFlightTicketJobSet.fail({
            id: bookFlightTicketCreatedJob.current.id,
            payload: err ?? new Error(`unknown error`),
          })
        )
      }
    }
    bookFlightTicketOnMount()
  }, [])

  return (
    <div>
      {(() => {
        switch (currentAsyncJob?.status) {
          case AsyncStatus.CREATED:
            return <div>Created</div>
          case AsyncStatus.PENDING:
            return <div>Pending</div>
          case AsyncStatus.SUCCESS:
            return <div>Success</div>
          case AsyncStatus.FAILURE:
            return <div>Failed</div>
          case AsyncStatus.CANCELLED:
            return <div>Cancelled</div>
          default:
            return <div>Unknown</div>
        }
      })()}
    </div>
  )
}
