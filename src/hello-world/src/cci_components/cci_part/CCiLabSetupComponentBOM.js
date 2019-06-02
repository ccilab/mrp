import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
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
         style={{backgroundColor: `${styles.cciBgColor}`}}>
        {/* <label className='m-0 p-0'>{t(`${props.title}`)}: </label> */}
        <input className={`${textColorClass} m-0 p-0 border-0`} 
               type="text" 
               style={{backgroundColor: `${styles.cciBgColor}`}} 
               placeholder={t(`component:${props.title}`)}
               value={input} 
               onChange={updateValue(props)}
               onInput={(e) => setInput(e.target.value)}
               onMouseLeave={updateComponent(props)}/> 
    </div>
  );
}


export const SetupBOM=(props)=>{
  const _className = 'cursor-pointer text-primary border-0 py-0 px-2 fa fw fa-edit' + (props.component.displayLogic.selected ? ' bg-info' : ' ');
  
  const initializeBOM=()=>{
    let bom={};
    bom.core=initializeBOMCore();
    bom.extra=initializeBOMExtra();
    return bom;
  }
 
  const initializeBOMCore=()=>{
     let core={};
     core.OrderQty='';
     core.partNumber='1a-345';
     core.unitQty='6';
     core.unitOfMeasure='piece';
     core.Qty='';
     core.Scrap='';
     core.procurementType='';
     core.warehouse='';
     core.workshop='';
     core.leadTime='';
     core.rejectRate='';
     core.supplier='';
     core.supplierPartNumber='';
     return core;
  }

  const initializeBOMExtra=()=>{
    let extra={};
    extra.SKU='';
    extra.barcode='';
    extra.revision='';
    extra.refDesignator='';
    extra.phase='';
    extra.category='';
    extra.material='';
    extra.process='';
    extra.unitCost='';
    extra.assemblyLine='';
    extra.description='';
    extra.note='';
    return extra;
  };

  if( typeof props.component.bom === 'undefined' )
    props.component.bom = new initializeBOM();

  const setPartName=(partName, component)=>{
    component.businessLogic.name=partName;
    console.log("SetupBOM - setPartName: " + component.businessLogic.name);
  };

  const setPartNumber=(partNumber, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeBOM();

    component.bom.core.partNumber=partNumber;

    console.log("SetupBOM - setPartNumber: " + component.bom.core.partNumber);
  };

  const setUnitQty=(unitQty, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeBOM();

    component.bom.core.unitQty=unitQty;

  }

  const setTotalRequiredQty=(qty, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeBOM();

    component.bom.core.Qty=qty;
  }

  const setUnitOfMeasure=(unitOfMeasure, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeBOM();

    component.bom.core.unitOfMeasure=unitOfMeasure;
  }

  return (
    ( props.component.displayLogic.selected ? 
      <Popup
        trigger={
          <button 
            key={`component-${props.component.displayLogic.key}`}
            id={`#component-${props.component.displayLogic.key}`}
            type="button"
            // 'bg-info text-primary border-0 py-0 px-2 fa fw fa-edit' : 'text-primary border-0 py-0 px-2 fa fw fa-edit';
            className={`${_className}`}
            style={{'height': `auto`, backgroundColor: `${styles.cciBgColor}`}}/>
      }
      closeOnDocumentClick
      on="click"
      position={ 'right top' }
      mouseLeaveDelay={400}
      mouseEnterDelay={0}
      contentStyle={{ padding: '0px', border: 'none', backgroundColor: `${styles.cciBgColor}`}} //
      arrow={true}
      arrowStyle={{backgroundColor: `${styles.cciBgColor}`}}>
        <div className={'bg-info d-flex flex-column'} >
        <SetupComponentBOM 
          title='part-name'
          value={props.component.businessLogic.name}
          component={props.component}
          handler={setPartName}
          updateComponent={props.updateComponent}/>

          <hr className='my-0 bg-info' 
              style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>
          
          <SetupComponentBOM 
            title='part-number'
            value={props.component.bom.core.partNumber}
            component={props.component}
            handler={setPartNumber}
            updateComponent={props.updateComponent}/>

          <hr className='my-0 bg-info' 
              style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

          { props.component.businessLogic.parentIds.length === 0 ?
            <SetupComponentBOM 
            title='required-quantity'
              value={props.component.bom.core.Qty}
              component={props.component}
              handler={setTotalRequiredQty}
              updateComponent={props.updateComponent}/>
            :
            <SetupComponentBOM 
              title='unit-qty'
              value={props.component.bom.core.unitQty}
              component={props.component}
              handler={setUnitQty}
              updateComponent={props.updateComponent}/>
          }

          <hr className='my-0 bg-info' 
              style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

          <SetupComponentBOM 
              title='unit-of-measure'
              value={props.component.bom.core.unitOfMeasure}
              component={props.component}
              handler={setUnitOfMeasure}
              updateComponent={props.updateComponent}/>


        </div>
      </Popup>
      :
      null
    )
  )
}
