/*  
    Make resizable div by Hung Nguyen
    https://codepen.io/ZeroX-DG/pen/vjdoYe
*/
export const makeResizableDiv = (listID) =>{
      const element = document.getElementById(listID);
     
      
      if(( typeof element === 'undefined') || ( element === null ) )
        return;
 
      const minimum_size = 20;
      let original_width = 0;
      let original_mouse_x = 0;
      
    // const currentResizer = resizers[i];
      element.addEventListener('mousedown', (e)=> {
        e.preventDefault()
        getComputedStyle(element, null).getPropertyValue('cursor').replace('default', 'col-resize')
        original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('vw', ''));
        // original_x = element.getBoundingClientRect().left;
        original_mouse_x = e.pageX;
        window.addEventListener('mousemove', resize)
        window.addEventListener('mouseup', stopResize)
      })
      
      const resize = (e)=> {
        const width = original_width + (e.pageX - original_mouse_x);
        if (width > minimum_size) {
          element.style.width = width + 'vw'
        }
      }
      
      const stopResize=()=> {
        window.removeEventListener('mousemove', resize)
        getComputedStyle(element, null).getPropertyValue('cursor').replace('col-resize', 'default')
      }
  }