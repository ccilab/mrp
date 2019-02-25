import React, { Component } from "react";
import ReactDOM from "react-dom";

class Modal extends Component {
    el = document.createElement('div');

    componentDidMount=()=>{
        // Append the element into the DOM on mount. We'll render
        // into the modal container element (see the HTML tab).
        document.getElementById('drop-component-check-failed-modal').appendChild(this.el);
    }

    componentWillUnmount=()=>{
        // Remove the element from the DOM when we unmount
        document.getElementById('drop-component-check-failed-modal').removeChild(this.el);
    }
    
    render () {
        // Use a portal to render the children into the element
        return ReactDOM.createPortal(
                // Any valid React child: JSX, strings, arrays, etc.
                this.props.children,
                // A DOM element
                this.el,
                );
    }
}

function DropComponentWarningModal(props) {
    return <Modal>
              <div className='modal' style={{'display':'inline'}}>
                  <div className='modal-dialog' >
                      <div className='modal-content bg-faded' style={{"background-color":"#D3D3D3!important;"}}>
                          {/* Modal Header */}
                          <div className='modal-header'>
                              <h5 className='modal-title text-danger'>{props.title}</h5>
                              <button type='button' className='close' aria-label="Close" onClick={props.hideDropWarning}>
                                <span aria-hidden="true">&times;</span>
                              </button>
                          </div>

                          {/* Modal body */}                 
                          <div className="modal-body">
                           <h5> {props.body} </h5>
                          </div>

                          {/* Modal footer */}
                          <div className="modal-footer">
                            <button type="button" className="btn btn-danger" onClick={props.hideDropWarning}>Close</button>
                          </div>
                      </div>
                  </div>
              </div>
           </Modal>;
}

export default DropComponentWarningModal;

// const dropDomponentWarningModalBase = (
//     <div className='modal fade'>
//         <div className='modal-dialog'>
//             <div className='modal-content'>
//                 {/* Modal Header */}
//                 <div className='modal-header'>
//                     <h4 className='modal-title text-danger'>Warning:</h4>
//                     <button type='button' className='close' data-dismiss='modal'>&time;</button>
//                 </div>

//                 {/* Modal body */}
//                 <div className="modal-body">
//                     Target component has same item as its child component!
//                 </div>

//                 {/* Modal footer */}
//                 <div className="modal-footer">
//                 <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
//                 </div>
//                 </div>
//         </div>
        
//     </div>
// );

// // #drop-component-check-failed-modal is id defined in index.html
// const DropComponentCheckFailedModal =(props)=>{
//     return ReactDOM.createPortal( dropDomponentWarningModalBase, document.querySelector('#drop-component-check-failed-modal') );
// }

// export default DropComponentCheckFailedModal;
