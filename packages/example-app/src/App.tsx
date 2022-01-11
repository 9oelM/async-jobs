import React from "react"
import * as A from "@async-jobs/core"

export const App = () => {
  console.log(A.ASYNC_JOBS_PREFIX)

  return (
    <div>
      <h1>Hello World</h1>
    </div>
  )
}
