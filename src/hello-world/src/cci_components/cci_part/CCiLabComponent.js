import React, { Component } from 'react';
import Popup from '../popup_menu/Popup'


import './../../dist/css/ccilab-component.css'
import './../../dist/css/popup-menu.css'
 
class CCiLabComponent extends Component {
        state = {
            expended:  true,
           
        };

        currentComponent = this.props.component;
        rootFontSize=this.props.fontSize;
        parents = this.currentComponent.businessLogic.parentIds;
        children = this.currentComponent.businessLogic.childIds;
        componentName = this.currentComponent.businessLogic.name;
        imgName = (this.currentComponent.businessLogic.imgFile.length !==0 ) ? '/images/'+ this.currentComponent.businessLogic.imgFile : 
                    (this.children.length !==0) ? '/images/cci_group_block.png' : '/images/cci_single_block_item.png';
        
        // size of component button, rem - 16px is default font size of browser
        componentLableHeight =  (this.parents.length === 0 ) ? 45/this.rootFontSize : (this.children.length !==0) ? 25/this.rootFontSize: 25/this.rootFontSize;
        componentLableWidth = this.componentLableHeight;
        inlineMenuHeight = 25/this.rootFontSize;
        inlineMenuWidth = 25/this.rootFontSize;

        progressStatus = this.currentComponent.businessLogic.status;
        progressValue = this.currentComponent.businessLogic.progressPercent;

        leftOffset =this.props.leftOffset  + ( (this.parents.length === 0 ) ? 0: this.componentLableWidth/2 );
        // inlineMenuIconLeft;
        // expendableIconLeft;        
        // btnImgLeft;
        // nameLableLeft;
        // statusLabelLeft;

      
    positioningComponentInfo=( )=>{
      
      this.leftOffset=this.props.leftOffset  + ( (this.parents.length === 0 ) ? 0: this.componentLableWidth/2 );
    // this.inlineMenuIconLeft = this.leftOffset;
    //   this.expendableIconLeft = this.inlineMenuIconLeft + this.componentLableWidth/2;
    //   this.btnImgLeft = this.expendableIconLeft +  5/this.rootFontSize; //rem - to the right of ancher
    //   this.nameLableLeft = this.btnImgLeft/2 + 5/this.rootFontSize; // position si relative to img button in rem
    //   this.statusLabelLeft = getTextRect(this.componentName+':').width/this.rootFontSize;//this.nameLableLeft + getTextRect(this.componentName+':').width/this.rootFontSize + 3.5; // in rem, compnesate padding left for  ~ 4rem
    }

    componentWillMount=()=>{
      // this.positioningComponentInfo();
      this.setState({expended: this.props.component.displayLogic.canExpend});
    }

    componentDidMount =()=> {
      let componentRect = document.getElementById( `${this.currentComponent.displayLogic.key}-item` ).getBoundingClientRect();  

      this.currentComponent.displayLogic.rectLeft = componentRect.left/this.rootFontSize;  //convert to rem, 16px is default font size for browser

      this.componentSelected()
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
        this.props.selectedComponentHandler(this.currentComponent);
    }

    removeGreeting = () => {
        this.props.removeGreeting(this.component.businessLogic.imgName);
    };

    showOrHideChildren = (isShow) =>{
      this.props.showOrHideChildren(this.currentComponent, isShow)
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
    }

    render=()=>{
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

        return (
          // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
          // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#dragstart
          // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem#Browser_compatibility
            // {/* shift the child components to the right */}  
            // {/* tag's id is used to handle drop event*/}
            <div id={`${this.currentComponent.displayLogic.key}`} 
                className={`${Component}`} 
                style={componentStyle}
                draggable={`${draggableSetting}`}
                onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                onDragOver={ this.dragOver }
                onDrop={  this.doDrop }>
              <div className={`${componentBase}`} style={{'left':`${this.leftOffset}rem`}}>
                {/* a badge to show menu to move/copy/delete/edit component, only sole children component has move and copy option */}
                {/* https://github.com/yjose/reactjs-popup/blob/master/docs/src/examples/Demo.js */}
                <Popup 
                    trigger={<button 
                              type="button"
                              className={`${inlineMenuClassName}`}
                              style={ {'visibility': `${inlineMenuIconVisiblity}`, 
                                        'height': `${this.inlineMenuHeight}rem`, 
                                        'width': `${this.inlineMenuWidth}rem`,
                                        'cursor': 'pointer'} }
                              > 
                                <span className='fa fa-ellipsis-h'
                                style={ {'visibility': `${inlineMenuIconVisiblity}`} }>
                                </span>
                             </button>}
                    id={`${this.currentComponent.displayLogic.key}-inline-menu`}
                   // className={`${inlineMenuClassName}`} 
                    // style={ {'visibility': `${inlineMenuIconVisiblity}`, 'height': `${this.inlineMenuHeight}rem`, 'width': `${this.inlineMenuWidth}rem`} }
                    position="top center"
                    closeOnDocumentClick
  						      contentStyle={{ padding: '0px', border: 'none' }}
                    >
                    <div className="ccilab-menu text-info">
        							<div className='ccilab-menu-item'> <span className='far fa-copy'></span></div> 
        							<div className="ccilab-menu-item"> Menu item 2</div>
        							<div className="ccilab-menu-item"> Menu item 3</div>
                    </div>
                </Popup> 
                 
                 {/* show collapse icon 'v' for all expendable components,
                  show expendable icon '>' for those components have children except the top component
                */}
                {/* tag's id used to handle drop event */}
                <a  id={`${this.currentComponent.displayLogic.key}-show-hide`} 
                    href='#expend-collapse-badge' 
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
                <span id={`${this.currentComponent.displayLogic.key}`} 
                      className={`badge-pill badge-${this.progressStatus} ${statusBadgeIconClassName}`} 
                      style={{'display':'inline-block','height': `auto`}} 
                      draggable={`${draggableSetting}`}
                      onClick={ this.componentSelected }
                      onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                      onDragOver={ this.dragOver }
                      onDrop={  this.doDrop }> 
                      {this.progressValue}%
                </span>  
                </div>
            </div>
        )
      }
}

export default CCiLabComponent;
