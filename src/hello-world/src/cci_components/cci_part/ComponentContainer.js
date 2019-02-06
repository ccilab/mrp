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
           
           <div > window.innerHeight is: {window.innerHeight}</div>
        </ul>

      </div>
    );
  }
}

export default ComponentContainer;
