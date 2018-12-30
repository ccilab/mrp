# awsome mrp 
front end React.js
back end Go

1. annual leasing - ¥1000.00 
2.	local server periodically connect to cci-lab server for update and lease renew, failed to renew database is kept the sever software is removed 
3.	user feedback/wish list to be implemented during leasing period 
4.	user login to their own server for security reason only 
5.	basic component - name/image 
6.	basic component two functions 1-input (create new or update existing )  ~database, ~UI, 2-output status  
7.	how to accommodate two functions - input / output in two separate page - home (output) and Add/Create (input); or combined into one page - using + and edit icon to separate input and output function ( prefer) 
8.	UI input: create new one name, Add or update a photo or other information  
9.	store update time and login user for any create/update 
10.	SPA - home - output page 📈: current running project by filter / search by time or name 
11.	click on a project - expends to show first next level components as the children; hide other siblings at the parent level; repeats until drilling down to bottom level (sub-component =0);  click on the bottom level component it brings the detail tab (next to input page); click back button it brings user to output page at same state as bringing to detail page (📋) 
12.	create/update buttons are common so they need to adapt for each level 
13.	📝 bring to next tab ( what is it on the phone?) fill or update fields ( * fields are required), click save button will return to display page 
14.	input page 📝: - quantity, delivery date ( in warehouse ready to ship). maybe have multiple delivery dates; component image; team; assemble line; material/required sub-components - drilled to next level; sub-component/material supplier/team; 
15.	the bottom level component only has material and no sub-component  
16.	the first item is new project icon (📝), undefined sub-components are shown as 📝 icon too. select 📝 icon will bring user to next tab (input tab), select an existing component then clicks 📝 button at top or click 📝 page tab also brings user to input tab 
17.	sub-components count is defined in parent component's input page 
18.	only the bottom level component have a detailed page that is next to input page (📝); detailed information is here (to be defined).  
19.	layout:  
         top buttons: 📈 📝 📋
         SPA three tabs: using same above    icons for three tabs
20.	output page 📈: search field at top right side, filter field at top left side; first project is always the empty one 📝 icon ready for user to create from input page 📝; the existing ones follow it in the order sets by field; for existing one it's real image input by user and overlay progress color. green, yellow, and red 
21.	output page 📈 workflow 1: click 📝icon will bring user to 📝 input page or user click project image then click 📝 button from top or click 📝 tab, it also bring user to 📝 input page 
22.	output page 📈 workflow 2: user clicks existing project - it hides all other project and expends next level sub-components under a divided line without intend; each sub-component also has image and overlay same progress color scheme or the sub-component could be a 📝 icon; clicking sub-component with a progressing image it hides other same level sub-components and only shows its own sub-components bellow a divided line 
23.	output page 📈 workflow 3: user reaches the last sub-component ( sub-component=0); if it's a 📝 icon, user needs to create it from 📝 page/tab; If it's a progress image user can update it using 📝 button or 📝 tab; or see the detailed information for green progress user uses 📋 button or 📋 page/tab; for yellow or red progress as soon as user selects the image it will straight away to bring user to 📋 page. 
24.	output page 📁 workflow 4: from other pages return back. click save and return button will save all changes and return click cancel and return will ignore all the changes and return from from 📝 page: showing selected sub-component level and its own sub-components with updated status. save and return or cancel and return button to return from 📋 detailed page: showing the sub-component= 0 item updated status. 
25.	📝 input page workflow: (should the items based on project feature? if it is it needs to be detected based on project name or key word) .   
26.	Packaging could be the first sub-component. ( or can skip) 
27.	sub-component count is common field. total required quantity. estimated/required production/process/assemble/consume rate. (from sub-component can check project date needs within sub-component date range; each component estimated production/consume rate  times number day should equal required quantity. if these conditions aren't meet, create warning during planning phase). Actual production/consume rate. (read only) Actual production quantity. (read only) (planning and production monitoring), using actual production/consume rate calculates against required quantity or estimated rate to update status during monitoring phase). comment field read only for previous ones, editable for current only. 
28.	input for multiple start/end date. start and end date (number of how many separate start/end date, hit increasing the count will have extra start and end date input field ). for each start/end date: quantity field, supplier field, assembling/process line, team, material( for sub-component =0 item only ). total raw material cost field (read only - calculated based on sub-component =0 items), actual production/consume rate (start from 0, updated daily or per shift). comment for each date range, previous comment is read only, current is editable. 
29.	detail page📋 can be eliminated by combining output 📈 and input 📝 page. but how to handle multiple sub-component warnings:  
30.	show warning workflow: click project it shows all warning sub-components (only these have the source of warning not those caused by its children components) from sub-component =0 in increment order. clicks the warning component brings to 📝 page, the fields that violate the condition are highlighted in the same warning color ( yellow or red). all the fields are read only. except write comments.