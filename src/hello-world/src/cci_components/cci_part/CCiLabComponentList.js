
import React, { Component } from "react";

// Import a pre-configured instance of i18next
// https://github.com/ccilab/react-i18next/tree/master/example/react


import styles from "./../../dist/css/ccilab-component-list.css"

import './../../dist/css/popup-menu.css'

import CCiLabComponent from "./CCiLabComponent";
import DropComponentWarningModal from "./CCiLabDropComponentCheckFailedModal";
import { setListHeight, setListWidth, getTextRect} from "./CCiLabUtility";
// // based on https://github.com/ccilab/react-i18next/blob/master/example/react/src/index.js
// // import i18n (needs to be bundled ;))
// import './../l18n/i18n'
import { useTranslation } from 'react-i18next';
import Popup from '../popup_menu/Popup'
import {TextResizeDetector } from "./TextResizeDetector"


//json-loader load the *.json file
// import components from './../../data/components.json';


//table includes assembly and paint process
// simulate after loaded very top component and its direct  components
// const firstComponents = components.firstComponents;

// simulate load children of component id 1 ( top )
// const secondComponents = components.secondComponents;

// // simulate load children of component id 2 ( leg )
// const thirdComponents = components.thirdComponents;

// // simulate load children of component id 4 ( low_beam )
// const forthComponents = components.forthComponents;

let fontFamily ='Arial, Helvetica, sans-serif';

// 1) get date source in businessLogic object array from server
// 2) or try to find date source from session Storage
const getChildComponentsFromDataSource = (parentComponent)=>{
  //#todo: need to query server to get a new components
  console.log("query server to get child components")

  let components = null;

  // get root component first from server or session storage
  if( typeof parentComponent === 'undefined')
  {
    return components;
  }
  // if( parentComponent.businessLogic.id === 1 )
  // {
  //   components= secondComponents;
  //   return components;
  // }


  // if( parentComponent.businessLogic.id === 2 )
  // {
  //   components= thirdComponents;
  //   return components;
  // }


  // if( parentComponent.businessLogic.id === 4 )
  // {
  //   components= forthComponents;
  //   return components;
  // }

  return components;
}

// initialize businessLogic object
const initializeBusinessLogic = (parentComponent)=>{
  let businessLogic={id: 0,
                     name: 'add-part',
                     parentIds: typeof parentComponent === 'undefined'? []:[parentComponent.businessLogic.id],
                     childIds :[],
                     imgFile: '',
                     status: 'info',
                     progressPercent:0,
                     remainDays:180};
  return businessLogic;
}

// find maximum displayLogic.key
const findMaxBusinessId = ( componentList )=>{
  let newBusinessId = 0;
  let idList =[];
  if( typeof componentList !== "undefined") {
    componentList.forEach( (component)=>{ idList.push( component.businessLogic.id ) } );
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply#Using_apply_and_built-in_functions
    // The consequences of applying a function with too many arguments (think more than tens of thousands of arguments) vary across engines
    // (JavaScriptCore has hard-coded argument limit of 65536), because the limit (indeed even the nature of any excessively-large-stack behavior) is unspecified.
    newBusinessId = Math.max( ...idList);
  }
  return newBusinessId;
};

