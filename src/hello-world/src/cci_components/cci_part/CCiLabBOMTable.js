import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';



const BOMTable=(props)=>{
    let componentList;

    let imgName='';
    let rootElement ;
    const setRootImagePath=( components )=>{
        if( typeof components === 'undefined')
            return;

        let rootElement = components.find( (element)=> { return element.businessLogic.parentIds.length === 0 ; } )
        
        if( typeof rootElement !== 'undefined')
        {
            imgName = (rootElement.businessLogic.imgFile.length !==0 ) ? '/images/'+ rootElement.businessLogic.imgFile : '';
        }
        
    }

    if( typeof rootElement === 'undefined'  )
    {
        componentList = props.components;
        setRootImagePath(componentList);
    }
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
                <td><img className='cci-component__img align-self-center'
                         src={imgName}
                         alt={ typeof rootElement !== 'undefined' ? rootElement.businessLogic.name : 'add new part'}/>
                </td>
            </tr>

        </table>
       
    </div>
    )
}

export default BOMTable;