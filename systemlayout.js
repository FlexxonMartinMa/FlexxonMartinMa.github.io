console.log('UserJS: 0 - Script Added!');
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


function runMyFunction(fcW,runTime){
	var d = fcW.document;
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
							var eHeader = fcW.document.getElementById('ctl00_phG_grid_headerT'), headerH;
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
	var u = d.getElementById('inputcopyzone');
	if(!u){
		var xScript = 'var $pageCopiedText = ""; ';
		xScript += 'window.addEventListener("copy", function(ev){';
		xScript += '  ev.preventDefault();';
		xScript += '  ev.clipboardData.setData("text/plain",$pageCopiedText);';
		xScript += '}); ';
		xScript += 'function doCopyToClipboard(e,v){';
		xScript += '  if(e&&v){';
		xScript += '    var d = document;';
		xScript += '    var x = d.getElementById("inputcopyzone");';
		xScript += '    x.value = v||"";';
		xScript += '    x.style.display = "block";';
		xScript += '    x.focus(); x.select();';
		xScript += '    x.setSelectionRange(0, 99999);';
		xScript += '    var c = "green", t = "Copied!";';
		xScript += '    try {';
		xScript += '      $pageCopiedText = x.value;';
		xScript += '      d.execCommand("copy");';
		xScript += '      navigator.clipboard.writeText(x.value);';
		xScript += '    } catch(err){';
		xScript += '      c = "red";';
		xScript += '      t = "Error!";';
		xScript += '    }';
		xScript += '    x.style.display = "none"; x.value="";';
		xScript += '    e.style.visibility = "hidden";';
		xScript += '    var a = d.createElement("SPAN");';
		xScript += '    a.innerHTML = t;';
		xScript += '    a.style.cssText = "display:block;position:absolute;top:"+(e.offsetTop||0)+"px;left:"+(e.offsetLeft||0)+"px;color:"+c+";padding:1px 3px;background-color:FloralWhite;border:1px solid YellowGreen;overflow:hidden;";';
		xScript += '    e.parentNode.appendChild(a);';
		xScript += '    setTimeout(function(){';
		xScript += '      e.parentNode.removeChild(a);';
		xScript += '      e.style.visibility = "visible";';
		xScript += '    },1200);';
		xScript += '  }';
		xScript += '  return false;';
		xScript += '}';
		u = d.createElement('DIV');
		u.style.cssText = 'position:fixed;top:0;left:0;height:0px;width:0px;overflow:hidden;';
		u.innerHTML = '<input id="inputcopyzone" type="text" value="" style="display:none;" size="1"/>';
		d.body.appendChild(u);
		var s = d.createElement('SCRIPT');
		s.type = 'application/javascript';
		s.appendChild(d.createTextNode(xScript));
		d.body.appendChild(s);
	}
	closeBodyLoading();
}


