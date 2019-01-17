
import React, { Component } from "react";
import "./../../css/CCiLabComponentList.css";
import CCiLabComponent from "./CCiLabComponent";
// import AddGreeter from "./AddGreeter";

//json-loader load the *.json file
import components from './../../data/components.json';


//table includes assembly and paint process
// simulate after loaded very top component and its direct  components
const firstComponents = components.firstComponents;

// simulate load children of component id 1 ( top )
const secondComponents = components.secondComponents;

// simulate load children of component id 2 ( leg )
const thirdComponents = components.thirdComponents;

// simulate load children of component id 4 ( low_beam )
const forthComponents = components.forthComponents;

// utility funtions need move to a saperate js file
const initializeComponents = ( startComponent, originComponents, incomingComponents, targetComponents)=>{
  let displayKeyValue = 0;

  if( typeof originComponents !== "undefined") {
    originComponents.forEach( (existingComponent)=>{ targetComponents.push( existingComponent ) } );
    displayKeyValue = targetComponents.length;
  }


  
  // initialize displayLogic items, create unique key value for latest componets from data layer
  // this gurrenties that displayLogic.key is unique, newly added componet won't show itself until
  // user clicks it, except the very top component
  
  for(let idx = 0; idx < incomingComponents.length; idx++ ) {
    let element = incomingComponents[idx];
    element.displayLogic.key = displayKeyValue++;
    element.displayLogic.childKeyIds.length = 0;
    element.displayLogic.showMyself = false;
    element.businessLogic.childIds.length !== 0 ? element.displayLogic.canExpend = true : element.displayLogic.canExpend = false;
   
    let startComponentKey = 0;
    if(typeof startComponent !== "undefined" ) {
      startComponentKey = startComponent.displayLogic.key;
      //need populate childKeyIds[] if its not fully populated yet
      if( startComponent.businessLogic.childIds.length !==  startComponent.displayLogic.childKeyIds.length && 
          startComponent.displayLogic.childKeyIds.includes( element.displayLogic.key ) === false ) {
          let idxInsertAt = targetComponents.findIndex(startComponent=>{return startComponent.displayLogic.key === startComponentKey});
          // component without childIs[] is always above componets with childIds[] for display/expending purpose
          if( element.businessLogic.childIds.length === 0 )
            targetComponents.splice( idxInsertAt+1,0,element);
          else
            targetComponents.push(element);
      }
    }
  }
};

const populateComponentChildIds = (selectedComponent, cachedComponents )=>{
  if( selectedComponent.businessLogic.childIds.length !== selectedComponent.displayLogic.childKeyIds.length ) {
      for( let idx = 0; idx < cachedComponents.length; idx++ ) { 
        if( selectedComponent.businessLogic.childIds.includes( cachedComponents[idx].businessLogic.id ) &&
            cachedComponents[idx].businessLogic.parentIds.includes(selectedComponent.businessLogic.id )  && 
            !selectedComponent.displayLogic.childKeyIds.includes( cachedComponents[idx].displayLogic.key) ) 
            selectedComponent.displayLogic.childKeyIds.push( cachedComponents[idx].displayLogic.key )
      }
  }
}

// turn off childKeyIds[] recursively but we don't want to turn off childKeyIds[] unless 
// its direct parent's canExpened = false (the parent is expended already
const hideChildren = (aComponent, aComponents, aShowStatus)=>{
  if( !aComponent.displayLogic.canExpend && aComponent.displayLogic.childKeyIds.length ) 
  {
      for( let idx2Component = 0;  idx2Component < aComponents.length; idx2Component++ ) 
      {
        if( aComponent.displayLogic.childKeyIds.includes(aComponents[idx2Component].displayLogic.key) ) {
            aComponents[idx2Component].displayLogic.showMyself = aShowStatus;
            hideChildren(aComponents[idx2Component], aComponents, aShowStatus)
        }
      }
  }
}


