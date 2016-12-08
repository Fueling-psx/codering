var xmlHttp,code=' ';

function createXmlHttp() {
    if (window.XMLHttpRequest) {
       xmlHttp = new XMLHttpRequest();
    } else {
       xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
}
function getSource(url){
    createXmlHttp();
    xmlHttp.open('GET', url, false);
    xmlHttp.onreadystatechange = function(){
        if (xmlHttp.readyState == 4) {
            code = xmlHttp.responseText;
        }
    };
    xmlHttp.send(null);
}
export default function getCode(url) {
    getSource(url);
    return code;
}