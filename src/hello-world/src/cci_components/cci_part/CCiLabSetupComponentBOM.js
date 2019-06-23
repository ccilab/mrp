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
  let appendPercentage = props.title.includes('-rate')  ? true : false;

  let rateInputElement = React.createRef();

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

  if( props.title.includes('procurement-type'))
  {
    inputClassName = 'm-0 p-0 border-0 cursor-pointer';
    inputStyle={'backgroundColor': `${styles.cciBgColor}`, 'height':'1em','width':'1em'};
    inputType='radio';
    isRequired = true;
  }

  if( props.title.includes('-quantity') )
  {
     inputType='number';
     isRequired = true;
  }

  if( appendPercentage )
  {
    let value =  parseFloat(inputValue);
    if( isNaN( value ) )
      inputValue='';
    else
      inputValue = value + '(%)';
  }


  const [input, setInput] = useState(`${inputValue}`); // '' is the initial state value

  const filterInputValue=( e )=>{
      // https://stackoverflow.com/questions/10023845/regex-in-javascript-for-validating-decimal-numbers
      // https://regexr.com/ test expression
      setInput(e.target.value);
  };

  const rateAppendPercentage=(e)=>{
    let value=parseFloat(rateInputElement.current.value);
    if( isNaN(value) || value === 0 )
      value='';
    else
      value += ' (%)';

    setInput(value);
  }

  // https://blog.bitsrc.io/understanding-currying-in-javascript-ceb2188c339
  const updateValue=(props)=>(e)=>{
      if( typeof props.handler !== 'undefined')
      {
        if( e.target.value === '' && props.title ==='part-name')
          e.target.value = 'add-part';

        console.log("SetupComponentBOM - updateValue: " + e.target.value);

        // todo: need to update this when lost focus
        // if( appendPercentage )
        //   setInput( e.target.value + '(%)');

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
              <div className='d-flex flex-column m-0 py-1 border-0'>
                <div className='d-inline-flex align-items-center m-0 p-0 border-0' >
                  <input className={`${inputClassName}`}
                        id={`${inputName}-1`}
                        type={inputType}
                        name={inputName}
                        style={inputStyle}
                        value={'InHouse'}
                        defaultChecked ={ inputValue.includes('InHouse') ? true : false}
                        onChange={updateValue(props)}
                        onClose={updateValue(props)}/>
                  <label className={'m-0 px-1 border-0 cursor-pointer'}
                    htmlFor={`${inputName}-1`}
                    style={{'backgroundColor': `${styles.cciBgColor}`, 'color': inputValue.includes('InHouse') ? `${styles.cciInfoBlue}` : `${styles.cciHintRed}`}}>
                     {t(`component:in-house`)}
                    </label>
                </div>
                <div className='d-inline-flex align-items-center m-0 y-0 border-0'>
                  <input  className={`${inputClassName}`}
                          id={`${inputName}-2`}
                          type={inputType}
                          name={inputName}
                          style={inputStyle}
                          value={'Purchase'}
                          defaultChecked ={ inputValue.includes('Purchase') ? true : false}
                          onChange={updateValue(props)}
                          onClose={updateValue(props)}/>
                   <label className={'m-0 px-1 border-0 cursor-pointer'}
                    htmlFor={`${inputName}-2`}
                    style={{'backgroundColor': `${styles.cciBgColor}`, 'color': inputValue.includes('Purchase') ? `${styles.cciInfoBlue}` : `${styles.cciHintRed}`}}>
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
                      ref={ appendPercentage? rateInputElement : null }
                      id={inputName}
                      type={`${inputType}`}
                      required={isRequired}
                      style={inputStyle}
                      placeholder={t(`component:${props.title}`)}
                      name={inputName}
                      value={ input }
                      min = { inputType.includes('number') ? 1 : null}
                      onChange={updateValue(props)}
                      onClose={updateValue(props)}
                      onInput={(e)=>{filterInputValue(e)}}
                      onBlur={ appendPercentage ? (e)=>{rateAppendPercentage(e)} : null}/>
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
     core.ScrapRate=0;    // in %, need /100 when uses it
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

  const setScrapRate=(scrapRate, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeBOM();

    let value = parseFloat(scrapRate);
    if( !isNaN( value ) )
      component.bom.core.ScrapRate = value;
    else
      component.bom.core.ScrapRate = 0;

  }

  const setProcurementType=(procurementType, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeBOM();

    component.bom.core.procurementType = procurementType;

    console.log( 'setProcurementType : ' + component.bom.core.procurementType );
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
            onClick={close}> </a>
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
              // value='' input will show placeholder text
              value={props.component.bom.core.requiredQty > 0 ? props.component.bom.core.requiredQty: ''}
              component={props.component}
              handler={setTotalRequiredQty}
              updateComponent={props.updateComponent}/>
            :
            <SetupComponentBOM
              title='unit-quantity'
              // value='' input will show placeholder text
              value={props.component.bom.core.unitQty > 0 ? props.component.bom.core.unitQty : ''}
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
            title='scrap-rate'
            value={props.component.bom.core.ScrapRate > 0 ? props.component.bom.core.ScrapRate :'' }
            component={props.component}
            handler={setScrapRate}
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
