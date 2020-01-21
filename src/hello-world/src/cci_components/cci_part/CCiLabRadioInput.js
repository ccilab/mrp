import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

export const RadioInput=(props)=>{
    const { t } = useTranslation([`${props.mrpInputType}`,'commands'], {useSuspense: false});
  
    let inputValue = (props.value === null)? '': props.value;
  
    let inputClassName = 'my-1 p-0 border-0 cursor-pointer';
    let cellWidth = ( (typeof props.cellCnt === 'undefined' ) || ( typeof props.cellCnt !== 'undefined' && props.cellCnt === 1) ) ?  '2rem' : '1rem';
    let inputStyle={'backgroundColor': `${styles.cciBgColor}`, 'height':'1rem','width':`${cellWidth}`};
    let inputType='radio';
    let tooltipOnMode=['click','hover'];
    let tooltipPosition=( typeof props.toolTipPosition === 'undefined' ) ? 'top center': props.toolTipPosition;
    let inputName=props.title;
  
  
    // https://blog.bitsrc.io/understanding-currying-in-javascript-ceb2188c339
    const updateValue=(props)=>(e)=>{
        onUpdateValueEnterKey( props, e.target);
    }
  
    const onUpdateValueEnterKey=(props, target )=>{
      if( typeof props.handler !== 'undefined')
      {
        let value = target.value;
        console.log("SetupComponentIR - updateValue: " + target.value);
  
        props.handler(props.id, value, props.component);
  
      }
    }
  
  
  
  
    // https://medium.freecodecamp.org/reactjs-pass-parameters-to-event-handlers-ca1f5c422b9
    // m-0 py-1 border-0
    // return (className='d-flex justify-content-between'
    return (
      <div style={{backgroundColor: `${styles.cciBgColor}`}}>
            <Popup
              trigger={
                // <div className='d-flex  justify-content-between'>
                <div className='d-flex' >
                  <span className='d-flex align-items-center m-0 y-0 border-0' >
                    <input className={`${inputClassName}`}
                          id={`${inputName}-1`}
                          type={inputType}
                          name={inputName}
                          style={inputStyle}
                          value={`${props.radio1}`}
                          defaultChecked ={ inputValue.includes(`${props.radio1}`) ? true : false}
                          onChange={updateValue(props)}
                          onClose={updateValue(props)}/>
                    <label className={'m-0 px-1 border-0 cursor-pointer'}
                      htmlFor={`${inputName}-1`}
                      style={{'backgroundColor': `${styles.cciBgColor}`, 'color': inputValue.includes(`${props.radio1}`) ? `${styles.cciInfoBlue}` : `${styles.cciHintRed}`}}>
                       {t(`${props.mrpInputType}:${props.radio1}`)}
                      </label>
                  </span>
                  {/* <hr className={dividerCCS.hDividerClassName }  style={dividerCCS.vDividerStyle}/> */}
                  <span className='d-flex align-items-center m-0 y-0 border-0'>
                    <input  className={`${inputClassName}`}
                            id={`${inputName}-2`}
                            type={inputType}
                            name={inputName}
                            style={inputStyle}
                            value={`${props.radio2}`}
                            defaultChecked ={ inputValue.includes(`${props.radio2}`) ? true : false}
                            onChange={updateValue(props)}
                            onClose={updateValue(props)}/>
                     <label className={'m-0 px-1 border-0 cursor-pointer'}
                      htmlFor={`${inputName}-2`}
                      style={{'backgroundColor': `${styles.cciBgColor}`, 'color': inputValue.includes(`${props.radio2}`) ? `${styles.cciInfoBlue}` : `${styles.cciHintRed}`}}>
                       {t(`${props.mrpInputType}:${props.radio2}`) }
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
  
      </div>
    );
  }
  