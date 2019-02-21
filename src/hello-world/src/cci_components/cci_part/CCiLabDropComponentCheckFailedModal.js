import React from "react";
import ReactDOM from "react-dom";

const DROP_COMPONENT_CHECK_FAILED_MODAL = (
    <div className='modal'>
        Target component has same item as its child component!
    </div>
);


const DropComponentCheckFailedModal =(props)=>{
    return ReactDOM.createPortal( DROP_COMPONENT_CHECK_FAILED_MODAL, document.querySelector('#drop-component-check-failed-modal') );
}

const DropComponentCheckFailedModal;
