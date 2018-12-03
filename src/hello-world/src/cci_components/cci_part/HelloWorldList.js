
import React, { Component } from "react";
import "./HelloWorldList.css";
import CCiLabComponent from "./HelloWorld";
import AddGreeter from "./AddGreeter";

//image file name should be created the same as component name, so we can create imgName dynamically
//image type is extracted from uploaded image file
//table includes assembly and paint process
const components = [ { businessLogic: {id: 0, name: 'table', parentIds:[], childIds:[1,2,3,4,5,6],  imgType: 'png', status: 'no_issue', progressPercent:0}, displayLogic: { key: 0,childKeyIds:[1,2,3,4,5,6], showMyself:false, toBeExpend: true, insertCnt: 0}},
                     { businessLogic: {id: 1, name:'top', parentIds:[0], childIds:[5,6], imgType:'jpg', status: 'warning', progressPercent: 40}, displayLogic: {key: 1,childKeyIds:[], showMyself: false, toBeExpend: true, insertCnt: 0}},
                     { businessLogic: {id: 2, name:'leg', parentIds:[0], childIds:[5,6], imgType:'jpg', status: 'alarm', progressPercent: 10}, displayLogic: {key: 2, childKeyIds:[],showMyself: false, toBeExpend: true, insertCnt: 0}},
                     { businessLogic: {id: 3, name:'upper_beam', parentIds:[0], childIds:[5,6],  imgType:'jpg', status: 'no_issue', progressPercent: 50},displayLogic: {key: 3,childKeyIds:[], showMyself: false, toBeExpend: true, insertCnt: 0}},
                     { businessLogic: {id: 4, name:'low_beam', parentIds:[0], childIds:[5,6],  imgType:'jpg', status: 'warning', progressPercent: 20},displayLogic: {key: 4,childKeyIds:[], showMyself: false, toBeExpend: true, insertCnt: 0}},
                     { businessLogic: {id: 5, name:'nail', parentIds:[0,1,2,3,4], childIds:[],  imgType:'', status: 'no_issue', progressPercent: 10},displayLogic: {key: 5, childKeyIds:[],showMyself: false, toBeExpend: false, insertCnt: 0}},
                     { businessLogic: {id: 6, name:'glue', parentIds:[0,1,2,3,4], childIds:[], imgType:'', status: 'no_issue', progressPercent: 10},displayLogic: {key: 6,childKeyIds:[], showMyself: false, toBeExpend: false, insertCnt: 0}}
                    ]

class HelloWorldList extends Component {
    state = { greetings: undefined };

    componentWillMount=(components)=>{

    }
  
    addGreeting = (newName, progressValue) =>{
      this.setState({ greetings: [...this.state.greetings, 
        { businessLogic: {id: components.length + 1, name: newName, parentIds:[0], childIds:[], imgType:'', status: "alarm", progressPercent: progressValue}, displayLogic:{key: components.length + 1}, childKeyIds:[], showMyself: true, toBeExpend: true, insertCnt: 0}] });
    };

    removeGreeting = (removeName) =>{
      const filteredGreetings = this.state.greetings.filter(component => {
        return component.businessLogic.name !== removeName;
      });
      this.setState({ greetings: filteredGreetings });
    };

