import React, { Component } from "react";
import "./../../css/CCiLabComponent.css";


class CCiLabComponent extends Component {
        state = {
            greeting: "Hello",
            changing: "Frenchify",
            expended:  true
        };
        parents = this.props.parentIds;
        siblings = this.props.siblingIds;
        imgName = '/images/'+this.props.imgName;
        progressStatus = this.props.status;
        progressValue = this.props.progressPercent;

    expending = () => {
        if (this.state.expended === true) 
          this.setState({ expended: false });
        else 
          this.setState({ expended: true });

        if (this.state.changing === "Frenchify")
            this.setState({ changing: "Englisify" });
        else this.setState({ changing: "Frenchify" });
    };

    removeGreeting = () => {
        this.props.removeGreeting(this.imgName);
    };


    render() {
      console.log('CCiLabComponent::render() props.name: ', this.imgName);
      let lclassName='btn cci-component-btn '
      let lSiblings = this.siblings.length
      if( this.parents.length === 0 && this.siblings.length === 0 )
        lSiblings = '+';
      if( this.progressStatus === 'warning') 
        lclassName +='btn-warning cci-component-btn_warning';
      if( this.progressStatus === 'no_issue') 
        lclassName +='btn-success cci-component-btn_green';
      if( this.progressStatus === 'alarm') 
        lclassName +='btn-danger cci-component-btn_alarm';
      if( this.state.expended === false ) 
      {
        if( lSiblings !== 0 && lSiblings !== '+' )
          lSiblings = '-';
          
      }
        


        return (
          <button className={lclassName} onClick={ this.expending }>
             
            <span className='d-flex flex-row justify-content-between'>
              <img className="cci-component-btn__img rounded-circle" src={this.imgName} alt={this.imgName} ></img>
              <span className='badge-pill badge-info align-self-center font-weight-bold'>{lSiblings}</span>
            </span>
              
            <span className='d-flex flex-row justify-content-center'>
               <span className='badge-pill align-bottom text-gray-dark'>30%</span>   
            </span>
          </button>
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