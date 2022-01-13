import { createJobSet } from "@async-jobs/core"

enum AsyncJobNames {
  EXAMPLE_API = `EXAMPLE_API`,
}

export const exampleApiJobSet = createJobSet(AsyncJobNames.EXAMPLE_API)
