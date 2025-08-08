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
 *             window.glueui = {};
 *      (function(){})() namespace
 */

(function() {
    window.uiVersion = "2.0";
    window.isServerMode = true;
    window.isMobileMode = false;
    window.master_combo_url = "basicLovData.do?ServiceName=lov-service";
    //window.dhx_globalImgPath = "./dhtmlx/codebase/imgs/";
    window.jsFileDirPath = "./dhtmlx/codebase/";

    var localhostTests = [/^localhost:8888$/, /^127.0.0.1:7001$/, /^localhost:7001$/],
        host = window.location.host,
        isDevelopment = false,
        test,
        UserAgent = navigator.userAgent;

    if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null) isMobileMode = true;

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
    } else if (!isDevelopment && window.location.protocol === "http:" && (window.location.port == 80 || window.location.port == 8080 || window.location.port == "")) {
        //dhx_globalImgPath = "/dhtmlx/codebase/imgs/";
        jsFileDirPath = "/dhtmlx/codebase/";
    }

    if (!isServerMode) {
        document.write('<script src="' + jsFileDirPath + 'dhtmlx_debug.js" type="text/javascript"></script>');
        document.write('<script src="' + jsFileDirPath + 'json2-min.js" type="text/javascript"></script>');
        //        document.write("<script src=\"" + jsFileDirPath + "gluegun.ui.js\" type=\"text/javascript\"></script>");
        document.write('<script src="' + jsFileDirPath + 'jquery-3.3.1.min.js" type="text/javascript"></script>');
        document.write('<script src="' + jsFileDirPath + 'keypress-2.1.5.min.js" type="text/javascript"></script>');
        document.write('<script src="' + jsFileDirPath + 'modernizr.custom.js" type="text/javascript"></script>');
        document.write('<script src="' + jsFileDirPath + 'dhtmlx_5.1.0_custom.js" type="text/javascript"></script>');
    }

    if (!isDevelopment && window.location.protocol === "http:" && (window.location.port == 80 || window.location.port == 8080 || window.location.port == "")) {
        if (window.document.domain !== "dongkukcm.com") window.document.domain = "dongkukcm.com";
    }
    //listener = new window.keypress.Listener();
})();

importXhrJS = function(jsFile, alwaysReload) {
    //var url = "http://" + location.host + jsFile;
    var xhr = null;
    var jsSource = "";

    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (xhr) {
        xhr.open("get", jsFile, false);
        xhr.send(null);
        jsSource = xhr.responseText;
    }
    return jsSource;
};

importJS = function(jsFile, alwaysReload) {
    if (typeof document.js_list == "undefined") {
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
        var param = alwaysReload ? "?v=" + uiVersion : "?v=1.0";
        return importXhrJS(jsFile + param, importJS);
    } else {
        return "";
    }
};

if (window.location.protocol && isServerMode) {
    eval(importJS(jsFileDirPath + "jquery-3.3.1.min.js", true));
    eval(importJS(jsFileDirPath + "dhtmlx_5.1.0.js", true));
    eval(importJS(jsFileDirPath + "dhtmlx.message.js", true));
    eval(importJS(jsFileDirPath + "json2-min.js", true));
    eval(importJS(jsFileDirPath + "keypress-2.1.5.min.js", true));
    eval(importJS(jsFileDirPath + "modernizr.custom.js", true));
    eval(importJS(jsFileDirPath + "dhtmlx_5.1.0_custom.js", true));
    // document.write("<script src=\"" + jsFileDirPath + "jquery-3.3.1.min.js\" type=\"text/javascript\"></script>");
    // document.write("<script src=\"" + jsFileDirPath + "dhtmlx_5.1.0.js\" type=\"text/javascript\"></script>");
    // document.write("<script src=\"" + jsFileDirPath + "dhtmlx.message.js\" type=\"text/javascript\"></script>");
    // document.write("<script src=\"" + jsFileDirPath + "json2-min.js\" type=\"text/javascript\"></script>");
    // document.write("<script src=\"" + jsFileDirPath + "keypress-2.1.5.min.js\" type=\"text/javascript\"></script>");
    // document.write("<script src=\"" + jsFileDirPath + "modernizr.custom.js\" type=\"text/javascript\"></script>");

    //    document.write("<script src=\"" + jsFileDirPath + "gluegun.ui.js\" type=\"text/javascript\"></script>");
    // eval(importJS(jsFileDirPath + "gluegun.ui.js", true));

    function addKeyPressListener() {
        window.listener = new window.keypress.Listener();

        window.listener.simple_combo("esc", function() {
            if (
                $("#nav_all_menu", parent.document)
                    .contents()
                    .is(":visible")
            ) {
                parent.hideAllMenu();
            } else if (
                $("#nav_manager_info", parent.document)
                    .contents()
                    .is(":visible")
            ) {
                parent.hideManagerInfo();
            } else if (
                $("#nav_user_info", parent.document)
                    .contents()
                    .is(":visible")
            ) {
                parent.hideUserInfo();
            }
        });
        window.listener.simple_combo("f3", function() {
            parent.showAllMenu();
        });

        window.listener.simple_combo("backspace", function(e) {
            var doPrevent;

            var d = e.srcElement || e.target;
            if (d.tagName.toUpperCase() == "INPUT" || d.tagName.toUpperCase() == "TEXTAREA") {
                doPrevent = false;
            } else {
                doPrevent = true;
            }

            if (doPrevent) {
                e.keyCode = 0;
                e.cancelBubble = true;
                e.preventDefault();
            }
            return true;
        });
    }

    $(document).ready(function() {
        addKeyPressListener();
    });
}
