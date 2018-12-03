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
        imgName = '/images/'+this.componentName+'.'+this.currentComponent.businessLogic.imgType;
        progressStatus = this.currentComponent.businessLogic.status;
        progressValue = this.currentComponent.businessLogic.progressPercent;

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
        console.log('CCiLabComponent::render() imgName: ', this.imgName);
        let lclassName='btn cci-component-btn '
        let lchildren = this.children.length
        if( this.parents.length === 0 && this.children.length === 0 )
          lchildren = '+';
        if( this.progressStatus === 'warning') 
          lclassName +='btn-warning cci-component-btn_warning_'+ this.progressValue;
        if( this.progressStatus === 'no_issue') 
          lclassName +='btn-success cci-component-btn_green_'+ this.progressValue;
        if( this.progressStatus === 'alarm') 
          lclassName +='btn-danger cci-component-btn_alarm_'+ this.progressValue;
        if( this.state.expended === false || this.currentComponent.displayLogic.toBeExpend === false ) 
        {
          if( lchildren !== 0 && lchildren !== '+' )
            lchildren = '-';
            
        }
        
        return (
          <span className='float-left'>
            <button className={lclassName} onClick={ this.expending }>
               
              <span className='d-flex flex-row justify-content-between'>
                <img className="cci-component-btn__img rounded-circle" src={this.imgName} alt={this.componentName} ></img>
                { ( lchildren !== 0 ) ?
                  <span className='badge-pill badge-info align-self-center font-weight-bold'>{lchildren}</span> :null
                }
              </span>
                
              <span className='d-flex flex-row justify-content-center'>
                 <span className='badge-pill align-bottom text-gray-dark'>{this.progressValue}%</span>   
              </span>
            </button>
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
 <span className='badge badge-info align-bottom flex-grow-1 '>30%</span> 
 function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
*/
export default CCiLabComponent;