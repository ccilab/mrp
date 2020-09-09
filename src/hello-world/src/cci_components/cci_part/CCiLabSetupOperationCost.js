import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

import { dividerCCS, isValidString, isValidValue, getRandomInt } from "./CCiLabUtility";
import {DateInput} from "./CCiLabDateInput"
import {NumberInput} from "./CCiLabNumberInput"
import {TextInput} from "./CCiLabTextInput"
import {PercentageInput} from "./CCiLabPercentageInput"
import { NormalAndOvertime } from './CCiLabNormalAndOvertimeInputs';
import { Shift } from './CCiLabShiftInputs';
import {initializeOp, saveValidOpEntry, initializeShift} from './CCiLabOperationsUtility'
import { RadioInput } from './CCiLabRadioInput';
import {TimePeriod} from "./CCiLabTimePeriod"



//Operation
export const SetupOPCost=(props)=>{
  const { t } = useTranslation(['commands', 'inventoryRecords'], {useSuspense: false});
  
  const _className = 'cursor-pointer text-primary border-0 p-1 fa fw fa-edit' + (props.component.displayLogic.selected ? ' component_selected' : ' ');

  const [event, setEvent] = useState('hover'); // '' is the initial state value

  if( props.component.operation === null || typeof props.component.operation === 'undefined' )
  {
    props.component.operation = new initializeOp(props.component);
  }

  // `${procurementType}` === null || `${procurementType}` === 'in-house' ?
  const procurementType = props.component.irf.procurementType;
  const inHouseProduction = ( procurementType === null || procurementType === 'in-house' ) ? true : false;

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

  const setHoldingCostPerUnit=(index, cost, component)=>{
    if( component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(cost);

    if( !isValid )
      component.operation.holdingCostPerUnit=null;
    else
      component.operation.holdingCostPerUnit=value;

    saveValidOpEntry(component); 
  }


  //unit in local currency
  const setOtherProductCostPerUnit=(index, cost, component)=>{
    if( component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(cost);

    if( !isValid )
      component.operation.otherProductionCostPerUnit=null;
    else
      component.operation.otherProductionCostPerUnit=value;

      saveValidOpEntry(component); 
  }

  //unit in local currency
  const setPurchaseCostPerUnit=(index, cost, component)=>{
    if( component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(cost);

    if( !isValid )
      component.operation.PurchaseCostPerUnit=null;
    else
      component.operation.PurchaseCostPerUnit=value;

      saveValidOpEntry(component); 
  }

  const setInterest=(index, interest, component)=>{
    if( component.operation === 'undefined' )
      component.operation = new initializeOp( component );

    let {isValid, value} = isValidValue(interest);

    if( !isValid )
      component.operation.interest=null;
    else
      component.operation.interest=value;

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
      props.updateSubTitle( undefined, 'show-setup-OP-cost' );
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
          <span className={'text-primary'} >{t('commands:show-setup-OP-cost')}</span>
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
                    <span style={{fontWeight: 'bold'}}> {t('commands:show-setup-OP-cost')}</span> 
                    <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
                </div>
                <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.hDividerStyle}/>

                <div className={'d-flex  justify-content-between'}>
                    <NumberInput
                        title='hiring-cost-quantity'
                        id={-1}
                        cellCnt={2}
                        toolTipPosition='bottom center'
                        mrpInputType='operations'
                        value={props.component.operation.averageHiringCostPerEmployee}
                        component={props.component}
                        handler={setAverageHiringCost}/>

                    <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>    

                    <NumberInput
                        title='dismissal-cost-quantity'
                        id={-1}
                        cellCnt={2}
                        toolTipPosition='bottom center'
                        mrpInputType='operations'
                        value={props.component.operation.averageDismissalCostPerEmployee}
                        component={props.component}
                        handler={setDismissalCost}/>

                    <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/> 
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
                    <NumberInput
                      title='holding-cost-per-unit-quantity'
                      id={-1}
                      cellCnt={2}
                      mrpInputType='operations'
                      value={props.component.operation.holdingCostPerUnit }
                      component={props.component}
                      handler={setHoldingCostPerUnit}/>
                     <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
                </div>

                 <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>

                <div className={'d-flex  justify-content-between'}> 
                  <TextInput
                      title={ inHouseProduction ? 'in-house' : 'purchase' }
                      id={-1}
                      cellCnt={2}
                      mrpInputType= 'inventoryRecords'
                      value={inHouseProduction ? t(`inventoryRecords:in-house`) :   t(`inventoryRecords:purchase`)}
                      readOnly={ true }
                      component={props.component}/>

                  <hr className='m-0 bg-info'  style={dividerCCS.vDividerStyle}/>
                  <NumberInput
                      title={ inHouseProduction? 'other-production-cost-per-unit-quantity' : 'other-purchase-cost-per-unit-quantity'}
                      id={-1}
                      cellCnt={2}
                      mrpInputType='operations'
                      value={ inHouseProduction? props.component.operation.otherProductionCostPerUnit : props.component.operation.PurchaseCostPerUnit }
                      component={props.component}
                      handler={ inHouseProduction? setOtherProductCostPerUnit : setPurchaseCostPerUnit}/>
                     <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/>
                </div>

                <hr className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>
                <div className={'d-flex justify-content-between'}>
                  <PercentageInput
                      title='interest-rate'
                      id={-1}
                      cellCnt={2}
                      mrpInputType='inventoryRecords'
                      value={props.component.operation.interest }
                      component={props.component}
                      handler={setInterest}/>
                  <hr className='m-0 bg-info'  style={dividerCCS.vDividerStyle}/>
                </div>

              </div>                

                <div>
                  <i id={"`${props.component.displayLogic.key}`-SetupOP-cost"}
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
