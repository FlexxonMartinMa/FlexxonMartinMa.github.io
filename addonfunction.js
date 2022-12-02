console.log('UserJS: 2 - Script Loaded!');
//============================================================
//============================================================
	/*
		table id="ctl00_phG_grid"
		
		tr(1) = Tool area
		tr(2) = Filter area
		tr(3) = Header area
			> outerDIV id="ctl00_phG_grid_headerDiv"
			> table id="ctl00_phG_grid_headerT" > thead
			  @td = header name
		tr(4) = Data
			> outerDIV id="ctl00_phG_grid_scrollDiv"
			> table id="ctl00_phG_grid_dataT0" > tbody
			  @td = row/column data
		
		tr(5) = Footer
			> table id="ctl00_phG_grid_footerT" > tfoot
			  @td = Aggregation area
	*/
//============================================================
//============================================================
function specificScreenFunction(addNameId){
	var oScreenId = __screenID.replace(/\./g,'').toString();
	
	var screenId_CriticalMaterial = 'AM401000';
	
console.log([oScreenId,screenId_CriticalMaterial,oScreenId==screenId_CriticalMaterial]);
	
	if(oScreenId==screenId_CriticalMaterial && $enableMRP_CriticalMaterialQtyInfo){
		
		
		alert(addNameId);
		
		console.log('UserJS: Loaded Function for Screen of [Critical Material]!');
	}
}

