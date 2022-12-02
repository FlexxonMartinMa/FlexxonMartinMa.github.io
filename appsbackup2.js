//**********************************//
//****** General Page Effects ******//
//**********************************//
$flexxonAddonSetting=function(){


	var $hoverColor = 'LemonChiffon';
	var $activeColors = ['Gold','yellow'];
	var $selectColors = ['LawnGreen','PaleGreen'];
	
	var $enableRowHoverStyle = 1;
	var $enableRowPressToShowList = 1;
	var $enableLoadingCover = 1;
	
	var $enableMRP_CriticalMaterialQtyInfo = 1;



	function setInSummaryFrame(f){
		if(f){
			var fwDoc = f.contentWindow.document;
			var dCaption = fwDoc.getElementById('page-caption');
			if(dCaption) dCaption.style.display = 'none';
			var inTimeCC = 0, inTimer = setInterval(function(){
				inTimeCC++;
				var dSortArea = fwDoc.getElementById('ctl00_phF_form');
				if(dSortArea){
					dSortArea.parentNode.style.display = 'none';
				}
				window.history.pushState("", "", oWindowUrl);
			},600);
		}
	}


	var oWindowUrl = document.URL;
		
	function testingFunction(addNameId){
		var wLocation = location||window.location;
		var uDomain = wLocation.protocol + '//' + wLocation.hostname;
		var inSummaryPath = '/FlexxonSandbox/(W(10003))/pages/in/in401000.aspx';
	
	
	
	
		
		var oScreenId = __screenID.replace(/\./g,'').toString();
		var screenId_CriticalMaterial = 'AM401000';
		console.log([oScreenId,screenId_CriticalMaterial,oScreenId==screenId_CriticalMaterial]);
		if(oScreenId==screenId_CriticalMaterial && $enableMRP_CriticalMaterialQtyInfo){
			
		
			var d = document;
			var aTR0 = d.getElementById('addiframetr0');
			var aTR1 = d.getElementById('addiframetr1');
			if(!aTR0&&!aTR1){
				var dTable = d.getElementById('ctl00_phG_grid_dataT0');
				var dtHead = dTable.getElementsByTagName('THEAD')[0], idColumn = -1;
				if(dtHead){
					var hTDs = dtHead.getElementsByTagName('TD');
					for(var i=0; i<hTDs.length;i++){
						if(hTDs[i].innerHTML=='Inventory ID'){
							idColumn = i; break;
						}
					}
				}
				if(idColumn>-1){
					var dtBody = dTable.getElementsByTagName('TBODY')[0];
					if(dtBody){
						var gapStyle = 'position:relative;height:120px;';
						var gapFrameStyle = 'position:absolute;top:0;left:0;width:100%;height:100%;background:AliceBlue;border:1px solid silver;';
						
						var checkTRs = dtBody.getElementsByTagName('TR'), bTRs = [], bTDs = [], nTR = [];
						for(var i=0; i<checkTRs.length;i++){
							bTRs.push(checkTRs[i]);
						};
						for(var i=0; i<bTRs.length;i++){
							
							bTDs[i] = bTRs[i].getElementsByTagName('TD');
							if(bTRs[i].id!='ctl00_phG_grid_newRow' && bTDs[i][idColumn]){
								nTR[i] = d.createElement('TR');
								nTR[i].innerHTML = '<td id="addiframetr'+i+'" colspan="'+bTDs[i].length+'" style="'+gapStyle+'"><iframe src="'+uDomain+inSummaryPath+'?InventoryID='+bTDs[i][idColumn].innerHTML.replace(/<[^>]*>?/gm,'').replace(/(^\s+|\s+$)/g,'').replace(/ /g,'+')+'" border="0" style="'+gapFrameStyle+'" onload="setInSummaryFrame(this);"></iframe></td>';
								
								if(bTRs[i+1]){
									dtBody.insertBefore(nTR[i],bTRs[i+1]);
								} else {
									dtBody.appendChild(nTR[i]);
								};
								console.log('UserJS-Try: '+ bTDs[i][idColumn].innerHTML.replace(/<[^>]*>?/gm,''));
							}
						}
						
					}
				}
			}
			
		
		
		
			
			
			
			console.log('UserJS: Loaded Function for Screen of [Critical Material]!');
		}
	}
}
//================================================
//================================================
console.log('UserJS: 0 - Script Start!');
function importScript(d){
	var wLocation = location||window.location;
	var uPaths = wLocation.pathname.split('/');
	if(uPaths[uPaths.length-1].toLowerCase()=='login.aspx'){
		console.log('UserJS: 2 - No Script Import becoz of Login Page!');
	} else {
		var s = d.createElement('SCRIPT'), dTime = (new Date()).getTime();
		s.type = 'text/javascript';
		s.src = 'https://flexxonmartinma.github.io/generalscripts.js?tt='+dTime;
		d.body.appendChild(s);
	}
}
(function(){
	var d = document;
	var mFrame = d.getElementById('main'), fType = mFrame?mFrame.tagName:'';
	var nScript;
	if(mFrame && fType=='IFRAME'){
		console.log('UserJS: 1 - Frame Found!');
		mFrame.onload = function(){
			setTimeout(function(){
				var uOptsScript = $flexxonAddonSetting.toString().replace(/(?:\r\n|\r|\n)/g,' ').replace('function(){','').replace(new RegExp('}$'), '');
				var fDoc = mFrame.contentWindow.document;
				var s = fDoc.createElement('SCRIPT');
				s.type = 'application/javascript';
				s.appendChild(fDoc.createTextNode(uOptsScript));
				fDoc.body.appendChild(s);
				importScript(mFrame.contentWindow.document);
			},240);
		}
	} else {
		console.log('UserJS: 1 - Page without Frame!');
		importScript(d);
	}
})();
