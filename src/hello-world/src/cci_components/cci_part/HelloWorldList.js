
import React, { Component } from "react";
import "./HelloWorldList.css";
import CCiLabComponent from "./HelloWorld";
import AddGreeter from "./AddGreeter";

//image file name should be created the same as component name, so we can create imgName dynamically
//image type is extracted from uploaded image file
//table includes assembly and paint process
// simulate after loaded very top component and its direct  components
const firstComponents = [ { businessLogic: {id: 0, name: 'table', parentIds:[], childIds:[1,5,6],  imgType: 'png', status: 'no_issue', progressPercent:0}, displayLogic: { key: 0,childKeyIds:[1,2,3], showMyself:false, toBeExpend: true, insertCnt: 0}},
                     { businessLogic: {id: 1, name:'top', parentIds:[0], childIds:[2,3], imgType:'jpg', status: 'warning', progressPercent: 40}, displayLogic: {key: 1,childKeyIds:[], showMyself: false, toBeExpend: true, insertCnt: 0}},
                     { businessLogic: {id: 5, name:'nail', parentIds:[0], childIds:[],  imgType:'', status: 'no_issue', progressPercent: 10},displayLogic: {key: 2, childKeyIds:[],showMyself: false, toBeExpend: false, insertCnt: 0}},
                     { businessLogic: {id: 6, name:'glue', parentIds:[0], childIds:[], imgType:'', status: 'no_issue', progressPercent: 10},displayLogic: {key: 3,childKeyIds:[], showMyself: false, toBeExpend: false, insertCnt: 0}}
                    ]
//const components = [];

// simulate load very top component and its direct components
// const components = [ { businessLogic: {id: 0, name: 'table', parentIds:[], childIds:[1,5,6],  imgType: 'png', status: 'no_issue', progressPercent:0}, displayLogic: { key: undefined,childKeyIds:[], showMyself:false, toBeExpend: false, insertCnt: 0}},
//                      { businessLogic: {id: 1, name:'top', parentIds:[0], childIds:[2,3], imgType:'jpg', status: 'warning', progressPercent: 40}, displayLogic: {key: undefined,childKeyIds:[], showMyself: false, toBeExpend: false, insertCnt: 0}},
//                      { businessLogic: {id: 5, name:'nail', parentIds:[0], childIds:[],  imgType:'', status: 'no_issue', progressPercent: 10},displayLogic: {key: undefined, childKeyIds:[],showMyself: false, toBeExpend: false, insertCnt: 0}},
//                      { businessLogic: {id: 6, name:'glue', parentIds:[0], childIds:[], imgType:'', status: 'no_issue', progressPercent: 10},displayLogic: {key: undefined,childKeyIds:[], showMyself: false, toBeExpend: false, insertCnt: 0}}
//                     ]

// simulate load children of component id 1 ( top )
const components = [
                    { businessLogic: {id: 2, name:'leg', parentIds:[1], childIds:[4], imgType:'jpg', status: 'alarm', progressPercent: 10}, displayLogic: {key: undefined, childKeyIds:[],showMyself: false, toBeExpend: false, insertCnt: 0}},
                     { businessLogic: {id: 3, name:'upper_beam', parentIds:[1], childIds:[5,6],  imgType:'jpg', status: 'no_issue', progressPercent: 50},displayLogic: {key: undefined,childKeyIds:[], showMyself: false, toBeExpend: false, insertCnt: 0}},
                   ]

// const components = [
//                    { businessLogic: {id: 4, name:'low_beam', parentIds:[2], childIds:[5,6],  imgType:'jpg', status: 'warning', progressPercent: 20},displayLogic: {key: undefined,childKeyIds:[], showMyself: false, toBeExpend: false, insertCnt: 0}},
//                      { businessLogic: {id: 5, name:'nail', parentIds:[0,1,2,3,4], childIds:[],  imgType:'', status: 'no_issue', progressPercent: 10},displayLogic: {key: undefined, childKeyIds:[],showMyself: false, toBeExpend: false, insertCnt: 0}},
//                      { businessLogic: {id: 6, name:'glue', parentIds:[0,1,2,3,4], childIds:[], imgType:'', status: 'no_issue', progressPercent: 10},displayLogic: {key: undefined,childKeyIds:[], showMyself: false, toBeExpend: false, insertCnt: 0}}                  
// ]    
class HelloWorldList extends Component {
    state = { greetings: undefined };

