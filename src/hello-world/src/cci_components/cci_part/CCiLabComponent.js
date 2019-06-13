import React, { Component } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';
import {SetupBOM} from './CCiLabSetupComponentBOM';
import {UpdateStatus} from './CCiLabUpdateComponentStatus.js'
import {saveAs, creatHiddenImgInputTag} from "../file_save/CCiLabLocalFileAccess"


import styles from './../../dist/css/ccilab-component.css'
import './../../dist/css/popup-menu.css'


const ShowImage=(props)=>{
  const { t } = useTranslation('commands', {useSuspense: false});

  const addImage=(props)=>(e)=>{
    creatHiddenImgInputTag(e, props);
  };

  return (
    //  {/* no style for top element so the button can host the image, other elements need style to set image position  */}
    <span>
     { ( props.isSetupBOM === true ) ? 
        <span>
          { (typeof props.name !== 'undefined' && props.name.length !== 0 ) ? 
            <img id={`${props.displayLogickey}`} 
            className={`${props.className} cci-component__img rounded-circle align-self-center`} src={props.name} alt={`${t('upload-image')}`}
            style={{'height': `${props.height}rem`, 'width': `${props.width}rem`, 'cursor':'pointer'}} 
            draggable={`${props.isDraggable}`}
            onDragStart={ props.isDraggable === 'true' ? props.dragStartHandler : null}
            onDragOver={ props.dragOverHandler }
            onDrop={  props.doDropHander }
            onClick={addImage(props)}/>
            :
            <Popup 
              trigger={
                <i id={`${props.displayLogickey}`} 
                  type="icon"
                  className={`${props.className} text-primary fa fa-plus-circle`} 
                  style={{'cursor':'pointer'}} 
                  draggable={`${props.isDraggable}`}
                  onDragStart={ props.isDraggable === 'true' ? props.dragStartHandler : null}
                  onDragOver={ props.dragOverHandler }
                  onDrop={  props.doDropHander }
                  onClick={addImage(props)}/>
              }
              closeOnDocumentClick
              on="hover"
              mouseLeaveDelay={100}
              mouseEnterDelay={0}
              arrow={true}
              arrowStyle={{backgroundColor: `${styles.cciBgColor}`}}
              contentStyle={{ padding: '0px', border: 'none', backgroundColor: `${styles.cciBgColor}`, fontSize:'0.8em' } }>
              <span className={'text-info'} >{t('upload-image')}</span>
            </Popup>
          }
        </span>
      :
      <span>
       { (typeof props.name !== 'undefined' && props.name.length !== 0 ) ? 
        // {/* tag's id used to handle drop event float-left*/}
        // className: 'cci-component__img rounded-circle align-self-center  cursor-default or move'
        <img id={`${props.displayLogickey}`} 
             className={`${props.className} cci-component__img rounded-circle align-self-center`} src={props.name} alt={`${t('upload-image')}`}
             style={{'height': `${props.height}rem`, 'width': `${props.width}rem`, 'cursor':'pointer'}} 
        />
        // need to replace with + icon single "fa fa-stop", group "fa fa-th-large"
        :
        null
       }
       </span>
     }  
    </span>
  );
}

// only single component can have add, delete and move menu
// parent component only can add component
const InLineMenu=(props)=>{
  const { t } = useTranslation('commands', {useSuspense: false});
  return (
    <div className={'d-flex cursor-pointer bg-info bg-faded align-items-center'}> 
      {/* copy is not supported for now */}
      {/* { ( draggableSetting === 'true') ? <a href='#copy' className={'align-self-center nav-link px-1 fa fa-copy '}/> :null} */}
      { ( props.isDraggable === 'true') ? 
        <a id={`${props.displayLogickey}`}
          href={`#${t('move')}`}
          className={'align-self-center nav-link px-1 fa fa-arrows-alt'}
          onClick={ props.moveStartHandler }/> 
          :
          null
      }
      <a href={`#${t('add')}`} 
        className={'align-self-center nav-link px-1 m-0 py-0 fa fa-plus'}
        onClick={ props.addComponentHandler}
        />
      { ( props.isDraggable === 'true') ? 
          <a id={`${props.key}`}
            href={`#${t('delete')}`} 
            className={'align-self-center nav-link px-1 fa fa-trash-alt'}
            onClick={props.deleteCompnentHandler}/>
          :
          null
      }
    </div> 
  );
}

