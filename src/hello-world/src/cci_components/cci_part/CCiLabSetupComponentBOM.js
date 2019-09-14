import React, { useState } from 'react';
import Popup from '../popup_menu/Popup'
import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"

import { dividerCCS, isValidString, isValidValue } from "./CCiLabUtility";


const SetupComponentBOM=(props)=>{
  const { t } = useTranslation(['component','commands'], {useSuspense: false});

  let inputValue = (props.value === null)? '': props.value;

  let inputClassName = 'text-primary m-0 p-0 border-0 cursor-pointer';
  let cellWidth = (typeof props.cellCnt !== 'undefined' && props.cellCnt === 1) ?  '20rem' : '10rem';
  let inputStyle={'backgroundColor': `${styles.cciBgColor}`, width: `${cellWidth}`};
  let inputType='text';
  let tooltipOnMode=['click','hover'];
  let tooltipPosition='top left';
  let inputName=props.title;
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

    //     console.log("SetupComponentBOM - updateValue: " + e.target.value);

    //     props.handler(e.target.value, props.component);
    //   }
    onUpdateValueEnterKey( props, e.target);
  }

  const onUpdateValueEnterKey=(props, target )=>{
    if( typeof props.handler !== 'undefined')
    {
      if( typeof target !== 'undefined' && target.value === '' && props.title ==='part-name')
        target.value = 'add-part';

      console.log("SetupComponentBOM - updateValue: " + target.value);

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
    console.log("SetupComponentBOM - updateChange: " + e.target.value);
  }



  // https://medium.freecodecamp.org/reactjs-pass-parameters-to-event-handlers-ca1f5c422b9
  return (
    <div className='d-flex justify-content-between'
        style={{backgroundColor: `${styles.cciBgColor}`}}>
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
    </div>
  );
}

export const CanEnableInlineMenu = ( component )=>{
  if( isValidString( component.businessLogic.name) &&
      component.bom !== null &&
      typeof component.bom !== 'undefined' &&
      typeof component.bom.core !== 'undefined' &&
      component.bom.core !== null &&
      isValidString( component.bom.core.partNumber ) &&
      ( component.businessLogic.parentIds.length === 0 ||
        isValidValue( component.bom.core.unitQty ).isValid ) )
  {
    component.displayLogic.inlineMenuEnabled = true;
  }
  else
  {
    component.displayLogic.inlineMenuEnabled = false;
  }
}

export const initializeBOM=( component )=>{
  let bom={};
  bom.core= JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_bom_core`)) || initializeBOMCore();
  bom.extra=JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_bom_extra`)) ||initializeBOMExtra();
  return bom;
}

