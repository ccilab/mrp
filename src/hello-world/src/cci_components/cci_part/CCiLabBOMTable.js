import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';

import styles from "./../../dist/css/ccilab-component-list.css"


const BOMTable=(props)=>{
    return (
        <div className='table-responsive'>
        <table className='table table-bordered'>
            <tr>
                <th>BOM Summary Table</th>
            </tr>
            <tr>
                <th>Product Name: </th>
                <td>Table</td>
                <th>Approved By:</th>
                <td>...</td>
                <th>Product Image:</th>
            </tr>

        </table>
       
    </div>
    )
}

export default BOMTable;