const ComponentName=(props)=>{
  const { t } = useTranslation('commands', {useSuspense: false});
  let componentName = props.componentName;

  if( props.componentName === 'add-part')
    componentName = t('add-part');


  return (
    <a  id={`${props.displayLogickey}`} 
        href={`#${t('select-component')}`} 
        className={`${props.className}`} 
        style={{ 'height': `auto` }} 
        draggable={`${props.isDraggable}`}
        onClick={ props.componentSelectedHandler }
        onDragStart={ props.dragStartHandler }
        onDragOver={ props.dragOverHandler }
        onDrop={ props.doDropHandler }>
        {`${componentName}`}
    </a>
  );
}


class CCiLabComponent extends Component {
        state = {
            expended:  true,
            updateImg: false,
        };

    
    static inlineMenu ={ cmd: 'select',
                         itemId: 'undefined'};

    currentComponent;
    rootFontSize;
    parents;
    children;
    componentName;

    imgName;
    
    componentLableHeight;
    componentLableWidth;
    inlineMenuHeight;
    inlineMenuWidth;

    progressStatus;
    progressValue;

    leftOffset;

    permissionEabled = this.props.permissionStatus; // #todo: need to add check later

    init=(props)=>{
      this.currentComponent = props.component;
      this.rootFontSize=props.fontSize;
      this.parents = this.currentComponent.businessLogic.parentIds;
      this.children = this.currentComponent.businessLogic.childIds;
      this.componentName = this.currentComponent.businessLogic.name;

      this.imgName = (this.currentComponent.businessLogic.imgFile.length !==0 ) ? '/images/'+ this.currentComponent.businessLogic.imgFile : '';
        
        // size of component button, rem - 16px is default font size of browser
      this.componentLableHeight =  (this.parents.length === 0 ) ? 45/this.rootFontSize : (this.children.length !==0) ? 25/this.rootFontSize: 25/this.rootFontSize;
      this.componentLableWidth = this.componentLableHeight;
      this.inlineMenuHeight = 25/this.rootFontSize;
      this.inlineMenuWidth = 25/this.rootFontSize;

      this.progressStatus = this.currentComponent.businessLogic.status;
      this.progressValue = this.currentComponent.businessLogic.progressPercent;

      this.leftOffset =props.leftOffset  + ( (this.parents.length === 0 ) ? 0: this.componentLableWidth/2 );
    }
      
    positioningComponentInfo=( )=>{
      
      this.leftOffset=this.props.leftOffset  + ( (this.parents.length === 0 ) ? 0: this.componentLableWidth/2 );
    // this.inlineMenuIconLeft = this.leftOffset;
    //   this.expendableIconLeft = this.inlineMenuIconLeft + this.componentLableWidth/2;
    //   this.btnImgLeft = this.expendableIconLeft +  5/this.rootFontSize; //rem - to the right of ancher
    //   this.nameLableLeft = this.btnImgLeft/2 + 5/this.rootFontSize; // position si relative to img button in rem
    //   this.statusLabelLeft = getTextRect(this.componentName+':').width/this.rootFontSize;//this.nameLableLeft + getTextRect(this.componentName+':').width/this.rootFontSize + 3.5; // in rem, compnesate padding left for  ~ 4rem
    }

    // life cycle function only calls once when class is created
    componentWillMount=()=>{
      this.setState({expended: this.props.component.displayLogic.canExpend});
    }

    componentDidMount =()=> {
      let componentRect = document.getElementById( `${this.currentComponent.displayLogic.key}-item` ).getBoundingClientRect();  

      this.currentComponent.displayLogic.rectLeft = componentRect.left/this.rootFontSize;  //convert to rem, 16px is default font size for browser
    };

    expending = () => {
        if (this.state.expended === true) {
          this.currentComponent.displayLogic.canExpend = false;
          this.setState({ expended: false });
          this.showOrHideChildren(true);
        }
        else {
          this.currentComponent.displayLogic.canExpend = true;
          this.setState({ expended: true });
          this.showOrHideChildren(false);
        }
    };

    componentSelected = () =>{
      switch( CCiLabComponent.inlineMenu.cmd )
      {
        case 'select':
          this.props.selectedComponentHandler(this.currentComponent);
        break;
        case 'move':
          this.moveEnd();
        break;
        case 'edit':
        default:
          console.log('inline Menu cmd is not supported yet: ' + CCiLabComponent.inlineMenu.cmd)
          break;
      }
    }

