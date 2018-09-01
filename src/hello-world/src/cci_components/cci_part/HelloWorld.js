import React, { Component } from "react";
import "./HelloWorld.css";

class HelloWorld extends Component {
  constructor(props) {
    super(props);
    this.state = {
      greeting: "Hello",
      changing: "Frenchify"
    };
    this.frenchify = this.frenchify.bind(this);
  }
  frenchify = () => {
    if (this.state.greeting === "Hello") this.setState({ greeting: "Bonjour" });
    else this.setState({ greeting: "Hello" });

    if (this.state.changing === "Frenchify")
      this.setState({ changing: "Englisify" });
    else this.setState({ changing: "Frenchify" });
  };
  render() {
    return (
      <div className="HelloWorld">
        {this.state.greeting} {this.props.name}!<br />
        <button onClick={this.frenchify}>{this.state.changing}!</button>
      </div>
    );
  }
}

export default HelloWorld;
