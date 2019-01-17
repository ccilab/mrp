import 'raf/polyfill'
import 'core-js/es6/set'
import 'core-js/es6/map'
import React, { Component } from "react";
import CCiLabComponentList from "./CCiLabComponentList";
import "./../../css/CCiLabComponentContainer.css";

class ComponentContainer extends Component {
  

  
  render () {
    return (
      <div >      
        <CCiLabComponentList />

        <ul>
          <li>'this is place holder for creating component'</li>
        </ul>

      </div>
    );
  }
}

export default ComponentContainer;
