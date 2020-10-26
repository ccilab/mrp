import { initializePDP } from './CCiLabSetupPDP';

export const initializeMPS=( component, components )=>{
    let mps= _initialMPS( component );
    mps.extra = initialMPSExtra( component );
    return mps;
  }



const _initializeMPSExtra=()=>{
 
    let extra = {};
    
    extra.approvedBy= {givenName:'', familyName:''};  //first name, family name
    extra.recordDateTime=null;

    return extra ;
}

const initialMPSExtra=( component )=>{
  let extra = JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_mps_extra`)) || _initializeMPSExtra();
  return extra;
}

const _initialMPS=(component, components)=>{
  let mps={};

  mps.partName = component.businessLogic.name;
  mps.partNumber = component.bom.core.partNumber;
  mps.startDate = component.operation.startDate;

  let productionDemandAndDate;
  component.pdp = initializePDP( component, components );
  
  sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_pdp`, JSON.stringify( component.pdp )); 


  //https://www.danvega.dev/blog/2019/03/14/find-max-array-objects-javascript/
  if( typeof component.pdp.demandAndDateArray !== 'undefined')
  {
    productionDemandAndDate = component.pdp.demandAndDateArray.reduce( ( lastDate, item )=> {
                                        if ( component.pdp.demandAndDateArray[0].date !== null && 
                                            item.date !== null )
                                            {
                                              return item.date > lastDate  ? item.date : lastDate ;
                                            }
                                        else
                                        {
                                          return component.pdp.demandAndDateArray[0].date;
                                        }
                                      } )
  

    mps.productionStartDate = productionDemandAndDate.date;
    mps.grossDemand = productionDemandAndDate.requiredQuantity;     
    mps.planningHorizonCount = component.pdp.demandAndDateArray.length;
    mps.netDemand = mps.grossDemand !== null ? productionDemandAndDate.requiredQuantity - mps.inventoryOnHand : null;
  }

  mps.leadTime = component.operation.leadTime.value + component.operation.leadTime.timeUnit;
  mps.setupCost = component.operation.setupCost;
  mps.shiftMode = component.operation.shiftType; //need to localize from 'normal-hours' or 'shift'
  
  mps.inventoryOnHand = component.irf.inventoryOnHand;
  mps.scrapRate = component.operation.scrapRate;
  
  

  
  mps.lotMethod = null;
  mps.lotSize = 0;
  mps.timeBucket = 0;
  mps.workingDaysInTimebucket = 0;
  mps.timeBucketDemand = 0;
  // mps.

  return mps;
}