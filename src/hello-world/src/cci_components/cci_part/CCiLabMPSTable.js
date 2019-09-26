import React from 'react';

import { useTranslation } from 'react-i18next';



const MPSTable=(props)=>{
    const { t } = useTranslation('component', {useSuspense: false});
    return (
        <div className='table-responsive'>
            <table className='table table-bordered'>
                <tr>
                    <th>Master Production Schedule Table</th>
                </tr>

            </table>
           
        </div>
    )
}

export default MPSTable;