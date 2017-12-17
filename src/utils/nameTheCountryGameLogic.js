import { getRandomUnansweredPolygon } from './index'

import {
 submitCorrectEntry,
 submitIncorrectEntry,
 incrementTotalSubmissions,
} from '../actions/Score.actions';

export const nameTheCountryGameLogic = (gameValues, highlightedCountry) => {


  //if a highlighted country has not been passed in, then it came from Map's handleStart
  if (!highlightedCountry) {
    //set highlightedCountry to randomPolygon in gameData
    let highlightedCountry = (getRandomUnansweredPolygon(gameValues.gameData))

    if(Object.prototype.toString.call(highlightedCountry) === '[object Undefined]'){
      console.log('I HAVE NO CLUE WHY ITS UNDEFINED BUT LETS RUN IT AGAIN')
      nameTheCountryGameLogic(gameValues)
    }
    // set the zoom (probably need to fix this at some point)
    gameValues.map.setZoom(6)
    // set the map center to the coordinates of the randomly selected polygon
    gameValues.map.setCenter({ lat: highlightedCountry.countryCenter[0], lng: highlightedCountry.countryCenter[1] })
    // get the polygon in the map
    let polygonInMap = gameValues.map.data.getFeatureById(highlightedCountry.id)
    //modify the colors of polygon in the map
    gameValues.map.data.overrideStyle(polygonInMap, { fillColor: '#00FFFF', strokeColor: '#FFD700', strokeWeight: '3' })
    //set state to keep highlighted polygon in global scope
    gameValues.reactThis.setState({highlightedPolygon: highlightedCountry})
    return;
  } else {
    //declare logic variables
    let answerCorrect = false;
    let moreCountriesLeft = false

    //if a highlightedCountry does exist, loop through its accepted answers
    highlightedCountry.acceptedAnswers.forEach((el) => {
      //if user input matches an acceptable answer
      if (gameValues.submissionSanitized === el) {
        //get the polygon in the map
        let polygonInMap = gameValues.map.data.getFeatureById(highlightedCountry.id)
        //modify the colors of polygon in the map
        gameValues.map.data.overrideStyle(polygonInMap, { fillColor: '#7FF000', strokeColor: '#FFD700', strokeWeight: '3' })
        //dispatch gameData to show TRUE for polygonsAnswered
        gameValues.dispatchFcn(
          submitCorrectEntry(
            gameValues.countPolygonsEntered,
            highlightedCountry.id,
            gameValues.gameData
          )
        )
      //set answer status to correct
      answerCorrect = true;
      //make local modification to gameData
      gameValues.gameData.forEach((el) => {
        if (el.id === highlightedCountry.id) {
          el.polygonAnswered = true;
        }
      })
      //end of if statement that matches submission to accepted answer
      }
      //end of forEach that cycles through accepted answers
    })
    if (answerCorrect) {
      //if there are more unansweredPolygons, run function again
      gameValues.gameData.forEach((el) => {
        if (!el.polygonAnswered) {
          moreCountriesLeft = true;
        }
      })

      moreCountriesLeft ? nameTheCountryGameLogic(gameValues) : gameValues.handleGameEnd();
    } else {
      //dispatch incorrect submitincorrect entry
      gameValues.dispatchFcn(
        submitIncorrectEntry(
          gameValues.submissionSanitized,
          gameValues.incorrectEntries
        )
      )
    }
  //end of else statement
  }


//end of body function
}
