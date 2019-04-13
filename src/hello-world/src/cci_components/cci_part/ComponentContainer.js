import 'raf/polyfill'
// import 'core-js/es6/set'
// import 'core-js/es6/map'
import React, { Component } from "react";
import CCiLabComponentList from "./CCiLabComponentList";
import {detectOSVersion} from "./CCiLabUtility";

import {TextResizeDetector } from "./TextResizeDetector"

class ComponentContainer extends Component {
  state = {  width: 0, fontSize: 23 };

  osVersion = detectOSVersion();

  updateDimensions=()=>{
    this.setState({width:`{window.innerWidth}`});
  }

  componentDidMount =()=> {
    window.addEventListener("resize", this.updateDimensions);
  }

  onFontResize=(e, args)=>{
    this.setState( { fontSize: TextResizeDetector.getSize() } )
    //alert("The width = " + this.state.fontSize);
  }

  initTextResizeDetector=()=>{
    let iBase = TextResizeDetector.addEventListener(this.onFontResize,null);
    // alert("The base font size = " + iBase);
    this.setState( { fontSize: iBase } )
  }  
  componentWillMount=()=>{
    TextResizeDetector.TARGET_ELEMENT_ID = 'root';
    TextResizeDetector.USER_INIT_FUNC = this.initTextResizeDetector;
  }



  render () {
    return (
      <div className={`d-flex flex-row`}> 
        <div>
            <CCiLabComponentList fontSize={this.state.fontSize}/>
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
        </ul>

      </div>
    );
  }
}

export default ComponentContainer;
