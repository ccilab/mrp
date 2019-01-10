import 'raf/polyfill'
import 'core-js/es6/set'
import 'core-js/es6/map'
import React, { Component } from "react";
import HelloWorldList from "./HelloWorldList";

class ComponentContainer extends Component {
  state = {visible: false };

  toggleComponents=()=>{
    this.setState( {
       visible: !this.state.visible
      } );
  };

  handleMouseDown=(e)=>{
    this.toggleComponents();
    console.log("clicked");
    e.stopPropagation();
  };

  
  render () {
    return (
      <div>      
        <HelloWorldList handleMouseDown={this.handleMouseDown}
        menuVisibility={this.state.visible}/>

        <ul>
          <li>'this is place holder for creating component'</li>
        </ul>
      </div>
    );
  }
}

export default ComponentContainer;