function runMyFunction(runTime,addNameId){
	var d = document;
	var x = d.getElementById('usrTitle');
	var iPG = d.getElementById('ctl00_phG_'+(addNameId||'')+'grid_ab_edPi');
	console.log( 'UserJS: '+(x?('Loaded Page '+(iPG?(iPG.value||'?'):1)+' of Data@ ['+(x.innerHTML||'?')+']!'):'') + ' ('+runTime+')');
	
	var bgProprety = 'background-color';
	specificScreenFunction(addNameId);
	
	//Last TR in the Data Table is empty row. 
	//Correct TR length is dataTableBody.getElementsByTagName('TR').length-1.
	var $trPressTimer = null;
	function updateStyleToChildTD(e,propertyName,propertyValue,activeColorArray,overRowTable){
		var childTDs = e.getElementsByTagName('TD');
		for(var i = 0; i < childTDs.length; i++){
			if(overRowTable){
				if(childTDs[i].className.indexOf('GridActiveCell')!=-1){
					childTDs[i].style.setProperty(propertyName,(activeColorArray[0]||''),'important');
				} else {
					childTDs[i].style.setProperty(propertyName,(activeColorArray[1]||''),'important');
				}
			} else {
				childTDs[i].style[propertyName] = propertyValue||'';
			}
		}
		if(overRowTable) overRowTable.style.opacity = '0.4';
	}
	function setRowEvent(dtBody,overRowTable){
		if(dtBody){
			var bodyTR = dtBody.getElementsByTagName('TR');
			for(var i = 0; i < bodyTR.length; i++){
				if($enableRowHoverStyle){
					bodyTR[i].onmouseover = function(){
						updateStyleToChildTD(this,bgProprety,$hoverColor,$activeColors,overRowTable);
						this.style.backgroundColor = $hoverColor;
					};
					bodyTR[i].onmouseout = function(){
						updateStyleToChildTD(this,bgProprety,'',$selectColors,overRowTable);
						this.style.backgroundColor = '';
					};
				}
				if($enableRowPressToShowList){
					bodyTR[i].onmousedown = function(){
						if($trPressTimer!=null) clearTimeout($trPressTimer);
						var eachTR = this;
						$trPressTimer = setTimeout(function(){
							var eHeader = document.getElementById('ctl00_phG_'+(addNameId||'')+'grid_headerT'), headerH;
							if(eHeader) headerH = eHeader.getElementsByTagName('thead')[0], rHtml = '';
							if(headerH){
								rHtml += '<style> div#covertable { text-align:left; } div#covertable td { padding: 10px; }</style>';
								rHtml += '<div id="covertable">';
								rHtml += '<table border="1" cellpadding="0" cellspacing="0" style="border-color:#000;">';
								rHtml += '<tbody>';
								var headTDs = headerH.getElementsByTagName('TD'), ahTD = [], abTD = [];
								var thisTDs = eachTR.getElementsByTagName('TD');
								for(var ii = 0; ii < thisTDs.length; ii++){
									ahTD[ii] = (headTDs[ii].innerHTML||'').replace(/<[^>]*>?/gm,' ').replace(/\u00a0/g,' ').replace(/(^\s+|\s+$)/g,'');
									if(ahTD[ii] != ''){
										rHtml += '<tr>';
										rHtml += '<td style="color:#fff;background:CadetBlue;">'+ahTD[ii]+'</td>';
										abTD[ii] = (thisTDs[ii].innerHTML||'').replace(/<[^>]*>?/gm,' ').replace(/\u00a0/g,' ').replace(/(^\s+|\s+$)/g,'');
										rHtml += '<td style="position:relative;background:'+(abTD[ii]==''||abTD[ii]==' '||abTD[ii]=='&nbsp;'||abTD[ii]==String.fromCharCode(160)?'#eee;">':'HoneyDew;"><button type="button" title="Copy data as TEXT" style="cursor:pointer;" onclick="return doCopyToClipboard(this,&quot;'+abTD[ii]+'&quot;);">&#10064;&nbsp;COPY</button>')+'</td>';
										rHtml += '<td style="background:'+(abTD[ii]==''||abTD[ii]==' '||abTD[ii]=='&nbsp;'||abTD[ii]==String.fromCharCode(160)?'#eee':'HoneyDew;color:DarkBlue')+';">'+abTD[ii]+'</td>';
										rHtml += '</tr>';
									}
								}
								rHtml += '</tbody>';
								rHtml += '</table>';
								rHtml += '</div>';
								showAlertBodyLoading2(rHtml,'#000',4,closeBodyLoading2,3);
							} else {
								warningAlert2('Sorry! Unexpected Error - [Header/Table is not found].');
							}
						},900);
						return false;
					};
					bodyTR[i].onmouseup = function(){
						clearTimeout($trPressTimer);
						$trPressTimer = null;
						return false;
					};
				}
			}
		}
	}
	var outerDiv = d.getElementById('ctl00_phG_'+(addNameId||'')+'grid_scrollDiv');
	var dtTables = outerDiv.getElementsByTagName('TABLE'), tBody = [], childTDs = [];
	for(var i=0; i<dtTables.length; i++){
		tBody[i] = dtTables[i].getElementsByTagName('tbody')[0];
		if(tBody[i]) setRowEvent(tBody[i],(dtTables[i].className=='RowNavigator'?dtTables[i]:null));
		if($enableRowHoverStyle){
			if(dtTables[i].className=='RowNavigator'){
				updateStyleToChildTD(tBody[i],bgProprety,null,$selectColors,dtTables[i]);
				dtTables[i].onclick = (function(eBody,eTable){
					return function(){
					setTimeout(function(){
						updateStyleToChildTD(eBody,bgProprety,null,$activeColors,eTable);
					},60);
					}
				})(tBody[i],dtTables[i]);
			}
		}
	}
	closeBodyLoading();
}
//============================================================
//============================================================
//============================================================
//============================================================
var $dataTryTime = [], $dataInterval = [];
var $getDataTimer = [], $ccDataTimer = [];
function waitingDataReady(ms,idx,addNameId){
	var rIdx = (idx||0) - 1;
	if($enableLoadingCover) openBodyLoading();
	$ccDataTimer[rIdx] = ($ccDataTimer[rIdx]||0) + 1;
	if($getDataTimer[rIdx]!=null) clearTimeout($getDataTimer[rIdx]);
	if($ccDataTimer[rIdx]>600){
		clearTimeout($getDataTimer[rIdx]); $getDataTimer[rIdx] = null;
		alert('UserJS: Data Load Timeout!');
		return;
	}
	$getDataTimer[rIdx] = setTimeout(function(){
		var d = document;
		var dtOuter = d.getElementById('ctl00_phG_'+(addNameId||'')+'grid_scrollDiv');
		if(!dtOuter){
			console.log('DIV#ctl00_phG_grid_scrollDiv is not found!');
			return;
		}
		var trData0 = d.getElementById('ctl00_phG_'+(addNameId||'')+'grid_row_0');
		var inDivElms = dtOuter.getElementsByTagName('DIV'), dClass = [], emptyCC = 0;
		for(var i=0; i<inDivElms.length;i++){
			dClass[i] = inDivElms[i].className||'';
			if(dClass[i].indexOf('empty-')===0) emptyCC++;
		}
		if(trData0 || emptyCC>0){
			clearTimeout($getDataTimer[rIdx]); $getDataTimer[rIdx] = null;
			var oTrLength = dtOuter.getElementsByTagName('TR').length;
			$dataInterval[rIdx] = setInterval(function(){
				var nTrLength = dtOuter.getElementsByTagName('TR').length;
				var checkElm = d.getElementById('ctl00_phG_'+(addNameId||'')+'grid_'+(trData0?'row_0':'newRow'));
				var checkClass = checkElm?(checkElm.className||''):'';
				if(oTrLength != nTrLength || checkClass!='readyacumaticadatetable'){
					clearInterval( $dataInterval[rIdx] );
					$dataInterval[rIdx] = null;
					waitingDataReady(600,idx,addNameId);
				}
			},600);
			$dataTryTime[rIdx] = ($dataTryTime[rIdx]||0) + 1;
			console.log('UserJS: 7 - Table Data Ready! '+'('+$dataTryTime[rIdx]+')');
			d.getElementById('ctl00_phG_'+(addNameId||'')+'grid_'+(trData0?'row_0':'newRow')).className = 'readyacumaticadatetable';
			runMyFunction($dataTryTime[rIdx],addNameId);
		} else {
			waitingDataReady(600,idx,addNameId);
		}
	},ms);
}

