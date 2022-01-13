import React, { useCallback, useEffect, useState } from "react"
import { pickStyles } from "../styles"
import { enhance } from "../utilities/essentials"
import * as clipboard from "clipboard-polyfill/text"

export const Code = enhance<{
  title?: string
  code: string
}>(({ title, code }) => {
  const [isCopiedToClipboard, setCopiedToClipboard] = useState(false)
  const onClickCode = useCallback(() => {
    if (isCopiedToClipboard) return
    clipboard.writeText(code).then(
      () => {
        setCopiedToClipboard(true)
        console.log(`success!`)
      },
      () => {
        console.log(`error!`)
      }
    )
  }, [code, isCopiedToClipboard])

  useEffect(() => {
    if (!isCopiedToClipboard) return

    setTimeout(() => {
      setCopiedToClipboard(false)
    }, 5000)
  }, [isCopiedToClipboard])

  return (
    <pre style={pickStyles(`cursorPointer`)} onClick={onClickCode}>
      {title ? <pre style={pickStyles(`colorBrown`)}>{title}</pre> : null}
      {isCopiedToClipboard ? (
        <div
          style={{
            position: `absolute`,
            left: `50%`,
          }}
        >
          <div
            style={{
              position: `relative`,
              left: `-50%`,
              ...pickStyles(`bgPink`, `smallPadding`, `smallMargin`),
            }}
          >
            Copied
          </div>
        </div>
      ) : null}
      <code>{code}</code>
    </pre>
  )
})()
