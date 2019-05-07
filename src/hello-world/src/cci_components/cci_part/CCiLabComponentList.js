
import React, { Component } from "react";

// Import a pre-configured insance of i18next
// https://github.com/ccilab/react-i18next/tree/master/example/react


import styles from "./../../dist/css/ccilab-component-list.css"

import './../../dist/css/popup-menu.css'

import CCiLabComponent from "./CCiLabComponent";
import DropComponentWarningModal from "./CCiLabDropComponentCheckFailedModal";
import { setListHeight, setListWidth, getTextRect} from "./CCiLabUtility";
// // based on https://github.com/ccilab/react-i18next/blob/master/example/react/src/index.js
// // import i18n (needs to be bundled ;))
// import './../l18n/i18n'
import { useTranslation, withTranslation } from 'react-i18next';
import Popup from '../popup_menu/Popup'
import {TextResizeDetector } from "./TextResizeDetector"

import {saveAs} from "./../file_save/FileSaver"



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

const getChildComponentsFromDataSource = (parentComponent)=>{
  //#todo: need to query server to get a new components
  console.log("query server to get child components")
                
  let components =[];
  if( parentComponent.businessLogic.id === 1 )
  {
    components= secondComponents;
    return components;
  }

    
  if( parentComponent.businessLogic.id === 2 )
  {
    components= thirdComponents;  
    return components;
  }

  
  if( parentComponent.businessLogic.id === 4 )
  {
    components= forthComponents;
    return components;
  }

  return components;
}

// initialize displayLogic object
const initializeDisplayLogic = (key, canExpend, rectLeft ) =>{
  let displayLogic = {};
  displayLogic.key = key;
  displayLogic.childKeyIds = [];
  displayLogic.showMyself = false;
  displayLogic.canExpend = canExpend;
  displayLogic.rectLeft = (typeof rectLeft === "undefined" ) ? 0:rectLeft;
  displayLogic.selected = 0;  // 0, -1, +1
  return displayLogic;
};

// find maximum displayLogic.key
const findMaxDisplayKey = ( componentList )=>{
  let displayKeyValue = 0;
  let childKeys =[];
  if( typeof componentList !== "undefined") {
    componentList.forEach( (component)=>{ childKeys.push( component.displayLogic.key ) } );
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply#Using_apply_and_built-in_functions
    // The consequences of applying a function with too many arguments (think more than tens of thousands of arguments) vary across engines 
    // (JavaScriptCore has hard-coded argument limit of 65536), because the limit (indeed even the nature of any excessively-large-stack behavior) is unspecified. 
    displayKeyValue = Math.max( ...childKeys);
  }
  return displayKeyValue;
};