function initializeFrameData(){
	var d = document;
	var dataTable1 = d.getElementById('ctl00_phG_grid_dataT0');
	if(dataTable1){
		console.log('UserJS: 6a - Got Data Table [Grid]!');
		$getDataTimer[0] = null;
		waitingDataReady(60,1);
	}
	var dataTable2 = d.getElementById('ctl00_phG_tab_t0_grid_dataT0');
	if(dataTable2){
		console.log('UserJS: 6b - Got Data Table [Tab-Grid]!');
		$getDataTimer[1] = null;
		waitingDataReady(60,2,'tab_t0_');
	}
}


var $getTitleTimer = null, $ccTimer = 0;
function timerGetTitle(ms){
	$ccTimer++;
	if($getTitleTimer!=null) clearTimeout($getTitleTimer);
	if($ccTimer>60){
		clearTimeout($getTitleTimer); $getTitleTimer = null;
		alert('UserJS: 5b - Page Load Timeout!');
		return;
	}
	$getTitleTimer = setTimeout(function(){
		var x = document.getElementById('usrTitle');
		if(x){
			console.log('UserJS: 5a - Got Frame Title = ['+(x.innerHTML||'?')+']!');
			initializeFrameData();
			clearTimeout($getTitleTimer);
			$getTitleTimer = null;
		} else {
			timerGetTitle(1200);
		}
	}, ms);
}

(function(){
	console.log('UserJS: 3 - Addon Function Loaded!');
	var pageTitle = document.getElementById('page-caption');
	if(pageTitle){
		console.log('UserJS: 4 - Got Frame Title Wrapper!');
		timerGetTitle(600);
	} else {
		console.error('UserJS: 4 - Page Caption Not Found!');
	}
})();

