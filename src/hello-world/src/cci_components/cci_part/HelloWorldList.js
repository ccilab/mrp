import React, { Component } from "react";
import "./HelloWorldList.css";
import HelloWorld from "./HelloWorld";

class HelloWorldList extends Component {
  render() {
    return (
      <div className="HelloWorldList">
        <HelloWorld name="Charlie" />
        <HelloWorld name="Jan" />
        <HelloWorld name="Moya" />
      </div>
    );
  }
}

export default HelloWorldList;
