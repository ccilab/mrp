import React, { Component } from "react";
import "./../../css/CCiLabComponent.css";


class CCiLabComponent extends Component {
        state = {
            expended:  true,
           
        };

        currentComponent = this.props.component;
        parents = this.currentComponent.businessLogic.parentIds;
        children = this.currentComponent.businessLogic.childIds;
        componentName = this.currentComponent.businessLogic.name;
        imgName = (this.currentComponent.businessLogic.imgFile.length !==0 ) ? '/images/'+ this.currentComponent.businessLogic.imgFile : 
                    (this.children.length !==0) ? '/images/cci_group_block.png' : '/images/cci_single_block_item.png';
        componentLableHeight =  (this.parents.length === 0 ) ? '45px' : (this.children.length !==0) ? '25px': '25px';
        expendCollapseBadgePadding =  (this.parents.length === 0 ) ? 'pt-3 pb-0 pl-4 pr-1' : 'pt-2 pb-0 pl-4 pr-1';


        progressStatus = this.currentComponent.businessLogic.status;
        progressValue = this.currentComponent.businessLogic.progressPercent;
      
        StickyWidth =  this.currentComponent.displayLogic.selected ? '100':'';

    componentWillMount=()=>{
      this.setState({expended: this.props.component.displayLogic.canExpend});
    }

    componentDidMount =()=> {
      let componentRect = document.getElementById( `${this.currentComponent.displayLogic.key}` ).getBoundingClientRect();

      if( this.children.length !== 0 ) {
        this.currentComponent.displayLogic.rectLeft = componentRect.left;
      }

      let progressStatusSpanRect = document.getElementById( 'progressStatusSpan' ).getBoundingClientRect();

      this.StickyWidth = componentRect.right + (progressStatusSpanRect.right - progressStatusSpanRect.left);
    };

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

    componentSelected = () =>{
        this.props.selectedComponentHandler(this.currentComponent);
    }

    removeGreeting = () => {
        this.props.removeGreeting(this.component.businessLogic.imgName);
    };

    showOrHideChildren = (isShow) =>{
      this.props.showOrHideChildren(this.currentComponent, isShow)
    }

    render() {
        console.log('CCiLabComponent::render() imgFile: ', this.imgName);
      
        let  Component =  this.currentComponent.displayLogic.selected ? 'bg-info component_opacity sticky-top':'';
        let  StickyPos =  this.currentComponent.displayLogic.selected ? '25px':'';
      
        let ComponentClassNameBase = 'btn m-0 float-left rounded-circle p-0'
        let ComponentClassName = ComponentClassNameBase +' cci-component-btn';
        let expendCollapseBadgeIconClassName= 'fa fa-angle-right';

        let statusBadgeIconClassName = this.progressStatus === 'info' ? 'fa ':
            this.progressStatus === 'success' ? 'fa fa-check-circle' :
            this.progressStatus === 'warning' ? 'fa fa-exclamation-circle' : 'fa fa-exclamation-triangle';
            
        if( this.parents.length !== 0 )
        {
 
            if ( this.children.length === 0   )
              ComponentClassName =ComponentClassNameBase + ' cci-component-btn';
        }

        if( this.state.expended === false || this.currentComponent.displayLogic.canExpend === false ) 
        {
          if( this.children.length !== 0  )
            expendCollapseBadgeIconClassName= 'fa fa-angle-down';
        }
        
        let leftShiftStyle;
        let anchorLeftstyle;
        
        // expendable component left shift less, to compensate <a> 
        if ( this.children.length !== 0 )
        {
          anchorLeftstyle = {
            'left': `${this.props.leftOffset}px`,
          }
          leftShiftStyle = {
            'left': `${this.props.leftOffset}px`,
            };
        }
        else{
          let leftOffset = this.props.leftOffset+39;
          leftShiftStyle = {
            'left': `${leftOffset}px`,
            };
        }
         
        

        return (
          <span  className={`${Component}`}  style={{'top' : `${StickyPos}`, 'width': `${this.StickyWidth}px`}}> 
            {/* show collapse icon 'v' for all expendable components,
              show expendable icon '>' for those components have children except the top component
            */}
            { ( this.children.length !== 0  )?
                  <a href="#1" className={`cci-link_position float-left nav-link ${this.expendCollapseBadgePadding} `} style={anchorLeftstyle} onClick={ this.expending }>
                    <span className={expendCollapseBadgeIconClassName}></span>
                  </a>:null
            }  

          
            
            {/* shift the child components to the right */}  
            <ul id={`${this.currentComponent.displayLogic.key}`} className='flow-right list-group flex-row cci-component-lable_position' style={leftShiftStyle}>
              <button className={`${ComponentClassName}`} 
                style={ { 'height': this.componentLableHeight, 'width': this.componentLableHeight} }
                onClick={ this.componentSelected } >
                
                {/* no style for top element so the button can host the image, other elements need style to set image position  */}
                { (this.imgName.length !== 0 ) ? 
                    <img className='cci-component__img rounded-circle float-left' src={this.imgName} alt=""
                      style={{'height': this.componentLableHeight, 'width': this.componentLableHeight}} >
                    </img>
                    :null
                 }
              </button>
              <span className='lead font-weight-normal text-primary text-truncate ml-1 align-self-center' style={{ 'height': '10%' }}>{this.componentName}:</span>
              <span id='progressStatusSpan' className={`badge-pill badge-${this.progressStatus} ${statusBadgeIconClassName} text-body text-nowrap align-self-center ml-1`} style={{ 'height': '15% !important'}}> {this.progressValue}%</span>  
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
