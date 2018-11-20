import React, { Component } from "react";
import "./AddGreeter.css";

class AddGreeter extends Component {
    state = { greetingName: "" ,
              progressValue: ""};

    handleUpdate = (event)=>{
      this.setState({ greetingName: event.target.value });
    };

    handleProgressUpdate = (event)=>{
      this.setState({progressValue: event.target.value})
    };
    addGreeting = () =>{
      this.props.addGreeting(this.state.greetingName, this.state.progressValue);
      this.setState({ greetingName: "", progressValue:"" });
    };
  
  


    render = () => {
      return (
        <div className="AddGreeter">
          <input
            type="text"
            onChange={this.handleUpdate}
            value={this.state.greetingName}>
            </input>
          
          <input 
            type="text"
            onChange={this.handleProgressUpdate}
            value={this.state.progressValue} 
          />
          &nbsp;&nbsp;
          <button onClick={this.addGreeting}>Add</button>
        </div>
      );
    };
}

export default AddGreeter;
