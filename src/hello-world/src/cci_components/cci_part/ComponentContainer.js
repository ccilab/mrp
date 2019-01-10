import 'raf/polyfill'
import 'core-js/es6/set'
import 'core-js/es6/map'
import React, { Component } from "react";

class ComponentContainer extends Component {
  state = {visible: false };

  toggleComponents=()=>{
    this.setState( {
       visible: !this.state.visible
      } );
  };

  handleMouseDown=(e)=>{
    this.toggleMenu();
    console.log("clicked");
    e.stopPropagation();
  };

  
  render () {
    return (
          <div>
      <ul>
        <li>'this is place holder for creating component'</li>
      </ul>
    </div>
    );
  }
}

export default ComponentContainer;
