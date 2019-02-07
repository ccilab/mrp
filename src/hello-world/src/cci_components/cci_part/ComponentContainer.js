import 'raf/polyfill'
import 'core-js/es6/set'
import 'core-js/es6/map'
import React, { Component } from "react";
import CCiLabComponentList from "./CCiLabComponentList";
import "./../../css/CCiLabComponentContainer.css";

class ComponentContainer extends Component {
  state = {  width: 0 };

  updateDimensions=()=>{
    this.setState({width:`{window.innerWidth}`});
  }

  componentDidMount =()=> {
    window.addEventListener("resize", this.updateDimensions);
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

          <div> Browser is: {navigator.appName}</div>

          <div> Broser version: {parseInt(navigator.appVersion, 10)}</div>
        </ul>

      </div>
    );
  }
}

export default ComponentContainer;
