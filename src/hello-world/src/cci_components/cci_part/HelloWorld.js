import React, { Component } from "react";
import "./../../css/CCiLabComponent.css";


class CCiLabComponent extends Component {
        state = {
            expended:  true
        };
        currentComponent = this.props.component;
        parents = this.currentComponent.businessLogic.parentIds;
        children = this.currentComponent.businessLogic.childIds;
        componentName = this.currentComponent.businessLogic.name;
        imgName = '/images/'+this.currentComponent.businessLogic.imgFile;
        progressStatus = this.currentComponent.businessLogic.status;
        progressValue = this.currentComponent.businessLogic.progressPercent;

    componentWillMount=()=>{
      this.setState({expended: this.props.component.displayLogic.toBeExpend});
    }

    expending = () => {
        if (this.state.expended === true) {
          this.currentComponent.displayLogic.toBeExpend = false;
          this.setState({ expended: false });
          this.selectShowChildren(true);
        }
        else {
           this.currentComponent.displayLogic.toBeExpend = true;
           this.setState({ expended: true });
          this.selectShowChildren(false);
         
        }
         
    };

    removeGreeting = () => {
        this.props.removeGreeting(this.component.businessLogic.imgName);
    };

    selectShowChildren = (isShow) =>{
      this.props.showChildren(this.currentComponent, isShow)
    }

    render() {
        console.log('CCiLabComponent::render() imgFile: ', this.imgName);
        let lclassName='btn cci-component-btn '
        let lBadgeIconClassName= this.children.length ? 'fa fa-angle-right':'';
        let lexpendSymbol = this.children.length ? '...' : '-';
        if( this.parents.length === 0 && this.children.length === 0 )
        {
           lBadgeIconClassName = 'fa fa-plus';
           lexpendSymbol='+';
        }
         
        if( this.progressStatus === 'warning') 
          lclassName +='btn-warning cci-component-btn_warning_'+ this.progressValue;
        if( this.progressStatus === 'no_issue') 
          lclassName +='btn-success cci-component-btn_green_'+ this.progressValue;
        if( this.progressStatus === 'alarm') 
          lclassName +='btn-danger cci-component-btn_alarm_'+ this.progressValue;
        if( this.state.expended === false || this.currentComponent.displayLogic.toBeExpend === false ) 
        {
          if( this.children.length !== 0 && lexpendSymbol !== '+' )
          {
            lBadgeIconClassName= 'fa fa-angle-down';
            lexpendSymbol = '';
          }
        }
        
        return (
          <span className='float-left'>
            <button className={lclassName} onClick={ this.expending }>
               
              <span className='d-flex flex-row'>
                <img className="cci-component-btn__img rounded-circle" src={this.imgName} alt=""></img>
                { ( this.children.length !== 0 ) ?
                 <span  className='badge-pill badge-info cci-badge-position align-self-center'><i className={lBadgeIconClassName}></i>{lexpendSymbol}</span> :null
                }
              </span>
                
              <span className='d-flex flex-row justify-content-center'>
                 <span className='badge-pill align-bottom text-gray-dark'>{this.progressValue}%</span>   
              </span>
            </button>
            <span className="d-inline-block text-truncate">{this.componentName}</span>
          </span>
        )
      }
}

 /*{{ this.state.greeting } { this.props.name }! http://www.rachelgallen.com/images/purpleflowers.jpg}
 import images from "./images";  
 src={this.props.name} 
 src={require('../../images/edit_32.png')} 
  <img className="ComponentImg" src={images.edit_32_png} alt="edit"></img>*/
    
 /*
<!-- Block level -->
<div class="row">
  <div class="col-2 text-truncate">
    Praeterea iter est quasdam res quas ex communi.
  </div>
</div>

<!-- Inline level -->
<span class="d-inline-block text-truncate" style="max-width: 150px;">
  Praeterea iter est quasdam res quas ex communi.
</span>
*/
export default CCiLabComponent;