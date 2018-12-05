import '../styles/header.scss';
import LoginBtn from './loginBtn';
import {Link} from 'react-router-dom';
import React, {Component} from 'react';
class Header extends Component {
  constructor(props){
    super(props)
    this.state={
      user:null,
      navVisible: false
    }
  }
  componentDidUpdate(prevProps){
    if(this.props.user!==prevProps.user){
      this.setState({user:this.props.user})
    }
  }
  showNav = () => {
    let nav = document.getElementById('mobNavBg');
    nav.style.display = 'flex';
  }

  render() {
    return (
      <div className='header'>
        <div className='logo'><Link to="/">Giffer</Link></div>
        <LoginBtn user={this.state.user}/>
        <img id="mobNavBtn" onClick={this.showNav} className='MobNavBtn' src='/src/assets/heartNavIcon.png' />
      </div>
    );
  }
}



export default Header;
