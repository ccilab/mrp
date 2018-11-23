
import React, { Component } from "react";
import "./HelloWorldList.css";
import CCiLabComponent from "./HelloWorld";
import AddGreeter from "./AddGreeter";

//image file name should be created the same as component name, so we can create imgName dynamically
//image type is extracted from uploaded image file
//table includes assembly and paint process
const components = [ {id: 00, name: 'table', parentIds:[], childIds:[01,02,03,04,05,06], imgType: 'png', status: 'no_issue', progressPercent:0, showMyself:false},
                     {id: 01, name:'top', parentIds:[00], childIds:[05,06], imgType:'jpg', status: 'warning', progressPercent: 40, showMyself: false},
                     {id: 02, name:'leg', parentIds:[00], childIds:[05,06], imgType:'jpg', status: 'alarm', progressPercent: 10, showMyself: false},
                     {id: 03, name:'upper_beam', parentIds:[00], childIds:[05,06], imgType:'jpg', status: 'no_issue', progressPercent: 50, showMyself: false},
                     {id: 04, name:'low_beam', parentIds:[00], childIds:[05,06], imgType:'jpg', status: 'warning', progressPercent: 20, showMyself: false},
                     {id: 05, name:'nail', parentIds:[00], childIds:[], imgType:'', status: 'no_issue', progressPercent: 100, showMyself: false},
                     {id: 06, name:'glue', parentIds:[00], childIds:[], imgType:'', status: 'no_issue', progressPercent: 100, showMyself: false},
                    ]

class HelloWorldList extends Component {
    state = { greetings: [...components] };
  
    addGreeting = (newName, progressValue) =>{
      this.setState({ greetings: [...this.state.greetings, 
                                  {id: components.length + 1, name: newName, parentIds:[00], childIds:[], imgType:'', status: "alarm", progressPercent: progressValue,  showMyself: true}] });
    };

    //need to update showMyself to true after button is clicked to expend
    //need to update showMyself to false after button is clicked to collaps
    isShowChildren= ( component )=>{
      if( component.parentIds.length === 0)
        component.showMyself = true;

      if( component.showMyself === true )
        return <CCiLabComponent {...cComponent} removeGreeting={this.removeGreeting} /> ;
    };

    renderGreetings = () => {
      return this.state.greetings.map( cComponent => 
        ( <CCiLabComponent {...cComponent} removeGreeting={this.removeGreeting} /> ),
        key=cComponent.id);
    };

  
    removeGreeting = (removeName) =>{
      const filteredGreetings = this.state.greetings.filter(name => {
        return name !== removeName;
      });
      this.setState({ greetings: filteredGreetings });
    }
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
