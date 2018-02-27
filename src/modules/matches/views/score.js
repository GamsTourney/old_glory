import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Sortable from 'react-sortablejs'
import { fetchPlayers } from 'modules/players/actions'

import ScoreCard from '../components/score_card'
import { fetchMatch, postScores } from '../actions'
import {
  selectMatchId,
  selectMatch,
  selectMatchPlayersWithResults
} from '../selectors'
import '../styles.css'

const PlayerCards = ({ matchId, players }) => {
  return players.map(player => (
    <ScoreCard key={player.id} matchId={matchId} player={player} />
  ))
}

class MatchScore extends PureComponent {

  constructor(props) {
    super(props)
    this.onChangeOrder = this.onChangeOrder.bind(this)
  }

  componentDidMount() {
    const { matchId } = this.props
    this.props.actions.fetchMatch(matchId)
    this.props.actions.fetchPlayers()
  }

  onChangeOrder(order, sortable, event) {
    const { matchId } = this.props
    sortable.sort(order)
    this.props.actions.postScores(matchId, order)
  }

  render() {
    const { matchId, matchData, players } = this.props
    const game = matchData.game || {}

    return (
      <div className='score-sorter'>
        <h4>{game.name} ({matchData.id})</h4>
        <Sortable
          onChange={this.onChangeOrder}
          options={{
            dataIdAttr: 'player'
          }}
        >
          <PlayerCards matchId={matchId} players={players}/>
        </Sortable>
      </div>
    )
  }
}

MatchScore.propTypes = {
  actions: PropTypes.object.isRequired,
  matchData: PropTypes.object
}

MatchScore.defaultProps = {
  matchData: null
}

function mapStateToProps(state, props) {
  return {
    matchId: selectMatchId(state, props),
    matchData: selectMatch(state, props),
    players: selectMatchPlayersWithResults(state, props)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      fetchMatch,
      fetchPlayers,
      postScores
    }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchScore)
