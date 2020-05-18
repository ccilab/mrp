import React, { useState } from 'react';
import styles from "./../../dist/css/ccilab-component-list.css"


import { useTranslation } from 'react-i18next';
import {getRandomInt, tables, isValidString, GenericError  } from "./CCiLabUtility";

import {UserNameInput} from './CCiLabUserNameInput'
import {DateInput} from './CCiLabDateInput'
import {initializeMPSExtra} from './CCiLabSetupMPS'
import {setSelectedImagePath} from './CCiLabTableUtility'


const MPSTableHeader=(props)=>{
    const { t } = useTranslation(['component','mps', 'operations','inventoryRecords'], {useSuspense: false});

    if( typeof props.components === 'undefined' || props.components === null )
    {
        return null;
    }
        

   

    let rootElement = props.components.find( (element)=> { return element.businessLogic.parentIds.length === 0 ; } );

    let selectedElement = props.components.find( (element)=> { return element.displayLogic.selected !== 0 ; } );

    selectedElement = typeof selectedElement === 'undefined' ? rootElement : selectedElement;

    let componentList;
    let imgName='';
    let partNumber='';
    let leadTime='';
    let setupCost='';
    let shiftMode='';
    let productStartDate='';
    let productDueDate='';
    let lotMethod='';
    let lotSize='';
    let inventoryOnHand='';
    let scrapRate='';
    let grossRequirements='';
    let netRequirements='';

    const headerClass = 'headerClass text-capitalize';

    let approvedBy={givenName:'', familyName:''}; //first name, last name

    const [approvedName, setApprovedName] = useState( approvedBy );

    let approvedDate= new Date();
    
    const setUpdatedBy=(value, component, item)=>{
        let extra = JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_mps_extra`)) || initializeMPSExtra();
        switch( item )
        { case 'given-user-name':
            extra.header.approvedBy.givenName=value;
            break;
        case 'family-user-name':
            extra.header.approvedBy.familyName=value;
            break;
        default:
            return;
        }

        setApprovedName(extra.header.approvedBy);
        sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_mps_extra`, JSON.stringify( extra ));
    }

    const getMPSApprovedAuthor=( component )=>{
        let lName={};
        
        if( typeof component !== 'undefined')
        {
            let extra = JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_mps_extra`)) || initializeMPSExtra();
            if( typeof extra !== 'undefined')
            {
                lName = (typeof extra.approvedBy !== 'undefined' && extra.approvedBy !==null ) ? extra.approvedBy : approvedName;
            }
        }
      
        return lName;
    }

    const getMPSApprovedDate=(component)=>{
        let date = new Date() ;
        if( typeof component !== 'undefined')
        {
            let extra = JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_mps_extra`)) || initializeMPSExtra();
            if( typeof extra !== 'undefined')
            {
                date = (typeof extra.approvedDate !== 'undefined' && extra.approvedDate !==null ) ? extra.approvedDate : date ;
            }
        }
      
        return date;

    }

    if( typeof selectedElement !== 'undefined'  )
    {
        componentList = props.components;
        imgName = setSelectedImagePath(selectedElement);
        // customerOrderName = getCustomerName(componentList);
        // customerOrderNumber= getOrderNumber(componentList);
        approvedBy = getMPSApprovedAuthor(selectedElement);
        approvedDate = getMPSApprovedDate(selectedElement);
    }
    else
    {
        console.log("MPSTable - MPSTableHeader - part name: " + selectedElement.businessLogic.name);
    }

    return (
        <tbody>
            <tr>
                <th className={`${headerClass}`}>{t('component:th-part-name')}:</th>
                <td className={`${headerClass}`} colSpan='2'> {( selectedElement.businessLogic.name !== 'part-name') ? selectedElement.businessLogic.name : `${t('component:part-name')}`}</td>
                <th className={`${headerClass}`}>{t('component:th-designed-by')}:</th>
                <td className={`${headerClass}`} colSpan='2'>
                   
                </td>
                <th className='headerClass text-center' colSpan='2'>{t('component:th-product-image')}</th>
            </tr>
            
            <tr>
                <th className={`${headerClass}`}>{t('component:part-number')}: </th>
                <td className={`${headerClass}`} colSpan='2'> {partNumber}</td>
                <th className={`${headerClass}`}>{t('component:th-designed-date')}:</th>
                <td className={`${headerClass}`} colSpan='2'> 
                       
                        
                    </td>
                    {/* http://www.htmlhelp.com/feature/art3.htm */}
                    <td className={`${headerClass}`} rowSpan='8' colSpan='2'> <img className='cci-component__img align-self-center'
                            style={{'height': '10rem', 'width': '10rem'}}
                            src={imgName}
                            alt={ typeof selectedElement !== 'undefined' ? selectedElement.businessLogic.name : `${t('component:th-no-image-name')}`}/>
                    </td> 
            </tr>
            <tr>
                <th className={`${headerClass}`}>{t('mps:th-production-start-date')}: </th>
                <td className={`${headerClass}`} colSpan='2'> {productStartDate}</td>
                <th className={`${headerClass}`}>{t('mps:th-production-due-date')}:</th>
                <td className={`${headerClass}`} colSpan='2'> {productDueDate} </td>
            </tr>

            <tr>
                <th className={`${headerClass}`}>{t('mps:th-lead-time')}: </th>
                <td className={`${headerClass}`} colSpan='2'> {leadTime}</td>
                <th className={`${headerClass}`}>{t('operations:setup-cost-quantity')}:</th>
                <td className={`${headerClass}`} colSpan='2'> {setupCost} </td>
            </tr>

            <tr>
                <th className={`${headerClass}`}>{t('mps:th-shift-mode')}: </th>
                <td className={`${headerClass}`} colSpan='2'> {shiftMode}</td>
                <th className={`${headerClass}`}>{t('mps:th-planning-horizon')}:</th>
                <td className={`${headerClass}`} colSpan='2'/> 
            </tr>


            <tr>
                <th className={`${headerClass}`}>{t('inventoryRecords:inventory-on-hand-quantity')}</th>
                <td className={`${headerClass}`} colSpan='2'> {inventoryOnHand}</td>
                <th className={`${headerClass}`}>{t('operations:scrap-rate')}</th>
                <td className={`${headerClass}`} colSpan='2'> {scrapRate} </td>
            </tr>

            <tr>
                <th className={`${headerClass}`}>{t('component:required-quantity')}</th>
                <td className={`${headerClass}`} colSpan='2'> {grossRequirements}</td>
                <th className={`${headerClass}`}>{t('component:net-required-quantity')}</th>
                <td className={`${headerClass}`} colSpan='2'> {netRequirements}</td>
            </tr>

            <tr>
                <th className={`${headerClass}`}>{t('mps:th-lot-method')}: </th>
                <td className={`${headerClass}`} colSpan='2'> {lotMethod}</td>
                <th className={`${headerClass}`}>{t('mps:th-lot-size')}:</th>
                <td className={`${headerClass}`} colSpan='2'> {lotSize} </td>
            </tr>

            <tr>
                <th className={`${headerClass}`}>{t('mps:th-time-buckets')}: </th>
                <td className={`${headerClass}`} colSpan='2'> {lotMethod}</td>
                <th className={`${headerClass}`}>{t('mps:th-working-days-in-time-bucket')}:</th>
                <td className={`${headerClass}`} colSpan='2'> {lotSize} </td>
            </tr>
        </tbody>
    )

}



