export const getRandomUnansweredPolygon = (gameData) => {
  let randomPolygon = gameData[Math.floor(Math.random()*gameData.length)];

  if (!randomPolygon.polygonAnswered){
    console.log('THIS IS THE RANDOM POLYGON')
    console.log(randomPolygon)
    return randomPolygon
  } else {
    getRandomUnansweredPolygon(gameData)
  }

}
