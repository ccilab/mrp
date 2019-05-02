import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const SetupComponentBOM=(props)=>{
  const [input, setInput] = useState(`${props.value}`); // '' is the initial state value
  const { t } = useTranslation('component', {useSuspense: false});

  return (
    <div className='d-flex justify-content-between'>
        <label>{t(`${props.title}`)}:</label>
        <input  type="text" value={input} onInput={(e) => setInput(e.target.value)}/> 
    </div>
  );
}
