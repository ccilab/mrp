import React, { Component } from "react";
// import "./../../stylesheets/ccilab/scss/components/ccilab-component.scss";
import "./../../dist/css/ccilab-component.css"
 
class CCiLabComponent extends Component {
        state = {
            expended:  true,
           
        };

        currentComponent = this.props.component;
        parents = this.currentComponent.businessLogic.parentIds;
        children = this.currentComponent.businessLogic.childIds;
        componentName = this.currentComponent.businessLogic.name;
        imgName = (this.currentComponent.businessLogic.imgFile.length !==0 ) ? '/images/'+ this.currentComponent.businessLogic.imgFile : 
                    (this.children.length !==0) ? '/images/cci_group_block.png' : '/images/cci_single_block_item.png';
        
        // size of component button
        componentLableHeight =  (this.parents.length === 0 ) ? '2.8125' : (this.children.length !==0) ? '1.5625': '1.5625';
        componentLableWidth = this.componentLableHeight;

        expendCollapseBadgePadding =  (this.parents.length === 0 ) ? 'pt-3 pb-0 pl-4 pr-1' : 'pt-2 pb-0 pl-4 pr-1';


        progressStatus = this.currentComponent.businessLogic.status;
        progressValue = this.currentComponent.businessLogic.progressPercent;
      
    componentWillMount=()=>{
      this.setState({expended: this.props.component.displayLogic.canExpend});
    }

