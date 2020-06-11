import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

import { dividerCCS, isValidString, isValidValue, getRandomInt } from "./CCiLabUtility";
import {DateInput} from "./CCiLabDateInput"
import {NumberInput} from "./CCiLabNumberInput"
import {TextInput} from "./CCiLabTextInput"


//re-initialize child component's PDP all the time before showing it in MPS table
//if components isn't defined then it initializes the root component
export const initializePDP=( component, components )=>{
  let pdp = {};
  if( typeof components !== 'undefined' && component.businessLogic.parentIds.length )
  {
    pdp = calculatePDP( component, components);
  }
  else{
    if( component.businessLogic.parentIds.length === 0 )
    {
       pdp= JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_pdp`)) || _initializePDP();
    }
    else
    {
      pdp = 'undefined';
    }
  }
 
  return pdp;
}


const _initializePDP=()=>{
  let pdp={};
  pdp.demandAndEndDateArray= [{completeDate: null, requiredQuantity: null}]; //array - required quantity of product/component and completed date as key-value 
  pdp.customer=null;
  pdp.orderNumber=null;
  return pdp;
}

// demandAndEndDateArray =[{ completeDate: end-date-1, requiredQuantity: demand-quantity},{ completeDate: end-date-2, requiredQuantity: demand-quantity}]
// based on parent component to derive pdp of current component
// pdp.demandAndEndDateArray.completeDate = parent's pap complete time + parent's op lead time
// pdp.demandAndEndDateArray.demand = parent's demand * component bom_core.unitQty 
const getChildCompleteDemandAndDateArray=( component, components)=>{


}


// from top components find:
// pdp.customer = parent component name in MPS table
// pdp.orderNumber =  order number in MPS table
const calculatePDP=( component, components)=>{
  let pdp = {};
  for (let index = 0; index < components.length; index++) {
    const element = components[index];

    const parentId = element.businessLogic.parentIds[0];
    //find the right component
    if( element.businessLogic.id === component.businessLogic.id && 
      parentId === component.businessLogic.parentIds[0])
    { 
      const parent = components.find( _element=> _element.businessLogic.id === parentId );
      pdp.customer = parent.businessLogic.name;
      pdp.orderNumber = null;
      pdp.demandAndEndDateArray = getChildCompleteDemandAndDateArray( component, components);
    }
    
  };

  return pdp;
}


//Production Demand Plan
export const SetupPDP=(props)=>{
  const { t } = useTranslation('commands', {useSuspense: false});
  
  const _PDPIconClassName = 'cursor-pointer text-primary border-0 p-1 fa fw fa-edit' + (props.component.displayLogic.selected ? ' component_selected' : ' ');


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
    if( component.pdp === 'undefined' )
      component.pdp = new initializePDP( component );

    let {isValid, value} = isValidValue(qty);

    if( isValid )
    {
        for( let item of demandDateArray )
        {
          const id = demandDateArray.indexOf( item );
          if( id === index )
          {
            item.requiredQuantity = value;
            break;
          }
        }
     }

    saveValidPDPEntry(component);
  }

  //have to be in-sync with forecast demand
  const setCompleteDate=(index, completeDate, component)=>{
    if( component.pdp === 'undefined' )
      component.pdp = new initializePDP( component );

    if( isValidString( completeDate ))
    {
      for( let item of demandDateArray )
      {
        const id = demandDateArray.indexOf( item );
        if( id === index )
        {
          item.completeDate = completeDate;
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
    demandDateArray.push({completeDate:null,requiredQuantity:null});
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
     <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
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
        return renderDemandDateInput( getRandomInt(100), id, item.completeDate, item.requiredQuantity, id ===  demandDateArray.length - 1 ? true : false )
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
            // 'cursor-pointer text-primary border-0 py-0 px-2 fa fw fa-edit' + (props.component.displayLogic.selected ? ' component_selected' : ' ');
            className={`${_PDPIconClassName}`}/>
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
            className={`${_PDPIconClassName}`}/>
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
            <div className='d-flex'>   
              <div className={'d-flex flex-column'} style={{backgroundColor:`${styles.cciBgColor}`}}>
                <div className={'d-flex text-primary justify-content-between pl-8'}>
                    <span style={{fontWeight: 'bold'}}> {t('commands:show-setup-PDP')}</span> 
                    <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
                  </div>
                  <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.hDividerStyle}/>


                <div className={'d-flex justify-content-between'} >
                  <TextInput
                    title='customer-name'
                    id={-1}
                    cellCnt={1}
                    toolTipPosition='bottom center'
                    mrpInputType='component'
                    value={props.component.pdp.customer} //array of demands for each period 
                    component={props.component}
                    handler={setCustomerName}/>
                  <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
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
                 <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
                </div>
                
                <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>

                {renderDemandDateInputs()}
                <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>
               
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
