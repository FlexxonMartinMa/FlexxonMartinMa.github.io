# Example:

function addScript(k,dElm,loadFn){
    var d = document, h = dElm||d.getElementsByTagName('HEAD')[0];
    if(h&&k){
        var e = d.createElement('SCRIPT');
        e.type = 'text/javascript';
        if(loadFn) e.onload = loadFn;
        e.src = k;
        h.appendChild(e);
    }
}

addScript("https://cdn.jsdelivr.net/npm/vue/dist/vue.js",pWinHead,function(){
    addScript("https://raw.githack.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.js",pWinHead,function(){
        var d = document, x = '';
        x += 'function printAsPDF(d,fName){';
        x += '  html2pdf(d.body,{ ';
        x += '    margin: 0,';
        x += '    filename: fName,';
        x += '    image: { type: "jpeg", quality: 0.98 },';
        x += '    html2canvas:  { scale: 2 },';
        x += '    pagebreak: { mode: "css", before: "", after: ".pagebreak", avoid: ".labelwrapper"},';
        x += '    jsPDF: {unit: "in", format: "A4", orientation: "landscape"}';
        x += '  });';
        x += '}'
        var sTextNode = d.createTextNode(x);
        var s = d.createElement('SCRIPT');
        s.type = 'text/javascript';
        pDocBody.appendChild(s);
        s.appendChild(sTextNode);
    })
});

exampleBodyElement.onclick = printAsPDF;
