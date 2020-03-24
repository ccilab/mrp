import React, { useState } from 'react';
import styles from "./../../dist/css/ccilab-component-list.css"


import { useTranslation } from 'react-i18next';
import {getRandomInt, tables, isValidString  } from "./CCiLabUtility";

import {UserNameInput} from "./CCiLabUserNameInput"
import {DateInput} from "./CCiLabDateInput"


const MPSTableHeader=(props)=>{
    const { t } = useTranslation(['component','mps', 'operations'], {useSuspense: false});
  
    let componentList;

    let imgName='';
    let rootElement = props.components.find( (element)=> { return element.businessLogic.parentIds.length === 0 ; } );
    let partNumber='';
    let leadTime='';
    let setupCost='';
    let shiftMode='';
    let productStartDate='';
    let productDueDate='';
    let lotMethod='';
    let lotSize='';

    const headerClass = 'headerClass text-capitalize';

    let approvedBy={givenName:'', familyName:''}; //first name, last name
    const [approvedName, setApprovedName] = useState( approvedBy );

    const initializeMPSExtra=()=>{
        let mps = {};
        
        mps.header.approvedBy=approvedBy;  //first name, family name
        mps.header.recordDateTime=null;
    
        return mps;
    }

    const setUpdatedBy=(value, component, item)=>{
        let mps = JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_mps`)) || initializeMPSExtra();
        switch( item )
        { case 'given-user-name':
            mps.header.approvedBy.givenName=value;
            break;
        case 'family-user-name':
            mps.header.approvedBy.familyName=value;
            break;
        default:
            return;
        }

        setApprovedName(mps.header.approvedBy);
        sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_mps`, JSON.stringify( mps ));
    }
    return (
        <tbody>
            <tr>
                <th className={`${headerClass}`}>{t('component:th-part-name')}:</th>
                <td className={`${headerClass}`} colSpan='2'> {(typeof rootElement !== 'undefined' && rootElement.businessLogic.name !== 'part-name') ? rootElement.businessLogic.name : `${t('component:part-name')}`}</td>
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
                    <td className={`${headerClass}`} rowSpan='5' colSpan='2'> <img className='cci-component__img align-self-center'
                            style={{'height': '10rem', 'width': '10rem'}}
                            src={imgName}
                            alt={ typeof rootElement !== 'undefined' ? rootElement.businessLogic.name : `${t('component:th-no-image-name')}`}/>
                    </td> 
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
                <th className={`${headerClass}`}>{t('mps:th-production-start-date')}: </th>
                <td className={`${headerClass}`} colSpan='2'> {productStartDate}</td>
                <th className={`${headerClass}`}>{t('mps:th-production-due-date')}:</th>
                <td className={`${headerClass}`} colSpan='2'> {productDueDate} </td>
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
const MPSHeaderRow=()=>{
    const { t } = useTranslation(['component','mps'], {useSuspense: false});
    return (
        <tbody>
        <tr style={{backgroundColor: `${styles.cciBgColor}`}}>
            <th colSpan='2' className={`d-flex flex-row text-center`}>
                {t('component:th-part-name')}
            </th>
            <th className='text-center'>{t('component:th-bom-level')}</th>
            <th className='text-center'>{t('component:th-component-count')}</th>
            <th className='text-center'>{t('component:part-number')}</th>
            <th className='text-center'>{t('component:unit-quantity')}</th>
            <th className='text-center'>{t('component:unit-of-measure')}</th> 
            <th className='text-center'>{t('component:description')}</th>
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

            { <MPSTableHeader components = {props.components} />}
            
            {<MPSHeaderRow/>}

            <tbody>
                {<ComponentMPSRow components = {props.components} setComponent={props.setComponent}/>}
            </tbody>
                            
           
        </table>
   </div>
    )
}

export default MPSTable;