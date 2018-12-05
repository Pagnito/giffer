import  '../styles/account.scss';
import axios from 'axios';
import React, {Component} from 'react';
class Account extends Component {
  constructor(props){
    super(props)
    this.state={
      user:null,
      myGifs:null
    }
  }
  componentDidMount(){
    axios.get('/api/getUser').then(res=>{
      this.setState({user:res.data})
    })
    axios.get('/api/getMyGifs').then(res=>{
      this.setState({myGifs:res.data})
    }).catch(err=>{console.log(err)})
  }
  renderGallery=()=>{
    if(this.state.myGifs!==null){
      return this.state.myGifs.map((gif,ind)=>{
        return (
          <div
            className={css.accountGif}
            key={ind}
            style={{background:`url(${gif.image})`, backgroundSize:'cover',backgroundRepeat:'no-repeat'}}>

          </div>
        )
      })
    } else {
      return (
        <div className='spinner1'>
          <div className='rect1'></div>
          <div className='rect2'></div>
          <div className='rect3'></div>
          <div className='rect4'></div>
          <div className='rect5'></div>
        </div>
      )
    }

  }
  renderAccountInfo = () => {
    if(this.state.user!==null){
      return (
        <div className='accountInfo'>
          <img className='accPic' src={this.state.user.avatar} />
          <div className='userName'>{this.state.user.userName}</div>
        </div>
      )
    } else {
      <div className='spinner1'>
        <div className='rect1'></div>
        <div className='rect2'></div>
        <div className='rect3'></div>
        <div className='rect4'></div>
        <div className='rect5'></div>
      </div>
    }
  }
  render() {
    return (
      <div className='account'>
        <div className='contentHolder'>
          {this.renderAccountInfo()}
          <div className='myGallery'>
            {this.renderGallery()}
          </div>
        </div>

      </div>
    );
  }
}

export default Account;
