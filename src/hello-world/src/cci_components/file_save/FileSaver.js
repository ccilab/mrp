/*
* FileSaver.js
* A saveAs() FileSaver implementation.
*
* By Eli Grey, http://eligrey.com
*
* License : https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md (MIT)
* source  : http://purl.eligrey.com/github/FileSaver.js
* modified to work only in browser environments by cciLab, zhangchar 16th/Apr/2019
*/

const bom = (blob, opts)=>{
  if (typeof opts === 'undefined') 
    opts = { autoBom: false }
  else if (typeof opts !== 'object') 
  {
    console.warn('Deprecated: Expected third argument to be a object')
    opts = { autoBom: !opts }
  }

  // prepend BOM for UTF-8 XML and text/* types (including HTML)
  // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
  if (opts.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) 
  {
    return new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type })
  }
  return blob
}

const download =(url, name, opts)=> {
  let xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.onload =  ()=> {
    saveAs(xhr.response, name, opts)
  }
  xhr.onerror = function () {
    console.error('could not download file')
  }
  xhr.send()
}

const corsEnabled = (url)=> {
  let xhr = new XMLHttpRequest()
  // use sync to avoid popup blocker
  xhr.open('HEAD', url, false)
  xhr.send()
  return xhr.status >= 200 && xhr.status <= 299
}

// `a.click()` doesn't work for all browsers (#465)
const click =(node)=> {
  try {
    node.dispatchEvent(new MouseEvent('click'))
  } catch (e) {
    let evt = document.createEvent('MouseEvents')
    evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
                          20, false, false, false, false, 0, null)
    node.dispatchEvent(evt)
  }
}

export const saveAs=(blob, name, opts)=> {
  // Use download attribute first if possible (#193 Lumia mobile)
   if( 'download' in HTMLAnchorElement.prototype )
   {
      let URL = window.URL || window.webkitURL
      let a = document.createElement('a')
      name = name || blob.name || 'download'

      a.download = name
      a.rel = 'noopener' // tabnabbing

      // TODO: detect chrome extensions & packaged apps
      // a.target = '_blank'

      if (typeof blob === 'string') {
        // Support regular links
        a.href = blob
        if (a.origin !== window.location.origin) {
          corsEnabled(a.href)
            ? download(blob, name, opts)
            : click(a, a.target = '_blank')
        } else {
          click(a)
        }
      } else {
        // Support blobs
        a.href = URL.createObjectURL(blob)
        setTimeout(function () { URL.revokeObjectURL(a.href) }, 4E4) // 40s
        setTimeout(function () { click(a) }, 0)
      }
  }
   
    

  // Use msSaveOrOpenBlob as a second approach
  if ( 'msSaveOrOpenBlob' in navigator )
  {
      name = name || blob.name || 'download';

      if (typeof blob === 'string') {
        if (corsEnabled(blob)) {
          download(blob, name, opts)
        } else {
          let a = document.createElement('a')
          a.href = blob
          a.target = '_blank'
          setTimeout(function () { click(a) })
        }
      } else {
        navigator.msSaveOrOpenBlob(bom(blob, opts), name)
      }
  }
  // Fallback to using FileReader and a popup
  else {
    // Open a popup immediately do go around popup blocker
    // Mostly only available on user interaction and the fileReader is async so...
    let popup = window.popup || window.open('', '_blank')
    if (popup) 
    {
      popup.document.title =
      popup.document.body.innerText = 'downloading...'
    }

    if (typeof blob === 'string') return download(blob, name, opts)

    let force = blob.type === 'application/octet-stream'
    let isSafari = /constructor/i.test(window.HTMLElement) || window.safari
    let isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent)

    if ((isChromeIOS || (force && isSafari)) && typeof FileReader === 'object') {
      // Safari doesn't allow downloading of blob URLs
      let reader = new FileReader()
      reader.onloadend = function () {
        let url = reader.result
        url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, 'data:attachment/file;')
        if (popup) 
          window.popup.location.href = url
        else 
          window.location = url
        popup = null // reverse-tabnabbing #460
      }
      reader.readAsDataURL(blob)
    } else {
      let URL = window.URL || window.webkitURL
      let url = URL.createObjectURL(blob)
      if (popup) 
        popup.location = url
      else 
        window.location.href = url
      popup = null // reverse-tabnabbing #460
      setTimeout(function () { URL.revokeObjectURL(url) }, 4E4) // 40s
    }
  }
}


/* example: write to json  file
https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser/30800715#30800715
let data = {
  key: 'value'
};
let fileName = 'myData.json';

// Create a blob of the data
// If you wanted to pretty print the JSON
// use JSON.stringify(data,undefined,2)
let fileToSave = new Blob([JSON.stringify(data)], {
  type: 'application/json',
  name: fileName
});

// Save the file
saveAs(fileToSave, fileName);*/

