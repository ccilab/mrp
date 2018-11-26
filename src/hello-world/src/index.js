import 'raf/polyfill'
import 'core-js/es6/set'
import 'core-js/es6/map'
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./cci_components/cci_part/App";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