    componentDidMount =()=> {
      let componentRect = document.getElementById( `${this.currentComponent.displayLogic.key}-item` ).getBoundingClientRect();

      this.currentComponent.displayLogic.rectLeft = componentRect.left;
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

    // to estimate the string width before render the string
    getElementWidth = (componentName)=>{
      let elementWidth=0;

      if( componentName !== "undefined" && typeof componentName === "string" )
      {
        elementWidth = ( componentName.length + 1 ) * 0.9375; // roughly (lenght+1)*15px/16 rem as font-size
        console.log("name width: ", elementWidth)
      }

      return elementWidth;
    }

    render() {
        // console.log('CCiLabComponent::render() imgFile: ', this.imgName);
        let ComponentClassNameBase = 'btn m-0 float-left rounded-circle p-0'
        let ComponentClassName = ComponentClassNameBase + ' cci-component-btn';
        let expendCollapseBadgeIconClassName= 'fa fa-angle-right';
        let componentNameClassNameBase = 'lead font-weight-normal text-primary text-truncate nav-link ';
        let componentNameClassName= this.parents.length === 0 ? componentNameClassNameBase + ' py-1' : componentNameClassNameBase + ' py-0';

        let statusBadgeIconClassName = this.progressStatus === 'info' ? 'fa ':
            this.progressStatus === 'success' ? 'fa fa-check-circle' :
            this.progressStatus === 'warning' ? 'fa fa-exclamation-circle' : 'fa fa-exclamation-triangle';
    
        let permissionEabled = true; // #todo: need to add check later
        let  Component=' ';
        let draggableSetting = false;

        // very top component or component has children can't be moved 
        if ( this.parents.length === 0 || this.children.length !== 0 ) 
        {
            Component =  this.currentComponent.displayLogic.selected !== 0 ? 'bg-info component_opacity ccilab-component-sticky-top inline-menu_sticky_horizontal':'inline-menu_sticky_horizontal ';
            draggableSetting= false;
        }
        else
        { // draggable for elements bellow the very top one, if use has the permission ( need to check)
            Component =  this.currentComponent.displayLogic.selected > 0 ? 'bg-info component_opacity ccilab-component-sticky-top inline-menu_sticky_horizontal' + (permissionEabled? 'move':' ' ):
                         this.currentComponent.displayLogic.selected < 0 ? 'bg-info component_opacity ccilab-component-sticky-bottom inline-menu_sticky_horizontal' + (permissionEabled? 'move':' ' ):'inline-menu_sticky_horizontal ';
            draggableSetting = ( permissionEabled && this.currentComponent.displayLogic.selected !== 0 &&  this.parents.length !== 0 )? 'true':'false';
        }

        if( this.currentComponent.displayLogic.selected !== 0 )
        {
          ComponentClassName = ComponentClassNameBase + ' cci-component-btn cusor-default';
          componentNameClassName = ( this.parents.length === 0 )? componentNameClassNameBase + ' py-1 cusor-default' : componentNameClassNameBase + ' py-0 cusor-default';
        }

        if( this.state.expended === false || this.currentComponent.displayLogic.canExpend === false ) 
        {
          if( this.children.length !== 0  )
            expendCollapseBadgeIconClassName= 'fa fa-angle-down';
        }
        
        let leftOffset=this.props.leftOffset;
        
        // expendable component left shift less, to compensate <a> 
        if ( this.children.length === 0 )
        {
          leftOffset = (this.props.leftOffset+2.4375); // single component without children, left offset with 39px (2.4375rem) extra to compensate the >/v badge size

          //single component and is not the top component, selected 
          // if( this.parents.length !== 0 && 
          //   this.currentComponent.displayLogic.selected !== 0 ) 
          //   leftOffset -= this.componentLableWidth;
        }
        
        let anchorLeftstyle = {'left': `${leftOffset}rem`,}
        let leftShiftStyle = {'left': `${leftOffset}rem`,};

        let  stickyWidth =  this.currentComponent.displayLogic.selected !== 0 ? `${this.props.listWidth}vw`:'auto';

        let btnImgLeft = (this.componentLableWidth*2+0.3125 < leftOffset ) ? leftOffset+0.3125: this.componentLableWidth*2+0.3125 ; // 1.5625rem is width of component
        //let btnImgLeft = (this.currentComponent.displayLogic.selected !== 0) ? this.componentLableWidth*2+5 : 'inherit';
        let nameLableLeft = btnImgLeft + ( this.parents.length === 0) ? 3.125:0.625; 
        let statusLabelLeft = this.getElementWidth(this.componentName) + nameLableLeft; 

        return (
          // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
          // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#dragstart
          // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem#Browser_compatibility
         
          <span id={`${this.currentComponent.displayLogic.key}`} 
                className={`${Component}`}  
                style={{'width': `${stickyWidth}` }}
                draggable={`${draggableSetting}`}
                onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                onDragOver={ this.dragOver }
                onDrop={  this.doDrop }
          > 
          {/* a badge to show menu to move/copy/delete component */}
          { ( this.parents.length !== 0 && 
              this.children.length === 0 &&  
              this.currentComponent.displayLogic.selected !== 0 ) ?
              <span>
                <button className='btn rounded-circle p-0 bg-primary float-left inline-menu_sticky_horizontal' 
                        style={ { 'height': `${this.componentLableHeight}rem`, 'width': `${this.componentLableWidth}rem`} }>
                  <span className='fa fa-ellipsis-h'></span>
                </button> 
              </span>: null
          }
            {/* show collapse icon 'v' for all expendable components,
              show expendable icon '>' for those components have children except the top component
            */}
            { ( this.children.length !== 0  )?
                  // {/* tag's id used to handle drop event */}
                  <a  id={`${this.currentComponent.displayLogic.key}-show-hide`} 
                      href="#expend-collapse-badge" 
                      className={`cci-link_position float-left nav-link ${this.expendCollapseBadgePadding} component-label_sticky_horizontal`} 
                      style={anchorLeftstyle} 
                      draggable={`${draggableSetting}`}
                      onClick={ this.expending }
                      onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                      onDragOver={ this.dragOver }
                      onDrop={  this.doDrop }>
                    <span className={expendCollapseBadgeIconClassName}></span>
                  </a>:null
            }  

          
            
            {/* shift the child components to the right */}  
            {/* tag's id is used to get component's rect and handle drop event*/}
            <ul id={`${this.currentComponent.displayLogic.key}-item`} 
                className='flow-right list-group flex-row cci-component-lable_position' 
                style={leftShiftStyle}
                draggable={`${draggableSetting}`}
                onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                onDragOver={ this.dragOver }
                onDrop={  this.doDrop }>
                 {/* tag's id is used to handle drop event */}
                <button id={`${this.currentComponent.displayLogic.key}`} className={`${ComponentClassName} component-label_sticky_horizontal`} 
                  // style={ { 'height': `${this.componentLableHeight}rem`, 'width': `${this.componentLableWidth}rem`, 'left': `${btnImgLeft}rem`}}
                  style={ { 'height': `${this.componentLableHeight}rem`, 'width': `${this.componentLableWidth}rem`}}
                  draggable={`${draggableSetting}`}
                  onClick={ this.componentSelected } 
                  onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                  onDragOver={ this.dragOver }
                  onDrop={  this.doDrop }>
                  
                  {/* no style for top element so the button can host the image, other elements need style to set image position  */}
                  { (this.imgName.length !== 0 ) ? 
                      // {/* tag's id used to handle drop event */}
                      <img id={`${this.currentComponent.displayLogic.key}`} 
                           className='cci-component__img rounded-circle float-left component-label_sticky_horizontal' src={this.imgName} alt=""
                          //  style={{'height': `${this.componentLableHeight}rem`, 'width': `${this.componentLableWidth}rem`, 'left': `${btnImgLeft}rem`}} 
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
                    href="#select-component-name" className={`${componentNameClassName} component-label_sticky_horizontal`} 
                    style={{ 'height': '10%', 'left':`${nameLableLeft}rem` }} 
                    draggable={`${draggableSetting}`}
                    onClick={ this.componentSelected }
                    onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                    onDragOver={ this.dragOver }
                    onDrop={  this.doDrop }>
                    {this.componentName}:
                </a>
                
                {/* tag's id is used to handle drop event */}
                <span id={`${this.currentComponent.displayLogic.key}`} 
                      className={`badge-pill badge-${this.progressStatus} ${statusBadgeIconClassName} text-nowrap align-self-center ml-0 component-label_sticky_horizontal`} 
                      style={{ 'height': '15% !important', 'left':`${statusLabelLeft}rem`}} 
                      draggable={`${draggableSetting}`}
                      onClick={ this.componentSelected }
                      onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                      onDragOver={ this.dragOver }
                      onDrop={  this.doDrop }> 
                      {this.progressValue}%
                </span>  
            </ul>
          </span>
        )
      }
}

export default CCiLabComponent;
