import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

export const TimePeriod=(props)=>{
  const { t } = useTranslation([`${props.mrpInputType}`,'commands'], {useSuspense: false});

  let inputValue = (props.value === null)? '': props.value;

  let inputClassName = 'text-primary m-0 p-0 border-0 cursor-pointer';
  let cellWidth = ( (typeof props.cellCnt === 'undefined' ) || ( typeof props.cellCnt !== 'undefined' && props.cellCnt === 1) ) ?  '20rem' : '8.5rem';
  let inputStyle={'backgroundColor': `${styles.cciBgColor}`, width: `${cellWidth}`};
  let inputType='number';
  let tooltipOnMode=['click','hover'];
  let tooltipPosition= ( (typeof props.cellCnt === 'undefined' ) || ( typeof props.cellCnt !== 'undefined' && props.cellCnt === 1) ) ? 'top center': props.cellCnt === 3 ? 'bottom center':'top left';
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
  }

  const onUpdateValueEnterKey=(props, target )=>{
    if( typeof props.handler !== 'undefined')
    {
      let value = target.value;
      
      console.log("TimePeriod - updateValue: " + target.value);

      props.handler(props.id, value, props.component);

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
            <div className='text-nowrap m-0 px-1'>
            {t(`${props.mrpInputType}:${props.title}`)}
            </div>
        </Popup>
        <Popup 
            trigger = {
                <i key='show-tables' 
                className='text-primary p-1 fa fa-history cursor-pointer' 
                type='icon'/>
            }
            closeOnDocumentClick
            on={'click'} //['click', 'focus','hover']
            position={ 'bottom right' }
            mouseLeaveDelay={200}
            mouseEnterDelay={0}
            contentStyle={{padding: '0', zIndex : `${styles.bootstrapPopover}`,  border: 'none', backgroundColor: `${styles.cciBgColor}`}}
            arrow={true}
            arrowStyle={{backgroundColor: `${styles.cciBgColor}`}}>
            <table className='table-sm table-hover m-0'>
              <tbody>
                <tr>
                  <td className={'p-0 m-0'}>
                    <span key='day'  className={'cursor-pointer  p-0 m-0 text-info'} style={{fontSize: '0.7rem'}} >{t('commands:day')}</span>
                  </td>
                </tr>
                <tr>
                  <td className={'p-0 m-0'}>
                    <span key='week'  className={'cursor-pointer p-0 m-0 text-info'} style={{fontSize: '0.7rem'}} >{t('commands:week')} </span>
                  </td>
                </tr>
                <tr>
                  <td className={'p-0 m-0'}>
                  <span key='month'  className={'cursor-pointer p-0 m-0 text-info'} style={{fontSize: '0.7rem'}} >{t('commands:month')}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </Popup>
    </div>
  ); 
}