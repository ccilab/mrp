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


  if( props.title.includes('customer-name'))
  {
    tooltipPosition='bottom left';
  }

  if( props.title.includes('-date') )
  {
    inputType='date';
  }

  if( props.title.includes('-quantity') )
  {
     inputType='number';
  }



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
      if( typeof target !== 'undefined' && target.value === '' && props.title ==='part-name')
        target.value = 'add-part';

      console.log("SetupComponentMPS - updateValue: " + target.value);

      props.handler(target.value, props.component);

    }
  }

  const enterKeyHandler=(e)=>{
    if( typeof e.key !== 'undefined' && e.key ==='Enter')
    {
        onUpdateValueEnterKey(props, e.target);
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
                      id={inputName}
                      type={`${inputType}`}
                      style={inputStyle}
                      placeholder={t(`component:${props.title}`)}
                      name={inputName}
                      value={ input }
                      min = { inputType.includes('number') ? 1 : null}
                      onChange={updateChange(props)}
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
                {t(`component:${props.title}`)}
              </div>
          </Popup>
       }

    </div>
  );
}

export const initializeMPS=( component )=>{
  let mps= JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_mps`)) || _initializeMPS();
  return mps;
}

// demandAndEndDateArray =[[end-date-1, demand-quantity],[end-date-2, demand-quantity]]
const _initializeMPS=()=>{
   let mps={};
   mps.demandAndEndDateArray= [[null,null]]; //array - required quantity of product/component and completed date as key-value 
   mps.customer=null;
   return mps;
}


export const SetupMPS=(props)=>{
  const { t } = useTranslation('commands', {useSuspense: false});
  
  const _className = 'cursor-pointer text-primary border-0 p-1 fa fw fa-edit' + (props.component.displayLogic.selected ? ' bg-info' : ' ');

  if( props.component.mps === null || typeof props.component.mps === 'undefined' )
  {
    props.component.mps = new initializeMPS(props.component);
  }

  const [event, setEvent] = useState('hover'); // 'hover' is the initial state value

  const [demandDateArray, setDemandDateArray] = useState(props.component.mps.demandAndEndDateArray);

  // component.displayLogic.inlineMenuEnabled needs set to true
  const IsClosePopupMenu=( component )=>{
    let invalidEntry = false;
    for( const element of  component.mps.demandAndEndDateArray) {
      if( ! isValidString( element[0] ).isValid ||  !isValidValue( element[1]) )
      {
        invalidEntry = true;
        break;
      }
    }
      
    if( !invalidEntry )  
    {
      sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_mps`, JSON.stringify( component.mps ));
    }
  }


  const setCustomerName=(customerName, component)=>{
    if( isValidString( customerName ))
        component.mps.customer=customerName;
    else
      component.mps.customer='';  //reset to initial value to fail IsClosePopupMenu evaluation

    IsClosePopupMenu(component);
    console.log("SetupMPS - setCustomerName: " + component.mps.customer);
  };

  



  const setTotalRequiredQty=(qty, component)=>{
    if( typeof component.mps === 'undefined' )
      component.mps = new initializeMPS( component );

    let {isValid, value} = isValidValue(qty);

    if( !isValid )
      component.mps.requiredQty=null;
    else
      component.mps.requiredQty=value;

    IsClosePopupMenu(component);

    console.log('setTotalRequiredQty - ' + component.mps.requiredQty);
  }

  //have to be in-sync with forecast demand
  const setCompleteDate=(completeDate, component)=>{
    if( typeof component.mps === 'undefined' )
      component.mps = new initializeMPS( component );

    if( isValidString( completeDate ))
      component.mps.completeDate.push(completeDate);
    else
      component.mps.completeDate = null;

    IsClosePopupMenu(component);
    console.log( 'setCompleteDate : ' + component.mps.completeDate);
  }


  const AddNextDemandEntry=()=>{
    demandDateArray.push([null,null]);
    setDemandDateArray( demandDateArray );
  }

  const removeDemandEntry=()=>{
    ;
  }

  //hover to popup tooltip, click/focus to popup setup MPS inputs
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

 const renderDemandDateInput=( key, value, isLastElement )=>{
  return(
    <div className={'bg-info d-flex'}>  
      <SetupComponentMPS
         title='product-complete-date'   //array of completed date for each required quantity
         value={ key }
         component={props.component}
         handler={setCompleteDate}/>
     
     <SetupComponentMPS
         title='required-quantity'
         value={( value !== null && value > 0 ) ? value : ''} //array of demands for each period 
         component={props.component}
         handler={setTotalRequiredQty}/>
         
     { isLastElement === true ?
       <a id={`${props.component.displayLogic.key}-SetupMPS-add`}
         href={`#${props.component.displayLogic.key}`}
         className='text-info m-0 py-1 px-1 fas fw fa-plus-circle cursor-pointer'
         style={{backgroundColor: `${styles.cciBgColor}`}}
         onAdd={AddNextDemandEntry}> </a>    
         :
         <a id={`${props.component.displayLogic.key}-SetupMPS-remove`}
         href={`#${props.component.displayLogic.key}`}
         className='text-danger m-0 py-1 px-1 fas fw fa-minus-circle cursor-pointer'
         style={{backgroundColor: `${styles.cciBgColor}`}}
         onRemove={removeDemandEntry}> </a>  
     } 
     </div>
  );
 }

  const renderDemandDateInputs=()=>{
    return (
      demandDateArray.map( ( item )=>{
        return renderDemandDateInput( item[0], item[1], demandDateArray.indexOf(item) ===  demandDateArray.length - 1 ? true : false )
      } )
    )
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
          <span className={'text-primary'} >{t('commands:show-setup-MPS')}</span>
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

                {renderDemandDateInputs()}
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
