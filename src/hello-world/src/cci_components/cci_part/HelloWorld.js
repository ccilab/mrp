import React, { Component } from "react";
import "./../../css/CCiLabComponent.css";


class CCiLabComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            greeting: "Hello",
            changing: "Frenchify"
        };

        console.log('CCiLabComponent: props.name: ', this.props.name);
      
        this.frenchify = this.frenchify.bind(this);
        this.removeGreeting = this.removeGreeting.bind(this);
    }
    
    frenchify = () => {
        if (this.state.greeting === "Hello") this.setState({ greeting: "Bonjour" });
        else this.setState({ greeting: "Hello" });

        if (this.state.changing === "Frenchify")
            this.setState({ changing: "Englisify" });
        else this.setState({ changing: "Frenchify" });
 
       
    };

    removeGreeting = () => {
        this.props.removeGreeting(this.props.name);
    };


    render() {
      console.log('CCiLabComponent::render() props.name: ', this.props.name);
        return (
          <button className="ComponentButton" onClick={ this.frenchify }>
            <img className="ComponentImg" src={this.props.name} alt="edit"></img>
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