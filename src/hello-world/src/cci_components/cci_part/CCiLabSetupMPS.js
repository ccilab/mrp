export const initializeMPS=( component )=>{
    let mps= _initialMPS( component );
    mps.extra = _initialMPSExtra( component );
    return mps;
  }



export const initializeMPSExtra=()=>{
    let extra = {};
    let header = {};
    
    header.approvedBy= {givenName:'', familyName:''};  //first name, family name
    header.recordDateTime=null;

    return extra.header = header;
}

const _initialMPSExtra=( component )=>{
  let extra = JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_mps_extra`)) || initializeMPSExtra();
  return extra;
}

const _initialMPS=(component)=>{
  let mps={};

  mps.partName = component.businessLogic.name;
  mps.partNumber = component.bom.core.partNumber;
  mps.startDate = null;
  mps.productionDueDate = null;
  mps.leadTime = null;
  mps.setupCost = null;
  mps.shiftMode = null;
  mps.planningHorizonCount = 1;
  mps.inventoryOnHand = 0;
  mps.scrapRate = 0;
  mps.grossDemand = 0;
  mps.netDemand = 0;
  mps.lotMethod = null;
  mps.lotSize = 0;
  mps.timeBucket = 0;
  mps.workingDaysInTimebucket = 0;
  mps.timeBucketDemand = 0;
  // mps.

  return mps;
}