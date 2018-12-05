import React, { Component } from "react";
import axios from 'axios';
import { Route, withRouter } from "react-router-dom";
//import Loadable from 'react-loadable';
import Loader from './components/loader'
import Header from "./components/header";
import Account from "./components/account";
import Home from "./components/Home"
import Uploader from "./components/uploader"
const Loading = () => Loader;

/*const Entries = Loadable({
  loader: () => import('./entries'),
  loading: Loading(),
});*/

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      user:{}
    }
  }
  componentDidMount() {
    axios.get('/api/getUser').then(res=>{
      this.setState({user:res.data},()=>{
        if(Object.keys(this.state.user).length>0){
          navigator.serviceWorker.controller.postMessage("loggedIn");
        }
      })
    })
    .catch(err=>{
      this.setState({user:{}})
    })

  }
  render() {
    return (
          <div>
            <Header user={this.state.user}/>
            <Route exact path="/uploader" component={Uploader}/>
            <Route
              exact
              path="/account"
              render={props => <Account {...props} user={this.state.user} />}
            />
            <Route
              exact
              path="/"
              render={props => <Home {...props} user={this.state.user} />}
            />
          </div>
    );
  }
}

export default withRouter(App);
