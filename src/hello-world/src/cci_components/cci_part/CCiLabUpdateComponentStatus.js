import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

const ShowStatus=(props)=>{
  const { t } = useTranslation('component', {useSuspense: false});

  return (
    <span 
        key={`component-${props.component.displayLogic.key}`}
        id={`#component-${props.component.displayLogic.key}`} 
        className={props.statusClassName} 
        style={{'display':'inline-block','height': `auto`}} 
        draggable={props.statusDraggable}
        onClick={ props.onClickHandler }>
        {props.progress}% - {props.remainingTime} {t('remaining-time-unit')}
    </span> 
  );
}

const UpdateComponentStatus=(props)=>{
  const { t } = useTranslation(['component','commands'], {useSuspense: false});
  let inputValue = props.value;
  let textColorClass = 'text-primary';
  let inputType='text';
  let input2ndType='text';
  let isRequired=false;
  let tooltipOnMode='hover';

  if( props.title.includes('team-name') )
  {
    tooltipOnMode='click';
    isRequired = true;
  }

  // https://www.w3schools.com/bootstrap4/bootstrap_forms_input_group.asp
  // type="datetime-local" is not supported in Firefox, Safari 
  if( props.title.includes('-date-time') )
  {
    inputType='date';
    input2ndType='time'
    isRequired = true;
  }
    

  if( props.title.includes('quantity-') )
  {
     inputType='number';
     isRequired = true;
  }
   
    
  const [input, setInput] = useState(`${inputValue}`); // '' is the initial state value
 
  // https://blog.bitsrc.io/understanding-currying-in-javascript-ceb2188c339
  const updateValue=(props)=>(e)=>{
      if( typeof props.handler !== 'undefined')
      {
        console.log("UpdateComponentStatus - updateValue: " + e.target.value);
        props.handler(e.target.value, props.component);
        updateComponent(props);
      }
  }


  const updateComponent=(props)=>{
    if( typeof props.updateComponent !== 'undefined')
    {
      console.log("UpdateComponentStatus - updateComponent: " + props.component.businessLogic.name);
      props.updateComponent(props.component);
    }
  }

  // https://medium.freecodecamp.org/reactjs-pass-parameters-to-event-handlers-ca1f5c422b9
  return (
    <div className='d-flex justify-content-between' 
         style={{backgroundColor: `${styles.cciBgColor}`}}>
        {/* <label className='m-0 p-0'>{t(`${props.title}`)}: </label> */}
        <Popup 
              trigger={
                <input className={`${textColorClass} m-0 p-0 border-0 cursor-default`} 
                      type={`${inputType}`} 
                      required={isRequired}
                      style={{backgroundColor: `${styles.cciBgColor}`}} 
                      placeholder={t(`component:${props.title}`)}
                      value={input} 
                      onChange={updateValue(props)}
                      onInput={(e) => setInput(e.target.value)}/>
                      // onMouseLeave={updateComponent(props)}/> 
              }
              id={`${props.component.displayLogic.key}-tooltip`}
              position={'right center'}
              closeOnDocumentClick
              on={tooltipOnMode}
              arrow={false}
              mouseLeaveDelay={0}
              mouseEnterDelay={0}
              contentStyle={{ padding: '0px', border: 'thin solid black' }}
              >
              <div className='text-nowrap m-0 p-0'>
                {t(`component:${props.title}`)}
              </div>
              </Popup>
    </div>
  );
}


