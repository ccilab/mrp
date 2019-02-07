
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

const setListHeight = (rect) => {
  return window.innerHeight <= 200 ? '150px' : isElementInViewportHeight( rect ) ? 'auto':'90vh';
}

const setListWidth = () =>{
  return window.innerWidth <= 330 ? '90' : window.innerWidth <= 600 ? '70' : window.innerWidth <= 800 ? '50' : window.innerWidth <= 1000 ? '40' : window.innerWidth <= 1500 ? '30':'15';
}

const setHideListWidth = () =>{
  return window.innerWidth <= 330 ? '40' : window.innerWidth <= 600 ? '70' : window.innerWidth <= 800 ? '50' : window.innerWidth <= 1000 ? '40' : window.innerWidth <= 1500 ? '30':'15';
}

//http://jsfiddle.net/ChristianL/AVyND/
//  const detectBrowserMajorVersion = () =>{
//   let browser = navigator.appName;
//   let majorVersion = parseInt(navigator.appVersion, 10);
//   return {'browser': browser, 'version': majorVersion};
// }

const detectOSVersion = () =>{
    var unknown = '-';

    // screen
    var screenSize = '';
    if (window.screen.width) {
        let width = (window.screen.width) ? window.window.screen.width : '';
        let height = (window.screen.height) ? window.screen.height : '';
        screenSize += '' + width + " x " + height;
    }

    // browser
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browser = navigator.appName;
    var version = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // Opera
    if ((verOffset = nAgt.indexOf('Opera')) !== -1) {
        browser = 'Opera';
        version = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf('Version')) !== -1) {
            version = nAgt.substring(verOffset + 8);
        }
    }
    // Opera Next
    if ((verOffset = nAgt.indexOf('OPR')) !== -1) {
        browser = 'Opera';
        version = nAgt.substring(verOffset + 4);
    }
    // Edge
    else if ((verOffset = nAgt.indexOf('Edge')) !== -1) {
        browser = 'Microsoft Edge';
        version = nAgt.substring(verOffset + 5);
    }
    // MSIE
    else if ((verOffset = nAgt.indexOf('MSIE')) !== -1) {
        browser = 'Microsoft Internet Explorer';
        version = nAgt.substring(verOffset + 5);
    }
    // Chrome
    else if ((verOffset = nAgt.indexOf('Chrome')) !== -1) {
        browser = 'Chrome';
        version = nAgt.substring(verOffset + 7);
    }
    // Safari
    else if ((verOffset = nAgt.indexOf('Safari')) !== -1) {
        browser = 'Safari';
        version = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf('Version')) !== -1) {
            version = nAgt.substring(verOffset + 8);
        }
    }
    // Firefox
    else if ((verOffset = nAgt.indexOf('Firefox')) !== -1) {
        browser = 'Firefox';
        version = nAgt.substring(verOffset + 8);
    }
    // MSIE 11+
    else if (nAgt.indexOf('Trident/') !== -1) {
        browser = 'Microsoft Internet Explorer';
        version = nAgt.substring(nAgt.indexOf('rv:') + 3);
    }
    // Other browsers
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
        browser = nAgt.substring(nameOffset, verOffset);
        version = nAgt.substring(verOffset + 1);
        if (browser.toLowerCase() === browser.toUpperCase()) {
            browser = navigator.appName;
        }
    }
    // trim the version string
    if ((ix = version.indexOf(';')) !== -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(' ')) !== -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(')')) !== -1) version = version.substring(0, ix);

    majorVersion = parseInt('' + version, 10);
    if (isNaN(majorVersion)) {
        version = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }

    // mobile version
    var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

    // cookie
    var cookieEnabled = (navigator.cookieEnabled) ? true : false;

    if (typeof navigator.cookieEnabled === 'undefined' && !cookieEnabled) {
        document.cookie = 'testcookie';
        cookieEnabled = (document.cookie.indexOf('testcookie') !== -1) ? true : false;
    }

    // system
    var os = unknown;
    var clientStrings = [
        {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
        {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
        {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
        {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
        {s:'Windows Vista', r:/Windows NT 6.0/},
        {s:'Windows Server 2003', r:/Windows NT 5.2/},
        {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
        {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
        {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
        {s:'Windows 98', r:/(Windows 98|Win98)/},
        {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
        {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
        {s:'Windows CE', r:/Windows CE/},
        {s:'Windows 3.11', r:/Win16/},
        {s:'Android', r:/Android/},
        {s:'Open BSD', r:/OpenBSD/},
        {s:'Sun OS', r:/SunOS/},
        {s:'Linux', r:/(Linux|X11)/},
        {s:'iOS', r:/(iPhone|iPad|iPod)/},
        {s:'Mac OS X', r:/Mac OS X/},
        {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
        {s:'QNX', r:/QNX/},
        {s:'UNIX', r:/UNIX/},
        {s:'BeOS', r:/BeOS/},
        {s:'OS/2', r:/OS\/2/},
        {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
    ];
    for (var id in clientStrings) {
        var cs = clientStrings[id];
        if (cs.r.test(nAgt)) {
            os = cs.s;
            break;
        }
    }

    var osVersion = unknown;

    if (/Windows/.test(os)) {
        osVersion = /Windows (.*)/.exec(os)[1];
        os = 'Windows';
    }

    switch (os) {
        case 'Mac OS X':
            osVersion = /Mac OS X (10[\\.\\_\\d]+)/.exec(nAgt)[1];
            break;

        case 'Android':
            osVersion = /Android ([\\.\\_\\d]+)/.exec(nAgt)[1];
            break;

        case 'iOS':
            osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
            osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
            break;
        default:
        break;
    }
    let jscd = {
      screen: screenSize,
      browser: browser,
      browserVersion: version,
      browserMajorVersion: majorVersion,
      mobile: mobile,
      os: os,
      osVersion: osVersion,
      cookies: cookieEnabled
    };
    return jscd;
}

class CCiLabComponentList extends Component {
    state = { greetings: undefined, visible: true };

    slidingComponentListIconClassName = this.state.visible? 'fa fa-angle-double-left' : 'fa fa-angle-double-right';
    componentListHeight= window.innerHeight <= 200 ? '150px' : 'auto';  //minimum height 
    componentListWidth= setListWidth();
      
    compnentListTranslateStyle='';
    
    toggleHideShowComponentList = () =>{
      console.log('container: clicked before: - ', this.state.visible ? 'true' : 'false' );
      this.setState( { visible: this.state.visible ? false : true } );

      let hideListWidth = setHideListWidth()*.99;

      this.compnentListTranslateStyle = this.state.visible ? 'translate3d(0vw, 0, 0)': `translate3d(-${hideListWidth}vw, 0, 0)`;

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
            if( currentSessionComponents[idxComponent].displayLogic.key === selectedComponent.displayLogic.key )
              currentSessionComponents[idxComponent].displayLogic.selected = 1; //can be +1 or -1
            else
              currentSessionComponents[idxComponent].displayLogic.selected = 0;
 
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
        if( currentSessionComponents[idxComponent].displayLogic.key === selectedComponent.displayLogic.key )
          currentSessionComponents[idxComponent].displayLogic.selected = 1; //can be +1 or -1
        else
          currentSessionComponents[idxComponent].displayLogic.selected = 0;
      }
      this.setState( { greetings: currentSessionComponents });
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
                 UC browser, pro to Edge 15 (https://caniuse.com/#feat=css-sticky) doesn't suppot sticky-top onScroll={this.updateDimensions}*/} 
              <div id='cciLabComponentListID' className={`d-flex flex-column flyout-component-list elemnt-transition`} 
                  style={{'transform': `${this.compnentListTranslateStyle}`, 'height':`${this.componentListHeight}`, 'width':`${this.componentListWidth}vw`}}>
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
