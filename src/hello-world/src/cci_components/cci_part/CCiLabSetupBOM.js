import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

import { dividerCCS, isValidString, isValidValue } from "./CCiLabUtility";
import {NumberInput} from "./CCiLabNumberInput"
import {TextInput} from "./CCiLabTextInput"


export const CanEnableInlineMenu = ( component )=>{
  if( isValidString( component.businessLogic.name) &&
      component.bom !== null &&
      typeof component.bom !== 'undefined' &&
      typeof component.bom.core !== 'undefined' &&
      component.bom.core !== null &&
      isValidString( component.bom.core.partNumber ) &&
      ( component.businessLogic.parentIds.length === 0 ||
        isValidValue( component.bom.core.unitQty ).isValid ) )
  {
    component.displayLogic.inlineMenuEnabled = true;
  }
  else
  {
    component.displayLogic.inlineMenuEnabled = false;
  }
}

export const initializeBOM=( component )=>{
  let bom={};
  bom.core= JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_bom_core`)) || initializeBOMCore();
  bom.extra=JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_bom_extra`)) ||initializeBomExtra();
  return bom;
}

// requiredQtyPerShift calculates based on its parent component's unitQty
// #todo - need to re-design how to handle it
const initializeBOMCore=()=>{
   let core={};
   core.partNumber=null;
   core.unitQty=null;
   core.unitOfMeasure=''; // may doesn't have unit
   core.description='';
   core.note='';
   return core;
}

export const initializeBomExtra=()=>{
  let extra={};
  extra.SKU='';
  extra.barCode='';
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
  extra.approvedBy= {givenName:'', familyName:''}; //first name, last name;  //first name, family name
  extra.approvedDate=null;
  return extra;
};

