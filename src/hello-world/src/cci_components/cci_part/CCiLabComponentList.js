
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
// merge incomingComponents (new ones) and originComponents (existing components) into targetComponents
const initializeComponents = ( startComponent, originComponents, incomingComponents, targetComponents)=>{
  let displayKeyValue = 0;

  if( typeof originComponents !== "undefined") {
    originComponents.forEach( (existingComponent)=>{ targetComponents.push( existingComponent ) } );
    displayKeyValue = targetComponents.length;
  }


  
  // initialize displayLogic items, create unique key value for latest componets from data layer
  // this guarantees that displayLogic.key is unique, newly added componet won't show itself until
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

const populateComponentChildKeyIds = (selectedComponent, cachedComponents )=>{
  if( selectedComponent.businessLogic.childIds.length !== selectedComponent.displayLogic.childKeyIds.length ) {
      for( let idx = 0; idx < cachedComponents.length; idx++ ) { 
        if( selectedComponent.businessLogic.childIds.includes( cachedComponents[idx].businessLogic.id ) &&
            cachedComponents[idx].businessLogic.parentIds.includes(selectedComponent.businessLogic.id )  && 
            !selectedComponent.displayLogic.childKeyIds.includes( cachedComponents[idx].displayLogic.key) ) 
            selectedComponent.displayLogic.childKeyIds.push( cachedComponents[idx].displayLogic.key )
      }
  }
}

// don't need to call this function, 
// const updateComponentValue = (aComponent, aComponents)=>{
//   let idx = aComponents.indexOf(aComponent);
//   if( idx >= 0 )
//     aComponents[idx].displayLogic.rectLeft = aComponent.displayLogic.rectLeft;
// }


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
  let updatedRect = {top: componentListRect.top, left: componentListRect.left, bottom: componentListRect.bottom, right: componentListRect.right*1.2 };
  
  let shownComponents = componentLists.filter(component=>component.displayLogic.showMyself === true)
  
  updatedRect.bottom = shownComponents.length * 55; //55px defined in CCiLabComponent.js as max button height
  return updatedRect;
}

// check if an element is in viewport
// const isElementInViewport = (rect) => {
//   return (
//       rect.top >= 0 &&
//       rect.left >= 0 &&
//       rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)  && /*or $(window).height() */
//       rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
//   );
// }

const isElementInViewportHeight = (rect) => {
  return (
      rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) 
  );
}
class CCiLabComponentList extends Component {
    state = { greetings: undefined, visible: true };

    slidingComponentListIconClassName = this.state.visible? 'fa fa-angle-double-left' : 'fa fa-angle-double-right';
    componentListHeight='20vh';
    componentListWidth=210;
    compnentListTranslateStyle = this.state.visible ? 'translate3d(0vw, 0, 0)': `translate3d(-${this.componentListWidth}px, 0, 0)`;

    toggleHideShowComponentList = () =>{
      console.log('container: clicked before: - ', this.state.visible ? 'true' : 'false' );
      this.setState( { visible: this.state.visible ? false : true } );
    

      let updatedRect = estimateComponentListRect(this.state.greetings);

      this.componentListWidth = (updatedRect.right - updatedRect.left)*.85;

      // have to use px for componentListWidth here so the hide/show works
      this.compnentListTranslateStyle = this.state.visible ? 'translate3d(0vw, 0, 0)': `translate3d(-${this.componentListWidth}px, 0, 0)`;

      this.slidingComponentListIconClassName = this.state.visible? 'fa fa-angle-double-left' : 'fa fa-angle-double-right';
      console.log('container: clicked after: - ', this.state.visible ? 'true' : 'false' );
    }

    // show or hide component list
    showHideComponentList=()=>{
      this.toggleHideShowComponentList();
      //e.stopPropagation();
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
        populateComponentChildKeyIds(rootComponent, currentSessionComponents);
      }

