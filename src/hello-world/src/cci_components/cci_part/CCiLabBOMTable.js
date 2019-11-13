import React, { useState } from 'react';
import styles from "./../../dist/css/ccilab-component-list.css"


import { useTranslation } from 'react-i18next';
import {getRandomInt, tables } from "./CCiLabUtility";

import {UpdateComponentStatus} from "./CCiLabUpdateComponentStatus"



const BOMTableHeader=(props)=>{
    const { t } = useTranslation('component', {useSuspense: false});
  
    let componentList;

    let imgName='';
    let rootElement ;
    let customerOrderName='';

    let customerOrderNumber='';

    let bomApprovedBy={givenName:'', familyName:''}; //first name, last name
    const [approvedName, setApprovedName] = useState( bomApprovedBy )

    const initializeBomExtra=()=>{
        let extra={};
        extra.approvedBy=bomApprovedBy;  //first name, family name
        extra.recordDateTime=null;
    
        return extra;
    }

    const setUpdatedBy=(value, component, item)=>{
        let extra = JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_bom_extra`)) || initializeBomExtra();
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

    const setRootImagePath=( components )=>{
        let lImgName='';
        if( typeof components !== 'undefined' && components !== null )
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
        if( typeof components !== 'undefined' && components !== null )
        {
            rootElement = components.find( (element)=> { return element.businessLogic.parentIds.length === 0 ; } )
        
            if( typeof rootElement !== 'undefined')
            {
                if( typeof rootElement.pdp !== 'undefined')
                {
                    lName = (rootElement.pdp.customer !==null ) ? rootElement.pdp.customer : '';
                    console.log("BOMTable - getCustomerName - customer name: " + lName);
                }
            }
        }
   
        return lName;
    }

    const getOrderNumber=( components )=>{
        let lOrderNumber='';
        if( typeof components !== 'undefined' && components !== null)
        {
            rootElement = components.find( (element)=> { return element.businessLogic.parentIds.length === 0 ; } )
        
            if( typeof rootElement !== 'undefined')
            {
                if( typeof rootElement.pdp !== 'undefined')
                {
                    lOrderNumber = (rootElement.pdp.orderNumber !==null ) ? rootElement.pdp.orderNumber : '';
                }
            }
        }
      
        return lOrderNumber;

    }

    const getBOMApprovedAuthor=( components )=>{
        let lName={};
        if( typeof components !== 'undefined' && components !== null)
        {
            rootElement = components.find( (element)=> { return element.businessLogic.parentIds.length === 0 ; } )
        
            if( typeof rootElement !== 'undefined')
            {
                let extra = JSON.parse(sessionStorage.getItem(`${rootElement.displayLogic.key}_${rootElement.businessLogic.name}_bom_extra`)) || initializeBomExtra();
                if( typeof extra !== 'undefined')
                {
                    lName = (typeof extra.approvedBy !== 'undefined' && extra.approvedBy !==null ) ? extra.approvedBy : approvedName;
                }
            }
        }
      
        return lName;
    }

    if( typeof rootElement === 'undefined'  )
    {
        componentList = props.components;
        imgName = setRootImagePath(componentList);
        customerOrderName = getCustomerName(componentList);
        customerOrderNumber= getOrderNumber(componentList);
        bomApprovedBy = getBOMApprovedAuthor(componentList);
    }
    else
    {
        console.log("BOMTable - BOMTableHeader - part name: " + rootElement.businessLogic.name);
    }

    //  {(typeof rootElement !== 'undefined') ? rootElement.businessLogic.name : `${t('component:part-name')}`}
    return (
        
            <tbody >
                <tr >
                    <th className='align-middle' >{t('component:th-product-name')}: </th>
                    <td className='align-middle' colSpan='2'> {(typeof rootElement !== 'undefined' && rootElement.businessLogic.name !== 'add-part') ? rootElement.businessLogic.name : `${t('component:part-name')}`}</td>
                    <th className='align-middle'>{t('component:th-designed-by')}:</th>
                    <td className='align-middle' colSpan='2'>
                        <UpdateComponentStatus 
                        title='updated-by-user'
                        value={bomApprovedBy}
                        component={rootElement}
                        handler={setUpdatedBy}
                        updateComponent={props.updateComponent}/>
                    </td>
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
                    <td className='align-middle' colSpan='2'> {(typeof componentList !== 'undefined' && componentList !== null) ? componentList.length : 0 }</td>
                </tr>
            </tbody>
    )
}

//consider to use displayLogic to intend child items
//may don't need bom level, consider to show image
const BOMHeaderRow=()=>{
    const { t } = useTranslation('component', {useSuspense: false});
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

// https://dev.to/abdulbasit313/an-easy-way-to-create-a-customize-dynamic-table-in-react-js-3igg
// students: [
//     { id: 1, name: 'Wasif', age: 21, email: 'wasif@email.com' },
//     { id: 2, name: 'Ali', age: 19, email: 'ali@email.com' },
//     { id: 3, name: 'Saad', age: 16, email: 'saad@email.com' },
//     { id: 4, name: 'Asad', age: 25, email: 'asad@email.com' }
//  ]
const ComponentRow=(props)=>{
    const { t } = useTranslation('component', {useSuspense: false});
    let count = 0;
    let bomLevel = 1;

    const findBomLevel=(components, child)=>{
        components.some( (component)=>{
            if( component.businessLogic.id === child.businessLogic.parentIds[0] ) 
            {
                bomLevel++;

                if( component.businessLogic.parentIds.length === 0 )
                {
                    return true;
                }
                else
                {
                    let nextChild = component;

                    return findBomLevel( components, nextChild );
                }
            }
            else{
                return false;
            }
         } );
    }

    const saveBomExtra=(component)=>{
        sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_bom_core`, JSON.stringify( component.bom.core ));

    }

    const onBlurHandler=(component, option )=>(e)=>{
        if( typeof e.target.value !== 'undefined' && e.target.value !== '')
        {
            switch( option )
            {
                case 'description':
                {
                    component.bom.core.description=e.target.value;
                    break;
                }
                case 'note':
                {
                    component.bom.core.note = e.target.value;
                    break;
                }
                default:
                {
                    break;
                }
                    
            }
            if( option === 'description' || option === 'note')
            {
                saveBomExtra(component);
            }
        }
    }

    const enterKeyHandler=(component, option )=>(e)=>{
        if( typeof e.key !== 'undefined' && e.key ==='Enter')
        {
            switch( option )
            {
                case 'description':
                {
                    component.bom.core.description=e.target.value;
                    break;
                }
                case 'note':
                {
                    component.bom.core.note=e.target.value;
                    break;
                }
                default:
                {
                    break;
                }
                    
            }
            if( option === 'description' || option === 'note')
            {
                saveBomExtra(component);
            }
        }
    }

    // const mouseOverHandler=(component)=>(e)=>{
    //     props.setComponent(component);
    //     console.log("ComponentRow: mouse over component: " + component.businessLogic.name );
    // } 

    return ( typeof props.components !== 'undefined' && props.components !== null ) ? props.components.map( (component) => {
        const key= getRandomInt(1000);
        const { name, parentIds } = component.businessLogic;
        const { partNumber, unitQty, unitOfMeasure, description, note } = (typeof component.bom !== 'undefined' && component.bom.core !== null) ? component.bom.core : {partNumber:'', unitQty:'', unitOfMeasure:'', description:'', note:''}; //destructuring

        //based on component_design_guide.txt, any component only has a single parent, 
        // root component doesn't have a parent
        // const bomLevel = parentIds.length === 0 ? 1 : parentIds[0]+1; 
        const lImgName = (component.businessLogic.imgFile.length !==0 ) ? '/images/'+ component.businessLogic.imgFile : '';
        const unitQtyTd = parentIds.length === 0 ? '1' : unitQty === null ? '0' : unitQty;
        if( parentIds.length > 0 )
        {
            bomLevel = 1;   //reset bomLevel for each component
            findBomLevel( props.components, component );
        }
         
        let highLight='';
        if( typeof props.setComponent !== 'undefined' && 
            props.setComponent !== null && component.businessLogic.id === props.setComponent.businessLogic.id )
        {
            highLight='table-info'; 
        }

        // https://stackoverflow.com/questions/46119384/bootstrap-4-add-more-sizes-spacing
        // .\mrp\src\hello-world\src\stylesheets\vendors\bootstrap-4.0.0-alpha.6\scss\_variables.scss
        // more spaces is added
        const namePadding=  'pl-'+bomLevel.toString(); 

        const inputClassName = 'form-control text-primary m-0 p-1 border-1 cursor-pointer ';
        // const inputStyle={'backgroundColor': `${styles.cciBgColor}`};
        // onMouseOver={mouseOverHandler( component )} 
        return (
            <tr key={key} className={`${highLight}`}>
                <td className={`${namePadding}`}> 
                    <img className='cci-component__img align-self-center'
                            style={{'height': '2em', 'width': '2em'}}
                            alt={' '}   //has to be empty string for alt prop
                            src={lImgName}/>-{name}
                </td>
                <td className='text-center'>{bomLevel}</td>
                <td className='text-center'>{++count}</td>
                <td>{partNumber}</td>
                <td className='text-center'>{unitQtyTd}</td>
                <td>{unitOfMeasure}</td>
                <td className='m-0 p-0'>
                    <textarea  className={`${inputClassName}`}
                                rows='3'
                                // style={inputStyle}
                                placeholder={t('component:description')+'...'}
                                onKeyPress={ enterKeyHandler(component, 'description') }
                                onBlur={onBlurHandler(component, 'description')}>
                    {description}
                    </textarea>
                </td>
                <td className='m-0 p-0'>
                    <textarea  className={`${inputClassName}`}
                                rows='3'
                              // style={inputStyle}
                             placeholder={t('component:note')+'...'}
                             onKeyPress={ enterKeyHandler(component, 'note') }
                             onBlur={onBlurHandler(component, 'note')}>
                    {note}
                    </textarea>
                </td>
            </tr>
        )
     })
     :
     null;
}

// props.showHideTableFlag

const BOMTable=(props)=>{
    const { t } = useTranslation('component', {useSuspense: false});

    return (
        <div  id={tables.bom} className='d-flex flex-row table-responsive-sm' style={{visibility: `${props.showHideTableFlag}`}}>
            <table className='table table-bordered table-striped table-hover text-nowrap'>
                <tbody>
                <tr style={{backgroundColor: `${styles.cciBgColor}`}}>
                    <th className='text-center' colSpan='8' >{t('component:th-table-title')}</th>
                </tr>
                </tbody>

                { <BOMTableHeader components = {props.components} />}
                
                {<BOMHeaderRow/>}

                <tbody>
                    {<ComponentRow components = {props.components} setComponent={props.setComponent}/>}
                </tbody>
                                
               
            </table>
       </div>
      

    )
}
export default BOMTable;