import 'raf/polyfill'
// import 'core-js/es6/set'
// import 'core-js/es6/map'
import React, { Component } from "react";
import CCiLabComponentList from "./CCiLabComponentList";
import {detectOSVersion} from "./CCiLabUtility";



class ComponentContainer extends Component {
  state = {  width: 0 };

  osVersion = detectOSVersion();

  updateDimensions=()=>{
    this.setState({width:`${window.innerWidth}`});
    console.log("ComponentContainer - updateDimensions width: " + this.state.width);
  }

  componentDidMount =()=> {
  
  }


  componentWillMount=()=>{

  }



  render () {
    return (
      <div className={`d-flex flex-row`}> 
        <div>
            <CCiLabComponentList />
        </div>     


        <ul>
          <div>  window.screen.width width is :   {window.screen.width} </div>

          <div > window.innerWidth is: {window.innerWidth }; </div>

          <div> documentElement.clientWidth is: {document.documentElement.clientWidth}</div> 

          <div > window.innerHeight is: {window.innerHeight}</div>

          <div> documentElement.clientHeight is: {document.documentElement.clientHeight}</div>

          <div> Browser is: {this.osVersion.browser}</div>

          <div> Browser version: {this.osVersion.browserMajorVersion}</div>

          <div> OS version: {this.osVersion.os} {this.osVersion.osVersion} major: {this.osVersion.osMajorVersion}</div>

          <div> Browser font size: {this.state.fontSize}</div>

          <div> Language: {window.navigator.language} </div>

          <div> Languages: {window.navigator.languages[0]}, 
                            {window.navigator.languages[1]}, 
                            {window.navigator.languages[2]},
                            {window.navigator.languages[3]} </div>
        </ul>

      </div>
    );
  }
}

export default ComponentContainer;
