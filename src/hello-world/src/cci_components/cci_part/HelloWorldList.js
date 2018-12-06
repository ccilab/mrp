
import React, { Component } from "react";
import "./HelloWorldList.css";
import CCiLabComponent from "./HelloWorld";
import AddGreeter from "./AddGreeter";

//image file name should be created the same as component name, so we can create imgName dynamically
//image type is extracted from uploaded image file
//table includes assembly and paint process
const components = [ { businessLogic: {id: 0, name: 'table', parentIds:[], childIds:[1,5,6],  imgType: 'png', status: 'no_issue', progressPercent:0}, displayLogic: { key: undefined,childKeyIds:[], showMyself:false, toBeExpend: false, insertCnt: 0}},
                     { businessLogic: {id: 1, name:'top', parentIds:[0], childIds:[2,3], imgType:'jpg', status: 'warning', progressPercent: 40}, displayLogic: {key: undefined,childKeyIds:[], showMyself: false, toBeExpend: false, insertCnt: 0}},
                     { businessLogic: {id: 2, name:'leg', parentIds:[1], childIds:[4], imgType:'jpg', status: 'alarm', progressPercent: 10}, displayLogic: {key: undefined, childKeyIds:[],showMyself: false, toBeExpend: false, insertCnt: 0}},
                     { businessLogic: {id: 3, name:'upper_beam', parentIds:[1], childIds:[5,6],  imgType:'jpg', status: 'no_issue', progressPercent: 50},displayLogic: {key: undefined,childKeyIds:[], showMyself: false, toBeExpend: false, insertCnt: 0}},
                     { businessLogic: {id: 4, name:'low_beam', parentIds:[2], childIds:[5,6],  imgType:'jpg', status: 'warning', progressPercent: 20},displayLogic: {key: undefined,childKeyIds:[], showMyself: false, toBeExpend: false, insertCnt: 0}},
                     { businessLogic: {id: 5, name:'nail', parentIds:[0,1,2,3,4], childIds:[],  imgType:'', status: 'no_issue', progressPercent: 10},displayLogic: {key: undefined, childKeyIds:[],showMyself: false, toBeExpend: false, insertCnt: 0}},
                     { businessLogic: {id: 6, name:'glue', parentIds:[0,1,2,3,4], childIds:[], imgType:'', status: 'no_issue', progressPercent: 10},displayLogic: {key: undefined,childKeyIds:[], showMyself: false, toBeExpend: false, insertCnt: 0}}
                    ]

class HelloWorldList extends Component {
    state = { greetings: undefined };

