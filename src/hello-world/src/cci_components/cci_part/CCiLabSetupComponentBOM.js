import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

export const SetupComponentBOM=(props)=>{
  const [input, setInput] = useState(`${props.value}`); // '' is the initial state value
  const { t } = useTranslation('component', {useSuspense: false});
 
  // https://blog.bitsrc.io/understanding-currying-in-javascript-ceb2188c339
  const updateValue=(props)=>(e)=>{
      if( typeof props.handler !== 'undefined')
        props.handler(e.target.value, props.component)
  }

  const updateComponent=(props)=>(e)=>{
    if( typeof props.updateComponent !== 'undefined')
      props.updateComponent(props.component);
  }

  // https://medium.freecodecamp.org/reactjs-pass-parameters-to-event-handlers-ca1f5c422b9
  return (
    <div className='d-flex justify-content-between' style={{backgroundColor: `${styles.cciBgColor}`}}>
        {/* <label className='m-0 p-0'>{t(`${props.title}`)}: </label> */}
        <input className='m-0 p-0 border-0 text-primary' 
               type="text" 
               style={{backgroundColor: `${styles.cciBgColor}`}} 
               placeholder={t(`${props.title}`)}
               value={input} 
               onChange={updateValue(props)}
               onInput={(e) => setInput(e.target.value)}
               onMouseLeave={updateComponent(props)}/> 
    </div>
  );
}
