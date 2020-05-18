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
             tableKey: getRandomInt(10),
            //  listKey: getRandomInt(10),
             show: tables.sysInfo}; //'system-info'

             
  currentTableType = this.state.show;

  componentList = null;
  component = null;

  getComponentList=(componentListSrc)=>{
    this.componentList=componentListSrc;
  }


  updateDimensions=( listWidth )=>{
    this.setState({width: listWidth});  
    console.log("ComponentContainer - updateDimensions width: " + this.state.width);
  }

  //set selected component from bom table then update list
  getComponent=(selectedComponent)=>{
    this.component = selectedComponent;
    // this.setState({listKey: getRandomInt(10)});
  }

  updateTableType=(tableType)=>{
     
      if( typeof tableType !== 'undefined')
      {
        this.currentTableType = tableType;
        this.setState( {show: tableType} );
      }
      else
      {
        this.setState({tableKey: getRandomInt(10)});
        // this.setState( {show: this.currentTableType} );
      }
    
     

      // console.log("ComponentContainer - state:show : " + JSON.stringify(this.state.show) );
      
      // console.log("ComponentContainer - updateTableType : " + this.currentTableType );
      // console.log("ComponentContainer -  tableKey: " +  this.tableKey.toString() );
  }


    
  renderTables=(state)=>{
    return(
      <div className={'m-2'}>
      {
        {
        'sysInfoTbl' : <SysInfo/>,
        'mpsTable' :  <MPSTable  key = {this.state.tableKey} components={this.componentList} setComponent={this.component} />,
        'bomTable' :  <BOMTable  key = {this.state.tableKey} components={this.componentList} setComponent={this.component} />,  //updateKey={this.tableKey}
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
    

// key={this.state.key} key={this.state.listKey}
  render () {
    return (
      <div  className={`d-flex flex-row`}> 
        <div style={{width: this.state.width===0 ? 'auto' : `${this.state.width}px`}}>
            <CCiLabComponentList 
                                  updateTableHandler={this.updateTableType}
                                  updateTableSize={this.updateDimensions}
                                  currentTableId={this.currentTableType}
                                  showSelectedComponent={this.getComponent}
                                  setComponents={this.getComponentList} />
        </div>     

        {this.renderTables(this.state)}

      </div>
    );
  }
}

export default ComponentContainer;
