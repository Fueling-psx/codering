var xmlHttp,url,code=" ";

function createXmlHttp() {
    if (window.XMLHttpRequest) {
       xmlHttp = new XMLHttpRequest();
    } else {
       xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function getSource(url){
    createXmlHttp();                                            //创建XMLHttpRequest对象  
    xmlHttp.open("GET", url, false);                            //改为同步的，异步的无法将code赋值
    xmlHttp.onreadystatechange = function(){
        if (xmlHttp.readyState == 4) {
            code = xmlHttp.responseText;
        }
    };
    xmlHttp.send(null);
}
//直接通过XMLHttpRequest对象获取远程网页源代码
export default function getCode(url) {
    getSource(url);
    return code;
}