//may don't need bom level, consider to show image
// replace _Weekly with time bucket
const MPSHeaderRow=(components)=>{
    const { t } = useTranslation(['component','mps','inventoryRecords'], {useSuspense: false});
    return (
        <tbody>
        <tr style={{backgroundColor: `${styles.cciBgColor}`}}>
            <th className='text-center'>{t('mps:th-production-period')} </th>
            {/* <th className='text-center'>{t('mps:th-time-bucket-requirements', JSON.parse('{"TimeBucket":"_Weekly"}'))}</th>  */}
            <th className='text-center'>{t('component:required-quantity')}</th>
            <th className='text-center'>{t('mps:th-on-hand-at-end-of-time-bucket', JSON.parse('{"TimeBucket":"_Week"}'))}</th>
           
            <th className='text-center'>{t('inventoryRecords:scheduled-receipts-quantity')}</th>
               
            {/* <th className='text-center'>{t('mps:th-time-bucket-requirements', JSON.parse('{"TimeBucket":"_Weekly"}'))}</th>  */}
            {/* <th className='text-center'>{t('inventoryRecords:scheduled-receipts-date')}</th>
            <th className='text-center'>{t('inventoryRecords:scheduled-receipts-quantity')}</th>
            <th className='text-center'>{t('mps:th-production-due-date')} </th> */}
            <th className='text-center'>{t('component:note')}</th>
        </tr>
        </tbody>
    )
}

const ComponentMPSRow=()=>{
    return null;
}

// key={props.tableKey}
const MPSTable=(props)=>{
    const { t } = useTranslation(['component','mps'], {useSuspense: false});
    return (
        <div  id={tables.bom} className='d-flex flex-row table-responsive-sm' style={{visibility: `${props.showHideTableFlag}`}}>
        <table className='table table-bordered table-striped table-hover text-nowrap'>
            <tbody>
            <tr style={{backgroundColor: `${styles.cciBgColor}`}}>
                <th className='text-center h2' colSpan='8' >{t('mps:th-table-title')}</th>
            </tr>
            </tbody>

            { <MPSTableHeader components = {props.components} setComponent={props.setComponent}/>}
            
            {<MPSHeaderRow components = {props.components} />}

            <tbody>
                {<ComponentMPSRow components = {props.components} setComponent={props.setComponent}/>}
            </tbody>
                            
           
        </table>
   </div>
    )
}

export default MPSTable;