    //based on selected component and its show Status to show or hide its children
    showChildren = ( showChildrenComponent, showStatus ) =>{
          let updateAllComponents =this.state.greetings;
          let showChildrenComponentKey = showChildrenComponent.displayLogic.key;
          let idxChildKeyId = 0;
          let idxChildId = 0;
          let idxComponent = 0;
          let idx2Component = 0;
       
        
        
          // find the first component 
          let firstComponent = updateAllComponents.filter(component=>component.businessLogic.parentIds.length === 0)[0]

          // looping through selected component's child component list
          if( showStatus === true ) 
          {  
            // childKeyIds.length is 0, use childIds to find child component, show it, create childKey and insert this new component to component lists
            // length of childIds and childKeyIds should be same, #todo: need to add check here
            for( idxChildId = 0; idxChildId < showChildrenComponent.businessLogic.childIds.length; idxChildId++) {
              // looping through entire component list to find the component included inside child component list
              for( idxComponent = 0;  idxComponent < updateAllComponents.length; idxComponent++ ) {
                // // if childKeyIds.length !===0 use childKeyIds to find child component and show it,
                // if( updateAllComponents[idxComponent].childKeyIds.length !== 0 ) {
                //   for( idxChildKeyId = 0; idxChildKeyId < updateAllComponents[idxComponent].childKeyIds.length; idxChildKeyId++) {
                //     for( idx2Component = 0;  idx2Component < updateAllComponents.length; idx2Component++ ) {
                //       if( updateAllComponents[idx2Component].key === updateAllComponents[idxComponent].childKeyIds[idxChildKeyId] ) {
                //         updateAllComponents[idx2Component].showMyself = showStatus;
                //       }
                //     }
                //   }
                // }
                // find the component that is the child component, and update the show status of this component
                if( (showChildrenComponent.displayLogic.childKeyIds.length && updateAllComponents[idxComponent].displayLogic.key === showChildrenComponent.displayLogic.childKeyIds[idxChildId] ) ||
                    (updateAllComponents[idxComponent].businessLogic.id === showChildrenComponent.businessLogic.childIds[idxChildId]))
                {
                    //first compoent needs to show all its direct children 
                    if( firstComponent.key === showChildrenComponentKey )
                      updateAllComponents[idxComponent].displayLogic.showMyself = showStatus;

                    // show child components under direct parent component 
                    //make sure parent not the first component,  show its child components
                    // only insert children once, it will stay in the component list forever in current session
                    if( firstComponent.key !== showChildrenComponentKey && showChildrenComponent.displayLogic.insertCnt < showChildrenComponent.businessLogic.childIds.length )
                    {
                        // create an new object to update so the original object won't be updated 
                        let cloneComponent = Object.assign({}, updateAllComponents[idxComponent]);
                        cloneComponent.displayLogic.key = updateAllComponents.length+1;
                        cloneComponent.displayLogic.showMyself = showStatus;
                        showChildrenComponent.displayLogic.childKeyIds.push( cloneComponent.key );
                        let idxInsertAt = updateAllComponents.findIndex(showChildrenComponent=>{return showChildrenComponent.displayLogic.key === showChildrenComponentKey});
                        // insert child component under direct parent
                        updateAllComponents.splice( idxInsertAt+1,0,cloneComponent);
                        updateAllComponents[idxInsertAt].displayLogic.insertCnt++;
                    }
                    break;
                }
              }
            }
          }
          else 
          { 
            // hide all children for the first component, childKeyIds[] should be always 0 for the first component 
            if( firstComponent.displayLogic.key === showChildrenComponentKey ) 
            {
                for( idxChildId = 0; idxChildId < showChildrenComponent.displayLogic.childKeyIds.length; idxChildId++) 
                {
                  // looping through entire component list to find the component included inside child component list
                  for( idxComponent = 0;  idxComponent < updateAllComponents.length; idxComponent++ ) 
                  {
                    // find the component that is the child component, and update the show status of this component
                    if( updateAllComponents[idxComponent].displayLogic.key === showChildrenComponent.displayLogic.childKeyIds[idxChildId] ) 
                    {
                      updateAllComponents[idxComponent].displayLogic.showMyself = showStatus;
                      //turn off childKeyIds[] too
                      if( updateAllComponents[idxComponent].displayLogic.childKeyIds.length !==0 ) 
                      {
                        for( idxChildKeyId = 0; idxChildKeyId < updateAllComponents[idxComponent].displayLogic.childKeyIds.length; idxChildKeyId++)
                        {
                          for( idx2Component = 0;  idx2Component < updateAllComponents.length; idx2Component++ ) 
                          {
                            if( updateAllComponents[idx2Component].displayLogic.key === updateAllComponents[idxComponent].displayLogic.childKeyIds[idxChildKeyId] ) 
                              updateAllComponents[idx2Component].displayLogic.showMyself = showStatus;
                          }
                        }
                      }
                    }
                  }
                }
            }
            else // deleted inserted child components under direct parent component
            {
                let idxHideAt = updateAllComponents.findIndex(showChildrenComponent=>{return showChildrenComponent.displayLogic.key === showChildrenComponentKey});
                updateAllComponents.splice( idxHideAt+1, showChildrenComponent.displayLogic.insertCnt);
                updateAllComponents[idxHideAt].displayLogic.insertCnt = 0;
                updateAllComponents[idxHideAt].displayLogic.childKeyIds.length=0;
            }
          }
          this.setState( { greetings: updateAllComponents })
    };

    //need to update showMyself to true after button is clicked to toBeExpend
    //need to update showMyself to false after button is clicked to collaps
    isShowMyself = ( component )=>{
      if( component.businessLogic.parentIds.length === 0)
        component.displayLogic.showMyself = true;

      if( component.displayLogic.showMyself === true )
        return <CCiLabComponent key={component.displayLogic.key} component={component} removeGreeting={this.removeGreeting} showChildren={this.showChildren}/> ;
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
