import React, { Component } from "react";
import { getTextRect} from "./CCiLabUtility"

import "./../../dist/css/ccilab-component.css"
 
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

        progressStatus = this.currentComponent.businessLogic.status;
        progressValue = this.currentComponent.businessLogic.progressPercent;

        leftOffset;
        inlineMenuIconLeft;
        expendableIconLeft;        
        btnImgLeft;
        nameLableLeft;
        statusLabelLeft;

      
    positioningComponentInfo( )
    {
      
      this.leftOffset=this.props.leftOffset;
      this.inlineMenuIconLeft = this.leftOffset;
      this.expendableIconLeft = this.inlineMenuIconLeft + this.componentLableWidth+10/this.rootFontSize;
      this.btnImgLeft = this.expendableIconLeft +  20/this.rootFontSize; //rem - to the right of ancher
      this.nameLableLeft = this.btnImgLeft + ( ( this.parents.length === 0) ? 50 : 10 )/this.rootFontSize; // in rem
      this.statusLabelLeft = this.nameLableLeft + getTextRect(this.componentName+':').width/this.rootFontSize + 3.5; // in rem, compnesate padding left for  ~ 4rem
    }

    componentWillMount=()=>{
      this.positioningComponentInfo();
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
        e.dataTransfer.setData("Text", draggedComponetId);
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
          var sourceId = e.dataTransfer.getData("Text");
          this.props.moveComponentHandler(sourceId, this.currentComponent);
      }

      console.log('droped from source: ', sourceId);
    }

    render() {
        // console.log('CCiLabComponent::render() imgFile: ', this.imgName);
        let componentBase='list-group flex-row cci-component-lable_position';
        let inlineMenuClassName ='btn rounded-circle align-self-center p-0 bg-primary component-label_sticky_horizontal';
        let ComponentClassNameBase = 'btn rounded-circle align-self-center m-0 p-0 cci-component-btn  component-label_sticky_horizontal'; //float-left
        let ComponentClassName = ComponentClassNameBase;
        let imamgeClassName = 'cci-component__img rounded-circle align-self-center  component-label_sticky_horizontal';
        let expendCollapseBadgeIconClassNameBase ='cci-component-lable_position component-label_sticky_horizontal align-self-center nav-link p-0';
        let expendCollapseBadgeIconClassName= 'fa fa-angle-right';
        let componentNameClassNameBase = 'lead align-self-center font-weight-normal text-primary text-truncate nav-link component-label_sticky_horizontal';
        let componentNameClassName=  componentNameClassNameBase; //+ ' py-0' to remove space between components

        // .align-self-center to make fa and badge height the same as font height
        let statusBadgetIconClassNameBase = 'align-self-center text-nowrap ml-0 component-label_sticky_horizontal px-1 ';
        let statusBadgeIconClassName = statusBadgetIconClassNameBase + (this.progressStatus === 'info' ? 'fa ':
            this.progressStatus === 'success' ? 'fa fa-check-circle' :
            this.progressStatus === 'warning' ? 'fa fa-exclamation-circle' : 'fa fa-exclamation-triangle');
    
        let permissionEabled = true; // #todo: need to add check later
        let  Component=' ';
        let draggableSetting = false;
        let  stickyWidth =  this.currentComponent.displayLogic.selected !== 0 ? `${this.props.listWidth}vw`:'auto';

        let componentStyle = {'width': `${stickyWidth}`, 'left': '0'}

        // very top component or component has children can't be moved 
        if ( this.parents.length === 0 || this.children.length !== 0 ) 
        {
          Component = ( this.currentComponent.displayLogic.selected !== 0 ) ? 'bg-info component_opacity ccilab-component-sticky-top inline-menu_sticky_horizontal' : 'inline-menu_sticky_horizontal';
          draggableSetting= false;
        }
        else
        { 
            // draggable for elements bellow the very top one, if use has the permission (#todo need to implement the check)
            Component =  this.currentComponent.displayLogic.selected > 0 ? 'bg-info component_opacity ccilab-component-sticky-top inline-menu_sticky_horizontal' + (permissionEabled? ' move':' ' ):
                         this.currentComponent.displayLogic.selected < 0 ? 'bg-info component_opacity ccilab-component-sticky-bottom inline-menu_sticky_horizontal' + (permissionEabled? ' move':' ' ):'inline-menu_sticky_horizontal ';
            draggableSetting = ( permissionEabled && this.currentComponent.displayLogic.selected !== 0 &&  this.parents.length !== 0 )? 'true':'false';
        }

        if( this.currentComponent.displayLogic.selected !== 0 )
        {
          ComponentClassName +=  (permissionEabled && this.currentComponent.displayLogic.selected !== 0 )? ' move':' cusor-default';
          imamgeClassName += (permissionEabled && this.currentComponent.displayLogic.selected !== 0 )? ' move':' cusor-default';
          componentNameClassName += (permissionEabled && this.currentComponent.displayLogic.selected !== 0 )? ' move':' cusor-default';
          statusBadgeIconClassName += (permissionEabled && this.currentComponent.displayLogic.selected !== 0 )? ' move':' cusor-default';
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
                className={`${componentBase} ${Component}`} 
                style={componentStyle}
                draggable={`${draggableSetting}`}
                onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                onDragOver={ this.dragOver }
                onDrop={  this.doDrop }>

                {/* a badge to show menu to move/copy/delete/edit component, only sole children component has move and copy option */}
                  <button id={`${this.currentComponent.displayLogic.key}-inline-menu`}
                          className={`${inlineMenuClassName}`} 
                          style={ {'left':`${this.inlineMenuIconLeft}rem`,'visibility': `${inlineMenuIconVisiblity}`, 'height': `${this.componentLableHeight}rem`, 'width': `${this.componentLableWidth}rem`} }>
                    <span className='fa fa-ellipsis-h'></span>
                  </button> 
                 
                 {/* show collapse icon 'v' for all expendable components,
                  show expendable icon '>' for those components have children except the top component
                */}
                {/* tag's id used to handle drop event */}
                <a  id={`${this.currentComponent.displayLogic.key}-show-hide`} 
                    href="#expend-collapse-badge" 
                    className={`${expendCollapseBadgeIconClassNameBase} ${expendCollapseBadgeIconClassName}`} 
                    style={expendableIconStyle} 
                    draggable={`${draggableSetting}`}
                    onClick={ this.expending }
                    onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                    onDragOver={ this.dragOver }
                    onDrop={  this.doDrop }>
                </a>

                {/* tag's id is used to get component's rect and handle drop event */}
                <button id={`${this.currentComponent.displayLogic.key}-item`} className={`${ComponentClassName}`} 
                  style={ { 'height': `${this.componentLableHeight}rem`, 'width': `${this.componentLableWidth}rem`, 'left': `${this.btnImgLeft}rem`}}
                  draggable={`${draggableSetting}`}
                  onClick={ this.componentSelected } 
                  onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                  onDragOver={ this.dragOver }
                  onDrop={  this.doDrop }>
                  
                  {/* no style for top element so the button can host the image, other elements need style to set image position  */}
                  { (this.imgName.length !== 0 ) ? 
                      // {/* tag's id used to handle drop event float-left*/}
                      <img id={`${this.currentComponent.displayLogic.key}`} 
                           className={`${imamgeClassName}`} src={this.imgName} alt=""
                           style={{'height': `${this.componentLableHeight}rem`, 'width': `${this.componentLableWidth}rem`, 'left': `${this.btnImgLeft}rem`}} 
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
                    href="#select-component-name" className={`${componentNameClassName}`} 
                    style={{ 'height': '10%', 'left':`${this.nameLableLeft}rem` }} 
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
                      style={{'display':'inline-block','height': '10%', 'left':`${this.statusLabelLeft}rem`}} 
                      draggable={`${draggableSetting}`}
                      onClick={ this.componentSelected }
                      onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                      onDragOver={ this.dragOver }
                      onDrop={  this.doDrop }> 
                      {this.progressValue}%
                </span>  
            </div>
        )
      }
}

export default CCiLabComponent;
