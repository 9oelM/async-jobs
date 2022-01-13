import React, { useEffect } from "react"
import { pickStyles } from "./styles"
import { Provider } from "react-redux"
import { store } from "./redux/store"
import hljs from "highlight.js/lib/core"
import javascript from "highlight.js/lib/languages/javascript"
import { WithRedux } from "./sections/WithRedux/WithRedux"
import { Code } from "./components/Code"
hljs.registerLanguage(`javascript`, javascript)

export const App = () => {
  useEffect(() => {
    hljs.highlightAll()
  }, [])

  return (
    <main
      style={{
        ...pickStyles(`bgPink`, `fullW`, `smallPadding`),
      }}
    >
      <h1
        style={{
          ...pickStyles(`colorBrown`, `largeFontSize`, `fullW`),
          textAlign: `center`,
        }}
      >
        async-jobs
      </h1>
      <div style={pickStyles(`mediumMargin`)}>
        <h2
          style={pickStyles(`colorBrown`, `mediumFontSize`)}
          id="installation"
        >
          Installation
        </h2>
        <div style={pickStyles(`mediumMargin`)} />
        <Code code="npm i --save @async-jobs/core" />
        <div style={pickStyles(`smallMargin`)} />
        <Code code="yarn add @async-jobs/core" />
      </div>
      <Provider store={store}>
        <WithRedux />
      </Provider>
      <div style={pickStyles(`mediumMargin`)}>
        <h2 style={pickStyles(`colorBrown`, `mediumFontSize`)}>Recipes</h2>
        <p>
          Visit{` `}
          <a
            href="https://github.com/9oelM/async-jobs#readme"
            target="_blank"
            rel="noreferrer"
          >
            the repository for recipes for the use with:
          </a>
          <ul>
            <li>Redux</li>
            <li>Recoil</li>
            <li>Vanilla javascript</li>
          </ul>
        </p>
      </div>
    </main>
  )
}