    deleteCompoent = () => {
        this.props.deleteCompoent(this.currentComponent);
        CCiLabComponent.inlineMenu.itemId='undefined';
        CCiLabComponent.inlineMenu.cmd = 'select';
    };

    addComponent = () =>{
      this.props.addComponent(this.currentComponent);
      CCiLabComponent.inlineMenu.itemId='undefined';
      CCiLabComponent.inlineMenu.cmd = 'select';
    }
    showOrHideChildren = (isShow) =>{
      this.props.showOrHideChildren(this.currentComponent, isShow)
    }

    moveStart=(e)=>{
      let movededComponetId=e.target.id;
      if (Number.isInteger(parseInt(movededComponetId, 10) ) )
      {
        CCiLabComponent.inlineMenu.cmd = 'move';
        CCiLabComponent.inlineMenu.itemId = movededComponetId;
        console.log('move select component id: ', CCiLabComponent.inlineMenu.itemId );  
      }
    }
    moveEnd=()=>{
      if( typeof CCiLabComponent.inlineMenu.itemId !== 'undefined')
      {  
        if (Number.isInteger(parseInt(CCiLabComponent.inlineMenu.itemId, 10) ) )
        {        
          console.log('moved from source: ', CCiLabComponent.inlineMenu.itemId);
          this.props.moveComponentHandler(CCiLabComponent.inlineMenu.itemId, this.currentComponent);
          CCiLabComponent.inlineMenu.itemId='undefined';
          CCiLabComponent.inlineMenu.cmd = 'select';
        }
      }
     }

    dragStart=(e) => {
      let draggedComponetId=e.target.id;
      if( draggedComponetId.includes( '-item' ) )
        draggedComponetId=draggedComponetId.replace(/-item/g,'');
      
      if( draggedComponetId.includes( '-show-hide' ) )
        draggedComponetId=draggedComponetId.replace(/-show-hide/g,'');

      if (Number.isInteger(parseInt(draggedComponetId, 10) ) )
      {
        e.dataTransfer.setData('Text', draggedComponetId);
        e.effectAllowed='copyMove';
        console.log('drag select span id: ', draggedComponetId );    
      }
      else 
      {
          e.preventDefault();
          console.log('not onDragStart event span id: ', e.target.id );    
      }
    }  

    dragOver=(e) =>{
      e.preventDefault();
      // e.dropEffect='copyMove';
      let draggedComponetId=e.target.id;
      if( draggedComponetId.includes( '-item' ) )
        draggedComponetId=draggedComponetId.replace(/-item/g,'');

      if( draggedComponetId.includes( '-show-hide' ) )
        draggedComponetId=draggedComponetId.replace(/-show-hide/g,'');

      if ( Number.isInteger( parseInt(draggedComponetId, 10) ) )
        console.log('drag over: ', draggedComponetId);
    
    }

    doDrop=(e)=>{
      e.preventDefault();

      let draggedComponetId=e.target.id;
      if( draggedComponetId.includes( '-item' ) )
        draggedComponetId=draggedComponetId.replace(/-item/g,'');

      if( draggedComponetId.includes( '-show-hide' ) )
        draggedComponetId=draggedComponetId.replace(/-show-hide/g,'');
        
      if ( Number.isInteger( parseInt(draggedComponetId, 10) ) )
      {
          var sourceId = e.dataTransfer.getData('Text');
          this.props.moveComponentHandler(sourceId, this.currentComponent);
      }

      console.log('droped from source: ', sourceId);
    };

    updateImage=()=>{ 
      this.setState({updateImg:true});
    };
    
