
import React, { Component } from "react";
import "./HelloWorldList.css";
import CCiLabComponent from "./HelloWorld";
import AddGreeter from "./AddGreeter";


class HelloWorldList extends Component {
    state = { greetings: [ {progressPercent: 40, status: "warning", imgName: "edit_32.png", parentIds: [], siblingIds: [] }, 
                           {progressPercent: 20, status: "no_issue", imgName: "edit.svg", parentIds: ['p3', 'p4'], siblingIds: ['s21','s22'] }, 
                           {progressPercent: 90, status: "alarm", imgName: "table.png", parentIds: ['p5', 'p6'], siblingIds: ['s31','s32','s33'] }]}
    
  
    addGreeting = (newName, progressValue) =>{
      this.setState({ greetings: [...this.state.greetings, 
                                  {progressPercent: progressValue, status: "alarm", imgName: newName, parentIds: ['p5', 'p6'], siblingIds: ['s5','s6'] }] });
    }

    renderGreetings = () => {
      return this.state.greetings.map(cComponent => (
        <CCiLabComponent {...cComponent} removeGreeting={this.removeGreeting} />
      ));
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
