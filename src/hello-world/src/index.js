import 'raf/polyfill'
import 'core-js/es6/set'
import 'core-js/es6/map'
import React from "react";
import ReactDOM from "react-dom";

import "./dist/css/index.css";
import ComponentContainer from "./cci_components/cci_part/ComponentContainer";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render( <ComponentContainer />, document.querySelector('.ccilab-rp-root'));

registerServiceWorker();
