import React from "react";
import HelloWorld from "./HelloWorld";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <HelloWorld name="Charlie" />
      <HelloWorld name="Jan" />
      <HelloWorld name="Moya" />
    </div>
  );
};

export default App;
