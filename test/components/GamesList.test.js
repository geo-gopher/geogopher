/*
 * GamesList.test.js
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from '../../src/store';
import GamesList from '../../src/components/GamesList';
import { createRenderer } from 'react-test-renderer/shallow';

const db = require('../../db/config');

global.requestAnimationFrme = function(callback) {
  setTimeout(callback, 0);
};

describe('The games list', () => {

  beforeEach((done) => {
    db.users.findOrCreate({where: {user_id: 1}})
    .spread(user => {
      console.log(user);
      return done(null, user);
    })
  });


  /* These first two tests are essentially the same. The test using
   * createRenderer does a shallow rendering, which means that children of
   * the component will not be rendered.  Use TestUtils instead.
   */

  it('renders GamesList component', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={ store }>
        <GamesList />
      </Provider>, div);
  });

  // it('renders a GamesList component', () => {
  //   const gamesRenderer = createRenderer();
  //   gamesRenderer.render(
  //     <Provider store={ store }>
  //       <GamesList/>
  //     </Provider>
  //   );
  //   let g = gamesRenderer.getRenderOutput();
  //   expect(g.type).toBe('div');
  // });

});
