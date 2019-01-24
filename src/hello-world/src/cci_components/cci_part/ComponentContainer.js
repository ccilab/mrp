import 'raf/polyfill'
import 'core-js/es6/set'
import 'core-js/es6/map'
import React, { Component } from "react";
import CCiLabComponentList from "./CCiLabComponentList";
import "./../../css/CCiLabComponentContainer.css";

class ComponentContainer extends Component {
  

  
  render () {
    return (
      <div className={`d-flex flex-row`}> 
        <div>
            <CCiLabComponentList />
        </div>     


        <div>
          'this is place holder for creating component'
        </div>

      </div>
    );
  }
}

export default ComponentContainer;
