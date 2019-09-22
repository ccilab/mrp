import 'raf/polyfill'
// import 'core-js/es6/set'
// import 'core-js/es6/map'
import React, { Component } from "react";
import {CCiLabComponentList, tables} from "./CCiLabComponentList";
import {detectOSVersion} from "./CCiLabUtility";
import BOMTable from "./CCiLabBOMTable"
import MPSTable from "./CCiLabMPSTable"



class ComponentContainer extends Component {
  

  state = {  width: 0 ,
             show: tables.mpsTable}; //'system-info'

  osVersion = detectOSVersion();

  updateDimensions=()=>{
    this.setState({width:`${window.innerWidth}`});
    console.log("ComponentContainer - updateDimensions width: " + this.state.width);
  }

  updateTableType=(tableType)=>{
    this.setState( {show: tableType} );
  }

  sysInfo=()=>{
    return (
      <ul>
      <div>  window.screen.width width is :   {window.screen.width} </div>

      <div > window.innerWidth is view port width: {window.innerWidth }; </div>

      <div> documentElement.clientWidth is: {document.documentElement.clientWidth}</div> 

      <div > window.innerHeight is view port height: {window.innerHeight}</div>

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
    )
  }


  render () {
    return (
      <div className={`d-flex flex-row`}> 
        <div>
            <CCiLabComponentList updateTableHandler={this.updateTableType}/>
        </div>     

        {
          {
          'sysInfoTbl' : this.sysInfo(),
          'mpsTable' : {MPSTable},
          'bomTable' :{BOMTable},
          'productionOrderTable' : null,
          'purchaseOrderTable' : null,
          'materialPlanTable' : null,
          'assetUsageTable' : null,
           default: null
          }[this.state.show]
        }
       

      </div>
    );
  }
}

export default ComponentContainer;
