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
                    (this.children.length !==0) ? '/images/group_gear.png' : '/images/single_gear_piece.png';
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
        let Component ='container';
        let ComponentProgressStatus;
        let lBadgeIconClassName= this.children.length ? 'fa fa-angle-right':'';
       
        if( this.parents.length === 0 )
        { //top element
          Component +=' sticky-top';
          if( this.currentComponent.displayLogic.canExpend === true )
            ComponentProgressStatus = 'btn cci-component-btn'
          else
            ComponentProgressStatus ='btn cci-component-lable ml-0';
        }
        else
        {
            ComponentProgressStatus ='btn cci-component-lable cci-component-lable_position';
        }

        if( this.state.expended === false || this.currentComponent.displayLogic.canExpend === false ) 
        {
          if( this.children.length !== 0  )
            lBadgeIconClassName= 'fa fa-angle-down';
        }
        
        let linkStyle;
        if( this.parents.length === 0 )
        {
          linkStyle = {
            margin: '4px'
          }
        }
        else 
        {
          linkStyle = {
            // margin: '0', 
            left: '16px'
          }
        }

        return (
          <span className={Component} > 
          
            {/* show collapse icon 'v' for all expendable components,
              show expendable icon '>' for those components have children except the top component
            */}
            { ( this.children.length !== 0  && ( this.parents.length !== 0  || this.state.expended === false) )?
                  <a href="#1" className='cci-link_position' style={linkStyle} onClick={ this.expending }>
                    <span className={lBadgeIconClassName}></span>
                  </a>:null
            }  
            
            {/* shift the child components to the right */}
            <button className={ComponentProgressStatus} 
              style={ ( this.children.length !== 0  &&  this.parents.length !== 0) ? {left: '20px'} : {left: '30px'}}
              onClick={ (this.parents.length === 0 && this.currentComponent.displayLogic.canExpend ) ? this.expending :null } >
               
              { (this.imgName.length !== 0 ) ? <img className="cci-component__img rounded-circle" src={this.imgName} alt=""></img>:null}
               
            </button>
            <ul className='list-group flex-row'>
                  <span className="lead font-weight-normal align-top text-primary text-truncate">{this.componentName}</span>
                  <span className='badge-pill badge-info text-body'>{this.progressValue}%</span>  
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
*/
