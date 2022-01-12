import React, { useEffect } from "react"
import { pickStyles } from "./styles"
import { Provider } from "react-redux"
import { store } from "./redux/store"
import hljs from "highlight.js/lib/core"
import javascript from "highlight.js/lib/languages/javascript"
import { WithRedux } from "./sections/WithRedux"
hljs.registerLanguage(`javascript`, javascript)

export const App = () => {
  useEffect(() => {
    hljs.highlightAll()
  }, [])

  return (
    <main style={pickStyles(`bgPink`, `fullWH`, `smallPadding`)}>
      <h1 style={pickStyles(`colorBrown`, `largeFontSize`)}>async-jobs</h1>
      <div style={pickStyles(`mediumMargin`)} />
      <h1 style={pickStyles(`colorBrown`, `mediumFontSize`)}>With Redux</h1>
      <Provider store={store}>
        <WithRedux />
      </Provider>
    </main>
  )
}
