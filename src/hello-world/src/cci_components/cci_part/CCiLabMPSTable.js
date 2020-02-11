import React, { useState } from 'react';
import styles from "./../../dist/css/ccilab-component-list.css"


import { useTranslation } from 'react-i18next';
import {getRandomInt, tables } from "./CCiLabUtility";

import {UserNameInput} from "./CCiLabUserNameInput"
import {DateInput} from "./CCiLabDateInput"


const MPSTableHeader=(props)=>{
    const { t } = useTranslation('component', {useSuspense: false});
  
    let componentList;

    let imgName='';
    let rootElement ;
    let customerOrderName='';

    let customerOrderNumber='';

    let mpsApprovedBy={givenName:'', familyName:''}; //first name, last name
    const [approvedName, setApprovedName] = useState( mpsApprovedBy );

    const initializeMPSExtra=()=>{
        let extra={};
        extra.approvedBy=mpsApprovedBy;  //first name, family name
        extra.recordDateTime=null;
    
        return extra;
    }

    const setUpdatedBy=(value, component, item)=>{
        let extra = JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_bom_extra`)) || initializeMPSExtra();
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
        sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_bom_extra`, JSON.stringify( extra ));
    }
    return (
        <tbody>
            <tr>
    <th className='align-middle'>{}:</th>
            </tr>
        </tbody>
    )

}

// key={props.tableKey}
const MPSTable=(props)=>{
    const { t } = useTranslation('component', {useSuspense: false});
    return (
        <div  className='table-responsive-sm'>
            <table className='table table-bordered'>
                <tbody>
                    <tr>
                        <th>Master Production Schedule Table</th>
                    </tr>
                </tbody>
                
            </table>
           
        </div>
    )
}

export default MPSTable;