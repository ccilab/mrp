
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
                     {id: 5, name:'nail', parentIds:[0], childIds:[], imgType:'', status: 'no_issue', progressPercent: 10, showMyself: false},
                     {id: 6, name:'glue', parentIds:[0], childIds:[], imgType:'', status: 'no_issue', progressPercent: 10, showMyself: false},
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

    showChildren = ( componentId ) =>{
        this.state.greetings.find( (componentId)=>{
          this.state.greetings.childIds.map( (childId)=>(
            const children = this.state.greetings.map( (component)=>(
              if( component.id === childId )
                updatedComponent.showMyself = ture;
            
              // call render to update component list
              this.setState( { greetings: children})        
          ) 
        };
    };

    //need to update showMyself to true after button is clicked to expend
    //need to update showMyself to false after button is clicked to collaps
    isShowChildren = ( component )=>{
      if( component.parentIds.length === 0)
        component.showMyself = true;

      if( component.showMyself === true )
        return <CCiLabComponent key={component.id} component={component} removeGreeting={this.removeGreeting} /> ;
    };

    renderGreetings = () => {
      return this.state.greetings.map( (cComponent) => 
        ( this.isShowChildren(cComponent ) ) );
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
