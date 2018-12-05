const fs = require('fs');
const path = require('path');
const passpostSetup = require("./services/passport");
const pathTo = path.resolve(__dirname +'/static/gifs');
const passport = require("passport");
module.exports = (app) => {

  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/',
                                        failureRedirect: '/login' }));

  app.post('/api/getGifs', (req,res)=>{

    let gifsArr = []
    fs.readdir(pathTo, (err,gifs)=>{
      console.log(req.body.chunkCounter)
      let chunk = gifs.splice(req.body.chunkCounter,7);
      console.log(chunk)
      let promise = new Promise((resolve,reject)=>{
        chunk.forEach(gif=>{
          fs.readFile(`${pathTo}/${gif}`,'utf-8', (err,data)=>{
            if (err) {
              throw err;
            } else {
              content = data;
              if(content.length>0){
                gifsArr.push(JSON.parse(content))
                if(gifsArr.length===chunk.length){
                  resolve()
                }
              }
            }
          })
        })
      })
      promise.then(()=>{
        res.json(gifsArr);
      })

    })
  });
  app.get('/api/getMyGifs', (req, res)=>{
  let responseArr = [];
  let objArr = [];

  fs.readdir(pathTo, (err,gifs)=>{
      let promise = new Promise((resolve,reject)=>{
        gifs.forEach(gif=>{
          fs.readFile(`${pathTo}/${gif}`,'utf-8', (err,data)=>{
            if (err) {
              throw err;
            } else {
              let gifObj = JSON.parse(data);
              objArr.push(gifObj);
              if(objArr.length===gifs.length){
                resolve();
              }
            }
          })
        })
      })
      promise.then(()=>{
        objArr.forEach(gif=>{
          if(gif.user){
            if(gif.user.fbId===req.user.fbId){
              responseArr.push(gif)
            }
          }
        })
        res.json(responseArr)
      })
    })
  })
  app.get("/api/logout", (req, res) => {
      req.logout();
      res.redirect("/");
    });
  app.get('/api/getUser', (req,res)=>{
    res.json(req.user);
  })

  app.post('/upload', (req,res)=>{
    let imgObj = {
      name: req.body.name,
      user: req.user,
      image:req.body.img

    }
    let imgObjString = JSON.stringify(imgObj);
    fs.writeFile(`${pathTo}/${req.body.name}.json`, imgObjString, (err)=>{
      if( err ){
        throw err;
      } else {
        console.log('saved')
      }
    })
  })
}
