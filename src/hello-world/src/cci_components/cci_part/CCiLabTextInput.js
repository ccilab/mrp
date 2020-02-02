import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

// popup menu class doesn't support bootstrap e.g. d-flex, flex-fill class or native flex
// const trigger = this.TriggerEl.getBoundingClientRect(); calculates static size of trigger element
export const TextInput=(props)=>{
    const { t } = useTranslation([`${props.mrpInputType}`,'commands'], {useSuspense: false});

    let inputValue = (props.value === null)? '': props.value;

    let inputClassName = 'text-primary m-0 pl-2 pr-0 border-0 cursor-pointer';
    let cellWidth = ( (typeof props.cellCnt === 'undefined' ) || ( typeof props.cellCnt !== 'undefined' && props.cellCnt === 1) ) ?  '20rem' : '10rem';
    let inputStyle={'backgroundColor': `${styles.cciBgColor}`, width: `${cellWidth}`};
    let inputType='text';
    let tooltipOnMode=['click','hover'];
    let tooltipPosition= ( typeof props.toolTipPosition === 'undefined' ) ? 'top center': props.toolTipPosition;
    let inputName=props.title;

    const [input, setInput] = useState(`${inputValue}`); // '' is the initial state value

    const filterInputValue=( e )=>{
      // https://stackoverflow.com/questions/10023845/regex-in-javascript-for-validating-decimal-numbers
      // https://regexr.com/ test expression
      setInput(e.target.value);
    };

    // https://blog.bitsrc.io/understanding-currying-in-javascript-ceb2188c339
    const updateValue=(props)=>(e)=>{
        onUpdateValueEnterKey( props, e.target);
    };

    const onUpdateValueEnterKey=(props, target )=>{
        if( typeof props.handler !== 'undefined')
        {
          let value = target.value;
         
          console.log("TextInput - updateValue: " + target.value);

          props.handler(props.id, value, props.component);

        }
    };

    const enterKeyHandler=(e)=>{
        if( typeof e.key !== 'undefined' && e.key ==='Enter')
        {
            onUpdateValueEnterKey(props, e.target);
        }
    };

    return (
        <div style={{backgroundColor: `${styles.cciBgColor}`}}>
            <Popup
              trigger={
                <input key={props.id}
                      className={`${inputClassName}`}
                      id={inputName+props.id}
                      type={`${inputType}`}
                      style={inputStyle}
                      placeholder={t(`${props.mrpInputType}:${props.title}`)}
                      name={inputName}
                      value={ input }
                      min = {null}
                      readOnly = {typeof props.readOnly === 'undefined' ?  false : props.readOnly }
                      onChange={ updateValue(props) }
                      onClose={updateValue(props)}
                      onInput={(e)=>{filterInputValue(e)}}
                      onKeyPress={ (e)=>enterKeyHandler(e) }
                      onBlur={  updateValue(props) }/>
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