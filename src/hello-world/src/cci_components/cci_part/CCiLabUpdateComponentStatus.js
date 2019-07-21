import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"


const UpdateComponentStatus=(props)=>{
  const { t, i18n } = useTranslation(['component','commands'], {useSuspense: false});
  let inputValue = props.value;
  let inputClassName = 'text-primary m-0 p-0 cursor-pointer border-0';
  let inputPlaceholder=t(`component:${props.title}`);
  let inputStyle={'backgroundColor': `${styles.cciBgColor}`};
  let inputType='text';
  let isRequired=false;
  let tooltipOnMode= ['click','hover'];
  let tooltipPosition='top left';
  let tooltip=t(`component:${props.title}`)

  let inputName=props.title;

  let inputCheckbox= props.title.includes('-completed') ? true:false;

  let createUserInput = (props.title === 'updated-by-user') ? true:false;

  let quantityInputElement = React.createRef();
  let shiftQuantityInput=false;
  let requiredQty;

  let name1Name='given-user-name';
  let name1InputId='#' + name1Name;
  let name1Value=inputValue.givenName;
  let name1Placeholder=t(`component:${name1Name}`);

  let name2Name='family-user-name';
  let name2InputId='#' + name2Name;
  let name2Value=inputValue.familyName;
  let name2Placeholder=t(`component:${name2Name}`);

  if( i18n.language.includes('zh'))
  {
     name1Name='family-user-name';
     name1InputId='#' + name1Name;
     name1Value=inputValue.givenName;
     name1Placeholder=t(`component:${name1Name}`);

     name2Name='given-user-name';
     name2InputId='#' + name2Name;
     name2Value=inputValue.familyName;
     name2Placeholder=t(`component:${name2Name}`);
  }

  if( props.title.includes('team-name') )
  {
    tooltipPosition='bottom left';
    isRequired = true;
  }

  // https://www.w3schools.com/bootstrap4/bootstrap_forms_input_group.asp
  // type="datetime-local" is not supported in Firefox, Safari
  if( inputCheckbox )
  {
    inputType='checkbox';
    inputStyle={'backgroundColor': `${styles.cciBgColor}`, 'height':'1em','width':'1em'};
  }

  const attachUnitAndWarning=( producedValue, props )=>{
    let value=parseFloat( producedValue );
    if( isNaN(value) || value === 0 )
      value='';
    else
    {   //https://stackoverflow.com/questions/52891158/how-do-i-convert-string-to-number-according-to-locale-javascript
        // example of how to use toLocaleString(i18n.language)
      let valueWithUnit = value + ( typeof props.component.bom.core !== 'undefined' ?  ' '+ props.component.bom.core.unitOfMeasure : '');
      let diff= value - parseFloat( requiredQty ); //actual - required
      if( diff < 0 &&
          typeof props.component.bom.core !== 'undefined' &&
          props.component.bom.core.procurementType.includes('InHouse') )
      {
        let warningMissBy = t('component:less-produced-by-shift') + (-1*diff) + ( typeof props.component.bom.core !== 'undefined' ?  ' '+ props.component.bom.core.unitOfMeasure : '');
        tooltip = warningMissBy;
        inputPlaceholder = valueWithUnit + '(' + t('component:warning-missed') + ')';
        value='';
      }
      else
      {
        if( diff > 0 &&
            typeof props.component.bom.core !== 'undefined' &&
            props.component.bom.core.procurementType.includes('Purchase') )
        {
          let warningMissBy = t('component:excess-consumed-by-shift') + diff + ( typeof props.component.bom.core !== 'undefined' ?  ' '+ props.component.bom.core.unitOfMeasure : '');
          tooltip = warningMissBy;
          inputPlaceholder = valueWithUnit + '(' + t('component:warning-exceed') + ')';
          value = '';
        }
        else
            value = valueWithUnit;
      }
    }
    return value;
  };

  if( props.title.includes('actual-quantity-per-shift') )
  { //shift produced is greater or equal required value, use it as real value
    shiftQuantityInput = true;
    requiredQty=inputValue[0];
    inputPlaceholder=t('component:required-quantity-per-shift') + inputValue[0];  //required quantity
    if( typeof props.component.bom.core!== 'undefined' && props.component.bom.core.unitOfMeasure!=='')
      inputPlaceholder += ' ' + props.component.bom.core.unitOfMeasure;

    inputValue= inputValue[1] > 0 ? attachUnitAndWarning(inputValue[1], props) : ''; //actual produced value
    isRequired = true;

    tooltipOnMode= ['hover'];
  };


  const [input, setInput] = useState(`${inputValue}`); // '${inputValue}' is the initial state value

  // https://blog.bitsrc.io/understanding-currying-in-javascript-ceb2188c339
  // #todo: if total produced quantity * scrape-rate reaches the total required quantity
  // set props.component.production.completed to true, otherwise should set it back to false
  // if user sets it to true
  const updateValue=(props)=>(e)=>{
      if( typeof props.handler !== 'undefined')
      {
        if( e.target.value.includes('production-completed')){
          console.log("UpdateComponentStatus - updateValue: checked " + e.target.checked);
          props.handler(e.target.checked, props.component);
        }
        else {
          if( e.target.name.includes('-user-name') )
          {
            console.log("UpdateComponentStatus - updateValue: " + e.target.name + ': ' + e.target.value);
            props.handler(e.target.value, props.component, e.target.name );
          }
          else {
            console.log("UpdateComponentStatus - updateValue: " + e.target.value);
            props.handler(e.target.value, props.component);
          }

        }

        updateComponent(props);
      }
  };


  const updateComponent=(props)=>{
    if( typeof props.updateComponent !== 'undefined')
    {
      console.log("UpdateComponentStatus - updateComponent: " + props.component.businessLogic.name);
      props.updateComponent(props.component);
    }
  }



  const sanitizeNumberInput=( e, props )=>{
    let value=attachUnitAndWarning(e.target.value, props);
    setInput(value);
  };

  const enterKeyHandler=( e, props )=>{
    if( e.key ==='Enter')
    {
      let value=attachUnitAndWarning(quantityInputElement.current.value, props);
      setInput(value);
    }
  };


  // https://medium.freecodecamp.org/reactjs-pass-parameters-to-event-handlers-ca1f5c422b9
  return (
    <div className='d-flex justify-content-between cursor-pointer'
         style={{backgroundColor: `${styles.cciBgColor}`}}>
        { (createUserInput) ?
          <Popup
            trigger={
              <div className='d-flex flex-column m-0 py-1 border-0'>
                  <input className={`${inputClassName}`}
                         id={name1InputId}
                         type={`${inputType}`}
                         name={name1Name}
                         style={inputStyle}
                         value={name1Value}
                         placeholder={name1Placeholder}
                         onChange={updateValue(props)}
                         onClose={updateValue(props)}
                         onInput={ (e) =>{ setInput(e.target.value) }}/>

                  <input  className={`${inputClassName}`}
                          id={name2InputId}
                          type={`${inputType}`}
                          name={name2Name}
                          style={inputStyle}
                          value={name2Value}
                          placeholder={name2Placeholder}
                          onChange={updateValue(props)}
                          onClose={updateValue(props)}
                          onInput={ (e) =>{ setInput(e.target.value) }}/>
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
              contentStyle={{  padding: '0' }}>
              <div className='font-weight-normal text-nowrap m-0 p-1'>
                {t(`component:${props.title}`)}
              </div>
          </Popup>
          :
          <Popup
                trigger={
                    <div className='d-inline-flex m-0 py-1 border-0'>
                      <input className={`${inputClassName}`}
                          ref={ shiftQuantityInput? quantityInputElement : null }
                          id={inputName}
                          type={`${inputType}`}
                          required={isRequired}
                          style={inputStyle}
                          placeholder={`${inputPlaceholder}`}
                          name={inputName}
                          value={  inputCheckbox ? `${props.title}`: input}
                          defaultChecked = { !inputCheckbox ? null : props.component.production.completed }
                          min = { inputType.includes('number') ? 0 : null}
                          onChange={updateValue(props)}
                          onClose={updateValue(props)}
                          onInput={ !inputCheckbox ? (e) =>{ setInput(e.target.value) } : null }
                          onKeyPress={ shiftQuantityInput? (e)=>enterKeyHandler(e, props) : null }
                          onBlur={ shiftQuantityInput? (e)=>sanitizeNumberInput(e, props) : null }/>
                      {/* https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox;
                          you can toggle a checkbox by clicking on its associated <label> element as well as on the checkbox itself */}
                      {  inputCheckbox ?
                          <label className={`m-0 px-1 border-0 cursor-pointer font-weight-normal`}
                            htmlFor={props.title}
                            style={{backgroundColor: `${styles.cciBgColor}`, color: props.component.production.completed? `${styles.cciInfoBlue}` : `${styles.cciHintRed}`}}>
                            { props.component.production.completed ? t(`component:production-completed-description`) :  t(`component:check-if-production-completed-description`) }
                            </label>
                            :
                            null
                      }
                  </div>
                }
                id={`${props.component.displayLogic.key}-tooltip`}
                defaultOpen={ shiftQuantityInput? true : false}
                position={tooltipPosition}
                closeOnDocumentClick
                on={tooltipOnMode}
                arrow={true}
                arrowStyle={{backgroundColor: 'white'}}
                mouseLeaveDelay={0}
                mouseEnterDelay={0}
                contentStyle={{  padding: '0px' }}>
                <div className='font-weight-normal text-nowrap m-0 p-1'>
                  {`${tooltip}`}
                </div>
          </Popup>
        }
    </div>
  );
}


export const UpdateStatus=(props)=>{
  const { t } = useTranslation('component', {useSuspense: false});

  let quantityValue;
  let producedValue=0;

  if( typeof props.component.production !== 'undefined' &&
      props.component.production.shiftQty > 0 )
  {
    producedValue = props.component.production.shiftQty;

    if( props.component.businessLogic.parentIds.length === 0 )
    {
      quantityValue = props.component.bom.core.requiredQty !== null ? props.component.bom.core.requiredQty : 'undefined';
    }
    else
    {
       quantityValue = props.component.bom.core.requiredQtyPerShift !== null ? props.component.bom.core.requiredQtyPerShift : 'undefined';
    }
  }
  else{
    if (typeof props.component.bom !== 'undefined' )
    {
      // root component
      if( props.component.businessLogic.parentIds.length === 0 )
          quantityValue = props.component.bom.core.requiredQty !== null ? props.component.bom.core.requiredQty : 'undefined';
      else
      {
         if( parseInt(props.component.bom.core.requiredQtyPerShift, 10 ) )
            quantityValue = props.component.bom.core.requiredQtyPerShift !== null ?  props.component.bom.core.requiredQtyPerShift : 'undefined';
      }
    }
  };

  const initializeProduction=()=>{
    let production={};
    production.teamName='';
    production.shift='';
    production.updatedBy={};  //first name, family name
    production.recordDateTime=null;
    production.completed=false;
    production.shiftQty=0;
    production.totalProducedQty=0;

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
  const setUpdatedBy=(value, component, item)=>{
    if( typeof component.production === 'undefined' )
      component.production = new initializeProduction();
      switch( item )
      { case 'given-user-name':
          component.production.updatedBy.givenName=value;
          break;
        case 'family-user-name':
          component.production.updatedBy.familyName=value;
          break;
        default:
          return;
      }
  }

  // set the produced quantity for the shift
  // also create the record date and time
  const setShiftProducedQty=(qty, component)=>{
    if( typeof component.production === 'undefined' )
      component.production = new initializeProduction();

    let value = parseFloat( qty);
    if( isNaN( value ) )
      value = 0;

    component.production.shiftQty=value;
    component.production.totalProducedQty += value;
    component.production.recordDateTime=new Date();
    console.log( 'setShiftProducedQty - record time: ' + component.production.recordDateTime );
  }

  // show this item for project type of item only not for production
  const setProductionCompleted=(isCompleted, component)=>{
    if( typeof component.production === 'undefined' )
      component.production = new initializeProduction();

    component.production.completed=isCompleted;
    console.log( 'setProductionCompleted - checked: ' + component.production.completed );
    component.production.recordDateTime=new Date();
    console.log( 'setProductionCompleted - record time: ' + component.production.recordDateTime );
  }

  return (
      <span
        key={`component-${props.component.displayLogic.key}`}
        id={`#component-${props.component.displayLogic.key}`}
        className={props.statusClassName}
        style={{'display':'inline-block','height': `auto`}}
        onClick={ props.onClickHandler }>
        {props.progress}% - {props.remainingTime} {t(`remaining-time-unit`)}

        { ( (props.permissionStatus.includes('update-progress') ||
            props.permissionStatus.includes('setup-bom')) &&
          props.component.displayLogic.selected ) ?
          <Popup
            trigger={
              <a key='show-progress'
              href= {'#submit-progress'}
              className={'px-1 border-0 text-primary p-0 nav-link fa fw fa-edit'}
              style={{'cursor': 'pointer'}}> </a>
            }
          closeOnDocumentClick={ true }
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
                    onClick={ close }> </a>
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

              { typeof quantityValue !== 'undefined' ?
                <UpdateComponentStatus
                    title='actual-quantity-per-shift'
                    value={[quantityValue, producedValue]}
                    component={props.component}
                    handler={setShiftProducedQty}
                    updateComponent={props.updateComponent}/>
                  :
                <UpdateComponentStatus
                    title='production-completed'
                    value={props.component.production.completed}
                    component={props.component}
                    handler={setProductionCompleted}
                    updateComponent={props.updateComponent}/>
              }
            </div>
          )}
          </Popup>
          :
          null
        }
      </span>
    )
}