    render=()=>{
        this.init(this.props);

        // console.log('CCiLabComponent::render() imgFile: ', this.imgName);
        let componentBase='d-flex cci-component-lable_position  align-items-center '; //align-items-center 
        let inlineMenuClassName ='btn rounded-circle align-self-center p-0 bg-primary ';
        let imamgeClassName = ' '; 
        let expendCollapseBadgeIconClassNameBase ='align-self-center nav-link p-0  '; // component-label_sticky_horizontal
        let expendCollapseBadgeIconClassName= 'fa fa-angle-right';
        let componentNameClassName = 'lead align-self-center font-weight-normal text-primary text-truncate nav-link px-2 ';//component-label_sticky_horizontal

        // .align-self-center to make fa and badge height the same as font height
        let statusBadgetIconClassNameBase = 'align-self-center text-nowrap ml-0 px-1 '; //component-label_sticky_horizontal 
        let statusBadgeIconClassName = statusBadgetIconClassNameBase + (this.progressStatus === 'info' ? 'fa ':
            this.progressStatus === 'success' ? 'fa fa-check-circle' :
            this.progressStatus === 'warning' ? 'fa fa-exclamation-circle' : 'fa fa-exclamation-triangle');
  
        let  Component=' ';
        let draggableSetting = false;
        let  stickyWidth =  this.currentComponent.displayLogic.selected !== 0 ? `${this.props.listWidth}`:'auto';

        let componentStyle = {'width': `${stickyWidth}`, 'left': `0rem`} //z-index=0 so it's not block language dropdown list

        // very top component or component has children can't be moved 
        if ( this.parents.length === 0 || this.children.length !== 0 || this.props.isSetupBOM === false) 
        {
          draggableSetting= false;
          // Component = ( this.currentComponent.displayLogic.selected !== 0 ) ? 'bg-info component_opacity ccilab-component-sticky-top' :' ';  
          Component = ( this.currentComponent.displayLogic.selected !== 0 ) ? 'bg-info component_opacity ccilab-component-sticky-top' :' ';  

          if( this.currentComponent.displayLogic.selected )
          {
            componentBase +=  ' cursor-default';
            imamgeClassName += ' cursor-default';
            componentNameClassName += ' cursor-default';
            statusBadgeIconClassName += ' cursor-default';
          }
        }
        else
        { 
            // draggable for elements bellow the very top one, if use has the permission (#todo need to implement the check)inline-menu_sticky_horizontal inline-menu_sticky_horizontal inline-menu_sticky_horizontal
            Component =  this.currentComponent.displayLogic.selected > 0 ? 'bg-info component_opacity ccilab-component-sticky-top ' + (this.permissionEabled? ' move':' ' ):
                       this.currentComponent.displayLogic.selected < 0 ? 'bg-info component_opacity ccilab-component-sticky-bottom ' + (this.permissionEabled? ' move':' ' ):' ';

            draggableSetting = ( this.permissionEabled && this.currentComponent.displayLogic.selected !== 0 &&  this.parents.length !== 0 )? 'true':'false';

            if( this.currentComponent.displayLogic.selected !== 0 )
            {
              componentBase +=  (this.permissionEabled && this.currentComponent.displayLogic.selected !== 0 && this.props.isSetupBOM )? ' move':' cursor-default';
              imamgeClassName += (this.permissionEabled && this.currentComponent.displayLogic.selected !== 0 )? ' move':' cursor-pointer';
              componentNameClassName += (this.permissionEabled && this.currentComponent.displayLogic.selected !== 0 )? ' move':' cursor-default';
              statusBadgeIconClassName += (this.permissionEabled && this.currentComponent.displayLogic.selected !== 0 )? ' move':' cursor-default';
            }
        }

        if( this.state.expended === false || this.currentComponent.displayLogic.canExpend === false ) 
        {
          if( this.children.length !== 0  )
            expendCollapseBadgeIconClassName= 'fa fa-angle-down';
        }
        
        let expendableIconStyle =  {'display':'inline','left': `${this.expendableIconLeft}rem`, 'visibility': ( `${this.children.length}` !== '0'  ) ? 'visible' : 'hidden'}

        let inlineMenuIconVisiblity =  ( this.currentComponent.displayLogic.selected !== 0 ) ? 'visible' : 'hidden';

        let inlineMenuPosition = (this.parents.length === 0)? 'bottom left' : 'top left';

        // this.componentName = this.props.component.businessLogic.name;
        console.log("CCiLabComponent: - render() - component name: "+this.componentName);
        

        return (
          // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
          // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#dragstart
          // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem#Browser_compatibility
          // https://www.kirupa.com/html5/drag.htm touch 
          // https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/ontouchstart
            // {/* shift the child components to the right */}  
            // {/* tag's id is used to handle drop event*/}
            <div id={`${this.currentComponent.displayLogic.key}`} 
                // 'bg-info component_opacity ccilab-component-sticky-top ' 
                className={`${Component}`} 
                style={componentStyle}
                draggable={`${draggableSetting}`}
                onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                onDragOver={ this.dragOver }
                onDrop={  this.doDrop }>
                {/* onDragOver={ this.dragOver }
                onDrop={  this.doDrop }> */}
                {/* 'd-flex cci-component-lable_position  align-items-center ' */}
              <div className={`${componentBase}`} style={{'left':`${this.leftOffset}rem`}}>
                {/* a badge to show menu to move/copy/delete/edit component, only sole children component has move and copy option */}
                {/* https://github.com/yjose/reactjs-popup/blob/master/docs/src/examples/Demo.js */}
                { this.props.isSetupBOM ? 
                <Popup 
                    trigger={
                      <button 
                        type="button"
                        // 'btn rounded-circle align-self-center p-0 bg-primary '
                        className={`${inlineMenuClassName} cursor-pointer fa fa-ellipsis-h`}
                        style={ {'visibility': `${inlineMenuIconVisiblity}`, 
                                  'height': `${this.inlineMenuHeight}rem`, 
                                  'width': `${this.inlineMenuWidth}rem`,
                                  fontSize:  `${this.inlineMenuWidth*0.8}rem`}}
                        > 
                      </button>
                    }
                    id={`${this.currentComponent.displayLogic.key}-inline-menu`}
                    position={`${inlineMenuPosition}`}
                    closeOnDocumentClick
                    on="hover"
                    mouseLeaveDelay={300}
                    mouseEnterDelay={0}
  						      contentStyle={{ padding: '0px', border: 'none' }}
                    >
                    <InLineMenu  displayLogickey={this.currentComponent.displayLogic.key}
                                 isDraggable={draggableSetting}
                                 moveStartHandler={ this.moveStart }
                                 deleteCompnentHandler={ this.deleteCompoent }
                                 addComponentHandler={this.addComponent}
                    />
                </Popup> : null}
                 
                 {/* show collapse icon 'v' for all expendable components,
                  show expendable icon '>' for those components have children except the top component
                */}
                {/* tag's id used to handle drop event */}
                <a  id={`${this.currentComponent.displayLogic.key}-show-hide`} 
                    href='#expend-collapse-badge' 
                    // 'align-self-center nav-link p-0  ' + 'fa fa-angle-right'
                    className={`${expendCollapseBadgeIconClassNameBase} ${expendCollapseBadgeIconClassName} pl-2`} 
                    style={expendableIconStyle} 
                    draggable={`${draggableSetting}`}
                    onClick={ this.expending }
                    onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                    onDragOver={ this.dragOver }
                    onDrop={  this.doDrop }>
                </a>

                {/* tag's id is used to get component's rect and handle drop event */}
                  <span id={`${this.currentComponent.displayLogic.key}-item`} 
                  className={imamgeClassName} 
                  draggable={`${draggableSetting}`}
                  onClick={ this.componentSelected } 
                  onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                  onDragOver={ this.dragOver }
                  onDrop={  this.doDrop }>
                  <ShowImage 
                    displayLogickey={this.currentComponent.displayLogic.key}
                    name={this.imgName} //this.imgName
                    component={this.currentComponent}
                    className={imamgeClassName}
                    height={this.componentLableHeight}
                    width={this.componentLableWidth}
                    isDraggable={draggableSetting}
                    isSetupBOM={this.props.isSetupBOM}
                    dragStartHandler={this.dragStart}
                    dragOverHandler={this.dragOver}
                    doDropHander={this.doDrop }
                    addImageHandler={this.updateImage}
                  />
                </span>
                {/* tag's id is used to handle drop event */}
                <ComponentName  
                    displayLogickey={`${this.currentComponent.displayLogic.key}`} 
                    className={`${componentNameClassName}`} 
                    isDraggable={`${draggableSetting}`}
                    componentSelectedHandler={ this.componentSelected }
                    dragStartHandler={ draggableSetting === 'true' ? this.dragStart : null}
                    dragOverHandler={ this.props.isSetupBOM ? this.dragOver :null }
                    doDropHandler={ this.props.isSetupBOM ? this.doDrop : null }
                    componentName={this.componentName}
                />
                
                {/* tag's id is used to handle drop event */}
                { this.props.isSetupBOM === false ? 
                    <UpdateStatus
                      component={this.currentComponent}
                      updateComponent={this.props.updateComponentHandler}
                      permissionStatus={this.permissionEabled}
                      statusClassName={`badge-pill badge-${this.progressStatus} ${statusBadgeIconClassName}`} 
                      onClickHandler={ this.componentSelected }
                      progress={this.progressValue}
                      remainingTime= {this.currentComponent.businessLogic.remainDays}
                    />
                  :
                  <SetupBOM
                    component={this.currentComponent}
                    updateComponent={this.props.updateComponentHandler}
                  />
                }
                </div>
            </div>
        )
      }
}

export default CCiLabComponent;
