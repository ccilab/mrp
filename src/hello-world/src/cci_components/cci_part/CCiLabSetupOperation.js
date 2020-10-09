import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

import { dividerCCS, isValidString, isValidValue, getRandomInt } from "./CCiLabUtility";
import {NumberInput} from "./CCiLabNumberInput"
import {TextInput} from "./CCiLabTextInput"
import {PercentageInput} from "./CCiLabPercentageInput"
import { NormalAndOvertime } from './CCiLabNormalAndOvertimeInputs';
import { Shift } from './CCiLabShiftInputs';
import {initializeOp, saveValidOpEntry, initializeShift} from './CCiLabOperationsUtility'
import { RadioInput } from './CCiLabRadioInput';



//Operation
export const SetupOP=(props)=>{
  const { t } = useTranslation('commands', {useSuspense: false});
  
  const _className = 'cursor-pointer text-primary border-0 p-1 fa fw fa-edit' + (props.component.displayLogic.selected ? ' component_selected' : ' ');

  const [event, setEvent] = useState('hover'); // '' is the initial state value

  if( props.component.operation === null || typeof props.component.operation === 'undefined' )
  {
    props.component.operation = new initializeOp(props.component);
  }

  const [shiftInfoArray, setShiftInfoArray] = useState(props.component.operation.shiftInfoArray);

  const [shiftType, setShift] = useState(props.component.operation.shiftType);


  const setNewHires=(index, count, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(count);

    if( !isValid )
      component.operation.newHires = null;
    else
      component.operation.newHires = value;

    saveValidOpEntry(component);
  }

  const setNewDismissals=(index, count, component)=>{
    if( typeof component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(count);

    if( !isValid )
      component.operation.newDismissals = null;
    else
      component.operation.newDismissals = value;

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

  const setShiftType=(index, shiftType, component)=>{
    if( typeof component.operation === 'undefined' )
    {
      component.operation = new initializeOp( component );
    }

    if( isValidString(shiftType) )
      component.operation.shiftType = shiftType;
    else
      component.operation.shiftType = null;

    setShift(component.operation.shiftType);
    
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
    shiftInfoArray.push( initializeShift() );
    saveValidOpEntry(props.component, shiftInfoArray);
    setShiftInfoArray( shiftInfoArray );
    window.dispatchEvent(new Event('resize'));  //resize popup menu
  }

  const removeShiftEntry=(index)=>(e)=>{
    if( shiftInfoArray.length <= 1 )
      return;
      
    for( let item of shiftInfoArray )
    {
      const id = shiftInfoArray.indexOf( item );
      if( id === index )
      {
        shiftInfoArray.splice(id, 1);
      }
    }
    
    saveValidOpEntry(props.component, shiftInfoArray);
    setShiftInfoArray( shiftInfoArray );
    window.dispatchEvent(new Event('resize'));   //resize popup menu
  }

  

 const renderShiftInfoInput=( index, shift, isLastElement )=>{
  return(
    <div key={getRandomInt(100)+1}>
    <div key={getRandomInt(100)} className={'d-flex justify-content-between'} >  
      <Shift shiftIndex = {index} component={props.component} />
     { isLastElement === true ?
       <i id={`${index}`}
         className='text-info m-0 py-1 px-1 fas fw fa-plus-circle cursor-pointer'
         style={{backgroundColor: `${styles.cciBgColor}`}}
         onClick={AddNextShiftEntry(index)}/>
         :
         <i id={`${index}`}
         className='text-danger m-0 py-1 px-1 fas fw fa-minus-circle cursor-pointer'
         style={{backgroundColor: `${styles.cciBgColor}`, width: '1.5em'}}
         onClick={removeShiftEntry(index)}/>
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

  const renderShiftInfoInputs=()=>{
    return (
      shiftInfoArray.map( ( item )=>{
        let id = shiftInfoArray.indexOf(item);
        return renderShiftInfoInput( id, item, id ===  shiftInfoArray.length - 1 ? true : false )
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
            // 'cursor-pointer text-primary border-0 py-0 px-2 fa fw fa-edit' + (props.component.displayLogic.selected ? ' component_selected' : ' ');
            className={`${_className}`}/>
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
            // 'cursor-pointer text-primary border-0 py-0 px-2 fa fw fa-edit' + (props.component.displayLogic.selected ? ' component_selected' : ' ');
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
              <div className={'d-flex flex-column'} style={{backgroundColor:`${styles.cciBgColor}`}} >
                <div className={'d-flex text-primary justify-content-between pl-8'}>
                    <span style={{fontWeight: 'bold'}}> {t('commands:show-setup-OP')}</span> 
                    <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
                </div>

                <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.hDividerStyle}/> 

                {/* <div className={'d-flex  justify-content-between'}>
                  <DateInput
                    title='op-start-date'
                      id={-1}
                      cellCnt={2}
                      mrpInputType='operations'
                      value={props.component.operation.startDate }
                      component={props.component}
                      handler={setStartDate}/>

                  <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    
                  <DateInput
                    title='op-complete-date'
                      id={-1}
                      cellCnt={2}
                      mrpInputType='operations'
                      value={props.component.operation.startDate }
                      component={props.component}
                      handler={setStartDate}/>

                  <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>

                </div>
                
                <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/> */}
                
                <div className={'d-flex  justify-content-between'}>
                    <NumberInput
                        title='new-hire'
                        id={-1}
                        cellCnt={2}
                        toolTipPosition='bottom center'
                        mrpInputType='operations'
                        value={props.component.operation.newHires}
                        component={props.component}
                        handler={setNewHires}/>

                    <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    

                    <NumberInput
                        title='new-dismissal'
                        id={-1}
                        cellCnt={2}
                        toolTipPosition='bottom center'
                        mrpInputType='operations'
                        value={props.component.operation.newDismissals}
                        component={props.component}
                        handler={setNewDismissals}/>

                    <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/> 
                </div>


                <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.hDividerStyle}/>    

                <div className={'d-flex  justify-content-between'}>
                    <TextInput
                        title='input-warehouse-name'
                        id={-1}
                        cellCnt={2}
                        mrpInputType='operations'
                        value={props.component.operation.inputWarehouse }
                        component={props.component}
                        handler={setInputWarehouse}/>

                    <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    

                    <TextInput
                      title='output-warehouse-name'
                      id={-1}
                      cellCnt={2}
                      mrpInputType='operations'
                      value={props.component.operation.outputWarehouse }
                      component={props.component}
                      handler={setOutputWarehouse}/>

                    <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
                </div>
            
                <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>
                
                <div className={'d-flex  justify-content-between'}>
                <TextInput
                      title='workshop'
                      id={-1}
                      cellCnt={2}
                      mrpInputType='operations'
                      value={props.component.operation.workshop }
                      component={props.component}
                      handler={setWorkshop}/>

                  <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>   
                    <PercentageInput
                      title='scrap-rate'
                      id={-1}
                      cellCnt={2}
                      mrpInputType='operations'
                      value={props.component.operation.scrapRate }
                      component={props.component}
                      handler={setScrapRate}/>
                    <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/> 
                </div>

                <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>

              <div className={'d-flex  justify-content-between'}>
                <RadioInput 
                    title='shift-type'
                    id={-1}
                    cellCnt={2}
                    mrpInputType='operations'
                    radio1='normal-hours'
                    radio2='shift'
                    value={shiftType }
                    component={props.component}
                    handler={setShiftType}/>

                <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    
                    
              </div>
              <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.hDividerStyle}/>   
              
              { shiftType === 'normal-hours' ?
                  <div>
                      <NormalAndOvertime component={props.component} />
                      {/* <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/> */}
                  </div>
                  :
                  null
              }

              { shiftType === 'shift' ?
                  <div>
                    {renderShiftInfoInputs()}
                  </div>
                  :
                  null
              }

              {/* <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/> */}
              </div>
                <div>
                <i id={`${props.component.displayLogic.key}-SetupOP`}
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