// initialize displayLogic object
const initializeDisplayLogic = (key, canExpend, rectLeft, enableMenu ) =>{
  let displayLogic = {};
  displayLogic.key = key;
  displayLogic.childKeyIds = [];
  displayLogic.showMyself = false;
  displayLogic.canExpend = canExpend;
  displayLogic.rectLeft = (typeof rectLeft === "undefined" ) ? 0:rectLeft;
  displayLogic.selected = 0;  // 0, -1, +1
  displayLogic.inlineMenuEnabled = (typeof enableMenu === "undefined" ) ? false : enableMenu;
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

// merge newComponentList (if displayLogic isn't initialized, it will be inilized inside this function) and 
// existingComponentList (existing components, displayLogic is initialized) into targetComponentList
// from a specific component in existingComponentList ( atComponent )
// store businessLogic to session storage for each component in newComponentList
const initializeComponents = ( atComponent, existingComponentList, newComponentList, targetComponentList)=>{
  if( typeof existingComponentList !== "undefined" && existingComponentList !== null )
    existingComponentList.forEach( (existingComponent)=>{ targetComponentList.push( existingComponent ) } );

  // initialize displayLogic items, create unique key value for latest components from data layer
  // this guarantees that displayLogic.key is unique, (newly added component won't show itself until
  // user clicks it, except the very top component),
  let displayKeyValue = findMaxDisplayKey(existingComponentList);

  newComponentList.forEach((element)=>{
    if( typeof element !== "undefined" )
    {
      if( typeof element.displayLogic === "undefined" )
      {
        element.displayLogic = new initializeDisplayLogic( ++displayKeyValue, element.businessLogic.childIds.length !== 0 ? true : false );
      }

      sessionStorage.setItem( `${element.businessLogic.name}_${element.displayLogic.key}_businessLogic`, JSON.stringify( element.businessLogic ));
    }


    if( typeof atComponent  !== "undefined"  &&
        typeof atComponent.displayLogic !== "undefined" )
    {
      let atComponentKey = atComponent.displayLogic.key;
      //need populate childKeyIds[] if its not fully populated yet
      if( atComponent.businessLogic.childIds.length !==  atComponent.displayLogic.childKeyIds.length &&
          atComponent.displayLogic.childKeyIds.includes( element.displayLogic.key ) === false )
      {
          let idxInsertAt = targetComponentList.findIndex((component)=>{return component.displayLogic.key === atComponentKey});
          // component without childIs[] is always above components with childIds[] for display/expending purpose
          if( element.businessLogic.childIds.length === 0 )
            targetComponentList.splice( idxInsertAt+1,0,element);
          else
            targetComponentList.push(element);
      }
    }
    else //new component just created as root component
    {
      targetComponentList.push(element);
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
// its direct parent's canExpended = false (the parent is expended already
const hideChildren = (aComponent, aComponents, aShowStatus)=>{
  if( !aComponent.displayLogic.canExpend && aComponent.displayLogic.childKeyIds.length )
  {
    aComponents.forEach( (component)=>{
      if( aComponent.displayLogic.childKeyIds.includes(component.displayLogic.key) )
      {
        component.displayLogic.showMyself = aShowStatus;
        sessionStorage.setItem( `${component.businessLogic.name}_${component.displayLogic.key}_displayLogic`, JSON.stringify( component.displayLogic ));

        hideChildren(component, aComponents, aShowStatus)
      }
    });
  }
}




// setSelectedComponentStickDirection(e), changes the direction of sticky element
const setComponentSelected = ( component, selectedComponentKey ) =>{
  if( component.displayLogic.key === selectedComponentKey )
    component.displayLogic.selected = 1; //can be +1 or -1
  else
    component.displayLogic.selected = 0;

  sessionStorage.setItem( `${component.businessLogic.name}_${component.displayLogic.key}_displayLogic`, JSON.stringify( component.displayLogic ));
}



// titleName, titleHeight, titleWidth, titlePositionLeft, titleClassName
const ComponentListTitle =(props)=>{
  // console.log("call - ComponentListTitle:" + props.title );
  // https://react.i18next.com/latest/usetranslation-hook fa-spinner
  // https://stackoverflow.com/questions/17737182/how-can-i-overlay-a-number-on-top-of-a-fontawesome-glyph
  const { t, i18n } = useTranslation('componentList', {useSuspense: false});

  const setupBOM=(e)=>{
    props.changeBOMHandler(true)
  }

  const showProgress=(e)=>{
    props.changeBOMHandler(false)
  }

  const languageChangeHandler=(language)=>(e)=>{
    i18n.changeLanguage(language);
    props.titleWidthChangeHandler("undefined");
  }

  // console.log("CCiLabComponentList - ComponentListTitle: i18n.language = " + i18n.language );

  // set setupBOM or progress icon at right side of the title bar
  let cursorStyle = { 'position':'absolute',
                      'right':'1.5rem' };

  return (
    <div className='d-flex align-items-center bg-info fa'
         style={{ 'height': `${props.titleHeight}rem`, 'width': `${props.titleWidth}`, fontFamily: `${fontFamily}`, fontWeight: 'normal'}}>

    <span  id='title-name' className={props.titleClassName} style={{'position':'relative', 'left':`${props.titlePositionLeft}rem`, fontSize: '1rem'}}>{t(`${props.title}`)}

    { props.setupBOM ?
       <i key='submit-bom' className='text-primary cursor-pointer p-1 fa fa-cloud-upload-alt'/>
      :
      null
     }
    </span>
    {/* https://www.robinwieruch.de/conditional-rendering-react/ */}
    {{
       'setup-bom':
         ( !props.setupBOM ?
          <Popup
            trigger={
              <i  key='show-bom'
                className={'cursor-pointer text-primary p-1 fa fa-cog'}
                style={cursorStyle}
                onClick={setupBOM}/>
              }
              closeOnDocumentClick
              on={'hover'} //['click', 'focus','hover']
              position={ 'bottom right' }
              mouseLeaveDelay={0}
              mouseEnterDelay={0}
              contentStyle={{  border: 'none', backgroundColor: `${styles.cciBgColor}`, fontSize: '0.8rem'}}
              arrow={true}
              arrowStyle={{backgroundColor: `${styles.cciBgColor}`}}>
              <span className={'text-info text-nowrap p-1'}>
                {t('show-setup-BOM')}
              </span>
          </Popup>
          :
          <Popup
              trigger={
              <i key='show-progress'
                className={'cursor-pointer text-primary p-1 fa fa-chart-line'}
                style={cursorStyle}
                onClick={showProgress}/>
            }
            closeOnDocumentClick
            on={'hover'} //['click', 'focus','hover']
            position={ 'bottom right' }
            mouseLeaveDelay={0}
            mouseEnterDelay={0}
            contentStyle={{ border: 'none', backgroundColor: `${styles.cciBgColor}`, fontSize: '0.8rem'}}
            arrow={true}
            arrowStyle={{backgroundColor: `${styles.cciBgColor}`}}>
            <span className={'text-info text-nowrap p-1'}>
              {t('show-progress')}
            </span>
        </Popup>
         ),
        'update-progress': null,
        'read-only':null
        }[props.permissionStatus]}

     {/* popup menu to change language */}
     <Popup
      trigger={
        <button
          key='selection-language'
          id='#selection-language'
          type="button"
          className={'bg-info text-primary border-0 py-0 px-1 fa fa-language'}
          style={{'cursor': 'pointer','position':'absolute', 'right':'0'}}></button>
      }
      closeOnDocumentClick
      on={'hover'} //['click', 'focus','hover']
      position={ 'right top' }
      mouseLeaveDelay={200}
      mouseEnterDelay={0}
      contentStyle={{ border: 'none', backgroundColor: `${styles.cciBgColor}`}}
      arrow={true}
      arrowStyle={{backgroundColor: `${styles.cciBgColor}`}}>
      <div >
        <a key='en' href='#English' className={'nav-link p-1 m-0 text-info'} style={{fontSize: '0.7rem'}} onClick={languageChangeHandler('en')}>English</a>
        <a key='zh-CN' href='#中文' className={'nav-link p-1 m-0 text-info'} style={{fontSize: '0.7rem'}} onClick={languageChangeHandler('zh-CN')}>中文</a>
      </div>
     </Popup>
  </div>
  );
}

const ComponentListSubTitle = (props)=>{
  const { t } = useTranslation('componentList', {useSuspense: false});
  return (
    <div className='d-flex align-items-center fa'
        style={{ 'height': `${props.height}rem`, 'width': `${props.width}`, backgroundColor: `${styles.cciBgColor}`, fontFamily: `${fontFamily}`, fontWeight: 'normal' }}>
        <span id='subTitle-name' className={props.className} style={{'position':'relative',  'left':`${props.positionLeft}rem`, fontSize: '0.95rem'}}>{t(`${props.name}`)}</span>
        <span id='subTitle-type' className={props.className} style={{'position':'relative', 'left':`${props.ratePositionLeft}rem`, fontSize: '0.95rem'}}>{t(`${props.rateType}`)}
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
              permissionEnabled: 'setup-bom', // based logged in user to set permission: 'read-only', 'update-progress', 'setup-bom'
              fontSize: 23, //default browser medium font size in px
              isDropToSameParentWarning: false,
              isDropToItselfWarning: false,
              isUpdateToItselfWarning: false};

    initialized = false;  //needed to avoid render without DOM
    slidingComponentListIconClassName;

    componentListWidth; //in px or vw,
    hideListWidth; //in px or vw
    componentListTranslateStyle;
    lastScrollYPosition;

    sourceComponentName;
    targetComponentName;

    componentLeftOffset;  // in rem

    componentTitleLeft; //rem  1.5625
    componentTitleHeight; //rem
    statusTitleLeft;      //rem
    rootComponentNameWidth;  //in rem
    componentTitleTop;
    componentListMinHeight;
    componentListHeight;  //minimum height

    setDefaultListDimension=()=>{
      this.componentListWidth= setListWidth(1.0); //in px or vw,
      this.hideListWidth = setListWidth(0.99); //in px or vw
      this.componentListMinHeight = ( 450/this.state.fontSize +'rem' );  // to show full popup setup bom menu
      this.componentListHeight= window.innerHeight <= 200 ? this.componentListMinHeight : 'auto';  //minimum height
    }

    init=(props)=>{
      this.slidingComponentListIconClassName = this.state.visible? 'fa fa-angle-double-left' : 'fa fa-angle-double-right';

      this.componentListTranslateStyle=this.state.visible ? `translate3d(0, 0, 0)`: `translate3d(-${this.hideListWidth}, 0, 0)`;
      this.lastScrollYPosition = 0;

      this.sourceComponentName='undefined';
      this.targetComponentName='undefined';

      this.componentLeftOffset = 1;  // in rem

      this.setDefaultListDimension();
    }

    estimateComponentListRect = (componentLists, fontSize)=>{
      let updatedRect;
      let componentListRect;
      let componentListElement = document.getElementById( 'cciLabComponentListID' );
      if( typeof componentListElement !== "undefined" && componentListElement !== null )
      {
        componentListRect = componentListElement.getBoundingClientRect();
        updatedRect = {top: componentListRect.top, left: componentListRect.left, bottom: componentListRect.bottom, right: componentListRect.right*1.2, width: componentListRect.width };
      }
      else{
        updatedRect = { top: 0, left: 0, bottom: this.componentListHeight, right: this.componentListWidth, width: this.componentListWidth,  }
      }

      let shownComponents = componentLists.filter(component=>component.displayLogic.showMyself === true)

      let listCalculatedHight = shownComponents.length * (45+16); //in px

      if( listCalculatedHight > (updatedRect.bottom-updatedRect.top) )
        document.getElementById( 'cciLabComponentListID' ).style.overflow = 'auto';

      updatedRect.bottom = listCalculatedHight;
      return updatedRect;
    }

    // eName is 'textSizeChanged' defined TextResizeDetector.js
    onFontResize=( eName, args)=>{
      // eslint-disable-next-line
      this.state.fontSize = args[0].iSize;  //this way won't trigger a DOM rendering
      this.updateDimensions(this.state.greetings);
      console.log("onFontResize: The font size changed from " + args[0].iBase + " to " + this.state.fontSize);
    }



    initTextResizeDetector=()=>{
      let iBase = TextResizeDetector.addEventListener(this.onFontResize,null);
      // console.log("initTextResizeDetector: The base font size iBase: " + iBase);
      this.setState( { fontSize: iBase } )
      this.updateDimensions( "undefined" );
    }

    positioningListTitle=(rootComponent)=>{
      let rootComponentName = rootComponent.businessLogic.name;

      //#todo: title is from server or user input, not hard-coded here
      // this name gives appropriated width
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
      // console.log("CCiLabComponentList - toggleHideShowComponentList");
      this.setState( { visible: this.state.visible ? false : true } );

      this.componentListTranslateStyle = this.state.visible ? `translate3d(0, 0, 0)`: `translate3d(-${this.hideListWidth}, 0, 0)`;
      this.slidingComponentListIconClassName = this.state.visible? 'fa fa-angle-double-left' : 'fa fa-angle-double-right';
      // console.log('container: clicked after: - ', this.state.visible ? 'true' : 'false' );
    }

    // show or hide component list
    showHideComponentList=()=>{
      // console.log("CCiLabComponentList - showHideComponentList");
      this.toggleHideShowComponentList();
      //e.stopPropagation();
    };

    // initialize first component's childKeyIds, reorder in following order: the first component, alarm status, warning status, no_issue status
    componentWillMount=()=>{
      this.init(this.props);

      TextResizeDetector.TARGET_ELEMENT_ID = 'temp-item';
      TextResizeDetector.USER_INIT_FUNC = this.initTextResizeDetector;

      let currentSessionComponents=[];

      //#todo: need to query server side to find the very top component
      console.log("CCiLabComponentList - componentWillMount: query server to get root components")

      //if there is no date source (remote or sessionStorage) available, create root component first
      let components = getChildComponentsFromDataSource();
      let rootComponent = null;
      if( components === null || typeof components === 'undefined')
      {
          components = [this.addComponent()];
          rootComponent = components[0];
          currentSessionComponents=[rootComponent]
      }
      else
      {
          // never check  local storage as it may out of sync with server
          rootComponent = components.filter(component=>component.businessLogic.parentIds.length === 0)[0];
          initializeComponents(rootComponent, this.state.greetings, components, currentSessionComponents);

          //always show very top component
          rootComponent.displayLogic.showMyself = true;

          if( rootComponent.businessLogic.childIds.length !== 0 )
          {
            rootComponent.displayLogic.canExpend = true;

            // populate very top component's displayLogic.childKeyIds[], if it's not included yet
            populateComponentChildKeyIds(rootComponent, currentSessionComponents);
          }

          sessionStorage.setItem( `${rootComponent.businessLogic.name}_${rootComponent.displayLogic.key}_displayLogic`, JSON.stringify( rootComponent.displayLogic ));
      }


      this.positioningListTitle(rootComponent);

      // trick - set default visible=true in constructor, set visible=false in componentWillMount
      // so when user clicks << component list will sliding back

      // eslint-disable-next-line
      this.state.greetings=currentSessionComponents;
      // eslint-disable-next-line
      this.state.visible = false;
      // eslint-disable-next-line
      this.state.setupBOM = this.state.setupBOM ? this.state.setupBOM : (this.state.greetings.length <= 1 ? true : false);

    }

    getMaxTitleWidth=()=>{
      let width;
      let titleNameElement = document.getElementById( 'title-name' );
      if( typeof titleNameElement !== "undefined" && titleNameElement !== null )
      {
         let titleNameRect =  titleNameElement.getBoundingClientRect();

        // find width of sub title
        let subTitleNameRect =  document.getElementById( 'subTitle-name' ).getBoundingClientRect();
        let subTitleTypeRect =  document.getElementById( 'subTitle-type' ).getBoundingClientRect();

        let subTitleWidth = subTitleNameRect.width  + subTitleTypeRect.width;
        if( titleNameRect.width > subTitleWidth )
          width = (this.componentTitleLeft + this.rootComponentNameWidth )* this.state.fontSize + titleNameRect.width;
        else  // title name is much longer the sub title in Chinese
          width = (this.componentTitleLeft + this.rootComponentNameWidth )* this.state.fontSize + 1.8 * subTitleWidth ;
      }
      else
        width = this.componentListWidth;

      return width;  // in px
    }


    /**
   * bind to resize event, Calculate & Update state of new dimensions
   */
    onResizeHandler=(e)=>{
      this.updateDimensions(this.state.greetings);
    }

    //  handles component list increase due to add/remove components
    updateDimensions=( componentList, isRender = true )=>{
      if( componentList === "undefined" || this.state.greetings === "undefined")
      {
          this.setDefaultListDimension();
      }
      else{
          if( componentList === "undefined")
            componentList = this.state.greetings;

          let listRect = this.estimateComponentListRect( componentList, this.state.fontSize); //this.state.greetings
          // console.log('CCiLabComponentList - updateDimensions: list width '+ listRect.width);

          this.componentListHeight = setListHeight( listRect, this.state.fontSize );

          let titleWidth = this.getMaxTitleWidth();

          // console.log('CCiLabComponentList - updateDimensions: title width '+ titleWidth);

          if( listRect.width <= titleWidth )
            this.componentListWidth = titleWidth;
          else
            this.componentListWidth = listRect.width;

          this.hideListWidth = this.componentListWidth*0.99 +'px';
          this.componentListWidth += 'px';
      }
      // this.setState( {  })
      // console.log("CCiLabComponentList - updateDimensions: used list width: " + this.componentListWidth );
      if( componentList !== "undefined" && isRender === true )
        this.setState( { greetings: componentList } );
    }


    /**
     * called after initial render() is called and element is inserted into DOM
     * Add event listener to show vertical scroll bar if browser window is shorter
     * than component list rect height
     * */
    componentDidMount =()=> {
      console.log("CCiLabComponentList - componentDidMount");
      window.addEventListener("resize", this.onResizeHandler);
      this.initialized = true;
    }

    // need to check following:
    //  1 - if component is the root component, then needs to re-cal all component's requiredQty (#todo)
    //  2 - updated component can't be the same as its own parent ( done )
    //  3 - updated component can't be the same as its siblings ( done )
    //  4 - if the updated component exists - using the same businessLogic id from existing one (done)
    //  5 - check the root component update (done)
    updateComponent =( originComponent, updatedComponent )=>{
      console.log("CCiLabComponentList - updateComponent: inline menu enable - " + updatedComponent.displayLogic.inlineMenuEnabled);

      //making sure updated component isn't the same as its siblings
      // find current parent components of source/moved component, have to use displayLogic.Key that is unique, to search
      let currentSessionComponents = this.state.greetings;
      let parentComponent = currentSessionComponents.find(  (component)=>{
        return component.displayLogic.childKeyIds.length && component.displayLogic.childKeyIds.find( (childKey)=>{return childKey === updatedComponent.displayLogic.key } )
      } );

      if( typeof parentComponent !== 'undefined'  )
      {
        // making sure updated component isn't the same as its own parent
        if( parentComponent.businessLogic.name === updatedComponent.businessLogic.name )
        {
            this.targetComponentName = parentComponent.businessLogic.name;
            this.sourceComponentName = updatedComponent.businessLogic.name;
            updatedComponent.businessLogic.name = originComponent.businessLogic.name;
            this.setState( {isUpdateToItselfWarning: true} );
            // return false so sessionStorage won't be changed inside SetupBom class
            return false;
        }
      }
      else  //root component is updated
      {
        parentComponent = originComponent;
      }

      //find siblings from the parent
      let siblings= currentSessionComponents.filter( (component) =>{
         return typeof parentComponent.displayLogic.childKeyIds.find( childKey => childKey === component.displayLogic.key ) !=='undefined'}
       );

      let sibling = siblings.find( (component)=>{
            return component.businessLogic.name === updatedComponent.businessLogic.name &&
                   component.displayLogic.key !== updatedComponent.displayLogic.key;
       });

      if( typeof sibling !== 'undefined' )
      {
        this.targetComponentName = parentComponent.businessLogic.name;
        this.sourceComponentName = updatedComponent.businessLogic.name;
        updatedComponent.businessLogic.name = originComponent.businessLogic.name;
        this.setState( {isDropToSameParentWarning: true} );

        // return false so sessionStorage won't be changed inside SetupBom class
        return false;
      }

      // update component name
      this.selectedComponentHandler( updatedComponent );
      return true;
    };

    // need to have following features
    // 1 - create a new child component's businessLogic and displayLogic and store them into sessionStorage ( done )
    // 2 - create root component's businessLogic and displayLogic and store them into sessionStorage ( todo )
    addComponent = ( parentComponent ) =>{
      let newComponent={};
      let currentSessionComponents = this.state.greetings;  // greetings is undefined if there no component exists

      if( typeof parentComponent !== 'undefined')
      {
        console.log("CCiLabComponentList - addComponent to: " + parentComponent.businessLogic.name );

        // if parent component's children are hidden, expending all the children first without calling setState to rend the list
        if( parentComponent.displayLogic.canExpend )
        {
          currentSessionComponents = this.showOrHideChildren( parentComponent, true, false);
          parentComponent.displayLogic.canExpend = false;
        }
      }

      //  root component or children
      newComponent.businessLogic = new initializeBusinessLogic(parentComponent);
      let maxBusinessLogicId = findMaxBusinessId(currentSessionComponents);
      newComponent.businessLogic.id = ++maxBusinessLogicId;

      //update businessLogic and displayLogic childIds of parent component
      if( typeof parentComponent !== 'undefined')
      {
        let displayKeyValue = findMaxDisplayKey(currentSessionComponents);
        newComponent.displayLogic = new initializeDisplayLogic( ++displayKeyValue, false, parentComponent.displayLogic.rectLeft );
        parentComponent.businessLogic.childIds.push( newComponent.businessLogic.id );
      }

      //rebuild the component list
      let updatedSessionComponents = [];

      let components =[newComponent];

      //initialize the updated session components
      // save businessLogic to sessionStorage
      // parentComponent and currentSessionComponents is 'undefined' 
      // when a new component created as root component 
      initializeComponents(parentComponent, currentSessionComponents, components, updatedSessionComponents);

      // populate target component's displayLogic.childKeyIds[]
      populateComponentChildKeyIds( typeof parentComponent !== 'undefined' ? parentComponent : newComponent , updatedSessionComponents);

      newComponent.displayLogic.showMyself = true;

      // update selected status so the added component or its parent will be highlighted
      updatedSessionComponents.forEach( (item)=>{
        setComponentSelected( item, newComponent.displayLogic.key );
      });

      sessionStorage.setItem( `${newComponent.businessLogic.name}_${newComponent.displayLogic.key}_displayLogic`, JSON.stringify( newComponent.displayLogic ));

      // need to check vertical scroll bar doesn't show
      // create vertical scroll bar based on the height of component list dynamically
      this.updateDimensions( updatedSessionComponents);
      return newComponent;
    };

    deleteComponent = ( deletedComponent ) =>{
      // console.log("CCiLabComponentList - deleteComponent displayLogic key:" + deletedComponent.displayLogic.key);

      let currentSessionComponents = this.state.greetings;

      let deletedComponentId = deletedComponent.displayLogic.key;

      // find current parent components of deleted component, have to use displayLogic.Key that is unique, to search
      let parentComponents = currentSessionComponents.filter(  (component)=>{
        return component.displayLogic.childKeyIds.length && component.displayLogic.childKeyIds.find( (childKey)=>{return childKey === deletedComponentId } )
      } );

      parentComponents.map( (component)=>{return console.log('parent component name of deleted component: ', component.businessLogic.name) } );

      //remove deleted component id and displayLogicKey from previous parent's businessLogic and displayLogic childId list
      parentComponents.map( (component)=>{
        if( component.businessLogic.childIds.length || component.displayLogic.childKeyIds.length )
        {
            let idxBusinessLogicId = component.businessLogic.childIds.indexOf( deletedComponent.businessLogic.id );
            if( idxBusinessLogicId >= 0 )
              component.businessLogic.childIds.splice( idxBusinessLogicId,1);

            let idxDisplayLogicId = component.displayLogic.childKeyIds.indexOf( deletedComponent.displayLogic.key );
            if( idxDisplayLogicId >= 0 )
              component.displayLogic.childKeyIds.splice( idxDisplayLogicId, 1 );
        }
        return component;
      } );

      const filteredGreetings = currentSessionComponents.filter(component => {
        return component.displayLogic.key !== deletedComponentId;
      });

      sessionStorage.removeItem(`${deletedComponent.businessLogic.name}_${deletedComponent.displayLogic.key}_businessLogic`);
      sessionStorage.removeItem(`${deletedComponent.businessLogic.name}_${deletedComponent.displayLogic.key}_displayLogic`);
      sessionStorage.removeItem(`${deletedComponent.businessLogic.name}_${deletedComponent.displayLogic.key}_bom_core`);
      sessionStorage.removeItem(`${deletedComponent.businessLogic.name}_${deletedComponent.displayLogic.key}_bom_extra`);

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
          else
          {
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
              if( selectedComponent.displayLogic.childKeyIds.includes(item.displayLogic.key) )
              {
                item.displayLogic.showMyself = showStatus;

                // recursively hide childKeyIds[] of child component included in childKeyIds[] of current component,
                // but we don't want to hide child component's childKeyIds[] unless its direct parent's canExpend = false;
                // stored displayLogic to session storage
                hideChildren(item, currentSessionComponents, showStatus);
              }
            }


          });

          // create vertical scroll bar based on the height of component list dynamically
          this.updateDimensions( currentSessionComponents, false);

          if( isRending )
          {
            // console.log("CCiLabComponentList - showOrHideChildren");
            this.setState( { greetings: currentSessionComponents })
          }


          return currentSessionComponents;

    };



    selectedComponentHandler = ( selectedComponent, highlight=true ) =>{
      let currentSessionComponents=this.state.greetings;
      currentSessionComponents.forEach( (item)=>{setComponentSelected(item, selectedComponent.displayLogic.key);});

      if( highlight === true )
      {
        // console.log("CCiLabComponentList - selectedComponentHandler");
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

    // handle component move
    // - update component list
    // - update component status after move by check against the new parent
    // issue - need to keep highlight is component is show or it's parent should be highlight
    //
    moveComponentHandler = ( movedComponentDisplayKey, targetComponent ) =>{
      if( typeof movedComponentDisplayKey !== "undefined" && typeof( movedComponentDisplayKey) === "string" )
      {
        // console.log('moved component key: ', movedComponentDisplayKey);


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

        // console.log('source component name: ', movedComponent.businessLogic.name);
        // console.log('target component name: ', targetComponent.businessLogic.name);

        //component can't drop to its own parent,
        if( targetComponent.displayLogic.childKeyIds.find( (key)=>{ return key === sourceId}) )
        {
          this.targetComponentName = targetComponent.businessLogic.name;
          this.sourceComponentName = movedComponent.businessLogic.name;

          // console.log("CCiLabComponentList - moveComponentHandler 1");

          this.setState( {isDropToSameParentWarning: true} );
          return;
        }

        //same component business id can't be move to itself
        if( targetComponent.businessLogic.id === movedComponent.businessLogic.id )
        {
          this.targetComponentName = targetComponent.businessLogic.name;
          this.sourceComponentName = movedComponent.businessLogic.name;

          // console.log("CCiLabComponentList - moveComponentHandler 2");

          this.setState( {isDropToItselfWarning: true} );
          return;
        }

        // component can't be moved to a parent already has the same component as it's child
        if( targetComponent.businessLogic.childIds.includes( movedComponent.businessLogic.id ) )
        {
          this.targetComponentName = targetComponent.businessLogic.name;
          this.sourceComponentName = movedComponent.businessLogic.name;

          // console.log("CCiLabComponentList - moveComponentHandler 3");
          this.setState( {isDropToSameParentWarning: true} );
          return;
        }

        // if target component's children are hidden, expending all the children first without calling setState to rend the list
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

        //remove moved/source component id and displayLogicKey from previous parent's businessLogic and displayLogic childId list
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

          //rename local storage name to new name
          let bom={}
          bom.core= JSON.parse(sessionStorage.getItem(`${rmMovedComponent[0].businessLogic.name}_${rmMovedComponent[0].displayLogic.key}_bom_core`)) ;
          bom.extra=JSON.parse(sessionStorage.getItem(`${rmMovedComponent[0].businessLogic.name}_${rmMovedComponent[0].displayLogic.key}_bom_extra`));

          sessionStorage.removeItem(`${rmMovedComponent[0].businessLogic.name}_${rmMovedComponent[0].displayLogic.key}_businessLogic`);
          sessionStorage.removeItem(`${rmMovedComponent[0].businessLogic.name}_${rmMovedComponent[0].displayLogic.key}_displayLogic`);
          sessionStorage.removeItem(`${rmMovedComponent[0].businessLogic.name}_${rmMovedComponent[0].displayLogic.key}_bom_core`);
          sessionStorage.removeItem(`${rmMovedComponent[0].businessLogic.name}_${rmMovedComponent[0].displayLogic.key}_bom_extra`);

          //update parent id of moved component (source) as target Component id
          rmMovedComponent[0].businessLogic.parentIds.length=0;
          rmMovedComponent[0].businessLogic.parentIds.push(targetComponent.businessLogic.id);

          //keep inlineMenuEnable status
          let enableInlineMenu = rmMovedComponent[0].displayLogic.inlineMenuEnabled;

          //reset display key and childKeys
          delete rmMovedComponent[0].displayLogic;

          let newDisplayKey = findMaxDisplayKey(currentSessionComponents);

          rmMovedComponent[0].displayLogic = initializeDisplayLogic(++newDisplayKey, false, targetComponent.displayLogic.rectLeft, enableInlineMenu)

          if( bom.core !== null )
            sessionStorage.setItem( `${rmMovedComponent[0].businessLogic.name}_${rmMovedComponent[0].displayLogic.key}_bom_core`, JSON.stringify( bom.core ));
          if( bom.extra !== null )
            sessionStorage.setItem( `${rmMovedComponent[0].businessLogic.name}_${rmMovedComponent[0].displayLogic.key}_bom_extra`, JSON.stringify( bom.extra ))


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
            // store displayLogic to session storage for each item
            setComponentSelected( item, rmMovedComponent[0].displayLogic.key );
          });

          //check if moved component progress status need to change (#todo)

          // update greetings list
          // console.log("CCiLabComponentList - moveComponentHandler 4 ")
          this.setState( { greetings: updatedSessionComponents });
        }

      }
    };

    showSetupBOM=( isShowSetupBOM )=>{
      this.updateDimensions("undefined");  //title-name hasn't changed yet (from progress to setupBOM)
      this.setState({setupBOM: isShowSetupBOM});
    }

    //need to update showMyself to true after button is clicked to canExpend
    //need to update showMyself to false after button is clicked to collapse
    renderGreetings = () => {
      return ((typeof this.state !== "undefined") && (typeof this.state.greetings !== "undefined" )) ?
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
                                          deleteComponent={this.deleteComponent}
                                          addComponent={this.addComponent}
                                          showOrHideChildren={this.showOrHideChildren}
                                          selectedComponentHandler={this.selectedComponentHandler}
                                          moveComponentHandler={this.moveComponentHandler}
                                          updateComponentHandler={this.updateComponent}
                                          isSetupBOM={this.state.setupBOM}
                                          permissionStatus={this.state.permissionEnabled}/> ;
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

    hideUpdateToItselfWarning=()=>{
      this.setState({isUpdateToItselfWarning: false});
    }

    render() {
      if( this.initialized === false )
        return null;

      const DropToSameParentWarningModal = this.state.isDropToSameParentWarning ?
                  <DropComponentWarningModal
                  title='title'
                  key1='same-child'
                  option = { `{"targetComponent": "${this.targetComponentName}", "movedComponent": "${this.sourceComponentName}"}`}
                  hideDropWarning={this.hideDropToSameParentWarning}/>
                  : null;

      const DropToItselfWarningModal = this.state.isDropToItselfWarning ?
                  <DropComponentWarningModal
                    title={'title'}
                    key1='same-component'
                    option = { `{ "targetComponent": "${this.targetComponentName}"}`}
                    hideDropWarning={this.hideDropToItselfWarning}/>
                  : null;

      const UpdateToItselfWarningModal = this.state.isUpdateToItselfWarning ?
                  <DropComponentWarningModal
                    title={'title'}
                    key1='parent-child-is-same'
                    option = { `{ "targetComponent": "${this.targetComponentName}"}`}
                    hideDropWarning={this.hideUpdateToItselfWarning}/>
                  : null;

      let listTitleClassName='border-0 text-primary text-nowrap';

      // console.log( "CCiLabComponentList - call render() ");
      return (
        <div className={`d-flex align-items-center`} >
          {/* <AddGreeter addGreeting={this.addGreeting} /> */}
            {/* https://code.i-harness.com/en/q/27a5171 explains why vertical scroll bar won't appear for flex box
                and what is the workaroud. iphone4s and lower isn't supported
                UC browser and Edge pro to 15 (https://caniuse.com/#feat=css-sticky) doesn't suppot onScroll={this.updateDimensions}*/}
              <div id='cciLabComponentListID'
                  className={`cci-component-list_transition`}
                  style={{'transform': `${this.componentListTranslateStyle}`,
                          'WebkitTransform':`${this.componentListTranslateStyle}`,
                          'height':`${this.componentListHeight}`,
                          'width':`${this.componentListWidth}`}}
                  >

                  { this.state.setupBOM ?
                                <ComponentListTitle title='title-BOM'
                                      titleHeight={this.componentTitleHeight}
                                      titleWidth={this.componentListWidth}
                                      titlePositionLeft= {this.componentTitleLeft}
                                      titleClassName = {listTitleClassName}
                                      setupBOM = {this.state.setupBOM}
                                      permissionStatus = {this.state.permissionEnabled}
                                      changeBOMHandler = {this.showSetupBOM}
                                      titleWidthChangeHandler = {this.updateDimensions}/> :
                                <ComponentListTitle title='title-Progress'
                                      titleHeight={this.componentTitleHeight}
                                      titleWidth={this.componentListWidth}
                                      titlePositionLeft= {this.componentTitleLeft}
                                      titleClassName = {listTitleClassName}
                                      setupBOM = {this.state.setupBOM}
                                      permissionStatus = {this.state.permissionEnabled}
                                      changeBOMHandler = {this.showSetupBOM}
                                      titleWidthChangeHandler = {this.updateDimensions}/>
                  }
                  <hr className='my-0 bg-info' style={{borderStyle:'groove', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

                  {/*  sticky to top and left, https://gedd.ski/post/position-sticky/*/}
                  {/* https://iamsteve.me/blog/entry/using-flexbox-for-horizontal-scrolling-navigation
                      https://codepen.io/stevemckinney/pen/WvWrRX */}
                  {/* https://sevenspark.com/diagnosis/z-index-submenu-hidden-behind-content popup menu chip behind d-flex row*/}

                  { this.state.setupBOM ?
                      <ComponentListSubTitle
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
                style={{'transform': `${this.componentListTranslateStyle}`,
                        'WebkitTransform':`${this.componentListTranslateStyle}`}}
                onClick={this.showHideComponentList} >
                <span className={`badge-pill badge-info ${this.slidingComponentListIconClassName}`}></span>
              </a>
            {DropToSameParentWarningModal }
            {DropToItselfWarningModal }
            {UpdateToItselfWarningModal}
        </div>
      );
    };
}

export default CCiLabComponentList;
