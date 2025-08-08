/**
 * Load the library located at the same path with this file
 *
 * - Current hostname is localhost
 * - Current protocol is "file:"
 *
 * Will load dhtmlx.css,json_sans_eval.js,dhtmlx.js,gluegun.ui.js (minified) otherwise
 * hostname is localhost dhtmlxdataprocessor_debug.js load (option)
 */
(function() {
    window.uiVersion = "2.0";
    window.dhx_globalImgPath="./dhtmlx/codebase/imgs/";
    window.jsFileDirPath = "./dhtmlx/codebase/";
    window.isServerMode = true;
    window.master_combo_url = "basicLovData.do?ServiceName=lov-service";
    var scripts = document.getElementsByTagName('script'),
      localhostTests = [
          /^localhost:8888$/,
          /^127.0.0.1:7001$/,
                 /^localhost:7001$/
      ],
      host = window.location.host,
      isDevelopment = false,
      queryString = window.location.search,
      test, path, i, ln, scriptSrc, match;

  for (i = 0, ln = scripts.length; i < ln; i++) {
      scriptSrc = scripts[i].src;

      match = scriptSrc.match(/glue.ui.bootstrap\.js$/);

      if (match) {
          path = scriptSrc.substring(0, scriptSrc.length - match[0].length);
          break;
      }
  }
  if (isDevelopment === null) {
      for (i = 0, ln = localhostTests.length; i < ln; i++) {
          test = localhostTests[i];

          if (host.search(test) !== -1) {
              isDevelopment = true;
              break;
          }
      }
  }
  
  if (isDevelopment && window.location.protocol === "file:") {
     isServerMode = false;
  }else if (!isDevelopment && window.location.protocol === "http:" && (window.location.port == 80 || window.location.port == "")) {
       dhx_globalImgPath="/dhtmlx/codebase/imgs/";
       jsFileDirPath = "/dhtmlx/codebase/";
  }
  if(!isServerMode){
    document.write("<script src=\"" + jsFileDirPath + "dhtmlx_non_grid_all.js\" type=\"text/javascript\"></script>");
    document.write("<script src=\"" + jsFileDirPath + "dhtmlxgrid.js\" type=\"text/javascript\"></script>"); 
    document.write("<script src=\"" + jsFileDirPath + "dhtmlxgrid_srnd.js\" type=\"text/javascript\"></script>");
    //document.write("<script src=\"" + jsFileDirPath + "dhtmlxgrid_markers.js\" type=\"text/javascript\"></script>"); 
    document.write("<script src=\"" + jsFileDirPath + "dhtmlxgrid_undo.js\" type=\"text/javascript\"></script>"); 
    //document.write("<script src=\"" + jsFileDirPath + "dhtmlxgrid_selection.js\" type=\"text/javascript\"></script>"); 
    //document.write("<script src=\"" + jsFileDirPath + "dhtmlxgrid_nxml.js\" type=\"text/javascript\"></script>"); 
    document.write("<script src=\"" + jsFileDirPath + "dhtmlxgrid_export.js\" type=\"text/javascript\"></script>");
    document.write("<script src=\"" + jsFileDirPath + "dhtmlxgridcell.js\" type=\"text/javascript\"></script>"); 
    document.write("<script src=\"" + jsFileDirPath + "dhtmlx.custom.js\" type=\"text/javascript\"></script>"); 
    //document.write("<script src=\"" + jsFileDirPath + "dhtmlxgrid_splt.js\" type=\"text/javascript\"></script>");
    document.write("<script src=\"" + jsFileDirPath + "dhtmlxgrid_excell_combo_custom.js\" type=\"text/javascript\"></script>"); 
    document.write("<script src=\"" + jsFileDirPath + "dhtmlxgrid_excell_dhxcalendar.js\" type=\"text/javascript\"></script>");
    //document.write("<script src=\"" + jsFileDirPath + "dhtmlxgrid_excell_ra_str.js\" type=\"text/javascript\"></script>");  
    document.write("<script src=\"" + jsFileDirPath + "dhtmlxgrid_json.js\" type=\"text/javascript\"></script>");
    document.write("<script src=\"" + jsFileDirPath + "dhtmlx.message.js\" type=\"text/javascript\"></script>");
    document.write("<script src=\"" + jsFileDirPath + "json2-min.js\" type=\"text/javascript\"></script>"); 
    document.write("<script src=\"" + jsFileDirPath + "jquery-1.7.2.min.js\" type=\"text/javascript\"></script>"); 
    document.write("<script src=.\"" + jsFileDirPath + "gluegun.3x.ui.js\" type=\"text/javascript\"></script>"); 
  }  
  document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"." + jsFileDirPath + "dhtmlx_custom.css?v=1.0\" />");
  document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + jsFileDirPath + "dhtmlx_grid_custom.css?v=1.0\" />");
  document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + jsFileDirPath + "dhtmlx_message.css?v=1.0\" />");
  document.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + jsFileDirPath + "dhtmlx_custom.3x.ui.css?v=1.0\" />");
  
  if(!isDevelopment && window.location.protocol === "http:" && (window.location.port == 80 || window.location.port == "")){
        window.document.domain="dongkukcm.com";
    }
})();
importXhrJS = function(jsFile, alwaysReload){
 
      var url = jsFileDirPath + jsFile;
      var xhr = null;
      var jsSource = "";
   
      if (window.XMLHttpRequest) {
          xhr = new XMLHttpRequest();
      } else {
          xhr = new ActiveXObject("Microsoft.XMLHTTP");
      }
      if( xhr ){
          xhr.open('get', url, false);
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
  eval(importJS("dhtmlx_non_grid_all.js",true));
  eval(importJS("dhtmlxgrid.js",true)); //grid core
  //eval(importJS("dhtmlxgrid_nxml.js",true));//Clipboard
  //eval(importJS("dhtmlxgrid_markers.js",true)); //cell marker
  eval(importJS("dhtmlxgrid_undo.js",true));//grid core undo redo
  eval(importJS("dhtmlxgrid_srnd.js",true));//smart rendering
  eval(importJS("dhtmlxgrid_selection.js",true));//block selection
  eval(importJS("dhtmlxgrid_export.js",true));//grid core excel export
  eval(importJS("dhtmlxgrid_mcol.js",true));//gid column move
  eval(importJS("dhtmlxgrid_drag.js",true));//grid json data format
  eval(importJS("dhtmlxgridcell.js",true));//grid core cell (ro,ron,ed,end) 
  eval(importJS("dhtmlx.custom.js",true));//grid core cell (ro,ron,ed,end)  
  eval(importJS("dhtmlxgrid_oneheader_splt.js",true));//grid split
  eval(importJS("dhtmlxgrid_excell_combo_custom.js",true));//grid comobo cell
  eval(importJS("dhtmlxgrid_excell_dhxcalendar.js",true));//grid calendar cell
  //eval(importJS("dhtmlxgrid_excell_ra_str.js",true)); //grid group radio
  eval(importJS("dhtmlxgrid_json.js",true));//grid json data format 
  //eval(importJS("dhtmlxgrid_ssc.js",true));//grid save cookie
  eval(importJS("dhtmlxgrid_validation.js",true));//grid json data format 
  eval(importJS("dhtmlxdataprocessor.js",true));//grid save
  eval(importJS("dhtmlx.message.js",true));//alert , confirm massage
  eval(importJS("json2-min.js",true));//designer json core
  eval(importJS("jquery-1.7.2.min.js",true));//designer json core
  eval(importJS("gluegun.3x.ui.js",true));//ui core    
  eval(importJS("dhtmlxgrid_rowspan.js",true));//gid column move 

  
  function blockKeyboardKey(e) 
  { 
  e = e||window.event;

  if((e.ctrlKey == true && (e.keyCode == 78 ||e.keyCode == 82)) || 
    (e.keyCode >= 112 && e.keyCode < 123))
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