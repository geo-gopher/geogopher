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
  nameTheCountryGameLogic,
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
      highlightedPolygon: null,
    }
    this.incrementer = null;
    this.onInputChange = this.onInputChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleSettings = this.handleSettings.bind(this);
    this.handleGameEnd = this.handleGameEnd.bind(this);
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
  handleGameEnd() {
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

    //pack gameValues for game init
    let gameValues = {

      map: map,
      countPolygonsEntered: this.props.countPolygonsEntered,
      countTotalSubmissions: this.props.countTotalSubmissions,
      incorrectEntries: this.props.incorrectEntries,
      dispatchFcn: this.props.dispatch,
      gameData: this.props.gameData,
      reactThis: this,
      highlightedPolygon: this.state.highlightedPolygon,

    }

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
      nameTheCountryGameLogic(gameValues)
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
      console.log('this.state.gameEnd')
      console.log(this.state.gameEnd)
      let submission = e.target.value;
      //clear text input after user hits enter
      this.setState({inputValue: ''});
      //sanitize input to all lowercase and remove '.'
      let submissionSanitized = sanitizeInput(submission);
      let gameTypeSelected = this.props.gameTypeSelected;

      // build game values object to pass into game logic
      let gameValues = {

        submissionSanitized: submissionSanitized,
        map: map,
        countPolygonsEntered: this.props.countPolygonsEntered,
        countTotalSubmissions: this.props.countTotalSubmissions,
        incorrectEntries: this.props.incorrectEntries,
        dispatchFcn: this.props.dispatch,
        gameData: this.props.gameData,
        reactThis: this,
        highlightedPolygon: this.state.highlightedPolygon,
        handleGameEnd: this.handleGameEnd,

      }

      //check answer for countdown game
      if (gameTypeSelected === 'Countdown') {

        countdownGameLogic(gameValues);

      } else if ( gameTypeSelected === 'Name the Country') {

        nameTheCountryGameLogic(gameValues, this.state.highlightedPolygon);


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

        <GameOver
          onClose={ this.handleClose }
          onStart={this.handleStart}
          open={this.state.gameEnd}
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
          <h2> {this.props.countPolygonsEntered}/{this.props.maxCountPolygons}  </h2>
        </div>

        <input
          className="input-entry"
          ref={(input) => { this.nameInput = input; }}
          onChange={ this.onInputChange }
          onKeyDown={this.keyPress}
          value={ this.state.inputValue }>
        </input>


        <Button className="quit-game-btn" onClick={this.handleGameEnd}>Quit Game</Button>


        <div className="maps" id="map"></div>
      </div>
      </div>
      );
  }
}
