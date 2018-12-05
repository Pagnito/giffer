import {Link} from 'react-router-dom';
import axios from 'axios';
import '../styles/home.scss';
import React, {Component} from 'react';
class Home extends Component {
  constructor(props){
    super(props)
    this.state={
      user: null,
      gifs: [],
      nextGifArr: [],
      chunkCounter: -7,
      two: false,
      scroller:700
    }
  }

getGifs = () => {
    /*let chunk = {
      chunkCounter:this.state.chunkCounter
    }
    axios.post('/api/getGifs', chunk)
    .then((gifs)=>{
      this.setState({gifs:gifs.data,
                     chunkCounter:-14})

    }).catch(err=>{console.log(err)})*/
  }
  componentDidMount(){
     this.getGifs();

    window.addEventListener('scroll', (e)=>{
          //console.log(window.pageYOffset)
      /*  if(window.pageYOffset>this.state.scroller && this.state.two===false){
          let nextChunk = {
            chunkCounter:this.state.chunkCounter
          }
          this.setState({two:true}, ()=>{
            axios.post('/api/getGifs', nextChunk)
            .then(gifs=>{
              let counter = this.state.chunkCounter-=7
              this.setState({nextGifArr:gifs.data,
                             chunkCounter:counter})

            }).catch(err=>{
              console.log(err)
            })
          })
        }*/
      })
  }

  renderNextGallery=()=>{
    return this.state.nextGifArr.map((gif,ind)=>{
      return(
        <div key={ind} style={{background:`url('${gif.image}')`,
            backgroundSize:'cover',
            backgroundPosition:'center'}}
            className='galGifWrap2'>
          {/*<a href={`../static/gifs/${gif.name}.json`} download> */}
          {/*<img className={css.galImg} src={gif.image} />*/}
        </div>
      )
    })
  }
  renderNextGifs = () => {

    if(this.state.nextGifArr.length===0){
      return (
        <div className='spinner1'>
          <div className='rect1'></div>
          <div className='rect2'></div>
          <div className='rect3'></div>
          <div className='rect4'></div>
          <div className='rect5'></div>
        </div>
      )
    } else {
      return (
        <div className='gallery2'>
          {this.renderNextGallery()}
        </div>
      )
    }
  }
  renderGallery=()=>{
    return this.state.gifs.map((gif,ind)=>{
      return(
        <div key={ind} style={{background:`url('${gif.image}')`,
            backgroundSize:'cover',
            backgroundPosition:'center'}}
            className='galGifWrap'>
          {/*<a href={`../static/gifs/${gif.name}.json`} download> */}
          {/*<img className={css.galImg} src={gif.image} />*/}
        </div>
      )
    })
  }
  renderLanding = () => {

    if(this.state.gifs.length===0){
      return (
        <div className='spinner1'>
          <div className='rect1'></div>
          <div className='rect2'></div>
          <div className='rect3'></div>
          <div className='rect4'></div>
          <div className='rect5'></div>
        </div>
      )
    } else {
      return (
        <div className='gallery'>
          {this.renderGallery()}
        </div>
      )
    }
  }
  render(){
    return (

      <div className='home'>
        {this.renderLanding()}
  
        {this.renderNextGifs()}
      </div>

    )
  }
}

export default Home
