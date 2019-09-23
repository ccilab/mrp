import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';



const BOMTable=(props)=>{
    return (
        <div className='table-responsive-sm'>
        <table className='table table-bordered table-striped'>
            <tr>
                <th className='text-center' colSpan='5' >BOM Summary Table</th>
            </tr>

            <tr>
                <th>Product Name: </th>
                <td>Table</td>
                <th>Designed By:</th>
                <td>first-name, last-name</td>
                <th>Product Image:</th>
            </tr>

            <tr>
                <th>Customer Order Name: </th>
                <td>Phoenix Furniture Square Table, Australia</td>
                <th>Designed Date:</th>
                <td>22/Sept/2019</td>
                <td>Product Image</td>
            </tr>

        </table>
       
    </div>
    )
}

export default BOMTable;