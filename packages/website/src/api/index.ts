import { Constants } from "../constants"
import { tcAsync, TcResult } from "../utilities/essentials"

export class API {
  static baseUrl = Constants.IS_PRODUCTION
    ? `https://example-api-six.vercel.app`
    : `http://localhost:3000`

  static async sendExampleRequest({
    timeout_secs = 0,
    make_error = false,
  }: {
    timeout_secs?: number
    make_error?: boolean
  }): Promise<TcResult<string, Error>> {
    return tcAsync(
      window
        .fetch(
          `${API.baseUrl}/api/main?timeout_secs=${timeout_secs}&make_error=${make_error}`
        )
        .then((response) => {
          if (response.ok) {
            return response.text()
          } else {
            throw new Error(`Error happened: ${response.statusText}`)
          }
        })
    )
  }
}
