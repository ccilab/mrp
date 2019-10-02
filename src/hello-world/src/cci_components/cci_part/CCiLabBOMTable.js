import React from 'react';
import styles from "./../../dist/css/ccilab-component-list.css"

import { useTranslation } from 'react-i18next';



const BOMTableHeader=(props)=>{
    const { t } = useTranslation('component', {useSuspense: false});
  
    let componentList;

    let imgName='';
    let rootElement ;
    let customerOrderName='';

    let customerOrderNumber='';


    const setRootImagePath=( components )=>{
        let lImgName='';
        if( typeof components !== 'undefined' )
        {
            let rootElement = components.find( (element)=> { return element.businessLogic.parentIds.length === 0 ; } )
        
            if( typeof rootElement !== 'undefined')
            {
                lImgName = (rootElement.businessLogic.imgFile.length !==0 ) ? '/images/'+ rootElement.businessLogic.imgFile : '';
            }
        }
      
        return lImgName;
    }

    const getCustomerName=( components )=>{
        let lName='';
        if( typeof components !== 'undefined' )
        {
            let rootElement = components.find( (element)=> { return element.businessLogic.parentIds.length === 0 ; } )
        
            if( typeof rootElement !== 'undefined')
            {
                lName = (rootElement.pdp.customer !==null ) ? rootElement.pdp.customer : '';
                console.log("BOMTable - BOMTableHeader - part name: " + rootElement.businessLogic.name);
            }
        }
      
      
   
        return lName;

    }

    const getOrderNumber=( components )=>{
        let lOrderNumber='';
        if( typeof components !== 'undefined' )
        {
            let rootElement = components.find( (element)=> { return element.businessLogic.parentIds.length === 0 ; } )
        
            if( typeof rootElement !== 'undefined')
            {
                lOrderNumber = (rootElement.pdp.orderNumber !==null ) ? rootElement.pdp.orderNumber : '';
            }
        }
      
        return lOrderNumber;

    }

    if( typeof rootElement === 'undefined'  )
    {
        componentList = props.components;
        imgName = setRootImagePath(componentList);
        customerOrderName = getCustomerName(componentList);
        customerOrderNumber= getOrderNumber(componentList);
    }
    else
    {
        console.log("BOMTable - BOMTableHeader - part name: " + rootElement.businessLogic.name);
    }
    return (
        
            <tbody >
                <tr >
                    <th className='align-middle'>{t('component:th-product-name')}: </th>
                    <td className='align-middle' colSpan='2'> {(typeof rootElement !== 'undefined') ? rootElement.businessLogic.name : `${t('component:part-name')}`}</td>
                    <th className='align-middle'>{t('component:th-designed-by')}:</th>
                    <td className='align-middle' colSpan='2'>first-name, last-name</td>
                    <th className='align-middle text-center' colSpan='2'>{t('component:th-product-image')}</th>
                </tr>
           
                <tr>
                    <th className='align-middle'>{t('component:customer-name')}: </th>
                    <td className='align-middle' colSpan='2'>{customerOrderName}</td>
                    <th className='align-middle'>{t('component:th-designed-date')}:</th>
                    <td className='align-middle' colSpan='2'> 22/Sept/2019</td>
                    {/* http://www.htmlhelp.com/feature/art3.htm */}
                    <td className='align-middle' rowSpan='2' colSpan='2'> <img className='cci-component__img align-self-center'
                            style={{'height': '10rem', 'width': '10rem'}}
                            src={imgName}
                            alt={ typeof rootElement !== 'undefined' ? rootElement.businessLogic.name : `${t('component:th-no-image-name')}`}/>
                    </td>
                </tr>
                <tr>
                    <th className='align-middle'>{t('component:customer-order-number')}: </th>
                    <td className='align-middle' colSpan='2'> {customerOrderNumber}</td>
                    <th className='align-middle'>{t('component:th-component-count')}:</th>
                     <td className='align-middle' colSpan='2'> {componentList.length}</td>
                </tr>
            </tbody>
    )
}

const BOMHeaderRow=()=>{
    const { t } = useTranslation('component', {useSuspense: false});
    return (
        <tbody>
        <tr style={{backgroundColor: `${styles.cciBgColor}`}}>
            <th>BOM Level</th>
            <th>BOM Count</th>
            <th>Component Name</th>
            <th>Component Id</th>
            <th>{t('component:unit-quantity')}</th>
            <th>{t('component:unit-of-measure')}</th> 
            <th>{t('component:description')}</th>
            <th>{t('component:note')}</th>
        </tr>
        </tbody>
    )
}

const ComponentRow=(props)=>{

}

// const printPage=()=>{
//     window.print();
// }

const BOMTable=(props)=>{
    const { t } = useTranslation('component', {useSuspense: false});
    return (
        <div  className='d-flex flex-row table-responsive-sm' >
            <table className='table table-bordered '>
                <tbody>
                <tr style={{backgroundColor: `${styles.cciBgColor}`}}>
                    <th className='text-center' colSpan='8' >{t('component:th-table-title')}</th>
                </tr>
                </tbody>

                { <BOMTableHeader components = {props.components}/>}
                
                {<BOMHeaderRow/>}
               
            </table>
       </div>
      

    )
}
export default BOMTable;