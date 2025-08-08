/**

 * Load the library located at the same path with this file

 *

 * - Current hostname is localhost

 * - Current protocol is "file:"

 *

 * Will load dhtmlx.css,json_sans_eval.js,dhtmlx.js,gluegun.ui.js (minified) otherwise

 * hostname is localhost dhtmlxdataprocessor_debug.js load (option)

 * window 변수를 정리하고 namespace 로 관리

 * ex) if(!window.glueui)

 *	         window.glueui = {};

 *      (function(){})() namespace 	         

 */

(function() {

	window.uiVersion = "2.0";

	 window.isServerMode = true;

	 window.isMobileMode = false;

	 window.master_combo_url = "basicLovData.do?ServiceName=lov-service";

	 window.dhx_globalImgPath="./dhtmlx/codebase/imgs/";

	 window.jsFileDirPath = "./dhtmlx/codebase/";

     var  localhostTests = [ /^localhost:8888$/, /^127.0.0.1:7001$/, /^localhost:7001$/],

            host = window.location.host,

            isDevelopment = false,

            test, 

            UserAgent = navigator.userAgent;



    if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null) 

	   isMobileMode = true;  

 

    if (isDevelopment === null) {

        for (i = 0, ln = localhostTests.length; i < ln; i++) {

            test = localhostTests[i];



            if (host.search(test) !== -1) {

                isDevelopment = true;

                break;

            }

        }

    }



     if (window.location.protocol === "file:") {

        isServerMode = false;

     }else if (!isDevelopment && window.location.protocol === "http:" && (window.location.port == 80 || window.location.port == 8080 || window.location.port == "")) {

     	 dhx_globalImgPath="./dhtmlx/codebase/imgs/";

     	 jsFileDirPath = "./dhtmlx/codebase/";

     }

    if(!isServerMode){

		document.write("<script src=\"" + jsFileDirPath + "dhtmlx.js\" type=\"text/javascript\"></script>"); 

		document.write("<script src=\"" + jsFileDirPath + "dhtmlxgrid_excell_combo_custom.js\" type=\"text/javascript\"></script>");

		document.write("<script src=\"" + jsFileDirPath + "dhtmlxgrid_srnd.js\" type=\"text/javascript\"></script>");

		document.write("<script src=\"" + jsFileDirPath + "dhtmlxgrid_markers.js\" type=\"text/javascript\"></script>");

		document.write("<script src=\"" + jsFileDirPath + "dhtmlxgrid_export.js\" type=\"text/javascript\"></script>");

		document.write("<script src=\"" + jsFileDirPath + "dhtmlx_extdrag.js\" type=\"text/javascript\"></script>");

		document.write("<script src=\"" + jsFileDirPath + "dhtmlx.custom.js\" type=\"text/javascript\"></script>");

		document.write("<script src=\"" + jsFileDirPath + "dhtmlx.message.js\" type=\"text/javascript\"></script>");

		document.write("<script src=\"" + jsFileDirPath + "json2-min.js\" type=\"text/javascript\"></script>");

        document.write("<script src=\"" + jsFileDirPath + "gluegun.3x.ui.js\" type=\"text/javascript\"></script>");

        document.write("<script src=\"" + jsFileDirPath + "jquery-1.7.2.min.js\" type=\"text/javascript\"></script>");

    }

    // 웹서버의 dhtmlx_custom.css가 안 읽어짐, 그래서 .을 붙임

    document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + jsFileDirPath + "dhtmlx_custom.css?v=1.0\"/>");

    document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + jsFileDirPath + "dhtmlx_custom.3x.ui.css?v=1.0\"/>");

    if(isMobileMode)

    document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + jsFileDirPath + "dhtmlx_message_mobile.css?v=1.0\"/>"); 

    else

    document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + jsFileDirPath + "dhtmlx_message.css?v=1.1\"/>");	

    document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + jsFileDirPath + "dhtmlx_grid_custom.css?v=1.0\"/>");

    document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + jsFileDirPath + "addCommon.css?v=1.0\"/>");

    if((!isDevelopment && window.location.protocol === "http:") && (window.location.port == 80 || window.location.port == 8080 || window.location.port == "")){

		if(window.document.domain !== "dongkukcm.com") 

    	  window.document.domain="dongkukcm.com";

	 }



})();

importXhrJS = function(jsFile, alwaysReload){

	 

    //var url = "http://" + location.host + jsFile;

    var xhr = null;

    var jsSource = "";

 

    if (window.XMLHttpRequest) {

        xhr = new XMLHttpRequest();

    } else {

        xhr = new ActiveXObject("Microsoft.XMLHTTP");

    }

    if( xhr ){

        xhr.open('get', jsFile, false);

        xhr.send(null);

        

        jsSource = xhr.responseText;

    }

      return jsSource;

}  



importJS = function(jsFile, alwaysReload) {



if (typeof(document.js_list) == "undefined") {

        document.js_list = new Array();

    }

 

    var isExist = false;

    for (var i = 0; i < document.js_list.length; i++) {

        if (document.js_list[i] == jsFile) {

            isExist = true;

            break;

        }

    }

    if (!isExist) {

        document.js_list.push(jsFile);

        var param = (alwaysReload) ? "?v=" + uiVersion : "?v=1.0";

        return importXhrJS(jsFile + param, importJS);

    } else {

        return "";

    }  

}

if(window.location.protocol && isServerMode){

	

	  eval(importJS(jsFileDirPath+"dhtmlx.js",true));

	  eval(importJS(jsFileDirPath+"dhtmlxgrid_excell_combo_custom.js",true));

	  eval(importJS(jsFileDirPath+"dhtmlxgrid_srnd.js",true));

	  eval(importJS(jsFileDirPath+"dhtmlxgrid_markers.js",true));

	  eval(importJS(jsFileDirPath+"dhtmlxgrid_export.js",true));

	  //eval(importJS(jsFileDirPath+"dhtmlxgrid_excell_ra_str.js",true));

	  eval(importJS(jsFileDirPath+"dhtmlx.custom.js",true));

	  eval(importJS(jsFileDirPath+"dhtmlx.message.js",true));

	  eval(importJS(jsFileDirPath+"json2-min.js",true));

	  eval(importJS(jsFileDirPath + "gluegun.3x.ui.js", true));

	  eval(importJS(jsFileDirPath+"jquery-1.7.2.min.js",true)); 

	  eval(importJS("./dhtmlx/codebase/m17.js",true));

	  

  function blockKeyboardKey(e) 

  { 

  e = e||window.event;



  if((e.ctrlKey == true && (e.keyCode == 78 ||e.keyCode == 82)) || 

    (e.keyCode > 113 && e.keyCode < 123))

    { 

		e.keyCode = 0; 

		e.cancelBubble = true; 

		e.preventDefault();

		dhtmlx.alert("키보드 F1~F12 키를 사용할 수 없습니다.");

    }



   if (e.keyCode == 8) {

        var d = e.srcElement || e.target;

        if (d.tagName.toUpperCase() == 'INPUT' || d.tagName.toUpperCase() == 'TEXTAREA') {

            doPrevent = d.readOnly || d.disabled;

        }

        else

            doPrevent = true;

    } else

        doPrevent = false;

    if (doPrevent){

		e.keyCode = 0; 

		e.cancelBubble = true; 

		e.preventDefault();

        dhtmlx.alert("키보드 Backspace 키를 사용할 수 없습니다.");

    }     

   

  } 

  document.onkeydown = blockKeyboardKey;

}