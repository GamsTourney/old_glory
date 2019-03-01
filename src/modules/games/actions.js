import { request } from "../../actions/api"

function fetchGames(tournamentId) {
  return request('games', `/tournaments/${tournamentId}/games?include=scores`)
}

function fetchMatchesForGame(tournamentId, id) {
  return request('matches', `/tournaments/${tournamentId}/games/${id}/matches?include=results`)
}

function fetchGame(id) {
  return request('games', `/games/${id}?include=scores`)
}

function fetchGameScores(id) {
  return request('scores', `/games/${id}/scores`)
}

export {
  fetchGame,
  fetchGames,
  fetchMatchesForGame,
  fetchGameScores
}
