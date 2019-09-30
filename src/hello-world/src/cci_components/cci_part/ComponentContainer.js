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

  updateDimensions=( listWidth )=>{
    this.setState({width: listWidth});  
    console.log("ComponentContainer - updateDimensions width: " + this.state.width);
  }

  updateTableType=(tableType)=>{
    // console.log("ComponentContainer - previous show: " + this.previousTableType);
    // console.log( "ComponentContainer - current show: " +  tableType)
    if( this.previousTableType !== tableType )
    {
      this.setState( {show: tableType} );
      // this.state.show = tableType;
      this.previousTableType = tableType;
    }
  }
    
  renderTables=(state)=>{
    return(
      <div className={'m-4'}>
      {
        {
        'sysInfoTbl' : <SysInfo/>,
        'mpsTable' :  <MPSTable components={this.componentList} />,
        'bomTable' :  <BOMTable components={this.componentList} />,
        'productionOrderTable' : null,
        'purchaseOrderTable' : null,
        'materialPlanTable' : null,
        'assetUsageTable' : null,
        default: null
        }[state.show]
      }
      </div>
    )
  }
    
 
 
  getComponentList=(componentListSrc)=>{
    this.componentList=componentListSrc;
  }

// key={this.state.key}
  render () {
    return (
      <div  className={`d-flex flex-row`}> 
        <div style={{width: this.state.width===0 ? 'auto' : `${this.state.width}px`}}>
            <CCiLabComponentList  updateTableHandler={this.updateTableType}
                                  updateTableSize={this.updateDimensions}
                                  getComponents={this.getComponentList} />
        </div>     

        {this.renderTables(this.state)}

      </div>
    );
  }
}

export default ComponentContainer;
