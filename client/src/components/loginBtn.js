import React, {Component} from 'react';
import '../styles/login.scss';
import {Link} from 'react-router-dom';
class Login extends Component {
  constructor(props){
    super(props)
    this.state= {
      user: null
    }
  }
  componentDidUpdate(prevProps){
    if(prevProps.user!== this.props.user){
      this.setState({user:this.props.user})
    }
  }
  renderIflogged=()=>{
    if(this.state.user==null){
      return (
        <div className='spinner'>
          <div className='rect1'></div>
          <div className='rect2'></div>
          <div className='rect3'></div>
          <div className='rect4'></div>
          <div className='rect5'></div>
        </div>
      )
    }
    else if(this.state.user && this.props.user.userName){
      return (
        <div className='navBtns'>
          <Link to="/uploader"><div className='navBtn'>Create Gif</div></Link>
          <Link to="/account"><div className='navBtn'>My Gifs</div></Link>
          <a href="/api/logout"><div className='navBtn'>Log Out</div></a>
        </div>
      )
    } else {
      return (
        <div>
          <div className='navBtnsOut'>
            <Link to="/uploader"><div className='navBtnOut'>Create Gif</div></Link>
          </div>
          <div className='login'>
            <a href="/auth/facebook">Login with Facebook</a>
          </div>
       </div>
      )
    }
  }
  render() {
    return (
      <div className='loginStuff'>
        {this.renderIflogged()}
      </div>
    );
  }
}

export default Login;
