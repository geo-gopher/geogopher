import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { GoogleLogout } from 'react-google-login';
import { userActions } from '../actions';
import { Menu } from 'semantic-ui-react';

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.onLogoutSuccess = this.onLogoutSuccess.bind(this);
  }

  onLogoutSuccess(){
    const { dispatch } = this.props;
    dispatch(userActions.logout());
    console.log('logout successful');
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { user } = this.props;
    return (
      <div className="navbar">
        <nav>
                <Menu>

                  <Menu.Menu position='right'>

                    <Menu.Item>

                     <NavLink exact to="/"> games list </NavLink>

                    </Menu.Item>

                    <Menu.Item>

                     <NavLink to="/map"> map </NavLink>

                    </Menu.Item>

                    <Menu.Item>

                       {user ? (
                         <div>
                         <p>{user.givenName}</p>
                         <GoogleLogout
                         buttonText="Logout"
                         onLogoutSuccess={this.onLogoutSuccess}
                         >
                         </GoogleLogout>
                         </div>
                       ) : (
                         <NavLink to="/login"> login </NavLink>
                       )}

                    </Menu.Item>

                  </Menu.Menu>

                </Menu>

        </nav>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.UserReducer.user
  };
}

export default connect(mapStateToProps)(NavBar);
