import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

import { dividerCCS, isValidString, isValidValue } from "./CCiLabUtility";


const SetupComponentIR=(props)=>{
  const { t } = useTranslation(['inventoryRecords','commands'], {useSuspense: false});

  let inputValue = (props.value === null)? '': props.value;

  let inputClassName = 'text-primary m-0 p-0 border-0 cursor-pointer';
  let cellWidth = (typeof props.cellCnt !== 'undefined' && props.cellCnt === 1) ?  '20rem' : '10rem';
  let inputStyle={'backgroundColor': `${styles.cciBgColor}`, width: `${cellWidth}`};
  let inputType='text';
  let tooltipOnMode=['click','hover'];
  let tooltipPosition='top left';
  let inputName=props.title;
  let inputProcurementType = props.title.includes('procurement-type') ? true : false;
  let appendPercentage = props.title.includes('-rate')  ? true : false;

  let rateInputElement = React.createRef();


  if( props.title.includes('inventory-on-hand'))
  {
    tooltipPosition='bottom left';
  }

  if( props.title.includes('-date') )
  {
    inputType='date';
  }

  if( props.title.includes('procurement-type'))
  {
    inputClassName = 'm-0 p-0 border-0 cursor-pointer';
    inputStyle={'backgroundColor': `${styles.cciBgColor}`, 'height':'20px','width':'20px'};
    inputType='radio';
  }

  if( props.title.includes('-quantity') )
  {
     inputType='number';
  }

  if( appendPercentage )
  {
    let value =  parseFloat(inputValue);
    if( isNaN( value ) )
      inputValue='';
    else
      inputValue = value + '(%)';
  }


  const [input, setInput] = useState(`${inputValue}`); // '' is the initial state value

  const filterInputValue=( e )=>{
      // https://stackoverflow.com/questions/10023845/regex-in-javascript-for-validating-decimal-numbers
      // https://regexr.com/ test expression
      setInput(e.target.value);
  };

  const rateAppendPercentage=(_value)=>{
    let value=parseFloat(_value);
    if( isNaN(value) )
      value='';
    else
      value += value ? ' (%)' : '';

    setInput(value);
  };

  const onBlurHandler=(e)=>{
    rateAppendPercentage(e.target.value);
  };

  // https://blog.bitsrc.io/understanding-currying-in-javascript-ceb2188c339
  const updateValue=(props)=>(e)=>{
    onUpdateValueEnterKey( props, e.target);
  }

  const onUpdateValueEnterKey=(props, target )=>{
    if( typeof props.handler !== 'undefined')
    {
      let value = target.value;
      if( props.title.includes('max-allowed-ending-inventory-quantity') )
      {
        let _value=parseFloat(value);
        if( isNaN(_value) || _value < props.component.irf.minAllowedEndingInventory )
        {
          value=props.component.irf.minAllowedEndingInventory;
          setInput(value);
        }
      }
      console.log("SetupComponentIR - updateValue: " + target.value);

      props.handler(props.id, value, props.component);

    }
  }

  const enterKeyHandler=(e)=>{
    if( typeof e.key !== 'undefined' && e.key ==='Enter')
    {
      if( appendPercentage )
      {
        rateAppendPercentage(rateInputElement.current.value);
      }
      else
      {
        onUpdateValueEnterKey(props, e.target);
      }
    }
  };

  const updateChange=(props)=>(e)=>{
    console.log("SetupComponentIR - updateChange: " + e.target.value);
  }



  // https://medium.freecodecamp.org/reactjs-pass-parameters-to-event-handlers-ca1f5c422b9
  // m-0 py-1 border-0
  // return (className='d-flex justify-content-between'
  return (
    <div style={{backgroundColor: `${styles.cciBgColor}`}}>
       { inputProcurementType ?
          <Popup
            trigger={
              // <div className='d-flex  justify-content-between'>
              <div className='d-flex' >
                <span className='align-items-center m-0 y-0 border-0' >
                  <input className={`${inputClassName}`}
                        id={`${inputName}-1`}
                        type={inputType}
                        name={inputName}
                        style={inputStyle}
                        value={'InHouse'}
                        defaultChecked ={ inputValue.includes('InHouse') ? true : false}
                        onChange={updateValue(props)}
                        onClose={updateValue(props)}/>
                  <label className={'m-0 px-1 border-0 cursor-pointer'}
                    htmlFor={`${inputName}-1`}
                    style={{'backgroundColor': `${styles.cciBgColor}`, 'color': inputValue.includes('InHouse') ? `${styles.cciInfoBlue}` : `${styles.cciHintRed}`}}>
                     {t(`inventoryRecords:in-house`)}
                    </label>
                </span>
                {/* <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/> */}
                <span className='align-items-center m-0 y-0 border-0'>
                  <input  className={`${inputClassName}`}
                          id={`${inputName}-2`}
                          type={inputType}
                          name={inputName}
                          style={inputStyle}
                          value={'Purchase'}
                          defaultChecked ={ inputValue.includes('Purchase') ? true : false}
                          onChange={updateValue(props)}
                          onClose={updateValue(props)}/>
                   <label className={'m-0 px-1 border-0 cursor-pointer'}
                    htmlFor={`${inputName}-2`}
                    style={{'backgroundColor': `${styles.cciBgColor}`, 'color': inputValue.includes('Purchase') ? `${styles.cciInfoBlue}` : `${styles.cciHintRed}`}}>
                     {t('inventoryRecords:purchase') }
                    </label>
                </span>
              </div>
            }
            id={`${props.component.displayLogic.key}-tooltip`}
            position={tooltipPosition}
            closeOnDocumentClick
            on={tooltipOnMode}
            arrow={true}
            arrowStyle={{backgroundColor: 'white'}}
            mouseLeaveDelay={0}
            mouseEnterDelay={0}
            contentStyle={{  padding: '0px' }}>
            <div className='text-nowrap m-0 p-1'>
              {t(`inventoryRecords:${props.title}`)}
            </div>
        </Popup>
          :
          <Popup
              trigger={
                <input key={props.id}
                      className={`${inputClassName}`}
                      ref={ appendPercentage? rateInputElement : null }
                      id={inputName}
                      type={`${inputType}`}
                      style={inputStyle}
                      placeholder={t(`inventoryRecords:${props.title}`)}
                      name={inputName}
                      value={ input }
                      min = { inputType.includes('number') ? 0: null}
                      onChange={appendPercentage ? updateValue(props) : updateChange(props)}
                      onClose={updateValue(props)}
                      onInput={(e)=>{filterInputValue(e)}}
                      onKeyPress={ (e)=>enterKeyHandler(e) }
                      onBlur={ appendPercentage ? (e)=>{onBlurHandler(e)} :updateValue(props)}/>
              }
              id={`${props.component.displayLogic.key}-tooltip`}
              position={tooltipPosition}
              closeOnDocumentClick
              on={tooltipOnMode}
              arrow={true}
              arrowStyle={{backgroundColor: 'white'}}
              mouseLeaveDelay={0}
              mouseEnterDelay={0}
              contentStyle={{ padding: '0px'}}
              >
              <div className='text-nowrap m-0 px-1'>
                {t(`inventoryRecords:${props.title}`)}
              </div>
          </Popup>
       }

    </div>
  );
}


