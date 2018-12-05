import React, {Component} from 'react';
import axios from "axios";
import GIF from 'gif.js.optimized';
import html2canvas from 'html2canvas';
import { withRouter } from "react-router-dom";

import '../styles/uploader.scss'


class Uploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      name:'',
      fileList: [],
      imgNum: 0,
      errors: {},
      gif: "",
      interval: 0.3,
      text: "",
      textColor: 'white',
      frames: 10,
      height: 200,
      width: 200,
      uploadedImgs: false,
      noErrors: true,
      gifErrors: {
        interval: "1s Max",
        text: "Text",
        frames: "20 Max",
        height: "400 Max",
        width: "400 Max",
        name: 'Name'
      }
    };
    this.fileList = [];
  }
  componentDidMount() {
    axios.get("/api/getUser").then(res => {
      this.setState({ user: res.data });
    });
    if(!('mediaDevices' in navigator)) {
      navigator.mediaDevices = {};
    }
    if(!('getUserMedia' in navigator.mediaDevices)){
      navigator.mediaDevices.getUserMedia = function(constraints) {
        var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if(!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented'))
        } else {
          return new Promise(function(resolve, reject){
            getUserMedia.call(navigator, constraints, resolve, reject);
          })
        }
      }
    }
  }
   dataURItoBlob=(dataURI)=> {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab], {type: mimeString});
    return blob;
  }

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    console.log(document.getElementById('gifText').offsetWidth)
    if(this.state.text.length>=30){

    }
  };

  getStream = () => {
    let picture;
    let canvas = document.getElementById('canvas');
    canvas.height = this.state.height;
    canvas.width= this.state.width;
    var context = canvas.getContext('2d');
    let videoPlayer = document.getElementById('player')
    ////////refresh//////////
    if(this.state.fileList.length>0){
      this.setState({
        fileList:[],
        gif:""
      })
    context.clearRect(0,0, canvas.width, canvas.height);
    videoPlayer.style.display = 'block';
    ////////refresh^^^^////////
    } else {
      let errors = {};
      if(this.state.interval > 1 || isNaN(this.state.interval)) {
        errors.interval = "1 Max"
        this.setState({gifErrors:errors,
                       interval:""})
      } else if(this.state.frames > 20 || isNaN(this.state.frames)){
        errors.frames = "20 Max"
        this.setState({gifErrors:errors,
                       frames:""})
      } else if(this.state.width > 400 || isNaN(this.state.width)){
        errors.width = "400 Max"
        this.setState({gifErrors:errors,
                       width:""})
      }
      else if(this.state.height > 400 || isNaN(this.state.height)){
        errors.height = "400 Max"
        this.setState({gifErrors:errors,
                       height:""})
      }
      else if(this.state.text.length > 60 || typeof this.state.text !== "string"){
        errors.text = "60 chars"
        this.setState({gifErrors:errors,
                       text:""})
      } else {
        var gif = new GIF({
          workers:2,
          quality:1,
          repeat:0,
          workerScript:'/node_modules/gif.js.optimized/dist/gif.worker.js',
          width:this.state.width,
          height:this.state.height,

        })
        navigator.mediaDevices.getUserMedia({video:{ width:this.state.width, height:this.state.height }})
        .then(stream=>{
          videoPlayer.srcObject = stream;
            let counter = 0;
            let imgArr = [];
            setTimeout(()=>{
              let capturing = setInterval(()=>{
                  context.font = "12px Verdana";
                  context.fillStyle = "white";
                  let textYPos = this.state.height-10;

                  let textXPos = this.state.width/2-document.getElementById('gifText').offsetWidth/2;
                  context.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
                  if(this.state.text.length<30){
                    context.fillText(this.state.text, textXPos, textYPos);
                  } else {

                    let firstLine = this.state.text.slice(0,30);
                    let nextLine = this.state.text.slice(30);
                    let nextLineXPos = this.state.width/2-(nextLine.length*7.5/2)
                    context.fillText(firstLine, 5, textYPos-document.getElementById('gifText').offsetHeight-5);
                    context.fillText(nextLine, nextLineXPos, textYPos);
                  }

                /*picture = this.dataURItoBlob(canvas.toDataURL())*/
                imgArr.push(canvas.toDataURL());
                counter+=1;
                gif.addFrame(canvas,{delay: this.state.interval, copy: true})

                if(counter==this.state.frames){
                  this.setState({fileList: imgArr,
                                 text:''})
                  gif.render();
                  gif.on('finished', (blob, data)=>{
                    console.log(blob)
                    this.setState({gif:URL.createObjectURL(blob)}, ()=>{
                      canvas.style.display = 'none';
                      videoPlayer.style.display = 'none';
                    })
                  });
                  clearInterval(capturing);
                  videoPlayer.srcObject.getVideoTracks().forEach(function(track){
                      track.stop();
                    })
                }
              },500)
            },1500)
        })
        .catch(function(err){
          console.log(err)
        })
      }

    }

  }
  makeGif = () => {
    let errors = {};
    if(this.state.interval > 1 || isNaN(this.state.interval)) {
      errors.interval = "1 Max"
      this.setState({gifErrors:errors,
                     interval:"",
                     noErrors: false})
    } else if(this.state.frames > 20 || isNaN(this.state.frames)){
      errors.frames = "20 Max"
      this.setState({gifErrors:errors,
                     frames:"",
                      noErrors: false})
    } else if(this.state.width > 400 || isNaN(this.state.width)){
      errors.width = "400 Max"
      this.setState({gifErrors:errors,
                     width:"",
                     noErrors: false})
    }
    else if(this.state.height > 400 || isNaN(this.state.height)){
      errors.height = "400 Max"
      this.setState({gifErrors:errors,
                     height:"",
                     noErrors: false})
    }
    else if(this.state.text.length > 60 || typeof this.state.text !== "string"){
      errors.text = "60 chars"
      this.setState({gifErrors:errors,
                     text:"",
                     noErrors: false})
    } else {
      let gif = new GIF({
        workers:2,
        quality:1,
        repeat:0,
        workerScript:'/node_modules/gif.js.optimized/dist/gif.worker.js',
        width:300,
        height:300,

      })
      let canvas = document.getElementById('canvas');
      var context = canvas.getContext('2d');
      canvas.height = 300;
      canvas.width= 300;
      let videoPlayer = document.getElementById('player')
      let framesArr = document.querySelectorAll('.imgWrap');
      console.log(framesArr);
      framesArr.forEach(frame=>{
        context.drawImage(frame, 0, 0, canvas.width, canvas.height)
        gif.addFrame(context,{delay: 200, copy:true});
      });
      gif.render();
      gif.on('finished', (blob)=>{
        this.setState({gif:URL.createObjectURL(blob)}, ()=>{
          canvas.style.display = 'none';
          videoPlayer.style.display = 'none';
        })
      })
    }
  };

  showImages = () => {
    return this.state.fileList.map((file, ind) => {
      return (
          <img key ={ind} className='imgWrap img' src={file} />
      );
    });
  };


  showGif = (gifUrl) => {
    if (this.state.gif.length > 0) {
      return (
        <div className='imgWrap'>
        <a href={this.state.gif} download='myGif'><img className='gif' src={this.state.gif} /></a>
        </div>
      );
    }
  };
  submitGif = () => {
    let errors ={};
    let imgObj = {
      img: this.state.gif,
      name: this.state.name
    };
    if(this.state.gif.length!==0 && this.state.name.length!==0){
      axios.post("/upload", imgObj).then(res => {
        console.log(res);
      });
    } else {
      errors.name = "You must name your gif"
      this.setState({gifErrors: errors})
    }

  };
  onChange = event => {
      let errors = {};
      this.setState({ fileList: [] }, () => {
        this.fileList = [];
        let files = document.getElementById("upBtn").files;
        for (let i = 0; i < files.length; i++) {
          /////
          let reader = new FileReader();
          reader.readAsDataURL(files[i]);
          reader.onload = e => {
            this.fileList.push(e.target.result);
            //console.log(this.fileList)
            this.setState({
              fileList: this.fileList,
              errors: {},
              uploadedImgs: true
            }, ()=>{

            });
            if (files[i].size > 1000000) {
              errors.size = "Max Size is 1mb";
              this.setState({
                errors: errors,
                fileList: []
              });
              files.value = "";
              return;
            }
          };
          /////
        }
      });
  };
  render() {
    return (
      <div className='uploader'>
        <div className='uploadWindow'>
          <form
            className='form'
            action="/upload"
            method="POST"
            encType="multipart/form-data"
          >
            <div className='btns'>
              {/*ternary statement to switch btns after uploading images*/}
              {this.state.uploadedImgs ?
                <button
                  onClick={this.makeGif}
                  className='customUpBtn'
                  type="button"
                >
                Generate
                </button> :
                <label className='customUpBtn'>
                Upload Images
                <input
                  id="upBtn"
                  multiple
                  onChange={this.onChange}
                  className='imgUp'
                  type="file"
                  name="image"
                />
              </label> }
              {/*ternary statement to switch btns after uploading images*/}
              <button
                onClick={this.getStream}
                className='customUpBtn'
                type="button"
              >
                {this.state.fileList.length > 0 ? "Refresh" : "Use Camera"}
              </button>
            </div>

            <div className='gifConfig'>
              <div className='inputHolder'>

                <input

                  onChange={this.onInputChange}
                  className='inputFName'
                  type="text"
                  name="name"
                  placeholder={this.state.gifErrors.name}
                />
            </div>
            <div className='inputHolder'>
              <div className='title'>Text</div>
              <input
                value={this.state.text}
                onChange={this.onInputChange}
                className='inputF'
                type="text"
                name="text"
                placeholder={this.state.gifErrors.text}
              />
            </div>
              <div className='inputHolder'>
                <div className='title'>Interval</div>
                <input
                  value={this.state.interval}
                  onChange={this.onInputChange}
                  className='inputF'
                  type="text"
                  name="interval"
                  placeholder={this.state.gifErrors.interval}
                />
            </div>

            <div className='inputHolder'>
              <div className='title'>Frames</div>
              <input
                value={this.state.frames}
                onChange={this.onInputChange}
                className='inputF'
                type="text"
                name="frames"
                placeholder={this.state.gifErrors.frames}
              />
            </div>
            <div className='inputHolder'>
              <div className='title'>Height</div>
              <input
                value={this.state.height}
                onChange={this.onInputChange}
                className='inputF'
                type="text"
                name="height"
                placeholder={this.state.gifErrors.height}
              />
            </div>
            <div className='inputHolder'>
              <div className='title'>Width</div>
              <input
                value={this.state.width}
                onChange={this.onInputChange}
                className='inputF'
                type="text"
                name="width"
                placeholder={this.state.gifErrors.width}
              />
            </div>
            </div>
             <div className='createBtnWrap'
                onClick={this.submitGif}
                type="button"
              >
                Upload
            </div>
          </form>

          <div className='preview'>
            <div className='imagesHolder1'>
              {this.showImages()}
              <div className='imageError'>{this.state.errors.size}</div>
            </div>
            <div className='imagesHolder2'>
              <div id="gifText">{this.state.text}</div>
              <video id="player" autoPlay></video>
              <canvas height={this.state.height} width={this.state.width} id="canvas"></canvas>
              {this.showGif()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Uploader);
