import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

import { dividerCCS, isValidString, isValidValue, getRandomInt } from "./CCiLabUtility";
import {DateInput} from "./CCiLabDateInput"
import {NumberInput} from "./CCiLabNumberInput"

const SetupComponentOp=(props)=>{
  const { t } = useTranslation(['operations','commands'], {useSuspense: false});

  let inputValue = (props.value === null)? '': props.value;

  let inputClassName = 'text-primary m-0 p-0 border-0 cursor-pointer';
  let cellWidth = (typeof props.cellCnt !== 'undefined' && props.cellCnt === 1) ?  '20rem' : '10rem';
  let inputStyle={'backgroundColor': `${styles.cciBgColor}`, width: `${cellWidth}`};
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

      props.handler(props.id, target.value, props.component);

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
   operation.shiftInfoArray=[[null,null]];         // how many different shifts are needed
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

  const [shiftInfoArray, setShiftInfoArray] = useState(props.component.operation.shiftInfoArray);


   // 
   const saveValidOpEntry=( component )=>{
    component.operation.shiftInfoArray = shiftInfoArray;
    sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_op`, JSON.stringify( component.operation ));
          }


  const setEmployeeCount=(index, count, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(count);

     if( !isValid )
      component.operation.employeeCount=null;
    else
      component.operation.employeeCount=value;

    saveValidOpEntry(component);
  };

  const setDailyTimeCapacity=(index, capacity, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

      let {isValid, value} = isValidValue(capacity);

      if( !isValid )
       component.operation.dailyTimeCapacityPerEmployee=null;
     else
       component.operation.dailyTimeCapacityPerEmployee=value;

    saveValidOpEntry(component);
  };

  const setHourlyCost=(index, hourlyCost, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(hourlyCost);

    if( !isValid )
      component.operation.averageHourlyCost=null;
    else
      component.operation.averageHourlyCost=value;

    saveValidOpEntry(component);
    }

  const setDailyOvertimeCapacity=(index, overtimeCapacity, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(overtimeCapacity);

    if( !isValid )
      component.operation.dailyOvertimeCapacityPerEmployee=null;
    else
      component.operation.dailyOvertimeCapacityPerEmployee=value;

    saveValidOpEntry(component);
  }

  const setHourlyOvertimeCost=(index, overtimeCost, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

      let {isValid, value} = isValidValue(overtimeCost);

      if( !isValid )
        component.operation.dailyOvertimeCapacityPerEmployee=null;
    else
        component.operation.dailyOvertimeCapacityPerEmployee=value;

      saveValidOpEntry(component);
  }


  const setTimePerComponentPerEmployee=(index, timePerComponent, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

      let {isValid, value} = isValidValue(timePerComponent);

    if( !isValid )
        component.operation.averageTimePerComponentPerEmployee = null;
    else
        component.operation.averageTimePerComponentPerEmployee = value;
  
    saveValidOpEntry(component);
  }

  const setMinAllowedEmployee=(index, count, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(count);

    if( !isValid )
      component.operation.minAllowedEmployeePerShift = null;
    else
      component.operation.minAllowedEmployeePerShift = value;

    saveValidOpEntry(component);
  }

  const setMaxAllowedEmployee=(index, count, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(count);

    if( !isValid )
      component.operation.maxAllowedEmployeePerShift = null;
    else
      component.operation.maxAllowedEmployeePerShift = value;

    saveValidOpEntry(component);
  }

  const setAverageHiringCost=(index, cost, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(cost);

    if( !isValid )
      component.operation.averageHiringCostPerEmployee = null;
    else
      component.operation.averageHiringCostPerEmployee = value;

    saveValidOpEntry(component);
  }

  const setDismissalCost=(index, cost, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(cost);

    if( !isValid )
      component.operation.averageDismissalCostPerEmployee = null;
    else
      component.operation.averageDismissalCostPerEmployee = value;

    saveValidOpEntry(component);
  }

  const setScrapRate=(index, scrapRate, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(scrapRate);

    if( !isValid )
      component.operation.scrapRate = null;
    else
      component.operation.scrapRate = value;

    saveValidOpEntry(component);
  }


  const setStartDate=(index, startDate, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    if( isValidString( startDate ))
      component.operation.startDate=startDate;
    else
      component.operation.startDate = null;

    saveValidOpEntry(component);
  }

  const setSetupCost=(index, cost, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(cost);

    if( !isValid )
      component.operation.setupCost = null;
    else
      component.operation.setupCost = value;

    saveValidOpEntry(component);
  }

  const setInputWarehouse=(index, name, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    if( isValidString( name ))
      component.operation.inputWarehouse=name;
    else
      component.operation.inputWarehouse = '';

    saveValidOpEntry(component);
  }

  const setOutputWarehouse=(index, name, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    if( isValidString( name ))
      component.operation.outputWarehouse=name;
    else
      component.operation.outputWarehouse = '';

    saveValidOpEntry(component);
  }

  const setWorkshop=(index, name, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    if( isValidString( name ))
      component.operation.workshop=name;
    else
      component.operation.workshop = '';

    saveValidOpEntry(component);
  }

  const setShiftName=(index, name, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    if( isValidString( name ))
    {
      for( let item of shiftInfoArray )
      {
        const id = shiftInfoArray.indexOf( item );
        if( id === index )
        {
          item[0] = name;
          break;
        }
      }
    }

    saveValidOpEntry(component);
  }

  const setShiftTeamName=(index, name, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    if( isValidString( name ))
    {
      for( let item of shiftInfoArray )
      {
        const id = shiftInfoArray.indexOf( item );
        if( id === index )
        {
          item[1] = name;
          break;
        }
      }
    }

    saveValidOpEntry(component);
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
      props.updateSubTitle( undefined, 'show-setup-OP' );
      setEvent('click');
      return;
    }
  }

  const AddNextShiftEntry=(index)=>(e)=>{
    shiftInfoArray.push([null,null]);
    saveValidOpEntry(props.component);
    setShiftInfoArray( shiftInfoArray );
    window.dispatchEvent(new Event('resize'));  //resize popup menu
  }

  const removeShiftEntry=(index)=>(e)=>{
    for( let item of shiftInfoArray )
    {
      const id = shiftInfoArray.indexOf( item );
      if( id === index )
      {
        shiftInfoArray.splice(id, 1);
      }
    }
    
    saveValidOpEntry(props.component);
    setShiftInfoArray( shiftInfoArray );
    window.dispatchEvent(new Event('resize'));   //resize popup menu
  }

  

 const renderShiftInfoInput=(uniqueKey, index, shiftName, teamName, isLastElement )=>{
  return(
    <div>
    <div key={uniqueKey} className={'d-flex justify-content-between'} >  
      <SetupComponentOp
         title='shift'   //array of completed date for each required quantity
         id={index}
         cellCnt={2}
         value={ shiftName }
         component={props.component}
         handler={setShiftName}/>

     <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    
     
     <SetupComponentOp
         title='team-name'
         id={index}
         cellCnt={2}
         value={( teamName !== null ) ? teamName : ''} //array of demands for each period 
         component={props.component}
         handler={setShiftTeamName}/>
         
     { isLastElement === true ?
       <i id={`${index}`}
         className='text-info m-0 py-1 px-1 fas fw fa-plus-circle cursor-pointer'
         style={{backgroundColor: `${styles.cciBgColor}`}}
         onClick={AddNextShiftEntry(index)}/>
         :
         <i id={`${index}`}
         className='text-danger m-0 py-1 px-1 fas fw fa-minus-circle cursor-pointer'
         style={{backgroundColor: `${styles.cciBgColor}`}}
         onClick={removeShiftEntry(index)}/>
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

  const renderShiftInfoInputs=()=>{
    return (
      shiftInfoArray.map( ( item )=>{
        let id = shiftInfoArray.indexOf(item);
        return renderShiftInfoInput( getRandomInt(100), id, item[0], item[1], id ===  shiftInfoArray.length - 1 ? true : false )
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
          closeOnDocumentClick={false}
          on={event}
          onClose={setEventState}
          position={'right top'}
          defaultOpen={false}  
          contentStyle={{ padding: '0px', border: 'none', backgroundColor: `${styles.cciBgColor}`}} 
          arrow={true}
          arrowStyle={{backgroundColor: `${styles.cciBgColor}`}}>
          {close => (
            <div className={'d-flex flex-column'} style={{backgroundColor:`${styles.cciBgColor}`}} >
            <div className={'d-flex justify-content-between'}>
              <NumberInput
                title='employee-count-quantity'
                id={-1}
                cellCnt={3}
                mrpInputType='operations'
                value={props.component.operation.employeeCount}
                component={props.component}
                handler={setEmployeeCount}/>
              <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    
               <NumberInput
                title='time-pre-component-per-employee-quantity'
                id={-1}
                cellCnt={3}
                mrpInputType='operations'
                value={props.component.operation.averageTimePerComponentPerEmployee}
                component={props.component}
                handler={setTimePerComponentPerEmployee} /> 
               <i id={`${props.component.displayLogic.key}-SetupOP`}
                className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                style={{backgroundColor: `${styles.cciBgColor}`}}
                onClick={ close }/> 
               
            </div>
           
            <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>

            <div className={'d-flex  justify-content-between'}>
                <NumberInput
                    title='daily-time-capacity-per-person-quantity'
                    id={-1}
                    cellCnt={2}
                    mrpInputType='operations'
                    value={props.component.operation.dailyTimeCapacityPerEmployee}
                    component={props.component}
                    handler={setDailyTimeCapacity}/>
                <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    
                 <NumberInput
                    title='average-hourly-cost-quantity'
                    id={-1}
                    cellCnt={2}
                    mrpInputType='operations'
                    value={props.component.operation.averageHourlyCost}
                    component={props.component}
                    handler={setHourlyCost}/>
                <i id={`${props.component.displayLogic.key}-SetupOP`}
                className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                style={{backgroundColor: `${styles.cciBgColor}`}}
                    onClick={ close }/> 
            </div>

            <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>

            <div className={'d-flex  justify-content-between'}>
                  <NumberInput
                      title='daily-overtime-capacity-quantity'
                      cellCnt={2}
                      id={-1}
                      mrpInputType='operations'
                      value={props.component.operation.dailyOvertimeCapacityPerEmployee}
                      component={props.component}
                      handler={setDailyOvertimeCapacity}/>
                  <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    
                  <NumberInput
                      title='average-overtime-hourly-cost-quantity'
                      id={-1}
                      cellCnt={2}
                      mrpInputType='operations'
                      value={props.component.operation.averageHourlyOvertimeCost}
                component={props.component}
                      handler={setHourlyOvertimeCost}/>
                  <i id={`${props.component.displayLogic.key}-SetupOP`}
                      className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                      style={{backgroundColor: `${styles.cciBgColor}`}}
                      onClick={ close }/> 
            </div>

            <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>

            <div className={'d-flex  justify-content-between'}>
                <NumberInput
                    title='min-allowed-employee-per-shift-quantity'
                    id={-1}
                    cellCnt={2}
                    mrpInputType='operations'
                    value={props.component.operation.minAllowedEmployeePerShift}
                    component={props.component}
                    handler={setMinAllowedEmployee}/>

                <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    

                <NumberInput
                    title='max-allowed-employee-per-shift-quantity'
                    id={-1}
                    cellCnt={2}
                    mrpInputType='operations'
                    value={props.component.operation.minAllowedEmployeePerShift}
                    component={props.component}
                    handler={setMaxAllowedEmployee}/>
                <i id={`${props.component.displayLogic.key}-SetupOP`}
                    className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                    style={{backgroundColor: `${styles.cciBgColor}`}}
                    onClick={ close }/> 
            </div>

            <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>

            <div className={'d-flex  justify-content-between'}>
                <NumberInput
                    title='hiring-cost-quantity'
                    id={-1}
                    cellCnt={2}
                    mrpInputType='operations'
                    value={props.component.operation.averageHiringCostPerEmployee}
                    component={props.component}
                    handler={setAverageHiringCost}/>

                <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    

                <NumberInput
                    title='dismissal-cost-quantity'
                    id={-1}
                    cellCnt={2}
                    mrpInputType='operations'
                    value={props.component.operation.averageDismissalCostPerEmployee}
                    component={props.component}
                    handler={setDismissalCost}/>

                <i id={`${props.component.displayLogic.key}-SetupOP`}
                    className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                    style={{backgroundColor: `${styles.cciBgColor}`}}
                    onClick={ close }/> 
            </div>

            <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.hDividerStyle}/>    

            <div className={'d-flex  justify-content-between'}>
                <NumberInput
                    title='setup-cost-quantity'
                    id={-1}
                    cellCnt={2}
                    mrpInputType='operations'
                    value={props.component.operation.setupCost }
                    component={props.component}
                    handler={setSetupCost}/>
                <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    
                <SetupComponentOp
                  title='scrap-rate'
                  id={-1}
                  cellCnt={2}
                  value={props.component.operation.scrapRate }
                  component={props.component}
                  handler={setScrapRate}/>
                <i id={`${props.component.displayLogic.key}-SetupOP`}
                  className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                  style={{backgroundColor: `${styles.cciBgColor}`}}
                  onClick={ close }/> 
             </div>

            <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>

            <div className={'d-flex  justify-content-between'}>
                <SetupComponentOp
                    title='input-warehouse-name'
                    id={-1}
                    cellCnt={2}
                    value={props.component.operation.inputWarehouse }
                component={props.component}
                    handler={setInputWarehouse}/>

                <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    

                <SetupComponentOp
                  title='output-warehouse-name'
                  id={-1}
                  cellCnt={2}
                  value={props.component.operation.outputWarehouse }
                  component={props.component}
                  handler={setOutputWarehouse}/>

                <i id={`${props.component.displayLogic.key}-SetupOP`}
                  className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                  style={{backgroundColor: `${styles.cciBgColor}`}}
                  onClick={ close }/> 
            </div>
            
            <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>

            <div className={'d-flex  justify-content-between'}>
              <DateInput
                title='start-product-date'
                  id={-1}
                  cellCnt={2}
                  mrpInputType='operations'
                  value={props.component.operation.startDate }
                  component={props.component}
                  handler={setStartDate}/>

              <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    

              <SetupComponentOp
                  title='workshop'
                  id={-1}
                  cellCnt={2}
                  value={props.component.operation.workshop }
                component={props.component}
                  handler={setWorkshop}/>

              <i id={`${props.component.displayLogic.key}-SetupOP`}
                className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                style={{backgroundColor: `${styles.cciBgColor}`}}
                onClick={ close }/> 
            </div>

            <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>

            {renderShiftInfoInputs()}
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
