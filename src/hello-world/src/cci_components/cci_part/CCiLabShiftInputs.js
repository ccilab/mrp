import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

import { dividerCCS, isValidString, isValidValue, getRandomInt } from "./CCiLabUtility";
import {DateInput} from "./CCiLabDateInput"
import {NumberInput} from "./CCiLabNumberInput"
import {TextInput} from "./CCiLabTextInput"
import {PercentageInput} from "./CCiLabPercentageInput"



// requiredQtyPerShift calculates based on its parent component's unitQty
// #todo - need to re-design how to handle it
const initializeTeam=()=>{
   let team={};
   team.name={shiftName:'', teamName: ''};
   team.employeeCount=null;  //number of employees to produce the demand of a component
   team.averageTimePerComponentPerEmployee=null; //in hour, time needed to produce one component per employee
   team.timeCost={hoursPerEmployee: null, averageHourlyCost: null } ;  //in hour, for normal or shift
   team.overtimeCost = {overtimeHoursPerEmployee: null, averageHourlyOvertimeCost: null };  //in hour, if not in shift
   team.allowedEmployeePerShift={min: null, max: null };
   return team;
}

//Operation
export const SetupTeam=(props)=>{
  const { t } = useTranslation('commands', {useSuspense: false});
  
  const _className = 'cursor-pointer text-primary border-0 p-1 fa fw fa-edit' + (props.component.displayLogic.selected ? ' bg-info' : ' ');

  const [event, setEvent] = useState('hover'); // '' is the initial state value

  if( props.component.operation.team === null || typeof props.component.operation.team === 'undefined' )
  {
    props.component.operation.team = new initializeTeam();
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



  return (
      <div className='d-flex'>
        <div className={'d-flex flex-column'} style={{backgroundColor:`${styles.cciBgColor}`}} >
          <div className={'d-flex justify-content-between'}>
            <NumberInput
              title='employee-count-quantity'
              id={-1}
              cellCnt={2}
              toolTipPosition='bottom center'
              mrpInputType='operations'
              value={props.component.operation.employeeCount}
              component={props.component}
              handler={setEmployeeCount}/>
            <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    
            <NumberInput
              title='time-pre-component-per-employee-quantity'
              id={-1}
              cellCnt={2}
              toolTipPosition='bottom center'
              mrpInputType='operations'
              value={props.component.operation.averageTimePerComponentPerEmployee}
              component={props.component}
              handler={setTimePerComponentPerEmployee} /> 
            <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
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
              <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
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
                <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/> 
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
              <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
          </div>

          <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.hDividerStyle}/>    
        </div>
      </div>
  )
}
