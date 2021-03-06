/** 
 *  @fileoverview TextResizeDetector
 * 
 *  Detects changes to font sizes when user changes browser settings
 *  <br>Fires a custom event with the following data:<br><br>
 * 	iBase  : base font size  	
 *	iDelta : difference in pixels from previous setting<br>
 *  	iSize  : size in pixel of text<br>
 *  
 *  * @author Lawrence Carvalho carvalho@uk.yahoo-inc.com
 * 
 * https://alistapart.com/article/fontresizing
 * @version 1.0
 */

/**
 * @constructor
 */

/* example of how to use it
	<script type="text/javascript" src="textresizedetector.js"></script>
	<script type="text/javascript">
		function init()  {
		   var iBase = TextResizeDetector.addEventListener(onFontResize,null);
			alert("The base font size = " + iBase);
		}
		function onFontResize(e,args) {
			var msg = "\nThe base font size in pixels: " + args[0].iBase;
			msg +="\nThe current font size in pixels: " + args[0].iSize;
			msg += "\nThe change in pixels from the last size:" + args[0].iDelta;
			alert(msg);
		}
		//id of element to check for and insert control
		TextResizeDetector.TARGET_ELEMENT_ID = 'header';
		//function to call once TextResizeDetector has init'd
		TextResizeDetector.USER_INIT_FUNC = init;
	</script> */
// https://flaviocopes.com/javascript-iife/ this is a IIFE ( Immediately-invoked Function Expression ) 
export const TextResizeDetector = ( ()=> { 
    var el  = null;
	var iIntervalDelay  = 200;
	var iInterval = null;
	var iCurrSize = -1;
	var iBase = -1;
	// var iSize = -1;
 	var aListeners = [];
 	const createControlElement = ()=> {
	 	el = document.createElement('span');
		el.id='textResizeControl';
		el.innerHTML='&nbsp;';
		el.style.position="absolute";
		el.style.left="-9999px";
		var elC = document.getElementById(TextResizeDetector.TARGET_ELEMENT_ID);
		// insert before firstChild
		if (elC)
			elC.insertBefore(el,elC.firstChild);
		iBase = iCurrSize = TextResizeDetector.getSize();
 	};

 	const _stopDetector=()=>{
		window.clearInterval(iInterval);
		iInterval=null;
	};
	const _startDetector=()=> {
		if (!iInterval) {
			iInterval = window.setInterval( TextResizeDetector.detect,iIntervalDelay);
		}
	};
 	
 	 const _detect=()=>{
 		var iNewSize = TextResizeDetector.getSize();
		
 		if( iNewSize!== iCurrSize )  {
			aListeners.forEach( (item) => {
				let aListnr = item;
				var oArgs = {  iBase: iBase, iDelta:( (iCurrSize !== -1) ? iNewSize - iCurrSize + 'px' : "0px"), iSize: iCurrSize = iNewSize };
				if (!aListnr.obj) {
					aListnr.fn('textSizeChanged',[oArgs]);
				}
				else  {
					aListnr.fn.apply(aListnr.obj,['textSizeChanged',[oArgs]]);
				}
			});
 		}
 		return iCurrSize;
 	};
	const onAvailable = () =>{
		
		if (!TextResizeDetector.onAvailableCount_i ) {
			TextResizeDetector.onAvailableCount_i =0;
		}

		if (document.getElementById(TextResizeDetector.TARGET_ELEMENT_ID)) {
			TextResizeDetector.init();
			if (TextResizeDetector.USER_INIT_FUNC){
				TextResizeDetector.USER_INIT_FUNC();
			}
			TextResizeDetector.onAvailableCount_i = null;
		}
		else {
			if (TextResizeDetector.onAvailableCount_i<600) {
	  	 	    TextResizeDetector.onAvailableCount_i++;
				setTimeout(onAvailable,200)
			}
		}
	};
	setTimeout(onAvailable,500);

 	return {
		 	/*
		 	 * Initializes the detector
		 	 * 
		 	 * @param {String} sId The id of the element in which to create the control element
		 	 */
		 	init: ()=>{
		 		
		 		createControlElement();		
				_startDetector();
 			},
			/**
			 * Adds listeners to the ontextsizechange event. 
			 * Returns the base font size
			 * 
			 */
 			addEventListener:  (fn,obj,bScope)=> {
				aListeners[aListeners.length] = {
					fn: fn,
					obj: obj
				}
				return iBase;
			},
			/**
			 * performs the detection and fires textSizeChanged event
			 * @return the current font size
			 * @type {integer}
			 */
 			detect: ()=> {
 				return _detect();
 			},
 			/**
 			 * Returns the height of the control element
 			 * 
			 * @return the current height of control element
			 * @type {integer}
 			 */
 			getSize: () =>{
	 				
			 		return el.offsetHeight;
		 		
		 		
 			},
 			/**
 			 * Stops the detector
 			 */
 			stopDetector:()=> {
				return _stopDetector();
			},
			/*
			 * Starts the detector
			 */
 			startDetector:()=> {
				return _startDetector();
			}
 	}
 })();

TextResizeDetector.TARGET_ELEMENT_ID = 'doc';
TextResizeDetector.USER_INIT_FUNC = null;

