import React from "react";
import ReactDOM from "react-dom";

const dropDomponentWarningModal = (
    <div className='modal fade'>
        <div className='modal-dialog'>
            <div className='modal-content'>
            {/* Modal Header */}
                <h4 className='modal-title text-danger'>Warning:</h4>
                <button type='button' className='close' data-dismiss='modal'>&time;</button>
            </div>

            {/* Modal body */}
            <div className="modal-body">
                Target component has same item as its child component!
            </div>

            {/* Modal footer */}
            <div className="modal-footer">
            <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
            </div>
        </div>
        
    </div>
);

// #drop-component-check-failed-modal is id defined in index.html
const DropComponentCheckFailedModal =(props)=>{
    return ReactDOM.createPortal( dropDomponentWarningModal, document.querySelector('#drop-component-check-failed-modal') );
}

export default DropComponentCheckFailedModal;
