
import {
 submitCorrectEntry,
 submitIncorrectEntry,
 incrementTotalSubmissions,
} from '../actions/Score.actions';




export const countdownGameLogic = (gameValues) => {
let answerStatus = 'incorrect';
let polygonID = null;
let endGame = true;
   //loop through gamedata array
  for (var i = 0; i < gameValues.gameData.length; i++) {
     //loop through accepted answers within country obj
    for (var j = 0; j < gameValues.gameData[i].acceptedAnswers.length; j++) {
       // if answer matches
      if (gameValues.submissionSanitized === gameValues.gameData[i].acceptedAnswers[j]) {
         // if the answer has already been input
        if (gameValues.gameData[i].polygonAnswered) {

          answerStatus = 'answered';
          polygonID = gameValues.gameData[i].id;

        } else if (!gameValues.gameData[i].polygonAnswered) {

          answerStatus = 'unanswered';
          polygonID = gameValues.gameData[i].id;

        }
      }
    }
  }
  //if there is no match at all, then the answer is incorrect
  countdownAnswerResponse( answerStatus, polygonID, gameValues );
  //verify there are countries left
  gameValues.gameData.forEach((el) => {
    if (!el.polygonAnswered) {
      endGame = false;
    }
  })
  
  // if all polygons are answered
  if (endGame) {
    gameValues.handleGameEnd();
  }

  return;

}

const countdownAnswerResponse = ( answerStatus, polygonID, gameValues ) => {
  //unpack variables
  let map = gameValues.map;
  let dispatchFcn = gameValues.dispatchFcn;
  let countPolygonsEntered = gameValues.countPolygonsEntered;
  let gameData = gameValues.gameData;
  let submissionSanitized = gameValues.submissionSanitized;
  let incorrectEntries = gameValues.incorrectEntries;
  let countTotalSubmissions = gameValues.countTotalSubmissions;
  let polygon = map.data.getFeatureById(polygonID)

  if (answerStatus === 'answered') {
    //modify map to pulse
      map.data.overrideStyle(
        polygon,
        {
          fillOpacity: '0.5',
          fillColor: '#7CFC00',
          strokeColor: '#00FFFF',
          strokeWeight: '5',
        }
      );
      setTimeout(() =>
      map.data.overrideStyle(
              polygon,
              {
                fillOpacity: '0.5',
                fillColor: '#7FF000',
                strokeColor: '#FFD700',
                strokeWeight: '1',
              }
            ),1000)
    //trigger for already-answered sound
      //*trigger goes here*
  } else if (answerStatus === 'unanswered') {
    //modify map to reflect answered  polygon
      map.data.overrideStyle(
        polygon,
        {
          fillOpacity: '0.5',
          fillColor: '#7FF000',
          strokeColor: '#FFD700',
          strokeWeight: '1',
        }
      );
    //dispatch gameData to reflect true on polygonAnswered
    //and increment countPolygonsEntered
      dispatchFcn(
        submitCorrectEntry(
          countPolygonsEntered,
          polygonID,
          gameData
         )
       )
    //trigger for correct sound
      //*trigger goes here*
  } else { //answer status is 'incorrect'

    //dispatch to store in incorrectEntries
    dispatchFcn(submitIncorrectEntry(submissionSanitized, incorrectEntries))
    //trigger for incorrect sound
    //trigger for text field to shake
  }

  //increment countTotalSubmissions by one
  dispatchFcn(incrementTotalSubmissions(countTotalSubmissions))
  return;
}
