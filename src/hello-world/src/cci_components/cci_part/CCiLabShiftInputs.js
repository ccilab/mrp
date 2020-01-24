import React, { useState }  from 'react';
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

import { dividerCCS, isValidString, isValidValue, getRandomInt } from "./CCiLabUtility";
import {NumberInput} from "./CCiLabNumberInput"
import {TextInput} from "./CCiLabTextInput"
import {initializeOp, saveValidOpEntry} from './CCiLabOperationsUtility'



//Operation
export const Shift=(props)=>{
  const { t } = useTranslation(['operations','commands'], {useSuspense: false});
  
  const shiftArray = props.component.operation.shiftInfoArray;
 
  const setShiftTerm=(index, value, component)=>{
    if( typeof component.operation === 'undefined' )
    {
       component.operation = new initializeOp( component ) ;
    }

    let shiftTerm = value;

    if( isValidString( shiftTerm ) === false)
    {
      shiftTerm = null;
    }
    
    for( let item of shiftArray )
    {
        const id = shiftArray.indexOf( item );
        if( id === index )
        {
          item.name.shiftTerm = shiftTerm;
          break;
        }
    }
    
    saveValidOpEntry(component, shiftArray);
  }

  const setShiftName=(index, value, component)=>{
    if( typeof component.operation === 'undefined' )
    {
       component.operation = new initializeOp( component ) ;
    }

    let teamName = value;

    if( isValidString( teamName ) === false )
    {
      teamName = null ;
    }
    
    for( let item of shiftArray )
    {
        const id = shiftArray.indexOf( item );
        if( id === index )
        {
          item.name.teamName = teamName;
          break;
        }
    }
    saveValidOpEntry(component, shiftArray);
  }

  const setEmployeeCount=(index, count, component)=>{
     if( typeof component.operation === 'undefined' )
        component.operation = new initializeOp( component );

     let {isValid, value} = isValidValue(count);

     if( !isValid )
     {
        value=null;
     }
   
     for( let item of shiftArray )
     {
         const id = shiftArray.indexOf( item );
         if( id === index )
         {
           item.employeeCount = value;
           break;
         }
     }

      
    saveValidOpEntry(component, shiftArray);
  };

  const setShiftTimeCapacity=(index, capacity, component)=>{
    if( typeof component.operation === 'undefined' )
    {
      component.operation = new initializeOp( component );
    }
      

    let {isValid, value} = isValidValue(capacity);

    if( !isValid )
        value=null;
     
    for( let item of shiftArray )
    {
        const id = shiftArray.indexOf( item );
        if( id === index )
        {
          item.timeCost.hoursPerEmployee = value;
          break;
        }
    }  

    saveValidOpEntry(component, shiftArray);
  };

  const setShiftHourlyCost=(index, hourlyCost, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(hourlyCost);

    if( !isValid )
      value=null;
    

    for( let item of shiftArray )
    {
        const id = shiftArray.indexOf( item );
        if( id === index )
        {
          item.timeCost.averageHourlyCost = value;
          break;
        }
    }  

    saveValidOpEntry(component, shiftArray);
    }



  const setTimePerComponentPerEmployee=(index, timePerComponent, component)=>{
    if( typeof component.operation === 'undefined' )
    {
      component.operation = new initializeOp( component );
    }

    let {isValid, value} = isValidValue(timePerComponent);

    if( !isValid )
      value = null;
   

    for( let item of shiftArray )
    {
        const id = shiftArray.indexOf( item );
        if( id === index )
        {
          item.averageTimePerComponentPerEmployee = value;
          break;
        }
    }  
  
    saveValidOpEntry(component, shiftArray);
  }

  const setMinAllowedEmployee=(index, count, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(count);

    if( !isValid )
      value = null;

    for( let item of shiftArray )
    {
        const id = shiftArray.indexOf( item );
        if( id === index )
        {
          item.allowedEmployeeCnt.min = value;
          break;
        }
    }  

    saveValidOpEntry(component, shiftArray);
  }

  const setMaxAllowedEmployee=(index, count, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(count);

    if( !isValid )
      value = null;
    
    for( let item of shiftArray )
    {
        const id = shiftArray.indexOf( item );
        if( id === index )
        {
          item.allowedEmployeeCnt.max = value;
          break;
        }
    }  

    saveValidOpEntry(component, shiftArray);
  }


  return (
      <div key={getRandomInt(100)} className='d-flex'>
        <div className={'d-flex flex-column'} style={{backgroundColor:`${styles.cciBgColor}`}} >
          <div className={'d-flex justify-content-between'}>
            <TextInput
              title='shift-type'
              id={props.shiftIndex}
              cellCnt={2}
              readOnly={false}
              mrpInputType='operations'
              value={props.component.operation.shiftInfoArray[props.shiftIndex].name.shiftTerm === null ? props.component.operation.shiftInfoArray[props.shiftIndex].name.shiftTerm : t(`operations:${props.component.operation.shiftInfoArray[props.shiftIndex].name.shiftTerm }`)} //array of demands for each period 
              component={props.component}
              handler={setShiftTerm}/>
            <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/> 
            <TextInput
              title='team-name'
              id={props.shiftIndex}
              cellCnt={2}
              mrpInputType='operations'
              value={props.component.operation.shiftInfoArray[props.shiftIndex].name.teamName} //array of demands for each period 
              component={props.component}
              handler={setShiftName}/>
              <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
          </div>

          <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>

          <div className={'d-flex justify-content-between'}>
            <NumberInput
              title='employee-count-quantity'
              id={props.shiftIndex}
              cellCnt={2}
              mrpInputType='operations'
              value={props.component.operation.shiftInfoArray[props.shiftIndex].employeeCount}
              component={props.component}
              handler={setEmployeeCount}/>
            <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    
            <NumberInput
              title='time-pre-component-per-employee-quantity'
              id={props.shiftIndex}
              cellCnt={2}
              mrpInputType='operations'
              value={props.component.operation.shiftInfoArray[props.shiftIndex].averageTimePerComponentPerEmployee}
              component={props.component}
              handler={setTimePerComponentPerEmployee} /> 
            <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
          </div>
      
          <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>

          <div className={'d-flex  justify-content-between'}>
              <NumberInput
                  title='daily-time-capacity-per-person-quantity'
                  id={props.shiftIndex}
                  cellCnt={2}
                  mrpInputType='operations'
                  value={props.component.operation.shiftInfoArray[props.shiftIndex].timeCost.hoursPerEmployee}
                  component={props.component}
                  handler={setShiftTimeCapacity}/>
              <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    
              <NumberInput
                  title='average-hourly-cost-quantity'
                  id={props.shiftIndex}
                  cellCnt={2}
                  mrpInputType='operations'
                  value={props.component.operation.shiftInfoArray[props.shiftIndex].timeCost.averageHourlyCost}
                  component={props.component}
                  handler={setShiftHourlyCost}/>
              <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
          </div>

          <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>

          <div className={'d-flex  justify-content-between'}>
              <NumberInput
                  title='min-allowed-employee-per-shift-quantity'
                  id={props.shiftIndex}
                  cellCnt={2}
                  mrpInputType='operations'
                  value={props.component.operation.shiftInfoArray[props.shiftIndex].allowedEmployeeCnt.min}
                  component={props.component}
                  handler={setMinAllowedEmployee}/>

              <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    

              <NumberInput
                  title='max-allowed-employee-per-shift-quantity'
                  id={props.shiftIndex}
                  cellCnt={2}
                  mrpInputType='operations'
                  value={props.component.operation.shiftInfoArray[props.shiftIndex].allowedEmployeeCnt.max}
                  component={props.component}
                  handler={setMaxAllowedEmployee}/>
              <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
          </div>

          {/* <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.hDividerStyle}/>     */}
        </div>
      </div>
  )
}
