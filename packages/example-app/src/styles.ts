import { CSSProperties } from "react"

// /* Color Theme Swatches in Hex */
// .Playful-1-hex { color: #F2D0D9; }
// .Playful-2-hex { color: #8C5D6E; }
// .Playful-3-hex { color: #A0CED9; }
// .Playful-4-hex { color: #F2CC85; }
// .Playful-5-hex { color: #BF7256; }
// /* Color Theme Swatches in RGBA */
// .Playful-1-rgba { color: rgba(242, 208, 217, 1); }
// .Playful-2-rgba { color: rgba(140, 92, 110, 1); }
// .Playful-3-rgba { color: rgba(160, 206, 216, 1); }
// .Playful-4-rgba { color: rgba(242, 204, 133, 1); }
// .Playful-5-rgba { color: rgba(191, 114, 86, 1); }

// /* Color Theme Swatches in HSLA */
// .Playful-1-hsla { color: hsla(343, 57, 88, 1); }
// .Playful-2-hsla { color: hsla(337, 20, 45, 1); }
// .Playful-3-hsla { color: hsla(191, 42, 73, 1); }
// .Playful-4-hsla { color: hsla(39, 81, 73, 1); }
// .Playful-5-hsla { color: hsla(16, 45, 54, 1); }
export const Colors = {
  pink: `rgba(242, 208, 217, 1)`,
  brown: `rgba(140, 92, 110, 1)`,
  skyBlue: `rgba(160, 206, 216, 1)`,
  yellow: `rgba(242, 204, 133, 1)`,
  lightOrange: `rgba(191, 114, 86, 1)`,
}

export const Styles = {
  bgPink: {
    background: Colors.pink,
  },
  bgBrown: {
    background: Colors.brown,
  },
  bgSkyBlue: {
    background: Colors.skyBlue,
  },
  bgYellow: {
    background: Colors.yellow,
  },
  bgLightOrange: {
    background: Colors.lightOrange,
  },
  colorPink: {
    color: Colors.pink,
  },
  colorBrown: {
    color: Colors.brown,
  },
  colorSkyBlue: {
    color: Colors.skyBlue,
  },
  colorYellow: {
    color: Colors.yellow,
  },
  colorLightOrange: {
    color: Colors.lightOrange,
  },
  flex: {
    display: `flex`,
  },
  inlineBlock: {
    display: `inline-block`,
  },
  fullWH: {
    width: `100%`,
    height: `100%`,
  },
  fullW: {
    width: `100%`,
  },
  smallMargin: {
    margin: `0.5rem`,
  },
  mediumMargin: {
    margin: `1rem`,
  },
  largeMargin: {
    margin: `2rem`,
  },
  smallPadding: {
    padding: `0.5rem`,
  },
  mediumPadding: {
    padding: `1rem`,
  },
  largePadding: {
    padding: `2rem`,
  },
  smallFontSize: {
    fontSize: `1rem`,
  },
  mediumFontSize: {
    fontSize: `1.5rem`,
  },
  largeFontSize: {
    fontSize: `2rem`,
  },
  smallRounded: {
    borderRadius: `0.25rem`,
  },
  mediumRounded: {
    borderRadius: `0.5rem`,
  },
  largeRounded: {
    borderRadius: `1rem`,
  },
  cursorPointer: {
    cursor: `pointer`,
  },
}

const normalizedStyles = {
  margin: 0,
  padding: 0,
}

export function pickStyles(...args: Array<keyof typeof Styles>): CSSProperties {
  const initial: CSSProperties = {}
  return args.reduce((acc, key) => {
    return { ...normalizedStyles, ...acc, ...Styles[key] }
  }, initial)
}
