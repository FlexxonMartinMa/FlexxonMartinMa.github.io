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


function runMyFunction(runTime){
	var d = document;
	var x = d.getElementById('usrTitle');
	var iPG = d.getElementById('ctl00_phG_grid_ab_edPi');
	console.log( 'UserJS: '+(x?('Loaded Page '+(iPG?(iPG.value||'?'):1)+' of Data@ ['+(x.innerHTML||'?')+']!'):'') + ' ('+runTime+')');
	
	var bgProprety = 'background-color';
	
	//var dtTable = d.getElementById('ctl00_phG_grid_dataT0'), dtBody;
	//if(dtTable) dtBody = dtTable.getElementsByTagName('TBODY')[0];
	//Last TR is empty row. 
	//Correct TR length is dataTableBody.getElementsByTagName('TR').length-1.
	$trPressTimer = null;
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
							var eHeader = document.getElementById('ctl00_phG_grid_headerT'), headerH;
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
	var outerDiv = d.getElementById('ctl00_phG_grid_scrollDiv');
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
var $dataTryTime = 0, $dataInterval = null;
var $getDataTimer = null, $ccDataTimer = 0;
function waitingDataReady(ms){
	if($enableLoadingCover) openBodyLoading();
	$ccDataTimer++;
	if($getDataTimer!=null) clearTimeout($getDataTimer);
	if($ccDataTimer>600){
		clearTimeout($getDataTimer); $getDataTimer = null;
		alert('UserJS: Data Load Timeout!');
		return;
	}
	$getDataTimer = setTimeout(function(){
		var d = document;
		var dtOuter = d.getElementById('ctl00_phG_grid_scrollDiv');
		if(!dtOuter){
			console.log('DIV#ctl00_phG_grid_scrollDiv is not found!');
			return;
		}
		var trData0 = d.getElementById('ctl00_phG_grid_row_0');
		var inDivElms = dtOuter.getElementsByTagName('DIV'), dClass = [], emptyCC = 0;
		for(var i=0; i<inDivElms.length;i++){
			dClass[i] = inDivElms[i].className||'';
			if(dClass[i].indexOf('empty-')===0) emptyCC++;
		}
		if(trData0 || emptyCC>0){
			clearTimeout($getDataTimer); $getDataTimer = null;
			var oTrLength = dtOuter.getElementsByTagName('TR').length;
			$dataInterval = setInterval(function(){
				var nTrLength = dtOuter.getElementsByTagName('TR').length;
				var dtNewRow = d.getElementById('ctl00_phG_grid_newRow');
				var checkClass = dtNewRow?(dtNewRow.className||''):'';
				if(oTrLength != nTrLength || checkClass!='readyacumaticadatetable'){
					clearInterval( $dataInterval );
					$dataInterval = null;
					waitingDataReady(600);
				}
			},600);
			$dataTryTime++;
			console.log('UserJS: 7 - Table Data Ready! '+'('+$dataTryTime+')');
			d.getElementById('ctl00_phG_grid_newRow').className = 'readyacumaticadatetable';
			runMyFunction($dataTryTime);
		} else {
			waitingDataReady(600);
		}
	},ms);
}

function initializeFrameData(){
	var dataTable = document.getElementById('ctl00_phG_grid_dataT0');
	if(dataTable){
		console.log('UserJS: 6 - Got Data Table!');
		waitingDataReady(60);
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

function createCoverDIV(id){
	var d = document;
	var e = d.createElement('DIV');
	d.body.appendChild(e);
	e.style.cssText = 'display:none;position:fixed;top:0px;left:0px;height:100%;width:100%;overflow:hidden;z-index:999000;';
	e.id = id||'';
}

(function(){
	console.log('UserJS: 3 - Addon Function Loaded!');
	var pageTitle = document.getElementById('page-caption');
	if(pageTitle){
		console.log('UserJS: 4 - Got Frame Title Wrapper!');
		timerGetTitle(600);
		createCoverDIV('bodycover');
		createCoverDIV('bodycover2');
	} else {
		alert('UserJS: Page Caption Not Found!');
	}
})();

