export const initializeOp=( component )=>{
    let operation= JSON.parse(sessionStorage.getItem(`${component.displayLogic.key}_${component.businessLogic.name}_op`)) || _initializeOp();
    return operation;
  }


export const saveValidOpEntry=( component )=>{
    // component.operation.shiftInfoArray = shiftInfoArray;
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
    operation.DayShift = _initializeDayShift();
    operation.shiftInfoArray=[[null,null]];         // how many different shifts are needed
    return operation;
 }
 
 const _initializeDayShift=()=>{
    let DayShift={};
    DayShift.name={shiftType:null, teamName: null};
    DayShift.employeeCount=null;  //number of employees to produce the demand of a component
    DayShift.averageTimePerComponentPerEmployee=null; //in hour, time needed to produce one component per employee
    DayShift.timeCost={hoursPerEmployee: null, averageHourlyCost: null } ;  //in hour, for normal or shift
    DayShift.overtimeCost = {overtimeHoursPerEmployee: null, averageHourlyOvertimeCost: null };  //in hour, if not in shift
    DayShift.allowedEmployeeCnt={min: null, max: null };
    return DayShift;
 }