// requiredQtyPerShift calculates based on its parent component's unitQty
// #todo - need to re-design how to handle it
const initializeBOMCore=()=>{
   let core={};
   core.partNumber=null;
   core.unitQty=null;
   core.unitOfMeasure=''; // may doesn't have unit
  //  core.requiredQty= null; //required quantity of component/part
  //  core.startDate=null;
  //  core.completeDate=null;
  //  core.scrapRate=null;    // in %, need /100 when uses it
  //  core.procurementType=null;  //'InHouse'(to produce production order), 'Purchase'(to produce purchase order)
  //  core.warehouse=null;
  //  core.leadTime=null;
  //  core.workshop=null;
  //  core.supplier=null;
  //  core.supplierPartNumber=null;
  //  core.requiredQtyPerShift=null;  // required quantity for per shift per run
  //  core.shiftCount=1;         // how many different shifts are needed
  //  core.sameShiftRunCount=1;  //same shift runs how many times
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

export const SetupBOM=(props)=>{
  const { t } = useTranslation('commands', {useSuspense: false});
  
  const _className = 'cursor-pointer text-primary border-0 p-1 fa fw fa-edit' + (props.component.displayLogic.selected ? ' bg-info' : ' ');

  const [event, setEvent] = useState('hover'); // '' is the initial state value

  // deep copy object that doesn't have function inside object
  const originComponent = JSON.parse(JSON.stringify(props.component));

   // component.displayLogic.inlineMenuEnabled needs set to true
  const saveValidBOMEntry=( component )=>{
      CanEnableInlineMenu( component );
      if( component.displayLogic.inlineMenuEnabled )
      {
        props.updateComponent(originComponent, component);
      }

      // update component name
      if( isValidString( component.businessLogic.name) && props.updateComponent(originComponent, component))
      {
          // update component name if user changes it
          if( originComponent.businessLogic.name !== component.businessLogic.name )
          {
              sessionStorage.removeItem( `${component.displayLogic.key}_${originComponent.businessLogic.name}_pdp`);
              sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_pdp`, JSON.stringify( component.pdp ));
              sessionStorage.removeItem( `${component.displayLogic.key}_${originComponent.businessLogic.name}_irf`);
              sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_irf`, JSON.stringify( component.irf ));
              sessionStorage.removeItem( `${component.displayLogic.key}_${originComponent.businessLogic.name}_bom_core`);
              sessionStorage.removeItem(`${props.component.displayLogic.key}_${originComponent.businessLogic.name}_businessLogic`);
              sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_businessLogic`, JSON.stringify( component.businessLogic ));
          }

          sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_bom_core`, JSON.stringify( component.bom.core ));
      }
  }



  if( props.component.bom === null || typeof props.component.bom === 'undefined' )
  {
    props.component.bom = new initializeBOM(props.component);
  }



  const setPartName=(partName, component)=>{
    if( isValidString( partName ))
        component.businessLogic.name=partName;
    else
      component.businessLogic.name='';  //reset to initial value to fail saveValidBOMEntry evaluation

    saveValidBOMEntry(component);
    console.log("SetupBOM - setPartName: " + component.businessLogic.name);
  };

  const setPartNumber=(partNumber, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeBOM( component );

    if( isValidString( partNumber ))
      component.bom.core.partNumber=partNumber;
    else
      component.businessLogic.name=null;  //reset to initial value to fail saveValidBOMEntry evaluation

    saveValidBOMEntry(component);

    console.log("SetupBOM - setPartNumber: " + component.bom.core.partNumber);
  };

  const setUnitQty=(unitQty, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeBOM( component );

    let {isValid, value} = isValidValue(unitQty);

    if( !isValid )
      component.bom.core.unitQty=null;
    else
      component.bom.core.unitQty=value;

    // required quantity for per shift per run
    saveValidBOMEntry(component);
  }

  const setUnitOfMeasure=(unitOfMeasure, component)=>{
    if( typeof component.bom === 'undefined' )
      component.bom = new initializeBOM( component );

    component.bom.core.unitOfMeasure=unitOfMeasure;
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
    ( props.component.displayLogic.selected ?
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
            <div className={'d-flex flex-column'} style={{backgroundColor:`${styles.cciBgColor}`}}>
            <div className={'d-flex  justify-content-between'}>
              <SetupComponentBOM
                title='part-name'
                cellCnt={1}
                value={props.component.businessLogic.name}
                component={props.component}
                handler={setPartName}/>
              <i id={`${props.component.displayLogic.key}-setupBOM`}
                className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                style={{backgroundColor: `${styles.cciBgColor}`}}
                onClick={ close }/> 
            </div>
          
            <hr  className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>
            
            <div className={'d-flex  justify-content-between'}>
              <SetupComponentBOM
                  title='part-number'
                  value={props.component.bom.core.partNumber}
                  component={props.component}
                  handler={setPartNumber}/>
              <i id={`${props.component.displayLogic.key}-setupBOM`}
                  className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                  style={{backgroundColor: `${styles.cciBgColor}`}}
                  onClick={ close }/> 
            </div>
            { props.component.businessLogic.parentIds.length === 0 ?
              null
              :
              <div>
              <hr  className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>
                <div className={'d-flex  justify-content-between'}>
                  

                  <SetupComponentBOM
                    title='unit-quantity'
                    cellCnt={1}
                    // value='' input will show placeholder text
                    value={ props.component.bom.core.unitQty}
                    component={props.component}
                    handler={setUnitQty}/>

                  <i id={`${props.component.displayLogic.key}-setupBOM`}
                    className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                    style={{backgroundColor: `${styles.cciBgColor}`}}
                    onClick={ close }/> 
                </div>
                </div>
            }

            <hr  className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>

            <div className={'d-flex  justify-content-between'}>
              <SetupComponentBOM
                  title='unit-of-measure'
                  cellCnt={1}
                  value={props.component.bom.core.unitOfMeasure }
                  component={props.component}
                  handler={setUnitOfMeasure}/>
              <i id={`${props.component.displayLogic.key}-setupBOM`}
                  className='text-danger m-0 py-1 px-1 fas fw fa-times-circle cursor-pointer'
                  style={{backgroundColor: `${styles.cciBgColor}`}}
                  onClick={ close }/> 
            </div>

            <hr  className={dividerCCS.hDividerClassName} style={dividerCCS.hDividerStyle}/>
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
