import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

import { isValidString, isValidValue } from "./CCiLabUtility";


const SetupComponentMPS=(props)=>{
  const { t } = useTranslation(['component','commands'], {useSuspense: false});

  let inputValue = (props.value === null)? '': props.value;

  let inputClassName = 'text-primary m-0 p-0 border-0 cursor-pointer';
  let inputStyle={'backgroundColor': `${styles.cciBgColor}`};
  let inputType='text';
  let tooltipOnMode=['click','hover'];
  let tooltipPosition='top left';
  let inputName=props.title;
  let inputProcurementType = props.title.includes('procurement-type') ? true : false;
  let appendPercentage = props.title.includes('-rate')  ? true : false;

  let rateInputElement = React.createRef();

  if( props.value === 'add-part')
  {
    inputValue = '';
  }

  if( props.title.includes('part-name'))
  {
    tooltipPosition='bottom left';
  }

  if( props.title.includes('-date') )
  {
    inputType='date';
  }

  if( props.title.includes('procurement-type'))
  {
    inputClassName = 'm-0 p-0 border-0 cursor-pointer';
    inputStyle={'backgroundColor': `${styles.cciBgColor}`, 'height':'1em','width':'1em'};
    inputType='radio';
  }

  if( props.title.includes('-quantity') )
  {
     inputType='number';
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

  const rateAppendPercentage=(_value)=>{
    let value=parseFloat(_value);
    if( isNaN(value) )
      value='';
    else
      value += value ? ' (%)' : '';

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

    //     console.log("SetupComponentMPS - updateValue: " + e.target.value);

    //     props.handler(e.target.value, props.component);
    //   }
    onUpdateValueEnterKey( props, e.target);
  }

  const onUpdateValueEnterKey=(props, target )=>{
    if( typeof props.handler !== 'undefined')
    {
      if( typeof target !== 'undefined' && target.value === '' && props.title ==='part-name')
        target.value = 'add-part';

      console.log("SetupComponentMPS - updateValue: " + target.value);

      props.handler(target.value, props.component);

    }
  }

  const enterKeyHandler=(e)=>{
    if( typeof e.key !== 'undefined' && e.key ==='Enter')
    {
      if( appendPercentage )
      {
        rateAppendPercentage(rateInputElement.current.value);
      }
      else
      {
        onUpdateValueEnterKey(props, e.target);
      }
    }
  };

  const updateChange=(props)=>(e)=>{
    console.log("SetupComponentMPS - updateChange: " + e.target.value);
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
                      style={inputStyle}
                      placeholder={t(`component:${props.title}`)}
                      name={inputName}
                      value={ input }
                      min = { inputType.includes('number') ? 1 : null}
                      onChange={appendPercentage ? updateValue(props) : updateChange(props)}
                      onClose={updateValue(props)}
                      onInput={(e)=>{filterInputValue(e)}}
                      onKeyPress={ (e)=>enterKeyHandler(e) }
                      onBlur={ appendPercentage ? (e)=>{onBlurHandler(e)} :updateValue(props)}/>
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

export const CanEnableInlineMenu = ( component )=>{
  if( isValidString( component.businessLogic.name) &&
      component.bom !== null &&
      typeof component.bom !== 'undefined' &&
      typeof component.bom.mps !== 'undefined' &&
      component.bom.mps !== null &&
      isValidString( component.bom.mps.partNumber ) &&
      ( isValidValue( component.bom.mps.requiredQty ).isValid ||
        isValidValue( component.bom.mps.unitQty ).isValid ) &&
      isValidValue( component.bom.mps.scrapRate).isValid &&
      isValidString( component.bom.mps.procurementType) &&
      isValidString( component.bom.mps.startDate) &&
      isValidString( component.bom.mps.completeDate)
)
  {
    component.displayLogic.inlineMenuEnabled = true;
  }
  else
  {
    component.displayLogic.inlineMenuEnabled = false;
  }
}

export const initializeMPS=( component )=>{
  let mps= JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_mps`)) || _initializeMPS();
  return mps;
}

// requiredQtyPerShift calculates based on its parent component's unitQty
// #todo - need to re-design how to handle it
const _initializeMPS=()=>{
   let mps={};
   mps.demandAndEndDateMap= new Map(); //required quantity of component/part
   mps.startDate=null;
   mps.completeDate=null; //used as key in demandAndEndDateMap
   mps.customer=null;
   return mps;
}


export const SetupMPS=(props)=>{
  const { t } = useTranslation('commands', {useSuspense: false});
  
  const _className = 'cursor-pointer text-primary border-0 p-1 fa fw fa-edit' + (props.component.displayLogic.selected ? ' bg-info' : ' ');

  const [event, setEvent] = useState('hover'); // '' is the initial state value

  // deep copy object that doesn't have function inside object
  const originComponent = JSON.parse(JSON.stringify(props.component));

   // component.displayLogic.inlineMenuEnabled needs set to true
  const IsClosePopupMenu=( component )=>{
      // update component name
      if( isValidValue( component.mps.requiredQty ).isValid &&  isValidString ( component.mps.completeDate) )
      {
          if( originComponent.businessLogic.name !== component.businessLogic.name )
          {
            sessionStorage.removeItem( `${component.displayLogic.key}_${originComponent.businessLogic.name}_mps`);
          }
          sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_mps`, JSON.stringify( component.bom.mps ));
      }
  }



  if( props.component.mps === null || typeof props.component.mps === 'undefined' )
  {
    props.component.mps = new initializeMPS(props.component);
  }

  const setCustomerName=(customerName, component)=>{
    if( isValidString( customerName ))
        component.mps.customer=customerName;
    else
      component.mps.customer='';  //reset to initial value to fail IsClosePopupMenu evaluation

    IsClosePopupMenu(component);
    console.log("SetupMPS - setCustomerName: " + component.mps.customer);
  };

  


  const setStartDate=(startDate, component)=>{
    if( typeof component.mps === 'undefined' )
      component.mps = new initializeMPS( component );

    if( isValidString( startDate ))
      component.mps.startDate=startDate;
    else
      component.mps.startDate = null;

    IsClosePopupMenu(component);
    console.log( 'setStartDate : ' + component.mps.startDate);
  }

  const setTotalRequiredQty=(qty, component)=>{
    if( typeof component.bom === 'undefined' )
      component.mps = new initializeMPS( component );

    let {isValid, value} = isValidValue(qty);

    if( !isValid )
      component.bom.mps.requiredQty=null;
    else
      component.bom.mps.requiredQty=value;

    IsClosePopupMenu(component);

    console.log('setTotalRequiredQty - ' + component.mps.requiredQty);
  }

  //have to be in-sync with forecast demand
  const setCompleteDate=(completeDate, component)=>{
    if( typeof component.bom === 'undefined' )
      component.mps = new initializeMPS( component );

    if( isValidString( completeDate ))
      component.mps.completeDate.push(completeDate);
    else
      component.mps.completeDate = null;

    IsClosePopupMenu(component);
    console.log( 'setCompleteDate : ' + component.mps.completeDate);
  }


  //hover to popup tooltip, click/focus to popup setup BOM inputs
  // based on event from mouse or click for desktop devices, click for touch devices
  const setEventState=()=>
  {
    if( event === 'click' )
    {
       setEvent('hover');
       return;
    }
    if( event === 'hover' )
    {
      setEvent('click');
      return;
    }
  }

  return (
    // for manufacturing only show root MPS, all sub components are derived from it programmatically
    ( props.component.displayLogic.selected && ( props.component.businessLogic.parentIds.length === 0 || props.component.stocking )? 
      ( `${event}` === 'hover' ?
      <Popup
        trigger={
          <i
            key={`component-${props.component.displayLogic.key}`}
            id={`#component-${props.component.displayLogic.key}`}
            type="icon"
            onClick={setEventState}
            // 'cursor-pointer text-primary border-0 py-0 px-2 fa fw fa-edit' + (props.component.displayLogic.selected ? ' bg-info' : ' ');
            className={`${_className}`}
            style={{backgroundColor: `${styles.cciBgColor}`}}/>
        }
          closeOnDocumentClick={true}
          on={`${event}`}
          position={'right top'}
          defaultOpen={false}
          contentStyle={{ padding: '0px', border: 'none', backgroundColor: `${styles.cciBgColor}`}} 
          mouseLeaveDelay={0}
          mouseEnterDelay={400}
          arrow={true}
          arrowStyle={{backgroundColor: `${styles.cciBgColor}`}}>
          <span className={'text-primary'} >{t('commands:show-setup-BOM')}</span>
      </Popup>
      :
      <Popup
        trigger={
          <i
            key={`component-${props.component.displayLogic.key}`}
            id={`#component-${props.component.displayLogic.key}`}
            type="icon"
            // 'cursor-pointer text-primary border-0 py-0 px-2 fa fw fa-edit' + (props.component.displayLogic.selected ? ' bg-info' : ' ');
            className={`${_className}`}
            style={{backgroundColor: `${styles.cciBgColor}`}}/>
        }
          closeOnDocumentClick={true}
          on={`${event}`}
          onClose={setEventState}
          position={'right top'}
          defaultOpen={false}  
          contentStyle={{ padding: '0px', border: 'none', backgroundColor: `${styles.cciBgColor}`}} 
          arrow={true}
          arrowStyle={{backgroundColor: `${styles.cciBgColor}`}}>
          {close => (      
              <div className={'bg-info d-flex flex-column'} >
              <div className={'bg-info d-flex'}>
                
                <SetupComponentMPS
                  title='customer-name'
                  value={(props.component.mps.requiredQty !== null && props.component.mps.requiredQty > 0 ) ? props.component.mps.requiredQty: ''} //array of demands for each period 
                  component={props.component}
                  handler={setCustomerName}/>
                <a id={`${props.component.displayLogic.key}-SetupMPS`}
                  href={`#${props.component.displayLogic.key}`}
                  className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                  style={{backgroundColor: `${styles.cciBgColor}`}}
                  onClick={ close }> </a>
              </div>
              <hr className='my-0 bg-info'
                    style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>
              
              <SetupComponentMPS
                  title='required-quantity'
                  value={(props.component.mps.requiredQty !== null && props.component.mps.requiredQty > 0 ) ? props.component.mps.requiredQty: ''} //array of demands for each period 
                  component={props.component}
                  handler={setTotalRequiredQty}/>
                  
              <hr className='my-0 bg-info'
                    style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

              <SetupComponentMPS
                  title='start-product-date'
                  value={props.component.bom.mps.startDate }
                  component={props.component}
                  handler={setStartDate}/>

              <hr className='my-0 bg-info'
                  style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

              <SetupComponentMPS
                  title='product-complete-date'   //array of completed date for each required quantity
                  value={props.component.bom.mps.completeDate }
                  component={props.component}
                  handler={setCompleteDate}/>
              </div>
              )
          }
      </Popup>
      )
      :
      null
    )
  )
}
