import React, { Component } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';
import {SetupComponentBOM} from './CCiLabSetupComponentBOM';


import styles from './../../dist/css/ccilab-component.css'
import './../../dist/css/popup-menu.css'
 
const ShowStatus=(props)=>{
  const { t } = useTranslation('component', {useSuspense: false});

  return (
    <span id={props.statusId} 
        className={props.statusClassName} 
        style={{'display':'inline-block','height': `auto`}} 
        draggable={props.statusDraggable}
        onClick={ props.onClickHandler }
        onDragStart={ props.onDragStartHandler }
        onDragOver={ props.onDragOverHandler }
        onDrop={  props.onDropHandler }> 
        {props.progress}% - {props.remainingTime} {t('remaining-time-unit')}
    </span> 
  );
}

const SetupBOM=(props)=>{


  const _className = props.component.displayLogic.selected ? 'bg-info text-primary border-0 py-0 px-2 fa fw fa-edit' : 'text-primary border-0 py-0 px-2 fa fw fa-edit';
  const bgColor = props.component.displayLogic.selected ? null : `${styles.cciBgColor}`;
  
  const initializeBOM=()=>{
    let bom={};
    bom.core=initializeBOMCore();
    bom.extra=initializeBOMExtra();
    return bom;
  }
 
  const initializeBOMCore=()=>{
     let core={};
     core.OrderQty='';
     core.partNumber='';
     core.unitQty='';
     core.unitOfMeasure='';
     core.procurementType='';
     core.warehouse='';
     core.workshop='';
     core.leadTime='';
     core.rejectRate='';
     core.supplier='';
     core.supplierPartNumber='';
     return core;
  }

  const initializeBOMExtra=()=>{
    let extra={};
    extra.SKU='';
    extra.barcode='';
    extra.revision='';
    extra.refDesignator='';
    extra.phase='';
    extra.category='';
    extra.material='';
    extra.process='';
    extra.unitCost='';
    extra.assemblyLine='';
    extra.description='';
    extra.note='';
    return extra;
  }

  const setPartName=(partName, component)=>{
    component.businessLogic.name=partName;
    console.log("SetupBOM - setPartName: " + component.businessLogic.name);
  }
  const setPartNumber=(partNumber, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeBOM();

    component.bom.core.partNumber=partNumber;

    console.log("SetupBOM - setPartNumber: " + component.bom.core.partNumber);
  }


  if( typeof props.component.bom === 'undefined' )
    props.component.bom = new initializeBOM();


  return (
    <Popup
      trigger={
        <button 
          key={`component-${props.component.displayLogic.key}`}
          id={`#component-${props.component.displayLogic.key}`}
          type="button"
          className={`${_className}`}
          style={{'height': `auto`, backgroundColor: `${styles.cciBgColor}`}}></button>
      }
      closeOnDocumentClick
      on="hover"
      position='right center'
      mouseLeaveDelay={400}
      mouseEnterDelay={0}
      contentStyle={{ padding: '0px', border: 'none', backgroundColor: `${styles.cciBgColor}` }}
      arrow={true}
      >
      <div className={'bg-info d-flex flex-column'}>
       <SetupComponentBOM 
        title='part-name'
        value={props.component.businessLogic.name}
        component={props.component}
        handler={setPartName}
        updateComponent={props.updateComponent}/>
        <hr className='my-0 bg-info' style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>
        
        <SetupComponentBOM 
        title='part-number'
        value={props.component.bom.core.partNumber}
        component={props.component}
        handler={setPartNumber}
        updateComponent={props.updateComponent}/>
      </div>
    </Popup>
  )
}

