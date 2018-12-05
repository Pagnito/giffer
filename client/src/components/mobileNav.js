import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../styles/mobileNav.scss';
export class MobileNav extends Component {
  constructor(props){
    super(props)
    this.state={
      navVisible: false
    }
  }
  hideNav = () => {
    let nav = document.getElementById('mobNavBg');
    nav.style.display = 'none';
  }
  render() {
    return (
      <div id="mobNavBg" className='mobNavBg'>
        <div onClick={this.hideNav} className='mobNav'>
          <div className='btnHolder'>
            <Link className='mobBtn' to="/uploader">Create Gif</Link>
            <Link className='mobBtn' to="/account">My Gifs</Link>
            <Link className='mobBtn' to="/">Home</Link>
          </div>
        </div>

      </div>
    );
  }
}

export default MobileNav;
