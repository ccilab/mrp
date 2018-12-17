
import React, { Component } from "react";
import "./HelloWorldList.css";
import CCiLabComponent from "./HelloWorld";
import AddGreeter from "./AddGreeter";

//image file name should be created the same as component name, so we can create imgName dynamically
//image type is extracted from uploaded image file
//table includes assembly and paint process
// simulate after loaded very top component and its direct  components
const firstComponents = [ { businessLogic: {id: 0, name: 'table', parentIds:[], childIds:[1,5,6],  imgFile: 'table.png', status: 'no_issue', progressPercent:0}, displayLogic: { key: 0,childKeyIds:[1,2,3], showMyself:false, canExpend: true}},
                     { businessLogic: {id: 1, name:'top', parentIds:[0], childIds:[2,3], imgFile:'myer_missing_point.jpg', status: 'warning', progressPercent: 40}, displayLogic: {key: 1,childKeyIds:[], showMyself: false, canExpend: false}},
                     { businessLogic: {id: 5, name:'nail', parentIds:[0], childIds:[],  imgFile:'edit_black_background.png', status: 'no_issue', progressPercent: 10},displayLogic: {key: 2, childKeyIds:[],showMyself: false, canExpend: false}},
                     { businessLogic: {id: 6, name:'glue', parentIds:[0], childIds:[], imgFile:'edit_black_background.png', status: 'no_issue', progressPercent: 10},displayLogic: {key: 3,childKeyIds:[], showMyself: false, canExpend: false}},
                      ]
//const components = [];

// simulate load very top component and its direct components
// const components = [ { businessLogic: {id: 0, name: 'table', parentIds:[], childIds:[1,5,6],  imgFile: 'png', status: 'no_issue', progressPercent:0}, displayLogic: { key: undefined,childKeyIds:[], showMyself:false, canExpend: false}},
//                      { businessLogic: {id: 1, name:'top', parentIds:[0], childIds:[2,3], imgFile:'jpg', status: 'warning', progressPercent: 40}, displayLogic: {key: undefined,childKeyIds:[], showMyself: false, canExpend: false}},
//                      { businessLogic: {id: 5, name:'nail', parentIds:[0], childIds:[],  imgFile:'', status: 'no_issue', progressPercent: 10},displayLogic: {key: undefined, childKeyIds:[],showMyself: false, canExpend: false}},
//                      { businessLogic: {id: 6, name:'glue', parentIds:[0], childIds:[], imgFile:'', status: 'no_issue', progressPercent: 10},displayLogic: {key: undefined,childKeyIds:[], showMyself: false, canExpend: false}}
//                     ]

// simulate load children of component id 1 ( top )
const secondComponents = [
                    { businessLogic: {id: 2, name:'leg', parentIds:[1], childIds:[4], imgFile:'edit_black_background.png', status: 'alarm', progressPercent: 10}, displayLogic: {key: undefined, childKeyIds:[],showMyself: false, canExpend: false}},
                     { businessLogic: {id: 3, name:'upper_beam', parentIds:[1], childIds:[5,6],  imgFile:'edit_black_background.png', status: 'no_issue', progressPercent: 50},displayLogic: {key: undefined,childKeyIds:[], showMyself: false, canExpend: false}},
                   ]
// simulate load children of component id 4 ( top )
const thirdComponents = [
                     { businessLogic: {id: 4, name:'low_beam', parentIds:[2], childIds:[5,6],  imgFile:'edit_black_background.png', status: 'warning', progressPercent: 20},displayLogic: {key: undefined,childKeyIds:[], showMyself: false, canExpend: false}},
                    //  { businessLogic: {id: 5, name:'nail', parentIds:[4], childIds:[],  imgFile:'', status: 'no_issue', progressPercent: 10},displayLogic: {key: undefined, childKeyIds:[],showMyself: false, canExpend: false}},
                    //  { businessLogic: {id: 6, name:'glue', parentIds:[4], childIds:[], imgFile:'', status: 'no_issue', progressPercent: 10},displayLogic: {key: undefined,childKeyIds:[], showMyself: false, canExpend: false}}                  
                  ]    