export const initializeIRF=( component )=>{
  let irf= JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_irf`)) || _initializeIRF();
  return irf;
}

const _initializeIRF=()=>{
   let irf={};
   irf.inventoryOnHand=null;  //Initial Inventory, Beginning Inventory  
   irf.scheduledReceipts=[[null,null]];  //SR - date-quantity pair
   irf.maxAllowedEndingInventory=null; // Maximum Stock
   irf.minAllowedEndingInventory= null; //Safe Stock (SS)
   irf.procurementType=null;  //'InHouse'(to produce production order), 'Purchase'(to produce purchase order)
   irf.leadTime=null;
   irf.otherProductionCostPerUnit=null; //other than employee costs
   irf.holdingCostPerUnit=null;  //Inventory holding cost per unit
   irf.interest=null;
   irf.supplier='';   //string initialized to ''
   irf.supplierPartNumber='';
   irf.maxPurchasingAllowed=0;   //doesn't allowed for now
   irf.purchasingCostPerUnit=0;  //doesn't allowed for now
   irf.maxBackOrderAllowed=0;    //doesn't allowed for now
   irf.backOrderCostPerUnit=0;  //doesn't allowed for now
 
   return irf;
}

//Inventory Records File
export const SetupIRF=(props)=>{
  const { t } = useTranslation('commands', {useSuspense: false});
  
  const _className = 'cursor-pointer text-primary border-0 p-1 fa fw fa-edit' + (props.component.displayLogic.selected ? ' bg-info' : ' ');

  const [event, setEvent] = useState('hover'); // '' is the initial state value

  if( props.component.irf === null || typeof props.component.irf === 'undefined' )
      {
    props.component.irf = new initializeIRF(props.component);
      }

  const [SRArray, setSRArray] = useState(props.component.irf.scheduledReceipts);

  const [procurementType, setProcurement] = useState(props.component.irf.procurementType);

   // 
  const saveValidIRFEntry=( component )=>{
    component.irf.scheduledReceipts = SRArray;
    sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_irf`, JSON.stringify( component.irf ));
          }

  const setIOH=(index, ioh, component)=>{
    if( typeof component.irf === 'undefined' )
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
    if( typeof component.irf === 'undefined' )
      component.irf = new initializeIRF( component );

      let {isValid, value} = isValidValue(qty);

      if( isValid )
          {
          for( let item of SRArray )
          {
            const id = SRArray.indexOf( item );
            if( id === index )
            {
              item[1] = value;
              break;
            }
          }
      }

       saveValidIRFEntry(component);
  };

    //have to be in-sync with SR Qty
    const setSRDate=(index, completeDate, component)=>{
      if( typeof component.irf === 'undefined' )
        component.irf = new initializeIRF( component );

      if( isValidString( completeDate ))
      {
        for( let item of SRArray )
        {
          const id = SRArray.indexOf( item );
          if( id === index )
          {
            item[0] = completeDate;
            break;
          }
        }
  }

      saveValidIRFEntry(component);
    }

  const setMaxStock=(index, qty, component)=>{
    if( typeof component.irf === 'undefined' )
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
    if( typeof component.irf === 'undefined' )
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

  const setProcurementType=(index, procurementType, component)=>{
    if( typeof component.irf === 'undefined' )
      component.irf = new initializeIRF( component );

    if( isValidString(procurementType) )
      component.irf.procurementType = procurementType;
    else
      component.irf.procurementType = null;

    setProcurement(component.irf.procurementType);

    saveValidIRFEntry(component); 
  }

  // followed with unit (days, weeks, months)
  const setLeadTime=(index, qty, component)=>{
    if( typeof component.irf === 'undefined' )
      component.irf = new initializeIRF( component );

    let {isValid, value} = isValidValue(qty);

    if( !isValid )
      component.irf.leadTime=null;
    else
      component.irf.leadTime=value;

    saveValidIRFEntry(component); 
  }

  //unit in local currency
  const setOtherCostPerUnit=(index, cost, component)=>{
    if( typeof component.irf === 'undefined' )
      component.irf = new initializeIRF( component );

    let {isValid, value} = isValidValue(cost);

    if( !isValid )
      component.irf.otherProductionCostPerUnit=null;
    else
      component.irf.otherProductionCostPerUnit=value;

    saveValidIRFEntry(component); 
  }


  const setHoldingCostPerUnit=(index, cost, component)=>{
    if( typeof component.irf === 'undefined' )
      component.irf = new initializeIRF( component );

    let {isValid, value} = isValidValue(cost);

    if( !isValid )
      component.irf.holdingCostPerUnit=null;
    else
      component.irf.holdingCostPerUnit=value;

    saveValidIRFEntry(component); 
  }

  const setInterest=(index, interest, component)=>{
    if( typeof component.irf === 'undefined' )
      component.irf = new initializeIRF( component );

    let {isValid, value} = isValidValue(interest);

    if( !isValid )
      component.irf.interest=null;
    else
      component.irf.interest=value;

    saveValidIRFEntry(component); 
  }

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
    SRArray.push([null,null]);
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
    <div>
      <div key={uniqueKey} className={'d-flex  justify-content-between'}>  
        <SetupComponentIR
         title='scheduled-receipts-date'   //array of completed date for each required quantity
         id={index}
         cellCnt={2}
         value={ srDate }
         component={props.component}
         handler={setSRDate}/>
        <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
     
        <SetupComponentIR
         title='scheduled-receipts-quantity'
         id={index}
         cellCnt={2}
         value={( demand !== null && demand >= 0 ) ? demand : ''} //array of demands for each period 
         component={props.component}
         handler={setSRQty}/>
         
      { isLastElement === true ?
        <i id={`${index}`}
         className='text-info m-0 py-1 px-1 fas fw fa-plus-circle cursor-pointer'
         style={{backgroundColor: `${styles.cciBgColor}`}}
         onClick={AddNextSREntry(index)}/>
         :
         <i id={`${index}`}
         className='text-danger m-0 py-1 px-1 fas fw fa-minus-circle cursor-pointer'
         style={{backgroundColor: `${styles.cciBgColor}`}}
         onClick={removeSREntry(index)}/>
      } 
      </div>
      <hr  className={dividerCCS.hDividerClassName } style={dividerCCS.hDividerStyle}/>
    </div>
  );
 }

  const renderSRInputs=()=>{
    return (
      SRArray.map( ( item )=>{
        let id = SRArray.indexOf(item);
        return renderSRInput( Math.random(), id, item[0], item[1], id ===  SRArray.length - 1 ? true : false )
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
            // 'cursor-pointer text-primary border-0 py-0 px-2 fa fw fa-edit' + (props.component.displayLogic.selected ? ' bg-info' : ' ');
            className={`${_className}`}
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
            className={`${_className}`}
            style={{backgroundColor: `${styles.cciBgColor}`}}/>
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
            <div className={'d-flex flex-column'} style={{backgroundColor:`${styles.cciBgColor}`}}>
              <div className={'d-flex justify-content-between'}>
                  <SetupComponentIR
                    title='inventory-on-hand-quantity'
                    id={-1}
                    cellCnt={2}
                    value={props.component.irf.inventoryOnHand}
                    component={props.component}
                    handler={setIOH}/>

                <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>

                  <SetupComponentIR
                    title='lead-time-quantity'
                    id={-1}
                    cellCnt={2}
                    value={props.component.irf.leadTime }
                    component={props.component}
                    handler={setLeadTime}/>
                  <i id={`${props.component.displayLogic.key}-SetupIRF`}
                    className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                    style={{backgroundColor: `${styles.cciBgColor}`}}
                    onClick={ close }/> 
                
              </div>
              <hr className={dividerCCS.hDividerClassName } style={dividerCCS.hDividerStyle}/>

              {renderSRInputs()}
              
              <div className={'d-flex  justify-content-between'}>
                <SetupComponentIR
                    title='procurement-type'
                    id={-1}
                    cellCnt={1}
                    value={props.component.irf.procurementType }
                    component={props.component}
                    handler={setProcurementType}/>

                <i id={`${props.component.displayLogic.key}-SetupIRF`}
                className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                style={{backgroundColor: `${styles.cciBgColor}`}}
                      onClick={ close }/> 
            </div>
              <hr className={dividerCCS.hDividerClassName } style={dividerCCS.hDividerStyle}/>

              { ( procurementType === 'Purchase' ? 
                  <div className={'d-flex  justify-content-between'}>
                    <SetupComponentIR
                    title='supplier-name'
                    id={-1}
                    cellCnt={2}
                    value={props.component.irf.supplier }
                component={props.component}
                    handler={setSupplier}/>

                    <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>

                    <SetupComponentIR
                    title='supplied-part-number'
                    id={-1}
                    cellCnt={2}
                    value={props.component.irf.supplierPartNumber }
                component={props.component}
                    handler={setSupplierPartNumber}/>

                    <i id={`${props.component.displayLogic.key}-SetupIRF`}
                      className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                      style={{backgroundColor: `${styles.cciBgColor}`}}
                      onClick={ close }/> 
                  </div>
                
              :
                  null
                  )
                }
                { ( procurementType === 'Purchase' ? 
                <hr className={dividerCCS.hDividerClassName } style={dividerCCS.hDividerStyle}/>
                      :
                      null
                  )
            }

                <div className={'d-flex  justify-content-between'}> 
                  <SetupComponentIR
                      title={ procurementType === null || procurementType === 'InHouse' ? 'other-production-cost-per-unit-quantity' : 'other-purchase-cost-per-unit-quantity'}
                      id={-1}
                      cellCnt={2}
                      value={props.component.irf.otherProductionCostPerUnit }
                component={props.component}
                      handler={setOtherCostPerUnit}/>

                  <hr className='m-0 bg-info'  style={dividerCCS.vDividerStyle}/>
                  <SetupComponentIR
                      title='holding-cost-per-unit-quantity'
                      id={-1}
                      cellCnt={2}
                      value={props.component.irf.holdingCostPerUnit }
              component={props.component}
                      handler={setHoldingCostPerUnit}/>
                    <i id={`${props.component.displayLogic.key}-SetupIRF`}
                      className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                      style={{backgroundColor: `${styles.cciBgColor}`}}
                      onClick={ close }/> 
                </div>

                <hr className={dividerCCS.hDividerClassName } style={dividerCCS.hDividerStyle}/>

                <div className={'d-flex  justify-content-between'}> 
                  <SetupComponentIR
                      title='mim-allowed-ending-inventory-quantity'
                      id={-1}
                      cellCnt={2}
                      value={props.component.irf.minAllowedEndingInventory }
                component={props.component}
                      handler={setSS}/>

                  <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>

                  <SetupComponentIR
                      title='max-allowed-ending-inventory-quantity'
                      id={-1}
                      cellCnt={2}
                      value={ ( props.component.irf.maxAllowedEndingInventory !== null ) && ( props.component.irf.minAllowedEndingInventory > props.component.irf.maxAllowedEndingInventory )  ?  props.component.irf.minAllowedEndingInventory : props.component.irf.maxAllowedEndingInventory}
                component={props.component}
                      handler={setMaxStock}/>
                  <i id={`${props.component.displayLogic.key}-SetupIRF`}
                      className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                      style={{backgroundColor: `${styles.cciBgColor}`}}
                      onClick={ close }/> 
                </div>

                <hr className={dividerCCS.hDividerClassName } style={dividerCCS.hDividerStyle}/>

                <div className={'d-flex  justify-content-between'}>
                  <SetupComponentIR
                      title='interest-rate'
                      id={-1}
                      cellCnt={1}
                      value={props.component.irf.interest }
                component={props.component}
                      handler={setInterest}/>
                  <i id={`${props.component.displayLogic.key}-SetupIRF`}
                        className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                        style={{backgroundColor: `${styles.cciBgColor}`}}
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