//============================================================
//============================================================
//============================================================
//============================================================
  function createLoadingCover(opts){
    var c = {
      closebtn: null,
      loadzone: null,  //default value.
      timer: null,  //default value.
      layer: null,  //default value.
      options: opts,
      setopacity: function(e,n){e.style.opacity=n;e.style.filter='alpha(opacity='+(n*100)+')'},
      addingload: function(pElm,iStyle,iSIZE,Pos){
        var LL=0;c.loadzone=document.createElement('div');pElm.appendChild(c.loadzone);
        function LIZ(n){return(iSIZE*n)}
        function ldgStying(w,h){c.loadzone.style.cssText='position:'+(Pos||'relative')+';width:'+w+'px;height:'+h+'px;background:'+c.options.loading_background+';border:'+c.options.loading_border+';z-index:'+(c.options.zindex+40)+';cursor:wait;'}
        var loadingLw=0,loadingLh=0;
        function LG(PosT,PosL){
          var d = document.getElementById('main').contentWindow.document;
          var LDdot=d.createElement('div');
          LDdot.style.cssText='position:absolute;top:'+PosT+'px;left:'+PosL+'px;width:'+loadingLw+'px;height:'+loadingLh+'px;background:'+c.options.dot_background+';cursor:wait;';
          c.loadzone.appendChild(LDdot);
        }
        if(iStyle=='squaredot'){
          LL=12;ldgStying(LIZ(7),LIZ(7));loadingLw=LIZ(1),loadingLh=LIZ(1);
          LG(0,0);LG(0,LIZ(2));LG(0,LIZ(4));LG(0,LIZ(6));LG(LIZ(2),LIZ(6));LG(LIZ(4),LIZ(6));LG(LIZ(6),LIZ(6));LG(LIZ(6),LIZ(4));LG(LIZ(6),LIZ(2));LG(LIZ(6),0);LG(LIZ(4),0);LG(LIZ(2),0);
        }else if(iStyle=='marqueedot'){
          LL=12;ldgStying(LIZ(23),LIZ(2));loadingLw=LIZ(1),loadingLh=LIZ(2);
          LG(0,0);LG(0,LIZ(2));LG(0,LIZ(4));LG(0,LIZ(6));LG(0,LIZ(8));LG(0,LIZ(10));LG(0,LIZ(12));LG(0,LIZ(14));LG(0,LIZ(16));LG(0,LIZ(18));LG(0,LIZ(20));LG(0,LIZ(22));
        }else if(iStyle=='squareline'){
          LL=12;ldgStying(LIZ(4),LIZ(4));loadingLw=LIZ(1),loadingLh=LIZ(1);
          LG(0,0);LG(0,LIZ(1));LG(0,LIZ(2));LG(0,LIZ(3));LG(LIZ(1),LIZ(3));LG(LIZ(2),LIZ(3));LG(LIZ(3),LIZ(3));LG(LIZ(3),LIZ(2));LG(LIZ(3),LIZ(1));LG(LIZ(3),0);LG(LIZ(2),0);LG(LIZ(1),0);
        }else if(iStyle=='marqueeline'){
          LL=14;ldgStying(LIZ(11),LIZ(2));loadingLw=LIZ(1),loadingLh=LIZ(2);
          for(var i=0;i<LL;i++){
            LG(0,LIZ(i));
          }
        }
        function LOADING(){
          if(LL>0){
            for(var i=0;i<LL;i++){
              c.setopacity(c.loadzone.children[i],Math.max(0,1-(0.1*(LL-i))))
            }
            c.loadzone.appendChild(c.loadzone.children[0]);
            c.timer=setTimeout(LOADING,40)
          }
        };
        LOADING();
      },
      clearload: function(customizeHTML,clickToCloseMode,closeCallBackFunction){
        clearTimeout(c.timer);c.timer=null;
        if(c.loadzone!==null){
          c.loadzone.parentNode.removeChild(c.loadzone);
          c.loadzone=null;
        }
        if(customizeHTML&&c.layer){
          var d = document.getElementById('main').contentWindow.document;
          c.loadzone = d.createElement('div');
          c.loadzone.style.cssText = 'width:auto;height:auto;max-width:80%;max-height:80%;'+(c.options.replacebox_style||'');
          c.loadzone.style.position = 'absolute';
          c.loadzone.style.zIndex = (c.options.zindex+60);
          c.loadzone.innerHTML = ''+customizeHTML+'';
          c.layer.parentNode.appendChild(c.loadzone);
          c.layer.style.cursor = 'default';
          c.getcenter(c.loadzone,c.layer);
          var thisCloseClick = function(){
            c.allclose(closeCallBackFunction);
          }
          if(clickToCloseMode==1||clickToCloseMode==2||clickToCloseMode==3){
            c.layer.onclick = thisCloseClick;
          }
          if(clickToCloseMode==1){
            c.loadzone.onclick = thisCloseClick;
          }
          if(clickToCloseMode==3||clickToCloseMode==4){
            c.closebtn = d.createElement('DIV');
            var dfStyle = 'position:absolute;top:0;right:0;width:64px;height:64px;background:transparent url(https://lh3.googleusercontent.com/7hsme9KcxeDCuf1E9hAXlPLyIhSW4v7WUPaM4cEPcRWlwRQFSLJjJcOMTAdg_QEVJJ0) no-repeat center/contain;overflow:hidden;cursor:pointer;z-index:'+(c.options.zindex+80)+'';
            c.closebtn.style = dfStyle;
            var cOpty = '0.8'; c.closebtn.style.opacity=cOpty;
            c.closebtn.onmouseover = function(){this.style.opacity='1'};
            c.closebtn.onmouseout = function(){this.style.opacity=cOpty};
            c.layer.parentNode.appendChild(c.closebtn);
            c.closebtn.onclick = thisCloseClick;
          }
        }
      },
      allclose: function(closeCallBackFunction){
        c.clearload();
        if(c.closebtn!==null){
          c.closebtn.parentNode.removeChild(c.closebtn); c.closebtn = null;
        }
        if(c.layer!==null){
          c.layer.parentNode.removeChild(c.layer);c.layer=null;
        }
        if(typeof closeCallBackFunction === 'function'){
          setTimeout(closeCallBackFunction,0);
        }
      },
      setclosebyclick: function(confirmQuestion,callBackFunction){
        if(c.layer!==null){
          c.layer.onclick = function(e){
            if(confirmQuestion){
              var r = confirm(confirmQuestion);
              if(r!==true) return;
            }
            c.allclose();
            if(typeof callBackFunction === 'function'){
              setTimeout(callBackFunction,0);
            }
            var cFN = c.options.clickinglayer;
            if(typeof cFN === 'function'){
              setTimeout(cFN,0);
            }
          }
        }
      },
      start: function(e,callBackFunction){
        if(e){
          if(c.layer!==null) c.allclose();
          var d = document.getElementById('main').contentWindow.document;
          c.layer= d.createElement('div');
          c.layer.style.cssText = 'position:absolute;top:0px;left:0px;width:100%;height:100%;background:' + c.options.layer_background + ';z-index:' + c.options.zindex + ';cursor:wait;';
          c.setopacity(c.layer,c.options.opacity);
          e.appendChild(c.layer);
          c.addingload(e,c.options.loading_style,c.options.size,'absolute');
          c.getcenter(c.loadzone,c.layer);
          if(typeof callBackFunction === 'function'){
            setTimeout(callBackFunction,0);
          }
        } else {
          alert('Error: Unavailable/Missing element.');
        }
      },
      getcenter: function(eInner,eOuter){
        if(eInner&&eOuter){
          eInner.style.visibility = 'hidden';
          setTimeout(function(){
            var eH=eInner.offsetHeight+(parseInt(eInner.style.marginTop)||0)+(parseInt(eInner.style.marginBottom)||0);
            var eW=eInner.offsetWidth+(parseInt(eInner.style.marginLeft)||0)+(parseInt(eInner.style.marginRight)||0);
            eInner.style.top=((eOuter.offsetHeight-eH)/2)+'px';
            eInner.style.left=((eOuter.offsetWidth-eW)/2)+'px';
            eInner.style.visibility = 'visible';
          },60);
        }
      }
    };
    function setevent(obj,evt,ofn,evtcap){
      if(!setevent.guid){setevent.guid=0}var eCap=evtcap||false;if(obj.attachEvent){obj.attachEvent('on'+evt,ofn,eCap)}else if(obj.addEventListener){obj.addEventListener(evt,ofn,eCap)}else{if(!ofn.$$guid){ofn.$$guid=setevent.guid++}if(!obj.events){obj.events={}}var fns=obj.events[evt];if(!fns){fns=obj.events[evt]={};if(obj['on'+evt]){fns[0]=obj['on'+evt]}obj['on'+evt]=function(e){var event=e||event||window.event;var returnValue=true,fn=this.events[event.type];for(var i in fn){if(!Object.prototype[i]){this.$$handler=fn[i];if(this.$$handler(event)===false){returnValue=false}}}if(this.$$handler){this.$$handler=null}return returnValue}}fns[ofn.$$guid]=ofn}if(eCap===true){if(obj.setCapture){obj.setCapture()}else{eval('obj.captureEvents(Event.'+evt.toUpperCase()+')')}}
    }
    setevent(window,'resize',function(){
      setTimeout(function(){
        c.getcenter(c.loadzone,c.layer);
        //c.getcenter(c.replaceHTML,c.layer);
      },60);
    }); return c;
  }

  var bodyLoadingCover = createLoadingCover({
    layer_background: '#fff',
    size: 10,
    loading_style: 'marqueeline',  //'squaredot', 'marqueedot', 'squareline', 'marqueeline'.
    loading_background: 'transparent',  //loading_background
    loading_border: 'solid 10px transparent',  //loading_border
    dot_background: 'SkyBlue',  //loading_dot_background
    replacebox_style: 'border:10px solid Gainsboro;border-radius:5px; box-shadow:0px 0px 18px 10px #777; background:#fff; font-weight:bold;font-size:16px;color:#000;text-align:center;overflow:auto;',  //absolute position auto-set and default:maxWith&maxHeight=80%;
    zindex: 999000,
    opacity: 0.6,
    clickinglayer:function(){
      closeBodyLoading();
    }
  });
  var bodyLoadingCover2 = createLoadingCover({
    layer_background: '#000',
    size: 10,
    loading_style: 'squaredot',  //'squaredot', 'marqueedot', 'squareline', 'marqueeline'.
    loading_background: 'transparent',  //loading_background
    loading_border: 'solid 10px transparent',  //loading_border
    dot_background: 'LightSkyBlue',  //loading_dot_background
    replacebox_style: 'border:10px solid Gainsboro;border-radius:5px; box-shadow:0px 0px 18px 10px #777; background:#fff; font-weight:bold;font-size:16px;color:#000;text-align:center;overflow:auto;',  //absolute position auto-set and default:maxWith&maxHeight=80%;
    zindex: 999000,
    opacity: 0.6,
    clickinglayer:function(){
      closeBodyLoading();
    }
  });
  function openBodyLoading(fn,abortRequest){
  	var d = document.getElementById('main').contentWindow.document;
    var c = d.getElementById('bodycover');
    c.style.display = 'block';
    if(!bodyLoadingCover.layer){
      bodyLoadingCover.start(c,fn);
    }
  }
  function closeBodyLoading(){
    bodyLoadingCover.allclose();
    $clearSelectionEnable = true;
    var d = document.getElementById('main').contentWindow.document;
    d.getElementById('bodycover').style.display = 'none';
  }
  function showAlertBodyLoading(x,c,s,f,i){
    if(!bodyLoadingCover.layer) openBodyLoading();
    var h = '<h'+(s||1)+' style="color:'+c+';border:0;padding:20px 20px;background:transparent;">'+(x||'Error!')+'</h'+(s||1)+'>'; 
    bodyLoadingCover.clearload(h,(i||1),f);
  }
  function warningAlert(x){
    showAlertBodyLoading(x,'red',4,closeBodyLoading);
  }
  function openBodyLoading2(fn,abortRequest){
  	var d = document.getElementById('main').contentWindow.document;
    var c = d.getElementById('bodycover2');
    c.style.display = 'block';
    if(!bodyLoadingCover2.layer){
      bodyLoadingCover2.start(c,fn);
    }
  }
  function closeBodyLoading2(){
    bodyLoadingCover2.allclose();
    $clearSelectionEnable = true;
    var d = document.getElementById('main').contentWindow.document;
    d.getElementById('bodycover2').style.display = 'none';
  }
  function showAlertBodyLoading2(x,c,s,f,i){
    if(!bodyLoadingCover2.layer) openBodyLoading2();
    var h = '<h'+(s||1)+' style="color:'+c+';border:0;padding:20px 20px;background:transparent;">'+(x||'Error!')+'</h'+(s||1)+'>'; 
    bodyLoadingCover2.clearload(h,(i||1),f);
  }
  function warningAlert2(x){
    showAlertBodyLoading(x,'red',4,closeBodyLoading2);
  }
