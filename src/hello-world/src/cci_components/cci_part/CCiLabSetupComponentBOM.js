import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

export const SetupComponentBOM=(props)=>{
  const { t } = useTranslation(['component','commands'], {useSuspense: false});
  let componentName = props.value;
  let textColorClass = 'text-primary';
  if( props.value === 'add-part')
  {
    componentName = '';
  }

    
  const [input, setInput] = useState(`${componentName}`); // '' is the initial state value
 
  // https://blog.bitsrc.io/understanding-currying-in-javascript-ceb2188c339
  const updateValue=(props)=>(e)=>{
      if( typeof props.handler !== 'undefined')
      {
        if( e.target.value === '' && props.title ==='part-name')
          e.target.value = 'add-part';

        props.handler(e.target.value, props.component);
      }
  }


  const updateComponent=(props)=>(e)=>{
    if( typeof props.updateComponent !== 'undefined')
      props.updateComponent(props.component);
  }

  // https://medium.freecodecamp.org/reactjs-pass-parameters-to-event-handlers-ca1f5c422b9
  return (
    <div className='d-flex justify-content-between' 
         style={{backgroundColor: `${styles.cciBgColor}`, zIndex: 555 }}>
        {/* <label className='m-0 p-0'>{t(`${props.title}`)}: </label> */}
        <input className={`${textColorClass} m-0 p-0 border-0`} 
               type="text" 
               style={{backgroundColor: `${styles.cciBgColor}`, zIndex: 555}} 
               placeholder={t(`component:${props.title}`)}
               value={input} 
               onChange={updateValue(props)}
               onInput={(e) => setInput(e.target.value)}
               onMouseLeave={updateComponent(props)}/> 
    </div>
  );
}