const estimateComponentListRect = (componentLists)=>{
  let componentListRect = document.getElementById( 'cciLabComponentListID' ).getBoundingClientRect();
  let updatedRect = {top: componentListRect.top, left: componentListRect.left, bottom: componentListRect.bottom, right: componentListRect.right };
  
  let shownComponents = componentLists.filter(component=>component.displayLogic.showMyself === true)
  
  updatedRect.bottom = shownComponents.length * 55; //55px defined in CCiLabComponent.js as max button height
  return updatedRect;
}

// check if an element is in viewport
const isElementInViewport = (rect) => {
  return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)  && /*or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
  );
}

class CCiLabComponentList extends Component {
    state = { greetings: undefined, visible: false };

    visibility = 'flyout-menu_hide';
    slidingComponentListIconClassName = 'fa fa-angle-double-right';
    componentListHeight='';

    toggleHideShowComponentList = () =>{
      console.log('container: clicked before: - ', this.state.visible ? 'true' : 'false' );
      this.setState( { visible: this.state.visible ? false : true } );
      console.log('container: clicked after: - ', this.state.visible ? 'true' : 'false' );

      this.visibility = this.state.visible? 'flyout-menu_show' : 'flyout-menu_hide';

      this.slidingComponentListIconClassName = this.state.visible? 'fa fa-angle-double-left' : 'fa fa-angle-double-right';
    }

    // show or hide component list
    handleMouseDown=(e)=>{
      this.toggleHideShowComponentList();
      e.stopPropagation();
    };
    
    // initialize first component's childKeyIds, reorder in following order: the first component, alarm status, warning status, no_issue status
    componentWillMount=()=>{
      let currentSessionComponents=[];

      //#todo: need to query server to get a new components
      console.log("query server to get root components")
      let components = firstComponents;

      //#todo: need to query server side to find the very top component 
      let rootComponent = components.filter(component=>component.businessLogic.parentIds.length === 0)[0]
       
      initializeComponents(rootComponent, this.state.greetings, components, currentSessionComponents);
    
      //always show very top component
      rootComponent.displayLogic.showMyself = true;
   
      if( rootComponent.businessLogic.childIds.length !== 0 ){
        rootComponent.displayLogic.canExpend = true;

        // populate very top component's displayLogic.childKeyIds[], if it's not incluced yet
        populateComponentChildIds(rootComponent, currentSessionComponents);
      }

      this.setState( {greetings: currentSessionComponents} )
    }
  
    /**
   * bind to resize event, Calculate & Update state of new dimensions
   */
    updateDimensions=()=>{
      let updatedRect = estimateComponentListRect(this.state.greetings);

      this.componentListHeight = isElementInViewport( updatedRect ) ? '':'90vh';

      this.setState( { greetings: this.state.greetings })
    }

    /** 
     * called after initial render() is called and element is inserted indo DOM
     * Add event listener to show vertical scroll bar if browser window is shorter 
     * than component list rect height
     * */ 
    componentDidMount =()=> {
      window.addEventListener("resize", this.updateDimensions);
    }

    // //called after render()
    // componentDidUpdate = ()=>{
    //   this.componentListHeight = isElementInViewport( document.getElementById( 'cciLabComponentListID' ).getBoundingClientRect() ) ? '':'90vh';
    // }
  
    addGreeting = (newName, progressValue) =>{
      this.setState({ greetings: [...this.state.greetings, 
        { businessLogic: {id: this.state.greetings.length + 1, name: newName, parentIds:[0], childIds:[], imgFile:'', status: "alarm", progressPercent: progressValue}, displayLogic:{key: undefined}, childKeyIds:[], showMyself: false, canExpend: false}] });
    };

    removeGreeting = (removeName) =>{
      const filteredGreetings = this.state.greetings.filter(component => {
        return component.businessLogic.name !== removeName;
      });
      this.setState({ greetings: filteredGreetings });
    };

    //based on selected component and its show Status to show or hide its children
    showOrHideChildren = ( selectedComponent, showStatus ) =>{
          let idxComponent = 0;
          let currentSessionComponents=[];
        

          // if selected component's childKeyIds[] isn't fully populated we need to request new components from server side first
          if ( selectedComponent.businessLogic.childIds.length !== selectedComponent.displayLogic.childKeyIds.length ) {
              //#todo: need to query server to get a new components
              console.log("query server to get child components")
              
              let components =[];
              if( selectedComponent.businessLogic.id === 1 )
                components= secondComponents;
                
              if( selectedComponent.businessLogic.id === 2 )
                components= thirdComponents;
              
              if( selectedComponent.businessLogic.id === 4 )
                components= forthComponents;
              initializeComponents(selectedComponent, this.state.greetings, components, currentSessionComponents);
          }
          else {
            currentSessionComponents = this.state.greetings;
          }
           
           
          populateComponentChildIds(selectedComponent, currentSessionComponents, showStatus );

          let rootComponent = currentSessionComponents.filter(component=>component.businessLogic.parentIds.length === 0)[0];

          // looping through entire component list to find the component included inside child component list
          for( idxComponent = 0;  idxComponent < currentSessionComponents.length; idxComponent++ ) 
          {
            // skip the first component
            if( currentSessionComponents[idxComponent].displayLogic.key === rootComponent.displayLogic.key )
              continue;

            // find the component that has the child components, and show or hide the show status of this component's childKeyIds 
            if( selectedComponent.displayLogic.childKeyIds.includes(currentSessionComponents[idxComponent].displayLogic.key) ) {
                currentSessionComponents[idxComponent].displayLogic.showMyself = showStatus;

                // recursively hide childKeyIds[] of child component included in childKeyIds[] of current component,
                // but we don't want to hide child component's childKeyIds[] unless its direct parent's canExpend = false 
                hideChildren(currentSessionComponents[idxComponent], currentSessionComponents, showStatus);
            }
          }
          
          // create vertical scroll bar based on the height of component list dynamically
          let updatedRect = estimateComponentListRect(currentSessionComponents);

          this.componentListHeight = isElementInViewport( updatedRect ) ? '':'90vh';

          this.setState( { greetings: currentSessionComponents })
    };

    //need to update showMyself to true after button is clicked to canExpend
    //need to update showMyself to false after button is clicked to collaps
    renderGreetings = () => {
      return ( (typeof this.state !== "undefined") && (typeof this.state.greetings !== "undefined" ) )? 
          this.state.greetings.map( (component) => {
                if( component.displayLogic.showMyself === true )
                  return <CCiLabComponent key={component.displayLogic.key} component={component} removeGreeting={this.removeGreeting} showOrHideChildren={this.showOrHideChildren}/> ;
                else
                  return null;
            }
          ) : null;
    };


    render() {
      return (
        <div className={`d-flex flex-row`}>
          {/* <AddGreeter addGreeting={this.addGreeting} /> */}
            {/* <div className='d-flex'> */}
            {/* following d-flex is needed to show collapse icon (>) next to the top component  */}
            {/* https://code.i-harness.com/en/q/27a5171 explains why vertical scroll bar won't appear for flex box and what is the workaroud
                in our case we should set 'height':'90vh' after component list grows out of 100vh #to do*/}
             <div id='cciLabComponentListID' className={`d-flex flex-column flyout-menu ${this.visibility}`} style={{'height':`${this.componentListHeight}`}}>
                {this.renderGreetings()}
              </div>
              <div>
                <a href="#1" className='float-right nav-link ' onMouseDown={this.handleMouseDown} >
                    <span className={`badge-pill badge-info ${this.slidingComponentListIconClassName}`}></span>
                </a>
            </div>
        </div>
      );
    };
}

export default CCiLabComponentList;
