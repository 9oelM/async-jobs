import type { VercelRequest, VercelResponse } from "@vercel/node"

function isPositiveInt(value) {
  return /^\d+$/.test(value)
}

function makeId(length) {
  let result = ``
  const characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export default async (request: VercelRequest, response: VercelResponse) => {
  const { timeout_secs, make_error } = request.query

  for (const key of Object.keys(request.query)) {
    if (key !== `timeout_secs` && key !== `make_error`) {
      response.status(400).send(`Invalid query parameter: ${key} ${makeId(10)}`)
      return
    }
  }

  if (timeout_secs && !isPositiveInt(timeout_secs)) {
    response
      .status(400)
      .send(`timeout_secs must be a positive integer ${makeId(10)}`)
    return
  }

  await new Promise((resolve) => {
    if (timeout_secs && !Array.isArray(timeout_secs)) {
      const timeout_s = parseInt(timeout_secs)
      console.log(timeout_s)
      setTimeout(() => {
        resolve(0)
        return
      }, 1000 * timeout_s)
    } else {
      resolve(0)
    }
  })

  if (make_error) {
    response.status(500).send(`Error ${makeId(10)}`)
    return
  }

  response.status(200).send(`Hello ${makeId(10)}`)
}
