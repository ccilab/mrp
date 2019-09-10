import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

import { isValidString, isValidValue } from "./CCiLabUtility";


const SetupComponentOp=(props)=>{
  const { t } = useTranslation(['operations','commands'], {useSuspense: false});

  let inputValue = (props.value === null)? '': props.value;

  let inputClassName = 'text-primary m-0 p-0 border-0 cursor-pointer';
  let inputStyle={'backgroundColor': `${styles.cciBgColor}`};
  let inputType='text';
  let tooltipOnMode=['click','hover'];
  let tooltipPosition='top left';
  let inputName=props.title;
  let appendPercentage = props.title.includes('-rate')  ? true : false;

  let rateInputElement = React.createRef();

  if( props.title.includes('employee-count') || props.title.includes('component-per-employee') )
  {
    tooltipPosition='bottom left';
  }

  if( props.title.includes('-date') )
  {
    inputType='date';
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
          <Popup
              trigger={
                <input className={`${inputClassName}`}
                      ref={ appendPercentage? rateInputElement : null }
                      id={inputName}
                      type={`${inputType}`}
                      style={inputStyle}
                      placeholder={t(`operations:${props.title}`)}
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
                {t(`operations:${props.title}`)}
              </div>
          </Popup>
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
   operation.dailyTimeCapacityPerEmployee=null;  //in hour
   operation.averageHourlyCost=null; 
   operation.dailyOvertimeCapacityPerEmployee=null;  //in hour
   operation.averageHourlyOvertimeCost= null; //required quantity of component/part
   operation.averageTimePerComponentPerEmployee=null; //in hour, time needed to produce one component per employee
   operation.minAllowedEmployeePerShift=null;
   operation.maxAllowedEmployeePerShift=null;
   operation.averageHiringCostPerEmployee = null;
   operation.averageDismissalCostPerEmployee = null; //local currency
   operation.startDate=null;
   operation.scrapRate=null;    // in %, need /100 when uses it 
   operation.setupCost=null;    // initial cost to produce the component
   operation.inputWarehouse='';    // where is prerequisite component/raw material stored
   operation.outputWarehouse='';    // where is component stored
   operation.workshop='';           //
   operation.shiftCount=1;         // how many different shifts are needed
   return operation;
}

//Operation
export const SetupOP=(props)=>{
  const { t } = useTranslation('commands', {useSuspense: false});
  
  const _className = 'cursor-pointer text-primary border-0 p-1 fa fw fa-edit' + (props.component.displayLogic.selected ? ' bg-info' : ' ');

  const [event, setEvent] = useState('hover'); // '' is the initial state value

  if( props.component.operation === null || typeof props.component.operation === 'undefined' )
  {
    props.component.operation = new initializeOp(props.component);
  }

   // 
   const saveValidOpEntry=( component )=>{
    sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_op`, JSON.stringify( component.operation ));
  }
  

  const setEmployeeCount=(count, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(count);

     if( !isValid )
      component.operation.employeeCount=null;
    else
      component.operation.employeeCount=value;

    saveValidOpEntry(component);
  };

  const setDailyTimeCapacity=(capacity, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

      let {isValid, value} = isValidValue(capacity);

      if( !isValid )
       component.operation.dailyTimeCapacityPerEmployee=null;
     else
       component.operation.dailyTimeCapacityPerEmployee=value;

    saveValidOpEntry(component);
  };

  const setHourlyCost=(hourlyCost, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(hourlyCost);

    if( !isValid )
      component.operation.averageHourlyCost=null;
    else
      component.operation.averageHourlyCost=value;

    saveValidOpEntry(component);
  }

  const setDailyOvertimeCapacity=(overtimeCapacity, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(overtimeCapacity);

    if( !isValid )
      component.operation.dailyOvertimeCapacityPerEmployee=null;
    else
      component.operation.dailyOvertimeCapacityPerEmployee=value;

    saveValidOpEntry(component);
  }

  const setHourlyOvertimeCost=(overtimeCost, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

      let {isValid, value} = isValidValue(overtimeCost);

      if( !isValid )
        component.operation.dailyOvertimeCapacityPerEmployee=null;
      else
        component.operation.dailyOvertimeCapacityPerEmployee=value;
  
      saveValidOpEntry(component);
  }

  
  const setTimePerComponentPerEmployee=(timePerComponent, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

      let {isValid, value} = isValidValue(timePerComponent);

      if( !isValid )
        component.operation.averageTimePerComponentPerEmployee = null;
      else
        component.operation.averageTimePerComponentPerEmployee = value;
  
    saveValidOpEntry(component);
  }

  const setMinAllowedEmployee=(count, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(count);

    if( !isValid )
      component.operation.minAllowedEmployeePerShift = null;
    else
      component.operation.minAllowedEmployeePerShift = value;

    saveValidOpEntry(component);
  }

  const setMaxAllowedEmployee=(count, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(count);

    if( !isValid )
      component.operation.maxAllowedEmployeePerShift = null;
    else
      component.operation.maxAllowedEmployeePerShift = value;

    saveValidOpEntry(component);
  }

  const setAverageHiringCost=(cost, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(cost);

    if( !isValid )
      component.operation.averageHiringCostPerEmployee = null;
    else
      component.operation.averageHiringCostPerEmployee = value;

    saveValidOpEntry(component);
  }

  const setDismissalCost=(cost, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(cost);

    if( !isValid )
      component.operation.averageDismissalCostPerEmployee = null;
    else
      component.operation.averageDismissalCostPerEmployee = value;

    saveValidOpEntry(component);
  }

  const setScrapRate=(scrapRate, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(scrapRate);

    if( !isValid )
      component.operation.scrapRate = null;
    else
      component.operation.scrapRate = value;

    saveValidOpEntry(component);
  }


  const setStartDate=(startDate, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    if( isValidString( startDate ))
      component.operation.startDate=startDate;
    else
      component.operation.startDate = null;

    saveValidOpEntry(component);
  }

  const setSetupCost=(cost, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(cost);

    if( !isValid )
      component.operation.setupCost = null;
    else
      component.operation.setupCost = value;

    saveValidOpEntry(component);
  }

  const setInputWarehouse=(name, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    if( isValidString( name ))
      component.operation.inputWarehouse=name;
    else
      component.operation.inputWarehouse = '';

    saveValidOpEntry(component);
  }

  const setOutputWarehouse=(name, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    if( isValidString( name ))
      component.operation.outputWarehouse=name;
    else
      component.operation.outputWarehouse = '';

    saveValidOpEntry(component);
  }

  const setWorkshop=(name, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    if( isValidString( name ))
      component.operation.workshop=name;
    else
      component.operation.workshop = '';

    saveValidOpEntry(component);
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
          <span className={'text-primary'} >{t('commands:show-setup-OP')}</span>
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
                title='employee-count-quantity'
                value={props.component.operation.employeeCount}
                component={props.component}
                handler={setEmployeeCount}/>
               <SetupComponentOp
                title='employee-count-quantity'
                value={props.component.operation.averageTimePerComponentPerEmployee}
                component={props.component}
                handler={setTimePerComponentPerEmployee}/>  
              <a id={`${props.component.displayLogic.key}-SetupOP`}
                href={`#${props.component.displayLogic.key}`}
                className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                style={{backgroundColor: `${styles.cciBgColor}`}}
                onClick={ close }> </a>
            </div>
            <hr className='my-0 bg-info'
                  style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

            <div className={'bg-info d-flex'}>
                <SetupComponentOp
                    title='daily-time-capacity-per-person-quantity'
                    value={props.component.operation.dailyTimeCapacityPerEmployee}
                    component={props.component}
                    handler={setDailyTimeCapacity}/>

                 <SetupComponentOp
                    title='daily-time-capacity-per-person-quantity'
                    value={props.component.operation.averageHourlyCost}
                    component={props.component}
                    handler={setHourlyCost}/>
            </div>

            <hr className='my-0 bg-info'
              style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

            <div className={'bg-info d-flex'}>
                  <SetupComponentOp
                      title='daily-overtime-capacity-quantity'
                      value={props.component.operation.dailyOvertimeCapacityPerEmployee}
                      component={props.component}
                      handler={setDailyOvertimeCapacity}/>

                   <SetupComponentOp
                      title='average-overtime-hourly-cost-quantity'
                      value={props.component.operation.averageHourlyOvertimeCost}
                      component={props.component}
                      handler={setHourlyOvertimeCost}/>
            </div>

            <hr className='my-0 bg-info'
              style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>
        
            <div className={'bg-info d-flex'}>
                <SetupComponentOp
                    title='min-allowed-employee-per-shift-quantity'
                    value={props.component.operation.minAllowedEmployeePerShift}
                    component={props.component}
                    handler={setMinAllowedEmployee}/>

                 <SetupComponentOp
                    title='max-allowed-employee-per-shift-quantity'
                    value={props.component.operation.minAllowedEmployeePerShift}
                    component={props.component}
                    handler={setMaxAllowedEmployee}/>
            </div>

            <hr className='my-0 bg-info'
              style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

            <div className={'bg-info d-flex'}>
                <SetupComponentOp
                    title='hiring-cost-quantity'
                    value={props.component.operation.averageHiringCostPerEmployee}
                    component={props.component}
                    handler={setAverageHiringCost}/>

                 <SetupComponentOp
                    title='dismissal-cost-quantity'
                    value={props.component.operation.averageDismissalCostPerEmployee}
                    component={props.component}
                    handler={setDismissalCost}/>
            </div>

            <hr className='my-0 bg-info'
              style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

            <div className={'bg-info d-flex'}>
                <SetupComponentOp
                    title='setup-cost-quantity'
                    value={props.component.operation.setupCost }
                    component={props.component}
                    handler={setSetupCost}/>
                <SetupComponentOp
                  title='scrap-rate'
                  value={props.component.operation.scrapRate }
                  component={props.component}
                  handler={setScrapRate}/>
             </div>
            <hr className='my-0 bg-info'
                style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

            <div className={'bg-info d-flex'}>
                <SetupComponentOp
                    title='input-warehouse-name'
                    value={props.component.operation.inputWarehouse }
                    component={props.component}
                    handler={setInputWarehouse}/>
                <SetupComponentOp
                  title='output-warehouse-name'
                  value={props.component.operation.outputWarehouse }
                  component={props.component}
                  handler={setOutputWarehouse}/>
            </div>
            <hr className='my-0 bg-info'
                style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

            <div className={'bg-info d-flex'}>
              <SetupComponentOp
                  title='start-product-date'
                  value={props.component.operation.startDate }
                  component={props.component}
                  handler={setStartDate}/>

              <SetupComponentOp
                  title='workshop'
                  value={props.component.operation.workshop }
                  component={props.component}
                  handler={setWorkshop}/>
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
