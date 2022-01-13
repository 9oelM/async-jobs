import { useRef } from "react"
import { useDispatch } from "react-redux"
import { API } from "../../api"
import { exampleApiJobSet } from "../../redux/asyncActions"
import { wait } from "../../utilities/essentials"

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
