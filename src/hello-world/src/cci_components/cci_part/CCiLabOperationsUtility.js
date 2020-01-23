export const initializeOp=( component )=>{
    let operation= JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_op`)) || _initializeOp();
    return operation;
  }


export const saveValidOpEntry=( component, shiftArray )=>{
    if( typeof shiftArray !== 'undefined')
    {
      component.operation.shiftInfoArray = shiftArray;
    }
   
    sessionStorage.setItem( `${component.displayLogic.key}_${component.businessLogic.name}_op`, JSON.stringify( component.operation ));
}

// requiredQtyPerShift calculates based on its parent component's unitQty
// #todo - need to re-design how to handle it
const _initializeOp=()=>{

    let operation={};
    operation.averageHiringCostPerEmployee = null;
    operation.averageDismissalCostPerEmployee = null; //local currency
    operation.startDate=null;
    operation.scrapRate=null;    // in %, need /100 when uses it 
    operation.setupCost=null;    // initial cost to produce the component
    operation.inputWarehouse='';    // where is prerequisite component/raw material stored
    operation.outputWarehouse='';    // where is component stored
    operation.workshop='';           //
    operation.shiftType=null;
    operation.DayShift = _initializeDayShift();
    operation.shiftInfoArray=[{shift:null}];         // how many different shifts are needed
    return operation;
 }
 
 const _initializeDayShift=()=>{
    let shift=_initializeShift();
    let DayShift = shift;
    DayShift.name.shiftType='daily-shift';  
    DayShift.overtimeCost = {overtimeHoursPerEmployee: null, averageHourlyOvertimeCost: null };  //in hour, if not in shift
    return DayShift;
 }

 const _initializeShift=()=>{
     let shift={};
     shift.name={shiftType:null, teamName: null}
     shift.employeeCount=null;  //number of employees to produce the demand of a component
     shift.averageTimePerComponentPerEmployee=null; //in hour, time needed to produce one component per employee
     shift.timeCost={hoursPerEmployee: null, averageHourlyCost: null } ;  //in hour, for normal or shift
     shift.allowedEmployeeCnt={min: null, max: null };
     return shift;
 }