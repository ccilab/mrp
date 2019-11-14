import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

export const DateInput=(props)=>{
    const { t } = useTranslation([`${props.mrpInputType}`,'commands'], {useSuspense: false});

    let inputValue = (props.value === null)? '': props.value;

    let inputClassName = 'text-primary m-0 p-0 border-0 cursor-pointer';
    let cellWidth = ( (typeof props.cellCnt === 'undefined' ) || ( typeof props.cellCnt !== 'undefined' && props.cellCnt === 1) ) ?  '20rem' : '10rem'; 
    let inputStyle={'backgroundColor': `${styles.cciBgColor}`, width: `${cellWidth}`};
    let inputType='date';
    let tooltipOnMode=['click','hover'];
    let tooltipPosition= ( (typeof props.cellCnt === 'undefined' ) || ( typeof props.cellCnt !== 'undefined' && props.cellCnt === 1) ) ? 'top center': props.cellCnt === 3 ? 'bottom center':'top left';
    let inputName=props.title;

    const [input, setInput] = useState(`${inputValue}`);

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
        console.log("SetupComponentPDP - updateValue: " + target.value);
  
        props.handler(props.id, target.value, props.component);
  
      }
    }
  
    const enterKeyHandler=(e)=>{
      if( typeof e.key !== 'undefined' && e.key ==='Enter')
      {
          onUpdateValueEnterKey(props, e.target);
      }
    };
  
    const updateChange=(props)=>(e)=>{
      console.log("SetupComponentPDP - updateChange: " + e.target.value);
    }
  
  
  
    // https://medium.freecodecamp.org/reactjs-pass-parameters-to-event-handlers-ca1f5c422b9
    return (
      <div style={{backgroundColor: `${styles.cciBgColor}`}}>
          <Popup
              trigger={
                // inputClassName = 'text-primary m-0 p-0 border-0 cursor-pointer'
                <input className={`${inputClassName}`}
                      id={inputName}
                      type={`${inputType}`}
                      style={inputStyle}
                      placeholder={t(`${props.mrpInputType}:${props.title}`)}
                      name={inputName}
                      value={ input }
                      onChange={updateChange(props)}
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
              <div className='text-nowrap m-0 px-1'>
                {t(`${props.mrpInputType}:${props.title}`)}
              </div>
          </Popup>
      </div>
    );
  }