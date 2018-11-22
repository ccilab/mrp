import React, { Component } from "react";
import "./AddGreeter.css";

class AddGreeter extends Component {
    state = { greetingName: "" ,
              progressValue: ""};

    render = () => {
      return (
        <div className="AddGreeter">
          <input
            type="text"
            onChange={(event)=>{
              this.setState({ greetingName: event.target.value })}}
            value={this.state.greetingName}>
            </input>
          
          <input 
            type="text"
            onChange={(event)=>{
              this.setState({progressValue: event.target.value})}}
            value={this.state.progressValue} 
          />
          &nbsp;&nbsp;
          <button onClick={ () =>{
            this.props.addGreeting(this.state.greetingName, this.state.progressValue);
            this.setState({ greetingName: "", progressValue:"" });
            } }>
            Add
            </button>
        </div>
      );
    };
}

export default AddGreeter;
