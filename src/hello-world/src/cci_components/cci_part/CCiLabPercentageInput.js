import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

export const PercentageInput=(props)=>{
    const { t } = useTranslation([`${props.mrpInputType}`,'commands'], {useSuspense: false});



    let inputClassName = 'text-primary m-0 pl-2 pr-0 border-0 cursor-pointer';
    let cellWidth = ( (typeof props.cellCnt === 'undefined' ) || ( typeof props.cellCnt !== 'undefined' && props.cellCnt === 1) ) ?  '20rem' : '10rem';
    let inputStyle={'backgroundColor': `${styles.cciBgColor}`, width: `${cellWidth}`};
    let inputType='text';
    let tooltipOnMode=['click','hover'];
    let tooltipPosition= ( (typeof props.cellCnt === 'undefined' ) || ( typeof props.cellCnt !== 'undefined' && props.cellCnt === 1) ) ? 'top center': props.cellCnt === 'toolTipPosition' ? 'bottom center':'top left';
    let inputName=props.title;

    let rateInputElement = React.createRef();

    let inputValue = (props.value === null)? '': props.value;

    const attachPercent=(value)=>{
        let percentage;
        let lValue =  parseFloat(value);
        if( isNaN( lValue ) )
        {
            percentage='';
        }
        else{
            percentage = lValue + (lValue ? ' (%)' : '');
        }
        return percentage;
    }
 
    inputValue=attachPercent(inputValue);

    const [input, setInput] = useState(`${inputValue}`); // '' is the initial state value

    const filterInputValue=( e )=>{
        // https://stackoverflow.com/questions/10023845/regex-in-javascript-for-validating-decimal-numbers
        // https://regexr.com/ test expression
        setInput(e.target.value);
    };

    const rateAppendPercentage=(_value)=>{
        let value=attachPercent(_value);
       
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

      console.log("PercentageInput - updateValue: " + target.value);

      props.handler(props.id, target.value, props.component);

    }
  }

  const enterKeyHandler=(e)=>{
    if( typeof e.key !== 'undefined' && e.key ==='Enter')
    {
        rateAppendPercentage(rateInputElement.current.value);
    }
  };



  // https://medium.freecodecamp.org/reactjs-pass-parameters-to-event-handlers-ca1f5c422b9
  return (
    <div className='d-flex justify-content-between'
         style={{backgroundColor: `${styles.cciBgColor}`}}>
          <Popup
              trigger={
                <input className={`${inputClassName}`}
                      ref={ rateInputElement }
                      id={inputName}
                      type={`${inputType}`}
                      style={inputStyle}
                      placeholder={t(`operations:${props.title}`)}
                      name={inputName}
                      value={ input }
                      min = { inputType.includes('number') ? 1 : null}
                      onChange={ updateValue(props) }
                      onClose={updateValue(props)}
                      onInput={(e)=>{filterInputValue(e)}}
                      onKeyPress={ (e)=>enterKeyHandler(e) }
                      onBlur={ (e)=>{onBlurHandler(e)} }/>
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