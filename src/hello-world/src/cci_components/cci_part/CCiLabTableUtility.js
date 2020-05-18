
export const setSelectedImagePath=( component )=>{
    let lImgName='';
    if( typeof component !== 'undefined' && component !== null )
    {
        lImgName = (component.businessLogic.imgFile.length !==0 ) ? '/images/'+ component.businessLogic.imgFile : '';
    }
  
    return lImgName;
}
