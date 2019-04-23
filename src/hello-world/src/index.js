import 'raf/polyfill'
// import 'core-js/es6/set'
// import 'core-js/es6/map'
import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";

import "./dist/css/index.css";
import ComponentContainer from "./cci_components/cci_part/ComponentContainer";
import './cci_components/l18n/i18n'


ReactDOM.render( <ComponentContainer />, document.querySelector('.ccilab-rp-root'));

registerServiceWorker();