// utility funtions need move to a saperate js file
const initializeComponents = ( startComponent, originComponents, incomingComponents, targetComponents)=>{
  let displayKeyValue = 0;

  if( typeof originComponents !== "undefined") {
    originComponents.forEach( (existingComponent)=>{ targetComponents.push( existingComponent ) } );
    displayKeyValue = targetComponents.length;
  }


  
  // initialize displayLogic items, create unique key value for latest componets from data layer
  // this gurrenties that displayLogic.key is unique, newly added componet won't show itself until
  // user clicks it, except the very top component
  
  for(let idx = 0; idx < incomingComponents.length; idx++ ) {
    let element = incomingComponents[idx];
    element.displayLogic.key = displayKeyValue++;
    element.displayLogic.childKeyIds.length = 0;
    element.displayLogic.showMyself = false;
    element.businessLogic.childIds.length !== 0 ? element.displayLogic.canExpend = true : element.displayLogic.canExpend = false;
   
    let startComponentKey = 0;
    if(typeof startComponent !== "undefined" ) {
      startComponentKey = startComponent.displayLogic.key;
      //need populate childKeyIds[] if its not fully populated yet
      if( startComponent.businessLogic.childIds.length !==  startComponent.displayLogic.childKeyIds.length && 
          startComponent.displayLogic.childKeyIds.includes( element.displayLogic.key ) === false ) {
          let idxInsertAt = targetComponents.findIndex(startComponent=>{return startComponent.displayLogic.key === startComponentKey});
          // component without childIs[] is always above componets with childIds[] for display/expending purpose
          if( element.businessLogic.childIds.length === 0 )
            targetComponents.splice( idxInsertAt+1,0,element);
          else
            targetComponents.push(element);
      }
    }
  }
};

const populateComponentChildIds = (selectedComponent, cachedComponents )=>{
  if( selectedComponent.businessLogic.childIds.length !== selectedComponent.displayLogic.childKeyIds.length ) {
      for( let idx = 0; idx < cachedComponents.length; idx++ ) { 
        if( selectedComponent.businessLogic.childIds.includes( cachedComponents[idx].businessLogic.id ) &&
            ( !selectedComponent.displayLogic.childKeyIds.includes( cachedComponents[idx].displayLogic.key) ) ) 
            selectedComponent.displayLogic.childKeyIds.push( cachedComponents[idx].displayLogic.key )
      }
  }
}

// turn off childKeyIds[] but we don't want to turn off childKeyIds[] unless 
// its direct parent's canExpened = false (the parent is expended already
const hideChildren = (aComponent, aComponents, aShowStatus)=>{
  if( !aComponent.displayLogic.canExpend && aComponent.displayLogic.childKeyIds.length ) 
  {
      for( idx2Component = 0;  idx2Component < aComponents.length; idx2Component++ ) 
      {
        if( aComponent.displayLogic.childKeyIds.includes(aComponents[idx2Component].displayLogic.key) )
          aComponents[idx2Component].displayLogic.showMyself = aShowStatus;
      }
  }
}

class HelloWorldList extends Component {
    state = { greetings: undefined };

    // initialize first component's childKeyIds, reorder in following order: the first component, alarm status, warning status, no_issue status
    componentWillMount=()=>{
      let currentSessionComponents=[];

      //#todo: need to query server to get a new components
      console.log("query server to get root components")
      let components = firstComponents;

      //#todo: need to query server side to find the very top component 
      let rootComponent = components.filter(component=>component.businessLogic.parentIds.length === 0)[0]
       
      initializeComponents(rootComponent, this.state.greetings, components, currentSessionComponents);
    
      //always show very top component
      rootComponent.displayLogic.showMyself = true;
   
      if( rootComponent.businessLogic.childIds.length !== 0 ){
        rootComponent.displayLogic.canExpend = true;

        // populate very top component's displayLogic.childKeyIds[], if it's not incluced yet
        populateComponentChildIds(rootComponent, currentSessionComponents);
      }

      this.setState( {greetings: currentSessionComponents} )
    }
  