    // initialize first component's childKeyIds, reorder in following order: the first component, alarm status, warning status, no_issue status
    componentWillMount=()=>{
      let idx, idx2;
      let idxChildId;
      let displayKeyValue = 0;

      // initialize displayLogic items, create unique key value
      for(idx = 0; idx < components.length; idx++ ) {
        let element = components[idx];
        element.displayLogic.key = displayKeyValue++;
        element.displayLogic.childKeyIds.length = 0;
        element.displayLogic.insertCnt = 0;
        element.displayLogic.showMyself = false;
        element.businessLogic.childIds.length ? element.displayLogic.toBeExpend = true : element.displayLogic.toBeExpend = false;
      };

      // find the very top component 
      let initialComponents=[];
      let firstComponent = components.filter(component=>component.businessLogic.parentIds.length === 0)[0]
      firstComponent.displayLogic.showMyself = true;
      initialComponents.push(firstComponent);

      if( firstComponent.businessLogic.childIds.length !== 0 ){
        firstComponent.displayLogic.toBeExpend = true;
        for(idxChildId = 0; idxChildId < firstComponent.businessLogic.childIds.length; idxChildId++ ) {
          for( idx = 0, idx2 = 0; idx < components.length; idx++, idx2++ ) { 
            if( firstComponent.businessLogic.childIds[idxChildId] === components[idx].businessLogic.id && 
                ( idx2 >= initialComponents.length || 
                  firstComponent.businessLogic.childIds[idxChildId] !== initialComponents[idx2].businessLogic.id
                  )) {
              firstComponent.displayLogic.childKeyIds.push( components[idx].displayLogic.key )
              initialComponents.push( components[idx] );
              break;
            }
          }
        }
      }
      this.setState( {greetings: initialComponents} )
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
          let updateAllComponents = components; //this.state.greetings;
          let selectComponentKey = showChildrenComponent.displayLogic.key;
          let idxComponent = 0;
          let idx2Component = 0;
       
        
        
          // find the first component 
          let firstComponent = updateAllComponents.filter(component=>component.businessLogic.parentIds.length === 0)[0]

          // looping through selected component's child component list
          if( showStatus === true ) 
          {  
            // childKeyIds.length is 0, use childIds to find child component, show it, create childKey and insert this new component to component lists
            // length of childIds and childKeyIds should be same, #todo: need to add check here
            let childComponentIds = showChildrenComponent.displayLogic.childKeyIds.length ? showChildrenComponent.displayLogic.childKeyIds : showChildrenComponent.businessLogic.childIds;
              
            // looping through entire component list to find the component included inside child component list
            for( idxComponent = 0;  idxComponent < updateAllComponents.length; idxComponent++ ) {
              // find the component that has the child component, and update the show status of this component
              if( (showChildrenComponent.displayLogic.childKeyIds.length && childComponentIds.includes(updateAllComponents[idxComponent].displayLogic.key ) ) ||
                  (showChildrenComponent.displayLogic.childKeyIds.length === 0 && childComponentIds.includes(updateAllComponents[idxComponent].businessLogic.id)))
              {
                  //first compoent needs to show all its direct children 
                  if( firstComponent.displayLogic.key === selectComponentKey )
                  {
                     updateAllComponents[idxComponent].displayLogic.showMyself = showStatus;
                      //turn on childKeyIds[] too
                    if( updateAllComponents[idxComponent].displayLogic.childKeyIds.length !==0 ) 
                    {
                        for( idx2Component = 0;  idx2Component < updateAllComponents.length; idx2Component++ ) 
                        {
                          if( updateAllComponents[idxComponent].displayLogic.childKeyIds.includes(updateAllComponents[idx2Component].displayLogic.key))
                            updateAllComponents[idx2Component].displayLogic.showMyself = showStatus;
                        }
                    }
                  }
                  else
                  {
                      // show child components under direct parent component 
                      let insertCnt = 0;
                      // if selected component's children isn't already in other component's childKeyIds, use selected component's children's Id in its childKeyIds[] 
                      for( idx2Component = 0;  idx2Component < updateAllComponents.length; idx2Component++ ) {
                        if( updateAllComponents[idx2Component].displayLogic.childKeyIds.length !== 0 && 
                            updateAllComponents[idx2Component].displayLogic.childKeyIds.includes(updateAllComponents[idxComponent].displayLogic.key))
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
                          let cloneDisplayLogic = Object.assign({}, updateAllComponents[idxComponent].displayLogic);
                          cloneDisplayLogic.key = updateAllComponents.length+1;
                          cloneDisplayLogic.showMyself = showStatus;
                          updateAllComponents[idxComponent].businessLogic.childIds.length ? cloneDisplayLogic.toBeExpend = true : cloneDisplayLogic.toBeExpend = false;
                          showChildrenComponent.displayLogic.childKeyIds.push( cloneDisplayLogic.key );
                          let cloneComponent = Object.assign({}, {businessLogic: updateAllComponents[idxComponent].businessLogic, displayLogic: cloneDisplayLogic});
                          let idxInsertAt = updateAllComponents.findIndex(showChildrenComponent=>{return showChildrenComponent.displayLogic.key === selectComponentKey});
                          // insert child component under direct parent
                          updateAllComponents.splice( idxInsertAt+1,0,cloneComponent);
                          showChildrenComponent.displayLogic.insertCnt++;
                      }
                      else
                      { // no childKey is used in any other component's childKeyIds[], there is no need to create new key,
                        showChildrenComponent.displayLogic.childKeyIds.push( updateAllComponents[idxComponent].displayLogic.key );
                        updateAllComponents[idxComponent].displayLogic.showMyself = showStatus;
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
                for( idxComponent = 0;  idxComponent < updateAllComponents.length; idxComponent++ ) 
                {
                  // skip the first component
                  if( updateAllComponents[idxComponent].displayLogic.key === selectComponentKey )
                    continue;

                  // find the component that is the child component, and update the show status of this component
                  if( showChildrenComponent.displayLogic.childKeyIds.includes(updateAllComponents[idxComponent].displayLogic.key))
                    updateAllComponents[idxComponent].displayLogic.showMyself = showStatus;
                    
                  //turn off childKeyIds[] too
                  if( updateAllComponents[idxComponent].displayLogic.childKeyIds.length !==0 ) 
                  {
                      for( idx2Component = 0;  idx2Component < updateAllComponents.length; idx2Component++ ) 
                      {
                        if( updateAllComponents[idxComponent].displayLogic.childKeyIds.includes(updateAllComponents[idx2Component].displayLogic.key))
                          updateAllComponents[idx2Component].displayLogic.showMyself = showStatus;
                      }
                  }
                }
            }
            else // deleted inserted child components under direct parent component
            {
                let idxHideAt = updateAllComponents.findIndex(showChildrenComponent=>{return showChildrenComponent.displayLogic.key === selectComponentKey});
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