//============================================================
//============================================================
var $dataTryTime = 0, $dataInterval = null;
var $getDataTimer = null, $ccDataTimer = 0;
function waitingDataReady(fcW,ms){
	if($enableLoadingCover) openBodyLoading();
	$ccDataTimer++;
	if($getDataTimer!=null) clearTimeout($getDataTimer);
	if($ccDataTimer>600){
		clearTimeout($getDataTimer); $getDataTimer = null;
		alert('UserJS: Data Load Timeout!');
		return;
	}
	$getDataTimer = setTimeout(function(){
		var d = fcW.document;
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
					waitingDataReady(fcW,600);
				}
			},600);
			$dataTryTime++;
			console.log('UserJS: 7 - Table Data Ready! '+'('+$dataTryTime+')');
			d.getElementById('ctl00_phG_grid_newRow').className = 'readyacumaticadatetable';
			runMyFunction(fcW,$dataTryTime);
		} else {
			waitingDataReady(fcW,600);
		}
	},ms);
}

function initializeFrameData(fcW){
	var dataTable = fcW.document.getElementById('ctl00_phG_grid_dataT0');
	if(dataTable){
		console.log('UserJS: 6 - Got Data Table!');
		waitingDataReady(fcW,60);
	}
}


var $getTitleTimer = null, $ccTimer = 0;
function timerGetTitle(fcW,ms){
	$ccTimer++;
	if($getTitleTimer!=null) clearTimeout($getTitleTimer);
	if($ccTimer>60){
		clearTimeout($getTitleTimer); $getTitleTimer = null;
		alert('UserJS: 5b - Page Load Timeout!');
		return;
	}
	$getTitleTimer = setTimeout(function(){
		var x = fcW.document.getElementById('usrTitle');
		if(x){
			console.log('UserJS: 5a - Got Frame Title = ['+(x.innerHTML||'?')+']!');
			initializeFrameData(fcW);
			clearTimeout($getTitleTimer);
			$getTitleTimer = null;
		} else {
			timerGetTitle(fcW,1200);
		}
	}, ms);
}

function createCoverDIV(id){
	var d = document.getElementById('main').contentWindow.document;
	var e = d.createElement('DIV');
	d.body.appendChild(e);
	e.style.cssText = 'display:none;position:fixed;top:0px;left:0px;height:100%;width:100%;overflow:hidden;z-index:999000;';
	e.id = id||'';
}

function initializeCustomFunction(){
	console.log('UserJS: 3 - Frame Onloaded!');
	var mFrame = document.getElementById('main');
	var fcW = mFrame.contentWindow;
	var pageTitle = fcW.document.getElementById('page-caption');
	if(pageTitle){
		console.log('UserJS: 4 - Got Frame Title Wrapper!');
		timerGetTitle(fcW,600);
		createCoverDIV('bodycover');
		createCoverDIV('bodycover2');
	}
}

(function(){
	var mFrame = document.getElementById('main');
	if($mainFrameStatus === 1){
		initializeCustomFunction();
	} else {
		mFrame.onload = initializeCustomFunction;
	}
})();

