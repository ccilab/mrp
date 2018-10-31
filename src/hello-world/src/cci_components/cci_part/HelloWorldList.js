import React, { Component } from "react";
import "./HelloWorldList.css";
import CCiLabComponent from "./HelloWorld";
import AddGreeter from "./AddGreeter";


class HelloWorldList extends Component {
    state = { greetings: [ {status: "warning", imgName: "edit_32.png", parentIds: ['p1', 'p2'], siblingIds: ['s1','s2'] }, 
                                {status: "no_issue", imgName: "edit.svg", parentIds: ['p3', 'p4'], siblingIds: ['s3','s24'] }, 
                                {status: "alarm", imgName: "table.png", parentIds: ['p5', 'p6'], siblingIds: ['s5','s6'] }]}
    
  
    addGreeting = (newName) =>{
      this.setState({ greetings: [...this.state.greetings, {status: "alarm", imgName: newName, parentIds: ['p5', 'p6'], siblingIds: ['s5','s6'] }] });
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
          {this.renderGreetings()}
        </div>
      );
    }
}

export default HelloWorldList;
