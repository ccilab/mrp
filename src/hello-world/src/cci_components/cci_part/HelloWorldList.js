
import React, { Component } from "react";
import "./HelloWorldList.css";
import CCiLabComponent from "./HelloWorld";
import AddGreeter from "./AddGreeter";

//image file name should be created the same as component name, so we can create imgName dynamically
//image type is extracted from uploaded image file
//table includes assembly and paint process
// simulate after loaded very top component and its direct  components
const firstComponents = [ { businessLogic: {id: 0, name: 'table', parentIds:[], childIds:[1,5,6],  imgType: 'png', status: 'no_issue', progressPercent:0}, displayLogic: { key: 0,childKeyIds:[1,2,3], showMyself:false, toBeExpend: true}},
                     { businessLogic: {id: 1, name:'top', parentIds:[0], childIds:[2,3], imgType:'jpg', status: 'warning', progressPercent: 40}, displayLogic: {key: 1,childKeyIds:[], showMyself: false, toBeExpend: false}},
                     { businessLogic: {id: 5, name:'nail', parentIds:[0], childIds:[],  imgType:'', status: 'no_issue', progressPercent: 10},displayLogic: {key: 2, childKeyIds:[],showMyself: false, toBeExpend: false}},
                     { businessLogic: {id: 6, name:'glue', parentIds:[0], childIds:[], imgType:'', status: 'no_issue', progressPercent: 10},displayLogic: {key: 3,childKeyIds:[], showMyself: false, toBeExpend: false}},
                      ]
//const components = [];

// simulate load very top component and its direct components
// const components = [ { businessLogic: {id: 0, name: 'table', parentIds:[], childIds:[1,5,6],  imgType: 'png', status: 'no_issue', progressPercent:0}, displayLogic: { key: undefined,childKeyIds:[], showMyself:false, toBeExpend: false}},
//                      { businessLogic: {id: 1, name:'top', parentIds:[0], childIds:[2,3], imgType:'jpg', status: 'warning', progressPercent: 40}, displayLogic: {key: undefined,childKeyIds:[], showMyself: false, toBeExpend: false}},
//                      { businessLogic: {id: 5, name:'nail', parentIds:[0], childIds:[],  imgType:'', status: 'no_issue', progressPercent: 10},displayLogic: {key: undefined, childKeyIds:[],showMyself: false, toBeExpend: false}},
//                      { businessLogic: {id: 6, name:'glue', parentIds:[0], childIds:[], imgType:'', status: 'no_issue', progressPercent: 10},displayLogic: {key: undefined,childKeyIds:[], showMyself: false, toBeExpend: false}}
//                     ]

// simulate load children of component id 1 ( top )
const secondComponents = [
                    { businessLogic: {id: 2, name:'leg', parentIds:[1], childIds:[4], imgType:'jpg', status: 'alarm', progressPercent: 10}, displayLogic: {key: undefined, childKeyIds:[],showMyself: false, toBeExpend: false}},
                     { businessLogic: {id: 3, name:'upper_beam', parentIds:[1], childIds:[5,6],  imgType:'jpg', status: 'no_issue', progressPercent: 50},displayLogic: {key: undefined,childKeyIds:[], showMyself: false, toBeExpend: false}},
                   ]
