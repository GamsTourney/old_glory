import initialState from 'store/initial'
import { API_FETCH, API_RECEIVE } from 'actions/api'

export default function tournaments(state = initialState.tournaments, action) {
  let newState
  switch (action.type) {
    case API_FETCH:
      return action
    case API_RECEIVE:
      newState = action.tournaments || state
      return newState
    default:
      return state
  }
}
