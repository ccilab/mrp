import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"


export const UserNameInput=(props)=>{
    // deep copy object that doesn't have function inside object
    const originComponent = JSON.parse(JSON.stringify(props.component));

    const { t, i18n } = useTranslation([`${props.mrpInputType}`,'commands'], {useSuspense: false});
    let inputValue = props.value;
    let inputClassName = 'text-primary m-0 p-0 cursor-pointer border-0';
    let inputType='text';
    let cellWidth = ( (typeof props.cellCnt === 'undefined' ) || ( typeof props.cellCnt !== 'undefined' && props.cellCnt === 1) )?  '8rem' : '7rem'; 
    let inputStyle={'backgroundColor': `${styles.cciBgColor}`, width: `${cellWidth}`};
    let tooltipOnMode= ['click','hover'];
    let tooltipPosition= ((typeof props.cellCnt === 'undefined') || (typeof props.cellCnt !== 'undefined' && props.cellCnt === 1)) ? 'top center': props.cellCnt === 3 ? 'bottom center':'top left';

    let name1Name='given-user-name';
    let name1InputId='#' + name1Name;
    let name1Value=inputValue.givenName;
    let name1Placeholder=t(`${props.mrpInputType}:${name1Name}`);

    let name2Name='family-user-name';
    let name2InputId='#' + name2Name;
    let name2Value=inputValue.familyName;
    let name2Placeholder=t(`${props.mrpInputType}:${name2Name}`);

    if( i18n.language.includes('zh'))
    {
        name1Name='family-user-name';
        name1InputId='#' + name1Name;
        name1Value=inputValue.givenName;
        name1Placeholder=t(`${props.mrpInputType}:${name1Name}`);

        name2Name='given-user-name';
        name2InputId='#' + name2Name;
        name2Value=inputValue.familyName;
        name2Placeholder=t(`${props.mrpInputType}:${name2Name}`);
    }

    const [input, setInput] = useState(`${inputValue}`); 

    const updateValue=(props)=>(e)=>{
        if( typeof props.handler !== 'undefined')
        {
            if( e.target.name.includes('-user-name') )
            {
                console.log("UpdateComponentStatus - updateValue: " + e.target.name + ': ' + e.target.value);
                props.handler(e.target.value, props.component, e.target.name );
            }
  
            updateComponent(props);
        }
    };

    const updateComponent=(props)=>{
        if( typeof props.updateComponent !== 'undefined')
        {
          console.log("UpdateComponentStatus - updateComponent: " + props.component.businessLogic.name);
          props.updateComponent(originComponent, props.component);
        }
    };
  
    return (
        <div className='d-flex justify-content-between cursor-pointer'
             style={{backgroundColor: `${styles.cciBgColor}`}}>
            <Popup
            trigger={
              <div className='d-flex justify-content-between m-0 py-1 border-0'>
                  <input className={`${inputClassName}`}
                         id={name1InputId}
                         type={`${inputType}`}
                         name={name1Name}
                         style={inputStyle}
                         value={name1Value}
                         placeholder={name1Placeholder}
                         onChange={updateValue(props)}
                         onClose={updateValue(props)}
                         onInput={ (e) =>{ setInput(e.target.value) }}/>

                

                  <input  className={`${inputClassName}`}
                          id={name2InputId}
                          type={`${inputType}`}
                          name={name2Name}
                          style={inputStyle}
                          value={name2Value}
                          placeholder={name2Placeholder}
                          onChange={updateValue(props)}
                          onClose={updateValue(props)}
                          onInput={ (e) =>{ setInput(e.target.value) }}/>
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
              contentStyle={{  padding: '0' }}>
              <div className='font-weight-normal text-nowrap m-0 p-1'>
                {t(`${props.mrpInputType}:${props.title}`)}
              </div>
          </Popup>
        </div>
    );
}