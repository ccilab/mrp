import React, { Component } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import {UpdateStatus} from './CCiLabUpdateComponentStatus.js';
import {creatHiddenImgInputTag} from "../file_save/CCiLabLocalFileAccess";
// import { tables } from "./CCiLabUtility";


import styles from './../../dist/css/ccilab-component.css';
// import './../../dist/css/popup-menu.css';
import {SetupBOM} from './CCiLabSetupComponentBOM';
import {SetupPDP } from './CCiLabSetupPDP';
import {SetupIRF} from './CCiLabSetupIR';
import {SetupOP} from './CCiLabSetupOperation';


const ShowImage=(props)=>{
  const { t } = useTranslation('commands', {useSuspense: false});

  const addImage=(props)=>(e)=>{
    creatHiddenImgInputTag(e, props);
  };

  return (
    //  {/* no style for top element so the button can host the image, other elements need style to set image position fa fa-plus-circle */}
    <span>
     { ( props.isSetupBOM === true ) ?
        <span>
          { (typeof props.name !== 'undefined' && props.name.length !== 0 ) ?
            <img id={`${props.displayLogicKey}`}
            className={`${props.className} cci-component__img rounded-circle align-self-center`} src={props.name} alt={`${t('upload-image')}`}
            style={{'height': `${props.height}rem`, 'width': `${props.width}rem`, 'cursor':'pointer'}}
            draggable={`${props.isDraggable}`}
            onDragStart={ props.isDraggable === 'true' ? props.dragStartHandler : null}
            onDragOver={ props.dragOverHandler }
            onDrop={  props.doDropHandler }
            onClick={addImage(props)}/>
            :
            <Popup
              trigger={
                <i id={`${props.displayLogicKey}`}
                  type="icon"
                  className={`${props.className} text-primary fa fa-image`}
                  style={{'cursor':'pointer'}}
                  draggable={`${props.isDraggable}`}
                  onDragStart={ props.isDraggable === 'true' ? props.dragStartHandler : null}
                  onDragOver={ props.dragOverHandler }
                  onDrop={  props.doDropHandler }
                  onClick={addImage(props)}/>
              }
              closeOnDocumentClick
              position='bottom left'
              on="hover"
              mouseLeaveDelay={0}
              mouseEnterDelay={0}
              arrow={true}
              arrowStyle={{backgroundColor: `${styles.cciBgColor}`}}
              contentStyle={{ padding: '0px', border: 'none', backgroundColor: `${styles.cciBgColor}` } }>
              <span className={'text-primary'} >{t('upload-image')}</span>
            </Popup>
          }
        </span>
      :
      <span>
       { (typeof props.name !== 'undefined' && props.name.length !== 0 ) ?
        // {/* tag's id used to handle drop event float-left*/}
        // className: 'cci-component__img rounded-circle align-self-center  cursor-default or move'
        <img id={`${props.displayLogicKey}`}
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

const MenuAddComponent=(props)=>{
    const { t } = useTranslation('commands', {useSuspense: false});
    const plusCircleClassName = ((props.component.displayLogic.inlineMenuEnabled ) ? 'text-primary' : 'text-danger') + ' cursor-pointer p-1 fw fa fa-plus-circle';
    return (
      <Popup
        trigger={
          <i
          type='icon'
          className={ plusCircleClassName  }
          style={{'visibility': `${props.visibility}`}}
          onClick={ props.component.displayLogic.inlineMenuEnabled ? props.addComponentHandler : props.selectedComponentHandler }/>
        }
        id={`${props.component.displayLogic.key}-add`}
        position={'bottom left'}
        closeOnDocumentClick
        on={"hover"}
        mouseLeaveDelay={0}
        mouseEnterDelay={0}
        arrow={true}
        arrowStyle={{backgroundColor: `${styles.cciBgColor}`}}
        contentStyle={{ padding: '0px', border: 'none', backgroundColor: `${styles.cciBgColor}`}}
      >
      { ( !props.component.displayLogic.inlineMenuEnabled)?
        <SetupBOMUncompleted />
        :
        <span className={'text-primary'} >{t('commands:add')}</span>
      }

    </Popup>
    );
};

const MenuDeleteComponent=(props)=>{
  const { t } = useTranslation('commands', {useSuspense: false});
  return (
    <Popup
        trigger={
          <i
          type='icon'
          className={'text-primary cursor-pointer p-1 fw fa fa-trash-alt'}
          style={{'visibility': `${props.visibility}`}}
          onClick={ props.deleteComponentHandler }/>
        }
        id={`${props.component.displayLogic.key}-delete`}
        position={'bottom left'}
        closeOnDocumentClick
        on={"hover"}
        mouseLeaveDelay={0}
        mouseEnterDelay={0}
        arrow={true}
        arrowStyle={{backgroundColor: `${styles.cciBgColor}`}}
        contentStyle={{ padding: '0px', border: 'none', backgroundColor: `${styles.cciBgColor}`}}
      >
        <span className={'text-primary'} >{t('commands:delete')}</span>
    </Popup>
  );
};

const MenuMoveComponent=(props)=>{
  const { t } = useTranslation('commands', {useSuspense: false});
  return (
    <Popup
        trigger={
          <i
          id={`${props.component.displayLogic.key}`}
          type='icon'
          className={'text-primary cursor-pointer p-1 fw fa fa-arrows-alt'}
          style={{'visibility': `${props.visibility}`}}
          onClick={ props.moveStartHandler }/>
        }
        id={`${props.component.displayLogic.key}-move`}
        position={'bottom left'}
        closeOnDocumentClick
        on={"hover"}
        mouseLeaveDelay={0}
        mouseEnterDelay={0}
        arrow={true}
        arrowStyle={{backgroundColor: `${styles.cciBgColor}`}}
        contentStyle={{ padding: '0px', border: 'none', backgroundColor: `${styles.cciBgColor}`}}
      >
        <span className={'text-primary'} >{t('commands:move')}</span>
    </Popup>
  );
};


const ComponentName=(props)=>{
  const { t } = useTranslation('commands', {useSuspense: false});
  let componentName = props.componentName;

  if( props.componentName === 'part-name' || props.componentName === '')
    componentName = t('part-name');


  return (
    <a  id={`${props.displayLogicKey}`}
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

const SetupBOMUncompleted=()=>{
    const { t } = useTranslation('commands', {useSuspense: false});
    return (
       <div className='text-primary text-nowrap m-0 p-0'>
        {t('commands:bom-setup-uncompleted')}
      </div>
    )
};


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

    componentLabelHeight;
    componentLabelWidth;

    progressStatus;
    progressValue;

    leftOffset;

    permissionEnabled = this.props.permissionStatus; // #todo: need to add check later

    init=(props)=>{
      this.currentComponent = props.component;
      this.rootFontSize=props.fontSize;
      this.parents = this.currentComponent.businessLogic.parentIds;
      this.children = this.currentComponent.businessLogic.childIds;
      this.componentName = this.currentComponent.businessLogic.name;

      this.imgName = (this.currentComponent.businessLogic.imgFile.length !==0 ) ? '/images/'+ this.currentComponent.businessLogic.imgFile : '';

        // size of component button, rem - 16px is default font size of browser
      this.componentLabelHeight =  (this.parents.length === 0 ) ? 45/this.rootFontSize : (this.children.length !==0) ? 25/this.rootFontSize: 25/this.rootFontSize;
      this.componentLabelWidth = this.componentLabelHeight;

      this.progressStatus = this.currentComponent.businessLogic.status;
      this.progressValue = this.currentComponent.businessLogic.progressPercent;

      this.leftOffset =props.leftOffset  + ( (this.parents.length === 0 ) ? 0: this.componentLabelWidth/2 );
    }

    positioningComponentInfo=( )=>{

      this.leftOffset=this.props.leftOffset  + ( (this.parents.length === 0 ) ? 0: this.componentLabelWidth/2 );
    // this.inlineMenuIconLeft = this.leftOffset;
    //   this.expendableIconLeft = this.inlineMenuIconLeft + this.componentLabelWidth/2;
    //   this.btnImgLeft = this.expendableIconLeft +  5/this.rootFontSize; //rem - to the right of anchor
    //   this.nameLabelLeft = this.btnImgLeft/2 + 5/this.rootFontSize; // position si relative to img button in rem
    //   this.statusLabelLeft = getTextRect(this.componentName+':').width/this.rootFontSize;//this.nameLabelLeft + getTextRect(this.componentName+':').width/this.rootFontSize + 3.5; // in rem, compensate padding left for  ~ 4rem
    }

    // life cycle function only calls once when class is created
    //https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html
    UNSAFE_componentWillMount=()=>{
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

    deleteComponent = () => {
        this.props.deleteComponent(this.currentComponent);
        CCiLabComponent.inlineMenu.itemId='undefined';
        CCiLabComponent.inlineMenu.cmd = 'select';
        // this.props.updateTableHandler();
    };

    addComponent = () =>{
      this.props.addComponent(this.currentComponent);
      CCiLabComponent.inlineMenu.itemId='undefined';
      CCiLabComponent.inlineMenu.cmd = 'select';
      // this.props.updateTableHandler();
    }
    showOrHideChildren = (isShow) =>{
      this.props.showOrHideChildren(this.currentComponent, isShow)
    }

    moveStart=(e)=>{
      let movedComponentId=e.target.id;
      if (Number.isInteger(parseInt(movedComponentId, 10) ) )
      {
        CCiLabComponent.inlineMenu.cmd = 'move';
        CCiLabComponent.inlineMenu.itemId = movedComponentId;
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
          // this.props.updateTableHandler();
        }
      }
     }

    dragStart=(e) => {
      let draggedComponentId=e.target.id;
      if( draggedComponentId.includes( '-item' ) )
        draggedComponentId=draggedComponentId.replace(/-item/g,'');

      if( draggedComponentId.includes( '-show-hide' ) )
        draggedComponentId=draggedComponentId.replace(/-show-hide/g,'');

      if (Number.isInteger(parseInt(draggedComponentId, 10) ) )
      {
        e.dataTransfer.setData('Text', draggedComponentId);
        e.effectAllowed='copyMove';
        console.log('drag select span id: ', draggedComponentId );
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
      let draggedComponentId=e.target.id;
      if( draggedComponentId.includes( '-item' ) )
        draggedComponentId=draggedComponentId.replace(/-item/g,'');

      if( draggedComponentId.includes( '-show-hide' ) )
        draggedComponentId=draggedComponentId.replace(/-show-hide/g,'');

      if ( Number.isInteger( parseInt(draggedComponentId, 10) ) )
        console.log('drag over: ', draggedComponentId);

    }

    doDrop=(e)=>{
      e.preventDefault();

      let draggedComponentId=e.target.id;
      if( draggedComponentId.includes( '-item' ) )
        draggedComponentId=draggedComponentId.replace(/-item/g,'');

      if( draggedComponentId.includes( '-show-hide' ) )
        draggedComponentId=draggedComponentId.replace(/-show-hide/g,'');

      if ( Number.isInteger( parseInt(draggedComponentId, 10) ) )
      {
          var sourceId = e.dataTransfer.getData('Text');
          this.props.moveComponentHandler(sourceId, this.currentComponent);
      }

      console.log('dropped from source: ', sourceId);
    };

    updateImage=()=>{
      sessionStorage.setItem( `${this.currentComponent.displayLogic.key}_${this.currentComponent.businessLogic.name}_businessLogic`, JSON.stringify( this.currentComponent.businessLogic ));
      this.setState({updateImg:true});
      this.props.updateTableHandler();
    };

    render=()=>{
        this.init(this.props);

        // console.log('CCiLabComponent::render() imgFile: ', this.imgName);
        let componentBase='d-flex cci-component-label_position  align-items-center '; //align-items-center
        let imageClassName = ' ';
        let expendCollapseBadgeIconClassNameBase ='align-self-center  '; // component-label_sticky_horizontal
        let expendCollapseBadgeIconClassName= 'fa fa-angle-right';
        let componentNameClassName = 'lead align-self-center font-weight-normal text-primary text-truncate nav-link px-2 ';//component-label_sticky_horizontal

        // .align-self-center to make fa and badge height the same as font height
        let statusBadgeIconClassNameBase = 'align-self-center text-nowrap ml-0 px-1 '; //component-label_sticky_horizontal
        let statusBadgeIconClassName = statusBadgeIconClassNameBase + (this.progressStatus === 'info' ? 'fa ':
            this.progressStatus === 'success' ? 'fa fa-check-circle' :
            this.progressStatus === 'warning' ? 'fa fa-exclamation-circle' : 'fa fa-exclamation-triangle');

        let  Component=' ';
        let draggableSetting = false;
        let  stickyWidth =  this.currentComponent.displayLogic.selected !== 0 ? `${this.props.listWidth}`:'auto';

        let componentStyle = {'width': `${stickyWidth}`, 'left': `0rem`} //z-index=0 so it's not block language drop down list

        // very top component or component has children can't be moved
        if ( this.parents.length === 0 || this.children.length !== 0 || this.props.isSetupBOM === false)
        {
          draggableSetting= false;
          //Component = ( this.currentComponent.displayLogic.selected !== 0 ) ? 'bg-info component_selected ccilab-component-sticky-top' :' ';
          // don't stick at top or bottom which prevents configure MRP items
          //component_selected affect z-index which blocks editing setup MRP dialog items
          Component = ( this.currentComponent.displayLogic.selected !== 0 ) ? ' component_selected' :' ';

          if( this.currentComponent.displayLogic.selected )
          {
            componentBase +=  ' cursor-default';
            imageClassName += ' cursor-default';
            componentNameClassName += ' cursor-default';
            statusBadgeIconClassName += ' cursor-default';
          }
        }
        else
        {
            // draggable for elements bellow the very top one, if use has the permission (#todo need to implement the check)inline-menu_sticky_horizontal inline-menu_sticky_horizontal inline-menu_sticky_horizontal
            // Component =  this.currentComponent.displayLogic.selected > 0 ? 'bg-info component_selected ccilab-component-sticky-top ' + (this.permissionEnabled? ' move':' ' ):
            //            this.currentComponent.displayLogic.selected < 0 ? 'bg-info component_selected ccilab-component-sticky-bottom ' + (this.permissionEnabled? ' move':' ' ):' ';
            //component_selected affect z-index which blocks editing setup MRP dialog items
            Component =  this.currentComponent.displayLogic.selected > 0 ? 'component_selected  ' + ( this.permissionEnabled.includes('setup-bom')? ' move ':' ' ):
                       this.currentComponent.displayLogic.selected < 0 ? 'component_selected  ' + (this.permissionEnabled.includes('setup-bom')? ' move ':' ' ):' ';

            draggableSetting = ( this.permissionEnabled && this.currentComponent.displayLogic.selected !== 0 &&  this.parents.length !== 0 )? 'true':'false';

            if( this.currentComponent.displayLogic.selected !== 0 )
            {
              componentBase +=  (this.permissionEnabled.includes('setup-bom') && this.currentComponent.displayLogic.selected !== 0 && this.props.isSetupBOM )? ' move':' cursor-default';
              imageClassName += (this.permissionEnabled.includes('setup-bom') && this.currentComponent.displayLogic.selected !== 0 )? ' move':' cursor-pointer';
              componentNameClassName += (this.permissionEnabled.includes('setup-bom') && this.currentComponent.displayLogic.selected !== 0 )? ' move':' cursor-default';
              statusBadgeIconClassName += (this.permissionEnabled.includes('setup-bom') && this.currentComponent.displayLogic.selected !== 0 )? ' move':' cursor-default';
            }
        }

        if( this.state.expended === false || this.currentComponent.displayLogic.canExpend === false )
        {
          if( this.children.length !== 0  )
            expendCollapseBadgeIconClassName= 'fa fa-angle-down';
        }

        let expendableIconStyle =  {'display':'inline','left': `${this.expendableIconLeft}rem`, 'visibility': ( `${this.children.length}` !== '0'  ) ? 'visible' : 'hidden'}

        // let inlineMenuIconVisibility =  ( this.currentComponent.displayLogic.selected !== 0 ) ? 'visible' : 'hidden';

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
                // 'bg-info component_selected ccilab-component-sticky-top '
                className={`${Component}`}
                style={componentStyle}
                draggable={`${draggableSetting}`}
                onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                onDragOver={ this.dragOver }
                onDrop={  this.doDrop }>
                {/* 'd-flex cci-component-label_position  align-items-center ' */}
                {/* id is used to handle move */}
              <div id={`${this.currentComponent.displayLogic.key}`} className={`${componentBase}`} style={{'left':`${this.leftOffset}rem`}}>
                {/* a badge to show menu to move/copy/delete/edit component, only sole children component has move and copy option */}
                {/* https://github.com/yjose/reactjs-popup/blob/master/docs/src/examples/Demo.js */}

                {/* show collapse icon 'v' for all expendable components,
                  show expendable icon '>' for those components have children except the top component
                */}
                {/* tag's id used to handle drop event */}
                <i  id={`${this.currentComponent.displayLogic.key}-show-hide`}
                    // 'align-self-center nav-link p-0  ' + 'fa fa-angle-right'
                    className={`${expendCollapseBadgeIconClassNameBase} ${expendCollapseBadgeIconClassName} cursor-pointer pl-2 pr-1`}
                    style={expendableIconStyle}
                    draggable={`${draggableSetting}`}
                    onClick={ this.expending }
                    onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                    onDragOver={ this.dragOver }
                    onDrop={  this.doDrop }>
                </i>

                {/* tag's id is used to get component's rect and handle drop event */}
                  <span id={`${this.currentComponent.displayLogic.key}-item`}
                  className={imageClassName}
                  draggable={`${draggableSetting}`}
                  onClick={ this.componentSelected }
                  onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                  onDragOver={ this.dragOver }
                  onDrop={  this.doDrop }>
                  <ShowImage
                    displayLogicKey={this.currentComponent.displayLogic.key}
                    name={this.imgName} //this.imgName
                    component={this.currentComponent}
                    className={imageClassName}
                    height={this.componentLabelHeight}
                    width={this.componentLabelWidth}
                    isDraggable={draggableSetting}
                    isSetupBOM={this.props.isSetupBOM}
                    dragStartHandler={this.dragStart}
                    dragOverHandler={this.dragOver}
                    doDropHandler={this.doDrop }
                    addImageHandler={this.updateImage}/>
                </span>
                {/* tag's id is used to handle drop event */}
                <ComponentName
                    displayLogicKey={`${this.currentComponent.displayLogic.key}`}
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
                      permissionStatus={this.permissionEnabled}
                      statusClassName={`badge-pill badge-${this.progressStatus} ${statusBadgeIconClassName}`}
                      onClickHandler={ this.componentSelected }
                      progress={this.progressValue}
                      remainingTime= {this.currentComponent.businessLogic.remainDays}
                    />
                  :
                  <span>
                      <SetupBOM component={this.currentComponent}  updateSubTitle={this.props.changeMRPTitle}  updateTable={this.props.updateTableHandler}  updateComponent={this.props.updateComponentHandler}/>
                      <SetupPDP component={this.currentComponent} updateSubTitle={this.props.changeMRPTitle}  updateTable={this.props.updateTableHandler}/>
                      <SetupIRF component={this.currentComponent} updateSubTitle={this.props.changeMRPTitle}  updateTable={this.props.updateTableHandler}/>
                      <SetupOP component={this.currentComponent} updateSubTitle={this.props.changeMRPTitle}  updateTable={this.props.updateTableHandler}/>
                      
                      { this.props.isSetupBOM ?
                      <span>
                        { this.props.component.displayLogic.selected === 0 ?
                           // <span class="fa-stack fa-2x">
                             // <i type='icon' className={'text-primary cursor-pointer p-1 fw fa-square fa-stack-2x'}/>
                              <i type='icon' className={ 'text-primary cursor-pointer px-0 pt-3 pb-1 fa fa-ellipsis-h'}  onClick={this.componentSelected}/>
                            // </span>
                            :
                            <MenuAddComponent
                              component={this.currentComponent}
                              // style={ {'visibility': `${inlineMenuIconVisibility}`}}
                              isDraggable={draggableSetting}
                              addComponentHandler={this.addComponent}
                              selectedComponentHandler={this.componentSelected}
                            />
                           
                          }
                      </span>
                          
                          :
                          null
                      }
                      {  ( draggableSetting === 'true') ?
                        <span>
                          <MenuDeleteComponent
                            component={this.currentComponent}
                            deleteComponentHandler={this.deleteComponent}/>
                            <MenuMoveComponent
                              component={this.currentComponent}
                              moveStartHandler={ this.moveStart }/>
                        </span>

                          :
                          null
                      }
                  </span>
                }
                </div>
            </div>
        )
      }
}

export default CCiLabComponent;
