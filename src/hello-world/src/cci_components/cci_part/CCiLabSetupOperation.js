import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

import { isValidString, isValidValue } from "./CCiLabUtility";


const SetupComponentOp=(props)=>{
  const { t } = useTranslation(['component','commands'], {useSuspense: false});

  let inputValue = (props.value === null)? '': props.value;

  let inputClassName = 'text-primary m-0 p-0 border-0 cursor-pointer';
  let inputStyle={'backgroundColor': `${styles.cciBgColor}`};
  let inputType='text';
  let tooltipOnMode=['click','hover'];
  let tooltipPosition='top left';
  let inputName=props.title;
  let inputProcurementType = props.title.includes('procurement-type') ? true : false;
  let appendPercentage = props.title.includes('-rate')  ? true : false;

  let rateInputElement = React.createRef();

  if( props.title.includes('part-name'))
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
    inputStyle={'backgroundColor': `${styles.cciBgColor}`, 'height':'1em','width':'1em'};
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
    //   if( typeof props.handler !== 'undefined')
    //   {
    //     if( typeof e.target !== 'undefined' && e.target.value === '' && props.title ==='part-name')
    //       e.target.value = 'add-part';

    //     console.log("SetupComponentOp - updateValue: " + e.target.value);

    //     props.handler(e.target.value, props.component);
    //   }
    onUpdateValueEnterKey( props, e.target);
  }

  const onUpdateValueEnterKey=(props, target )=>{
    if( typeof props.handler !== 'undefined')
    {
      if( typeof target !== 'undefined' && target.value === '' && props.title ==='part-name')
        target.value = 'add-part';

      console.log("SetupComponentOp - updateValue: " + target.value);

      props.handler(target.value, props.component);

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
    console.log("SetupComponentOp - updateChange: " + e.target.value);
  }



  // https://medium.freecodecamp.org/reactjs-pass-parameters-to-event-handlers-ca1f5c422b9
  return (
    <div className='d-flex justify-content-between'
         style={{backgroundColor: `${styles.cciBgColor}`}}>
       { inputProcurementType ?
          <Popup
            trigger={
              <div className='d-flex flex-column m-0 py-1 border-0'>
                <div className='d-inline-flex align-items-center m-0 p-0 border-0' >
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
                     {t(`component:in-house`)}
                    </label>
                </div>
                <div className='d-inline-flex align-items-center m-0 y-0 border-0'>
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
                     {t('component:purchase') }
                    </label>
                </div>
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
              {t(`component:${props.title}`)}
            </div>
        </Popup>
          :
          <Popup
              trigger={
                <input className={`${inputClassName}`}
                      ref={ appendPercentage? rateInputElement : null }
                      id={inputName}
                      type={`${inputType}`}
                      style={inputStyle}
                      placeholder={t(`component:${props.title}`)}
                      name={inputName}
                      value={ input }
                      min = { inputType.includes('number') ? 1 : null}
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
                {t(`component:${props.title}`)}
              </div>
          </Popup>
       }

    </div>
  );
}


export const initializeOp=( component )=>{
  let operation= JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_op`)) || _initializeOp();
  return operation;
}

// requiredQtyPerShift calculates based on its parent component's unitQty
// #todo - need to re-design how to handle it
const _initializeOp=()=>{
   let operation={};
   operation.employeeCount=null;  //number of employees to produce the demand of a component
   operation.timeCapacityPerEmployeePerDay=null;  //in hour
   operation.averageCostPerHour=null; 
   operation.overtimeCapacityPerEmployeePerDay=null;  //in hour
   operation.averageOvertimeCostPerHour= null; //required quantity of component/part
   operation.averageTimePerComponentPerEmployee=null; //in hour, time needed to produce one component per employee
   operation.maxAllowedEmployeePerShift=null; 
   operation.minAllowedEmployeePerShift=null;
   operation.averageHiringCostPerEmployee = null;
   operation.averageDismissalCostPerEmployee = null; //local currency
   operation.startDate=null;
   operation.scrapRate=null;    // in %, need /100 when uses it
   operation.setupCost=null;    // initial cost to produce the component
   operation.inputWarehouse=null;    // where is prerequisite component/raw material stored
   operation.outputWarehouse=null;    // where is component stored
   operation.workshop=null;           //
   operation.requiredQtyPerShift=null;  // required quantity for per shift per run
   operation.shiftCount=1;         // how many different shifts are needed
   operation.sameShiftRunCount=1;  //same shift runs how many times
   return operation;
}


export const SetupBOM=(props)=>{
  const { t } = useTranslation('commands', {useSuspense: false});
  
  const _className = 'cursor-pointer text-primary border-0 p-1 fa fw fa-edit' + (props.component.displayLogic.selected ? ' bg-info' : ' ');

  const [event, setEvent] = useState('hover'); // '' is the initial state value

  // deep copy object that doesn't have function inside object
  const originComponent = JSON.parse(JSON.stringify(props.component));



  if( props.component.bom === null || typeof props.component.bom === 'undefined' )
  {
    props.component.operation = new initializeOp(props.component);
  }

  // const isValidString=( name )=>{
  //   return ( typeof name === 'string' &&
  //       name.length > 0 ) ? true : false
  // };

  // const isValidValue=(valueToCheck)=>{

  //   let value = parseFloat(valueToCheck);
  //   let valid = isNaN( value ) ? false : true;

  //   let rt={};
  //   rt.isValid = valid;
  //   rt.value = value;
  //   return rt;
  // };

  const calQuantityPerShift=(component)=>{
    const bomCore = component.bom.operation;
    if( component.bom.operation.requiredQty !== null &&
      component.bom.operation.unitQty !== null &&
      component.bom.operation.scrapRate !== null
    )
    {

      bomCore.requiredQtyPerShift =((bomCore.requiredQty * bomCore.unitQty)/(bomCore.shiftCount * bomCore.sameShiftRunCount )) * (1 + bomCore.scrapRate/100) ;
    }
    else
      bomCore.requiredQtyPerShift=null;
  };

  const setPartName=(partName, component)=>{
    if( isValidString( partName ))
        component.businessLogic.name=partName;
    else
      component.businessLogic.name='';  //reset to initial value to fail IsClosePopupMenu evaluation

    IsClosePopupMenu(component);
    console.log("SetupBOM - setPartName: " + component.businessLogic.name);
  };

  const setPartNumber=(partNumber, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeOp( component );

    if( isValidString( partNumber ))
      component.bom.operation.partNumber=partNumber;
    else
      component.businessLogic.name=null;  //reset to initial value to fail IsClosePopupMenu evaluation

    IsClosePopupMenu(component);

    console.log("SetupBOM - setPartNumber: " + component.bom.operation.partNumber);
  };

  const setUnitQty=(unitQty, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeOp( component );

    let {isValid, value} = isValidValue(unitQty);

    if( !isValid )
      component.bom.operation.unitQty=null;
    else
      component.bom.operation.unitQty=value;

    // required quantity for per shift per run
    calQuantityPerShift(component); //reset requiredQtyPerShift to null if component.bom.operation.unitQty is null
    IsClosePopupMenu(component);

    console.log( 'setUnitQty: requiredQty='+component.bom.operation.requiredQty);
    console.log( 'setUnitQty: requiredQtyPerShift='+component.bom.operation.requiredQtyPerShift);
  }

  const setTotalRequiredQty=(qty, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeOp( component );

    let {isValid, value} = isValidValue(qty);

    if( !isValid )
      component.bom.operation.requiredQty=null;
    else
      component.bom.operation.requiredQty=value;

    calQuantityPerShift(component);
    IsClosePopupMenu(component);

    console.log('setTotalRequiredQty - ' + component.bom.operation.requiredQty);
  }

  const setUnitOfMeasure=(unitOfMeasure, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeOp( component );

    component.bom.operation.unitOfMeasure=unitOfMeasure;
  }

  const setScrapRate=(scrapRate, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeOp( component );

    let {isValid, value} = isValidValue(scrapRate);

    if( !isValid )
      component.bom.operation.scrapRate = null;
    else
      component.bom.operation.scrapRate = value;

    IsClosePopupMenu(component);
    console.log('setScrapRate - ' + component.bom.operation.scrapRate);
  }

  const setProcurementType=(procurementType, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeOp( component );

    if( isValidString(procurementType) )
      component.bom.operation.procurementType = procurementType;
    else
      component.bom.operation.procurementType = null;

    IsClosePopupMenu(component);
    console.log( 'setProcurementType : ' + component.bom.operation.procurementType );
  }

  const setStartDate=(startDate, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeOp( component );

    if( isValidString( startDate ))
      component.bom.operation.startDate=startDate;
    else
      component.bom.operation.startDate = null;

    IsClosePopupMenu(component);
    console.log( 'setStartDate : ' + component.bom.operation.startDate);
  }

  const setCompleteDate=(completeDate, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeOp( component );

    if( isValidString( completeDate ))
      component.bom.operation.completeDate=completeDate;
    else
      component.bom.operation.completeDate = null;

    IsClosePopupMenu(component);
    console.log( 'setCompleteDate : ' + component.bom.operation.completeDate);
  }


  //hover to popup tooltip, click/focus to popup setup BOM inputs
  // based on event from mouse or click for desktop devices, click for touch devices
  const setEventState=()=>
  {
    if( event === 'click' )
    {
       setEvent('hover');
       return;
    }
    if( event === 'hover' )
    {
      setEvent('click');
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
            className={`${_className}`}
            style={{backgroundColor: `${styles.cciBgColor}`}}/>
        }
          closeOnDocumentClick={true}
          on={`${event}`}
          position={'right top'}
          defaultOpen={false}
          contentStyle={{ padding: '0px', border: 'none', backgroundColor: `${styles.cciBgColor}`}} 
          mouseLeaveDelay={0}
          mouseEnterDelay={400}
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
            className={`${_className}`}
            style={{backgroundColor: `${styles.cciBgColor}`}}/>
        }
          closeOnDocumentClick={true}
          on={`${event}`}
          onClose={setEventState}
          position={'right top'}
          defaultOpen={false}  
          contentStyle={{ padding: '0px', border: 'none', backgroundColor: `${styles.cciBgColor}`}} 
          arrow={true}
          arrowStyle={{backgroundColor: `${styles.cciBgColor}`}}>
          {close => (
            <div className={'bg-info d-flex flex-column'} >
            <div className={'bg-info d-flex'}>
              <SetupComponentOp
                title='part-name'
                value={props.component.businessLogic.name}
                component={props.component}
                handler={setPartName}/>
              <a id={`${props.component.displayLogic.key}-setupBOM`}
                href={`#${props.component.displayLogic.key}`}
                className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                style={{backgroundColor: `${styles.cciBgColor}`}}
                onClick={ close }> </a>
            </div>
            <hr className='my-0 bg-info'
                  style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

            <SetupComponentOp
                title='part-number'
                value={props.component.bom.operation.partNumber}
                component={props.component}
                handler={setPartNumber}/>

            <hr className='my-0 bg-info'
                  style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

            { props.component.businessLogic.parentIds.length === 0 ?
              <SetupComponentOp
              title='required-quantity'
                // value='' input will show placeholder text
                value={(props.component.bom.operation.requiredQty !== null && props.component.bom.operation.requiredQty > 0 ) ? props.component.bom.operation.requiredQty: ''}
                component={props.component}
                handler={setTotalRequiredQty}/>
              :
              <SetupComponentOp
                title='unit-quantity'
                // value='' input will show placeholder text
                value={ props.component.bom.operation.unitQty}
                component={props.component}
                handler={setUnitQty}/>
            }

            <hr className='my-0 bg-info'
                style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

            <SetupComponentOp
                title='unit-of-measure'
                value={props.component.bom.operation.unitOfMeasure }
                component={props.component}
                handler={setUnitOfMeasure}/>

            <hr className='my-0 bg-info'
                style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

            <SetupComponentOp
              title='scrap-rate'
              value={props.component.bom.operation.scrapRate }
              component={props.component}
              handler={setScrapRate}/>

            <hr className='my-0 bg-info'
                style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

            <SetupComponentOp
                title='procurement-type'
                value={props.component.bom.operation.procurementType }
                component={props.component}
                handler={setProcurementType}/>

            <hr className='my-0 bg-info'
                style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

            <SetupComponentOp
                title='start-product-date'
                value={props.component.bom.operation.startDate }
                component={props.component}
                handler={setStartDate}/>

            <hr className='my-0 bg-info'
                style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

            <SetupComponentOp
                title='product-complete-date'
                value={props.component.bom.operation.completeDate }
                component={props.component}
                handler={setCompleteDate}/>
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
