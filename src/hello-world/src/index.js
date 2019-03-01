import 'raf/polyfill'
import 'core-js/es6/set'
import 'core-js/es6/map'
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import ComponentContainer from "./cci_components/cci_part/ComponentContainer";
import registerServiceWorker from "./registerServiceWorker";
import ('./dist/css/main.css')

// ReactDOM.render(<ComponentContainer />, document.getElementById("root"));
ReactDOM.render( <ComponentContainer />, document.querySelector('.ccilab-component-list-component'));
registerServiceWorker();