// merge newComponentList (that displayLogic isn't initialized) and existingComponentList (existing components, displayLogic is initialized) into targetComponentList
// from the startComponent 
const initializeComponents = ( startComponent, existingComponentList, newComponentList, targetComponentList)=>{
  if( typeof existingComponentList !== "undefined") 
    existingComponentList.forEach( (existingComponent)=>{ targetComponentList.push( existingComponent ) } );

  // initialize displayLogic items, create unique key value for latest componets from data layer
  // this guarantees that displayLogic.key is unique, (newly added componet won't show itself until
  // user clicks it, except the very top component), 
  let displayKeyValue = findMaxDisplayKey(existingComponentList);
  
  newComponentList.forEach((element)=>{
    if( typeof element.displayLogic === "undefined")
      element.displayLogic = new initializeDisplayLogic( ++displayKeyValue, element.businessLogic.childIds.length !== 0 ? true : false );
  
    if(typeof startComponent   !== "undefined"  && typeof startComponent.displayLogic !== "undefined" && typeof element !== "undefined") {
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
  });
};

const populateComponentChildKeyIds = (selectedComponent, cachedComponents )=>{
  if( selectedComponent.businessLogic.childIds.length !== selectedComponent.displayLogic.childKeyIds.length ) 
  {
      cachedComponents.forEach((element)=>{
        if( selectedComponent.businessLogic.childIds.includes( element.businessLogic.id ) &&
            element.businessLogic.parentIds.includes(selectedComponent.businessLogic.id )  && 
            !selectedComponent.displayLogic.childKeyIds.includes( element.displayLogic.key) ) 
            selectedComponent.displayLogic.childKeyIds.push( element.displayLogic.key )
      })
  }
}



// turn off childKeyIds[] recursively but we don't want to turn off childKeyIds[] unless 
// its direct parent's canExpened = false (the parent is expended already
const hideChildren = (aComponent, aComponents, aShowStatus)=>{
  if( !aComponent.displayLogic.canExpend && aComponent.displayLogic.childKeyIds.length ) 
  {
    aComponents.forEach( (component)=>{
      if( aComponent.displayLogic.childKeyIds.includes(component.displayLogic.key) ) 
      {
        component.displayLogic.showMyself = aShowStatus;
        hideChildren(component, aComponents, aShowStatus)
      }
    });
  }
}



const estimateComponentListRect = (componentLists, fontSize)=>{
  let componentListRect = document.getElementById( 'cciLabComponentListID' ).getBoundingClientRect();
  let updatedRect = {top: componentListRect.top, left: componentListRect.left, bottom: componentListRect.bottom, right: componentListRect.right*1.2, width: componentListRect.width };
  
  let shownComponents = componentLists.filter(component=>component.displayLogic.showMyself === true)
  
  updatedRect.bottom = shownComponents.length * (45+16)/fontSize; //55px - 3.4375rem assuming rem is 24px defined in CCiLabComponent.js as max button height
  return updatedRect;
}

// setSelectedComponentStickDirection(e), changes the direction of sticky element
const setComponentSelected = ( component, selectedComponentKey ) =>{
  if( component.displayLogic.key === selectedComponentKey )
    component.displayLogic.selected = 1; //can be +1 or -1
  else
    component.displayLogic.selected = 0;

}



// titleName, titleHeight, titleWidth, titlePositionLeft, titleClassName
const ComponentListTitle =(props)=>{
  console.log("call - ComponentListTitle:" + props.title );

  const setupBOM=(e)=>{
    props.changeBOMHandler(true)
  }

  const showProgress=(e)=>{
    props.changeBOMHandler(false)
  }

  // https://react.i18next.com/latest/usetranslation-hook fa-spinner
  // https://stackoverflow.com/questions/17737182/how-can-i-overlay-a-number-on-top-of-a-fontawesome-glyph
  const { t, i18n } = useTranslation('componentList', {useSuspense: false});

  console.log("CCiLabComponentList - ComponentListTitle: i18n.language = " + i18n.language );
   
  return (
    <div className='d-flex align-items-center bg-info fa' style={{ 'height': `${props.titleHeight}rem`, 'width': `${props.titleWidth}`}}>
    <span className={props.titleClassName} style={{'position':'relative', 'left':`${props.titlePositionLeft}rem`, fontSize: '1rem'}}>{t(`${props.title}`)}

    { props.setupBOM ? 
       <a key='submit-bom' href='#submit-bom' className='px-1 border-0 text-primary p-0 nav-link fa fa-file-upload' ></a>
      : 
      null
     }
    </span> 
    { props.setupBOM === false ? 
      <a key='show-progress' href='#submit-bom' className={'px-1 border-0 text-primary p-0 nav-link fa fa-cog'} style={{'position':'absolute', 'right':'1.5rem'}} onClick={setupBOM} ></a> 
      : 
      <a key='show-progress' href='#submit-bom' className={'px-1 border-0 text-primary p-0 nav-link fa fa-chart-line'} style={{'position':'absolute', 'right':'1.5rem'}} onClick={showProgress} ></a > 
     }
    {/* popup menu to change language */}
    <Popup
      trigger={
        <button 
          key='selection-language'
          id='#selection-language'
          type="button"
          className={'bg-info text-primary border-0 py-0 px-1 fa fa-language'}
          style={{'position':'absolute', 'right':'0'}}></button>
      }
      closeOnDocumentClick
      on="hover"
      mouseLeaveDelay={400}
      mouseEnterDelay={0}
      contentStyle={{ padding: '0px', border: 'none' }}
      arrow={true}
      >
      <div className={' bg-info'}>
        <a key='en' href='#en' className={'nav-link px-1 m-0 py-0'} style={{ 'fontSize': '0.8rem',  zIndex: 100}} onClick={()=>{i18n.changeLanguage('en')}}>English</a>
        <a key='zh-CN' href='#zh-CN' className={'nav-link px-1 m-0 py-0'} style={{ 'fontSize': '0.8rem',  zIndex: 100}} onClick={()=>{i18n.changeLanguage('zh-CN')}}>中文</a>
      </div>
    </Popup>
  </div>
  );
}

const ComponentListSubTitle = (props)=>{
  const { t } = useTranslation('componentList', {useSuspense: false});
  return ( 
    <div  className='d-flex align-items-center bg-info fa' style={{ 'height': `${props.height}rem`, 'width': `${props.width}`}}>
        <span id='subTitle-name' className={props.className} style={{'position':'relative',  'left':`${props.positionLeft}rem`, fontSize: '0.9rem'}}>{t(`${props.name}`)}</span>
        <span id='subTitle-type' className={props.className} style={{'position':'relative', 'left':`${props.ratePositionLeft}rem`, fontSize: '0.9rem'}}>{t(`${props.rateType}`)} 
        </span> 
        {/* #todo - make title editable by user */}
        {/* <a id='subTitle-edit' href='#edit-title' className='border-0 text-primary text-nowrap p-0 nav-link fa fa-edit' style={{'position':'absolute', 'right':'0'}}></a> */}
    </div>
  );
}


class CCiLabComponentList extends Component {
    state = { greetings: undefined, 
              visible: true, 
              selected: 0, 
              setupBOM: false, 
              fontSize: 23, //default browser medium font size in px
              isDropToSameParentWarning: false, 
              isDropToItselfWarning: false};

    initialized=false;  //needed to avoid render without DOM
    slidingComponentListIconClassName;
      
    componentListWidth; //in px or vw,  
    hideListWidth; //in px or vw
    compnentListTranslateStyle;
    lastScrollYPosition;

    movedComponentName;
    targetComponentName;

    componentLeftOffset;  // in rem
 
    componentTitleLeft; //rem  1.5625
    componentTitleHeight; //rem 
    statusTitleLeft;      //rem
    rootComponentNameWidth;  //in rem
    componentTitleTop;
    componentListMinHeight;  
    componentListHeight;  //minimum height 
    
    init=(props)=>{
      this.slidingComponentListIconClassName = this.state.visible? 'fa fa-angle-double-left' : 'fa fa-angle-double-right';
        
      this.componentListWidth= setListWidth(1.0); //in px or vw,  
      this.hideListWidth = setListWidth(0.99); //in px or vw
      this.compnentListTranslateStyle=this.state.visible ? `translate3d(0, 0, 0)`: `translate3d(-${this.hideListWidth}, 0, 0)`;
      this.lastScrollYPosition = 0;

      this.movedComponentName='undefined';
      this.targetComponentName='undefined';

      this.componentLeftOffset = 1;  // in rem
  
      this.componentListMinHeight = ( 150/this.state.fontSize +'rem' );  
      this.componentListHeight= window.innerHeight <= 200 ? this.componentListMinHeight : 'auto';  //minimum height 
    }

    onFontResize=(e, args)=>{
      this.setState( { fontSize: TextResizeDetector.getSize() } )
      //alert("The width = " + this.state.fontSize);
    }

    

    initTextResizeDetector=()=>{
      let iBase = TextResizeDetector.addEventListener(this.onFontResize,null);
      // alert("The base font size = " + iBase);
      this.setState( { fontSize: iBase } )
    }  

    positioningListTitle=(rootComponent)=>{ 
      let rootComponentName = rootComponent.businessLogic.name; 

      //#todo: title is from server or user input, not hardcoded here
      // this name gives approrated width 
      let titleRect=getTextRect('部件名:'); //部件名
            
      let componentTitleWidth = titleRect.width/this.state.fontSize;  //in rem 
       // console.log( 'CCiLabComponentList - componentTitleWidth (rem): ', componentTitleWidth);

      this.componentTitleLeft = (typeof rootComponent.displayLogic.rectLeft === 'undefined' || rootComponent.displayLogic.rectLeft === 0)? componentTitleWidth * 0.8 : rootComponent.displayLogic.rectLeft; //90% of title width,in rem

      this.componentLeftOffset = this.componentTitleLeft;

      this.componentTitleHeight = (titleRect.height/this.state.fontSize)*1.4; //140% of title height, in rem
      this.componentTitleTop = (this.componentTitleHeight - titleRect.height/this.state.fontSize)/2; //in rem
     
      this.rootComponentNameWidth = typeof rootComponentName !== "undefined" ?  getTextRect(rootComponentName).width/this.state.fontSize : componentTitleWidth;  //in rem
      
      // let rootImgBtnWith = 45/this.state.fontSize;  //also used in CCiLabComponent.js
      this.statusTitleLeft = this.componentTitleLeft + componentTitleWidth + this.rootComponentNameWidth; //in rem + rootImgBtnWith
      //alert("FontSize = " + this.state.fontSize + " The width = " + getTextRect(rootComponentName).width + " width/fontSize = "+ rootComponentNameWidth);
      // status tile is from server or user input
    }
    
    toggleHideShowComponentList = () =>{
      // console.log('container: clicked before: - ', this.state.visible ? 'true' : 'false' );
      console.log("CCiLabComponentList - toggleHideShowComponentList");
      this.setState( { visible: this.state.visible ? false : true } );

      this.compnentListTranslateStyle = this.state.visible ? `translate3d(0, 0, 0)`: `translate3d(-${this.hideListWidth}, 0, 0)`;
      this.slidingComponentListIconClassName = this.state.visible? 'fa fa-angle-double-left' : 'fa fa-angle-double-right';
      // console.log('container: clicked after: - ', this.state.visible ? 'true' : 'false' );
    }

    // show or hide component list
    showHideComponentList=()=>{
      console.log("CCiLabComponentList - showHideComponentList");
      this.toggleHideShowComponentList();
      //e.stopPropagation();
    };
    
    

    // initialize first component's childKeyIds, reorder in following order: the first component, alarm status, warning status, no_issue status
    componentWillMount=()=>{
      this.init(this.props);

      TextResizeDetector.TARGET_ELEMENT_ID = 'root';
      TextResizeDetector.USER_INIT_FUNC = this.initTextResizeDetector;

      let currentSessionComponents=[];
 
      //#todo: need to query server to get a new components
      console.log("CCiLabComponentList - componentWillMount: query server to get root components")
      let components = firstComponents;

      //#todo: need to query server side to find the very top component 
      let rootComponent = components.filter(component=>component.businessLogic.parentIds.length === 0)[0]
      rootComponent.displayLogic = initializeDisplayLogic( 0, rootComponent.businessLogic.childIds.length !== 0 ? true : false );
       
      initializeComponents(rootComponent, this.state.greetings, components, currentSessionComponents);
    
      //always show very top component
      rootComponent.displayLogic.showMyself = true;
   
      if( rootComponent.businessLogic.childIds.length !== 0 ){
        rootComponent.displayLogic.canExpend = true;

        // populate very top component's displayLogic.childKeyIds[], if it's not incluced yet
        populateComponentChildKeyIds(rootComponent, currentSessionComponents);
      }

      this.positioningListTitle(rootComponent);
      
      // trick - set default visible=true in constructor, set visible=false in componentWillMount
      // so when user clicks << component list will sliding back
      this.state.greetings=currentSessionComponents;
      this.state.visible = false;
      this.state.setupBOM = this.state.setupBOM ? this.state.setupBOM : (this.state.greetings.length <= 1 ? true : false);

    }
  
    getSubTitleWidth=()=>{
      // find width of sub title 
      let subTitleNameRect =  document.getElementById( 'subTitle-name' ).getBoundingClientRect();
      let subTitleTypeRect =  document.getElementById( 'subTitle-type' ).getBoundingClientRect();
      // let subTitleEditIcon = document.getElementById( 'subTitle-edit' ).getBoundingClientRect();+ subTitleEditIcon.width
    
      let width = 2*(this.componentTitleLeft + this.rootComponentNameWidth )* this.state.fontSize + subTitleNameRect.width  + subTitleTypeRect.width ;
   
      return width;
    }
    
  
    /**
   * bind to resize event, Calculate & Update state of new dimensions
   */
    updateDimensions=()=>{
      let listRect = estimateComponentListRect(this.state.greetings, this.state.fontSize);
      console.log('CCiLabComponentList - updateDimensions: list width '+ listRect.width);

      this.componentListHeight = setListHeight( listRect, this.state.fontSize );

      let titleWidth = this.getSubTitleWidth();

      console.log('CCiLabComponentList - updateDimensions: title width '+ titleWidth);

      if( listRect.width <= titleWidth )
        this.componentListWidth = titleWidth +'px';
      else
        this.componentListWidth = listRect.width +'px';
        // this.componentListWidth= setListWidth(1.0, titleWidth );

      // this.setState( {  })
      console.log("CCiLabComponentList - updateDimensions: used list width: " + this.componentListWidth );
      this.setState( { greetings: this.state.greetings } );
    }

    
    /** 
     * called after initial render() is called and element is inserted indo DOM
     * Add event listener to show vertical scroll bar if browser window is shorter 
     * than component list rect height
     * */ 
    componentDidMount =()=> {
      console.log("CCiLabComponentList - componentDidMount");
      window.addEventListener("resize", this.updateDimensions);
      this.initialized = true;
    }

    // shouldComponentUpdate =(nextProps, nextState)=>{
    //   console.log("CCiLabComponentList - shouldComponentUpdate")
    //   return 
    //         //  (typeof this.state.greetings !== "undefined" && this.state.greetings.length !== nextState.greetings.length ) ||
    //          this.state.setupBOM !== nextState.setupBOM ||
    //          this.state.selected !== nextState.selected
    // }

    addGreeting = (newName, progressValue) =>{
      console.log("CCiLabComponentList - addGreeting");
      this.setState({ greetings: [...this.state.greetings, 
        { businessLogic: {id: this.state.greetings.length + 1, name: newName, parentIds:[0], childIds:[], imgFile:'', status: "alarm", progressPercent: progressValue}}] });
    };

    removeGreeting = (removeName) =>{
      const filteredGreetings = this.state.greetings.filter(component => {
        return component.businessLogic.name !== removeName;
      });
      console.log("CCiLabComponentList - removeGreeting");
      this.setState({ greetings: filteredGreetings });
    };

   

    //based on selected component and its show Status to show or hide its children
    showOrHideChildren = ( selectedComponent, showStatus, isRending=true ) =>{
          let currentSessionComponents=[];
        
          // if selected component's childKeyIds[] isn't fully populated we need to request new components from server side first
          if ( selectedComponent.businessLogic.childIds.length !== selectedComponent.displayLogic.childKeyIds.length ) {
              //#todo: need to query server to get a new components
              console.log("query server to get child components")
              
              let components = getChildComponentsFromDataSource(selectedComponent);

              initializeComponents(selectedComponent, this.state.greetings, components, currentSessionComponents);
          }
          else {
            currentSessionComponents = this.state.greetings;
          }
           
          populateComponentChildKeyIds(selectedComponent, currentSessionComponents );

          let rootComponent = currentSessionComponents.find(component=>component.businessLogic.parentIds.length === 0);

          // looping through entire component list to find the component included inside child component list
          currentSessionComponents.forEach( (item)=>{
            setComponentSelected(item, selectedComponent.displayLogic.key);
 
            // skip the first component
            if( item.displayLogic.key !== rootComponent.displayLogic.key )
            {
               // find the component that has the child components, and show or hide the show status of this component's childKeyIds 
              if( selectedComponent.displayLogic.childKeyIds.includes(item.displayLogic.key) ) {
                item.displayLogic.showMyself = showStatus;

                  // recursively hide childKeyIds[] of child component included in childKeyIds[] of current component,
                  // but we don't want to hide child component's childKeyIds[] unless its direct parent's canExpend = false 
                  hideChildren(item, currentSessionComponents, showStatus);
              }
            }

           
          });
          
          // create vertical scroll bar based on the height of component list dynamically
          let updatedRect = estimateComponentListRect(currentSessionComponents, this.state.fontSize);

          this.componentListHeight = setListHeight( updatedRect, this.state.fontSize );
          this.componentListWidth = setListWidth(1.0);

          if( isRending )
          {
            console.log("CCiLabComponentList - showOrHideChildren");
            this.setState( { greetings: currentSessionComponents })
          }
          
          
          return currentSessionComponents;

    };

     

    selectedComponentHandler = ( selectedComponent, highlight=true ) =>{
      let currentSessionComponents=this.state.greetings;
      currentSessionComponents.forEach( (item)=>{setComponentSelected(item, selectedComponent.displayLogic.key);});

      if( highlight === true )
      {
        console.log("CCiLabComponentList - selectedComponentHandler");
        this.setState( { greetings: currentSessionComponents });
      }
    }

    
    // handles vertical scroll bar event
    setSelectedComponentStickDirection = (e) =>{
      let scrollY = e.target.scrollTop;

      // horizontal scroll, return
      if( scrollY === 0 || this.lastScrollPosition === scrollY )
        return;

      let currentSessionComponents = this.state.greetings;
      let selectedComponent = currentSessionComponents.find( (component)=>{return component.displayLogic.selected !== 0; })

      if( typeof(selectedComponent)  === "undefined")
        return; 

      if( typeof( selectedComponent.displayLogic )!== "undefined" )
      {
          if ( scrollY < this.lastScrollYPosition )
          {
              //scroll up - component move downward - set selected to -1 - sticky-bottom
              selectedComponent.displayLogic.selected = -1;
              console.log('scroll up - component move down: ', -1 );
          }
          else
          {
              //scroll down - component move upward - set selected to +1 -
              selectedComponent.displayLogic.selected = 1;
              console.log('scroll down - component move up: ', 1 );
          }
     
     
          // console.log('new position: ' + newScrollPosition + ' last position: ' + this.lastScrollPosition + ' selected: ' + selectedComponent.displayLogic.selected);

          this.lastScrollYPosition = scrollY;

          console.log("CCiLabComponentList - setSelectedComponentStickDirection");
          this.setState({selected: selectedComponent.displayLogic.selected});
      }
    }

    // handle componemt move
    // - update component list
    // - update component status after move by check against the new parent
    // issue - need to keep highlight is component is show or it's parent should be highlight
    //       
    moveComponentHandler = ( movedComponentDisplayKey, targetComponent ) =>{
      if( typeof movedComponentDisplayKey !== "undefined" && typeof( movedComponentDisplayKey) === "string" )
      {
        console.log('moved component key: ', movedComponentDisplayKey);


        let currentSessionComponents = this.state.greetings;
        let sourceId = parseInt(movedComponentDisplayKey, 10);

        if( typeof targetComponent === "undefined")
          return;

        let movedComponent = currentSessionComponents.find( (component)=>{return component.displayLogic.key === sourceId } )

        // this component can't be moved e.g. it has children
        if( typeof movedComponent === "undefined" )
        {
          return;
        }
        
        console.log('source component name: ', movedComponent.businessLogic.name);
        console.log('target component name: ', targetComponent.businessLogic.name);
 
        //component can't drop to its own parent, 
        if( targetComponent.displayLogic.childKeyIds.find( (key)=>{ return key === sourceId}) )
        {
          this.targetComponentName = targetComponent.businessLogic.name;
          this.movedComponentName = movedComponent.businessLogic.name;

          console.log("CCiLabComponentList - moveComponentHandler 1");

          this.setState( {isDropToSameParentWarning: true} );
          return;
        }

        //same component business id can't be move to itself
        if( targetComponent.businessLogic.id === movedComponent.businessLogic.id )
        {
          this.targetComponentName = targetComponent.businessLogic.name;
          this.movedComponentName = movedComponent.businessLogic.name;

          console.log("CCiLabComponentList - moveComponentHandler 2");

          this.setState( {isDropToItselfWarning: true} );
          return;
        }

        // component can't be moved to a parent already has the same component as it's child
        if( targetComponent.businessLogic.childIds.includes( movedComponent.businessLogic.id ) )
        {
          this.targetComponentName = targetComponent.businessLogic.name;
          this.movedComponentName = movedComponent.businessLogic.name;

          console.log("CCiLabComponentList - moveComponentHandler 3");
          this.setState( {isDropToSameParentWarning: true} );
          return;
        }

        // if targer component's children are hidden, expending all the children first without calling setState to rend the list
        if( targetComponent.displayLogic.canExpend )
        {
           currentSessionComponents = this.showOrHideChildren( targetComponent, true, false);
           targetComponent.displayLogic.canExpend = false;
        }
         

        // find current parent components of source/moved component, have to use displayLogic.Key that is unique, to search  
        let parentComponents = currentSessionComponents.filter(  (component)=>{
                    return component.displayLogic.childKeyIds.length && component.displayLogic.childKeyIds.find( (childKey)=>{return childKey === sourceId } ) 
                  } );

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
            delete rmMovedComponent[0].displayLogic;

            let newDisplayKey = findMaxDisplayKey(currentSessionComponents);

            rmMovedComponent[0].displayLogic = initializeDisplayLogic(++newDisplayKey, false, targetComponent.displayLogic.rectLeft)

            //update businessLogic and displayLogic childIds of target component (target) as moved component ( source )
            targetComponent.businessLogic.childIds.push(rmMovedComponent[0].businessLogic.id);

            //rebuild the component list
            let updatedSessionComponents = [];
            
            
            
            //initialize the updated session components
            initializeComponents(targetComponent, currentSessionComponents, rmMovedComponent, updatedSessionComponents);

            // populate target component's displayLogic.childKeyIds[]
            populateComponentChildKeyIds(targetComponent, updatedSessionComponents);
            

            rmMovedComponent[0].displayLogic.showMyself = true;

            // update selected status so the moved component or its parent will be highlighted 
            updatedSessionComponents.forEach( (item)=>{
                    setComponentSelected( item, rmMovedComponent[0].displayLogic.key ); 
                  });

            //check if moved component progress status need to change (#todo)
 
            // update greetings list
            console.log("CCiLabComponentList - moveComponentHandler 4 ")
            this.setState( { greetings: updatedSessionComponents });
        }
        
      }
    };

    showSetupBOM=( isShowSetupBOM )=>{
      this.setState({setupBOM: isShowSetupBOM});
      this.updateDimensions();
    }
    //need to update showMyself to true after button is clicked to canExpend
    //need to update showMyself to false after button is clicked to collaps
    renderGreetings = () => {
      return ( (typeof this.state !== "undefined") && (typeof this.state.greetings !== "undefined" ) )? 
          this.state.greetings.map( (component) => {
                if( component.displayLogic.showMyself === true )
                {
                  // get parent's of this component
                  let parentComponent;
                  if( component.businessLogic.parentIds.length === 0 )
                    parentComponent = component; // root
                  else
                  {
                    parentComponent = this.state.greetings.find( (item)=>{
                        if( typeof item.displayLogic !== "undefined" && typeof component.displayLogic !== "undefined")
                        {
                          return item.displayLogic.childKeyIds.includes(component.displayLogic.key); 
                        }
                        else
                          return "undefined";
                    });
                  }
                  
                  // get parent's rectLeft as left offset of this component
                  if( typeof parentComponent !== "undefined" && typeof parentComponent.displayLogic.rectLeft !== "undefined" )
                      this.componentLeftOffset = parentComponent.displayLogic.rectLeft; //in rem

                  console.log("CCiLabComponentList - renderGreetings - "+ component.businessLogic.name);

                  return <CCiLabComponent key={component.displayLogic.key} 
                                          component={component} 
                                          leftOffset={this.componentLeftOffset} 
                                          listWidth={this.componentListWidth}
                                          fontSize={this.state.fontSize}
                                          removeGreeting={this.removeGreeting} 
                                          showOrHideChildren={this.showOrHideChildren}
                                          selectedComponentHandler={this.selectedComponentHandler}
                                          moveComponentHandler={this.moveComponentHandler}
                                          isSetupBOM={this.state.setupBOM}/> ;
                }
                else
                  return null;
            }
          ) : null;
    };

    hideDropToSameParentWarning=()=>{
      console.log("CCiLabComponentList - hideDropToSameParentWarning ")
      this.setState({isDropToSameParentWarning: false});
    }

    hideDropToItselfWarning=()=>{
      console.log("CCiLabComponentList - hideDropToItselfWarning ")
      this.setState({isDropToItselfWarning: false});
    }

    showSetupBOM=( isShowSetupBOM )=>{
      this.updateDimensions();
      this.setState({setupBOM: isShowSetupBOM });
    }

    render() {
      if( this.initialized === false )
        return null;

      const droptoSameParentWarningModal = this.state.isDropToSameParentWarning ? 
                  <DropComponentWarningModal 
                  title='title'
                  key1='same-child'
                  option = { `{"targetComponent": "${this.targetComponentName}", "movedComponent": "${this.movedComponentName}"}`}
                  hideDropWarning={this.hideDropToSameParentWarning}/>
                  : null;

      const droptoItselfWarningModal = this.state.isDropToItselfWarning ? 
                  <DropComponentWarningModal 
                    title={'title'} 
                    key1='same-component'
                    option = { `{ "targetComponent": "${this.targetComponentName}"}`}
                    hideDropWarning={this.hideDropToItselfWarning}/>
                  : null;
 
      let listTitleClassName='border-0 text-primary text-nowrap';

      console.log( "CCiLabComponentList - call render() ");
      return (
        <div className={`d-flex align-items-center`} >
          {/* <AddGreeter addGreeting={this.addGreeting} /> */}
            {/* https://code.i-harness.com/en/q/27a5171 explains why vertical scroll bar won't appear for flex box 
                and what is the workaroud. iphone4s and lower isn't supported
                UC browser and Edge pro to 15 (https://caniuse.com/#feat=css-sticky) doesn't suppot onScroll={this.updateDimensions}*/} 
              <div id='cciLabComponentListID' 
                  className={`cci-component-list_transition`} 
                  style={{'transform': `${this.compnentListTranslateStyle}`, 
                          'WebkitTransform':`${this.compnentListTranslateStyle}`,
                          'height':`${this.componentListHeight}`, 
                          'width':`${this.componentListWidth}`}}
                  >

                  { this.state.setupBOM ? <ComponentListTitle title='title-BOM' 
                                      titleHeight={this.componentTitleHeight}
                                      titleWidth={this.componentListWidth}
                                      titlePositionLeft= {this.componentTitleLeft}
                                      titleClassName = {listTitleClassName}
                                      setupBOM = {this.state.setupBOM} 
                                      changeBOMHandler = {this.showSetupBOM}/> :
                                <ComponentListTitle title='title-Progress' 
                                      titleHeight={this.componentTitleHeight}
                                      titleWidth={this.componentListWidth}
                                      titlePositionLeft= {this.componentTitleLeft}
                                      titleClassName = {listTitleClassName}
                                      setupBOM = {this.state.setupBOM} 
                                      changeBOMHandler = {this.showSetupBOM}/>
                  }
                  <hr className='my-0 bg-info' style={{borderStyle:'groove', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

                  {/*  sticky to top and left, https://gedd.ski/post/position-sticky/*/}
                  {/* https://iamsteve.me/blog/entry/using-flexbox-for-horizontal-scrolling-navigation
                      https://codepen.io/stevemckinney/pen/WvWrRX */}
                 
                  { this.state.setupBOM ? <ComponentListSubTitle 
                                         name='subTitle-BOM-create-component'
                                         rateType='subTitle-BOM-data'
                                         height={this.componentTitleHeight}
                                         width={this.componentListWidth}
                                         className={listTitleClassName}
                                         positionLeft={this.componentTitleLeft}
                                         ratePositionLeft={this.statusTitleLeft}/> :
                                <ComponentListSubTitle 
                                         name='subTitle-Progress-component-name'
                                         rateType='subTitle-Progress-status'
                                         height={this.componentTitleHeight}
                                         width={this.componentListWidth}
                                         className={listTitleClassName}
                                         positionLeft={this.componentTitleLeft}
                                         ratePositionLeft={this.statusTitleLeft}/> 
                   }  
                  {/* https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Controlling_Ratios_of_Flex_Items_Along_the_Main_Ax */}
                  <div className={'d-flex flex-column cci-flyout-component-list'} 
                       style={{ 'height':`${this.componentListHeight}`, 
                                'minHeight': `${this.componentListMinHeight}`,
                                'width':`${this.componentListWidth}`}}
                       onScroll={this.setSelectedComponentStickDirection}>
                    {/* <hr className='m-0'></hr> */}
                    {this.renderGreetings()}
                  </div>
              </div>
              <a href="#show-hide-component-list" 
                className='nav-link pl-0 py-4 pr-4 cci-component-list_transition' 
                style={{'transform': `${this.compnentListTranslateStyle}`,
                        'WebkitTransform':`${this.compnentListTranslateStyle}`}} 
                onClick={this.showHideComponentList} >
                <span className={`badge-pill badge-info ${this.slidingComponentListIconClassName}`}></span>
              </a>
            {droptoSameParentWarningModal }
            {droptoItselfWarningModal }
        </div>
      );
    };
}

export default CCiLabComponentList;
