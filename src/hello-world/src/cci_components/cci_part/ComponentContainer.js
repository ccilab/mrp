import 'raf/polyfill'
// import 'core-js/es6/set'
// import 'core-js/es6/map'
import React, { Component } from "react";
import {CCiLabComponentList} from "./CCiLabComponentList";
// eslint-disable-next-line
import {SysInfo, tables, getRandomInt} from "./CCiLabUtility";
import BOMTable from "./CCiLabBOMTable"
import MPSTable from "./CCiLabMPSTable"



class ComponentContainer extends Component {
  

  state = {  width: 0 ,
             show: tables.sysInfo}; //'system-info'

             
  currentTableType = this.state.show;

  componentList = null;

  // tableKey = getRandomInt(100);

   
 
  getComponentList=(componentListSrc)=>{
    this.componentList=componentListSrc;
  }


  updateDimensions=( listWidth )=>{
    this.setState({width: listWidth});  
    console.log("ComponentContainer - updateDimensions width: " + this.state.width);
  }

  updateTableType=(tableType)=>{
    // console.log("ComponentContainer - previous show: " + this.currentTableType);
    // console.log( "ComponentContainer - current show: " +  tableType)
    // if( this.currentTableType !== tableType )
      if( typeof tableType !== 'undefined')
      {
        this.currentTableType = tableType;
        this.setState( {show: tableType} );
      }
      else
      {
        this.setState( {show: this.currentTableType} );
      }
    
     

      // this.tableKey = getRandomInt(100);

      console.log("ComponentContainer - state:show : " + JSON.stringify(this.state.show) );
      
      console.log("ComponentContainer - updateTableType : " + this.currentTableType );
      // console.log("ComponentContainer -  tableKey: " +  this.tableKey.toString() );
  }

    
  renderTables=(state)=>{
    return(
      <div className={'m-2'}>
      {
        {
        'sysInfoTbl' : <SysInfo/>,
        'mpsTable' :  <MPSTable components={this.componentList} />,
        'bomTable' :  <BOMTable components={this.componentList} />,  //updateKey={this.tableKey}
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
