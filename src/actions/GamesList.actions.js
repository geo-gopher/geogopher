/*
 * src/actions/GamesList.actions.js
 */

import axios from 'axios';
const gamesListApi = '/api/gameslist';
const gameSettingsApi = '/api/gameSettings';

export const fetchGamesList = () => {
  return (dispatch) => {
    axios.get(gamesListApi)
      .then(res => {
        dispatch({ type: 'FETCH_GAMESLIST', payload: res.data });
        return res;
      })
      .catch(err => {
        console.log('GEOGOPHER error: ', err);
        throw (err);
      });
  };
};

export const fetchGameSettings = () => {
  return (dispatch) => {
    axios.get(gameSettingsApi)
      .then(res => {
        console.log('😙 we getting response from dataquery now')
        console.log(res.data)
        dispatch({type: 'FETCH_GAME_TYPES_AND_DIFFICULTIES', payload: res.data});
        return res;
      })
      .catch(err => {
        console.log('GEOGOPHER error: ', err);
        throw (err);
      })
  }
}
