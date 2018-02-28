import { createSelector } from 'reselect'
import { get } from 'lodash/object'
import { filter, find, orderBy } from 'lodash/collection'
import {
  selectMatches,
  selectTournaments,
  selectPlayers,
  selectGames
} from 'selectors/collections'

const selectTournamentId = (state, props) => get(props, 'match.params.id') || props.tournamentId

const selectTournament = createSelector(
  selectTournaments,
  selectTournamentId,
  (tournaments, tournamentId) => tournaments[tournamentId] || {}
)

const selectTournamentStandings = createSelector(
  selectTournament,
  (tournament) => tournament.standings || []
)

const selectTournamentStandingsForChart = createSelector(
  selectTournamentStandings,
  selectPlayers,
  (standings, players) => (
    standings.map((standing) => {
      const player = find(players, player => `${player.id}` === `${standing.player}`)
      if (player) {
        const firstName = player.name.split(' ')[0]
        return { name: firstName, score: standing.score }
      }
      return {}
    })
  )
)

const selectTournamentMatches = createSelector(
  selectTournamentId,
  selectMatches,
  (tournamentId, matches) => filter(matches, match => `${match.tournament_id}` === `${tournamentId}`)
)

const selectUpcomingMatches = createSelector(
  selectTournamentMatches,
  (matches) => {
    const unfinished = filter(matches, match => !match.completed && !match.hidden)
    const sorted = orderBy(unfinished, ['start_time'], ['asc'])
    return sorted.slice(0, 6)
  }
)

const selectTournamentMatchesByPlayer = createSelector(
  selectTournamentMatches,
  (matches) => {
    const schedule = {}
    matches.forEach((match) => {
      const { player_ids } = match
      player_ids.forEach((player) => {
        if (schedule[player]) {
          schedule[player].push(match)
        } else {
          schedule[player] = [match]
        }
      })
    })
    return schedule
  }
)

const selectTimelineData = createSelector(
  selectPlayers,
  selectGames,
  selectTournamentMatchesByPlayer,
  (players, games, playerMatches) => {
    const rows = []
    Object.keys(playerMatches).forEach((playerId) => {
      const player = find(players, player => `${player.id}` === `${playerId}`) || {}
      playerMatches[playerId].forEach((match) => {
        if (!match.hidden) {
          const game = find(games, game => `${game.id}` === `${match.game_id}`) || {}
          const row = [
            player.name,
            game.name,
            new Date(match.start_time),
            new Date(match.end_time)
          ]
          rows.push(row)
        }
      })
    })
    return rows
  }
)

export {
  selectTournament,
  selectTournamentMatches,
  selectUpcomingMatches,
  selectTournamentMatchesByPlayer,
  selectTimelineData,
  selectTournamentStandingsForChart
}
