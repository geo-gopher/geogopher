/*
 * Login.jsx
 */
import axios from 'axios';
import React from 'react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { Button, Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { userActions } from '../actions';
import { GoogleLogin } from 'react-google-login';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      
    }
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.onLoginFailure = this.onLoginFailure.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async handleSubmit() {
    const { dispatch } = this.props;
    dispatch(await userActions.login(this.state, false))
    .then(user => {
      this.props.history.push('/');
    })
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { user } = this.state;
    this.setState({
        [name] : value
    });
  }

  async onLoginSuccess(response) {
    const { dispatch } = this.props;
    console.log('login success: ', response);
    dispatch(await userActions.login(response, true))
    .then(() => {
      if(this.props.gameSelected) {
        this.props.history.push('/map');
      } else {
        this.props.history.push('/');
      }
    })
  }
  onLoginFailure(response) {
    console.log('failure: ', response);
  }


  render() {
    return(
      <div>
        <h1>Login</h1>
        <Form onChange={this.handleChange} onSubmit={this.handleSubmit} >
            <Form.Field>
              <label>Email</label>
              <input name='email' placeholder='Email' required='true'/>
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input name='password' placeholder='Password' type='password'required='true'/>
            </Form.Field>
        <div className="divider"></div>
        <Button className="login-btn" content="Login"/>
        <Button className="register-btn"  as={ Link } to="/register" content="Signup"/>
        <GoogleLogin
        className="google-btn"
        clientId="884185427931-gi7dgev6mm5buttbcqpenvc3h38a9oel.apps.googleusercontent.com"
        buttonText="Login with Google"
        onSuccess={this.onLoginSuccess}
        onFailure={this.onLoginFailure}
        />
        <Button className="anonymous-btn"  as={ Link } to="/" content="Play as Anonymous"/>
        </Form>
    </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    gameSelected: state.GameReducer.gameSelected
  };
}

export default withRouter(connect(mapStateToProps)(Login));
