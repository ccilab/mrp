import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

import { dividerCCS, isValidString, isValidValue, getRandomInt } from "./CCiLabUtility";
import {DateInput} from "./CCiLabDateInput"
import {NumberInput} from "./CCiLabNumberInput"
import {TextInput} from "./CCiLabTextInput"
import {TimePeriod} from "./CCiLabTimePeriod"


export const initializeIRF=( component )=>{
  let irf= JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_irf`)) || _initializeIRF();
  return irf;
}

const _initializeIRF=()=>{
   let irf={};
   irf.inventoryOnHand=null;  //Initial Inventory, Beginning Inventory  
   irf.scheduledReceipts=[{date: null, quantity: null}];  //SR - date-quantity pair
   irf.maxAllowedEndingInventory=null; // Maximum Stock
   irf.minAllowedEndingInventory= null; //Safe Stock (SS)
  //  irf.procurementType=null;  //'InHouse'(to produce production order), 'Purchase'(to produce purchase order)
   irf.leadTime={value: null, timeUnit: ''};
   irf.otherProductionCostPerUnit=null; //other than employee costs
   irf.supplier='';   //string initialized to ''
   irf.supplierPartNumber='';
   irf.maxPurchasingAllowed=0;   //doesn't allowed for now
   irf.purchasingCostPerUnit=0;  //doesn't allowed for now
   irf.maxBackOrderAllowed=0;    //doesn't allowed for now
   irf.backOrderCostPerUnit=0;  //doesn't allowed for now
   irf.leadTime={value: null, timeUnit: ''};
 
   return irf;
}

//Inventory Records File
export const SetupIRF=(props)=>{
  const { t } = useTranslation('commands', {useSuspense: false});
  
  const _className = 'cursor-pointer text-primary border-0 p-1 fa fw fa-edit' + (props.component.displayLogic.selected ? ' component_selected' : ' ');

  const [event, setEvent] = useState('hover'); // '' is the initial state value

  if( props.component.irf === null || props.component.irf === 'undefined' )
  {
    props.component.irf = new initializeIRF(props.component);
  }

  const procurementType = props.component.operation.procurementType;

  const [SRArray, setSRArray] = useState(props.component.irf.scheduledReceipts);

  // const [procurementType, setProcurement] = useState(props.component.irf.procurementType);

   // 
  const saveValidIRFEntry=( component )=>{
    component.irf.scheduledReceipts = SRArray;
    sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_irf`, JSON.stringify( component.irf ));
  }

  const setIOH=(index, ioh, component)=>{
    if( component.irf === 'undefined' )
      component.irf = new initializeIRF( component );

    let {isValid, value} = isValidValue(ioh);

     if( !isValid )
      component.irf.inventoryOnHand=null;
    else
      component.irf.inventoryOnHand=value;

    // required quantity for per shift per run
    saveValidIRFEntry(component);
  };

  const setSRQty=(index, qty, component)=>{
    if( component.irf === 'undefined' )
      component.irf = new initializeIRF( component );

      let {isValid, value} = isValidValue(qty);

      if( isValid )
      {
          for( let item of SRArray )
          {
            const id = SRArray.indexOf( item );
            if( id === index )
            {
              item.quantity = value;
              break;
            }
          }
      }

       saveValidIRFEntry(component);
  };

    //have to be in-sync with SR Qty
    const setSRDate=(index, completeDate, component)=>{
      if( component.irf === 'undefined' )
        component.irf = new initializeIRF( component );

      if( isValidString( completeDate ))
      {
        for( let item of SRArray )
        {
          const id = SRArray.indexOf( item );
          if( id === index )
          {
            item.date = completeDate;
            break;
          }
        }
  }

      saveValidIRFEntry(component);
    }

  const setMaxStock=(index, qty, component)=>{
    if( component.irf === 'undefined' )
    {
      component.irf = new initializeIRF( component );
    }

    //validation of value is done inside onUpdateValueEnterKey 
    let {isValid, value} = isValidValue(qty);
    if( !isValid )
      component.irf.maxAllowedEndingInventory=null;
    else
  {
      component.irf.maxAllowedEndingInventory=value;
  }

    saveValidIRFEntry(component); 
  }

  const setSS=(index, qty, component)=>{
    if( component.irf === 'undefined' )
      component.irf = new initializeIRF( component );

    let {isValid, value} = isValidValue(qty);

    if( !isValid )
      component.irf.minAllowedEndingInventory=null;
    else
    {
      component.irf.minAllowedEndingInventory=value;

      if( component.irf.maxAllowedEndingInventory < value )
    {
        component.irf.maxAllowedEndingInventory = value;
      }

    }


    saveValidIRFEntry(component); 
  }

  // const setProcurementType=(index, procurementType, component)=>{
  //   if( component.irf === 'undefined' )
  //     component.irf = new initializeIRF( component );

  //   if( isValidString(procurementType) )
  //     component.irf.procurementType = procurementType;
  //   else
  //     component.irf.procurementType = null;

  //   setProcurement(component.irf.procurementType);

  //   saveValidIRFEntry(component); 
  // }


  //unit in local currency
  // const setOtherCostPerUnit=(index, cost, component)=>{
  //   if( component.irf === 'undefined' )
  //     component.irf = new initializeIRF( component );

  //   let {isValid, value} = isValidValue(cost);

  //   if( !isValid )
  //     component.irf.otherProductionCostPerUnit=null;
  //   else
  //     component.irf.otherProductionCostPerUnit=value;

  //   saveValidIRFEntry(component); 
  // }



  // const setInterest=(index, interest, component)=>{
  //   if( component.irf === 'undefined' )
  //     component.irf = new initializeIRF( component );

  //   let {isValid, value} = isValidValue(interest);

  //   if( !isValid )
  //     component.irf.interest=null;
  //   else
  //     component.irf.interest=value;

  //   saveValidIRFEntry(component); 
  // }

  const setSupplier=(index, supplierName, component)=>{
    if( isValidString( supplierName ))
        component.irf.supplier=supplierName;
    else
      component.irf.supplier='';  

      saveValidIRFEntry(component); 
  };

  const setSupplierPartNumber=(index, supplierPartNumber, component)=>{
    if( isValidString( supplierPartNumber ))
        component.irf.supplierPartNumber=supplierPartNumber;
    else
      component.irf.supplierPartNumber='';  

      saveValidIRFEntry(component); 
  };

    // followed with unit (days, weeks, months)
    const setLeadTime=(index, qty, timePeriodUnit, component)=>{
      if( component.irf === 'undefined' )
        component.irf = new initializeIRF( component );
  
      let {isValid, value} = isValidValue(qty);
  
      if( !isValid )
      {
        component.irf.leadTime={value: null, timeUnit: t('commands:day')};
      }
      else
      {
          component.irf.leadTime={value: value, timeUnit: timePeriodUnit };;
      }
    
      saveValidIRFEntry(component); 
    }
  

  //hover to popup tooltip, click/focus to popup setup BOM inputs
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
      props.updateSubTitle( undefined, 'show-setup-IRF' );
      setEvent('click');
      return;
    }
  }

  const AddNextSREntry=(index)=>(e)=>{
    SRArray.push({date:null,quantity: null});
    saveValidIRFEntry(props.component);
    setSRArray( SRArray );
    window.dispatchEvent(new Event('resize'));  //resize popup menu
  }

  const removeSREntry=(index)=>(e)=>{
    for( let item of SRArray )
    {
      const id = SRArray.indexOf( item );
      if( id === index )
      {
        SRArray.splice(id, 1);
      }
    }
    
    saveValidIRFEntry(props.component);
    setSRArray( SRArray );
    window.dispatchEvent(new Event('resize'));   //resize popup menu
  }

  

 const renderSRInput=(uniqueKey, index, srDate, demand, isLastElement )=>{
  return(
    <div key={uniqueKey+1} >
      <div key={uniqueKey} className={'d-flex justify-content-between'}>  
        <DateInput
         title='scheduled-receipts-date'   //array of completed date for each required quantity
         toolTipPosition='bottom center'
         id={index}
         cellCnt={2}
         mrpInputType='inventoryRecords'
         value={ srDate }
         component={props.component}
         handler={setSRDate}/>
        <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
     
        <NumberInput
         title='scheduled-receipts-quantity'
         toolTipPosition='bottom center'
         id={index}
         cellCnt={3}
         mrpInputType='inventoryRecords'
         value={( demand !== null && demand >= 0 ) ? demand : ''} //array of demands for each period 
         component={props.component}
         handler={setSRQty}/>
         
      { isLastElement === true ?
        <i id={`${index}`}
         className='text-info m-0 py-1 px-1 fas fw fa-plus-circle cursor-pointer'
         style={{backgroundColor: `${styles.cciBgColor}`, width: '1.5em'}}
         onClick={AddNextSREntry(index)}/>
         :
         <i id={`${index}`}
         className='text-danger m-0 py-1 px-1 fas fw fa-minus-circle cursor-pointer'
         style={{backgroundColor: `${styles.cciBgColor}` , width: '1.5em'}}
         onClick={removeSREntry(index)}/>
      } 
       <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
      </div>
      <hr  className={dividerCCS.hDividerClassName } style={dividerCCS.hDividerStyle}/>
    </div>
  );
 }

  const renderSRInputs=()=>{
    return (
      SRArray.map( ( item )=>{
        let id = SRArray.indexOf(item);
        return renderSRInput(getRandomInt(100), id, item.date, item.quantity, id ===  SRArray.length - 1 ? true : false )
      } )
    )
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
            // 'cursor-pointer text-primary border-0 py-0 px-2 fa fw fa-edit' + (props.component.displayLogic.selected ? 'component_selected' : ' ');
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
          <span className={'text-primary'} >{t('commands:show-setup-IRF')}</span>
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
              <div className={'d-flex text-primary justify-content-between pl-6'}>
                    <span style={{fontWeight: 'bold'}}> {t('commands:show-setup-IRF')}</span> 
                    <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
              </div>
              
              <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.hDividerStyle}/>

              {renderSRInputs()}



              {/* <div className={'d-flex  justify-content-between'}>
                <RadioInput
                    title='procurement-type'
                    id={-1}
                    cellCnt={2}
                    mrpInputType='inventoryRecords'
                    radio1='in-house'
                    radio2='purchase'
                    value={props.component.irf.procurementType }
                    component={props.component}
                    handler={setProcurementType}/>

                <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
              </div>

              <hr className={dividerCCS.hDividerClassName } style={dividerCCS.hDividerStyle}/> */}

              { ( procurementType === 'purchase' ? 
                  <div className={'d-flex  justify-content-between'}>
                    <TextInput
                      title='supplier-name'
                      id={-1}
                      cellCnt={2}
                      mrpInputType='inventoryRecords'
                      value={props.component.irf.supplier }
                      component={props.component}
                      handler={setSupplier}/>

                    <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>

                    <TextInput
                      title='supplied-part-number'
                      id={-1}
                      cellCnt={2}
                      mrpInputType='inventoryRecords'
                      value={props.component.irf.supplierPartNumber }
                      component={props.component}
                      handler={setSupplierPartNumber}/>

                    <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
                  </div>
                
                  :
                  null
                )
              }
              { ( procurementType === 'purchase' ? 
                    <hr className={dividerCCS.hDividerClassName } style={dividerCCS.hDividerStyle}/>
                    :
                    null
                  )
              }

              <div className={'d-flex  justify-content-between'}>
                  <TimePeriod
                        title='lead-time-quantity'
                        id={-1}
                        cellCnt={2}
                        toolTipPosition='bottom center'
                        mrpInputType='operations'
                        leadTime={  props.component.irf.leadTime }
                        component={props.component}
                        handler={setLeadTime}/>
             
                    <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>

                  <NumberInput
                          title='inventory-on-hand-quantity'
                          id={-1}
                          cellCnt={2}
                          toolTipPosition='bottom center'
                          mrpInputType='inventoryRecords'
                          value={props.component.irf.inventoryOnHand}
                          component={props.component}
                          handler={setIOH}/>

                  <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
                 
                </div>
 
              <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.hDividerStyle}/>
                <div className={'d-flex  justify-content-between'}> 
                  <NumberInput
                      title='mim-allowed-ending-inventory-quantity'
                      id={-1}
                      cellCnt={2}
                      mrpInputType='inventoryRecords'
                      value={props.component.irf.minAllowedEndingInventory }
                      component={props.component}
                      handler={setSS}/>

                  <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>

                  <NumberInput
                      title='max-allowed-ending-inventory-quantity'
                      id={-1}
                      cellCnt={2}
                      mrpInputType='inventoryRecords'
                      value={ ( props.component.irf.maxAllowedEndingInventory !== null ) && ( props.component.irf.minAllowedEndingInventory > props.component.irf.maxAllowedEndingInventory )  ?  props.component.irf.minAllowedEndingInventory : props.component.irf.maxAllowedEndingInventory}
                      component={props.component}
                      handler={setMaxStock}/>
                   <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
                </div>

                <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.hDividerStyle}/>

                <div className={'d-flex  justify-content-between'}> 
                  <NumberInput
                      title='th-lot-method'
                      id={-1}
                      cellCnt={2}
                      mrpInputType='mps'
                      value={props.component.irf.minAllowedEndingInventory }
                      component={props.component}
                      handler={setSS}/>

                  <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>

                  <NumberInput
                      title='th-lot-size'
                      id={-1}
                      cellCnt={2}
                      mrpInputType='mps'
                      value={ ( props.component.irf.maxAllowedEndingInventory !== null ) && ( props.component.irf.minAllowedEndingInventory > props.component.irf.maxAllowedEndingInventory )  ?  props.component.irf.minAllowedEndingInventory : props.component.irf.maxAllowedEndingInventory}
                      component={props.component}
                      handler={setMaxStock}/>
                   <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
                </div>

                {/* <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/> */}
            </div>
            <div className='align-self-start'>
              <i id={`${props.component.displayLogic.key}-SetupIRF`}
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