    addGreeting = (newName, progressValue) =>{
      this.setState({ greetings: [...this.state.greetings, 
        { businessLogic: {id: this.state.greetings.length + 1, name: newName, parentIds:[0], childIds:[], imgFile:'', status: "alarm", progressPercent: progressValue}, displayLogic:{key: undefined}, childKeyIds:[], showMyself: false, canExpend: false}] });
    };

    removeGreeting = (removeName) =>{
      const filteredGreetings = this.state.greetings.filter(component => {
        return component.businessLogic.name !== removeName;
      });
      this.setState({ greetings: filteredGreetings });
    };

    //based on selected component and its show Status to show or hide its children
    showOrHideChildren = ( selectedComponent, showStatus ) =>{
          let idxComponent = 0;
          let idx2Component = 0;
          let currentSessionComponents=[];
        

          // if selected component's childKeyIds[] isn't fully populated we need to request new components from server side first
          if ( selectedComponent.businessLogic.childIds.length !== selectedComponent.displayLogic.childKeyIds.length ) {
              //#todo: need to query server to get a new components
              console.log("query server to get child components")
              
              let components =[];
              if( selectedComponent.businessLogic.id === 1 )
                components= secondComponents;
                
              if( selectedComponent.businessLogic.id === 2 )
                components= thirdComponents;
              
              initializeComponents(selectedComponent, this.state.greetings, components, currentSessionComponents);
          }
          else {
            currentSessionComponents = this.state.greetings;
          }
           
           
          populateComponentChildIds(selectedComponent, currentSessionComponents, showStatus );

          let rootComponent = firstComponents.filter(component=>component.businessLogic.parentIds.length === 0)[0];

          // looping through entire component list to find the component included inside child component list
          for( idxComponent = 0;  idxComponent < currentSessionComponents.length; idxComponent++ ) 
          {
            // skip the first component
            if( currentSessionComponents[idxComponent].displayLogic.key === rootComponent.displayLogic.key )
              continue;

            // find the component that has the child components, and update the show status of this component and its children
            if( selectedComponent.displayLogic.childKeyIds.includes(currentSessionComponents[idxComponent].displayLogic.key) ) {
                currentSessionComponents[idxComponent].displayLogic.showMyself = showStatus;

                //turn off childKeyIds[] but we don't want to turn childKeyIds[] unless its direct parent's toBeExpened = false 
                hideChildren(currentSessionComponents[idxComponent], currentSessionComponents, showStatus);
            }
              
          }
          
          this.setState( { greetings: currentSessionComponents })
    };

    //need to update showMyself to true after button is clicked to canExpend
    //need to update showMyself to false after button is clicked to collaps
    renderGreetings = () => {
      return ( (typeof this.state !== "undefined") && (typeof this.state.greetings !== "undefined" ) )? 
          this.state.greetings.map( (component) => {
                if( component.displayLogic.showMyself === true )
                  return <CCiLabComponent component={component} removeGreeting={this.removeGreeting} showOrHideChildren={this.showOrHideChildren}/> ;
                else
                return null;
            }
          ) : null;
    };

  


    render() {
      return (
        <div className="HelloWorldList">
          <AddGreeter addGreeting={this.addGreeting} />
            <div>
              <div className='float-left mt-3 b-secondary'>
                {this.renderGreetings()}
              </div>
              <div className='float-left mt-5'>
                  <div className='col-sm-10  bg-info'>
                    'this is place holder for component configuration table'
                  </div>
              </div>
            </div>
        </div>
      );
    }
}

export default HelloWorldList;
