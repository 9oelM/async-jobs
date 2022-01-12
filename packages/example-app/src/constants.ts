import { API } from "./api/config"
import { TcResult } from "./utilities/essentials"
import { useDispatch } from "react-redux"
import { exampleApiJobSet } from "./redux/asyncActions"
import { useRef } from "react"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useSendAndManageRequest = (
  initialDelaySecs?: number,
  timeout_secs?: number,
  make_error?: boolean
) => {
  const dispatch = useDispatch()
  const exampleApiJobSetInitialAction = useRef(
    initialDelaySecs ? exampleApiJobSet.create({}) : exampleApiJobSet.start({})
  )

  return {
    send: async () => {
      if (initialDelaySecs) {
        await wait(initialDelaySecs * 1000)
      }
      dispatch(exampleApiJobSetInitialAction.current)
      API.sendExampleRequest({
        timeout_secs,
        make_error,
      }).then(([err]) => {
        dispatch(
          (err ? exampleApiJobSet.fail : exampleApiJobSet.succeed)({
            id: exampleApiJobSetInitialAction.current.id,
          })
        )
      })
    },
    id: exampleApiJobSetInitialAction.current.id,
  }
}

export const useMakeExampleRequests: () => Promise<
  TcResult<string, Error>
>[] = () => {
  return [
    API.sendExampleRequest({}),
    new Promise((resolve) => {
      return wait(2000).then(() =>
        resolve(API.sendExampleRequest({ timeout_secs: 1 }))
      )
    }),
    API.sendExampleRequest({ timeout_secs: 1 }),
    API.sendExampleRequest({ timeout_secs: 3 }),
    new Promise((resolve) => {
      return wait(5000).then(() =>
        resolve(API.sendExampleRequest({ timeout_secs: 4, make_error: true }))
      )
    }),
    API.sendExampleRequest({ timeout_secs: 4 }),
    API.sendExampleRequest({ timeout_secs: 5, make_error: true }),
    API.sendExampleRequest({ timeout_secs: 7, make_error: true }),
    API.sendExampleRequest({ timeout_secs: 9 }),
  ]
}
