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
        imgName = (this.currentComponent.businessLogic.imgFile.length !==0 ) ? '/images/'+ this.currentComponent.businessLogic.imgFile : 
                    (this.children.length !==0) ? '/images/cci_group_block.png' : '/images/cci_single_block_item.png';
        componentLableHeight = (this.currentComponent.businessLogic.imgFile.length !==0 ) ? '55px' : 
                              (this.children.length !==0) ? '45px' : '20px';

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
        let Component ='';
        let ComponentProgressStatus;
        let expendCollapseBadgeIconClassName= this.children.length ? 'fa fa-angle-right':'';

        let statusBadgeIconClassName = this.progressStatus === 'info' ? 'fa ':
            this.progressStatus === 'success' ? 'fa fa-check-circle' :
            this.progressStatus === 'warning' ? 'fa fa-exclamation-circle' : 'fa fa-exclamation-triangle';
            
        if( this.parents.length === 0 )
        { //top element
          Component +=' sticky-top';
          if( this.currentComponent.displayLogic.canExpend === true )
            ComponentProgressStatus = 'btn cci-component-btn float-left'
          else  // top element - expended
            ComponentProgressStatus ='btn cci-component-lable mx-0 float-left';
        }
        else
        {
 
            if ( this.children.length !== 0  &&  this.parents.length !== 0 )
              ComponentProgressStatus ='btn cci-component-lable mx-0 float-left';
            else
              ComponentProgressStatus ='btn cci-component-lable mx-0  float-left';
        }

        if( this.state.expended === false || this.currentComponent.displayLogic.canExpend === false ) 
        {
          if( this.children.length !== 0  )
            expendCollapseBadgeIconClassName= 'fa fa-angle-down';
        }
        
        let leftShiftStyle;
        let anchorLeftstyle;
        if( this.parents.length !== 0 )
        { // expendable component left shift less, to compensate <a> 
          if ( this.children.length !== 0  &&  this.parents.length !== 0 )
          {
            anchorLeftstyle = {
              'left': '28px',
            }
            leftShiftStyle = {
              'left': '15px',
             };
          }
          else{
            leftShiftStyle = {
              'left': '60px',
             };
          }
         
        }

        return (
          <span className={`${Component}`}  > 
          
            {/* show collapse icon 'v' for all expendable components,
              show expendable icon '>' for those components have children except the top component
            */}
            { ( this.children.length !== 0  && ( this.parents.length !== 0  || this.state.expended === false) )?
                  <a href="#1" className='cci-link_position float-left nav-link pt-4 align-self-center' style={anchorLeftstyle} onClick={ this.expending }>
                    <span className={expendCollapseBadgeIconClassName}></span>
                  </a>:null
            }  
            
            {/* shift the child components to the right */}  
            <ul className='flow-right list-group flex-row cci-component-lable_position' style={leftShiftStyle}>
              <button className={ComponentProgressStatus} 
                style={ { 'height': this.componentLableHeight, 'width': this.componentLableHeight} }
                onClick={ (this.parents.length === 0 && this.currentComponent.displayLogic.canExpend ) ? this.expending :null } >
                
                {/* no style for top element so the button can host the image, other elements need style to set image position  */}
                { (this.imgName.length !== 0 ) ? <img className='cci-component__img rounded-circle'
                    style={( this.parents.length === 0) ? 
                      null : { 'height': this.componentLableHeight, 'width': this.componentLableHeight}}  src={this.imgName} alt=""></img>:null}
                
              </button>
              <span className='lead font-weight-normal text-primary text-truncate ml-1 align-self-center' style={{ 'height': '10%' }}>{this.componentName}</span>
              <span className={`badge-pill badge-${this.progressStatus} ${statusBadgeIconClassName} text-body text-nowrap align-self-center ml-1`} style={{ 'height': '15% !important', 'line-height': '2 !important'}}> {this.progressValue}%</span>  
            </ul>
          </span>
        )
      }
}

export default CCiLabComponent;

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

'font-weight': 'normal',
*/