export const SetupBOM=(props)=>{
  const { t } = useTranslation('commands', {useSuspense: false});
  
  const _className = 'cursor-pointer text-primary border-0 p-1 fa fw fa-edit' + (props.component.displayLogic.selected ? ' component_selected' : ' ');

  const [event, setEvent] = useState('hover'); // '' is the initial state value

  // deep copy object that doesn't have function inside object
  const originComponent = JSON.parse(JSON.stringify(props.component));

   // component.displayLogic.inlineMenuEnabled needs set to true
  const saveValidBOMEntry=( component )=>{
      console.log("SetupBOM - saveValidBOMEntry:  ");
  
      CanEnableInlineMenu( component );
      if( component.displayLogic.inlineMenuEnabled )
      {
        props.updateComponent(originComponent, component);
       
      }

      // update component name
      if( isValidString( component.businessLogic.name) && props.updateComponent(originComponent, component))
      {
          // update component name if user changes it
          if( originComponent.businessLogic.name !== component.businessLogic.name )
          {
              sessionStorage.removeItem( `${component.displayLogic.key}_${originComponent.businessLogic.name}_pdp`);
              sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_pdp`, JSON.stringify( component.pdp ));
              sessionStorage.removeItem( `${component.displayLogic.key}_${originComponent.businessLogic.name}_irf`);
              sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_irf`, JSON.stringify( component.irf ));

              sessionStorage.removeItem( `${component.displayLogic.key}_${originComponent.businessLogic.name}_op`);
              sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_op`, JSON.stringify( component.operation ));

              sessionStorage.removeItem( `${component.displayLogic.key}_${originComponent.businessLogic.name}_bom_core`);
              sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_bom_core`, JSON.stringify( component.bom.core ));

              sessionStorage.removeItem(`${props.component.displayLogic.key}_${originComponent.businessLogic.name}_businessLogic`);
              sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_businessLogic`, JSON.stringify( component.businessLogic ));

              sessionStorage.removeItem(`${props.component.displayLogic.key}_${originComponent.businessLogic.name}_bom_extra`);
              sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_bom_extra`, JSON.stringify( component.bom.extra ));

              if( typeof component.mps !== 'undefined' && typeof component.mps.extra !== 'undefined')
              {
                sessionStorage.removeItem(`${props.component.displayLogic.key}_${originComponent.businessLogic.name}_mps_extra`);
                sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_mps_extra`, JSON.stringify( component.mps.extra ));
              }

          }
          else{
             sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_bom_core`, JSON.stringify( component.bom.core ));
          }
      }
      props.updateTable();
  }



  if( props.component.bom === null || 
      typeof props.component.bom === 'undefined' ||   
      props.component.bom.core === 'undefined' || 
      props.component.bom.extra === 'undefined' ) 
  {
    props.component.bom = new initializeBOM(props.component);
  }

  if( props.component.businessLogic.parentIds.length === 0)
  {
      props.component.bom.core.unitQty=1;
  }
    


  const setPartName=(index, partName, component)=>{
    if( isValidString( partName ))
        component.businessLogic.name=partName;
    else
      component.businessLogic.name='';  //reset to initial value to fail saveValidBOMEntry evaluation

    saveValidBOMEntry(component);
    console.log("SetupBOM - setPartName: " + component.businessLogic.name);
  };

  const setPartNumber=(index, partNumber, component)=>{
    if( component.bom.core === 'undefined' || component.bom.extra === 'undefined' )
    {
      component.bom = new initializeBOM( component );
    }
   

    if( isValidString( partNumber ))
      component.bom.core.partNumber=partNumber;
    else
      component.businessLogic.name=null;  //reset to initial value to fail saveValidBOMEntry evaluation

    saveValidBOMEntry(component);

    console.log("SetupBOM - setPartNumber: " + component.bom.core.partNumber);
  };

  const setUnitQty=(index, unitQty, component)=>{
    if( component.bom.core === 'undefined' || component.bom.extra === 'undefined' )
    {
      component.bom = new initializeBOM( component );
    }
      

    let {isValid, value} = isValidValue(unitQty);

    if( !isValid )
    {
       component.bom.core.unitQty=null;
    }
    else
    {
      component.bom.core.unitQty=value;
    }
      
    // required quantity for per shift per run
    saveValidBOMEntry(component);
  }

  const setUnitOfMeasure=(index, unitOfMeasure, component)=>{
    if( component.bom.core === 'undefined' || component.bom.extra === 'undefined' )
      component.bom = new initializeBOM( component );

    component.bom.core.unitOfMeasure=unitOfMeasure;

    saveValidBOMEntry(component);
  }


  //hover to popup tooltip, click/focus to popup setup BOM inputs
  // based on event from mouse or click for desktop devices, click for touch devices
  const setEventState=()=>
  {
    if( event === 'click' )
    {
       props.updateSubTitle( undefined, 'subTitle-BOM-data' );
       setEvent('hover');
       console.log('from click to ' + event);
       return;
    }
    if( event === 'hover' )
    {
      props.updateSubTitle( undefined, 'show-setup-BOM' );
      setEvent('click');
      console.log('from hover to ' + event );
      return;
    }
  }

  return (
    ( props.component.displayLogic.selected ?
      ( `${event}` === 'hover' ?
      <Popup
        trigger={
          <i
            key={`component-${props.component.displayLogic.key}`}
            id={`#component-${props.component.displayLogic.key}`}
            type="icon"
            onClick={setEventState}
            // 'cursor-pointer text-primary border-0 py-0 px-2 fa fw fa-edit' + (props.component.displayLogic.selected ? ' bg-info' : ' ');
            className={`${_className}`}/>
        }
          closeOnDocumentClick={false}
          on={event}
          position={'right top'}
          defaultOpen={false}
          contentStyle={{ padding: '0px', border: 'none', backgroundColor: `${styles.cciBgColor}`}} 
          mouseLeaveDelay={0}
          mouseEnterDelay={100}
          arrow={true}
          arrowStyle={{backgroundColor: `${styles.cciBgColor}`}}>
          <span className={'text-primary'} >{t('commands:show-setup-BOM')}</span>
      </Popup>
      :
      <Popup
        trigger={
          <i
            key={`component-${props.component.displayLogic.key}`}
            id={`#component-${props.component.displayLogic.key}`}
            type="icon"
            // 'cursor-pointer text-primary border-0 py-0 px-2 fa fw fa-edit' + (props.component.displayLogic.selected ? ' bg-info' : ' ');
            className={`${_className}`}/>
        }
          closeOnDocumentClick={false}
          on={event}
          onClose={setEventState}
          position={'right top'}
          defaultOpen={false}  
          contentStyle={{ padding: '0px', border: 'none', backgroundColor: `${styles.cciBgColor}`}} 
          arrow={true}
          arrowStyle={{backgroundColor: `${styles.cciBgColor}`}}>
          {close => (
            <div className='d-flex'>
              <div className={'d-flex flex-column'} style={{backgroundColor:`${styles.cciBgColor}`}}>
                <div className={'d-flex text-primary justify-content-between pl-8'}>
                  <span style={{fontWeight: 'bold'}}> {t('commands:show-setup-BOM')}</span> 
                  <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
                </div>
                <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.hDividerStyle}/>
                <div className={'d-flex  justify-content-between'}>
                  <TextInput
                    title='part-name'
                    id={-1}
                    cellCnt={1}
                    toolTipPosition='bottom center'
                    mrpInputType='component'
                    value={props.component.businessLogic.name}
                    component={props.component}
                    handler={setPartName}/>
                  <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
                </div>

                <hr  className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>
                
                <div className={'d-flex  justify-content-between'}>
                  <TextInput
                      title='part-number'
                      id={-1}
                      cellCnt={1}
                      mrpInputType='component'
                      value={props.component.bom.core.partNumber}
                      component={props.component}
                      handler={setPartNumber}/>
                    <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
                </div>
                { props.component.businessLogic.parentIds.length === 0 ?
                  null
                  :
                  <div>
                    <hr  className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>
                      <div className={'d-flex  justify-content-between'}>
                        <NumberInput
                          title='unit-quantity'
                          cellCnt={1}
                          mrpInputType='component'
                          value={ props.component.bom.core.unitQty} // value='' input field shows placeholder text
                          component={props.component}
                          handler={setUnitQty}/>

                        <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/> 
                      </div>
                  </div>
                }

                <hr  className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>

                <div className={'d-flex  justify-content-between'}>
                  <TextInput
                      title='unit-of-measure'
                      id={-1}
                      cellCnt={1}
                      mrpInputType='component'
                      value={props.component.bom.core.unitOfMeasure }
                      component={props.component}
                      handler={setUnitOfMeasure}/>
                   <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
                </div>
               
                <hr  className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>
              </div> 
            <div className='align-self-start'>
                <i id={`${props.component.displayLogic.key}-setupBOM`}
                  className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                  // style={{backgroundColor: `${styles.cciBgColor}`}}
                  onClick={ close }/>        
            </div>
            </div>
            )
          }
      </Popup>
      )
      :
      null
    )
  )
}
