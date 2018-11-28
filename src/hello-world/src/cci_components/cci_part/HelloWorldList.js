
import React, { Component } from "react";
import "./HelloWorldList.css";
import CCiLabComponent from "./HelloWorld";
import AddGreeter from "./AddGreeter";

//image file name should be created the same as component name, so we can create imgName dynamically
//image type is extracted from uploaded image file
//table includes assembly and paint process
const components = [ {id: 0, name: 'table', parentIds:[], childIds:[1,2,3,4,5,6], imgType: 'png', status: 'no_issue', progressPercent:0, showMyself:false},
                     {id: 1, name:'top', parentIds:[0], childIds:[5,6], imgType:'jpg', status: 'warning', progressPercent: 40, showMyself: false},
                     {id: 2, name:'leg', parentIds:[0], childIds:[5,6], imgType:'jpg', status: 'alarm', progressPercent: 10, showMyself: false},
                     {id: 3, name:'upper_beam', parentIds:[0], childIds:[5,6], imgType:'jpg', status: 'no_issue', progressPercent: 50, showMyself: false},
                     {id: 4, name:'low_beam', parentIds:[0], childIds:[5,6], imgType:'jpg', status: 'warning', progressPercent: 20, showMyself: false},
                     {id: 5, name:'nail', parentIds:[0,1,2,3,4], childIds:[], imgType:'', status: 'no_issue', progressPercent: 10, showMyself: false},
                     {id: 6, name:'glue', parentIds:[0,1,2,3,4], childIds:[], imgType:'', status: 'no_issue', progressPercent: 10, showMyself: false},
                    ]

class HelloWorldList extends Component {
    state = { greetings: [...components] };
  
    addGreeting = (newName, progressValue) =>{
      this.setState({ greetings: [...this.state.greetings, 
                                  {id: components.length + 1, name: newName, parentIds:[0], childIds:[], imgType:'', status: "alarm", progressPercent: progressValue,  showMyself: true}] });
    };

    removeGreeting = (removeName) =>{
      const filteredGreetings = this.state.greetings.filter(name => {
        return name !== removeName;
      });
      this.setState({ greetings: filteredGreetings });
    };

    showChildren = ( showChildrenComponent, showStatus ) =>{
          let updateAllComponents =this.state.greetings;
          let showChildrenComponentId = showChildrenComponent.id;
        
        
          // find the first component 
          let firstComponent = updateAllComponents.filter(component=>component.parentIds.length === 0)[0]

          // looping through selected component's child component list
          for( let idxChildId = 0; idxChildId < showChildrenComponent.childIds.length; idxChildId++) {
               // looping through entire component list to find the component included inside child component list
               for( let idxComponent = 0;  idxComponent < updateAllComponents.length; idxComponent++ ) {
                 // find the component that is the child component, and update the show status of this component
                 if( updateAllComponents[idxComponent].id === showChildrenComponent.childIds[idxChildId] ) {
                    updateAllComponents[idxComponent].showMyself = showStatus;

                    // show child components under direct parent component 
                    if( showStatus === true ) {
                        //parent not the first component, parent is the selected component show its child components
                        if( firstComponent.id !== showChildrenComponentId ){
                            let childComponent = updateAllComponents[idxComponent];
                            let idxInsertAt = updateAllComponents.findIndex(showChildrenComponent=>{return showChildrenComponent.id === showChildrenComponentId});
                            updateAllComponents.splice( idxInsertAt+1,0,childComponent);
                        }
                    }
                    // hide child components under direct parent component
                    else {
                      if( firstComponent.id !== showChildrenComponentId ) {
                          let idxDeleteAt = updateAllComponents.findIndex(showChildrenComponent=>{return showChildrenComponent.id === showChildrenComponentId});
                          updateAllComponents.splice( idxDeleteAt+1,1);
                      }
                    }
                 }
               }
          }
        this.setState( { greetings: updateAllComponents })
    };

    //need to update showMyself to true after button is clicked to expend
    //need to update showMyself to false after button is clicked to collaps
    isShowMyself = ( component )=>{
      if( component.parentIds.length === 0)
        component.showMyself = true;

      if( component.showMyself === true )
        return <CCiLabComponent key={component.id} component={component} removeGreeting={this.removeGreeting} showChildren={this.showChildren}/> ;
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