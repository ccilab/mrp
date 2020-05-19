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

  //https://www.danvega.dev/blog/2019/03/14/find-max-array-objects-javascript/
  mps.productionDueDate = component.pdp.demandAndEndDateArray.reduce( ( lastDate, item )=> ( 
                                                                component.pdp.demandAndEndDateArray[0].completeDate !== null && 
                                                                item.completeDate !== null && 
                                                                item.completeDate > lastDate ? item.completeDate : lastDate ),  
                                                                component.pdp.demandAndEndDateArray[0].completeDate );
     

  mps.leadTime = component.irf.leadTime.value + component.irf.leadTime.timeUnit;
  mps.setupCost = component.operation.setupCost;
  mps.shiftMode = component.operation.shiftType; //need to localize from 'normal-hours' or 'shift'
  mps.planningHorizonCount = component.pdp.demandAndEndDateArray.length;
  mps.inventoryOnHand = component.irf.inventoryOnHand;
  mps.scrapRate = component.operation.scrapRate;
  mps.grossDemand = component.pdp.demandAndEndDateArray.reduce( ( grossDemand, item )   => ( 
                                                                  component.pdp.demandAndEndDateArray[0].requiredQuantity !== null &&
                                                                  item.requiredQuantity !== null ? grossDemand +=item.requiredQuantity : grossDemand ), 
                                                                  component.pdp.demandAndEndDateArray[0].requiredQuantity );;
  mps.netDemand = mps.grossDemand !== null ? mps.grossDemand - mps.inventoryOnHand : null;
  mps.lotMethod = null;
  mps.lotSize = 0;
  mps.timeBucket = 0;
  mps.workingDaysInTimebucket = 0;
  mps.timeBucketDemand = 0;
  // mps.

  return mps;
}