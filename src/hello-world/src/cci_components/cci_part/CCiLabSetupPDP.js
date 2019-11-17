import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

import { dividerCCS, isValidString, isValidValue, getRandomInt } from "./CCiLabUtility";
import {DateInput} from "./CCiLabDateInput"
import {NumberInput} from "./CCiLabNumberInput"
import {TextInput} from "./CCiLabTextInput"



export const initializePDP=( component )=>{
  let pdp= JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_pdp`)) || _initializeMPS();
  return pdp;
}

// demandAndEndDateArray =[[id-1, end-date-1, demand-quantity],[id-2, end-date-2, demand-quantity]]
const _initializeMPS=()=>{
   let pdp={};
   pdp.demandAndEndDateArray= [[null,null]]; //array - required quantity of product/component and completed date as key-value 
   pdp.customer=null;
   pdp.orderNumber=null;
   return pdp;
}

//Production Demand Plan
export const SetupPDP=(props)=>{
  const { t } = useTranslation('commands', {useSuspense: false});
  
  const _PDPIconClassName = 'cursor-pointer text-primary border-0 p-1 fa fw fa-edit' + (props.component.displayLogic.selected ? ' bg-info' : ' ');


  const [event, setEvent] = useState('hover'); // 'hover' is the initial state value


    
  if( props.component.pdp === null || typeof props.component.pdp === 'undefined' )
  {
    props.component.pdp = new initializePDP(props.component);
  }

  const [demandDateArray, setDemandDateArray] = useState(props.component.pdp.demandAndEndDateArray);

  // component.displayLogic.inlineMenuEnabled needs set to true
  const saveValidPDPEntry=( component )=>{
    console.log("SetupPDP - saveValidPDPEntry:  update current table");
    component.pdp.demandAndEndDateArray = demandDateArray;
    sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_pdp`, JSON.stringify( component.pdp ));
    props.updateTable();
  }


  const setCustomerName=(index, customerName, component)=>{
    if( isValidString( customerName ))
        component.pdp.customer=customerName;
    else
      component.pdp.customer='';  //reset to initial value to fail saveValidPDPEntry evaluation

    saveValidPDPEntry(component);
    // console.log("SetupPDP - setCustomerName: " + component.pdp.customer);
  };

  const setCustomerOrder=(index, OrderNumber, component)=>{
    if( isValidString( OrderNumber ))
        component.pdp.orderNumber=OrderNumber;
    else
      component.pdp.orderNumber='';  //reset to initial value to fail saveValidPDPEntry evaluation

    saveValidPDPEntry(component);
  };

  const setTotalRequiredQty=(index, qty, component)=>
  {
    if( typeof component.pdp === 'undefined' )
      component.pdp = new initializePDP( component );

    let {isValid, value} = isValidValue(qty);

    if( isValid )
    {
        for( let item of demandDateArray )
        {
          const id = demandDateArray.indexOf( item );
          if( id === index )
          {
            item[1] = value;
            break;
          }
        }
     }

    saveValidPDPEntry(component);
  }

  //have to be in-sync with forecast demand
  const setCompleteDate=(index, completeDate, component)=>{
    if( typeof component.pdp === 'undefined' )
      component.pdp = new initializePDP( component );

    if( isValidString( completeDate ))
    {
      for( let item of demandDateArray )
      {
        const id = demandDateArray.indexOf( item );
        if( id === index )
        {
          item[0] = completeDate;
          break;
        }
      }
    }

    saveValidPDPEntry(component);
  }

  //hover to popup tooltip, click/focus to popup setup pdp inputs
  // based on event from mouse or click for desktop devices, click for touch devices
  const setEventState=()=>
  {
    if( event === 'click' )
    {
       props.updateSubTitle( undefined, 'subTitle-BOM-data' );
       setEvent('hover');
       return;
    }
    if( event === 'hover' )
    {
      props.updateSubTitle( undefined, 'show-setup-PDP' );
      setEvent('click');
      return;
    }
  }

  const AddNextDemandEntry=(index)=>(e)=>{
    demandDateArray.push([null,null]);
    saveValidPDPEntry(props.component);
    setDemandDateArray( demandDateArray );
    window.dispatchEvent(new Event('resize'));  //resize popup menu
  }

  const removeDemandEntry=(index)=>(e)=>{
    for( let item of demandDateArray )
    {
      const id = demandDateArray.indexOf( item );
      if( id === index )
      {
        demandDateArray.splice(id, 1);
      }
    }
    
    saveValidPDPEntry(props.component);
    setDemandDateArray( demandDateArray );
    window.dispatchEvent(new Event('resize'));   //resize popup menu
  }

  

 const renderDemandDateInput=(uniqueKey, index, endDate, demand, isLastElement )=>{
  return(
    <div key={uniqueKey} >
    <div className={'d-flex justify-content-between'} >  
      <DateInput
         title='product-complete-date'   //array of completed date for each required quantity
         id={index}
         cellCnt={2}
         mrpInputType='component'
         value={ endDate }
         component={props.component}
         handler={setCompleteDate}/>

     <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    
     
     <NumberInput
         title='required-quantity'
         id={index}
         cellCnt={2}
         mrpInputType='component'
         value={( demand !== null && demand > 0 ) ? demand : ''} //array of demands for each period 
         component={props.component}
         handler={setTotalRequiredQty}/>
         
     { isLastElement === true ?
       <i id={`${index}`}
         className='text-info m-0 py-1 px-1 fas fw fa-plus-circle cursor-pointer'
         style={{backgroundColor: `${styles.cciBgColor}`}}
         onClick={AddNextDemandEntry(index)}/>
         :
         <i id={`${index}`}
         className='text-danger m-0 py-1 px-1 fas fw fa-minus-circle cursor-pointer'
         style={{backgroundColor: `${styles.cciBgColor}`}}
         onClick={removeDemandEntry(index)}/>
     } 
     </div>
    { isLastElement !== true ?
      <hr  className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>
      :
      null
    }
     </div>
  );
 }

  const renderDemandDateInputs=()=>{
    return (
      demandDateArray.map( ( item )=>{
        let id = demandDateArray.indexOf(item);
        return renderDemandDateInput( getRandomInt(100), id, item[0], item[1], id ===  demandDateArray.length - 1 ? true : false )
      } )
    )
  }

  return (
    // for manufacturing only show root pdp, all sub components are derived from it programmatically
    ( props.component.displayLogic.selected && ( props.component.businessLogic.parentIds.length === 0 || props.component.stocking )? 
      ( `${event}` === 'hover' ? 
      <Popup  //show tool tip to setup PDP when mouse hover the icon
        trigger={
          <i
            key={`component-${props.component.displayLogic.key}`}
            id={`#component-${props.component.displayLogic.key}`}
            type="icon"
            onClick={setEventState}
            // 'cursor-pointer text-primary border-0 py-0 px-2 fa fw fa-edit' + (props.component.displayLogic.selected ? ' bg-info' : ' ');
            className={`${_PDPIconClassName}`}
            style={{backgroundColor: `${styles.cciBgColor}`}}/>
        }
          closeOnDocumentClick={false}
          on={event}
          position={'right top'}
          defaultOpen={false}
          contentStyle={{ padding: '0px', border: 'none', backgroundColor: `${styles.cciBgColor}`}} 
          mouseLeaveDelay={0}
          mouseEnterDelay={400}
          arrow={true}
          arrowStyle={{backgroundColor: `${styles.cciBgColor}`}}>
          <span className={'text-primary'} >{t('commands:show-setup-PDP')}</span>
      </Popup>
      :
      <Popup  //show setup menu when user clicks the icon
        trigger={
          <i
            key={`component-${props.component.displayLogic.key}`}
            id={`#component-${props.component.displayLogic.key}`}
            type="icon"
            // _PDPIconClassName = 'cursor-pointer text-primary border-0 py-0 px-2 fa fw fa-edit' + (props.component.displayLogic.selected ? ' bg-info' : ' ');
            className={`${_PDPIconClassName}`}
            style={{backgroundColor: `${styles.cciBgColor}`}}/>
        }
          closeOnDocumentClick={false}
          on={event}
          onClose={setEventState}
          position={'right top'}
          defaultOpen={false}  
          contentStyle={{ padding: '0px', border: 'none', backgroundColor: `${styles.cciBgColor}`}} 
          arrow={true}
          arrowStyle={{backgroundColor: `${styles.cciBgColor}`}} >
          {close => (      
              <div className={'d-flex flex-column'} style={{backgroundColor:`${styles.cciBgColor}`}}>
                <div className={'d-flex justify-content-between'} >
                  <TextInput
                    title='customer-name'
                    id={-1}
                    cellCnt={3}
                    mrpInputType='component'
                    value={props.component.pdp.customer} //array of demands for each period 
                    component={props.component}
                    handler={setCustomerName}/>
                  <i id={`${props.component.displayLogic.key}-SetupPDP`}
                    className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                    style={{backgroundColor: `${styles.cciBgColor}`}}
                    onClick={ close }/>
                </div>

                <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>

                <div className={'d-flex justify-content-between'} >
                  <TextInput
                    title='customer-order-number'
                    id={-1}
                    cellCnt={1}
                    mrpInputType='component'
                    value={props.component.pdp.orderNumber} //array of demands for each period 
                    component={props.component}
                    handler={setCustomerOrder}/>
                  <i id={`${props.component.displayLogic.key}-SetupPDP`}
                    className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                    style={{backgroundColor: `${styles.cciBgColor}`}}
                    onClick={ close }/>
                </div>
                
                <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>

                {renderDemandDateInputs()}
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