// simulate load children of component id 4 ( top )
const thirdComponents = [
                     { businessLogic: {id: 4, name:'low_beam', parentIds:[2], childIds:[5,6],  imgType:'jpg', status: 'warning', progressPercent: 20},displayLogic: {key: undefined,childKeyIds:[], showMyself: false, toBeExpend: false}},
                     { businessLogic: {id: 5, name:'nail', parentIds:[4], childIds:[],  imgType:'', status: 'no_issue', progressPercent: 10},displayLogic: {key: undefined, childKeyIds:[],showMyself: false, toBeExpend: false}},
                     { businessLogic: {id: 6, name:'glue', parentIds:[4], childIds:[], imgType:'', status: 'no_issue', progressPercent: 10},displayLogic: {key: undefined,childKeyIds:[], showMyself: false, toBeExpend: false}}                  
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
    element.businessLogic.childIds.length !== 0 ? element.displayLogic.toBeExpend = true : element.displayLogic.toBeExpend = false;
   
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



class HelloWorldList extends Component {
    state = { greetings: undefined };

    // initialize first component's childKeyIds, reorder in following order: the first component, alarm status, warning status, no_issue status
    componentWillMount=()=>{
      let currentSessionComponents=[];

      //#todo: need to query server side to find the very top component 
      let firstComponent = firstComponents.filter(component=>component.businessLogic.parentIds.length === 0)[0]
       
      initializeComponents(firstComponent, this.state.greetings, firstComponents, currentSessionComponents);
    
      //always show very top component
      firstComponent.displayLogic.showMyself = true;
   
      if( firstComponent.businessLogic.childIds.length !== 0 ){
        firstComponent.displayLogic.toBeExpend = true;

        // populate very top component's displayLogic.childKeyIds[], if it's not incluced yet
        populateComponentChildIds(firstComponent, currentSessionComponents);
      }

      this.setState( {greetings: currentSessionComponents} )
    }
  
    addGreeting = (newName, progressValue) =>{
      this.setState({ greetings: [...this.state.greetings, 
        { businessLogic: {id: this.state.greetings.length + 1, name: newName, parentIds:[0], childIds:[], imgType:'', status: "alarm", progressPercent: progressValue}, displayLogic:{key: undefined}, childKeyIds:[], showMyself: false, toBeExpend: false}] });
    };

    removeGreeting = (removeName) =>{
      const filteredGreetings = this.state.greetings.filter(component => {
        return component.businessLogic.name !== removeName;
      });
      this.setState({ greetings: filteredGreetings });
    };

    //based on selected component and its show Status to show or hide its children
    showChildren = ( selectedComponent, showStatus ) =>{
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

          let firstComponent = firstComponents.filter(component=>component.businessLogic.parentIds.length === 0)[0];

          // looping through entire component list to find the component included inside child component list
          for( idxComponent = 0;  idxComponent < currentSessionComponents.length; idxComponent++ ) 
          {
            // skip the first component
            if( currentSessionComponents[idxComponent].displayLogic.key === firstComponent.displayLogic.key )
              continue;

            // find the component that has the child components, and update the show status of this component and its children
            if( selectedComponent.displayLogic.childKeyIds.includes(currentSessionComponents[idxComponent].displayLogic.key) ) {
                currentSessionComponents[idxComponent].displayLogic.showMyself = showStatus;

                //turn off childKeyIds[] but we don't want to turn childKeyIds[] unless its direct parent's toBeExpened = false 
                if( !currentSessionComponents[idxComponent].displayLogic.toBeExpend && 
                    currentSessionComponents[idxComponent].displayLogic.childKeyIds.length ) 
                {
                    for( idx2Component = 0;  idx2Component < currentSessionComponents.length; idx2Component++ ) 
                    {
                      if( currentSessionComponents[idxComponent].displayLogic.childKeyIds.includes(currentSessionComponents[idx2Component].displayLogic.key) )
                        currentSessionComponents[idx2Component].displayLogic.showMyself = showStatus;
                    }
                }
            }
              
          }
          
          this.setState( { greetings: currentSessionComponents })
    };

    //need to update showMyself to true after button is clicked to toBeExpend
    //need to update showMyself to false after button is clicked to collaps
    renderGreetings = () => {
      return ( (typeof this.state !== "undefined") && (typeof this.state.greetings !== "undefined" ) )? 
          this.state.greetings.map( (component) => {
                if( component.displayLogic.showMyself === true )
                  return <CCiLabComponent component={component} removeGreeting={this.removeGreeting} showChildren={this.showChildren}/> ;
                else
                return null;
            }
          ) : null;
    };

  


    render() {
      return (
        <div className="HelloWorldList">
          <AddGreeter addGreeting={this.addGreeting} />
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-sm-1  bg-info'>
                {this.renderGreetings()}
              </div>
              <div className='col-sm-11 bg-primary'>
                'this is place holder for component configuration table'
              </div>
            </div>
          </div>
        </div>
      );
    }
}

export default HelloWorldList;
