import React, { Component } from "react";
import "./../../css/CCiLabComponent.css";


class CCiLabComponent extends Component {
        state = {
            greeting: "Hello",
            changing: "Frenchify"
        };
        parents = this.props.parentIds;
        siblings = this.props.siblingIds;
        imgName = '/images/'+this.props.imgName;
        progressStatus = this.props.status;

    frenchify = () => {
        if (this.state.greeting === "Hello") this.setState({ greeting: "Bonjour" });
        else this.setState({ greeting: "Hello" });

        if (this.state.changing === "Frenchify")
            this.setState({ changing: "Englisify" });
        else this.setState({ changing: "Frenchify" });
    };

    removeGreeting = () => {
        this.props.removeGreeting(this.imgName);
    };


    render() {
      console.log('CCiLabComponent::render() props.name: ', this.imgName);
      let lclassName='AlarmButton'
      if( this.progressStatus === 'warning') lclassName = "WarningButton";
      if( this.progressStatus === 'no_issue') lclassName = "GreenButton";
      if( this.progressStatus === 'alarm') lclassName = "AlarmButton";

        return (
          <button className={lclassName} onClick={ this.frenchify }>
            <img className="ComponentImg" src={this.imgName} alt={this.imgName} ></img>
            </button>
        )
      }
}

 /* {{ this.state.greeting } { this.props.name }! http://www.rachelgallen.com/images/purpleflowers.jpg}
 import images from "./images";  
 src={this.props.name} 
 src={require('../../images/edit_32.png')} 
  <img className="ComponentImg" src={images.edit_32_png} alt="edit"></img>*/
    
 /*
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