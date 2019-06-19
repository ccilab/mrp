import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"


const SetupComponentBOM=(props)=>{
  const { t } = useTranslation(['component','commands'], {useSuspense: false});
  let inputValue = props.value;
  let inputClassName = 'text-primary m-0 p-0 border-0 cursor-pointer';
  let inputStyle={'backgroundColor': `${styles.cciBgColor}`};
  let inputType='text';
  let isRequired=false;
  let tooltipOnMode=['click','hover'];
  let tooltipPosition='top left';
  let inputName=props.title;
  let inputProcurementType = props.title.includes('procurement-type') ? true : false;

  if( props.value === 'add-part')
  {
    inputValue = '';
    isRequired = true;
  }

  if( props.title.includes('part-name'))
  {
    tooltipPosition='bottom left';
    isRequired = true;
  }
  if( props.title.includes('-date') )
  {
    inputType='date';
    isRequired = true;
  }


  if( props.title.includes('-quantity') )
  {
     inputType='number';
     isRequired = true;
  }

  const [input, setInput] = useState(`${inputValue}`); // '' is the initial state value

  // https://blog.bitsrc.io/understanding-currying-in-javascript-ceb2188c339
  const updateValue=(props)=>(e)=>{
      if( typeof props.handler !== 'undefined')
      {
        if( e.target.value === '' && props.title ==='part-name')
          e.target.value = 'add-part';

        console.log("SetupComponentBOM - updateValue: " + e.target.value);
        props.handler(e.target.value, props.component);
     
      }   
      
      updateComponent(props);
  }


  const updateComponent=(props)=>{
    if( typeof props.updateComponent !== 'undefined')
    {
      console.log("SetupComponentBOM - updateComponent: " + props.component.businessLogic.name);
      props.updateComponent(props.component);
    }
  }

  // https://medium.freecodecamp.org/reactjs-pass-parameters-to-event-handlers-ca1f5c422b9
  return (
    <div className='d-flex justify-content-between'
         style={{backgroundColor: `${styles.cciBgColor}`}}>
       { inputProcurementType ?
          <Popup
            trigger={
              <div class='d-flex flex-column m-0 border-0'>
                <div>
                  <input className={`${inputClassName}`}
                        id={'procurement-type-1'}
                        type={'radio'}
                        name={'procurement-type'}
                        style={inputStyle}
                        value={'InHouse'}
                        defaultChecked ={ inputValue.includes('InHouse') ? true : false}
                        onChange={updateValue(props)}
                        onClose={updateValue(props)}/>
                  <label className={'m-0 p-0 border-0 cursor-pointer'}
                    for={'procurement-type-1'}
                    style={{backgroundColor: `${styles.cciBgColor}`, color: inputValue.includes('InHouse') ? `${styles.cciInfoBlue}` : `${styles.cciHintRed}`}}>
                     {t(`component:in-house`)} 
                    </label>
                </div>
                <div>
                  <input  className={`${inputClassName}`}
                          id={'procurement-type-2'}
                          type={'radio'}
                          name={'procurement-type'}
                          style={inputStyle}
                          value={'Purchase'}
                          defaultChecked ={ inputValue.includes('Purchase') ? true : false}
                          onChange={updateValue(props)}
                          onClose={updateValue(props)}/>
                   <label className={'m-0 p-0 border-0 cursor-pointer'}
                    for={'procurement-type-2'}
                    style={{backgroundColor: `${styles.cciBgColor}`, color: inputValue.includes('Purchase') ? `${styles.cciInfoBlue}` : `${styles.cciHintRed}`}}>
                     {t('component:purchase') }
                    </label>
                </div>
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
            contentStyle={{  padding: '0px' }}>
            <div className='text-nowrap m-0 p-1'>
              {t(`component:${props.title}`)}
            </div>
        </Popup>
          :
          <Popup
              trigger={
                <input className={`${inputClassName}`}
                      key={inputName}
                      id={inputName}
                      type={`${inputType}`}
                      required={isRequired}
                      style={inputStyle}
                      placeholder={t(`component:${props.title}`)}
                      name={inputName}
                      value={input}
                      min = { inputType.includes('number') ? 0 : null}
                      onChange={updateValue(props)}
                      onClose={updateValue(props)}
                      onInput={(e) => setInput(e.target.value)}/>
                      // onMouseLeave={updateComponent(props)}/>
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
                {t(`component:${props.title}`)}
              </div>
          </Popup>
       }
       
    </div>
  );
}


export const SetupBOM=(props)=>{
  // using static variable totalRequiredQty inside function
  if( typeof SetupBOM.totalRequiredQty === 'undefined' )  
    SetupBOM.totalRequiredQty=0;

  const _className = 'cursor-pointer text-primary border-0 py-0 px-2 fa fw fa-edit' + (props.component.displayLogic.selected ? ' bg-info' : ' ');

  const initializeBOM=()=>{
    let bom={};
    bom.core=initializeBOMCore();
    bom.extra=initializeBOMExtra();
    return bom;
  }

  // requiredQtyPerShift calculates based on its parent component's unitQty
  // #todo - need to re-design how to handle it
  const initializeBOMCore=()=>{
     let core={};
     core.partNumber='';
     core.unitQty=0;
     core.unitOfMeasure='';
     core.requiredQty= SetupBOM.totalRequiredQty; //required quantity of component/part
     core.startDate='';
     core.completeDate='';
     core.ScrapRate='';
     core.procurementType='';  //'InHouse'(to produce production order), 'Purchase'(to produce purchase order)
     core.warehouse='';
     core.workshop='';
     core.leadTime='';
     core.supplier='';
     core.supplierPartNumber='';
     core.shiftCount=1;         // how many different shifts are needed
     core.requiredQtyPerShift=0;  // required quantity for per shift per run
     core.sameShiftRunCount=1;  //same shift runs how many times
     return core;
  }

  const initializeBOMExtra=()=>{
    let extra={};
    extra.SKU='';
    extra.barCode='';
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

    props.component.bom.core.requiredQty= SetupBOM.totalRequiredQty;

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
     
    // required quantity for per shift per run
    component.bom.core.requiredQtyPerShift = component.bom.core.requiredQty * unitQty/(component.bom.core.shiftCount * component.bom.core.sameShiftRunCount ) ;
    console.log( 'setUnitQty: requiredQty='+component.bom.core.requiredQty);
    console.log( 'setUnitQty: requiredQtyPerShift='+component.bom.core.requiredQtyPerShift);
  }

  const setTotalRequiredQty=(qty, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeBOM();

    component.bom.core.requiredQty=qty;
    SetupBOM.totalRequiredQty=qty;

    console.log('setTotalRequiredQty - ' + SetupBOM.totalRequiredQty);
  }

  const setUnitOfMeasure=(unitOfMeasure, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeBOM();

    component.bom.core.unitOfMeasure=unitOfMeasure;
  }

  const setProcurementType=(procurementType, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeBOM();

    component.bom.core.procurementType = procurementType;
  }

  const setStartDate=(startDate, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeBOM();

    component.bom.core.startDate=startDate;
  }

  const setCompleteDate=(completeDate, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeBOM();

    component.bom.core.completeDate=completeDate;
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
      on={['click', 'focus']}
      position={'right top'}
      defaultOpen={false}  //don't show setupBOM menu unless user click the edit icon
      contentStyle={{ padding: '0px', border: 'none', backgroundColor: `${styles.cciBgColor}`}} //
      arrow={true}
      arrowStyle={{backgroundColor: `${styles.cciBgColor}`}}>
      {close => (
        <div className={'bg-info d-flex flex-column'} >
          <div className={'bg-info d-flex'}>
          <SetupComponentBOM
            title='part-name'
            value={props.component.businessLogic.name}
            component={props.component}
            handler={setPartName}
            updateComponent={props.updateComponent}/>
          <a id={`${props.component.displayLogic.key}-setupBOM`}
            href={`#${props.component.displayLogic.key}`}
            className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
            style={{backgroundColor: `${styles.cciBgColor}`}}
            onClick={close}/>
        </div>
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
              value={props.component.bom.core.requiredQty}
              component={props.component}
              handler={setTotalRequiredQty}
              updateComponent={props.updateComponent}/>
            :
            <SetupComponentBOM
              title='unit-quantity'
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

          <hr className='my-0 bg-info'
              style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

          <SetupComponentBOM
              title='procurement-type'
              value={props.component.bom.core.procurementType}
              component={props.component}
              handler={setProcurementType}
              updateComponent={props.updateComponent}/>

          <hr className='my-0 bg-info'
              style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

          <SetupComponentBOM
              title='start-product-date'
              value={props.component.bom.core.startDate}
              component={props.component}
              handler={setStartDate}
              updateComponent={props.updateComponent}/>

          <hr className='my-0 bg-info'
              style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

          <SetupComponentBOM
              title='product-complete-date'
              value={props.component.bom.core.completeDate}
              component={props.component}
              handler={setCompleteDate}
              updateComponent={props.updateComponent}/>
          </div>
        )}
      </Popup>
      :
      null
    )
  )
}