    // initialize first component's childKeyIds, reorder in following order: the first component, alarm status, warning status, no_issue status
    componentWillMount=()=>{
      let idx;
      let displayKeyValue = 0;
      let currentSessionComponents=[];

      if( typeof this.state.greetings !== "undefined") {
        this.state.greetings.forEach( (existingComponent)=>{ currentSessionComponents.push( existingComponent ) } );
        displayKeyValue = currentSessionComponents.length;
      }

      
      // initialize displayLogic items, create unique key value for latest componets from data layer
      // this gurrenties that displayLogic.key is unique, newly added componet won't show itself until
      // user clicks it, except the very top component
     
      for(idx = 0; idx < firstComponents.length; idx++ ) {
        let element = firstComponents[idx];
        element.displayLogic.key = displayKeyValue++;
        element.displayLogic.childKeyIds.length = 0;
        element.displayLogic.insertCnt = 0;
        element.displayLogic.showMyself = false;
        element.businessLogic.childIds.length !== 0 ? element.displayLogic.toBeExpend = true : element.displayLogic.toBeExpend = false;
        currentSessionComponents.push(element);
      };
      

      // find the very top component 
      let firstComponent = currentSessionComponents.filter(component=>component.businessLogic.parentIds.length === 0)[0]
      firstComponent.displayLogic.showMyself = true;

      //always show very top component
      if( firstComponent.businessLogic.childIds.length !== 0 ){
        firstComponent.displayLogic.toBeExpend = true;
        // populate very top component's displayLogic.childKeyIds[], if it's not incluced yet
        for( idx = 0; idx < currentSessionComponents.length; idx++ ) { 
          if( firstComponent.businessLogic.childIds.includes( currentSessionComponents[idx].businessLogic.id ) &&
              ( !firstComponent.displayLogic.childKeyIds.includes( currentSessionComponents[idx].displayLogic.key) ) ) {
            firstComponent.displayLogic.childKeyIds.push( currentSessionComponents[idx].displayLogic.key )
          }
        }
      }
      this.setState( {greetings: currentSessionComponents} )
    }
  
    addGreeting = (newName, progressValue) =>{
      this.setState({ greetings: [...this.state.greetings, 
        { businessLogic: {id: this.state.greetings.length + 1, name: newName, parentIds:[0], childIds:[], imgType:'', status: "alarm", progressPercent: progressValue}, displayLogic:{key: undefined}, childKeyIds:[], showMyself: false, toBeExpend: false, insertCnt: 0}] });
    };

    removeGreeting = (removeName) =>{
      const filteredGreetings = this.state.greetings.filter(component => {
        return component.businessLogic.name !== removeName;
      });
      this.setState({ greetings: filteredGreetings });
    };

