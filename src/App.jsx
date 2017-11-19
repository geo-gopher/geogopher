import React from 'react';
import Container from './Components/Container';
import { NavLink } from 'react-router-dom';

export default class App extends React.Component {

  render() {
    return (
      <div>
        <nav>
            <NavLink exact to="/" > home </NavLink>
            <NavLink to="/map"> map </NavLink>
        </nav>
        <Container></Container>
      </div>
    )
  }
}
