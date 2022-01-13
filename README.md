# async-jobs

_For the paranoids of async jobs in javascript._

- Track, manage, access all async jobs.
- Best used for multiple, long running, error-prone jobs (network requests, web workers, etc).
- Strictly typed everywhere with Typescript. 
- Usable for both Redux and non-redux applications.
- Recipes included.

# Usage with Redux

Before you begin, you need to create `async` reducer in your existing redux store. This is going to be the single source of truth for all of your async jobs:

```javascript
import { combineReducers, createStore } from "redux"
import { asyncReducer } from '@async-jobs/core';

const rootReducer = combineReducers({
  async: asyncReducer,
  otherReducers: reducer1,
  ...
})

export const store = createStore(rootReducer)
```

## The 'Vanilla Redux' way

This is the most fundamental way to use `async-jobs` in a Redux application, although it is not the recommended way. This is not recommended because side effects reside in the component but redux middleware, which means it is almost equivalent to using a local `useState`. But it does the job - it can track the async request and it is stored in redux, accessible from anywhere else too. You get the idea.

```javascript
import React from 'react'
import { useDispatch } from 'react-redux'
import { createJobSet } from '@async-jobs/core'

const AsyncJobNames = Object.freeze({
  POST_BOOK_FLIGHT_TICKET: `POST_BOOK_FLIGHT_TICKET`,
})

export const postBookFlightTicketJobSet = createJobSet(AsyncJobNames.POST_BOOK_FLIGHT_TICKET)

const BookFlightPage = ({ destination, username }) => {
  const bookFlightTicketStartRequest = useRef(postBookFlightTicketJobSet.start({
    payload: {
      destination,
      username,
    }
  }))
  const dispatch = useDispatch()
  const currentAsyncJob = useSelector((s) => asyncJobByIdSelector(s, bookFlightTicketStartRequest.current.id))
  
  useEffect(() => {
    dispatch(bookFlightTicketStartRequest.current)
    let hasError = false
    let postBookFlightTicketResult = null
    try {
      postBookFlightTicketResult = await API.bookFlightTicket({ method: `POST`, body: bookFlightTicketStartRequest.current.payload })
    } catch (err) {
      dispatch(postBookFlightTicketJobSet.fail({ id: bookFlightTicketStartRequest.current.id, payload: err })
      hasError = Boolean(err)
    }
    if (!hasError) {
      dispatch(postBookFlightTicketJobSet.succeed({ id: bookFlightTicketStartRequest.current.id, payload: postBookFlightTicketResult }))
    }
  }, [])
  
  return <div>{(() => {
    switch (currentAsyncJob.status) {
      case AsyncJobStatus.PENDING:
        return <div>Pending</div>
      case AsyncJobStatus.SUCCESS:
        return <div>Success</div>
      case AsyncJobStatus.FAIL:
        return <div>Failed</div>
      case AsyncJobStatus.CANCELED:
        return <div>Canceled</div>
      default:
        return <div>Unknown</div>
    }
  })()}</div>
}
```

## The 'Vanilla Redux middleware' way
This method uses vanilla redux middleware without any other dependencies like `redux-thunk`. Not so many people will want to use this method, but it is still a good option.

First, create `postBookFlightTicketMiddleware`:

```js
import { AsyncJobActions, createJobSet } from '@async-jobs/core'

export const AsyncJobNames = Object.freeze({
  POST_BOOK_FLIGHT_TICKET: `POST_BOOK_FLIGHT_TICKET`,
})

export const postBookFlightTicketJobSet = createJobSet(AsyncJobNames.POST_BOOK_FLIGHT_TICKET)

const postBookFlightTicketMiddleware = store => next => action => {
  if (!isSpecificAsyncActionType(action, AsyncJobActions.START, AsyncJobNames.POST_BOOK_FLIGHT_TICKET)) {
    return next(action)
  }
  const { payload, id } = action

  API.bookFlightTicket({ method: `POST`, body: payload })
    .then((postBookFlightTicketResult) => {
        next(postBookFlightTicketJobSet.succeed({ id, payload: postBookFlightTicketResult }))
    })
    .catch((err) => {
        next(postBookFlightTicketJobSet.fail({ id, payload: err }))
    })

  return next(action)
}
```

Then, insert the middleware into your store:

```javascript
import { combineReducers, createStore } from "redux"
import { asyncReducer } from '@async-jobs/core';
import { postBookFlightTicketMiddleware } from './postBookFlightTicketMiddleware'

const rootReducer = combineReducers({
  async: asyncReducer,
  otherReducers: reducer1,
  ...
})

const store = createStore(
  rootReducer,
  applyMiddleware(
    postBookFlightTicketMiddleware,
  )
)
```

Now, all you have to do is to subscribe to the redux store in your component:

```js
import React from 'react'
import { useDispatch } from 'react-redux'


const BookFlightPage = ({ destination, username }) => {
  const dispatch = useDispatch()
  const currentAsyncJob = useSelector((s) => asyncJobByIdSelector(s, bookFlightTicketStartRequest.current.id))
  
  useEffect(() => {
    dispatch(postBookFlightTicketJobSet.start({
      payload: {
        destination,
        username,
      }
    }))
  }, [])
  
  return <div>{(() => {
    switch (currentAsyncJob.status) {
      case AsyncJobStatus.PENDING:
        return <div>Pending</div>
      case AsyncJobStatus.SUCCESS:
        return <div>Success</div>
      case AsyncJobStatus.FAIL:
        return <div>Failed</div>
      case AsyncJobStatus.CANCELED:
        return <div>Canceled</div>
      default:
        return <div>Unknown</div>
    }
  })()}</div>
}
```


# Typescript

# Full API Reference