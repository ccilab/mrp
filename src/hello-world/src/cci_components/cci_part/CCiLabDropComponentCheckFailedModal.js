import React, { Component } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation('warning', {useSuspense: false});
    return <Modal>
              <div className='modal' style={{'display':'inline'}}>
                  <div className='modal-dialog'>
                  {/* https://www.htmlcsscolor.com/hex/CDCDCD */}
                  {/* https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity */}
                  {/* backgroundColor converts to background-color */}
                      <div className='modal-content'  style={{'backgroundColor': '#E5E5E5'}}>
                          {/* Modal Header */}
                          <div className='modal-header' >
                              <h5 className='modal-title text-danger'>{t(`${props.title}`)}</h5>
                              <button type='button' className='close' aria-label="Close" onClick={props.hideDropWarning}>
                                <span aria-hidden="true">&times;</span>
                              </button>
                          </div>

                          {/* Modal body */}                 
                          <div className="modal-body">
                           {/* <h5>{t(props.body)} </h5> */}
                           <h5>{t(`${props.key1}`,JSON.parse(`${props.option}`))} </h5>
                          </div>

                          {/* Modal footer */}
                          {/* <div className="modal-footer">
                            <button type="button" className="btn btn-danger" onClick={props.hideDropWarning}>Close</button>
                          </div> */}
                      </div>
                  </div>
              </div>
           </Modal>;
}

export default DropComponentWarningModal;