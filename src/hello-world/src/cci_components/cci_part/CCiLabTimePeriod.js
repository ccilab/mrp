import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

import {timePeriod} from "./CCiLabUtility"

export const TimePeriod=(props)=>{
  const { t } = useTranslation([`${props.mrpInputType}`,'commands'], {useSuspense: false});

  let inputValue = ( typeof props.leadTime === 'undefined' || (props.leadTime.value === null) )? '': props.leadTime.value;

  let inputClassName = 'text-primary m-0 pl-2 pr-0 border-0 cursor-pointer';
  let cellWidth = ( (typeof props.cellCnt === 'undefined' ) || ( typeof props.cellCnt !== 'undefined' && props.cellCnt === 1) ) ?  
                    '20rem' : '5.5rem';
  let inputStyle={'backgroundColor': `${styles.cciBgColor}`, width: `${cellWidth}`};
  let inputType='number';
  let tooltipOnMode=['click','hover'];
  let tooltipPosition= ( typeof props.toolTipPosition === 'undefined' ) ? 'top center': props.toolTipPosition;
  let inputName=props.title;
  let timePeriodUnit = ( props.leadTime.timeUnit === "" ) ? t('commands:day') : props.leadTime.timeUnit;
  let timePeriodEnu = timePeriod.day; 


  const [input, setInput] = useState(`${inputValue}`); // '' is the initial state value

  const [timeUnit, SetTimeUnit] = useState(`${timePeriodUnit}`);

  const filterInputValue=( e )=>{
      // https://stackoverflow.com/questions/10023845/regex-in-javascript-for-validating-decimal-numbers
      // https://regexr.com/ test expression
      setInput(e.target.value);
  };


  // https://blog.bitsrc.io/understanding-currying-in-javascript-ceb2188c339
  const updateValue=(props)=>(e)=>{
    onUpdateValueEnterKey( props, e.target);
  }

  const onUpdateValueEnterKey=(props, target )=>{
    if( typeof props.handler !== 'undefined')
    {
        inputValue = target.value;
      
        console.log("TimePeriod - updateValue: " + target.value);

        props.handler(props.id, inputValue, timePeriodUnit, props.component);

    }
  }

  const enterKeyHandler=(e)=>{
    if( typeof e.key !== 'undefined' && e.key ==='Enter')
    {
        onUpdateValueEnterKey(props, e.target);
    }
  };

  const updateChange=(props)=>(e)=>{
    console.log("TimePeriod - updateChange: " + e.target.value);
  }

  const setTimePeriod=( unit)=>(e)=>{
    timePeriodEnu = unit ;
    switch (timePeriodEnu)
    {
      case 'hour':
            timePeriodUnit = t('commands:hour');
            break;
        case 'day':
        default:
            timePeriodUnit = t('commands:day');
            break;
        case 'week':
            timePeriodUnit = t('commands:week');
            break;
        case 'month':
            timePeriodUnit = t('commands:month');
            break;
    }
    SetTimeUnit(timePeriodUnit);
    props.handler(props.id, inputValue, timePeriodUnit, props.component);
  }





  // https://medium.freecodecamp.org/reactjs-pass-parameters-to-event-handlers-ca1f5c422b9
  // m-0 py-1 border-0
  // return (className='d-flex justify-content-between'
  //  fa fa-history
  return (
    <div className='d-flex ' style={{backgroundColor: `${styles.cciBgColor}`}}>
        <Popup
            trigger={
                <input key={props.id}
                        className={`${inputClassName}`}
                        ref={ null }
                        id={inputName}
                        type={`${inputType}`}
                        style={inputStyle}
                        placeholder={t(`${props.mrpInputType}:${props.title}`)}
                        name={inputName}
                        value={ input }
                        min = { inputType.includes('number') ? 0: null}
                        onChange={ updateChange(props)}
                        onClose={updateValue(props)}
                        onInput={(e)=>{filterInputValue(e)}}
                        onKeyPress={ (e)=>enterKeyHandler(e) }
                        onBlur={ updateValue(props)}/>
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
            <div className='text-nowrap m-0 px-1' >
            {t(`${props.mrpInputType}:${props.title}`)  + ` ${timeUnit}` }
            </div>
        </Popup>
        <Popup 
            trigger = {
                <span className='text-primary text-nowrap pl-1 cursor-pointer' style={{width: '4.5rem'}}>
                     {`${timeUnit}`}
                     <span className='pl-1 fa fa-caret-down'/>
                </span>
            }
            closeOnDocumentClick
            on={'hover'} //['click', 'focus','hover']
            position={ 'bottom center' }
            mouseLeaveDelay={200}
            mouseEnterDelay={0}
            contentStyle={{padding: '0', zIndex : `${styles.bootstrapPopover}`,  border: 'none', backgroundColor: `${styles.cciBgColor}`}}
            arrow={false}
            arrowStyle={{backgroundColor: `${styles.cciBgColor}`}}>
            <table className='table-responsive-sm table-hover m-0'>
              <tbody >
              <tr  >
                  <td className={'p-0 m-0'}>
                    <span key='day'  className={'cursor-pointer  p-0 m-0 text-body'} style={{fontSize: '1rem'}} onClick={setTimePeriod(timePeriod.hour)}>{t('commands:hour')}</span>
                  </td>
                </tr>
                <tr  >
                  <td className={'p-0 m-0'}>
                    <span key='day'  className={'cursor-pointer  p-0 m-0 text-body'} style={{fontSize: '1rem'}} onClick={setTimePeriod(timePeriod.day)}>{t('commands:day')}</span>
                  </td>
                </tr>
                <tr>
                  <td className={'p-0 m-0'}>
                    <span key='week'  className={'cursor-pointer p-0 m-0 text-body '} style={{fontSize: '1rem'}} onClick={setTimePeriod(timePeriod.week)}>{t('commands:week')} </span>
                  </td>
                </tr>
                <tr>
                  <td className={'p-0 m-0'}>
                  <span key='month'  className={'cursor-pointer p-0 m-0 text-body '} style={{fontSize: '1rem'}} onClick={setTimePeriod(timePeriod.month)}>{t('commands:month')}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </Popup>
    </div>
  ); 
}