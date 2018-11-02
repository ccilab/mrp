import 'raf/polyfill'
import 'core-js/es6/set'
import 'core-js/es6/map'
import React from "react";
import HelloWorldList from "./HelloWorldList";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <HelloWorldList />
    </div>
  );
};

export default App;
