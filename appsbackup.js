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
	
	var $enableMRP_CriticalMaterialQtyInfo = 0;

	function testingFunction(addNameId){
		console.log('UserJS: Test Good!');
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
