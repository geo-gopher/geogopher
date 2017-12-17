/*global window.google*/
import React from 'react';
import { Button, Checkbox } from 'semantic-ui-react';
import GameSettings from './GameSettings';
import GameStart from './GamesStart';
import GameOver from './GameOver';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  sanitizeInput,
  countdownGameLogic,
  toggleMissingCountries,
  mapDetails,
  getRandomUnansweredPolygon
} from '../utils/index';

import {
  initializeNewGame,
  decrementTime,
} from '../actions/Game.actions';

let map;

@connect((state) => {
  return {

    //pre game data
    userName: 'SenecaTheYounger',
    userID: 1,
    countGamesPlayed: 10,
    token: null,
    lastLogin: null,

    //game settings
    gameSelected: state.GameReducer.gameSelected,
    gameJSON: state.GameReducer.gameJSON,
    gameCenterCoords: state.GameReducer.gameCenterCoords,
    gameZoom: state.GameReducer.gameZoom,
    maxCountPolygons: state.GameReducer.maxCountPolygons,
    gameTypeSelected: state.GameReducer.gameTypeSelected,
    gameDifficultySelected: state.GameReducer.gameDifficultySelected,
    gameData: state.GameReducer.gameData,

    //score data
    countPolygonsEntered: state.ScoreReducer.countPolygonsEntered,
    countTotalSubmissions: state.ScoreReducer.countTotalSubmissions,
    polygonsAnswered: state.ScoreReducer.polygonsAnswered,
    polygonsUnanswered: state.ScoreReducer.polygonsUnanswered,
    incorrectEntries: state.ScoreReducer.incorrectEntries,
    gameTimerStart: state.ScoreReducer.gameTimerStart,
    gameTimerRemaining: state.ScoreReducer.gameTimerRemaining,
    gameStartTimestamp: state.ScoreReducer.gameStartTimestamp,
    gameEndTimestamp: state.ScoreReducer.gameEndTimestamp,
    ipWhereGamePlayed: state.ScoreReducer.ipWhereGamePlayed,

  }
})

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      userQuit: false,
      renderMissingCountriesButton: false,
      gameSettings: true,
      gameStart: false,
      gameEnd: false,
    }
    this.incrementer = null;
    this.onInputChange = this.onInputChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleSettings = this.handleSettings.bind(this);
    this.handleQuit = this.handleQuit.bind(this);
    this.isEnd = this.isEnd.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.showMarkers = this.showMarkers.bind(this);
  }

  componentDidMount() {

    if (this.props.gameSelected === 'Countdown'){}
    //initialize new google map and place it on '#map'
    map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: this.props.gameZoom,
      center: {
        lat: this.props.gameCenterCoords[0],
        lng: this.props.gameCenterCoords[1],
      },
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_CENTER
      },
      streetViewControl: false,
      mapTypeControl: false,
      mapTypeId: 'roadmap',
      //turn off all country names and labels
      styles: mapDetails
    });
    //load in coordinate data with country name information
    map.data.loadGeoJson(this.props.gameJSON);
    //set all loaded coordinate data to a red fill color with no stroke
    map.data.setStyle({
      fillColor: 'firebrick',
      fillOpacity: '.6',
      strokeColor: 'orange',
      strokeWeight: '1'
    });
    //build gameData in redux and stores as this.props.gameData
    this.props.dispatch(
      initializeNewGame(this.props.gameJSON)
    );

  }
  //on quit, set change game state and clear timer
  handleQuit() {
    this.setState({
      userQuit: true,
      gameEnd : true });
    clearInterval(this.incrementer);
  }
  //stores game settings and opens gameStart
  handleSettings() {
    //once settings are submitted, hide modal. this also prompts the gameStart modal to render
    this.setState({gameSettings: false})
    //show button that renders missing countries if gameSelected is Countdown
    if (this.props.gameTypeSelected === 'Countdown') {
      this.setState({renderMissingCountriesButton: true})
    }
  }
  //on start focus client cursor to answerInput field and start timer?
  handleStart() {
    //focuses cursor in input-entry when user clicks 'start'
    this.nameInput.focus();
    //hides gameStart modal
    this.setState({gameStart: true})
    //starts timer
    this.incrementer = setInterval( () =>
      this.props.dispatch(
        decrementTime(this.props.gameTimerRemaining)
      ), 1000);
    //initializes random country selector if game is not countdown
    if (this.props.gameTypeSelected !== 'Countdown') {
      let polygonInData = getRandomUnansweredPolygon(this.props.gameData)
      map.setZoom(6)
      map.setCenter({lat: polygonInData.countryCenter[0], lng: polygonInData.countryCenter[1]})
      let polygonInMap = map.data.getFeatureById(polygonInData.id)
      map.data.overrideStyle(polygonInMap, {strokeColor: '#99FF00', strokeWeight: '3'})
    }
  }
  //closes gameStart modal onClick
  handleClose(){
    this.setState({ open: false });
    this.props.history.push('/');
  }
  //registers inputs entered into input field
  onInputChange(e) {
    this.setState({ inputValue: e.target.value })
  }
  //resets timer and returns gameOver modal
  isEnd() {
    if(this.state.gameTimerRemaining === 0) {
      clearInterval(this.incrementer);
      return <GameOver onClose={ this.handleClose } open={this.state.gameOver}/>
    }
  }
  //keypress checks if key is 'enter'. registers value against answers and clears input
  keyPress(e) {
    // map.setCenter({lat:24,lng:-76}) this will dynamically change map center

    if(e.keyCode == 13){
      console.log(e.target.value)
        let gameTypeSelected = this.props.gameTypeSelected
        console.log(gameTypeSelected)
        let answerSubmitted = e.target.value;
        //clear text input after user hits enter
        this.setState({inputValue: ''});
        //sanitize input to all lowercase and remove '.'
        let answerSanitized = sanitizeInput(answerSubmitted);
        //check answer for countdown game

        if (gameTypeSelected === 'Countdown') {

          countdownGameLogic(
            map,
            this.props.gameData,
            answerSanitized,
            this.props.countPolygonsEntered,
            this.props.countTotalSubmissions,
            this.props.incorrectEntries,
            this.props.dispatch
          )

        } else if ( gameTypeSelected === 'Name The Country') {

        } else if ( gameTypeSelected === 'Capital to Country') {

        } else if ( gameTypeSelected === 'Country to Capital') {

        }

      //end keystroke if statement
      }
  //end keypress function
  }

  showMarkers(e) {
    this.setState({showMissingCountries: true})
    toggleMissingCountries(
      this.state.showMissingCountries,
      this.props.gameData,
      map,
    );
    setInterval( () => {
      this.setState({showMissingCountries: false})
    }, 3000);



  }

  render() {
    return (
      <div className="container">
        <div className="game-controls">

        <GameSettings
          onClose={ this.handleClose }
          onContinue={this.handleSettings}
          open={this.state.gameSettings}
        />

        <GameStart
          onClose={ this.handleClose }
          onStart={this.handleStart}
          open={!this.state.gameSettings && !this.state.gameStart}
        />

        <div className="game-title">
          <h1>{ this.props.gameSelected }</h1>
          <h2>{ this.props.gameTypeSelected+" | "+this.props.gameDifficultySelected }</h2>
        </div>

        {
          this.state.renderMissingCountriesButton
          ?
          <div className="show-missing-countries-button">
            <Checkbox checked={this.state.showMissingCountries} onClick={ this.showMarkers }toggle />
          </div>
          : null
        }

        <div className="time-remaining-title">
          <h1> Time Remaining:</h1>
        </div>

        <div className="time-remaining">
          <h1> {this.props.gameTimerRemaining} </h1>
        </div>

        <div className="countries-answered">
          <h1> Countries Answered:</h1>
          <h2> {this.props.countPolygonsIdentified}/{this.props.maxCountPolygons}  </h2>
        </div>

        <input
          className="input-entry"
          ref={(input) => { this.nameInput = input; }}
          onChange={ this.onInputChange }
          onKeyDown={this.keyPress}
          value={ this.state.inputValue }>
        </input>

        {this.isEnd()}

        <Button className="quit-game-btn" onClick={this.handleQuit}>Quit Game</Button>

        {
          this.state.quit ?
          <GameOver onClose={ this.handleClose } open={this.props.gameOver}/>
          :
            null
        }

        <div className="maps" id="map"></div>
      </div>
      </div>
      );
  }
}
