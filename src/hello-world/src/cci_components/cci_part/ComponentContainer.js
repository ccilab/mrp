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
             show: tables.sysInfo}; //'system-info'

  previousTableType = this.state.show;

  componentList = null;

  updateDimensions=()=>{
    this.setState({width:`${window.innerWidth}`});
    console.log("ComponentContainer - updateDimensions width: " + this.state.width);
  }

  updateTableType=(tableType)=>{
    console.log("ComponentContainer - previous show: " + this.previousTableType);
    console.log( "ComponentContainer - current show: " +  tableType)
    if( this.previousTableType !== tableType )
    {
      this.setState( {show: tableType} );
      this.state.show = tableType;
      this.previousTableType = tableType;
    }
  }
    
  renderTables=(tableType)=>{
    return(
      <div>
      {
        {
        'sysInfoTbl' : <SysInfo/>,
        'mpsTable' :  <MPSTable />,
        'bomTable' :  <BOMTable components={this.componentList} />,
        'productionOrderTable' : null,
        'purchaseOrderTable' : null,
        'materialPlanTable' : null,
        'assetUsageTable' : null,
        default: null
        }[tableType]
      }
      </div>
    )
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

        {this.renderTables(this.state.show)}

      </div>
    );
  }
}

export default ComponentContainer;
