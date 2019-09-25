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
                <th className='align-middle'>Product Name: </th>
                <td className='align-middle'>Table</td>
                <th className='align-middle'>Designed By:</th>
                <td className='align-middle'>first-name, last-name</td>
                <th className='align-middle text-center'>Product Image:</th>
            </tr>

            <tr>
                <th className='align-middle'>Customer Order Name: </th>
                <td className='align-middle'>Phoenix Furniture Square Table, Australia</td>
                <th className='align-middle'>Designed Date:</th>
                <td className='align-middle'> 22/Sept/2019</td>
                <td className='align-middle'> <img className='cci-component__img align-self-center'
                         style={{'height': '10rem', 'width': '10rem'}}
                         src={imgName}
                         alt={ typeof rootElement !== 'undefined' ? rootElement.businessLogic.name : 'add new part'}/>
                </td>
            </tr>

        </table>
       
    </div>
    )
}

export default BOMTable;