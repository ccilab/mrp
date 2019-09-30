import React from 'react';

import { useTranslation } from 'react-i18next';



const BOMTableHeader=(props)=>{
    const { t } = useTranslation('component', {useSuspense: false});
  
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
        
            <tbody>
                <tr>
                    <th className='align-middle'>{t('component:th-product-name')}: </th>
                    <td className='align-middle'> {(typeof rootElement !== 'undefined') ? rootElement.businessLogic.name : `${t('component:part-name')}`}</td>
                    <th className='align-middle'>{t('component:th-designed-by')}:</th>
                    <td className='align-middle'>first-name, last-name</td>
                    <th className='align-middle text-center'>{t('component:th-product-image')}:</th>
                </tr>
           
                <tr>
                    <th className='align-middle'>{t('component:customer-name')}: </th>
                    <td className='align-middle'>Phoenix Furniture Square Table, Australia</td>
                    <th className='align-middle'>{t('component:th-designed-date')}:</th>
                    <td className='align-middle'> 22/Sept/2019</td>
                    {/* http://www.htmlhelp.com/feature/art3.htm */}
                    <td className='align-middle'> <img className='cci-component__img align-self-center'
                            style={{'height': '10rem', 'width': '10rem'}}
                            src={imgName}
                            alt={ typeof rootElement !== 'undefined' ? rootElement.businessLogic.name : `${t('component:th-no-image-name')}`}/>
                    </td>
                </tr>
            </tbody>
    )
}


const BOMTable=(props)=>{
    const { t } = useTranslation('component', {useSuspense: false});
    return (
        <div  className='table-responsive-sm' >
            <table className='table table-bordered table-striped'>
                <tr>
                    <th className='text-center' colSpan='5' >{t('component:th-table-title')}</th>
                </tr>

                { <BOMTableHeader components = {props.components}/>}

            </table>
       
       </div>

    )
}
export default BOMTable;