export const UpdateStatus=(props)=>{
  const { t } = useTranslation('component', {useSuspense: false});
  const _className = 'cursor-pointer text-primary border-0 py-0 px-2 fa fw fa-edit' + (props.component.displayLogic.selected ? ' bg-info' : ' ');

  const initializeProduction=()=>{
    let production={};
    production.teamName='';
    production.shift='';
    production.updatedBy={};  //first name, family name

    return production;
  }
 

  if( typeof props.component.production === 'undefined' )
    props.component.production = new initializeProduction();

  const setTeamName=(teamName, component)=>{
    if( typeof props.production === 'undefined' )
      props.component.production = new initializeProduction();

    component.production.teamName=teamName;
    console.log("UpdateStatus - setTeamName: " + component.production.teamName);
  };

  const setShiftName=(shift, component)=>{
    if( typeof component.production === 'undefined' )
      component.production = new initializeProduction();

    component.production.shift=shift;

    console.log("UpdateStatus - setShiftName: " + component.production.shift);
  };

  //should get this information from login, doesn't need user input here
  const setUpdatedBy=(firstName, familyName, component)=>{
    if( typeof component.production === 'undefined' )
      component.production = new initializeProduction();

    component.production.updatedBy={'firstName':firstName, 'familyName':familyName};

  }

  // get unit from bom core
  const setShifProductedQty=(qty, component)=>{
    if( typeof component.production === 'undefined' )
      component.production = new initializeProduction();

    component.production.Qty=qty;
  }

  //DD/MM/YYYY HH - 0-24hr
  const setRecordDateTime=(dateTime, component)=>{
    if( typeof component.production === 'undefined' )
      component.production = new initializeProduction();

    component.production.recordDateTime=dateTime;
  }

 
  return (
    ( ( (props.permissionStatus.includes('update-progress') ||
          props.permissionStatus.includes('setup-bom')) 
      && props.component.displayLogic.selected ) ? 
      <span 
      key={`component-${props.component.displayLogic.key}`}
      id={`#component-${props.component.displayLogic.key}`} 
      className={props.statusClassName} 
      style={{'display':'inline-block','height': `auto`}} >
      {props.progress}% - {props.remainingTime} {t('remaining-time-unit')}
    
      <Popup
        trigger={
          <a key='show-progress' 
          href= {'#submit-progress'}
          className={'px-1 border-0 text-primary p-0 nav-link fa fw fa-edit'} 
          style={{'cursor': 'pointer'}}/>  
        }
      closeOnDocumentClick
      on={['click', 'focus']}
      position={'right top'}
      defaultOpen={false}  //don't show updateComponent menu unless user click the edit icon
      contentStyle={{ padding: '0px', border: 'none', backgroundColor: `${styles.cciBgColor}`}} 
      arrow={true}
      arrowStyle={{backgroundColor: `${styles.cciBgColor}`}}>
      {close => (
        <div className={'bg-info d-flex flex-column'} >
          <div className={'bg-info d-flex'}>
          <UpdateComponentStatus 
            title='team-name'
            value={props.component.production.teamName}
            component={props.component}
            handler={setTeamName}
            updateComponent={props.updateComponent}/>
          <a id={`${props.component.displayLogic.key}-updateProductStatus`} 
            href={`#${props.component.displayLogic.key}`} 
            className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer' 
            style={{backgroundColor: `${styles.cciBgColor}`}}
            onClick={close}/>
        </div>    
        <hr className='my-0 bg-info' 
              style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>
  
        <UpdateComponentStatus 
              title='shift'
              value={props.component.production.shift}
              component={props.component}
              handler={setShiftName}
              updateComponent={props.updateComponent}/>

        <hr className='my-0 bg-info' 
              style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

          <UpdateComponentStatus 
            title='updated-by-user'
            value={props.component.production.updatedBy}
            component={props.component}
            handler={setUpdatedBy}
            updateComponent={props.updateComponent}/>

        <hr className='my-0 bg-info' 
              style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

            <UpdateComponentStatus 
            title='quantity-per-shift'
              value={props.component.production.Qty}
              component={props.component}
              handler={setShifProductedQty}
              updateComponent={props.updateComponent}/>

        <hr className='my-0 bg-info' 
              style={{borderStyle:'insert', borderWidth: '0.08em', borderColor:`${styles.cciInfoBlue}`}}/>

          <UpdateComponentStatus 
              title='shift-product-record-date-time'
              value={props.component.production.recordDateTime}
              component={props.component}
              handler={setRecordDateTime}
              updateComponent={props.updateComponent}/>
          </div>
        )} 
      </Popup>
      </span>
      :
      <ShowStatus 
        component={props.component}
        statusClassName={props.statusClassName} 
        onClickHandler={ props.onClickHandler }
        progress = {props.progress}
        remainingTime = {props.remainingTime}/> 
    )
  )
}
