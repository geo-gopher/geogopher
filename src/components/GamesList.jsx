/*
 * src/components/GamesList.jsx
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'semantic-ui-react';
import { Card, Image } from 'semantic-ui-react';
import { selectGame, userActions, setScoreIDs, fetchGamesList, fetchGameSettings, setTimer, setBaseTime } from '../actions/index'
import { Motion, spring } from 'react-motion';


//temporarily pull in thumbs. need to display these from S3 and pull in get request later on
const thmb0 = require('-!file-loader?name=world-thumb!../assets/world-thumb.png');
const thmb1 = require('-!file-loader?name=north-africa-and-middle-east-thumb!../assets/north-africa-and-middle-east-thumb.png');
const thmb2 = require('-!file-loader?name=europe-thumb!../assets/europe-thumb.png');
const thmb3 = require('-!file-loader?name=sub-saharan-africa-thumb!../assets/sub-saharan-africa-thumb.png');
const thmb4 = require('-!file-loader?name=carribean-thumb!../assets/carribean-thumb.png');
const thmb5 = require('-!file-loader?name=south-america-thumb!../assets/south-america-thumb.png');
const thmb6 = require('-!file-loader?name=russia-and-central-asia-thumb!../assets/russia-and-central-asia-thumb.png');
const thmb7 = require('-!file-loader?name=south-pacific-thumb!../assets/south-pacific-thumb.png');
const thmb8 = require('-!file-loader?name=east-asia-thumb!../assets/east-asia-thumb.png');
const thmb9 = require('-!file-loader?name=north-america-thumb!../assets/north-america-thumb.png');
const thmbArr = [thmb0, thmb1, thmb2, thmb3, thmb4, thmb5, thmb6, thmb7, thmb8, thmb9];

@connect((state, ownProps) => {
  return {
    //take out of redux
    games: state.GamesListReducer.availableGames,
    user: state.UserReducer.user
  }
})

class GamesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,

    };
    this.onGameSelect = this.onGameSelect.bind(this);

  }

  componentDidMount() {
    this.props.dispatch(fetchGamesList());
    //get game settings options queued up
    this.props.dispatch(fetchGameSettings());
  }


  onGameSelect(gameSelected) {
      //dispatch game selection over to map
      this.props.dispatch(selectGame(this.props.games[gameSelected]));
      //set score with settings chosen this far
      this.props.dispatch(setScoreIDs(this.props.games[gameSelected]))
      //set base time before modifications in settings are made
      this.props.dispatch(setBaseTime(this.props.games[gameSelected].base_time))

      // check to see if a user has logged in already
      if(this.props.user) {
        // If a user exists, map the user to the game screen
        this.props.history.push('/map');
      } else {
        // Otherwise, send them to login
      this.props.history.push('/login');
      }
    }




  render() {
    const {games} = this.props;
    
    return (


      <div className="home-page-container">

        <div className="splash">
          <h1>KNOW YOUR GLOBE</h1>
          <h4> It's important stuff..This is the future space for our splash component</h4>
        </div>


        <div className="countries-title">
          <h1>Countries</h1>
          <h3>Choose a region to begin</h3>
        </div>


        <div className="countries-list">


            {
              games.map(

                (game, index) => (

                  <Card key={index} >
                    <Image src={thmbArr[index]}
                          onClick={() => this.onGameSelect(index)}
                        />
                    <Card.Content
                      onClick={() => this.onGameSelect(index)}
                      >
                      <Card.Header>
                        {game.game_name}
                      </Card.Header>
                      <Card.Description>
                        {game.game_description}
                      </Card.Description>
                    </Card.Content>

                  </Card>

                )
            ) }




      </div>

    </div>
      );
  }
}

export default GamesList;
