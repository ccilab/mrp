import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

import { isValidString, isValidValue } from "./CCiLabUtility";


const SetupComponentPDP=(props)=>{
  const { t } = useTranslation(['component','commands'], {useSuspense: false});

  let inputValue = (props.value === null)? '': props.value;

  let inputClassName = 'text-primary m-0 p-0 border-0 cursor-pointer';
  let inputStyle={'backgroundColor': `${styles.cciBgColor}`};
  let inputType='text';
  let tooltipOnMode=['click','hover'];
  let tooltipPosition='top left';
  let inputName=props.title;

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
      console.log("SetupComponentPDP - updateValue: " + target.value);

      props.handler(props.id, target.value, props.component);

    }
  }

  const enterKeyHandler=(e)=>{
    if( typeof e.key !== 'undefined' && e.key ==='Enter')
    {
        onUpdateValueEnterKey(props, e.target);
    }
  };

  const updateChange=(props)=>(e)=>{
    console.log("SetupComponentPDP - updateChange: " + e.target.value);
  }



  // https://medium.freecodecamp.org/reactjs-pass-parameters-to-event-handlers-ca1f5c422b9
  return (
    <div className='d-flex justify-content-between'
         style={{backgroundColor: `${styles.cciBgColor}`}}>

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

    </div>
  );
}

export const initializePDP=( component )=>{
  let pdp= JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_pdp`)) || _initializeMPS();
  return pdp;
}

// demandAndEndDateArray =[[id-1, end-date-1, demand-quantity],[id-2, end-date-2, demand-quantity]]
const _initializeMPS=()=>{
   let pdp={};
   pdp.demandAndEndDateArray= [[null,null]]; //array - required quantity of product/component and completed date as key-value 
   pdp.customer=null;
   return pdp;
}

//Production Demand Plan
export const SetupPDP=(props)=>{
  const { t } = useTranslation('commands', {useSuspense: false});
  
  const _className = 'cursor-pointer text-primary border-0 p-1 fa fw fa-edit' + (props.component.displayLogic.selected ? ' bg-info' : ' ');


  const [event, setEvent] = useState('hover'); // 'hover' is the initial state value

    
  if( props.component.pdp === null || typeof props.component.pdp === 'undefined' )
  {
    props.component.pdp = new initializePDP(props.component);
  }

  const [demandDateArray, setDemandDateArray] = useState(props.component.pdp.demandAndEndDateArray);

  // component.displayLogic.inlineMenuEnabled needs set to true
  const saveValidPDPEntry=( component )=>{
    component.pdp.demandAndEndDateArray = demandDateArray;
    sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_pdp`, JSON.stringify( component.pdp ));
  }


  const setCustomerName=(index, customerName, component)=>{
    if( isValidString( customerName ))
        component.pdp.customer=customerName;
    else
      component.pdp.customer='';  //reset to initial value to fail saveValidPDPEntry evaluation

    saveValidPDPEntry(component);
    console.log("SetupPDP - setCustomerName: " + component.pdp.customer);
  };

  



  const setTotalRequiredQty=(index, qty, component)=>
  {
    if( typeof component.pdp === 'undefined' )
      component.pdp = new initializePDP( component );

    let {isValid, value} = isValidValue(qty);

    if( isValid )
    {
        for( let item of demandDateArray )
        {
          const id = demandDateArray.indexOf( item );
          if( id === index )
          {
            item[1] = value;
            break;
          }
        }
     }

    saveValidPDPEntry(component);
  }

  //have to be in-sync with forecast demand
  const setCompleteDate=(index, completeDate, component)=>{
    if( typeof component.pdp === 'undefined' )
      component.pdp = new initializePDP( component );

    if( isValidString( completeDate ))
    {
      for( let item of demandDateArray )
      {
        const id = demandDateArray.indexOf( item );
        if( id === index )
        {
          item[0] = completeDate;
          break;
        }
      }
    }

    saveValidPDPEntry(component);
  }

  //hover to popup tooltip, click/focus to popup setup pdp inputs
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

  const AddNextDemandEntry=(index)=>(e)=>{
    demandDateArray.push([null,null]);
    saveValidPDPEntry(props.component);
    setDemandDateArray( demandDateArray );
    window.dispatchEvent(new Event('resize'));  //resize popup menu
  }

  const removeDemandEntry=(index)=>(e)=>{
    for( let item of demandDateArray )
    {
      const id = demandDateArray.indexOf( item );
      if( id === index )
      {
        demandDateArray.splice(id, 1);
      }
    }
    
    saveValidPDPEntry(props.component);
    setDemandDateArray( demandDateArray );
    window.dispatchEvent(new Event('resize'));   //resize popup menu
  }

  

 const renderDemandDateInput=(uniqueKey, index, endDate, demand, isLastElement )=>{
  return(
    <div key={uniqueKey} className={'bg-info d-flex'}>  
      <SetupComponentPDP
         title='product-complete-date'   //array of completed date for each required quantity
         id={index}
         value={ endDate }
         component={props.component}
         handler={setCompleteDate}/>
     
     <SetupComponentPDP
         title='required-quantity'
         id={index}
         value={( demand !== null && demand > 0 ) ? demand : ''} //array of demands for each period 
         component={props.component}
         handler={setTotalRequiredQty}/>
         
     { isLastElement === true ?
       <i id={`${index}`}
         className='text-info m-0 py-1 px-1 fas fw fa-plus-circle cursor-pointer'
         style={{backgroundColor: `${styles.cciBgColor}`}}
         onClick={AddNextDemandEntry(index)}/>
         :
         <i id={`${index}`}
         className='text-danger m-0 py-1 px-1 fas fw fa-minus-circle cursor-pointer'
         style={{backgroundColor: `${styles.cciBgColor}`}}
         onClick={removeDemandEntry(index)}/>
     } 
     </div>
  );
 }

  const renderDemandDateInputs=()=>{
    return (
      demandDateArray.map( ( item )=>{
        let id = demandDateArray.indexOf(item);
        return renderDemandDateInput( Math.random(), id, item[0], item[1], id ===  demandDateArray.length - 1 ? true : false )
      } )
    )
  }

  return (
    // for manufacturing only show root pdp, all sub components are derived from it programmatically
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
          <span className={'text-primary'} >{t('commands:show-setup-PDP')}</span>
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
                  <SetupComponentPDP
                    title='customer-name'
                    id={-1}
                    value={props.component.pdp.customer} //array of demands for each period 
                    component={props.component}
                    handler={setCustomerName}/>
                  <i id={`${props.component.displayLogic.key}-SetupPDP`}
                    className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                    style={{backgroundColor: `${styles.cciBgColor}`}}
                    onClick={ close }/>
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
