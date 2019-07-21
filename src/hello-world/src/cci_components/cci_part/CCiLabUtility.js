// http://exploringjs.com/es6/ch_modules.html#sec_importing-exporting-details

const isElementInViewportHeight = (rect) => {
    return (
        rect.top >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }

// check if an element is in viewport
// eslint-disable-next-line
const isElementInViewport = (rect) => {
  return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)  && /*or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
  );
}

// https://jsfiddle.net/Dwaaren/j9zahaLL/
export  const vwTOpx=(value)=>{
    let w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth;

    let result = (x*value)/100;
    return result;
  }

  export  const vhTOpx=(value)=>{
    let w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    let result = (y*value)/100;
    return result;
  }

// in rem or auto or vh
export  const setListHeight = (rect, fondSize) => {
    return window.innerHeight <= 200 ? 150/fondSize+'rem' : isElementInViewportHeight( rect ) ? 'auto':'90vh';
  }

// in vw
export  const setListWidth = (factor, width) =>{
    let ListWidth;

    if( typeof width !== 'undefined')
    {
        ListWidth = width;
        return (ListWidth * factor).toString() + 'px';
    }
    else
    {
        let osVersion = detectOSVersion();

        // on iphone 4S, os is 9.3.5 needs workaround to hide list
        if( osVersion.os === 'iOS' && osVersion.osMajorVersion < 10 )
        {
            ListWidth = window.innerWidth*(window.innerWidth <= 330 ? 0.8 : window.innerWidth <= 600 ? 0.6 : window.innerWidth <= 800 ? 0.50 : 0.4 );
        }
        else
        {   //set the width of component list when the list doesn't exist
            ListWidth = window.innerWidth <= 330 ? 90 : window.innerWidth <= 600 ? 70 : window.innerWidth <= 1500 ? 50:50;
        }
            
        return (ListWidth * factor).toString() + ((osVersion.os === 'iOS' && osVersion.osMajorVersion < 10)? 'px':'vw' );
    }
}


export const isValidString=( name )=>{
    return ( typeof name === 'string' &&
        name.length > 0 ) ? true : false
  };

export  const isValidValue=(valueToCheck)=>{

    let value = parseFloat(valueToCheck);
    let valid = isNaN( value ) ? false : true;

    let rt={};
    rt.isValid = valid;
    rt.value = value;
    return rt;
  };


  //http://jsfiddle.net/ChristianL/AVyND/
  //  const detectBrowserMajorVersion = () =>{
  //   let browser = navigator.appName;
  //   let majorVersion = parseInt(navigator.appVersion, 10);
  //   return {'browser': browser, 'version': majorVersion};
  // }

export  const detectOSVersion = () =>{
      var unknown = '-';

      // screen
      var screenSize = '';
      if (window.screen.width) {
          let width = (window.screen.width) ? window.window.screen.width : '';
          let height = (window.screen.height) ? window.screen.height : '';
          screenSize += '' + width + " x " + height;
      }

      // browser
      var nVer = navigator.appVersion;
      var nAgt = navigator.userAgent;
      var browser = navigator.appName;
      var version = '' + parseFloat(navigator.appVersion);
      var majorVersion = parseInt(navigator.appVersion, 10);
      var nameOffset, verOffset, ix;

      // Opera
      if ((verOffset = nAgt.indexOf('Opera')) !== -1) {
          browser = 'Opera';
          version = nAgt.substring(verOffset + 6);
          if ((verOffset = nAgt.indexOf('Version')) !== -1) {
              version = nAgt.substring(verOffset + 8);
          }
      }
      // Opera Next
      if ((verOffset = nAgt.indexOf('OPR')) !== -1) {
          browser = 'Opera';
          version = nAgt.substring(verOffset + 4);
      }
      // Edge
      else if ((verOffset = nAgt.indexOf('Edge')) !== -1) {
          browser = 'Microsoft Edge';
          version = nAgt.substring(verOffset + 5);
      }
      // MSIE
      else if ((verOffset = nAgt.indexOf('MSIE')) !== -1) {
          browser = 'Microsoft Internet Explorer';
          version = nAgt.substring(verOffset + 5);
      }
      // Chrome
      else if ((verOffset = nAgt.indexOf('Chrome')) !== -1) {
          browser = 'Chrome';
          version = nAgt.substring(verOffset + 7);
      }
      // Safari
      else if ((verOffset = nAgt.indexOf('Safari')) !== -1) {
          browser = 'Safari';
          version = nAgt.substring(verOffset + 7);
          if ((verOffset = nAgt.indexOf('Version')) !== -1) {
              version = nAgt.substring(verOffset + 8);
          }
      }
      // Firefox
      else if ((verOffset = nAgt.indexOf('Firefox')) !== -1) {
          browser = 'Firefox';
          version = nAgt.substring(verOffset + 8);
      }
      // MSIE 11+
      else if (nAgt.indexOf('Trident/') !== -1) {
          browser = 'Microsoft Internet Explorer';
          version = nAgt.substring(nAgt.indexOf('rv:') + 3);
      }
      // Other browsers
      else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
          browser = nAgt.substring(nameOffset, verOffset);
          version = nAgt.substring(verOffset + 1);
          if (browser.toLowerCase() === browser.toUpperCase()) {
              browser = navigator.appName;
          }
      }
      // trim the version string
      if ((ix = version.indexOf(';')) !== -1) version = version.substring(0, ix);
      if ((ix = version.indexOf(' ')) !== -1) version = version.substring(0, ix);
      if ((ix = version.indexOf(')')) !== -1) version = version.substring(0, ix);

      majorVersion = parseInt('' + version, 10);
      if (isNaN(majorVersion)) {
          version = '' + parseFloat(navigator.appVersion);
          majorVersion = parseInt(navigator.appVersion, 10);
      }

      // mobile version
      var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

      // cookie
      var cookieEnabled = (navigator.cookieEnabled) ? true : false;

      if (typeof navigator.cookieEnabled === 'undefined' && !cookieEnabled) {
          document.cookie = 'test-cookie';
          cookieEnabled = (document.cookie.indexOf('test-cookie') !== -1) ? true : false;
      }

      // system
      var os = unknown;
      var clientStrings = [
          {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
          {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
          {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
          {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
          {s:'Windows Vista', r:/Windows NT 6.0/},
          {s:'Windows Server 2003', r:/Windows NT 5.2/},
          {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
          {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
          {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
          {s:'Windows 98', r:/(Windows 98|Win98)/},
          {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
          {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
          {s:'Windows CE', r:/Windows CE/},
          {s:'Windows 3.11', r:/Win16/},
          {s:'Android', r:/Android/},
          {s:'Open BSD', r:/OpenBSD/},
          {s:'Sun OS', r:/SunOS/},
          {s:'Linux', r:/(Linux|X11)/},
          {s:'iOS', r:/(iPhone|iPad|iPod)/},
          {s:'Mac OS X', r:/Mac OS X/},
          {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
          {s:'QNX', r:/QNX/},
          {s:'UNIX', r:/UNIX/},
          {s:'BeOS', r:/BeOS/},
          {s:'OS/2', r:/OS\/2/},
          {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
      ];
      for (var id in clientStrings) {
          var cs = clientStrings[id];
          if (cs.r.test(nAgt)) {
              os = cs.s;
              break;
          }
      }

      var osVersion = unknown;

      if (/Windows/.test(os)) {
          osVersion = /Windows (.*)/.exec(os)[1];
          os = 'Windows';
      }

      switch (os) {
          case 'Mac OS X':
              osVersion = /Mac OS X (10[\\.\\_\\d]+)/.exec(nAgt)[1];
              break;

          case 'Android':
              osVersion = /Android ([\\.\\_\\d]+)/.exec(nAgt)[1];
              break;

          case 'iOS':
              osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
              osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
              break;
          default:
          break;
      }
      var osMajorVersion = parseInt('' + osVersion, 10);
      let jscd = {
        screen: screenSize,
        browser: browser,
        browserVersion: version,
        browserMajorVersion: majorVersion,
        mobile: mobile,
        os: os,
        osVersion: osVersion,
        osMajorVersion: osMajorVersion,
        cookies: cookieEnabled
      };
      return jscd;
  }

// getTextWidth("hello there!", "bold 12pt arial")
// return unit CSS px - 96css is 1 inch
//https://webplatform.github.io/docs/tutorials/understanding-css-units/
//https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
//need to find dpi to convert px from inch to physical pixel (dot)
//   export const getTextWidth=(text, font)=> {
//     // re-use canvas object for better performance
//     let canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
//     let context = canvas.getContext("2d");
//     context.font = font;
//     let metrics = context.measureText(text);
//     let scale = window.devicePixelRatio;
//     return metrics.width/scale;
// }

// passing string, return rect width in px
export const getTextRect=(text)=> {

    let rootNode = document.querySelector('#root');
    let newDiv = document.createElement('div')
    let newSpan = document.createElement('span');
    let newContent = document.createTextNode(text);
    newSpan.appendChild(newContent);
    newDiv.appendChild(newSpan);
    newSpan.id = 'text-width';
    rootNode.appendChild( newDiv );

    let textRect = document.getElementById('text-width').getBoundingClientRect();
    rootNode.removeChild(newDiv);
    return textRect;
}