      // trick - set default visible=true in constructor, set visible=false in componentWillMount
      // so when user clicks << component list will sliding back
      this.setState( {greetings: currentSessionComponents, visible : false } );

    }
  
    /**
   * bind to resize event, Calculate & Update state of new dimensions
   */
    updateDimensions=()=>{
      let updatedRect = estimateComponentListRect(this.state.greetings);

      this.componentListHeight = isElementInViewportHeight( updatedRect ) ? 'auto':'90vh';

      // this.componentListWidth = updatedRect.right - updatedRect.left;

      this.setState( { greetings: this.state.greetings })
    }

    // moveComponentListTitleBar=()=>{

    // }

    /** 
     * called after initial render() is called and element is inserted indo DOM
     * Add event listener to show vertical scroll bar if browser window is shorter 
     * than component list rect height
     * */ 
    componentDidMount =()=> {
        window.addEventListener("resize", this.updateDimensions);
    }

    //called after render()
    // componentDidUpdate = ()=>{
    //   this.toggleHideShowComponentList();
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
           
          // don't need to call this function, rectLeft already updated inside component's componentDidMount 
          // updateComponentValue( selectedComponent, currentSessionComponents );

          populateComponentChildKeyIds(selectedComponent, currentSessionComponents );

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

          this.componentListHeight = isElementInViewportHeight( updatedRect ) ? 'auto':'90vh';
          // this.componentListWidth = (updatedRect.right - updatedRect.left)*.85;

          this.setState( { greetings: currentSessionComponents })
    };

    selectedComponentHandler = ( selectedComponent ) =>{
      let currentSessionComponents=this.state.greetings;
      for( let idxComponent = 0;  idxComponent < currentSessionComponents.length; idxComponent++ ) 
      {
        // skip the first component
        if( currentSessionComponents[idxComponent].displayLogic.key === selectedComponent.displayLogic.key )
          currentSessionComponents[idxComponent].displayLogic.selected = true;
        else
          currentSessionComponents[idxComponent].displayLogic.selected = false;
      }
    }

    //need to update showMyself to true after button is clicked to canExpend
    //need to update showMyself to false after button is clicked to collaps
    renderGreetings = () => {
      return ( (typeof this.state !== "undefined") && (typeof this.state.greetings !== "undefined" ) )? 
          this.state.greetings.map( (component) => {
                if( component.displayLogic.showMyself === true )
                {
                  // get parent's rectLeft as left offset of this component
                  let parentComponent;
                  for( let idxComponent = 0;  idxComponent < this.state.greetings.length; idxComponent++ )  
                  {
                    if( component.businessLogic.parentIds.includes( this.state.greetings[idxComponent].businessLogic.id ) ) 
                    {
                      parentComponent = this.state.greetings[idxComponent];
                      break;
                    }
                  }
                  
                  let leftOffset = 0;
                  if( typeof parentComponent !== "undefined")
                      leftOffset = parentComponent.displayLogic.rectLeft;

                  return <CCiLabComponent key={component.displayLogic.key} 
                                          component={component} 
                                          leftOffset={leftOffset} 
                                          removeGreeting={this.removeGreeting} 
                                          showOrHideChildren={this.showOrHideChildren}
                                          selectedComponentHandler={this.selectedComponentHandler}/> ;
                }
                else
                  return null;
            }
          ) : null;
    };


    render() {
      return (
        <div className={`d-flex flex-row`} >
          {/* <AddGreeter addGreeting={this.addGreeting} /> */}
            {/* <div className='d-flex'> */}
            {/* following d-flex is needed to show collapse icon (>) next to the top component  */}
            {/* https://code.i-harness.com/en/q/27a5171 explains why vertical scroll bar won't appear for flex box and what is the workaroud
                 className={`d-flex flex-column flyout-component-list ${this.visibility}`, 'width':`${this.componentListWidth}px`}
                 UC browser, pro to Edge 15 (https://caniuse.com/#feat=css-sticky) doesn't suppot sticky-top*/} 
              <div id='cciLabComponentListID' className={`d-flex flex-column flyout-component-list elemnt-transition`} 
                  style={{'transform': `${this.compnentListTranslateStyle}`, 'height':`${this.componentListHeight}`, 'width':`${this.componentListWidth}px`}}
                  onScroll={this.updateDimensions}>
                  {/* set style left:0px to sticky-top to left too*/}
                  <div className='flex-row bg-info sticky-top fa' style={{ 'height': '25px', 'width': 'auto', 'left':'0px'}}>
                    <span className='pl-5 border-0 text-primary  text-nowrap'>部件名:</span>
                    <span className='pl-4 border-0 text-primary  text-nowrap'>进度 <span className='font-weight-normal text-primary '> (%)</span></span> 
                  </div>
                  
                  {/* <hr className='m-0'></hr> */}
                  {this.renderGreetings()}
              </div>
              <div>
                <a href="#1" className='float-left nav-link pl-0 py-4 pr-4 elemnt-transition sticky-top' style={{'transform': `${this.compnentListTranslateStyle}`}} onClick={this.showHideComponentList} >
                    <span className={`badge-pill badge-info ${this.slidingComponentListIconClassName}`}></span>
                </a>
            </div>
        </div>
      );
    };
}

export default CCiLabComponentList;
