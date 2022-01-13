import { useRef } from "react"
import { useDispatch } from "react-redux"
import { API } from "../../api"
import { exampleApiJobSet } from "../../redux/asyncActions"
import { wait } from "../../utilities/essentials"

export const useSendAndManageRequest = (
  initialDelaySecs: number,
  timeout_secs?: number,
  make_error?: boolean
) => {
  const dispatch = useDispatch()
  const exampleApiJobSetInitialAction = useRef(exampleApiJobSet.create({}))

  return {
    send: async () => {
      dispatch(exampleApiJobSetInitialAction.current)
      await wait(initialDelaySecs * 1000)
      dispatch(
        exampleApiJobSet.start({ id: exampleApiJobSetInitialAction.current.id })
      )
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
