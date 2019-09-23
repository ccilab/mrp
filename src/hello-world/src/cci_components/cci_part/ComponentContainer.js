import 'raf/polyfill'
// import 'core-js/es6/set'
// import 'core-js/es6/map'
import React, { Component } from "react";
import {CCiLabComponentList, tables} from "./CCiLabComponentList";
import {SysInfo} from "./CCiLabUtility";
import BOMTable from "./CCiLabBOMTable"
import MPSTable from "./CCiLabMPSTable"



class ComponentContainer extends Component {
  

  state = {  width: 0 ,
             show: tables.bom}; //'system-info'

  componentList = null;

  updateDimensions=()=>{
    this.setState({width:`${window.innerWidth}`});
    console.log("ComponentContainer - updateDimensions width: " + this.state.width);
  }

  updateTableType=(tableType)=>{
    this.setState( {show: tableType} );
  }

  getComponentList=(componentListSrc)=>{
    this.componentList=componentListSrc;
  }


  render () {
    return (
      <div className={`d-flex flex-row`}> 
        <div>
            <CCiLabComponentList updateTableHandler={this.updateTableType}
                                 getComponents={this.getComponentList} />
        </div>     

        {
          {
          'sysInfoTbl' : <SysInfo/>,
          'mpsTable' :  <MPSTable/>,
          'bomTable' :  <BOMTable/>,
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