class CCiLabComponent extends Component {
    state = {
        expended:  true,
        
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



    init=(props)=>{
      this.currentComponent = props.component;
      this.rootFontSize=props.fontSize;
      this.parents = this.currentComponent.businessLogic.parentIds;
      this.children = this.currentComponent.businessLogic.childIds;
      this.componentName = this.currentComponent.businessLogic.name;

      this.imgName = (this.currentComponent.businessLogic.imgFile.length !==0 ) ? '/images/'+ this.currentComponent.businessLogic.imgFile : 
                  (this.children.length !==0) ? '/images/cci_group_block.png' : '/images/cci_single_block_item.png';
      
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

    removeGreeting = () => {
        this.props.removeGreeting(this.component.businessLogic.imgName);
    };

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

    render=()=>{
        this.init(this.props);

        // console.log('CCiLabComponent::render() imgFile: ', this.imgName);
        let componentBase='d-flex cci-component-lable_position  align-items-center '; //align-items-center 
        let inlineMenuClassName ='btn rounded-circle align-self-center p-0 bg-primary ';
        let btnClassNameBase = 'btn rounded-circle align-self-center cci-component-btn ml-1 '; 
        let btnClassName = btnClassNameBase;
        let imamgeClassName = 'cci-component__img rounded-circle align-self-center '; 
        let expendCollapseBadgeIconClassNameBase ='align-self-center nav-link p-0  '; // component-label_sticky_horizontal
        let expendCollapseBadgeIconClassName= 'fa fa-angle-right';
        let componentNameClassNameBase = 'lead align-self-center font-weight-normal text-primary text-truncate nav-link px-2 ';//component-label_sticky_horizontal
        let componentNameClassName=  componentNameClassNameBase; //+ ' py-0' to remove space between components

        // .align-self-center to make fa and badge height the same as font height
        let statusBadgetIconClassNameBase = 'align-self-center text-nowrap ml-0 px-1   '; //component-label_sticky_horizontal 
        let statusBadgeIconClassName = statusBadgetIconClassNameBase + (this.progressStatus === 'info' ? 'fa ':
            this.progressStatus === 'success' ? 'fa fa-check-circle' :
            this.progressStatus === 'warning' ? 'fa fa-exclamation-circle' : 'fa fa-exclamation-triangle');
    
        let permissionEabled = true; // #todo: need to add check later
        let  Component=' ';
        let draggableSetting = false;
        let  stickyWidth =  this.currentComponent.displayLogic.selected !== 0 ? `${this.props.listWidth}`:'auto';

        let componentStyle = {'width': `${stickyWidth}`, 'left': `0rem`}

        // very top component or component has children can't be moved 
        if ( this.parents.length === 0 || this.children.length !== 0 ) 
        {
          draggableSetting= false;
          Component = ( this.currentComponent.displayLogic.selected !== 0 ) ? 'bg-info component_opacity ccilab-component-sticky-top' :'';  

          if( this.currentComponent.displayLogic.selected !== 0 )
          {
           
            componentBase +=  ' cusor-default';
            btnClassName +=  ' cusor-default';
            imamgeClassName += ' cusor-default';
            componentNameClassName += ' cusor-default';
            statusBadgeIconClassName += ' cusor-default';
          }
        }
        else
        { 
            // draggable for elements bellow the very top one, if use has the permission (#todo need to implement the check)inline-menu_sticky_horizontal inline-menu_sticky_horizontal inline-menu_sticky_horizontal
            Component =  this.currentComponent.displayLogic.selected > 0 ? 'bg-info component_opacity ccilab-component-sticky-top ' + (permissionEabled? ' move':' ' ):
                         this.currentComponent.displayLogic.selected < 0 ? 'bg-info component_opacity ccilab-component-sticky-bottom ' + (permissionEabled? ' move':' ' ):' ';
            draggableSetting = ( permissionEabled && this.currentComponent.displayLogic.selected !== 0 &&  this.parents.length !== 0 )? 'true':'false';

          if( this.currentComponent.displayLogic.selected !== 0 )
          {
            
            componentBase +=  (permissionEabled && this.currentComponent.displayLogic.selected !== 0 )? ' move':' cusor-default';
            btnClassName +=  (permissionEabled && this.currentComponent.displayLogic.selected !== 0 )? ' move':' cusor-default';
            imamgeClassName += (permissionEabled && this.currentComponent.displayLogic.selected !== 0 )? ' move':' cusor-default';
            componentNameClassName += (permissionEabled && this.currentComponent.displayLogic.selected !== 0 )? ' move':' cusor-default';
            statusBadgeIconClassName += (permissionEabled && this.currentComponent.displayLogic.selected !== 0 )? ' move':' cusor-default';
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
                        className={`${inlineMenuClassName} cusor-default fa fa-ellipsis-h`}
                        style={ {'visibility': `${inlineMenuIconVisiblity}`, 
                                  'height': `${this.inlineMenuHeight}rem`, 
                                  'width': `${this.inlineMenuWidth}rem`} }
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
                    {/* <div className='ccilab-menu '> */}
        							<div className={'d-flex ccilab-menu-item bg-info bg-faded align-items-center'}> 
                        {/* copy is not supported for now*/}
                        {/* { ( draggableSetting === 'true') ? <a href='#copy' className={'align-self-center nav-link px-1 fa fa-copy '}/> :null} */}
                        { ( draggableSetting === 'true') ? <a id={`${this.currentComponent.displayLogic.key}`}
                           href='#move' 
                           className={'align-self-center nav-link px-1 fa fa-arrows-alt'}
                           onClick={ this.moveStart }
                           /> :null}
                        <a href='#addNew' className={'align-self-center nav-link px-1 fa fa-plus'}/> 
                        <a href='#edit' className={'align-self-center nav-link px-1 fa fa-edit'}/>
                        { ( draggableSetting === 'true') ? <a href='#delete' className={'align-self-center nav-link px-1 fa fa-trash-alt'}/>:null}
                      </div> 
        						
                   {/*  </div> */}
                </Popup> : null}
                 
                 {/* show collapse icon 'v' for all expendable components,
                  show expendable icon '>' for those components have children except the top component
                */}
                {/* tag's id used to handle drop event */}
                <a  id={`${this.currentComponent.displayLogic.key}-show-hide`} 
                    href='#expend-collapse-badge' 
                    // 'align-self-center nav-link p-0  ' + 'fa fa-angle-right'
                    className={`${expendCollapseBadgeIconClassNameBase} ${expendCollapseBadgeIconClassName} pl-2 `} 
                    style={expendableIconStyle} 
                    draggable={`${draggableSetting}`}
                    onClick={ this.expending }
                    onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                    onDragOver={ this.dragOver }
                    onDrop={  this.doDrop }>
                </a>

                {/* tag's id is used to get component's rect and handle drop event */}
                <button id={`${this.currentComponent.displayLogic.key}-item`} className={`${btnClassName}`} 
                  style={ { 'height': `${this.componentLableHeight}rem`, 'width': `${this.componentLableWidth}rem`}}
                  draggable={`${draggableSetting}`}
                  onClick={ this.componentSelected } 
                  onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                  onDragOver={ this.dragOver }
                  onDrop={  this.doDrop }>
                  
                  {/* no style for top element so the button can host the image, other elements need style to set image position  */}
                  { (this.imgName.length !== 0 ) ? 
                      // {/* tag's id used to handle drop event float-left*/}
                      <img id={`${this.currentComponent.displayLogic.key}`} 
                           className={`${imamgeClassName}`} src={this.imgName} alt=''
                           style={{'height': `${this.componentLableHeight}rem`, 'width': `${this.componentLableWidth}rem`}} 
                           draggable={`${draggableSetting}`}
                           onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                           onDragOver={ this.dragOver }
                           onDrop={  this.doDrop }>
                      </img>
                      :null
                   }
                </button>
                {/* tag's id is used to handle drop event */}
                <a  id={`${this.currentComponent.displayLogic.key}`} 
                    href='#select-component-name' className={`${componentNameClassName}`} 
                    style={{ 'height': `auto` }} 
                    draggable={`${draggableSetting}`}
                    onClick={ this.componentSelected }
                    onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                    onDragOver={ this.dragOver }
                    onDrop={  this.doDrop }>
                    {this.componentName}:
                </a>
                
                {/* tag's id is used to handle drop event */}
                { this.props.isSetupBOM === false ? 
                  <ShowStatus 
                    statusId={`${this.currentComponent.displayLogic.key}`} 
                    statusClassName={`badge-pill badge-${this.progressStatus} ${statusBadgeIconClassName}`} 
                    statusDraggable={`${draggableSetting}`}
                    onClickHandler={ this.componentSelected }
                    onDragStartHandler={ draggableSetting === 'true' ? this.dragStart : null}
                    onDragOverHandler={ this.dragOver }
                    onDropHandler={  this.doDrop } 
                    progress={this.progressValue}
                    remainingTime= {this.currentComponent.businessLogic.remainDays}
                  />
                  :
                  <SetupBOM
                    component={this.currentComponent}
                    updateComponent={this.props.selectedComponentHandler}
                  />
                }
                </div>
            </div>
        )
      }
}

export default CCiLabComponent;
