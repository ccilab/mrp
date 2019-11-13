import React from 'react';

import { useTranslation } from 'react-i18next';


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