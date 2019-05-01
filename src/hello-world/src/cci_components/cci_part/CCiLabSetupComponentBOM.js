import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const SetupComponentBOM=()=>{
  const [input, setInput] = useState(''); // '' is the initial state value
  const { t } = useTranslation('component', {useSuspense: false});
  return (
    <div>
        <label>Please specify:</label>
        <input  type="text" value={input} onInput={(e) => setInput(e.target.value)}/> 
    </div>
  );
}