    //based on selected component and its show Status to show or hide its children
    showChildren = ( showChildrenComponent, showStatus ) =>{
          let updateAllComponents = this.state.greetings; //this.state.greetings;
          let selectComponentKey = showChildrenComponent.displayLogic.key;
          let idxComponent = 0;
          let idx2Component = 0;
       
          let currentSessionComponents=[];
          let displayKeyValue = 0;
        
          if( typeof updateAllComponents !== "undefined") {
            updateAllComponents.forEach( (existingComponent)=>{ currentSessionComponents.push( existingComponent ) } );
            displayKeyValue = currentSessionComponents.length;
          }
    
          
          // initialize displayLogic items, create unique key value for latest componets from data layer
          // this gurrenties that displayLogic.key is unique, newly added componet won't show itself until
          // user clicks it, except the very top component
          let idx;
          for(idx = 0; idx < components.length; idx++ ) {
            let element = components[idx];
            element.displayLogic.key = displayKeyValue++;
            element.displayLogic.childKeyIds.length = 0;
            element.displayLogic.insertCnt = 0;
            element.displayLogic.showMyself = false;
            element.businessLogic.childIds.length !== 0 ? element.displayLogic.toBeExpend = true : element.displayLogic.toBeExpend = false;
            currentSessionComponents.push(element);
          };
        
          // find the first component 
          let firstComponent = currentSessionComponents.filter(component=>component.businessLogic.parentIds.length === 0)[0]

          // looping through selected component's child component list
          if( showStatus === true ) 
          {  
            // childKeyIds.length is 0, use childIds to find child component, show it, create childKey and insert this new component to component lists
            // length of childIds and childKeyIds should be same, #todo: need to add check here
            let childComponentIds = showChildrenComponent.displayLogic.childKeyIds.length ? showChildrenComponent.displayLogic.childKeyIds : showChildrenComponent.businessLogic.childIds;
              
            // looping through entire component list to find the component included inside child component list
            for( idxComponent = 0;  idxComponent < currentSessionComponents.length; idxComponent++ ) {
              // find the component that has the child component, and update the show status of this component
              if( (showChildrenComponent.displayLogic.childKeyIds.length && childComponentIds.includes(currentSessionComponents[idxComponent].displayLogic.key ) ) ||
                  (showChildrenComponent.displayLogic.childKeyIds.length === 0 && childComponentIds.includes(currentSessionComponents[idxComponent].businessLogic.id)))
              {
                  //first compoent needs to show all its direct children 
                  if( firstComponent.displayLogic.key === selectComponentKey )
                  {
                    currentSessionComponents[idxComponent].displayLogic.showMyself = showStatus;
                      //turn on childKeyIds[] too
                    if( currentSessionComponents[idxComponent].displayLogic.childKeyIds.length !==0 ) 
                    {
                        for( idx2Component = 0;  idx2Component < currentSessionComponents.length; idx2Component++ ) 
                        {
                          if( currentSessionComponents[idxComponent].displayLogic.childKeyIds.includes(currentSessionComponents[idx2Component].displayLogic.key))
                          currentSessionComponents[idx2Component].displayLogic.showMyself = showStatus;
                        }
                    }
                  }
                  else
                  {
                      // show child components under direct parent component 
                      let insertCnt = 0;
                      // if selected component's children isn't already in other component's childKeyIds, use selected component's children's Id in its childKeyIds[] 
                      for( idx2Component = 0;  idx2Component < currentSessionComponents.length; idx2Component++ ) {
                        if( currentSessionComponents[idx2Component].displayLogic.childKeyIds.length !== 0 && 
                          currentSessionComponents[idx2Component].displayLogic.childKeyIds.includes(currentSessionComponents[idxComponent].displayLogic.key))
                        {
                          insertCnt++;
                          break;
                        }
                      }
                      // if the same childId referenced in other component's childIds[],
                      // create a new key for this childId. Only insert children once, it will stay in the component list forever in current session
                      if( insertCnt !== 0 )
                      {
                          // create an new object to update so the original object won't be updated 
                          let cloneDisplayLogic = Object.assign({}, currentSessionComponents[idxComponent].displayLogic);
                          cloneDisplayLogic.key = currentSessionComponents.length+1;
                          cloneDisplayLogic.showMyself = showStatus;
                          currentSessionComponents[idxComponent].businessLogic.childIds.length ? cloneDisplayLogic.toBeExpend = true : cloneDisplayLogic.toBeExpend = false;
                          showChildrenComponent.displayLogic.childKeyIds.push( cloneDisplayLogic.key );
                          let cloneComponent = Object.assign({}, {businessLogic: currentSessionComponents[idxComponent].businessLogic, displayLogic: cloneDisplayLogic});
                          let idxInsertAt = currentSessionComponents.findIndex(showChildrenComponent=>{return showChildrenComponent.displayLogic.key === selectComponentKey});
                          // insert child component under direct parent
                          currentSessionComponents.splice( idxInsertAt+1,0,cloneComponent);
                          showChildrenComponent.displayLogic.insertCnt++;
                      }
                      else
                      { // no childKey is used in any other component's childKeyIds[], there is no need to create new key,
                        showChildrenComponent.displayLogic.childKeyIds.push( currentSessionComponents[idxComponent].displayLogic.key );
                        currentSessionComponents[idxComponent].displayLogic.showMyself = showStatus;
                      }
                        
                  }
              }
            }
          }
          else 
          { 
            // hide all children for the first component, childKeyIds[] should be always 0 for the first component 
            if( firstComponent.displayLogic.key === selectComponentKey ) 
            {
                // looping through entire component list to find the component included inside child component list
                for( idxComponent = 0;  idxComponent < currentSessionComponents.length; idxComponent++ ) 
                {
                  // skip the first component
                  if( currentSessionComponents[idxComponent].displayLogic.key === selectComponentKey )
                    continue;

                  // find the component that is the child component, and update the show status of this component
                  if( showChildrenComponent.displayLogic.childKeyIds.includes(currentSessionComponents[idxComponent].displayLogic.key))
                  currentSessionComponents[idxComponent].displayLogic.showMyself = showStatus;
                    
                  //turn off childKeyIds[] too
                  if( currentSessionComponents[idxComponent].displayLogic.childKeyIds.length !==0 ) 
                  {
                      for( idx2Component = 0;  idx2Component < currentSessionComponents.length; idx2Component++ ) 
                      {
                        if( currentSessionComponents[idxComponent].displayLogic.childKeyIds.includes(currentSessionComponents[idx2Component].displayLogic.key))
                        currentSessionComponents[idx2Component].displayLogic.showMyself = showStatus;
                      }
                  }
                }
            }
            else // deleted inserted child components under direct parent component
            {
                let idxHideAt = currentSessionComponents.findIndex(showChildrenComponent=>{return showChildrenComponent.displayLogic.key === selectComponentKey});
                currentSessionComponents.splice( idxHideAt+1, showChildrenComponent.displayLogic.insertCnt);
                currentSessionComponents[idxHideAt].displayLogic.insertCnt = 0;
                currentSessionComponents[idxHideAt].displayLogic.childKeyIds.length=0;
            }
          }
          this.setState( { greetings: currentSessionComponents })
    };

    //need to update showMyself to true after button is clicked to toBeExpend
    //need to update showMyself to false after button is clicked to collaps
    renderGreetings = () => {
      return (typeof this.state.greetings !== "undefined" ) ? this.state.greetings.map( (component) => {
                if( component.displayLogic.showMyself === true )
                  return <CCiLabComponent key={component.displayLogic.key} component={component} removeGreeting={this.removeGreeting} showChildren={this.showChildren}/> ;
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
