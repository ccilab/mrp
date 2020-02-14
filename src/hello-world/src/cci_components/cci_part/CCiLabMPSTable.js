import React, { useState } from 'react';
import styles from "./../../dist/css/ccilab-component-list.css"


import { useTranslation } from 'react-i18next';
import {getRandomInt, tables, isValidString  } from "./CCiLabUtility";

import {UserNameInput} from "./CCiLabUserNameInput"
import {DateInput} from "./CCiLabDateInput"


const MPSTableHeader=(props)=>{
    const { t } = useTranslation('component', {useSuspense: false});
  
    let componentList;

    let imgName='';
    let rootElement ;
    let customerOrderName='';

    let customerOrderNumber='';

    let approvedBy={givenName:'', familyName:''}; //first name, last name
    const [approvedName, setApprovedName] = useState( approvedBy );

    const initializeMPSExtra=()=>{
        let extra={};
        extra.approvedBy=approvedBy;  //first name, family name
        extra.recordDateTime=null;
    
        return extra;
    }

    const setUpdatedBy=(value, component, item)=>{
        let extra = JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_mps_extra`)) || initializeMPSExtra();
        switch( item )
        { case 'given-user-name':
           extra.approvedBy.givenName=value;
            break;
        case 'family-user-name':
            extra.approvedBy.familyName=value;
            break;
        default:
            return;
        }

        setApprovedName(extra.approvedBy);
        sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_mps_extra`, JSON.stringify( extra ));
    }
    return (
        <tbody>
            <tr>
                <th className='align-middle'>{t('component:th-part-name')}:</th>
                <td className='align-middle' colSpan='2'> {(typeof rootElement !== 'undefined' && rootElement.businessLogic.name !== 'part-name') ? rootElement.businessLogic.name : `${t('component:part-name')}`}</td>
                    <th className='align-middle'>{t('component:th-designed-by')}:</th>
                    <td className='align-middle' colSpan='2'>
                        <UserNameInput 
                        title='updated-by-user'
                        mrpInputType='component'
                        value={approvedBy}
                        component={rootElement}
                        handler={setUpdatedBy}
                        updateComponent={props.updateComponent}/>
                    </td>
                    <th className='align-middle text-center' colSpan='2'>{t('component:th-product-image')}</th>
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
    const { t } = useTranslation('component', {useSuspense: false});
    return (
        <div  id={tables.bom} className='d-flex flex-row table-responsive-sm' style={{visibility: `${props.showHideTableFlag}`}}>
        <table className='table table-bordered table-striped table-hover text-nowrap'>
            <tbody>
            <tr style={{backgroundColor: `${styles.cciBgColor}`}}>
                <th className='text-center' colSpan='8' >{t('component:th-table-title')}</th>
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