
import React, { Component } from "react";
import "./../../css/CCiLabComponentList.css";
import CCiLabComponent from "./CCiLabComponent";
// import AddGreeter from "./AddGreeter";
import { setListHeight, setListWidth, setHideListWidth} from "./CCiLabUtility"

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

// initialize displayLogic object
const displayLogic = (key, childKeyIds, showMyself, canExpend, rectLeft, selected ) =>{
  let displayLogic = {};
  displayLogic.key = key;
  displayLogic.childIds = childKeyIds;
  displayLogic.showMyself = showMyself;
  displayLogic.canExpend = canExpend;
  displayLogic.rectLeft = rectLeft;
  displayLogic.selected = selected;
  return displayLogic;
};

// merge newComponentList (that displayLogic isn't initialized) and existingComponentList (existing components, displayLogic is initialized) into targetComponentList
// from the startComponent 
const initializeComponents = ( startComponent, existingComponentList, newComponentList, targetComponentList)=>{
  let displayKeyValue = 0;

  if( typeof existingComponentList !== "undefined") {
    existingComponentList.forEach( (existingComponent)=>{ targetComponentList.push( existingComponent ) } );
    displayKeyValue = targetComponentList.length;
  }

  // initialize displayLogic items, create unique key value for latest componets from data layer
  // this guarantees that displayLogic.key is unique, (newly added componet won't show itself until
  // user clicks it, except the very top component), 
  
  for(let idx = 0; idx < newComponentList.length; idx++ ) {
    let element = newComponentList[idx];
    if( typeof (element.displayLogic)=== "undefined")
    {
      element.displayLogic = new displayLogic( displayKeyValue++,
                                                0,
                                                false,
                                                element.businessLogic.childIds.length !== 0 ? true :  false,
                                                0,
                                                0 );
    }

   
    if(typeof( startComponent )  !== "undefined"  && typeof(startComponent.displayLogic) !== "undefined") {
      let startComponentKey = startComponent.displayLogic.key;
      //need populate childKeyIds[] if its not fully populated yet
      if( startComponent.businessLogic.childIds.length !==  startComponent.displayLogic.childKeyIds.length && 
          startComponent.displayLogic.childKeyIds.includes( element.displayLogic.key ) === false ) 
      {
          let idxInsertAt = targetComponentList.findIndex((component)=>{return component.displayLogic.key === startComponentKey});
          // component without childIs[] is always above componets with childIds[] for display/expending purpose
          if( element.businessLogic.childIds.length === 0 )
            targetComponentList.splice( idxInsertAt+1,0,element);
          else
            targetComponentList.push(element);
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

// setSelectedComponentStickDirection(e), changes the direction of sticky element
const setComponentSelected = ( component, selectedComponentKey ) =>{
  if( component.displayLogic.key === selectedComponentKey )
    component.displayLogic.selected = 1; //can be +1 or -1
  else
    component.displayLogic.selected = 0;

}


class CCiLabComponentList extends Component {
    state = { greetings: undefined, visible: true, selected: 0 };

    slidingComponentListIconClassName = this.state.visible? 'fa fa-angle-double-left' : 'fa fa-angle-double-right';
    componentListHeight= window.innerHeight <= 200 ? '150px' : 'auto';  //minimum height 
    componentListWidth= setListWidth();
      
    compnentListTranslateStyle='';
    lastScrollPosition = 0;
    
    toggleHideShowComponentList = () =>{
      // console.log('container: clicked before: - ', this.state.visible ? 'true' : 'false' );
      this.setState( { visible: this.state.visible ? false : true } );

      let hideListWidth = setHideListWidth()*.99;

      this.compnentListTranslateStyle = this.state.visible ? 'translate3d(0vw, 0, 0)': `translate3d(-${hideListWidth}vw, 0, 0)`;

      this.slidingComponentListIconClassName = this.state.visible? 'fa fa-angle-double-left' : 'fa fa-angle-double-right';
      // console.log('container: clicked after: - ', this.state.visible ? 'true' : 'false' );
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

      this.componentListHeight = setListHeight( updatedRect );

      this.componentListWidth= setListWidth();

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
            setComponentSelected(currentSessionComponents[idxComponent], selectedComponent.displayLogic.key);
 
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

          this.componentListHeight = setListHeight( updatedRect );
          this.componentListWidth = setListWidth();

          this.setState( { greetings: currentSessionComponents })
    };

     

    selectedComponentHandler = ( selectedComponent ) =>{
      let currentSessionComponents=this.state.greetings;
      for( let idxComponent = 0;  idxComponent < currentSessionComponents.length; idxComponent++ ) 
      {
        setComponentSelected(currentSessionComponents[idxComponent], selectedComponent.displayLogic.key);
      }
      this.setState( { greetings: currentSessionComponents });
    }

    
    // handles vertical scroll bar event
    setSelectedComponentStickDirection = (e) =>{
      let scrollY = e.target.scrollTop;

      let newScrollPosition = scrollY;
 
      let currentSessionComponents = this.state.greetings;
      let selectedComponent = currentSessionComponents.find( (component)=>{return component.displayLogic.selected !== 0; })

      if( selectedComponent !== "undefined" && selectedComponent.displayLogic !== "undefined" )
      {
          if ( newScrollPosition < this.lastScrollPosition )
          {
              //scroll up - component move downward - set selected to -1 - sticky-bottom
              selectedComponent.displayLogic.selected = -1;
          }
          else
          {
              //scroll down - component move upward - set selected to +1 - sticky-top
              selectedComponent.displayLogic.selected = 1;
          }
     
     
          // console.log('new position: ' + newScrollPosition + ' last position: ' + this.lastScrollPosition + ' selected: ' + selectedComponent.displayLogic.selected);

          this.lastScrollPosition = newScrollPosition;

          this.setState({selected: selectedComponent.displayLogic.selected});
      }
    }

    // handle componemt move
    // - update component list
    // - update component status after move by check against the new parent
    // issue - after move the position isn't right if don't expend the parent
    //       - collapse the parent, moved element won't hide
    moveComponentHandler = ( movedComponentDisplayKey, targetComponent ) =>{
      if( movedComponentDisplayKey !== "undefined" && typeof( movedComponentDisplayKey) === "string" )
      {
        console.log('moved component key: ', movedComponentDisplayKey);


        let currentSessionComponents = this.state.greetings;
        let sourceId = parseInt(movedComponentDisplayKey, 10);
        let movedComponent = currentSessionComponents.find( (component)=>{return component.displayLogic.key === sourceId } )

        if( movedComponent !== "undefined")
        {
          console.log('source component name: ', movedComponent.businessLogic.name);
          console.log('target component name: ', targetComponent.businessLogic.name);

          // find current parent components of source/moved component 
          let parentComponents = currentSessionComponents.filter(  (component)=>{return component.businessLogic.childIds.length && component.businessLogic.childIds.find( (childId)=>{return childId === movedComponent.businessLogic.id } ) } );
          parentComponents.map( (component)=>{return console.log('parent component name of source component: ', component.businessLogic.name) } );

          //remove moved/source component id and displayLogicKey from prevous parent's businessLogic and displayLogic childId list
          parentComponents.map( (component)=>{
                if( component.businessLogic.childIds.length || component.displayLogic.childKeyIds.length )
                {
                  let idxBusinessLogicId = component.businessLogic.childIds.indexOf( movedComponent.businessLogic.id );
                  if( idxBusinessLogicId >= 0 )
                    component.businessLogic.childIds.splice( idxBusinessLogicId,1);

                  let idxDisplayLogicId = component.displayLogic.childKeyIds.indexOf( movedComponent.displayLogic.key );
                  if( idxDisplayLogicId >= 0 )
                    component.displayLogic.childKeyIds.splice( idxDisplayLogicId, 1 );
                }

                return component;
              } );
              
          
          //remove moved/source component from component list
          let idxMovedComponent = currentSessionComponents.findIndex( (component)=>{return component.displayLogic.key === sourceId; });
          if( idxMovedComponent >= 0 )
          {
              let rmMovedComponent = currentSessionComponents.splice( idxMovedComponent, 1);

              //update parent id of moved component (source) as target Component id
              rmMovedComponent[0].businessLogic.parentIds.length=0;
              rmMovedComponent[0].businessLogic.parentIds.push(targetComponent.businessLogic.id);

              //reset display key and childKeys
              rmMovedComponent[0].displayLogic.key=0;
              rmMovedComponent[0].displayLogic.childKeyIds=[];

              //move to not expended component, change source component show status to false 
              if( targetComponent.displayLogic.canExpend )
                rmMovedComponent[0].displayLogic.showMyself = false;

              //update businessLogic and displayLogic childIds of target component (target) as moved component ( source )
              targetComponent.businessLogic.childIds.push(rmMovedComponent[0].businessLogic.id);

              //rebuild the component list
              let updatedSessionComponents = [];
              
              initializeComponents(targetComponent, currentSessionComponents, rmMovedComponent, updatedSessionComponents);

              //check if moved component progress status need to change (#todo)

              //set the state again
              this.setState( { greetings: updatedSessionComponents });
          }
        }
      }
    };

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
                                          selectedComponentHandler={this.selectedComponentHandler}
                                          moveComponentHandler={this.moveComponentHandler}/> ;
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
                 UC browser, pro to Edge 15 (https://caniuse.com/#feat=css-sticky) doesn't suppot sticky-top onScroll={this.updateDimensions}*/} 
              <div id='cciLabComponentListID' className={`d-flex flex-column flyout-component-list elemnt-transition`} 
                  style={{'transform': `${this.compnentListTranslateStyle}`, 'height':`${this.componentListHeight}`, 'width':`${this.componentListWidth}vw`}}
                  onScroll={this.setSelectedComponentStickDirection}>
                  {/* set style left:0px to sticky-top to left too*/}
                  <div className='flex-row bg-info sticky-top fa' style={{ 'height': '25px', 'width': 'auto', 'left':'0px'}}>
                    <span className='pl-4 border-0 text-primary  text-nowrap'>部件名:</span>
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
