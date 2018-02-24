import { createSelector } from 'reselect'
import { get } from 'lodash/object'
import { filter, find } from 'lodash/collection'
import { selectMatches, selectPlayers } from 'selectors/collections'

const selectMatchId = (state, props) => get(props, 'match.params.id') || props.matchId
const selectPlayerId = (state, props) => get(props, 'player.id')

const selectMatch = createSelector(
  selectMatches,
  selectMatchId,
  (matches, matchId) => matches[matchId] || {}
)

const selectMatchPlayerIds = createSelector(
  selectMatch,
  (match) => {
    const matchPlayers = match.players || []
    return matchPlayers.map(player => player.id)
  }
)

const selectMatchPlayers = createSelector(
  selectMatch,
  selectPlayers,
  selectMatchPlayerIds,
  (match, players, matchPlayers) => filter(players, player => matchPlayers.includes(player.id))
)

const selectMatchResults = createSelector(
  selectMatch,
  (match) => match.results
)

const selectPlayerResults = createSelector(
  selectMatchResults,
  selectPlayerId,
  (results, playerId) => find(results, result => result.player_id === playerId)
)

export {
  selectMatchId,
  selectMatch,
  selectMatchPlayers,
  selectPlayerResults
}