export const saveAs =( blob, fileName)=>{
  //  create a new Blob (html5 magic) that conatins the data from your form feild
  let jsonFileAsBlob = new Blob([blob], { type: 'application/json' });
  
  // create a link for our script to 'click'
  let downloadLink = document.createElement("a");

  downloadLink.download = fileName;
  
  // provide text for the link. This will be hidden so you
  // can actually use anything you want.
  downloadLink.innerHTML = "My Hidden Link";
  // make sure the link is hidden.
  downloadLink.style.display = "none";

  // allow our code to work in webkit & Gecko based browsers
  // without the need for a if / else block.
  window.URL = window.URL || window.webkitURL;

  // Create the link Object.
  downloadLink.href = window.URL.createObjectURL(jsonFileAsBlob);

  // when link is clicked call a function to remove it from
  // the DOM in case user wants to save a second file.
  downloadLink.onclick = destroyClickedElement;

  // add the link to the DOM
  document.body.appendChild(downloadLink);

  // click the new link
  downloadLink.click();
}


const destroyClickedElement = (e)=> {
  e.preventDefault();
  // remove the link from the DOM
  document.body.removeChild(e.target);
}



// example:
// let strjson = {
//   'SPversion': SPversion,
//   'Email': txEmail,
//   'IconFile': txIconFile,
//   'PatchType': patchType
// };
// strjson.MsiGroupList = GetGroupMsiData();
// let jsonse = JSON.stringify(strjson);

// //  create a new Blob (html5 magic) that conatins the data from your form feild
// //let textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
// let textFileAsBlob = new Blob([jsonse], { type: 'application/json' });
// let d = new Date()
//   let hour = d.getHours();
//   let date = d.getDate();
//   let month = d.getMonth() + 1;
//   // Specify the name of the file to be saved
//   let fileNameToSaveAs = "myconfigFile-"+month.toString()+date.toString()+hour.toString()+".json";


export const loadFile =( fileName )=>{
  let input, file, fr;

  if (typeof window.FileReader !== 'function') {
      alert("The file API isn't supported on this browser yet.");
      return;
  }

 
  file = input.files[0];
  fr = new FileReader();
  fr.onload = receivedText;
  fr.readAsText(fileName);
  

  const receivedText =(e)=>{
      lines = e.target.result;
      let newArr = JSON.parse(lines);

      let number = Object.keys(newArr.MsiGroupList).length;
      console.log("number is: " + number);
      
      for (i=0;i<number;i++) {
          console.log(newArr.MsiGroupList['MsiGroup' + i]);
          let newMsiGroup = newArr.MsiGroupList['MsiGroup' + i];
          console.log("baseImageDir" + i + ": " + newMsiGroup.baseImageDir);
          console.log("upgradeImageDir" + i + ": " + newMsiGroup.upgradeImageDir);
          console.log("changedFileLsit" + i + ": " + newMsiGroup.changedFileList);

          if (document.getElementById('groupMSIform' + i) == null) {
              console.log("groupMSIform" + i + "doesn't exist, start to create");
              let tmpfieldWrapper = $("<div class=\"groupMSI\" method=\"get\" id=\"groupMSIform" + i + "\"/>");
              let tmpfLegend = $("<fieldset><legend>one Group of base build msi and upgrade build msi</legend>Base Image path: <input type=\"text\" class=\"cBaseImage\" id=\"txBaseImageDir" + i + "\"/> Upgrade Image path: <input type=\"text\" class=\"cUpgradeImage\" id=\"txUpgradeImageDir" + i + "\"/>" + " Changed File List: <textarea class=\"cChangedFile\" " + "id=\"txaChangeFile" + i + "\" ></textarea>");
              let tmpremoveButton = $("<input type=\"button\" class=\"remove\" value=\"remove\" /></fieldset>");
              tmpremoveButton.click(function () {
                  $(this).parent().remove();
              });
              tmpfieldWrapper.append(tmpfLegend);
              tmpfieldWrapper.append(tmpremoveButton);
              $("#groupMSIform0").append(tmpfieldWrapper);
          }

          document.getElementById('txBaseImageDir' + i).value = newMsiGroup.baseImageDir;
          document.getElementById('txUpgradeImageDir' + i).value = newMsiGroup.upgradeImageDir;
          document.getElementById('txaChangeFile' + i).value = newMsiGroup.changedFileList;
      }
     
      document.getElementById("SPVersion").value = newArr.SPversion;
      document.getElementById("txEmail").value = newArr.Email;
      document.getElementById("txInstallIconFile").value = newArr.IconFile;
    
  }
}
