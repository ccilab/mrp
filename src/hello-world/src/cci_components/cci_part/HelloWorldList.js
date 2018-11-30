
import React, { Component } from "react";
import "./HelloWorldList.css";
import CCiLabComponent from "./HelloWorld";
import AddGreeter from "./AddGreeter";

//image file name should be created the same as component name, so we can create imgName dynamically
//image type is extracted from uploaded image file
//table includes assembly and paint process
const components = [ {id: 0, name: 'table', parentIds:[], childIds:[1,2,3,4,5,6],  imgType: 'png', status: 'no_issue', progressPercent:0, key: 0,childKeyIds:[], showMyself:false, toBeExpend: true, insertCnt: 0},
                     {id: 1, name:'top', parentIds:[0], childIds:[5,6], imgType:'jpg', status: 'warning', progressPercent: 40, key: 1,childKeyIds:[], showMyself: false, toBeExpend: true, insertCnt: 0},
                     {id: 2, name:'leg', parentIds:[0], childIds:[5,6], imgType:'jpg', status: 'alarm', progressPercent: 10, key: 2, childKeyIds:[],showMyself: false, toBeExpend: true, insertCnt: 0},
                     {id: 3, name:'upper_beam', parentIds:[0], childIds:[5,6],  imgType:'jpg', status: 'no_issue', progressPercent: 50,key: 3,childKeyIds:[], showMyself: false, toBeExpend: true, insertCnt: 0},
                     {id: 4, name:'low_beam', parentIds:[0], childIds:[5,6],  imgType:'jpg', status: 'warning', progressPercent: 20,key: 4,childKeyIds:[], showMyself: false, toBeExpend: true, insertCnt: 0},
                     {id: 5, name:'nail', parentIds:[0,1,2,3,4], childIds:[],  imgType:'', status: 'no_issue', progressPercent: 10,key: 5, childKeyIds:[],showMyself: false, toBeExpend: false, insertCnt: 0},
                     {id: 6, name:'glue', parentIds:[0,1,2,3,4], childIds:[], imgType:'', status: 'no_issue', progressPercent: 10,key: 6,childKeyIds:[], showMyself: false, toBeExpend: false, insertCnt: 0},
                    ]

class HelloWorldList extends Component {
    state = { greetings: [...components] };
  
    addGreeting = (newName, progressValue) =>{
      this.setState({ greetings: [...this.state.greetings, 
                                  {id: components.length + 1, name: newName, parentIds:[0], childIds:[], imgType:'', status: "alarm", progressPercent: progressValue,  showMyself: true, toBeExpend: true, insertCnt: 0}] });
    };

    removeGreeting = (removeName) =>{
      const filteredGreetings = this.state.greetings.filter(name => {
        return name !== removeName;
      });
      this.setState({ greetings: filteredGreetings });
    };

    //based on selected component and its show Status to show or hide its children
    showChildren = ( showChildrenComponent, showStatus ) =>{
          let updateAllComponents =this.state.greetings;
          let showChildrenComponentId = showChildrenComponent.id;
        
        
          // find the first component 
          let firstComponent = updateAllComponents.filter(component=>component.parentIds.length === 0)[0]

          // looping through selected component's child component list
            if( showStatus === true ) 
            {  
              let displayChildList = showChildrenComponent.childKeyIds.length ? showChildrenComponent.childKeyIds : showChildrenComponent.childIds;
              // length of childIds and childKeyIds should be same, #todo: need to add check here
              for( let idxChildId = 0; idxChildId < displayChildList.length; idxChildId++) 
              {
                // looping through entire component list to find the component included inside child component list
                for( let idxComponent = 0;  idxComponent < updateAllComponents.length; idxComponent++ ) 
                {
                  // find the component that is the child component, and update the show status of this component
                  // if childKeyIds.length !===0 use childKeyIds to find child component and show it,
                  // if childKeyIds.length ===0, use childIds to find child component, show it, create childKey and insert this new component to component lists
                  if( updateAllComponents[idxComponent].id === showChildrenComponent.childIds[idxChildId] ) 
                  {
                      updateAllComponents[idxComponent].showMyself = showStatus;

                      // show child components under direct parent component 
                      //make sure parent not the first component,  show its child components
                      // only insert children once, it will stay in the component list forever in current session
                      if( firstComponent.id !== showChildrenComponentId && showChildrenComponent.insertCnt < showChildrenComponent.childIds.length )
                      {
                          // filter returns a reference of original object of array 
                          let childrenComponentList =  updateAllComponents.filter(component=>component.id === updateAllComponents[idxComponent].id) ;
                          // create an new object to update so the original object won't be updated 
                          let cloneComponent = Object.assign({}, childrenComponentList[0]);
                          cloneComponent.key = updateAllComponents.length+1;
                          showChildrenComponent.childKeyIds.push( cloneComponent.key );
                          let idxInsertAt = updateAllComponents.findIndex(showChildrenComponent=>{return showChildrenComponent.id === showChildrenComponentId});
                          // insert child component under direct parent
                          updateAllComponents.splice( idxInsertAt+1,0,cloneComponent);
                          updateAllComponents[idxInsertAt].insertCnt++;
                      }
                      break;
                  }
                }
              }
            }
            else 
            { // hide all children for the first component 
              if( firstComponent.id === showChildrenComponentId ) 
              {
                  for( let idxChildId = 0; idxChildId < showChildrenComponent.childIds.length; idxChildId++) 
                  {
                    // looping through entire component list to find the component included inside child component list
                    for( let idxComponent = 0;  idxComponent < updateAllComponents.length; idxComponent++ ) 
                    {
                      // find the component that is the child component, and update the show status of this component
                      if( updateAllComponents[idxComponent].id === showChildrenComponent.childIds[idxChildId] ) 
                      {
                          updateAllComponents[idxComponent].showMyself = showStatus;
                      }
                    }
                  }
              }
              else // deleted inserted child components under direct parent component
              {
                  let idxHideAt = updateAllComponents.findIndex(showChildrenComponent=>{return showChildrenComponent.id === showChildrenComponentId});
                  updateAllComponents.splice( idxHideAt+1, showChildrenComponent.insertCnt);
                  updateAllComponents[idxHideAt].insertCnt = 0;
              }
            }
        this.setState( { greetings: updateAllComponents })
    };

    //need to update showMyself to true after button is clicked to toBeExpend
    //need to update showMyself to false after button is clicked to collaps
    isShowMyself = ( component )=>{
      if( component.parentIds.length === 0)
        component.showMyself = true;

      if( component.showMyself === true )
        return <CCiLabComponent key={component.key} component={component} removeGreeting={this.removeGreeting} showChildren={this.showChildren}/> ;
    };

    renderGreetings = () => {
      return this.state.greetings.map( (component) => 
        ( this.isShowMyself(component ) ) );
    };

  


    render() {
      return (
        <div className="HelloWorldList">
          <AddGreeter addGreeting={this.addGreeting} />
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-sm-3'>
                {this.renderGreetings()}
              </div>
              <div className='col-sm-9'>
                'this is place holder for component configuration table'
              </div>
            </div>
          </div>
        </div>
      );
    }
}

export default HelloWorldList;
