import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../actions';
import { Menu, Image, Dropdown, Button } from 'semantic-ui-react';

const geogopherLogo = require('-!url-loader?name=geogopher-logo!../assets/geogopher-logo.png');


class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: ''
    }

    this.onLogout = this.onLogout.bind(this);
  }

  async onLogout(){
    const { dispatch } = this.props;
    dispatch(await userActions.logout())
    .then(user => {
      if(!user) {
        console.log("logout successful!");
        this.props.history.push('/login');
      } else {
        console.log("there was a problem logging out");
      }
    });
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { user } = this.props;
    return (
      <div className="navbar">
        <nav>
                <Menu>

                  <Menu.Menu position='left'>
                  {
                    //dont show home logo if on home page
                    this.props.location.pathname === '/home' ?
                    null
                    :
                    <NavLink to="/home">
                      <Image className='geogopher-navbar-logo' src={geogopherLogo}/>
                    </NavLink>
                  }
                  </Menu.Menu>
                  <Menu.Menu position='right'>
                    <Menu.Item>
                     <NavLink exact to="/"> PLAY </NavLink>
                    </Menu.Item>
                    <Menu.Item>
                     <NavLink to="/explore"> EXPLORE </NavLink>
                    </Menu.Item>
                    <Menu.Item>
                     <NavLink to="/high-scores"> SCORES </NavLink>
                    </Menu.Item>
                    <Menu.Item>
                       {user ? (

                         <Dropdown text={`Hi, ${user.username}`} pointing="top right" className='user-account-menu-dropdown'>
                          <Dropdown.Menu>
                            <Dropdown.Header>Account</Dropdown.Header>
                            <Dropdown.Item>
                              <Button
                              onClick={this.onLogout}
                            >LOGOUT</Button>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>

                       ) : (
                        <NavLink to="/login"> LOGIN </NavLink>
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

export default withRouter(connect(mapStateToProps)(NavBar));
