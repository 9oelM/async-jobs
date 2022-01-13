const NETWORK_REQUEST_MAXIMUM_ANIMATION_DURATION_MS = 20_000

export const Constants = {
  NETWORK_REQUEST_MAXIMUM_ANIMATION_DURATION_MS,
  IS_PRODUCTION: process.env[`NODE_ENV`] === `production`,
}
// export const useMakeExampleRequests: () => Promise<
//   TcResult<string, Error>
// >[] = () => {
//   return [
//     API.sendExampleRequest({}),
//     new Promise((resolve) => {
//       return wait(2000).then(() =>
//         resolve(API.sendExampleRequest({ timeout_secs: 1 }))
//       )
//     }),
//     API.sendExampleRequest({ timeout_secs: 1 }),
//     API.sendExampleRequest({ timeout_secs: 3 }),
//     new Promise((resolve) => {
//       return wait(5000).then(() =>
//         resolve(API.sendExampleRequest({ timeout_secs: 4, make_error: true }))
//       )
//     }),
//     API.sendExampleRequest({ timeout_secs: 4 }),
//     API.sendExampleRequest({ timeout_secs: 5, make_error: true }),
//     API.sendExampleRequest({ timeout_secs: 7, make_error: true }),
//     API.sendExampleRequest({ timeout_secs: 9 }),
//   ]
// }
