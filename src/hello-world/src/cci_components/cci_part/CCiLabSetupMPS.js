import { initializePDP } from './CCiLabSetupPDP';

export const initializeMPS=( component )=>{
    let mps= _initialMPS( component );
    mps.extra = _initialMPSExtra( component );
    return mps;
  }



export const initializeMPSExtra=()=>{
 
    let extra = {};
    
    extra.approvedBy= {givenName:'', familyName:''};  //first name, family name
    extra.recordDateTime=null;

    return extra ;
}

const _initialMPSExtra=( component )=>{
  let extra = JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_mps_extra`)) || initializeMPSExtra();
  return extra;
}

const _initialMPS=(component)=>{
  let mps={};

  mps.partName = component.businessLogic.name;
  mps.partNumber = component.bom.core.partNumber;
  mps.startDate = component.operation.startDate;

  let productionDemandAndDueDate;
  component.pdp = initializePDP( component );
  
  sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_pdp`, JSON.stringify( component.pdp )); 


  //https://www.danvega.dev/blog/2019/03/14/find-max-array-objects-javascript/
  productionDemandAndDueDate = component.pdp.demandAndEndDateArray.reduce( ( lastDate, item )=> {
                                                                if ( component.pdp.demandAndEndDateArray[0].completeDate !== null && 
                                                                    item.completeDate !== null )
                                                                    {
                                                                      return item.completeDate > lastDate  ? item.completeDate : lastDate ;
                                                                    }
                                                                else
                                                                {
                                                                  return component.pdp.demandAndEndDateArray[0].completeDate;
                                                                }
                                                              } )
  

  mps.productionDueDate = productionDemandAndDueDate.completeDate;
  mps.grossDemand = productionDemandAndDueDate.requiredQuantity;     

  mps.leadTime = component.irf.leadTime.value + component.irf.leadTime.timeUnit;
  mps.setupCost = component.operation.setupCost;
  mps.shiftMode = component.operation.shiftType; //need to localize from 'normal-hours' or 'shift'
  mps.planningHorizonCount = component.pdp.demandAndEndDateArray.length;
  mps.inventoryOnHand = component.irf.inventoryOnHand;
  mps.scrapRate = component.operation.scrapRate;
  
  

  mps.netDemand = mps.grossDemand !== null ? productionDemandAndDueDate.requiredQuantity - mps.inventoryOnHand : null;
  mps.lotMethod = null;
  mps.lotSize = 0;
  mps.timeBucket = 0;
  mps.workingDaysInTimebucket = 0;
  mps.timeBucketDemand = 0;
  // mps.

  return mps;
}