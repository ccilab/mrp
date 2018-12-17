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
      this.setState({expended: this.props.component.displayLogic.canExpend});
    }

    expending = () => {
        if (this.state.expended === true) {
          this.currentComponent.displayLogic.canExpend = false;
          this.setState({ expended: false });
          this.showOrHideChildren(true);
        }
        else {
          this.currentComponent.displayLogic.canExpend = true;
          this.setState({ expended: true });
          this.showOrHideChildren(false);
        }
         
    };

    removeGreeting = () => {
        this.props.removeGreeting(this.component.businessLogic.imgName);
    };

    showOrHideChildren = (isShow) =>{
      this.props.showOrHideChildren(this.currentComponent, isShow)
    }

    render() {
        console.log('CCiLabComponent::render() imgFile: ', this.imgName);
        let lclassName='btn cci-component-btn '
        let lBadgeIconClassName= this.children.length ? 'fa fa-angle-right':'';
        let lexpendSymbol = this.children.length ? '...' : '-';
        let lcomponentClassName ='d-flex flex-column';
        if( this.parents.length === 0 && this.children.length === 0 )
        {
          lclassName +='sticky-top ';
          lBadgeIconClassName = 'fa fa-plus';
          lexpendSymbol='+';
        }

        if( this.parents.length === 0 )
        {
          lcomponentClassName +=' sticky-top';
        }
         
        if( this.progressStatus === 'warning') 
          lclassName +='btn-warning cci-component-btn_warning_'+ this.progressValue;
        if( this.progressStatus === 'no_issue') 
          lclassName +='btn-success cci-component-btn_green_'+ this.progressValue;
        if( this.progressStatus === 'alarm') 
          lclassName +='btn-danger cci-component-btn_alarm_'+ this.progressValue;
        if( this.state.expended === false || this.currentComponent.displayLogic.canExpend === false ) 
        {
          if( this.children.length !== 0 && lexpendSymbol !== '+' )
          {
            lBadgeIconClassName= 'fa fa-angle-down';
            lexpendSymbol = '';
          }
        }
        
        return (
          <span className={lcomponentClassName} >
            <button className={lclassName} onClick={ this.expending }>
               
              <img className="pt-0 cci-component-btn__img rounded-circle" src={this.imgName} alt=""></img>
              <span className='mr-5 badge-pill badge-info text-body'>{this.progressValue}%</span>  
              
              { ( this.children.length !== 0 ) ?
                <span  className='float-left mt-1 badge-pill badge-info  '><i className={lBadgeIconClassName}></i>{lexpendSymbol}</span> :null
              }  
            
            </button>
            <span className="pl-3 lead text-left font-weight-normal text-info d-inline-block text-truncate">{this.componentName}</span>
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