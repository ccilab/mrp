import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

import { dividerCCS, isValidString, isValidValue } from "./CCiLabUtility";
import {NumberInput} from "./CCiLabNumberInput"
import {TextInput} from "./CCiLabTextInput"
import {initializeOp, saveValidOpEntry} from './CCiLabOperationsUtility'



//Operation
export const NormalAndOvertime=(props)=>{
  const { t } = useTranslation('commands', {useSuspense: false});
  
 
  const setShiftType=(index, shiftType, component)=>{
    if( typeof component.operation === 'undefined' )
    {
       component.operation = new initializeOp( component ) ;
    }

    if( isValidString( shiftType ))
    {
      component.operation.DayShift.name.shiftType = shiftType;
    }
    else{
      component.operation.DayShift.name.shiftType = null;
    }
    saveValidOpEntry(component);
  }

  const setShiftName=(index, teamName, component)=>{
    if( typeof component.operation === 'undefined' )
    {
       component.operation = new initializeOp( component ) ;
    }

    if( isValidString( teamName ))
    {
      component.operation.DayShift.name.teamName = teamName;
    }
    else{
      component.operation.DayShift.name.teamName = null;
    }
    saveValidOpEntry(component);
  }

  const setEmployeeCount=(index, count, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(count);

     if( !isValid )
     {
       component.operation.DayShift.employeeCount=null;
     }
    else
    {
      component.operation.DayShift.employeeCount=value;
    }
      
    saveValidOpEntry(component);
  };

  const setDailyTimeCapacity=(index, capacity, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

      let {isValid, value} = isValidValue(capacity);

      if( !isValid )
       component.operation.DayShift.timeCost.hoursPerEmployee=null;
     else
       component.operation.DayShift.timeCost.hoursPerEmployee=value;

    saveValidOpEntry(component);
  };

  const setHourlyCost=(index, hourlyCost, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(hourlyCost);

    if( !isValid )
      component.operation.DayShift.timeCost.averageHourlyCost=null;
    else
      component.operation.DayShift.timeCost.averageHourlyCost=value;

    saveValidOpEntry(component);
    }

  const setDailyOvertimeCapacity=(index, overtimeCapacity, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(overtimeCapacity);

    if( !isValid )
      component.operation.DayShift.overtimeCost.overtimeHoursPerEmployee=null;
    else
      component.operation.DayShift.overtimeCost.overtimeHoursPerEmployee=value;

    saveValidOpEntry(component);
  }

  const setHourlyOvertimeCost=(index, overtimeCost, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

      let {isValid, value} = isValidValue(overtimeCost);

      if( !isValid )
        component.operation.DayShift.overtimeCost.averageHourlyOvertimeCost=null;
    else
        component.operation.DayShift.overtimeCost.averageHourlyOvertimeCost=value;

      saveValidOpEntry(component);
  }


  const setTimePerComponentPerEmployee=(index, timePerComponent, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

      let {isValid, value} = isValidValue(timePerComponent);

    if( !isValid )
        component.operation.DayShift.averageTimePerComponentPerEmployee = null;
    else
        component.operation.DayShift.averageTimePerComponentPerEmployee = value;
  
    saveValidOpEntry(component);
  }

  const setMinAllowedEmployee=(index, count, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(count);

    if( !isValid )
      component.operation.DayShift.allowedEmployeeCnt.min = null;
    else
      component.operation.DayShift.allowedEmployeeCnt.min = value;

    saveValidOpEntry(component);
  }

  const setMaxAllowedEmployee=(index, count, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(count);

    if( !isValid )
      component.operation.DayShift.allowedEmployeeCnt.max = null;
    else
      component.operation.DayShift.allowedEmployeeCnt.max = value;

    saveValidOpEntry(component);
  }



  return (
      <div className='d-flex'>
        <div className={'d-flex flex-column'} style={{backgroundColor:`${styles.cciBgColor}`}} >
          <div className={'d-flex justify-content-between'}>
            <TextInput
              title='shift-type'
              id={-1}
              cellCnt={2}
              toolTipPosition='bottom center'
              mrpInputType='operations'
              value={props.component.operation.DayShift.name.shiftType} //array of demands for each period 
              component={props.component}
              handler={setShiftType}/>
            <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/> 
            <TextInput
              title='team-name'
              id={-1}
              cellCnt={2}
              toolTipPosition='bottom center'
              mrpInputType='operations'
              value={props.component.operation.DayShift.name.teamName} //array of demands for each period 
              component={props.component}
              handler={setShiftName}/>
              <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
          </div>

          <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>

          <div className={'d-flex justify-content-between'}>
            <NumberInput
              title='employee-count-quantity'
              id={-1}
              cellCnt={2}
              mrpInputType='operations'
              value={props.component.operation.DayShift.employeeCount}
              component={props.component}
              handler={setEmployeeCount}/>
            <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    
            <NumberInput
              title='time-pre-component-per-employee-quantity'
              id={-1}
              cellCnt={2}
              mrpInputType='operations'
              value={props.component.operation.DayShift.averageTimePerComponentPerEmployee}
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
                  value={props.component.operation.DayShift.timeCost.hoursPerEmployee}
                  component={props.component}
                  handler={setDailyTimeCapacity}/>
              <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    
              <NumberInput
                  title='average-hourly-cost-quantity'
                  id={-1}
                  cellCnt={2}
                  mrpInputType='operations'
                  value={props.component.operation.DayShift.timeCost.averageHourlyCost}
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
                    value={props.component.operation.DayShift.overtimeCost.overtimeHoursPerEmployee}
                    component={props.component}
                    handler={setDailyOvertimeCapacity}/>
                <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    
                <NumberInput
                    title='average-overtime-hourly-cost-quantity'
                    id={-1}
                    cellCnt={2}
                    mrpInputType='operations'
                    value={props.component.operation.DayShift.overtimeCost.averageHourlyOvertimeCost}
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
                  value={props.component.operation.DayShift.allowedEmployeeCnt.min}
                  component={props.component}
                  handler={setMinAllowedEmployee}/>

              <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    

              <NumberInput
                  title='max-allowed-employee-per-shift-quantity'
                  id={-1}
                  cellCnt={2}
                  mrpInputType='operations'
                  value={props.component.operation.DayShift.allowedEmployeeCnt.max}
                  component={props.component}
                  handler={setMaxAllowedEmployee}/>
              <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
          </div>

          {/* <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.hDividerStyle}/>     */}
        </div>
      </div>
  )
}
