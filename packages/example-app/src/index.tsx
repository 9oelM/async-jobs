import React from "react"
import ReactDOM from "react-dom"
import { ExampleImpure } from "./components/Example"
import * as A from "@async-jobs/core"

ReactDOM.render(
  <ExampleImpure color="#345345" />,
  document.getElementById(`root`)
)
