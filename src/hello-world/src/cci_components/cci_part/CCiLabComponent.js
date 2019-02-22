import React, { Component } from "react";
import "./../../css/CCiLabComponent.css";

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
        componentLableHeight =  (this.parents.length === 0 ) ? '45px' : (this.children.length !==0) ? '25px': '25px';
        expendCollapseBadgePadding =  (this.parents.length === 0 ) ? 'pt-3 pb-0 pl-4 pr-1' : 'pt-2 pb-0 pl-4 pr-1';


        progressStatus = this.currentComponent.businessLogic.status;
        progressValue = this.currentComponent.businessLogic.progressPercent;
      
        StickyWidth =  this.currentComponent.displayLogic.selected !== 0 ? '100':'';

    componentWillMount=()=>{
      this.setState({expended: this.props.component.displayLogic.canExpend});
    }

    componentDidMount =()=> {
      let componentRect = document.getElementById( `${this.currentComponent.displayLogic.key}` ).getBoundingClientRect();

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
      if (e.target.id.includes('-drag') ) 
      {
        console.log('before remove -drag select span id: ', parseInt(e.target.id.includes, 10));
        let draggedComponetId=e.target.id.replace(/-drag/g,'');
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
      console.log('drag over from source: ');
    
    }

    doDrop=(e)=>{
      e.preventDefault();

      if ( e.target.id.includes('-drag') ) 
      {
          var sourceId = e.dataTransfer.getData("Text");
          this.props.moveComponentHandler(sourceId, this.currentComponent);
      }

      console.log('droped from source: ', sourceId);
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
    
        let permissionEabled = true; // need to add check later
        let  Component=' ';
        let draggableSetting = false;

        // very top component or component has children can't be moved 
        if ( this.parents.length === 0 || this.children.length !== 0 ) 
        {
            Component =  this.currentComponent.displayLogic.selected !== 0 ? 'bg-info component_opacity ccilab-component-sticky-top':' ';
            draggableSetting= false;
        }
        else
        { // draggable for elements bellow the very top one, if use has the permission ( need to check)
            Component =  this.currentComponent.displayLogic.selected > 0 ? 'bg-info component_opacity ccilab-component-sticky-top ' + (permissionEabled? 'move':' ' ):
                         this.currentComponent.displayLogic.selected < 0 ? 'bg-info component_opacity ccilab-component-sticky-bottom ' + (permissionEabled? 'move':' ' ):' ';
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
        
        let leftShiftStyle;
        let anchorLeftstyle;
        
        // expendable component left shift less, to compensate <a> 
        if ( this.children.length !== 0 )
        {
          anchorLeftstyle = {
            'left': `${this.props.leftOffset}px`,
          }
          leftShiftStyle = {
            'left': `${this.props.leftOffset}px`,
            };
        }
        else{
          let leftOffset = this.props.leftOffset+39;
          leftShiftStyle = {
            'left': `${leftOffset}px`,
            };
        }
         
        

        return (
          // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
          // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#dragstart
          // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem#Browser_compatibility
         
          <span id={`${this.currentComponent.displayLogic.key}-drag`} 
                className={`${Component}`}  
                style={{'width': `${this.StickyWidth}%`}} 
                draggable={`${draggableSetting}`}
                onDragStart={ draggableSetting === 'true' ? this.dragStart : null}
                onDragOver={ this.dragOver }
                onDrop={  this.doDrop }
          > 
            {/* show collapse icon 'v' for all expendable components,
              show expendable icon '>' for those components have children except the top component
            */}
            { ( this.children.length !== 0  )?
                  // {/* tag's id used to handle drop event */}
                  <a  id={`${this.currentComponent.displayLogic.key}-drag`} 
                      href="#expend-collapse-badge" className={`cci-link_position float-left nav-link ${this.expendCollapseBadgePadding} `} 
                      style={anchorLeftstyle} 
                      onClick={ this.expending }
                      onDrop={  this.doDrop }>
                    <span className={expendCollapseBadgeIconClassName}></span>
                  </a>:null
            }  

          
            
            {/* shift the child components to the right */}  
            {/* tag's id is used to get component's rect */}
            <ul id={`${this.currentComponent.displayLogic.key}`} 
                className='flow-right list-group flex-row cci-component-lable_position' 
                style={leftShiftStyle}>
                 {/* tag's id is used to handle drop event */}
                <button id={`${this.currentComponent.displayLogic.key}-drag`} className={`${ComponentClassName}`} 
                  style={ { 'height': this.componentLableHeight, 'width': this.componentLableHeight} }
                  onClick={ this.componentSelected } >
                  
                  {/* no style for top element so the button can host the image, other elements need style to set image position  */}
                  { (this.imgName.length !== 0 ) ? 
                      // {/* tag's id used to handle drop event */}
                      <img id={`${this.currentComponent.displayLogic.key}-drag`} 
                           className='cci-component__img rounded-circle float-left' src={this.imgName} alt=""
                           style={{'height': this.componentLableHeight, 'width': this.componentLableHeight}} 
                           onDrop={  this.doDrop }>
                      </img>
                      :null
                   }
                </button>
                {/* tag's id is used to handle drop event */}
                <a  id={`${this.currentComponent.displayLogic.key}-drag`} 
                    href="#select-component-name" className={`${componentNameClassName}`} 
                    style={{ 'height': '10%' }} 
                    onClick={ this.componentSelected }
                    onDrop={  this.doDrop }>
                    {this.componentName}:
                </a>
                
                {/* tag's id is used to handle drop event */}
                <span id={`${this.currentComponent.displayLogic.key}-drag`} 
                      className={`badge-pill badge-${this.progressStatus} ${statusBadgeIconClassName} text-body text-nowrap align-self-center ml-0`} 
                      style={{ 'height': '15% !important'}} 
                      onClick={ this.componentSelected }
                      onDrop={  this.doDrop }> 
                      {this.progressValue}%
                </span>  
            </ul>
          </span>
        )
      }
}

export default CCiLabComponent;
