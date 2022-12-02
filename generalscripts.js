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
        var d = document;
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
        var d = document;
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
        var d = document;
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
  var d = document;
  var c = d.getElementById('bodycover');
  c.style.display = 'block';
  if(!bodyLoadingCover.layer){
    bodyLoadingCover.start(c,fn);
  }
}
function closeBodyLoading(){
  bodyLoadingCover.allclose();
  $clearSelectionEnable = true;
  var d = document;
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
  var d = document;
  var c = d.getElementById('bodycover2');
  c.style.display = 'block';
  if(!bodyLoadingCover2.layer){
    bodyLoadingCover2.start(c,fn);
  }
}
function closeBodyLoading2(){
  bodyLoadingCover2.allclose();
  $clearSelectionEnable = true;
  var d = document;
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
//------------------------------------------------------------
//------------------------------------------------------------
function uStorageTest(){
  var i = 0, x = 'testname', c;
  try {
    localStorage.setItem(x,x);
    localStorage.removeItem(x);
  } catch(err) {
    i = -1;
  }
  if(i!=-1){
    localStorage.setItem(x,x);
    if(localStorage.getItem(x)==x){
      localStorage.removeItem(x);
      i = 1;
    }
  }
  var d = document;
  if(i!=1){
    if(navigator.cookieEnabled){
      d.cookie = x+'='+x+';';
      if(d.cookie){
        if((d.cookie).indexOf(x+'='+x)) i = 2;
      }
    }
  }
  if(i!=1&&i!=2){
    $thisDocumentCookie = {};
    i = 0;
  }
  return i;
}; var $thisDocumentCookie = {}, $userStorageCapacity = uStorageTest();
function writeClientSave(cookieValue,cookieId,cookieExpireDay){
  var ck = cookieId||'cookie', cV = cookieValue||'';
  if($userStorageCapacity==1){
    try {
      localStorage.setItem(ck, cV);
    } catch(err){}
  } else if($userStorageCapacity==2){
    var xt = '';
    var xd = parseFloat(cookieExpireDay)||0;
    if(xd>0){
      var dt = new Date();
      dt.setTime(dt.getTime()+(86400000*xd));
      xt = ' expires='+dt.toUTCString()+';';
    }
    document.cookie=ck+'='+encodeURIComponent(cV||'')+';'+xt+' path=/';
  } else if($userStorageCapacity==0){
    $thisDocumentCookie[ck] = cV;
  }
}
function readClientSave(cName){
  var v = '', cN = cName||'cookie';
  if($userStorageCapacity==1){
    try {
      v = localStorage.getItem(cN)||'';
    } catch(err){}
  } else if($userStorageCapacity==2){
    var c = decodeURIComponent(document.cookie);
    c = c.split(';');
    for(var i = 0; i <c.length; i++) {
      c[i] = c[i].split('=');
      if(c[i][0]){
        c[i][0] = c[i][0].replace(/(^\s+|\s+$)/g,'');
        if(c[i][0]==cN){
          if(c[i][1]){
            c[i][1] = c[i][1].replace(/(^\s+|\s+$)/g,'');
            v = c[i][1];
            break;
          }
        }
      }
    }           
  } else if($userStorageCapacity==0){
    v = $thisDocumentCookie[cN];
  }
  return v;
}
function clearClientSave(cName){
  if($userStorageCapacity==1){
    try {
      localStorage.removeItem(cName);
    } catch(err){}
  } else if($userStorageCapacity==2){
    writeClientSave('',cName);
  } else if($userStorageCapacity==0){
    $thisDocumentCookie[cName] = '';
  }
}
//------------------------------------------------------------
//------------------------------------------------------------
var xhttpRequestOption = {
  method: 'GET',    //'GET'or'POST'or'PUT'.
  success: function(responsedText,responseXML){},    //function.
  failure: function(failStatus){},    //function.
  urlsending: '......',
  content_type: 'application/x-www-form-urlencoded',  //for POST method only.
  textparameter: ''
}
function xhttpSendingRequest(opts){
  var xHttpRequest;
  var sendMethod = (opts.method||'').toUpperCase();
  if(sendMethod=='GET'||sendMethod=='POST'||sendMethod=='PUT'){
    if(window.XMLHttpRequest){
      xHttpRequest = new XMLHttpRequest();
    } else {
      xHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xHttpRequest.onreadystatechange = function(){
      if(this.readyState == 4){
        if(this.status == 200){
          opts.success(this.responseText,this.responseXML);
        }
        if(this.status != 200){
          if(this.status!=0) opts.failure(this.status);
        }
        xHttpRequest = null;
      }
    }
    var xPmtr = opts.textparameter;
    xHttpRequest.open(sendMethod,opts.urlsending+((sendMethod=='GET'&&xPmtr)?('?'+xPmtr):''),true);
    if((sendMethod=='POST'||sendMethod=='PUT')&&opts.content_type){
      //Send the proper header information along with the request
      xHttpRequest.setRequestHeader('Content-type', opts.content_type);
    }
    xHttpRequest.send((((sendMethod=='POST'||sendMethod=='PUT')&&xPmtr)?(xPmtr):''));
  }
  return xHttpRequest;
}
//------------------------------------------------------------
//------------------------------------------------------------
var $pageCopiedText = "";
window.addEventListener("copy", function(ev){
  if($pageCopiedText!=""){
    ev.preventDefault();
    ev.clipboardData.setData("text/plain",$pageCopiedText);
    console.log("UserJS: Copied ["+$pageCopiedText+"]");
  }
});
function doCopyToClipboard(e,v){
  var d = document;
  var u = d.getElementById('inputcopyzone');
  if(!u){
	u = d.createElement('DIV');
	u.style.cssText = 'position:fixed;top:0;left:0;height:0px;width:0px;overflow:hidden;';
	u.innerHTML = '<input id="inputcopyzone" type="text" value="" style="display:none;" size="1" readonly/>';
	d.body.appendChild(u);
  }
  if(e&&v){
    var x = d.getElementById("inputcopyzone");
    var nV = v.toString().replace(/(^\\s+|\\s+$)/g,"").replace(/\\,/g,"");
    x.value = (v.replace(/\\s/g,"")==""||isNaN(nV))?v:parseFloat(nV);
    x.style.display = "block";
    x.focus(); x.select();
    x.setSelectionRange(0, 99999);
    var c = "green", t = "Copied!";
    try {
      $pageCopiedText = x.value;
      d.execCommand("copy");
      navigator.clipboard.writeText(x.value);
    } catch(err){
      c = "red";
      t = "Error!";
    }
    x.style.display = "none"; x.value=""; $pageCopiedText="";
    e.style.visibility = "hidden";
    var a = d.createElement("SPAN");
    a.innerHTML = t;
    a.style.cssText = "display:block;position:absolute;top:"+(e.offsetTop||0)+"px;left:"+(e.offsetLeft||0)+"px;color:"+c+";padding:1px 3px;background-color:FloralWhite;border:1px solid YellowGreen;overflow:hidden;";
    e.parentNode.appendChild(a);
    setTimeout(function(){
      e.parentNode.removeChild(a);
      e.style.visibility = "visible";
    },1200);
  }
  return false;
}
function cloneObject(oObj){
  if (oObj == null || typeof oObj != 'object') return oObj;
  var cObject = oObj.constructor();
  for(var attr in oObj){
    if(oObj.hasOwnProperty(attr)) cObject[attr] = oObj[attr];
  }
  return cObject;
}
//------------------------------------------------------------
//------------------------------------------------------------
function createCoverDIV(id){
	var d = document, e = d.createElement('DIV');
	d.body.appendChild(e);
	e.style.cssText = 'display:none;position:fixed;top:0px;left:0px;height:100%;width:100%;overflow:hidden;z-index:999000;';
	e.id = id||'';
}
(function(){
	console.log('UserJS: 2 - General Script Loaded!');
	createCoverDIV('bodycover');
	createCoverDIV('bodycover2');
	var d = document, dTime = (new Date()).getTime();
	var mainScript = d.createElement('SCRIPT');
	mainScript.type = 'text/javascript';
	mainScript.src = 'https://flexxonmartinma.github.io/addonfunction.js?tt='+dTime;
	d.body.appendChild(mainScript);
})();
