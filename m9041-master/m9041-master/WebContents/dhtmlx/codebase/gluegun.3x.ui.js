
/** 
 * @fileoverview UI Designer 연동 및 dhtmlx component api wrapper component <br>
 * MES UI에서 사용하는 DHTMLX component 를 사용하기 쉽게 wrapper component 로 구성 <br>
 * ui component 구성 <br>
 * ui.common <br>
 * ui.grid <br>
 * ui.from <br>
 * ui.menu <br>
 * ui.dataprocess <br>
 * ui.tabbar <br>
 * ui.contextmenu <br>
 * ui.messagebox <br>
 * ui.initializeDHTMLX <br>
 * @author KyungSeo Park kyung-seo@withfuture.com <br>
 * @version 0.1 
 */

// 테스트서버에 올리는 명령
// scp gluegun.3x.ui.js tstwas@210.1.1.138:/APP/WAS/UBMWQ/webtier/instances/instance1/config/OHS/ohs1/htdocs/dhtmlx/codebase
dhtmlXLayoutObject.prototype.tplData["4E"] = '<layout><autosize hor="a;b;c;d" ver="d" rows="4" cols="1"/><table data="a;b;c;d"/><row><cell obj="a" wh="1,4" resize="ver" neighbors="a;b;c;d"/></row><row sep="yes"><cell sep="hor" top="a" bottom="b;c;d" dblclick="a"/></row><row><cell obj="b" wh="1,4" resize="ver" neighbors="a;b;c;d"/></row><row sep="yes"><cell sep="hor" top="a;b" bottom="c;d" dblclick="b"/></row><row><cell obj="c" wh="1,4" resize="ver" neighbors="a;b;c;d"/></row><row sep="yes"><cell sep="hor" top="a;b;c" bottom="d" dblclick="c"/></row><row><cell obj="d" wh="1,4" resize="ver" neighbors="a;b;c;d"/></row></layout>';
dhtmlXLayoutObject.prototype._availAutoSize["4E_hor"] = ["a;b;c;d"]; dhtmlXLayoutObject.prototype._availAutoSize["4E_ver"] = ["a", "b", "c", "d"];
dhtmlXLayoutObject.prototype.tplData["4W"] = '<layout><autosize hor="d" ver="a;b;c;d" rows="1" cols="4"/><table data="a,b,c,d"/><row><cell obj="a" wh="4,1" resize="hor" neighbors="a;b;c;d"/><cell sep="ver" left="a" right="b;c;d" dblclick="a"/><cell obj="b" wh="4,1" resize="hor" neighbors="a;b;c;d"/><cell sep="ver" left="a;b" right="c;d" dblclick="b"/><cell obj="c" wh="4,1" resize="hor" neighbors="a;b;c;d"/><cell sep="ver" left="a;b;c" right="d" dblclick="c"/><cell obj="d" wh="4,1" resize="hor" neighbors="a;b;c;d"/></row></layout>';
dhtmlXLayoutObject.prototype._availAutoSize["4W_hor"] = ["a", "b", "c", "d"]; dhtmlXLayoutObject.prototype._availAutoSize["4W_ver"] = ["a;b;c;d"];
dhtmlXLayoutObject.prototype.tplData["5E"] = '<layout><autosize hor="a;b;c;d;e" ver="e" rows="5" cols="1"/><table data="a;b;c;d;e"/><row><cell obj="a" wh="1,5" resize="ver" neighbors="a;b;c;d;e"/></row><row sep="yes"><cell sep="hor" top="a" bottom="b;c;d;e" dblclick="a"/></row><row><cell obj="b" wh="1,5" resize="ver" neighbors="a;b;c;d;e"/></row><row sep="yes"><cell sep="hor" top="a;b" bottom="c;d;e" dblclick="b"/></row><row><cell obj="c" wh="1,5" resize="ver" neighbors="a;b;c;d;e"/></row><row sep="yes"><cell sep="hor" top="a;b;c" bottom="d;e" dblclick="c"/></row><row><cell obj="d" wh="1,5" resize="ver" neighbors="a;b;c;d;e"/></row><row sep="yes"><cell sep="hor" top="a;b;c;d" bottom="e" dblclick="d"/></row><row><cell obj="e" wh="1,5" resize="ver" neighbors="a;b;c;d;e"/></row></layout>';
dhtmlXLayoutObject.prototype._availAutoSize["5E_hor"] = ["a;b;c;d;e"]; dhtmlXLayoutObject.prototype._availAutoSize["5E_ver"] = ["a", "b", "c", "d", "e"];
dhtmlXLayoutObject.prototype.tplData["5W"] = '<layout><autosize hor="e" ver="a;b;c;d;e" rows="1" cols="5"/><table data="a,b,c,d,e"/><row><cell obj="a" wh="5,1" resize="hor" neighbors="a;b;c;d;e"/><cell sep="ver" left="a" right="b;c;d;e" dblclick="a"/><cell obj="b" wh="5,1" resize="hor" neighbors="a;b;c;d;e"/><cell sep="ver" left="a;b" right="c;d;e" dblclick="b"/><cell obj="c" wh="5,1" resize="hor" neighbors="a;b;c;d;e"/><cell sep="ver" left="a;b;c" right="d;e" dblclick="c"/><cell obj="d" wh="5,1" resize="hor" neighbors="a;b;c;d;e"/><cell sep="ver" left="a;b;c;d" right="e" dblclick="d"/><cell obj="e" wh="5,1" resize="hor" neighbors="a;b;c;d;e"/></row></layout>';
dhtmlXLayoutObject.prototype._availAutoSize["5W_hor"] = ["a", "b", "c", "d", "e"]; dhtmlXLayoutObject.prototype._availAutoSize["5W_ver"] = ["a;b;c;d;e"];
dhtmlXLayoutObject.prototype.tplData["6E"] = '<layout><autosize hor="c;d;e;f" ver="a;b;f" rows="4" cols="3"/><table data="a,b,c;a,b,d;a,b,e;a,b,f"/><row><cell obj="a" wh="3,1" resize="hor" neighbors="a;b;c,d,e,f" rowspan="7"/><cell sep="ver" left="a" right="b;c,d,e,f" dblclick="a" rowspan="7"/><cell obj="b" wh="3,1" resize="hor" neighbors="a;b;c,d,e,f" rowspan="7"/><cell sep="ver" left="a;b" right="c,d,e,f" dblclick="b" rowspan="7"/><cell obj="c" wh="3,4" resize="ver" neighbors="c;d;e;f"/></row><row sep="yes"><cell sep="hor" top="c" bottom="d;e;f" dblclick="c"/></row><row><cell obj="d" wh="3,4" resize="ver" neighbors="c;d;e;f"/></row><row sep="yes"><cell sep="hor" top="c;d" bottom="e;f" dblclick="d"/></row><row><cell obj="e" wh="3,4" resize="ver" neighbors="c;d;e;f"/></row><row sep="yes"><cell sep="hor" top="c;d;e" bottom="f" dblclick="e"/></row><row><cell obj="f" wh="3,4" resize="ver" neighbors="c;d;e;f"/></row></layout>';
dhtmlXLayoutObject.prototype._availAutoSize["6E_hor"] = new Array("a", "b", "c;d;e;f");
dhtmlXLayoutObject.prototype._availAutoSize["6E_ver"] = new Array("a;b;c", "a;b;d", "a;b;e", "a,b,f");


/**
 * Construct ui package object.
 * @class ui class
 * @constructor
 */
var programId;
var ui;
var layoutObj;


/**
 * Construct ui Object create check.
 */
if (!ui) {
	ui = { version: "v3.1" };
}

/**
 * Construct ui.common Object create check.
 */
if (!ui.common) {
	ui.common = {};
}
/**
 * @class gluegun.ui 에서 사용되는 공통 Function
 * @constructor
 */
ui.common = function () {

	/** static ui.common 변수 window event 등록처리에 필요 */
	var _this = this;

	/**
	 * Get the type of this message object. 
	 * @param {string} parentObj rendering div object id
	 * @param {string} msg display message
	 * @param {string} resultStatus complete message code status(errMsg , appMsg) 
	 */
	this.setPrgId = function(jPid) {
		var statusbar_prgId = document.getElementById("statusbar_prgId");
		if(statusbar_prgId) {
			
			if(jPid) {
				statusbar_prgId.value = programId + " > " + jPid;
			} else {
				statusbar_prgId.value = programId;
			}
		}
		else if(parent.document.getElementById("statusbar_prgId")) {
			/ * var pid = parent.programId + " > " + programId; */
			parent.uiCommon.setPrgId(programId);
		}
		return true;
	};

	this.message = function (parentObj, msg, resultStatus) {
		uiCommon.progressOff(parent);
		/** resultStatus = appMsg, errMsg */
		if (resultStatus == "errMsg") {
			/*
			dhtmlx.alert({
				type: "alert-error",
				title: "System Error Message",
				text: msg
			});
			*/
			dhtmlx.message.position = 'bottom';
			dhtmlx.message({
				type: "error",
				text: msg,
				expire: 2000
			});
		}
		else {
			if(typeof parentObj === "undefined") {
				parentObj = "messagebox";
			}
			
			if (document.getElementById(parentObj)) {
				//var pid = (initConfig[0].itemType === 'messagebox')?initConfig[1].renderTo.split("_",1):initConfig[0].renderTo.split("_",1);
				var pid = programId;
				//document.getElementById(parentObj).innerHTML = "<span style='float:left;position:static'>&nbsp;MESSAGE&nbsp;|&nbsp;" + msg + "</span><span style='float:right;position:static'>"+pid+"&nbsp;&nbsp;</span>";
				document.getElementById(parentObj).innerHTML = "<span style='float:left;position:static'>&nbsp;MESSAGE&nbsp;|&nbsp;" + msg + "</span><input class='statusbar_right' id='statusbar_prgId' readonly='true' value=\"" + pid + "\"></input>";
			} else if (parent.document.getElementById(parentObj)) {
				//var pid = (initConfig[0].itemType === 'messagebox')?initConfig[1].renderTo.split("_",1):initConfig[0].renderTo.split("_",1);
				var pid = parent.programId + " > " + programId;
				//document.getElementById(parentObj).innerHTML = "<span style='float:left;position:static'>&nbsp;MESSAGE&nbsp;|&nbsp;" + msg + "</span><span style='float:right;position:static'>"+pid+"&nbsp;&nbsp;</span>";
				parent.document.getElementById(parentObj).innerHTML = "<span style='float:left;position:static'>&nbsp;MESSAGE&nbsp;|&nbsp;" + msg + "</span><input class='statusbar_right' id='statusbar_prgId' readonly='true' value=\"" + pid + "\"></input>";
			}
			else {
				// dhtmlx.alert(msg);
				dhtmlx.message.position = 'bottom';
				
				dhtmlx.message({
					text: msg,
					expire: 2000
				});
			}
		}
		
		/* 추가 수정_json messageStack처리 Start */
		var pageId;
		if (typeof parentObj === "undefined") {
			parentObj = "messagebox";
		}
		
		if (document.getElementById(parentObj)) {
			pageId = programId.toString();
		} else if (parent.document.getElementById(parentObj)) {
			pageId = parent.programId.toString() + " > " + programId.toString();
		}
		
		if (typeof(parent._JSON_MESSAGE_STACK_) !== "undefined") {
			var message_structure = new Object({
				"uuid": new Date().getUTCMilliseconds(),
				"pageId": pageId,
				"pageName": parent.findProgram(pageId, parent.json_all_menu.menus).text,
				"type": resultStatus,
				"date": getTimeStamp(),
				"msg": msg
			});
			
			if (parent._JSON_MESSAGE_STACK_.length >= parent.MESSAGE_STACK_SIZE)
				parent._JSON_MESSAGE_STACK_.pop();
			
			parent._JSON_MESSAGE_STACK_.push(message_structure);
			
			parent._JSON_MESSAGE_STACK_.sort(function(a, b) {
				return a.date > b.date ? -1 : a.date < b.date ? 1 : 0;
			});
		}
		/* 추가 수정_json messageStack처리 End */
		return true;
	};
	/** dhtmlx layout progressOn */
	this.progressOn = function (obj) {
		if (typeof (obj.uiLayout) !== 'undefined') {
			obj.uiLayout.progressOn();
		} else if (typeof (obj.parent.uiLayout) !== 'undefined') {
			obj.parent.uiLayout.progressOn();
		} else if (typeof (obj.winObj) !== 'undefined') {
			obj.winObj.progressOn();
		} else if (typeof (obj.parent.winObj) !== 'undefined') {
			obj.parent.winObj.progressOn();
		}
	};
	/** dhtmlx layout progressOff */
	this.progressOff = function (obj) {
		if (typeof (obj.uiLayout) !== 'undefined') {
			obj.uiLayout.progressOff();
		} else if (typeof (obj.parent.uiLayout) !== 'undefined') {
			obj.parent.uiLayout.progressOff();
		} else if (typeof (obj.winObj) !== 'undefined') {
			obj.winObj.progressOff();
		} else if (typeof (obj.parent.winObj) !== 'undefined') {
			obj.parent.winObj.progressOff();
		}
	};
	this.formParameter = function (_data, formDivObj) {
		var _formdata = formDivObj.getFormData();

		/** dhtmlx item type 에 대한 key,value 추출 calendar는 data를 추출하는 방법이 다름 */
		for (var _key in _formdata) {
			var _itemtype = formDivObj.getItemType(_key);
			if (_itemtype == 'radio') {
				var _radioItem = formDivObj.getCheckedValue(_key);
				_data.push(_key + "=" + encodeURIComponent(_radioItem));
			} else if (_itemtype == 'calendar') {
				if (formDivObj.getInput(_key).value !== "") {
					var _dhxCalendar = formDivObj.getCalendar(_key);
					_data.push(_key + "=" + encodeURIComponent(formDivObj.getInput(_key).value));
					delete _dhxCalendar;
				}
			} else if (_itemtype != 'label' || _itemtype != 'template') {
				var _itemValue = (typeof (_formdata[_key]) == 'undefined') ? "" : _formdata[_key];
				_data.push(_key + "=" + encodeURIComponent((_itemValue === null) ? "" : _itemValue));
			}
		}
	};

	/**
	 * Get the form + grid type of this server request parameters setting object. 
	 * @param {object} arguments[0] form div object id
	 * @param {string} arguments[1] target grid div object id
	 * @param {string} arguments[2] event name
	 * @param {string} arguments[3] option custom parameter add
	 * @example option custom code
	 * var customparam = {"aaa":"bbbb","cccc":"dddd"};
	 * var uiGridFindActionUrl = uiCommon.parameters(formDivObjId,targetGridDivObjId,eventName,customparam);
	 */
	this.parameters = function () {
		/** arguments check */
		if (arguments.length < 1 || arguments.length < 2 || arguments.length < 3) {
			dhtmlx.alert("function arguments setting not found<br>" +
				"arguments[0] : form div object id<br>" +
				"arguments[1] : target grid div object id<br>" +
				"arguments[2] : event name\n");
			return true;
		}

		/** dhtmlx form item data */
		var _formdata = items[arguments[0]].getDhxForm().getFormData();
		/** parameter array */
		var _data = [];
		/** activity serviceName push */
		_data.push(items[arguments[0]].getServiceUrl() + "?ServiceName=" + items[arguments[0]].getServiceName());
		/** activity event push */
		_data.push(arguments[2] + "=1");
		/** dhtmlx item type 에 대한 key,value 추출 calendar는 data를 추출하는 방법이 다름 */
		this.formParameter(_data, items[arguments[0]].getDhxForm());
		/** item 에 대한 rendering 을 하기위한 정보 */
		//_data.push("column-info="+items[arguments[1]].getColumnInfo());
		if (items[arguments[1]].getColumnInfo())
			_data.push("column-info=" + items[arguments[1]].getColumnInfo());
		else
			_data.push("column-info=" + items[arguments[1]].getDefaultColumnInfo());

		if (items[arguments[1]].getBlankRowCntInfo())
			_data.push("blank-row-count=" + items[arguments[1]].getBlankRowCntInfo());
		else
			_data.push("blank-row-count=" + items[arguments[1]].getDefaultRowCnt());

		/** 추가 parameter 를 설정하기 */
		var customParams = (typeof (arguments[3]) == "object") ? arguments[3] : null;
		for (var _key in customParams) {
			_data.push(_key + "=" + encodeURIComponent(customParams[_key]));
		}
		return _data.join("&");
	};
	/**
	* Get the form + parent grid + detail grid type of this server request parameters2 setting object. 
	* @param {string} arguments[0] form div object id
	* @param {string} arguments[1] parent grid div object id
	* @param {string} arguments[2] child grid div object id
	* @param {string} arguments[3] event name
	* @param {string} arguments[4] option custom parameter add
	* @example option custom code
	* var customparam = {"aaa":"bbbb","cccc":"dddd"};
	* var uiGridFindActionUrl = uiCommon.parameters2(formDivObjId, parentGridDivObjId, childGridDivObjId,eventName,customparam);
	*/
	this.parameters2 = function () {
		if (arguments.length < 1 || arguments.length < 2 || arguments.length < 3 || arguments.length < 4) {
			dhtmlx.alert("function arguments setting not found<br>" +
				"arguments[0] : form div object id<br>" +
				"arguments[1] : parent grid div object id<br>" +
				"arguments[2] : child grid div object id<br>" +
				"arguments[3] : event name<br>" +
				"arguments[4] : option custom parameter add");
			return true;
		}

		var _data = [];
		_data.push(items[arguments[0]].getServiceUrl() + "?ServiceName=" + items[arguments[0]].getServiceName());
		_data.push(arguments[3] + "=1");

		if (items[arguments[2]].getColumnInfo())
			_data.push("column-info=" + items[arguments[2]].getColumnInfo());
		else
			_data.push("column-info=" + items[arguments[2]].getDefaultColumnInfo());

		if (items[arguments[2]].getBlankRowCntInfo())
			_data.push("blank-row-count=" + items[arguments[2]].getBlankRowCntInfo());
		else
			_data.push("blank-row-count=" + items[arguments[2]].getDefaultRowCnt());


		var params = items[arguments[1]].parentColumnInfo(items[arguments[1]].getSelectedRowId());
		for (var _key in params) {
			_data.push(_key + "=" + encodeURIComponent(params[_key]));
		}
		/** 추가 parameter 를 설정하기 */
		var customParams = (typeof (arguments[4]) == "object") ? arguments[4] : null;
		for (var _key in customParams) {
			_data.push(_key + "=" + encodeURIComponent(customParams[_key]));
		}
		return _data.join("&");
	};
	/**
	* Get the tab search form + tab target form type of this server request parameters3 setting object. 
	* @param {object} arguments[0] tab search form div object id\
	* @param {object} arguments[1] tab target form div object id
	* @param {string} arguments[2] event Name
	* @param {string} arguments[3] option custom parameters array
	* @example option custom code
	* var customparam = {"aaa":"bbbb","cccc":"dddd"};
	* var uiGridFindActionUrl = uiCommon.parameters3(tabSeachFormDivObjId,targetFormDivObjId,eventName,customparam);
	*/
	this.parameters3 = function () {
		if (arguments.length < 1 || arguments.length < 2 || arguments.length < 3) {
			dhtmlx.alert("function arguments setting not found<br>" +
				"arguments[0] : tab search form div object id<br>" +
				"arguments[1] : tab target form div object id<br>" +
				"arguments[2] : event name<br>" +
				"arguments[3] : custom parameters array");
			return true;
		}
		var _data = [];
		_data.push(items[arguments[1]].getServiceUrl() + "?ServiceName=" + items[arguments[1]].getServiceName());
		_data.push(arguments[2] + "=1");
		this.formParameter(_data, parent.items[arguments[0]].getDhxForm());
		var _formdata1 = items[arguments[1]].getDhxForm().getFormData();
		var _formParam = [];
		for (var _key in _formdata1) {
			if (_key !== 'messageBox')
				_formParam.push(_key);
		}
		_data.push("column-info=" + _formParam);

		var customParams = (typeof (arguments[3]) == "object") ? arguments[3] : null;

		for (var _key in customParams) {
			_data.push(_key + "=" + encodeURIComponent(customParams[_key]));
		}
		return _data.join("&");
	};
	/**
	 * Get the tab parent form + tab grid type of this server request parameters4 setting object. 
	 * @param {object} arguments[0] tab parent form div object id
	 * @param {string} arguments[1] tab grid div object id
	 * @param {string} arguments[2] eventName
	 * @param {string} arguments[3] option custom parameter add
	 * @example option custom code
	 * var customparam = {"aaa":"bbbb","cccc":"dddd"};
	 * var uiGridFindActionUrl = uiCommon.parameters4(tabSeachFormDivObjId,tabGridDivObjId eventName,customparam);
	 */
	this.parameters4 = function () {
		/** arguments check */
		if (arguments.length < 1 || arguments.length < 2 || arguments.length < 3) {
			dhtmlx.alert("function arguments setting not found<br>" +
				"arguments[0] : tab parent form div object id<br>" +
				"arguments[1] : tab grid div object id<br>" +
				"arguments[2] : event name\n");
			return true;
		}
		/** parameter array */
		var _data = [];
		/** activity serviceName push */
		_data.push(parent.items[arguments[0]].getServiceUrl() + "?ServiceName=" + items[arguments[1]].getServiceName());
		/** activity event push */
		_data.push(arguments[2] + "=1");
		/** dhtmlx form item data */
		this.formParameter(_data, parent.items[arguments[0]].getDhxForm());
		/** item 에 대한 rendering 을 하기위한 정보 */

		if (items[arguments[1]].getColumnInfo())
			_data.push("column-info=" + items[arguments[1]].getColumnInfo());
		else
			_data.push("column-info=" + items[arguments[1]].getDefaultColumnInfo());

		if (items[arguments[1]].getBlankRowCntInfo())
			_data.push("blank-row-count=" + items[arguments[1]].getBlankRowCntInfo());
		else
			_data.push("blank-row-count=" + items[arguments[1]].getDefaultRowCnt());

		/** 추가 parameter 를 설정하기 */
		var customParams = (typeof (arguments[3]) == "object") ? arguments[3] : null;
		for (var _key in customParams) {
			_data.push(_key + "=" + encodeURIComponent(customParams[_key]));
		}
		return _data.join("&");
	};
	/**
	* Get the search form + parent grid + child grid type of this server request parameters5 setting object. 
	* @param {string} arguments[0] form div object id
	* @param {string} arguments[1] parent grid div object id
	* @param {string} arguments[2] child grid div object id
	* @param {string} arguments[3] event name
	* @param {string} arguments[4] selected row id
	* @example option custom code
	* var customparam = {"aaa":"bbbb","cccc":"dddd"};
	* var uiGridFindActionUrl = uiCommon.parameters5(tabSeachFormDivObjId,tabParentGridDivObjId,tabChildGridDivObjId,eventName,customparam);
	*/
	this.parameters5 = function () {
		if (arguments.length < 1 || arguments.length < 2 || arguments.length < 3 || arguments.length < 4) {
			alert("function arguments setting not found<br>" +
				"arguments[0] : form div object id<br>" +
				"arguments[1] : parent grid div object id<br>" +
				"arguments[2] : child grid div object id<br>" +
				"arguments[3] : event name\n");
			return true;
		}

		var _data = [];
		_data.push(parent.items[arguments[0]].getServiceUrl() + "?ServiceName=" + items[arguments[2]].getServiceName());
		_data.push(arguments[3] + "=1");

		if (items[arguments[2]].getColumnInfo())
			_data.push("column-info=" + items[arguments[2]].getColumnInfo());
		else
			_data.push("column-info=" + items[arguments[2]].getDefaultColumnInfo());

		if (items[arguments[2]].getBlankRowCntInfo())
			_data.push("blank-row-count=" + items[arguments[2]].getBlankRowCntInfo());
		else
			_data.push("blank-row-count=" + items[arguments[2]].getDefaultRowCnt());

		var params = items[arguments[1]].parentColumnInfo(items[arguments[1]].getSelectedRowId());
		for (var _key in params) {
			_data.push(_key + "=" + encodeURIComponent(params[_key]));
		}
		/** 추가 parameter 를 설정하기 */
		var customParams = (typeof (arguments[3]) == "object") ? arguments[3] : null;
		for (var _key in customParams) {
			_data.push(_key + "=" + encodeURIComponent(customParams[_key]));
		}
		return _data.join("&");
	};
	/**
	* Get the tab search form + tab form type of this server request parameters6 setting object. 
	* @param {object} arguments[0] form div object id\
	* @param {object} arguments[1] target form div object id
	* @param {string} arguments[2] event Name
	* @param {string} arguments[3] option custom parameters array
	* @example option custom code
	* var customparam = {"aaa":"bbbb","cccc":"dddd"};
	* var uiGridFindActionUrl = uiCommon.parameters6(tabSeachFormDivObjId,tabFormDivObjId,eventName,customparam);
	*/
	this.parameters6 = function () {
		if (arguments.length < 1 || arguments.length < 2 || arguments.length < 3) {
			dhtmlx.alert("function arguments setting not found<br>" +
				"arguments[0] : form div object id<br>" +
				"arguments[1] : target form div object id<br>" +
				"arguments[2] : event name<br>" +
				"arguments[3] : custom parameters array");
			return true;
		}

		var _data = [];
		_data.push(items[arguments[1]].getServiceUrl() + "?ServiceName=" + items[arguments[1]].getServiceName());
		_data.push(arguments[2] + "=1");
		this.formParameter(_data, items[arguments[0]].getDhxForm());
		var _formdata1 = items[arguments[1]].getDhxForm().getFormData();
		var _formParam = [];
		for (var _key in _formdata1) {
			if (_key !== 'messageBox')
				_formParam.push(_key);
		}
		_data.push("column-info=" + _formParam);

		var customParams = (typeof (arguments[3]) == "object") ? arguments[3] : null;

		for (var _key in customParams) {
			_data.push(_key + "=" + encodeURIComponent(customParams[_key]));
		}
		return _data.join("&");
	};
	/**
	 * Get the tab search form + tab grid + custom event name +custom service url + custom service name type of this server request parameters7 setting object.
	 * @param {object} arguments[0] tab parent form div object id
	 * @param {string} arguments[1] tab grid div object id
	 * @param {string} arguments[2] eventName
	 * @param {string} arguments[3] Service Url
	 * @param {string} arguments[4] Service Name
	 * @param {string} arguments[5] option custom parameters array
	 * @example option custom code
	 * var customparam = {"aaa":"bbbb","cccc":"dddd"};
	 * var uiGridFindActionUrl = uiCommon.parameters7(tabSeachFormDivObjId,tabGridDivObjId,eventName,ServiceUrl,ServiceName,customparam);
	 */
	this.parameters7 = function () {
		/** arguments check */
		if (arguments.length < 1 || arguments.length < 2 || arguments.length < 3 || arguments.length < 4 || arguments.length < 5) {
			dhtmlx.alert("function arguments setting not found<br>" +
				"arguments[0] : tab parent form div object id<br>" +
				"arguments[1] : tab grid div object id<br>" +
				"arguments[2] : event name<br>" +
				"arguments[3] : Service Url<br>" +
				"arguments[4] : Service Name<br>" +
				"arguments[5] : custom parameters array\n");
			return true;
		}
		/** parameter array */
		var _data = [];
		/** activity serviceName push */
		_data.push(arguments[3] + "?ServiceName=" + arguments[4]);
		/** activity event push */
		_data.push(arguments[2] + "=1");
		/** dhtmlx form item data */
		this.formParameter(_data, parent.items[arguments[0]].getDhxForm());
		/** dhtmlx item type 에 대한 key,value 추출 calendar는 data를 추출하는 방법이 다름 */
		/** item 에 대한 rendering 을 하기위한 정보 */
		if (items[arguments[1]].getColumnInfo())
			_data.push("column-info=" + items[arguments[1]].getColumnInfo());
		else
			_data.push("column-info=" + items[arguments[1]].getDefaultColumnInfo());

		if (items[arguments[1]].getBlankRowCntInfo())
			_data.push("blank-row-count=" + items[arguments[1]].getBlankRowCntInfo());
		else
			_data.push("blank-row-count=" + items[arguments[1]].getDefaultRowCnt());

		/** 추가 parameter 를 설정하기 */
		var customParams = (typeof (arguments[5]) == "object") ? arguments[5] : null;
		for (var _key in customParams) {
			_data.push(_key + "=" + encodeURIComponent(customParams[_key]));
		}
		return _data.join("&");
	};
	/**
	 * Get the search form + parent grid + detail form type of this server request parameters8 setting object. 
	 * @param {string} arguments[0] form div object id
	 * @param {string} arguments[1] grid div object id
	 * @param {string} arguments[2] form div object id
	 * @param {string} arguments[3] event name
	 * @param {string} arguments[4] option custom parameter add
	 * @example option custom code
	 * var customparam = {"aaa":"bbbb","cccc":"dddd"};
	 * var uiGridFindActionUrl = uiCommon.parameters8(SeachFormDivObjId,GridDivObjId,targetFormDivObjId,eventName,customparam);
	 */
	this.parameters8 = function () {
		if (arguments.length < 1 || arguments.length < 2 || arguments.length < 3 || arguments.length < 4) {
			alert("function arguments setting not found<br>" +
				"arguments[0] : form div object id<br>" +
				"arguments[1] : grid div object id<br>" +
				"arguments[2] : form div object id<br>" +
				"arguments[3] : event name<br>" +
				"arguments[4] : option custom parameter add");
			return true;
		}

		var _data = [];
		_data.push(items[arguments[2]].getServiceUrl() + "?ServiceName=" + items[arguments[2]].getServiceName());
		_data.push(arguments[3] + "=1");
		var _formdata = items[arguments[2]].getDhxForm().getFormData();
		var _formParam = [];
		for (var _key in _formdata) {
			var _itemtype = items[arguments[2]].getDhxForm().getItemType(_key);
			if (_itemtype != 'label') {
				if (_key !== 'messageBox')
					_formParam.push(_key);
			}
		}
		_data.push("column-info=" + _formParam);
		/** dhtmlx form item data */
		this.formParameter(_data, items[arguments[0]].getDhxForm());
		var params = items[arguments[1]].parentColumnInfo(items[arguments[1]].getSelectedRowId());
		for (var _key in params) {
			_data.push(_key + "=" + encodeURIComponent(params[_key]));
		}

		/** 추가 parameter 를 설정하기 */
		var customParams = (typeof (arguments[4]) == "object") ? arguments[4] : null;
		for (var _key in customParams) {
			_data.push(_key + "=" + encodeURIComponent(customParams[_key]));
		}
		return _data.join("&");
	};
	/**
	 * Get the target grid + custom service Url + custom service name + eventName type of this server request parameters9 setting object.
	 * @param {string} arguments[0] target grid div object id
	 * @param {string} arguments[1] Service Url
	 * @param {string} arguments[2] Service Name
	 * @param {string} arguments[3] event name
	 * @param {string} arguments[4] custom parameters array
	 * @example option custom code
	 * var customparam = {"aaa":"bbbb","cccc":"dddd"};
	 * var uiGridFindActionUrl = uiCommon.parameters9(targetGridDivObjId,serviceUrl,serviceName,eventName,customparam);
	 */
	this.parameters9 = function () {
		if (arguments.length < 1 || arguments.length < 2 || arguments.length < 3) {
			alert("function arguments setting not found<br>" +
				"arguments[0] : target grid div object id<br>" +
				"arguments[1] : Service Url<br>" +
				"arguments[2] : Service Name<br>" +
				"arguments[3] : event name<br>" +
				"arguments[4] : custom parameters array\n");
			return true;
		}

		var _data = [];
		_data.push(arguments[1] + "?ServiceName=" + arguments[2]);
		_data.push(arguments[3] + "=1");

		if (items[arguments[0]].getColumnInfo())
			_data.push("column-info=" + items[arguments[0]].getColumnInfo());
		else
			_data.push("column-info=" + items[arguments[0]].getDefaultColumnInfo());

		if (items[arguments[0]].getBlankRowCntInfo())
			_data.push("blank-row-count=" + items[arguments[0]].getBlankRowCntInfo());
		else
			_data.push("blank-row-count=" + items[arguments[0]].getDefaultRowCnt());


		/** custom parameter 를 설정하기 */
		var customParams = (typeof (arguments[4]) == "object") ? arguments[4] : null;
		for (var _key in customParams) {
			_data.push(_key + "=" + encodeURIComponent(customParams[_key]));
		}
		return _data.join("&");
	};

	/**
	 * Get the search from + vertical grid(targetGrid) + custom service name + eventName type of this server request parameters10 setting object.
	 * @param {string} arguments[0] search form div object id
	 * @param {string} arguments[1] target grid div object id
	 * @param {string} arguments[2] service name
	 * @param {string} arguments[3] event name
	 * @param {string} arguments[4] option custom parameter add
	 * @example option custom code
	 * var customparam = {"aaa":"bbbb","cccc":"dddd"};
	 * var param = uiCommon.parameters10(searchFormDivObjId,targetGridDivObjId),'parentChileEmp-service',eventName);	
	 */
	this.parameters10 = function () {
		/** arguments check */
		if (arguments.length < 1 || arguments.length < 2 || arguments.length < 3) {
			dhtmlx.alert("function arguments setting not found<br>" +
				"arguments[0] : search form div object id<br>" +
				"arguments[1] : vertical grid(target Grid) div object id<br>" +
				"arguments[2] : service name<br>" +
				"arguments[3] : event name<br>" +
				"arguments[4] : option custom parameter add\n");
			return true;
		}

		/** parameter array */
		var _data = [];
		/** activity serviceName push */
		_data.push("ServiceName=" + arguments[2]);
		_data.push(arguments[3] + "=1");
		/** dhtmlx form item data */
		this.formParameter(_data, items[arguments[0]].getDhxForm());
		/** item 에 대한 rendering 을 하기위한 정보 */
		_data.push("column-info=" + items[arguments[1]].getCellIdColumns());
		/** 추가 parameter 를 설정하기 */
		var customParams = (typeof (arguments[3]) == "object") ? arguments[3] : null;
		for (var _key in customParams) {
			_data.push(_key + "=" + encodeURIComponent(customParams[_key]));
		}
		return _data.join("&");
	};

	/**
	 * Get the parent Grid + child Form + eventName type of this server request parameters11 setting object.
	 * @param {string} arguments[0] search form div object id
	 * @param {string} arguments[1] target grid div object id
	 * @param {string} arguments[2] service name
	 * @param {string} arguments[3] event name
	 * @param {string} arguments[4] option custom parameter add
	 * @example option custom code
	 * var customparam = {"aaa":"bbbb","cccc":"dddd"};
	 * var param = uiCommon.parameters11(parentGridDivObjId,childFormDivObjId),eventName,customparam);	
	 */
	this.parameters11 = function () {
		if (arguments.length < 1 || arguments.length < 2 || arguments.length < 3) {
			alert("function arguments setting not found<br>" +
				"arguments[0] : grid div object id<br>" +
				"arguments[1] : form div object id<br>" +
				"arguments[2] : event name<br>" +
				"arguments[3] : option custom parameter add");
			return true;
		}

		var _data = [];
		_data.push(items[arguments[1]].getServiceUrl() + "?ServiceName=" + items[arguments[1]].getServiceName());
		_data.push(arguments[2] + "=1");
		var _formdata = items[arguments[1]].getDhxForm().getFormData();
		var _formParam = [];
		for (var _key in _formdata) {
			var _itemtype = items[arguments[1]].getDhxForm().getItemType(_key);
			if (_itemtype != 'label') {
				if (_key !== 'messageBox')
					_formParam.push(_key);
			}
		}
		_data.push("column-info=" + _formParam);
		var params = items[arguments[0]].parentColumnInfo(items[arguments[0]].getSelectedRowId());
		for (var _key in params) {
			_data.push(_key + "=" + encodeURIComponent(params[_key]));
		}

		/** 추가 parameter 를 설정하기 */
		var customParams = (typeof (arguments[3]) == "object") ? arguments[3] : null;
		for (var _key in customParams) {
			_data.push(_key + "=" + encodeURIComponent(customParams[_key]));
		}
		return _data.join("&");
	};
	/**
	 * Form Object Event Button 을 Window Event 에 등록
	 * @param {string} eventName activity Event Name
	 * @param {object} formDivObj ui.form object
	 */
	this.formButtonEvent = function (eventName, formDivObj) {
		_this.dynamicFuncCall(eventName, eventName, formDivObj);
	};
	/**
	 * Form&Grid Object Event Button 을 Window Event 에 등록
	 * @param {string} eventName activity Event Name
	 * @param {object} formDivObj ui.form object
	 * @param {string} referenceItem form referenceItem grid div id name
	 */
	this.formGridButtonEvent = function (eventName, formDivObj, referenceItem) {
		_this.dynamicFuncCall(eventName, eventName, formDivObj, referenceItem);
	};
	/**
	 * Grid&Menu Object Event Button 을 Window Event 에 등록
	 * @param {string} id menu xml item id name
	 * @param {object} gridDivId grid div id name
	 */
	this.menuClickEvent = function (id, gridDivId) {
		_this.dynamicFuncCall(id, gridDivId);
	};
	/**
	 * dynamic하기 Window Event 에 등록
	 * @param {object} func window에 등록할 function
	 */
	this.dynamicFuncCall = function (func) {

		if (arguments.length == 1) {
			window[func]();
		} else if (arguments.length == 2) {
			window[func](arguments[1]);
		} else if (arguments.length == 3) {
			window[func](arguments[1], arguments[2]);
		} else if (arguments.length == 4) {
			window[func](arguments[1], arguments[2], arguments[3]);
		}
	};
	/**
	 * Internet Explorer Current Date 가져오기
	 * 형식 : YYYY-MM-DD
	 * @example alert(uiCommon.getCurrentDate());
	 */
	this.getCurrentDate = function () {
		var x = new Date();
		var current_date = x.getFullYear() + '-' + String(x.getMonth() + 1).replace(/^(.)$/, "0$1") + '-' + String(x.getDate()).replace(/^(.)$/, "0$1");
		return current_date;
	};

	/**
	 * Ajax로 서버에서 정보를 읽어와 xml로변환뒤 반환
	 * @return xml Object
	 */
	this.ajaxLoadData = function (serviceUrl, parameters) {
		var xmlObj = null;
		// jji dhtmlxAjax 가 5버전에 없으므로 ...
		var ajaxObject;
		if (typeof dhtmlxAjax != "undefined") {
			ajaxObject = dhtmlxAjax;
		}
		else {
			ajaxObject = dhx4.ajax;
		}
		var loader = ajaxObject.postSync(serviceUrl, parameters);
		if (loader.xmlDoc.responseXML != null) {
			/*server response xml data */
			xmlObj = loader.xmlDoc.responseXML;
		}
		return xmlObj;
	};
	this.renderToGrid = function () {
		var gridObj = items[arguments[0]].getDhxGrid();
		var rowCount = gridObj.getRowsNum();
		var cellCount = gridObj.getColumnsNum();
		var cells = arguments[1].getElementsByTagName("cell");

		if (cells.length != 0) {
			gridObj.forEachRow(function (id) {
				gridObj.forEachCell(id, function (cellObj, ind) {
					if (typeof (cellObj.getAttribute("id")) != 'undefined') {
						for (var i = 0; i < cells.length; i++) {
							if (cellObj.getAttribute("id") === cells.item(i).attributes[0].nodeValue) {
								var cellValue = cells.item(i).firstChild ? cells.item(i).firstChild.nodeValue : "";
								cellObj.setValue(cellValue);
							}
						}
					}
				});
			});
		} else {
			gridObj.forEachRow(function (id) {
				gridObj.forEachCell(id, function (cellObj, ind) {
					if (typeof (cellObj.getAttribute("id")) != 'undefined') {
						cellObj.setValue("");
					}
				});
			});
		}
		var userData = arguments[1].getElementsByTagName("userdata");
		for (var i = 0; i < userData.length; i++) {
			this.message(ui.messagebox.messageBoxDivId, userData[i].firstChild.nodeValue, userData[i].getAttribute("name"));
		}
		if (typeof arguments[2] == 'function') {
			arguments[2].apply(this, arguments);
			arguments[2] = null;
		}
	};
	/**
	 * MES Security 적용을 하기위해 Button 에대한 disabled 기능
	 * @param {object} fObj ui.form object
	 * @param {object} fObj ui.menu object
	 */
	this.securityLevel = function (fObj, mObj) {
		var securityLevel = fObj.getDhxForm().getItemType("save");
		if (!securityLevel) {
			mObj.itemDisabled();
		}
	};

	this.isCurrentAgentIE = function(){
		var agent = navigator.userAgent.toLowerCase();
			
		if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
			return 11;
		}else{
			return false;
		}
	};
};
/**
 * Construct ui.form Object create check.
 */
if (!ui.form) {
	ui.form = {};
}

/**
 * @class DHTMLX Form 을 사용하기 쉽게 Wraper 로 제공되는 Function
 * @constructor
 * @param {int} _index ui.form 생성 Index
 */
/*
ui.form = function(_index){
 // rendering form div id
 var renderTo = initConfig[_index].renderTo;
 // form button 과 reference 되는 item
 var referenceItem = initConfig[_index].referenceItem;
 // form rendering 하기 위한 xml path
 var serviceUrl = initConfig[_index].url;
 // form button 에서 처리되는 Activity Service Name
 var serviceName = initConfig[_index].service;
 //* form div background color setting 
 */


ui.form = function (cell, component) {
	// rendering form div id
	var renderTo = component.renderTo;
	// form button 과 reference 되는 item
	var referenceItem = component.referenceItem;
	// form rendering 하기 위한 xml path
	var serviceUrl = component.url;
	// form button 에서 처리되는 Activity Service Name
	var serviceName = component.service;
	//* form div background color setting 
	//document.getElementById(renderTo).style.backgroundColor="#ebebeb";
	//document.getElementById(renderTo).style.cursor="default";
	// 오른쪽 마우스 방지해제
	// document.getElementById(renderTo).oncontextmenu = function () { return false; }; 
	/** dhtmlxformObject 생성 */

	var _dhxForm;

	if (cell == null) {
		_dhxForm = new dhtmlXForm(renderTo);
	}
	else {
		var _dhxForm = cell.attachForm();
	}

	var _dhxdp = null;
	/** dhtmlxformObject 에서 처리될 dataprocessor 등록 */

	/** dhtmlxformObject rendering xml load */
	if (component.security === undefined || component.security.toLowerCase() === "true") {
		_dhxForm.loadStruct(component.xml, function () {
			var frmUrl = window.location.href;
			var varCut = frmUrl.indexOf("?");
			var varCheck = frmUrl.substring(varCut + 1, frmUrl.length);
			if (varCheck.match("m90") == null) {
				var buttonList = dhtmlxAjax.postSync("_buttonSecurityData.jsp?" + eval(varCheck.split("&", 1)));
				var buttonListArray = buttonList.xmlDoc.responseText.replace(/(^\s*)|(\s*$)/g, "").split(',');
				for (var i = 0; i < buttonListArray.length; i++) {
					_dhxForm.enableItem(buttonListArray[i]);
				}
			}

			_dhxForm.forEachItem(function (id) {
				var _itemtype = _dhxForm.getItemType(id);
				if (_itemtype == 'button' || _itemtype == 'custombutton' || _itemtype == 'linkbutton') {
					_dhxForm.enableItem(id);
				}
			});
		});
	} else {
		_dhxForm.loadStruct(component.xml);
	}

	attachEvents(_dhxForm, component.eventList);

	/** static ui.form 변수 window event 등록처리에 필요 */
	if (typeof (referenceItem) == 'string' && renderTo !== referenceItem) {
		_dhxForm.attachEvent("onButtonClick", function (name, command) {
			if (typeof command !== 'undefined') {
				uiCommon.formGridButtonEvent(command, renderTo, referenceItem);
			} else {
				dhtmlx.alert("command Attribute Not Found!");
			}
		});
	} else {
		_dhxForm.attachEvent("onButtonClick", function (name, command) {
			if (typeof command !== 'undefined') {
				uiCommon.formButtonEvent(command, renderTo);
			} else {
				dhtmlx.alert("command property Not Found!");
			}
		});
	}
	/** dhtmlx dataprocessor create */
	if (component.actionType !== undefined && component.actionType.toLowerCase() === "save") {
		_dhxdp = new dataProcessor(this.serviceUrl);
		/** dataprocessor 에서 서버연동시 request 로 전달할 type 설정 (현재 column name 으로 전달) */
		_dhxdp.enableDataNames(true);
		/** dataprocessor multi update mode 설정 (한건씩 처리하는게아니라 insert,update,delete 를 동시에 처리) */
		_dhxdp.setUpdateMode("off"); //disable auto-update
		/** dataprocessor 서버처리 request mode 설정 */
		_dhxdp.setTransactionMode("POST", true);
		/** dataprocessor 서버처리 request encoding 설정 */
		_dhxdp.enableUTFencoding("true");

		/** dhtmlx dataprocessor init */
		_dhxdp.init(_dhxForm);

		/** dhtmlx dataprocessor data 처리완료 event 등록 */
		_dhxdp.defineAction("appMsg", function (node) { //success dataprocess message event attach
			if (node != null)
				uiCommon.message(ui.messagebox.messageBoxDivId, node.firstChild.data, "appMsg");
			return true;
		});
		/** dhtmlx dataprocessor data 처리실패 event 등록 */
		_dhxdp.defineAction("invalid", function (node) { //error dataprocess message event attach
			if (node != null) {
				uiCommon.message(ui.messagebox.messageBoxDivId, node.firstChild.data, "errMsg");
				uiCommon.message(ui.messagebox.messageBoxDivId, "", "appMsg");
			}
			return true;
		});
	} //end dataprocessor

	/** dhtmlx dataprocessor dnd update event */
	this.setDndUpdateMode = function (mode) {
		if (_dhxdp == null) {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI ScriptError Message",
				text: "UI Action Type 이 정의되지 않았습니다."
			});
			return true;
		}
		_dhxdp.setUpdateMode("off", mode);
	};

	/**
	 * dhtmlx dataprocessor data make update event 
	 * @param	off ,row ,cell
	 * @param	true/false
	*/
	this.setUpdateMode = function (mode, dnd) {
		if (_dhxdp == null) {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI ScriptError Message",
				text: "UI Action Type 이 정의되지 않았습니다."
			});
			return true;
		}
		_dhxdp.setUpdateMode(mode, dnd);
	};
	/**
	 * dhtmlx dataprocessor send
	 * @param {string} arguments[0] divObjId grid Div id
	 * @param {string} arguments[1] eventId Activity Service Event Name
	 * @param {string} arguments[2] option custom parameter add
	 */
	this.sendForm = function () {
		if (_dhxdp == null) {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI ScriptError Message",
				text: "UI Action Type 이 정의되지 않았습니다."
			});
			return true;
		}
		if (arguments.length == 4) {
			_dhxdp.serverProcessor = arguments[0] + "?ServiceName=" + items[arguments[1]].getServiceName() + "&" + arguments[2] + "=1&" + arguments[3];
		} else {
			_dhxdp.serverProcessor = arguments[0] + "?ServiceName=" + items[arguments[1]].getServiceName() + "&" + arguments[2] + "=1";
		}
		_dhxdp.sendData();
		if (_dhxdp.updatedRows.length > 0)
			uiCommon.progressOn(parent);
	};
	/**
	 * dhtmlx dataprocessor mode update Event
	 * @exmple items[gridDivId].setUpdated(rowId,"updated","updated");
	 * @param row id;
	 * @param row state - {bool} true - updated, false - update mark removed;
	 * @param mode - {string} updated,deleted,inserted;
	 */
	this.setUpdated = function (rowId, state, mode) {
		if (_dhxdp == null) {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI ScriptError Message",
				text: "UI Action Type 이 정의되지 않았습니다."
			});
			return true;
		}
		_dhxdp.setUpdated(rowId, state, mode);
	};
	/**
	 * dhtmlx dataprocessor 처리 등록 Event Handler
	 * @param {string} status 서버처리 상태코드
	 * @param {function} fnc 서버처리 custom function
	 */
	this.defineAction = function (status, fnc) {
		if (_dhxdp == null) {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI ScriptError Message",
				text: "UI Action Type 이 정의되지 않았습니다."
			});
			return true;
		}
		_dhxdp.defineAction(status, fnc);
	};
	/**
	 * dhtmlx dataprocessor clear Event 
	 */
	this.clearDataProcess = function () {
		if (_dhxdp == null) {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI ScriptError Message",
				text: "UI Action Type 이 정의되지 않았습니다."
			});
			return true;
		}
		_dhxdp._in_progress = {};
		_dhxdp.updatedRows = [];
	};
	/**
	 * grid CellChanged event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[gridDivId].onRowMarkEvent(evHandler)
	 * fuction onRowMarkEvent(rId,cInd,nValue){}
	 * row id;
	 * row state - {bool} true - updated, false - update mark removed;
	 * mode - {string} updated,deleted,inserted;
	 * invalid - {bool} set if row has error or invalid status.
	 */
	this.onRowMarkEvent = function (evHandler) {
		if (_dhxdp == null) {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI ScriptError Message",
				text: "UI Action Type 이 정의되지 않았습니다."
			});
			return true;
		}
		return _dhxdp.attachEvent("onRowMark", evHandler);
	};
	/**
	 * grid onBeforeUpdate event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[gridDivId].onBeforeUpdate(evHandler)
	 * fuction onBeforeUpdate(id,status){}
	 * row id;
	 * row state - {bool} true - updated, false - update mark removed;
	 */
	this.onBeforeUpdateEvent = function (evHandler) {
		if (_dhxdp == null) {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI ScriptError Message",
				text: "UI Action Type 이 정의되지 않았습니다."
			});
			return true;
		}
		_dhxdp.attachEvent("onBeforeUpdate", evHandler);
	};
	/**
	 * grid onAfterUpdateFinish event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[gridDivId].onAfterUpdateFinish(evHandler)
	 * fuction onAfterUpdateFinish(id,status){}
	 * row id;
	 * row state - {bool} true - updated, false - update mark removed;
	 */
	this.onAfterUpdateFinishEvent = function (evHandler) {
		if (_dhxdp == null) {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI ScriptError Message",
				text: "UI Action Type 이 정의되지 않았습니다."
			});
			return true;
		}
		_dhxdp.attachEvent("onAfterUpdateFinish", evHandler);
	};

	this.onValidationErrorEvent = function (evHandler) {
		if (_dhxdp == null) {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI ScriptError Message",
				text: "UI Action Type 이 정의되지 않았습니다."
			});
			return true;
		}
		_dhxdp.attachEvent("onValidationError", evHandler);
	};
	/**
	 * dhtmlx dataprocessor object
	 * @return {object} dthmlx dataprocessor object
	 */
	this.getDhxDataProcess = function () {
		return _dhxdp;
	};

	/**
	 * dhtmlx form item value 추출
	 * @param {string} itemName item name
	 * @example items[formDivId].getItemValue("EMPNO")
	 */
	this.getItemValue = function (itemName) {
		var _itemtype = _dhxForm.getItemType(itemName);
		var _itemValue = null;
		if (_dhxForm.isItem(itemName)) {
			if (_itemtype == 'calendar') {
				_itemValue = _dhxForm.getInput(itemName).value;
			} else {
				_itemValue = _dhxForm.getItemValue(itemName);
			}
		}
		_itemValue = (typeof (_itemValue) == 'undefined') ? "" : _itemValue;
		return _itemValue;
	};
	/**
	 * dhtmlx form item object 추출 ( calendar , combo , editor )
	 * @param {string} itemName item name
	 * @example items[formDivId].getItem("EMPNO")
	 */
	this.getItem = function (itemName) {
		var _itemtype = _dhxForm.getItemType(itemName);
		var _item = null;
		if (_dhxForm.isItem(itemName)) {
			if (_itemtype == 'calendar') {
				_item = _dhxForm.getCalendar(itemName);
			} else if (_itemtype == 'combo') {
				_item = _dhxForm.getCombo(itemName);
			} else if (_itemtype == 'editor') {
				_item = _dhxForm.getEditor(itemName);
			} else if (_itemtype == 'input') {
				_item = _dhxForm.getInput(itemName);
			}
		} else if (_itemtype == 'radio') {
			_item = _dhxForm.getCheckedValue(itemName);
		}
		return _item;
	};
	/**
	 * Form onValidateError event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[formDivId].onValidateError(onValidateErrorHandler)
	 * fuction onValidateErrorHandler(){} 
	 */
	this.onValidateError = function (onValidateErrorHandler) {
		return _dhxForm.attachEvent("onValidateError", onValidateErrorHandler);
	};
	/**
	 * form div background color 설정
	 * @param {string} color 값
	 */
	this.setBackgroundColor = function (color) {
		document.getElementById(renderTo).style.backgroundColor = color;
		return true;
	};
	/**
	 * form 서버 처리 URL
	 * @return {string} url
	 */
	this.getServiceUrl = function () {
		return serviceUrl;
	};
	/**
	 * form 서버 처리 activity ServiceName
	 * @return {string} activity name
	 */
	this.getServiceName = function () {
		return serviceName;
	};
	/**
	 * dhtmlxform item value setting
	 * @param {string} itemName item name
	 * @param {string} itemValue item value
	 */
	this.setItemValue = function (itemName, itemValue) {
		_dhxForm.setItemValue(itemName, itemValue);
		return true;
	};
	/**
	 * dhtmlxform item lable setting
	 * @param {string} itemName item name
	 * @param {string} itemValue item value
	 */
	this.setItemLabel = function (itemName, itemValue) {
		_dhxForm.setItemLabel(itemName, itemValue);
		return true;
	};
	/**
	 * dhtmlxform item value focus
	 * @param {string} itemName item name
	 */
	this.setItemFocus = function (itemName) {
		_dhxForm.setItemFocus(itemName);
		return true;
	};
	/**
	 * dhtmlxform combo item type Array
	 * @example 
	 * if(isServerMode){
	 *    var comboList = items[formDivobjId].getMasterCombos();
	 *    comboList['DEPTNO'].readonly(true,true);
	 *    ui.combo(comboList['DEPTNO'],"basicDeptCodeData.do","ServiceName=tabMain-service&deptCodeFind=1&column-info=DEPTNO,DNAME");
	 *    comboList['FAC_CD'].readonly(true,false);
	 *    ui.combo.master(comboList['FAC_CD'],'SZ0000','FAC_CD',function(){
	 *      comboList['FAC_CD'].selectOption(0,true,true);
	 *      ui.combo.master(comboList['FAC_CD1'],'SZ0000','PROC_CD');
	 *    });
	 *    comboList['FAC_CD'].attachEvent("onSelectionChange",function(){
	 *      comboList['FAC_CD1'].clearAll('all');
	 *      if(this.getSelectedValue() === 'G'){
	 *        ui.combo.master(comboList['FAC_CD1'],'SZ0000','PROC_CD');
	 *      }else if(this.getSelectedValue() === 'P'){
	 *        ui.combo.master(comboList['FAC_CD1'],'SZ0000','CUS_CD');
	 *      }
	 *      return true;
	 *    });
	 * }
	 */
	this.getMasterCombos = function () {
		var combos = new Array();
		var _items = _dhxForm.getFormData();
		for (var _key in _items) {
			if (_dhxForm.getItemType(_key) === 'combo') {
				combos[_key] = _dhxForm.getCombo(_key);
			}
		}
		return combos;
	};

	/**
	 * 서버에서 처리될 column 정보 (form xml 정의시 hidden 으로 정의)
	 * @return {string} form 에서 처리할 column info
	 */
	this.getColumnInfo = function () {
		return _dhxForm.getUserData("", "column-info");
	};
	/**
	 * form item 을 서버에서 조회
	 * @param {string} dataUrl 서버처리 URL
	 * @param {object} afterEventHandler form item 이 rendering 이 돤료되고 다음에 처될 Function
	 */
	this.loadData = function (dataUrl, afterEventHandler) {
		uiCommon.progressOn(parent);
		_isIE = uiCommon.isCurrentAgentIE();
		if(_isIE){
			_isFF = false;
		}		
		_dhxForm.load(dataUrl, afterEventHandler);
		return true;
	};
	/**
	 * dhtmlxform item value clear
	 */
	this.clear = function () {
		_dhxForm.clear();
		return true;
	};
	/**
	 * dhtmlxform item validate 등록
	 */
	this.validate = function () {
		return _dhxForm.validate();
	};
	/**
	 * Form disableItems event
	 * @param {string} items name
	 * @exmple items[formDivId].disableItems("item name1,item name2..."); 
	 */
	this.disableItems = function (items) {
		var itemArray = items.split(',');
		for (var i = 0; i < itemArray.length; i++) {
			_dhxForm.disableItem(itemArray[i]);
		}
	};
	/** 
	* Form enableItems event
	* @param {string} items name
	* @exmple items[formDivId].enableItems("item name1,item name2..."); 
	*/
	this.enableItems = function (items) {
		var itemArray = items.split(',');
		for (var i = 0; i < itemArray.length; i++) {
			_dhxForm.enableItem(itemArray[i]);
		}
	};
	/**
	 * Form onChangeEventHandler event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[formDivId].onChangeEventHandler(onChangeEventHandler)
	 * fuction onChangeEventHandler(id, value){}
	 * id - an item id 
	 * value - an item value 
	 * status - a checked state (for checkboxes and radios only )
	 */
	this.onChangeEvent = function (onChangeEventHandler) {
		return _dhxForm.attachEvent("onChange", onChangeEventHandler);
	};
	/**
	 * form load before event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[formDivId].onXLSEventHandler(onXLSEventHandler)
	 * fuction onXLSEventHandler(){}
	 * form_obj - form object;
	 */
	this.onXLSEvent = function (onXLSEventHandler) {
		return _dhxForm.attachEvent("onXLS", onXLSEventHandler);
	};
	/**
	 * Form onXLEEventHandler event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[formDivId].onXLEEventHandler(onXLEEventHandler)
	 * fuction onXLEEventHandler(){} 
	 */
	this.onXLEEvent = function (onXLEEventHandler) {
		return _dhxForm.attachEvent("onXLE", onXLEEventHandler);
	};
	/**
	 * dhtmlxform object
	 * @return {object} dhtmlxform object
	 */
	this.getDhxForm = function () {
		return _dhxForm;
	};
};
/**
* Construct ui.grid Object create check.
*/
if (!ui.grid) {
	ui.grid = {};
}

/**
 * @class DHTMLX Grid 을 사용하기 쉽게 Wraper 로 제공되는 Function
 * @constructor1
 * @param {int} _index ui.grid 생성 Index
 */
ui.grid = function (cell, component, css, callback) { // _index
	/** grid insert,update,delete 처리될 서버 URL */
	var serviceUrl = component.url;
	/** grid activity service name */
	var serviceName = component.service;
	var defaultRowCnt = component.rowCnt !== undefined ? component.rowCnt : "0";
	/** child grid refernce div id name 현재는 사용 안함 */
	var referenceItem = component.referenceItem;
	/** dhtmlxgridobject create */
	var gridId = component.renderTo;

	// var _dhxGrid = new dhtmlXGridObject(component.renderTo);
	if (cell == null) {
		_dhxGrid = new dhtmlXGridObject(gridId);
	}
	else {
		var _dhxGrid = cell.attachGrid();
	}

	var _dhxdp = null;
	/** ui designer 에서 설정한 grid contextmenu option ( true , false ) */
	if (component.contextmenu == "true") {
		var gridContextMenu = new ui.contextmenu(_dhxGrid);
		_dhxGrid.enableContextMenu(gridContextMenu);
	}
	if (typeof (component.rowCnt) != 'undefined') {
		_dhxGrid.setUserData("", "blank-row-count", component.rowCnt);
	}
	/** dhtmlxgridobject init */
	_dhxGrid.init();
	_dhxGrid["id"] = gridId;

	/** dhtmlxgridobject load xml */
	_dhxGrid.loadXML(component.xml);
	// _dhxGrid.attachEvent("onResizeEnd", function (obj) { adjustHeader(obj) });
	_dhxGrid.attachEvent("onXLE", function (grid_obj, count) { adjustHeader(grid_obj); if (callback != null) callback.apply(); });

	/** dhtmlxgridobject contextmenu undo redo event hanlder */
	_dhxGrid.enableUndoRedo();
	/** dhtmlxgridobject dataprocessor 등록 */

	/** grid cell border line option */
	if (component.borderline === "true") {
		_dhxGrid.setStyle("", "border:1px solid; border-color : #FFFFFF #DFDFDF #DFDFDF #FFFFFF;", "", "");
	}

	/** dhtmlx dataprocessor create */
	if (component.actionType !== undefined && component.actionType.toLowerCase() === "save") {
		_dhxdp = new dataProcessor(this.serviceUrl);
		/** dataprocessor 에서 서버연동시 request 로 전달할 type 설정 (현재 column name 으로 전달) */
		_dhxdp.enableDataNames(true);
		/** dataprocessor multi update mode 설정 (한건씩 처리하는게아니라 insert,update,delete 를 동시에 처리) */
		_dhxdp.setUpdateMode("off"); //disable auto-update
		/** dataprocessor 서버처리 request mode 설정 */
		_dhxdp.setTransactionMode("POST", true);
		/** dataprocessor 서버처리 request encoding 설정 */
		_dhxdp.enableUTFencoding("true");

		/*
		var _dataColumns = gridObj.getUserData("", "column-info");
		
		if(_dataColumns != null && _dataColumns != ""){	
			this.dhxdp.setDataColumns("[" + _dataColumns + "]");
		} */
		/** dhtmlx dataprocessor init */
		_dhxdp.init(_dhxGrid);

		/** dhtmlx dataprocessor data 처리완료 event 등록 */
		_dhxdp.defineAction("appMsg", function (node) { //success dataprocess message event attach
			if (node != null)
				uiCommon.message(ui.messagebox.messageBoxDivId, node.firstChild.data, "appMsg");
			return true;
		});
		/** dhtmlx dataprocessor data 처리실패 event 등록 */
		_dhxdp.defineAction("invalid", function (node) { //error dataprocess message event attach
			if (node != null) {
				//if(node.getAttribute("message") !== null){
				uiCommon.message(ui.messagebox.messageBoxDivId, node.firstChild.data, "errMsg");
				uiCommon.message(ui.messagebox.messageBoxDivId, "", "appMsg");
				//}
			}
			return true;
		});
	} //end dataprocessor

	/** dhtmlx dataprocessor dnd update event */
	this.setDndUpdateMode = function (mode) {
		if (_dhxdp == null) {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI ScriptError Message",
				text: "UI Action Type 이 정의되지 않았습니다."
			});
			return true;
		}
		_dhxdp.setUpdateMode("off", mode);
	};

	/**
	 * dhtmlx dataprocessor data make update even
	 * @param off ,row ,cell
	 * @param true/false
	 */
	this.setUpdateMode = function (mode, dnd) {
		if (_dhxdp == null) {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI ScriptError Message",
				text: "UI Action Type 이 정의되지 않았습니다."
			});
			return true;
		}
		_dhxdp.setUpdateMode(mode, dnd);
	};
	/**
	 * dhtmlx dataprocessor send
	 * @param {string} arguments[0] divObjId grid Div id
	 * @param {string} arguments[1] eventId Activity Service Event Name
	 * @param {string} arguments[2] option custom parameter add
	 */
	this.sendGrid = function () {
		if (_dhxdp == null) {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI ScriptError Message",
				text: "UI Action Type 이 정의되지 않았습니다."
			});
			return true;
		}
		if (arguments.length == 3) {
			_dhxdp.serverProcessor = items[arguments[0]].getServiceUrl() + "?ServiceName=" + items[arguments[0]].getServiceName() + "&" + arguments[1] + "=1&column-info=" + items[arguments[0]].getColumnInfo() + "&" + arguments[2];
		} else {
			_dhxdp.serverProcessor = items[arguments[0]].getServiceUrl() + "?ServiceName=" + items[arguments[0]].getServiceName() + "&" + arguments[1] + "=1&column-info=" + items[arguments[0]].getColumnInfo();
		}
		_dhxdp.sendData();
		if (_dhxdp.updatedRows.length > 0)
			uiCommon.progressOn(parent);
	};
	/**
	 * dhtmlx dataprocessor mode update Event
	 * @exmple items[gridDivId].setUpdated(rowId,"updated","updated");
	 * @param row id;
	 * @param row state - {bool} true - updated, false - update mark removed;
	 * @param mode - {string} updated,deleted,inserted;
	 */
	this.setUpdated = function (rowId, state, mode) {
		if (_dhxdp == null) {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI ScriptError Message",
				text: "UI Action Type 이 정의되지 않았습니다."
			});
			return true;
		}
		_dhxdp.setUpdated(rowId, state, mode);
	};
	/**
	 * dhtmlx dataprocessor 처리 등록 Event Handler
	 * @param {string} status 서버처리 상태코드
	 * @param {function} fnc 서버처리 custom function
	 */
	this.defineAction = function (status, fnc) {
		if (_dhxdp == null) {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI ScriptError Message",
				text: "UI Action Type 이 정의되지 않았습니다."
			});
			return true;
		}
		_dhxdp.defineAction(status, fnc);
	};
	/**
	 * dhtmlx dataprocessor clear Event 
	 */
	this.clearDataProcess = function () {
		if (_dhxdp == null) {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI ScriptError Message",
				text: "UI Action Type 이 정의되지 않았습니다."
			});
			return true;
		}
		_dhxdp._in_progress = {};
		_dhxdp.updatedRows = [];
	};
	/**
	 * grid CellChanged event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[gridDivId].onRowMarkEvent(evHandler)
	 * fuction onRowMarkEvent(rId,cInd,nValue){}
	 * row id;
	 * row state - {bool} true - updated, false - update mark removed;
	 * mode - {string} updated,deleted,inserted;
	 * invalid - {bool} set if row has error or invalid status.
	 */
	this.onRowMarkEvent = function (evHandler) {
		if (_dhxdp == null) {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI ScriptError Message",
				text: "UI Action Type 이 정의되지 않았습니다."
			});
			return true;
		}
		return _dhxdp.attachEvent("onRowMark", evHandler);
	};
	/**
	 * grid onBeforeUpdate event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[gridDivId].onBeforeUpdate(evHandler)
	 * fuction onBeforeUpdate(id,status){}
	 * row id;
	 * row state - {bool} true - updated, false - update mark removed;
	 */
	this.onBeforeUpdateEvent = function (evHandler) {
		if (_dhxdp == null) {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI ScriptError Message",
				text: "UI Action Type 이 정의되지 않았습니다."
			});
			return true;
		}
		_dhxdp.attachEvent("onBeforeUpdate", evHandler);
	};
	/**
	 * grid onAfterUpdateFinish event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[gridDivId].onAfterUpdateFinish(evHandler)
	 * fuction onAfterUpdateFinish(id,status){}
	 * row id;
	 * row state - {bool} true - updated, false - update mark removed;
	 */
	this.onAfterUpdateFinishEvent = function (evHandler) {
		if (_dhxdp == null) {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI ScriptError Message",
				text: "UI Action Type 이 정의되지 않았습니다."
			});
			return true;
		}
		_dhxdp.attachEvent("onAfterUpdateFinish", evHandler);
	};

	this.onValidationErrorEvent = function (evHandler) {
		if (_dhxdp == null) {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI ScriptError Message",
				text: "UI Action Type 이 정의되지 않았습니다."
			});
			return true;
		}
		_dhxdp.attachEvent("onValidationError", evHandler);
	};
	/**
	 * dhtmlx dataprocessor object
	 * @return {object} dthmlx dataprocessor object
	 */
	this.getDhxDataProcess = function () {
		return _dhxdp;
	};
	/**
	 * grid 조회
	 * @param {string} xmlPath 서버 조회 URL
	 */
	this.adjustHeader = adjustHeader;
	this.autoAdjustcolumn = function (callee) {
		if (this.getAdjustColumn() == "auto") this.adjustColumn();
		if (typeof (callee) == "function") callee.apply(this, arguments);
	};

	this.adjustColumn = function () {
		try {
			for (var i = 0; i < _dhxGrid.getRowsNum(); i++) {
				_dhxGrid.adjustColumnSize(i);
			}
		}
		catch (exception) {
		}
	};
	this.loadData = function () {
		uiCommon.progressOn(parent);
		if (arguments.length > 1) {
			//var callee = arguments[1];
			//debugger;
			if (component.dataType !== undefined 
					&& component.dataType.toLowerCase() === "json") {
				if(uiCommon.isCurrentAgentIE()){
					var arg1 = arguments[0];
					var arg2 = arguments[1];
					
					setTimeout(function() {
						_dhxGrid.clearAndLoad(arg1, arg2, "json");
					}, 50);
				}else{
					_dhxGrid.clearAndLoad(arguments[0], this.autoAdjustcolumn(arguments[1]), "json");
				}
			} else {
				if(uiCommon.isCurrentAgentIE()){
					var arg1 = arguments[0];
					var arg2 = arguments[1];
					setTimeout(function() {
						_dhxGrid.clearAndLoad(arg1, arg2);
					}, 50);
				}else{
					_dhxGrid.clearAndLoad(arguments[0], arguments[1]);
				}
			}
		} else {
			if (component.dataType !== undefined && component.dataType.toLowerCase() === "json") {
				if(uiCommon.isCurrentAgentIE()){
					var arg1 = arguments[0];
					setTimeout(function() {
						_dhxGrid.clearAndLoad(arg1, function() {
							findMessage(_dhxGrid);
						}, "json");
					}, 50);
				}else{
					_dhxGrid.clearAndLoad(arguments[0], function() {
						findMessage(_dhxGrid);
					}, "json");
				}
			} else {
				if(uiCommon.isCurrentAgentIE()){
					
					var arg1 = arguments[0];
					setTimeout(function() {
						_dhxGrid.clearAndLoad(arg1, function() {
							findMessage(_dhxGrid);
						});
					}, 50);
				}else{
					_dhxGrid.clearAndLoad(arguments[0], function () {
						findMessage(_dhxGrid);
					});
				}
			}
		}
		this.autoAdjustcolumn();
	};

	this.loadXmlAndData = function (beforHandler) {
		_dhxGrid.clearAll();
		_dhxGrid.loadXML(component.xml, beforHandler);
	};
	/**
	 * grid row 선택
	 */
	this.getActionType = function () {
		return component.actionType;
	};
	this.getAdjustColumn = function () {
		return component.adjustColumn;
	};

	/**
	 * grid row 선택
	 */
	this.getRowSelectedId = function () {
		return _dhxGrid.getSelectedRowId();
	};
	/**
	 * grid header setting
	 * @param {string} data grid header 
	 * @example items[griDivId].setHeaders("직번","이름","부서");
	 */
	this.setHeaders = function (data) {
		_dhxGrid.detachHeader(0);
		_dhxGrid.attachHeader(data);
		_dhxGrid.setSizes();
	};
	/**
	 * grid row add
	 * @example items[griDivId].addRow();
	 */
	this.addRow = function () {
		var colNum = _dhxGrid.getColumnsNum();
		var defValue = "";
		for (var i = 1; i < colNum; i++) {
			defValue += ",";
		}
		_dhxGrid.addRow(new Date().valueOf(), defValue, 0);
		_dhxGrid.selectCell(0, 0, true, false, true);
	};
	/**
	 * grid row add
	 * @example items[griDivId].removeRow();
	 */
	this.removeRow = function () {
		_dhxGrid.deleteSelectedRows();
	};
	/**
	 * grid cell editting undo
	 */
	this.undo = function () {
		if (_dhxGrid.getUndo()) {
			_dhxGrid.doUndo();
		}
	};
	/**
	 * grid cell editting redo
	 */
	this.redo = function () {
		if (_dhxGrid.getRedo()) {
			_dhxGrid.doRedo();
		}
	};
	/**
	 * grid cell editting mode
	 * @param {string} mode true,false
	 */
	this.setEditable = function (mode) {
		_dhxGrid.setEditable(mode);
	};
	/**
	 * grid rendering column info
	 * @return {string} column info
	 * @exmple column-info=EMPNO,EMPNAME
	 */
	this.getColumnInfo = function () {
		return _dhxGrid.getUserData("", "column-info");
	};

	this.getDefaultColumnInfo = function () {
		return _dhxGrid.columnIds.join(",");
	};

	/*this.getColumnInfo = function(){
		return _dhxGrid.columnIds.join(",");
	},*/
	/**
	 * grid rendering column-merge info
	 * @return {string} column-merge info
	 * @exmple column-merge=EMPNO,EMPNAME
	 */
	this.getColumnMerge = function () {
		return _dhxGrid.getUserData("", "column-merge");
	};
	/**
	 * grid rendering blank-row-count info
	 * @return {string} blank-row-count info
	 * @exmple blank-row-count=4
	 */
	this.getBlankRowCntInfo = function () {
		return _dhxGrid.getUserData("", "blank-row-count");
	};

	this.getDefaultRowCnt = function () {
		return defaultRowCnt;
	};
	/**
	 * grid menu copy row
	 */
	this.copyRowContent = function () {
		var copyRowId = _dhxGrid.getSelectedRowId();
		if (copyRowId) {
			this.addRow();
			_dhxGrid.selectRow(0);
			_dhxGrid.copyRowContent(copyRowId, _dhxGrid.getSelectedRowId());
		} else {
			alert("선택된 Row가 없습니다.");
		}
	};
	/**
	 * grid menu copy clipboard 현재는 사용안함
	 */
	this.copyRowsClipboard = function (type, delim) {
		_dhxGrid.setCSVDelimiter(delim);
		if (type == "all") {
			//copy entire grid;
			_dhxGrid.gridToClipboard();
		} else if (type == "srows") {
			//selected row;
			_dhxGrid.rowToClipboard();
		} else if (type == "cell") {
			//single cell;
			_dhxGrid.cellToClipboard();
		}
	};
	/**
	 * grid menu add clipboard 현재는 사용안함
	 */
	this.addRowClipboard = function () {
		_dhxGrid.addRowFromClipboard();
	};
	/**
	 * grid row selected clear
	 */
	this.getSelectionClear = function () {
		_dhxGrid.clearSelection();
	};
	/**
	 * grid cell background color 설정
	 * @param {string} _style rgb 값
	 * @example items[gridDivId].setBorderLineStyle("#FFFFFF")
	 */
	this.setBorderLineStyle = function (_style) {
		_dhxGrid.setStyle("", _style, "", "");
	};
	/**
	 * grid dataprocessor url
	 * @return {string} 서버처리 dataprocesor url
	 */
	this.getServiceUrl = function () {
		return serviceUrl;
	};
	/**
	 * grid 서버처리 Activity Service Name
	 * @return {string} 서버처리 dataprocesor url
	 */
	this.getServiceName = function () {
		return serviceName;
	};
	/**
	 * grid row selected row id
	 * @return {int} row selected row id
	 */
	this.getSelectedRowId = function () {
		return _dhxGrid.getSelectedRowId();
	};
	/**
	 * grid parentColumnInfo parameters setting
	 * @param {string} grid selectedRowId 
	 */
	this.parentColumnInfo = function (rowId) {
		var data = [];
		var cnt = _dhxGrid.getColumnsNum();
		for (var i = 0; i < cnt; i++) {
			data[_dhxGrid.getColumnId(i)] = _dhxGrid.cellById(rowId, i).getValue();
		}
		return data;
	};

	/**
	 * grid parentColumnInfo parameters setting
	 * @param {string} grid selectedRowId 
	 */
	this.enableHeaderMenus = function (flag) {
		var data = [];
		var cnt = _dhxGrid.getColumnsNum();
		for (var i = 0; i < cnt; i++) {
			if (flag)
				data.push("true");
			else
				data.push("false");
		}
		_dhxGrid.enableHeaderMenu(data.toString());
	};

	/**
	 * grid cell getCellValue
	 * @param {string} grid row Id 
	 * @param {int} grid cell index
	 * @example items['gridDivId'].getCellValue('xml-result_1',1);
	 */
	this.getCellValue = function (rowId, col_index) {
		return _dhxGrid.cellById(rowId, col_index).getValue();
	};

	/**
	 * grid cell setCellValue
	 * @param {string} grid row Id 
	 * @param {int} grid cell index
	 * @param {string} grid cell value
	 * @example items['gridDivId'].setCellValue('xml-result_1',1,"1");
	 */
	this.setCellValue = function (rowId, col_index, col_value) {
		_dhxGrid.cells(rowId, col_index).setValue(col_value);
	};
	/**
	 * grid cell getCellByIndexValue
	 * @param {int} grid row index 
	 * @param {int} grid cell index
	 * @example items['gridDivId'].getCellByIndexValue(1,0);
	 */
	this.getCellByIndexValue = function (row_index, col_index) {
		return _dhxGrid.cellByIndex(row_index, col_index).getValue();
	};
	/**
	 * grid cell setCellByIndexValue
	 * @param {int} grid row index 
	 * @param {int} grid cell index
	 * @param {string} grid cell value
	 * @example items['gridDivId'].setCellByIndexValue(1,0,'value');
	 */
	this.setCellByIndexValue = function (row_index, col_index, col_value) {
		return _dhxGrid.cellByIndex(row_index, col_index).setValue(col_value);
	};
	/**
	 * child grid getReference div id name 현재사용안함
	 */
	this.getReferenceItem = function () {
		return referenceItem;
	};

	/**
	 * grid column hidden event
	 * @param {string} columnIndex
	 * @exmple items[gridDivId].setColumnHidden("0,1",flag);
	 */
	this.setColumnHiddenFlag = function (columnIndex, flag) {
		var booleanFlag = false;
		if (flag != "") {
			booleanFlag = flag;
		}
		var columnArray = columnIndex.split(',');;
		for (var i = 0; i < columnArray.length; i++) {
			_dhxGrid.setColumnHidden(parseInt(columnArray[i]), booleanFlag);
		}
	};

	/**
	 * grid column hidden event
	 * @param {string} columnIndex
	 * @exmple items[gridDivId].setColumnHidden("0,1");
	 */
	this.setColumnHidden = function (columnIndex) {
		var columnArray = columnIndex.split(',');;
		for (var i = 0; i < columnArray.length; i++) {
			_dhxGrid.setColumnHidden(parseInt(columnArray[i]), true);
		}
	};

	/**
	 * grid all ColumnValue event
	 * @param {string} columnIndex
	 * @exmple items[gridDivId].getAllColumnValue("2");
	 */
	this.getAllColumnValue = function (columnIndex) {
		var rowCount = _dhxGrid.getRowsNum();
		var values = "";
		for (var i = 0; i < rowCount; i++) {
			if (i != 0) {
				values = values + ",";
			}
			values = values + _dhxGrid.cellByIndex(i, columnIndex).getValue();
		}
		return values;
	};

	/**
	 * grid all ColumnNameValue event
	 * @param {string} columnIndex
	 * @exmple items[gridDivId].getAllColumnValue("EMPNO");
	 */
	this.getAllColumnNameValue = function (columnName) {
		var rowCount = _dhxGrid.getRowsNum();
		var columnIndex = _dhxGrid.getColIndexById(columnName);
		var values = "";
		for (var i = 0; i < rowCount; i++) {
			if (i != 0) {
				values = values + ",";
			}
			values = values + _dhxGrid.cellByIndex(i, columnIndex).getValue();
		}
		return values;
	};
	/**
	 * grid clearRows event
	 */
	this.clearRows = function () {
		var columnInfo = _dhxGrid.getUserData("", "column-info");
		_dhxGrid.clearAll();
		_dhxGrid.setUserData("", "column-info", columnInfo);
	};

	/**
	 * grid row selected event handler 등록
	 * @param {function} evHandler 처리 function
	 */
	this.rowSelected = function (evHandler) {
		return _dhxGrid.attachEvent("onRowSelect", evHandler);
	};
	/**
	 * grid row double clicked event handler 등록
	 * @param {function} evHandler 처리 function
	 */
	this.rowDblClicked = function (evHandler) {
		return _dhxGrid.attachEvent("onRowDblClicked", evHandler);
	};
	/**
	 * grid checkbox column type checked rows
	 * @param {int} column index
	 * @return {array} checked rows
	 */
	this.getCheckedRows = function (column_index) {
		return _dhxGrid.getCheckedRows(column_index);
	};
	/*vertical grid cell column id array */
	this.getCellIdColumns = function () {
		var requestColumns = new Array();
		var requestColumnCount = 0;
		_dhxGrid.forEachRow(function (id) {
			var columns = "";
			_dhxGrid.forEachCell(id, function (cellObj, ind) {
				if (typeof (cellObj.getAttribute("id")) != 'undefined') {
					var column = cellObj.getAttribute("id");
					columns += column + ",";
				}
			});
			requestColumns[requestColumnCount++] = (columns != "") ? columns.substring(0, columns.length - 1) : "";
		});
		return requestColumns.join("|");
	};
	/*vertical grid cell ALL column id array */
	this.getCellIdAllColumns = function () {
		var requestColumns = new Array();
		var requestColumnCount = 0;
		_dhxGrid.forEachRow(function (id) {
			var columns = "";
			_dhxGrid.forEachCell(id, function (cellObj, ind) {
				columns += _dhxGrid.getColumnId(ind) + ",";
			});
			requestColumns[requestColumnCount++] = (columns != "") ? columns.substring(0, columns.length - 1) : "";
		});
		return requestColumns.join("|");
	};
	/**
	 * grid checkbox column type uncheck all
	 */
	this.uncheckAll = function () {
		var rowCnt = _dhxGrid.getRowsNum();
		for (var i = 0; i < rowCnt; i++) {
			var rowID = _dhxGrid.getRowId(i);
			this.setUpdated(rowID, false, "");
		}
		_dhxGrid.uncheckAll();
	};
	/**
	 * grid checkbox column type uncheck all
	 */
	this.checkAll = function () {
		var rowCnt = _dhxGrid.getRowsNum();
		for (var i = 0; i < rowCnt; i++) {
			var rowID = _dhxGrid.getRowId(i);
			if (_dhxGrid.cellById(rowID, 0).getValue()) {
				this.setUpdated(rowID, true, "updated");
			}
		}
		_dhxGrid.checkAll();
	};
	/**
	 * grid disable row selected event handler 등록
	 * @param {function} evHandler 처리 function
	 */
	this.onBeforeSelectEvent = function (evHandler) {
		return _dhxGrid.attachEvent("onBeforeSelect", evHandler);
	};
	/**
	 * grid load before event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[gridDivId].onXLEEvent(onXLEEvent)
	 * fuction onXLEEvent(grid_obj,count){}
	 * grid_obj - grid object;
	 */
	this.onXLSEvent = function (evHandler) {
		return _dhxGrid.attachEvent("onXLS", evHandler);
	};

	/**
	 * grid load after event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[gridDivId].onXLEEvent(onXLEEvent)
	 * fuction onXLEEvent(grid_obj,count){}
	 * grid_obj - grid object;
	 * count - count of rows added.
	 */
	this.onXLEEvent = function (evHandler) {
		return _dhxGrid.attachEvent("onXLE", evHandler);
	};

	/**
	 * grid scroll event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[gridDivId].onScrollEvent(onScrollEvent)
	 * fuction onScrollEvent(sLeft,sTop){}
	 * sLeft - scroll left;
	 * sTop - scroll top.
	 */
	this.onScrollEvent = function (evHandler) {
		return _dhxGrid.attachEvent("onScroll", evHandler);
	};
	/**
	 * grid editCell event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[gridDivId].onEditCellEvent(onEditCellEvent)
	 * fuction onEditCellEvent(stage,rId,cInd,nValue,oValue){}
	 * stage - stage of editing (0-before start[can be canceled if returns false],1- the editor is opened,2- the editor is closed);
	 * rId - id of the row;
	 * cInd - index of the cell;
	 * nValue - new value (only for the stage 2)
	 * oValue - old value (only for the stage 2)
	 */
	this.onEditCellEvent = function (evHandler) {
		return _dhxGrid.attachEvent("onEditCell", evHandler);
	};
	this.onKeyPressEvent = function (evHandler) {
		return _dhxGrid.attachEvent("onKeyPress", evHandler);
	};
	/**
	 * grid Drag event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[gridDivId].onDragEvent(onDragEvent)
	 * fuction onDragEvent(sId,tId,sObj,tObj,sInd,tInd){}
	 * sId - id of the source item;
	 * tId - id of the target item;
	 * sObj - source grid object;
	 * tObj - target grid object;
	 * sInd - index of the column from which drag started;
	 * tInd - index of the column in which drop occurs.
	 */
	this.onDragEvent = function (evHandler) {
		return _dhxGrid.attachEvent("onDrag", evHandler);
	};
	/**
	 * grid Drop event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[gridDivId].onDropEvent(onDropEvent)
	 * fuction onDragEvent(sId,tId,dId,sObj,tObj,sCol,tCol){}
	 * sId - id of the source item;
	 * tId - id of the target item;
	 * dId - id of the dropped item (has sense for mercy drag-n-drop);
	 * sObj - source grid object;
	 * tObj - target grid object;
	 * sCol - index of the column from which drag started;
	 * tCol - index of the column in which drop occurs.
	 */
	this.onDropEvent = function (evHandler) {
		return _dhxGrid.attachEvent("onDrop", evHandler);
	};
	/**
	 * grid BeforeDrag event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[gridDivId].onDropEvent(onBeforeDragEvent)
	 * fuction onBeforeDragEvent(id){}
	 * id - id of the dragged row; 
	 */
	this.onBeforeDragEvent = function (evHandler) {
		return _dhxGrid.attachEvent("onBeforeDrag", evHandler);
	};
	/**
	 * grid DragIn event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[gridDivId].onDropEvent(onDragInEvent)
	 * fuction onDragInEvent(dId,tId,sObj,tObj){}
	 * dId - id of the dragged item;
	 * tId - id of the potential drop landing;
	 * sObj - source grid object;
	 * tObj - target grid object.
	 */
	this.onDragInEvent = function (evHandler) {
		return _dhxGrid.attachEvent("onDragIn", evHandler);
	};
	/**
	 * grid DragOut event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[gridDivId].onDropEvent(onDragOutEvent)
	 * fuction onDragOutEvent(dId,tId,sObj,tObj){}
	 * dId - id of the dragged item;
	 * tId - id of the potential drop landing;
	 * sObj - source grid object;
	 * tObj - target grid object.
	 */
	this.onDragOutEvent = function (evHandler) {
		return _dhxGrid.attachEvent("onDragOut", evHandler);
	};
	/**
	 * grid CellChanged event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[gridDivId].onDropEvent(onCellChangedEvent)
	 * fuction onCellChangedEvent(rId,cInd,nValue){}
	 * rId - id or the row
	 * cInd - index of cell;
	 * nValue - new value.
	 */
	this.onCellChangedEvent = function (evHandler) {
		return _dhxGrid.attachEvent("onCellChanged", evHandler);
	};
	/**
	 * grid ColumnHidden event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[gridDivId].onDropEvent(onColumnHiddenEvent)
	 * fuction onColumnHiddenEvent(index,state){}
	 * index - index of columns;
	 * state - {bool} if true - column is hidden, otherwise column is shown.
	 */
	this.onColumnHiddenEvent = function (evHandler) {
		return _dhxGrid.attachEvent("onColumnHidden", evHandler);
	};
	/**
	 * grid onCheckboxEvent event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[gridDivId].onCheckboxEvent(onCheckedbox)
	 * fuction onCheckedbox(row_id,cell_index,state){}
	 * row_id - id or the row
	 * cell_index - index of cell;
	 * state - checked true/false
	 */
	this.onCheckboxEvent = function (evHandler) {
		return _dhxGrid.attachEvent("onCheckbox", evHandler);
	};
	/**
	 * grid onHeaderClickEvent event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[gridDivId].onHeaderClickEvent(onCheckboxHeaderClick)
	 * fuction onCheckboxHeaderClick(row_id,obj){}
	 * row_id - id or the row
	 * obj related javascript event object
	 */
	this.onHeaderClickEvent = function (evHandler) {
		return _dhxGrid.attachEvent("onHeaderClick", evHandler);
	};
	/**
	 * grid groupBy event
	 * @param {int} grid cell index
	 * @param {string} grid groupbyData setting value
	 * @example items['gridDivId'].setGroupBy('0',["#title","#cspan","#cspan","#stat_total","#stat_total",""]);
	 * #title - title - will be used for group-key;
	 * #cspan - organize colspan with a sibling cell (the same as in cspan in header);
	 * #stat_total - calculates total of values for the group;
	 * #stat_max - calculates maximum value in the group;
	 * #stat_min - calculates minimum value in the group;
	 * #stat_average - calculates average value in the group;
	 * #stat_count - calculates count of records in the group.
	 */
	this.setGroupBy = function (col_index, groupbyData) {
		_dhxGrid.groupBy(col_index, groupbyData);
	};
	this.cellCheckAll = function () {
		for (var cInd = 0; cInd < _dhxGrid.getColumnsNum(); cInd++) {
			if (_dhxGrid.getColType(cInd) == "chk")
				this.setCellCheckedRows(cInd, 1);
		}
	};
	this.cellUnCheckAll = function () {
		for (var cInd = 0; cInd < _dhxGrid.getColumnsNum(); cInd++) {
			if (_dhxGrid.getColType(cInd) == "chk")
				this.setCellCheckedRows(cInd, 0);
		}
	};
	this.setCellCheckedRows = function (cInd, v) {
		var that = this;
		_dhxGrid.forEachRowA(function (id) {
			_dhxGrid.cells(id, cInd).setValue(v);
			if (v == 1 && component.actionType !== undefined && component.actionType.toLowerCase() === "save")
				that.setUpdated(id, true, "updated");
			else
				that.setUpdated(id, false, "");
		});
	};

	/**
	 * dhtmlxgridobject 
	 * @return {object} dhtmlxgridobject
	 */
	this.getDhxGrid = function () {
		return _dhxGrid;
	};

	/** grid split option */
	var splitAtIndex = parseInt(component.split);
	if (splitAtIndex !== 0) {
		_dhxGrid.splitAt(splitAtIndex);
	}

	_dhxGrid.attachEvent("onCalendarShow", function (myCal, rId, colInd) {
		var cell = "", pos = "";
		if (this.editor != null) {
			cell = this.editor.cell;
			pos = this.getPosition(cell);
		} else {
			cell = this._fake.editor.cell;
			pos = this.getPosition(cell);
		}
		var height = 0;
		if (this.entBox.clientHeight < pos[1] + 78) {
			height = pos[1] - 195;
		} else {
			height = pos[1];
		}
		var cL = this.getColumnsNum() - 4;
		if (colInd > cL) {
			myCal.setPosition(pos[0] - 188, height);
		} else {
			myCal.setPosition(pos[0] * 1 + this.cell.offsetWidth, height);
		}
	});
};
/**
* Construct ui.dataProcess Object create check.
*/
if (!ui.dataProcess) {
	ui.dataProcess = {};
}
/**
 * @class DHTMLX Grid , form 서버연동을 사용하기 쉽게 Wraper 로 제공되는 Function
 * @constructor
 * @param {object} targetObj 서버연동이 되는 dhtmlx object ( grid ,form ) 중 선택
 * @param {string} actionUrl 서버연동 URL
 * @param {string} serviceName 서버연동 Activity Service Name
 */
ui.dataProcess = function (targetObj, actionUrl, serviceName) {
	/** ui.dataProcess Object */
	_this = this;
	/** dhtmlx dataprocessor create */
	var _dhxdp = new dataProcessor(actionUrl);
	/** dataprocessor 에서 서버연동시 request 로 전달할 type 설정 (현재 column name 으로 전달) */
	_dhxdp.enableDataNames(true);
	/** dataprocessor multi update mode 설정 (한건씩 처리하는게아니라 insert,update,delete 를 동시에 처리) */
	_dhxdp.setUpdateMode("off");
	/** dataprocessor 서버처리 request mode 설정 */
	_dhxdp.setTransactionMode("POST", true);
	/** dataprocessor 서버처리 request encoding 설정 */
	_dhxdp.enableUTFencoding("true");

	/*
	var _dataColumns = gridObj.getUserData("", "column-info");
	
	if(_dataColumns != null && _dataColumns != ""){	
		this.dhxdp.setDataColumns("[" + _dataColumns + "]");
	} */
	/** dhtmlx dataprocessor init */
	_dhxdp.init(targetObj);

	/** dhtmlx dataprocessor data 처리완료 event 등록 */
	_dhxdp.defineAction("appMsg", function (node) { //success dataprocess message event attach
		if (node != null)
			uiCommon.message(ui.messagebox.messageBoxDivId, node.firstChild.data, "appMsg");
		return true;
	});
	/** dhtmlx dataprocessor data 처리실패 event 등록 */
	_dhxdp.defineAction("invalid", function (node) { //error dataprocess message event attach
		_this.clearDataProcess();
		if (node != null) {
			//if(node.getAttribute("message") !== null){
			uiCommon.message(ui.messagebox.messageBoxDivId, node.firstChild.data, "errMsg");
			uiCommon.message(ui.messagebox.messageBoxDivId, "", "appMsg");
			//}
		}
		return true;
	});

	/** dhtmlx dataprocessor dnd update event */
	this.setDndUpdateMode = function (mode) {
		_dhxdp.setUpdateMode("off", mode);
	};

	/** dhtmlx dataprocessor data make update event 
	 * @param	off ,row ,cell
	 * @param	true/false
	 */
	this.setUpdateMode = function (mode, dnd) {
		_dhxdp.setUpdateMode(mode, dnd);
	};
	/**
	 * dhtmlx dataprocessor send
	 * @param {string} arguments[0] processUrl 서버처리 URL
	 * @param {string} arguments[1] serviceName Activity Service Name
	 * @param {string} arguments[2] eventId Activity Service Event Name
	 * @param {string} arguments[3] option custom parameter add
	 */
	this.sendForm = function () {
		if (_dhxdp.updatedRows.length > 0) {
			uiCommon.progressOn(parent);
			if (arguments.length == 4) {
				_dhxdp.serverProcessor = arguments[0] + "?ServiceName=" + items[arguments[1]].getServiceName() + "&" + arguments[2] + "=1&" + arguments[3];
			} else {
				_dhxdp.serverProcessor = arguments[0] + "?ServiceName=" + items[arguments[1]].getServiceName() + "&" + arguments[2] + "=1";
			}
			_dhxdp.sendData();
		}
	};
	/**
	 * dhtmlx dataprocessor send
	 * @param {string} arguments[0] divObjId grid Div id
	 * @param {string} arguments[1] eventId Activity Service Event Name
	 * @param {string} arguments[2] option custom parameter add
	 */
	this.sendGrid = function () {
		if (_dhxdp.updatedRows.length > 0) {
			uiCommon.progressOn(parent);
			if (arguments.length == 3) {
				_dhxdp.serverProcessor = items[arguments[0]].getServiceUrl() + "?ServiceName=" + items[arguments[0]].getServiceName() + "&" + arguments[1] + "=1&column-info=" + items[arguments[0]].getColumnInfo() + "&" + arguments[2];
			} else {
				_dhxdp.serverProcessor = items[arguments[0]].getServiceUrl() + "?ServiceName=" + items[arguments[0]].getServiceName() + "&" + arguments[1] + "=1&column-info=" + items[arguments[0]].getColumnInfo();
			}
			_dhxdp.sendData();
		}
	};
	/**
	 * dhtmlx dataprocessor mode update Event
	 * @exmple items[gridDivId].setUpdated(rowId,"updated","updated");
	 * row id;
	 * row state - {bool} true - updated, false - update mark removed;
	 * mode - {string} updated,deleted,inserted;
	 */
	this.setUpdated = function (rowId, state, mode) {
		_dhxdp.setUpdated(rowId, state, mode);
	};
	/**
	 * dhtmlx dataprocessor 처리 등록 Event Handler
	 * @param {string} status 서버처리 상태코드
	 * @param {function} fnc 서버처리 custom function
	 */
	this.defineAction = function (status, fnc) {
		_dhxdp.defineAction(status, fnc);
	};
	/**
	 * dhtmlx dataprocessor clear Event 
	 */
	this.clearDataProcess = function () {
		_dhxdp._in_progress = {};
		_dhxdp.updatedRows = [];
	};
	/**
	 * grid CellChanged event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[gridDivId].onRowMarkEvent(evHandler)
	 * fuction onRowMarkEvent(rId,cInd,nValue){}
	 * row id;
	 * row state - {bool} true - updated, false - update mark removed;
	 * mode - {string} updated,deleted,inserted;
	 * invalid - {bool} set if row has error or invalid status.
	 */
	this.onRowMarkEvent = function (evHandler) {
		return _dhxdp.attachEvent("onRowMark", evHandler);
	};
	/**
	 * grid onBeforeUpdate event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[gridDivId].onBeforeUpdate(evHandler)
	 * fuction onBeforeUpdate(id,status){}
	 * row id;
	 * row state - {bool} true - updated, false - update mark removed;
	 */
	this.onBeforeUpdateEvent = function (evHandler) {
		_dhxdp.attachEvent("onBeforeUpdate", evHandler);
		return true;
	};
	/**
	 * grid onAfterUpdateFinish event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[gridDivId].onAfterUpdateFinish(evHandler)
	 * fuction onAfterUpdateFinish(id,status){}
	 * row id;
	 * row state - {bool} true - updated, false - update mark removed;
	 */
	this.onAfterUpdateFinishEvent = function (evHandler) {
		_dhxdp.attachEvent("onAfterUpdateFinish", evHandler);
	};

	this.onValidationErrorEvent = function (evHandler) {
		_dhxdp.attachEvent("onValidationError", evHandler);
	};
	/**
	 * dhtmlx dataprocessor object
	 * @return {object} dthmlx dataprocessor object
	 */
	this.getDhxDataProcess = function () {
		return _dhxdp;
	};
};
/**
 * Construct ui.contextmenu Object create check.
 */
if (!ui.contextmenu) {
	ui.contextmenu = {};
}
/**
 * @class DHTMLX menu 을 활용하여 grid contextmenu 로 제공되는 Function
 * @constructor
 * @param {object} gridObj dhtmlxGridObject
 * @return {object} dhtmlxmenuobject
 */
ui.contextmenu = function (dhxGrid) {
	/** dhtmlxmenuobject create */
	var _contextMenu = new dhtmlXMenuObject();
	_contextMenu.setIconsPath(gridContextMenuConfig.iconImgs);
	/** dhtmlxmenuobject rendering contextmenu setting */
	_contextMenu.renderAsContextMenu();
	/** dhtmlxmenuobject xml load */
	_contextMenu.loadXML(gridContextMenuConfig.xml);
	/** static dhtmlxmenuobject 변수 window event 등록처리에 필요 */

	/**
	 * dhtmlxmenu click event 등록
	 * @param {string} dthmlx menu xml item id
	 */
	_contextMenu.attachEvent("onClick", function (id) {
		onGridContextMenuClick(id, dhxGrid, _contextMenu);
	});
	/** dhtmlxmenuobject */
	return _contextMenu;
};

/**
 * Construct ui.menu Object create check.
 */
if (!ui.menu) {
	ui.menu = {};
}
/**
 * @class DHTMLX menu 을 활용하여 grid menu 로 제공되는 Function
 * @constructor
 * @param {int} _index ui.grid 생성 Index
 */
ui.menu = function (cell, component) { // _index
	/** dhtmlx menu create */
	var renderTo = component.renderTo;
	//document.getElementById(renderTo).style.cursor="default";
	var _dhxMenu;
	if (cell == null || typeof (cell) == "string") {
		_dhxMenu = new dhtmlXMenuObject(renderTo);
	}
	else {
		_dhxMenu = cell.attachMenu();
	}

	//	var _dhxMenu = new dhtmlXMenuObject(renderTo);
	//	var _dhxMenu = cell.attachMenu();
	_dhxMenu.setIconsPath(component.iconImgs);
	_dhxMenu.loadXML(component.xml);

	/**
	 * dhtmlxmenu click event 등록
	 * @param {string} dthmlx menu xml item id
	 */
	_dhxMenu.attachEvent("onClick", function (id) {
		uiCommon.menuClickEvent(id, component.referenceItem);
	});
	/**
	 * dhtmlxmenu menu disabled 처리
	 */
	this.itemDisabled = function () {
		_dhxMenu.forEachItem(function (id) {
			if (id != "settings" && _dhxMenu.getItemType(id) != "separator")
				_dhxMenu.setItemDisabled(id);
		});
	};
	/**
	 * dhtmlxmenu menu setBackgroundColor 처리
	 */
	this.setBackgroundColor = function (color) {
		document.getElementById(renderTo).style.backgroundColor = color;
		return true;
	};

	/**
	 * menu onXLEEventHandler event handler 등록
	 * @param {function} evHandler 처리 function
	 * @exmple items[menuDivId].onXLEEvent(onXLEEventHandler)
	 * fuction onXLEEventHandler(){} 
	 */
	this.onXLEEvent = function (onXLEEventHandler) {
		return _dhxMenu.attachEvent("onXLE", onXLEEventHandler);
	};
	/**
	 * dhtmlxmenuobject
	 * @param {object} dhtmlxmenuobject
	 */
	this.getDhxMenu = function () {
		return _dhxMenu;
	};
};
/**
 * Construct ui.window Object create check.
 */
if (!ui.window) {
	ui.window = {};
}
/**
 * @class DHTMLX window 을 사용하기 쉽게 Wraper 로 제공되는 Function 
 * @constructor
 * @param {string} arguments[0] window id
 * @param {string} arguments[1] window title
 * @param {string} arguments[2] window open x축 위치
 * @param {string} arguments[3] window open y축 위치
 * @param {string} arguments[4] window width
 * @param {string} arguments[5] window height
 * @param {string} arguments[6] attach Url
 */
ui.window = function () {
	/** dhtmlx windows create */
	var _dhxWindow = new dhtmlXWindows();
	_dhxWindow.attachViewportTo(document.body);
	_dhxWindow.setImagePath(window.dhx_globalImgPath);
	var createWindow = _dhxWindow.createWindow(arguments[0], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
	createWindow.setText(arguments[1]);
	var uiLayout = createWindow.attachLayout("1C");
	uiLayout.cells("a").hideHeader();
	uiLayout.cells("a").attachURL(arguments[6] || arguments[7]);
	/**
	 * dhtmlxwinodwobject id
	 * @return {object} createWindow id
	 */
	this.getWindowId = function () {
		return createWindow.getId();
	};
	/**
	 * window position center event 
	 * @param {function} window id	 
	 */
	this.setCenter = function () {
		_dhxWindow.window(id).center();
	};
	/**
	 * window close event 
	 * @param {function} window id	 
	 */
	this.winClose = function () {
		_dhxWindow.window(this.getWindowId()).close();
	};
	/**
	 * window setModal event
	 * @exmple windowObject.setModal();
	 */
	this.setModal = function () {
		_dhxWindow.window(this.getWindowId()).setModal(true);
	};
	/**
	 * window progressOn event
	 * @exmple windowObject.progressOn();
	 */
	this.progressOn = function () {
		uiLayout.progressOn();
	};
	/**
	 * window progressOn event
	 * @exmple windowObject.progressOn();
	 */
	this.progressOff = function () {
		uiLayout.progressOff();
	};
	/**
	 * window 입력받은 message를 display해줌
	 * @param {string} message
	 */
	this.setMessage = function (msg) {
		createWindow.attachHTMLString(msg);
	};

	/**
	 * window buttonDisable event
	 * @param {string} button name
	 * @exmple windowObject.setButtonDisable("park,minmax1");
	 */
	this.setButtonDisable = function (id) {
		var buttonArray = id.split(',');
		for (var i = 0; i < buttonArray.length; i++) {
			createWindow.button(buttonArray[i]).disable();
		}
	};

	/**
	 * dhtmlxwinodwobject 
	 * @return {object} dhtmlxwinodwobject
	 */
	this.getDhxWindow = function () {
		return createWindow;
	};

	/**
	 * window open때 입력받은 url를 link
	 */
	//if(arguments[6]){
	//	_dhxWindow.window(this.getWindowId()).attachURL(arguments[6]);
	//}
	/** widow창을 browser body의 center로 이동 */
	_dhxWindow.window(this.getWindowId()).center();
	if (arguments[6])
		_dhxWindow.window(this.getWindowId()).denyResize();
};

/**
 * Construct ui.tabbar Object create check.
 */
if (!ui.tabbar) {
	ui.tabbar = {};
}
/**
 * @class DHTMLX tabbar 을 사용하기 쉽게 Wraper 로 제공되는 Function 
 * @constructor
 * @param {int} _index ui.tabbar 생성 Index
 */
ui.tabbar = function (cell, component) { // _index
	/** dhtmlxtabbar create*/
	//var _dhxTabbar = new dhtmlXTabBar(component.renderTo,"top");
	var _dhxTabbar = cell.attachTabbar();
	/** dhtmlxtabbar skin setting */
	_dhxTabbar.setSkin(component.skin);
	/** dhtmlxtabbar image setting */
	_dhxTabbar.setImagePath(component.iconImgs);
	/** dhtmlxtabbar xml load */
	_dhxTabbar.loadXML(component.xml);

	/**
	 * dhtmlxtabbar xml 에 정의된 url
	 * @param {string} 선택 Tab id
	 * @return {string} 선택 Tab URL
	 */
	this.getContentUrl = function (_activeTabId) {
		return _dhxTabbar._hrefs[_activeTabId];
	};
	/**
	 * dhtmlxtabbar content load
	 * @param {string} 선택 Tab id
	 * @param {string} 선택 Tab URL
	 */
	this.loadUrl = function (_activeTabId, _url) {
		_dhxTabbar.forceLoad(_activeTabId, _url);
	};
	/**
	 * dhtmlxtabbar 선택 Tab id 추출
	 * @return {string} 선택 Tab id
	 */
	this.activeTabId = function () {
		return _dhxTabbar.getActiveTab();
	};
	/**
	 * dhtmlxtabbar 선택 Tab Frame 추출
	 * @return {string} 선택 Tab id
	 */
	this.activeTabFrame = function () {
		var id = _dhxTabbar.getActiveTab();
		return _dhxTabbar.cells(id).getFrame();
	};
	/**
	 * dhtmlxtabbarobject 
	 * @return {object} dhtmlxtabbarobject
	 */
	this.getDhxTabbar = function () {
		return _dhxTabbar;
	};
};


if (!ui.combo) {
	ui.combo = {};
}
/**
 * @class DHTMLX Combo 을 사용하기 쉽게 Wraper 로 제공되는 Function 
 * @constructor
 * @param {Object} dhtmlx combo object
 * @param {String} server url
 * @param {String} parameter
 * @param {Function} after event handler option
 * @example server url xxxxxxx.do or xxxxxx.jsp
 *			 parameter param1=param1-value&param2=param2-value
 */
ui.combo = function () {
	if (isServerMode) {
		if (arguments.length < 1 || arguments.length < 2) {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI Error Message",
				text: "function arguments setting not found<br>" +
					"arguments[0] : dhtmlx combo object<br>" +
					"arguments[1] : server url<br>" +
					"arguments[2] : request parameter<br>" +
					"arguments[3] : after event handler"
			});
		}
		arguments[0].enableOptionAutoPositioning(true);
		if (arguments.length === 3) {
			arguments[0].loadXML(arguments[1] + '?' + arguments[2]);
		} else if (arguments.length === 4) {
			arguments[0].loadXML(arguments[1] + '?' + arguments[2], arguments[3]);
		} else {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI Error Message",
				text: "function arguments setting not found<br>" +
					"arguments[0] : dhtmlx combo object<br>" +
					"arguments[1] : server url<br>" +
					"arguments[2] : request parameter<br>" +
					"arguments[3] : after event handler"
			});
		}
	}
	return true;
};

/**
 * @class DHTMLX master data Combo 을 사용하기 쉽게 Wraper 로 제공되는 Function 
 * @constructor
 * @param {Object} dhtmlx combo object
 * @param {String} master data category
 * @param {String} master data code
 * @param {String} option(totalValue,orderBy,isAscending) code
 * @param {Function} after event handler option
 * @example master category ZS00000 , code FAC_CD
 */
ui.combo.master = function () {
	if (isServerMode) {
		if (arguments.length < 1 || arguments.length < 2 || arguments.length < 3) {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI Error Message",
				text: "function arguments setting not found<br>" +
					"arguments[0] : dhtmlx combo object<br>" +
					"arguments[1] : master category<br>" +
					"arguments[2] : master code<br>" +
					"arguments[3] : option(totalValue,orderBy,isAscending) <br>" +
					"arguments[4] : after event handler"
			});
			return true;
		}
		arguments[0].enableOptionAutoPositioning(true);
		if (arguments.length === 3) {
			arguments[0].loadXML(master_combo_url + '&category=' + arguments[1] + '&code=' + arguments[2]);
		} else if (arguments.length === 4) {
			var _data = [];
			_data.push(master_combo_url + '&category=' + arguments[1] + '&code=' + arguments[2]);
			if (typeof (arguments[3]) !== 'undefined' && typeof (arguments[3]) === "function") {
				return arguments[0].loadXML(_data.join("&"), arguments[3]);
			} else if (typeof (arguments[3]) === "string") {
				var optionArray = arguments[3].split(',');
				for (var _key in optionArray) {
					_data.push(optionArray[_key]);
				}
				return arguments[0].loadXML(_data.join("&"));
			}
		} else if (arguments.length === 5) {
			if (typeof (arguments[3]) !== 'undefined' && typeof (arguments[3]) !== "function") {
				var _data = [];
				_data.push(master_combo_url + '&category=' + arguments[1] + '&code=' + arguments[2]);
				var optionArray = arguments[3].split(',');
				for (var _key in optionArray) {
					_data.push(optionArray[_key]);
				}
				return arguments[0].loadXML(_data.join("&"), arguments[4]);
			}
		} else {
			dhtmlx.alert({
				type: "alert-info",
				title: "UI Error Message",
				text: "function arguments setting not found<br>" +
					"arguments[0] : dhtmlx combo object<br>" +
					"arguments[1] : master category<br>" +
					"arguments[2] : master code<br>" +
					"arguments[3] : option(totalValue,orderBy,isAscending) <br>" +
					"arguments[4] : after event handler"
			});
			return true;
		}
	}
	return true;
};

/**
 * Construct ui.messagebox Object create check.
 */
if (!ui.messagebox) {
	ui.messagebox = {
		/** public mssagebox div object id */
		messageBoxDivId: "messagebox"
	};
}
/**
 * @class 화면 MessageBox style setting
 * @constructor
 * @param {int} _index ui.messagebox 생성 Index
 */
ui.messagebox = function (layout) { // _index 
	/** public mssagebox div object id */
	var pid = (initLayout.programId != null) ? initLayout.programId : programId;
	var sb = layout.attachStatusBar();
	sb.id = "messagebox";
	sb.messageBoxDivId = "messagebox";
	document.getElementById(sb.id).style.cursor = "default";
	document.getElementById(sb.id).style.backgroundImage = "url(" + dhx_globalImgPath + "messagebox.png)";
	document.getElementById(sb.id).style.paddingTop = "5px";
	document.getElementById(sb.id).style.fontFamily = "Verdana";
	document.getElementById(sb.id).style.fontSize = "11px";
	document.getElementById(sb.id).style.border = "solid 1px";
	document.getElementById(sb.id).style.borderColor = "#ffffff #A4BED4 #A4BED4 #A4BED4";
	//document.getElementById(sb.id).innerHTML = "<span style='float:left;position:static'>&nbsp;MESSAGE&nbsp;|&nbsp;</span><span style='float:right;position:static'><input class='statusbar_right' id='statusbar_prgId' readonly='true' value=\""+pid+"\"></input></span>";
	document.getElementById(sb.id).innerHTML = "<span style='float:left;position:static'>&nbsp;MESSAGE&nbsp;|&nbsp;</span><input class='statusbar_right' id='statusbar_prgId' readonly='true' value=\"" + pid + "\"></input>";
};

if (!ui.htmlObj) {
	ui.htmlObj = {};
}

/**
 * @class DHTMLX Form 을 사용하기 쉽게 Wraper 로 제공되는 Function
 * @constructor
 * @param {int} _index ui.form 생성 Index
 */
/*
ui.form = function(_index){
 // rendering form div id
 var renderTo = initConfig[_index].renderTo;
 // form button 과 reference 되는 item
 var referenceItem = initConfig[_index].referenceItem;
 // form rendering 하기 위한 xml path
 var serviceUrl = initConfig[_index].url;
 // form button 에서 처리되는 Activity Service Name
 var serviceName = initConfig[_index].service;
 //* form div background color setting 
 */

ui.htmlObj = function (cell, component) {
	// rendering form div id
	var renderTo = component.renderTo;
	// form button 과 reference 되는 item
	//var referenceItem = component.referenceItem;
	// form rendering 하기 위한 xml path
	//var serviceUrl = component.url;
	// form button 에서 처리되는 Activity Service Name
	//var serviceName = component.service;
	//* form div background color setting 
	//document.getElementById(renderTo).style.backgroundColor="#ebebeb";
	//document.getElementById(renderTo).style.cursor="default";
	// 오른쪽 마우스 방지해제
	// document.getElementById(renderTo).oncontextmenu = function () { return false; }; 
	/** dhtmlxformObject 생성 */

	var _dhxHtmlObj;
	if (cell == null) {
		// _dhxHtmlObj = new dhtmlXForm(renderTo);
		console.log("오브젝트를 추가 할 수 없습니다.")
		return;
	}
	else {
		var _dhxForm = cell.attachObject(renderTo);
	}
}

ui.page = function (cell, component) {
	// rendering form div id
	var page = component.href;

	var _dhxHtmlObj;
	if (cell == null) {
		// _dhxHtmlObj = new dhtmlXForm(renderTo);
		console.log("오브젝트를 추가 할 수 없습니다.")
		return;
	}
	else {
		cell.attachURL(page);
	}
}

/**
 * Construct ui.initializeDHTMLX Object create check.
 */
if (!ui.initializeDHTMLX) {
	ui.initializeDHTMLX = {};
}
/**
 * @class UI Designer 를 통하여 Setting 된 내용을 Dhtmlx component 에 맞게 Rendering 해주는 Function
 * @constructor
 * @exmaple jsp 에서 init 된 ui component 접근하기
 * items[gridObj].getDhxGrid() -> dhtmlx grid object return 
 */
ui.initializeDHTMLX = function () {
	uiCommon = new ui.common();
	initConfig = [];
	
	if($("#layoutObj").length === 0) $("body").attr("id", "layoutObj");
	layoutObj = ui.componentRendering("layoutObj", initLayout, "dhx_skyblue");

	$(document).ready(function(){
		/*
		// Form의 논리적인 크기를 크게 한다.
		// --> 왼쪽에 메뉴를 확장 했을때 메뉴가 넓어지고 작업영역이 좁아짐, 화면깨짐
		//	 Form이 깨지고 스크롤이 생기는것을 방지
		var formList = $("div[id^=dhxFormObj_][class^=dhxlist_obj]");
	
		for (var x = 0; x < formList.length; x++) {
			var objStyle = formList[x].getAttribute('style');
			var temp = objStyle.match("width:[ ]*([0-9]+)%");
			var width = parseInt(temp[1]) + 50;
			formList[x].setAttribute("style", formList[x].getAttribute("style").replace(temp[0], "width: " + width + "%"));
			
			// $(formList[x]).parent().find("div[ida=dhxMainCont]").css({"overflow":"auto"});
			// $(formList[x]).parent().css({"overflow":"auto"});
	
		}
		*/
		// HtmlObj에 대해 자동으로 스크롤 기능을 넣어준다.
		
		Object.keys(items).filter(function(key, index) {
			return (key.indexOf("HtmlObj") != -1);
		}).forEach(function(key, index, array) { 
			$(items[key]).find("div[ida=dhxMainCont]").css({"overflow":"auto"});
			console.log(key + "에 대해 자동 스크롤바 처리");
		});
	});	
	uiCommon.progressOff(parent);
};

if (!ui.tabRendering) {
	ui.tabRendering = {};
}
ui.tab = function (targetComponent, layoutDescription, css) { // parentLayout
	var components = layoutDescription["components"];

	if (css == null) {
		css = "dhx_skyblue";
	}
	var _dhxTabbar = targetComponent.attachTabbar();
	// _dhxTabbar.setHrefMode("ajax-html");
	
	if(typeof(layoutDescription.xml) === "undefined") {
		drawTab(components, layoutDescription.margin, layoutDescription.offset);
	}
	else {
		_dhxTabbar.setHrefMode();
		// 이 경우는 설정을 모두 무시하고 tabbar를 정의한 xml의 설정으로 다시 설정한다.
		$.ajax({
			// url: './header/kr/M173020530tab01/M173020230_Tabbar_1.xml',
			url: layoutDescription.xml,
			dataType: 'xml',
			success: function(response) {
				json = xml2json(response);
//				console.log(json);
//				debugger;
				tabbarJson = json2tabbarJson(json);
				//console.log(tabbarJson);
				
				// jji 무슨 이유인지 모르겠지만 mode가 iframes 인 경우 iframes를 셋팅하면 제대로 랜더링이 안됨
				// iframes는 빼고 설정
				if(tabbarJson.hrefmode != "iframes") 
					_dhxTabbar.setHrefMode(tabbarJson.hrefmode);
				drawTab(tabbarJson.components, tabbarJson.margin, tabbarJson.offset);
						
			}
		});
		_dhxTabbar.attachEvent("onSelect", function(id,last_id){
			var iframe = $(_dhxTabbar.cells(id)).find('iframe');
			if(iframe.length > 0) {
				var child = iframe.get(0).contentWindow;
				if(child) {
					try {
						child.uiCommon.setPrgId();
					} catch(exception) {
						console.log(exception);
					}
				}
			}
			return true;
		});
		
	}
	
	function drawTab(components, margin, offset) {
		var componetIdBase = 'a'.charCodeAt();
		var selected = "a";
		if(margin == null) margin = 5;
		if(offset == null) offset = 5;
		try {
			// dhtmlxtabbar skin setting 
			_dhxTabbar.setSkin(component.skin);
			// dhtmlxtabbar image setting
			_dhxTabbar.setImagePath(component.iconImgs);
		} catch (exception) {
			_dhxTabbar.setSkin("modern");
			_dhxTabbar.setImagePath("./dhtmlx/codebase/imgs/");
		}
		
		_dhxTabbar.setMargin(margin);
		_dhxTabbar.setOffset(offset);
		for (var i = 0; i < components.length; i++) {
			var id;
			if (typeof (components[i].id) !== 'undefined') {
				id = components[i].id;
			} else if(typeof (components[i].renderTo) !== 'undefined') {
				id = components[i].renderTo;
			} else {
				id = String.fromCharCode(componetIdBase + i);
			}

			_dhxTabbar.addTab(id, (typeof (components[i].header) == "undefined") ? "tab " + i : components[i].header
																	, (typeof (components[i].width) == "undefined") ? "150px" : components[i].width + "px"
																	, components[i].position
																	, components[i].row);
			if(components[i].selected == true || components[i].selected == "true") {
				selected = id;
			}
			if (programId == null && (components[i].itemType == 'form' || components[i].itemType == 'grid')) {
				programId = components[0].renderTo.split("_", 1);
			}
			ui.componentRendering(_dhxTabbar.cells(id), components[i], css);
		}
		_dhxTabbar.setTabActive(selected);
		
		// for (var i = 0; i < components.length; i++) {
		//	 if (programId == null && (components[i].itemType == 'form' || components[i].itemType == 'grid')) {
		//		 programId = components[0].renderTo.split("_", 1);
		//	 }
		//	 ui.componentRendering(_dhxTabbar.cells(String.fromCharCode(componetIdBase + i)), components[i], css);
		// }
	}
	
	/**
	 * dhtmlxtabbar xml 에 정의된 url
	 * @param {string} 선택 Tab id
	 * @return {string} 선택 Tab URL
	 */
	 this.getContentUrl = function (_activeTabId) {
		return _dhxTabbar._hrefs[_activeTabId];
	};
	/**
	 * dhtmlxtabbar 선택 Tab Frame 추출
	 * @return {string} 선택 Tab id
	 */	
	this.activeTabFrame = function () {
		var id = _dhxTabbar.getActiveTab();
		return _dhxTabbar.cells(id).getFrame();
	};
	/**
	 * dhtmlxtabbarobject 
	 * @return {object} dhtmlxtabbarobject
	 */
	this.getDhxTabbar = function () {
		return _dhxTabbar;
	};
	this.getDhxLayout = function () {
		return _dhxTabbar;
	};
	
	// return _dhxTabbar;
};



ui.layout = function (targetComponent, layoutDescription, css) { // parentLayout
	var components = layoutDescription.components;
	var layoutPattern;
	var componetIdBase = 'a'.charCodeAt();
	var dhxLayout;
	
	function getLayoutPattern(){
		var componentCnt;
		
		if (layoutDescription.dirType == "row" || layoutDescription.dirType == null || typeof (layoutDescription.dirType) == "undefined") {
			layoutPatternChar = "" + components.length + "E";
	
		}
		else if (layoutDescription.dirType == "col") {
			layoutPatternChar = "" + components.length + "W";
		}
		
		componentCnt = components.length;
		if (componentCnt >= 6) {
			alert("컴포넌트를 6개 이상 배치할 수 없습니다.");
			return false;
		}
		
		if (componentCnt == 0) {
			alert("정의된 컴포넌트가 없습니다.");
			return false;
		}
		if (componentCnt == 1) {
			layoutPatternChar = "1C";
		}
		if (layoutPatternChar == "2W") {
			layoutPatternChar = "2U";
		}
		return layoutPattern;
	}
	
	function createLayoutObject(layoutPatternChar) {
		var obj;
		if (typeof (targetComponent) == "string") {
			obj = new dhtmlXLayoutObject(targetComponent, layoutPatternChar, "dhx_skyblue");
		}
		else {
			obj = targetComponent.attachLayout(layoutPatternChar, css);
		}
		return obj;
	}
	
	this.removeSplitter = function () {
		$(dhxLayout.sepVer).remove();
		$(dhxLayout.sepHor).parent().remove();
		return true;
	}
	
	this.hide = function(cellId) {
		dhxLayout.cells (cellId).hideHeader();
		dhxLayout.cells (cellId).undock(); 
		dhxLayout.dhxWins.window (cellId).hide();
		return true;
	}
	
	this.setCellSize = function(cellId, cellSize)
	{
		var baseSize = 0;
		if(cellSize === 0 || cellSize === "0") {
			return true;
		}
		
		if(layoutDescription.dirType === "row") {
			baseSize = dhxLayout.h;
		}
		else if(layoutDescription.dirType === "col") {
			baseSize = dhxLayout.w;
		}
		else {
			return false;
		}
		
		if (cellSize != null && cellSize != "" && cellSize != "*") {
			var size = 0;
			
			if(typeof(cellSize) === "string" && cellSize.match("%\s*$"))
			{
				var percentSize = cellSize.replace(/[%]/, "");
				
				size = Math.floor(baseSize * parseFloat(percentSize) / 100);
			}
			else{
				size = cellSize;
			}
			
			if(layoutDescription.dirType === "row") {
				baseSize = dhxLayout.h;
				dhxLayout.cells(cellId).setHeight(size);
			}	
			else if(layoutDescription.dirType === "col") {
				baseSize = dhxLayout.w;
				dhxLayout.cells(cellId).setWidth(size);
			}
		}
		
		return true;
	}

	this.setChildSize = function(childSizeString) {
		var childSize = (childSizeString).split(',');
		var baseSize = 0;
		
		for(var i = 0; i < childSize.length; i++) {
			if(childSize[i] === 0 || childSize[i] === "0") {
				this.hide(String.fromCharCode(componetIdBase + i));
			}
		}
		
		for(var i = 0; i < childSize.length; i++) {
		// for(var i = childSize.length - 1; i >= 0 ; i--) {
			this.setCellSize(String.fromCharCode(componetIdBase + i), childSize[i]);
			/*
			if (childSize[i] != null && childSize[i] != "" && childSize[i] != "*") {
				var size = 0;

				if(typeof(childSize[i]) === "string" && childSize[i].match("%\s*$"))
				{
					var percentSize = childSize[i].replace(/[%]/, "");
					
					size = Math.floor(baseSize * parseFloat(percentSize) / 100);
				}
				else{
					size = childSize[i];
				}

				if(layoutDescription.dirType === "row") {
					dhxLayout.cells(String.fromCharCode(componetIdBase + i)).setHeight(size);
				}	
				else if(layoutDescription.dirType === "col") {
					dhxLayout.cells(String.fromCharCode(componetIdBase + i)).setWidth(size);
				}
			}
			*/
		}
		
		return true;
	}
	
	this.getDhxLayout = function () {
		return dhxLayout;
	};
	
	layoutPattern = getLayoutPattern();
	if(layoutPattern == false) return false;
	dhxLayout = createLayoutObject(layoutPatternChar);
	var autoSizes = dhxLayout.listAutoSizes();
	
	if (layoutDescription.messageBox == "true" || layoutDescription.messageBox == true) {
		items["messageBox"] = ui.messagebox(dhxLayout);
	}
	
	if(layoutDescription.childSize) {
		this.setChildSize(layoutDescription.childSize);
	}
	
	if (layoutDescription.splitter === "false" || layoutDescription.splitter === false) {
		this.removeSplitter();
	}
	
	for (var i = 0; i < components.length; i++) {
		if (programId == null && (components[i].itemType == 'form' || components[i].itemType == 'grid')) {
			programId = components[0].renderTo.split("_", 1);
		}
		
		dhLayout.cells(String.fromCharCode(componetIdBase + i)).id = components[i].renderTo;
		
		if (components[i].header != null) {
			var header = components[i].header.replace(/^[*]/, "<img src='./dhtmlx/codebase/imgs/icon_title.gif' align='top'>&nbsp;&nbsp;");
			dhxLayout.cells(String.fromCharCode(componetIdBase + i)).setText(header);
			dhxLayout.cells(String.fromCharCode(componetIdBase + i)).showHeader();
		}
		else {
			dhxLayout.cells(String.fromCharCode(componetIdBase + i)).hideHeader();
		}
		
		if (components[i].arrow == false) {
			dhxLayout.cells(String.fromCharCode(componetIdBase + i)).hideArrow();
		}
		
		if (components[i].height != null && layoutDescription.dirType == "row") {
			this.setCellSize(String.fromCharCode(componetIdBase + i), components[i].height);
			
			// var height = 0;
			// if(typeof(components[i].height) === "string" && components[i].height.match("%\s*$"))
			// {
			// 	var percentHeight = components[i].height.replace(/[%]/, "");
				
			// 	height = Math.floor(dhxLayout.h * parseFloat(percentHeight) / 100);
			// }
			// else{
			// 	height = components[i].height;
			// }
			// dhxLayout.cells(String.fromCharCode(componetIdBase + i)).setHeight(height);
		}
		
		if (components[i].width != null && layoutDescription.dirType == "col") {
			this.setCellSize(String.fromCharCode(componetIdBase + i), components[i].height);
			// var width = 0;
			// if(typeof(components[i].width) === "string" && components[i].width.match("%\s*$"))
			// {
			// 	var percentWidth = components[i].width.replace(/[%]/, "");
				
			// 	width = Math.floor(dhxLayout.w * parseFloat(percentWidth) / 100);
			// }
			// else{
			// 	width = components[i].width;
			// }
			// dhxLayout.cells(String.fromCharCode(componetIdBase + i)).setWidth(width);
		}
		
		if (components[i].fixSize != null) {
			dhxLayout.cells(String.fromCharCode(componetIdBase + i)).fixSize(components[i].fixSize[0], components[i].fixSize[1]);
		}
	}
	
	for (var i = 0; i < components.length; i++) {
		ui.componentRendering(dhxLayout.cells(String.fromCharCode(componetIdBase + i)), components[i]);
		if (components[i].autoScroll == "true" || components[i].autoScroll == true) {
			$(dhxLayout.cells (String.fromCharCode(componetIdBase + i))).find("div[ida=dhxMainCont]").css({"overflow":"auto"});
		} else if(components[i].itemType == "form") {
			var formObj = $(dhxLayout.cells (String.fromCharCode(componetIdBase + i))).find("div[id^=dhxFormObj_][class^=dhxlist_obj]");
			var objStyle = formObj[0].getAttribute("style");
			var temp = objStyle.match("width:[ ]*([0-9]+)%");
			var width = parseInt(temp[1]) + 50;
			
			formObj[0].setAttribute("style", formObj[0].getAttribute("style").replace(temp[0], "width: " + width + "%"));
		}
	}
	
	for (var i = 0; i < components.length; i++) {
		if (components[i].header != null) {
			var header = components[i].header.replace(/^[*]/, "<img src='./dhtmlx/codebase/imgs/icon_title.gif' align='top'>&nbsp;&nbsp;");
			dhxLayout.cells(String.fromCharCode(componetIdBase + i)).setText(header);
			dhxLayout.cells(String.fromCharCode(componetIdBase + i)).showHeader();
			if (components[i].arrow == false)
				dhxLayout.cells(String.fromCharCode(componetIdBase + i)).hideArrow();
		}
		else {
			dhxLayout.cells(String.fromCharCode(componetIdBase + i)).hideHeader();
		}
	}
	if (layoutDescription.absoluteLayout != null) {
		for (var i = 0; i < layoutDescription.absoluteLayout.length; i++) {
			//items[layoutDescription.absoluteLayout[i].renderTo] = new ui.form(null, layoutDescription.absoluteLayout[i]);
			//compatInitConfig(layoutDescription.absoluteLayout[i]);
			ui.componentRendering(null, layoutDescription.absoluteLayout[i]);
		}
	}
	
	dhxLayout.attachEvent("onDblClick", function (id) {
		var componentId = dhxLayout.cells(id).id;
		// alert(componentId + " was DblClicked.");
		
		var componentIndex = -1;
		for (var i = 0; i < initConfig.length; i++) {
			if (initConfig[i].renderTo == componentId && typeof (initConfig[i].adjustColumn) != "undefined") {
				var arr = [];
				if (typeof (initConfig[i].adjustColumn) == "array") {
					arr = initConfig[i].adjustColumn;
				}
				else {
					arr.push(initConfig[i].adjustColumn);
				}
				for (var j = 0; j < arr.length; j++) {
					if (initConfig[i].itemType == "grid") {
						//items[arr[j]].adjustColumn(); // 칼럼크기를 자동으로 맞춰줌... 근데 너무 늦음..
						adjustHeader(initConfig[i].renderTo);
					}
				}
				break;
			}
		}
	});
};

//"layoutObj", initLayout, "dhx_skyblue"
ui.componentRendering = function (layoutContainer, component, css, callback) {
	var obj = null;
	if (typeof (component.itemType) == "undefined") {
		return;
	}
	if (component.itemType == 'layout') {
		var id = "";
		if(typeof(layoutContainer) === "string") {
			id = layoutContainer;
		} else if(component.programId) {
			id = component.programId;
		} else if(component.id) {
			id = component.id;
		} else if(component.renderTo) {
			id = component.renderTo;
		} else {
			id = "layout_" + Math.random();
		}
		
		items[id] = ui.layoutRendering(layoutContainer, component, css);
		obj = items[id].getDhxLayout();
	}
	else if (component.itemType == 'form') {
		items[component.renderTo] = new ui.form(layoutContainer, component, css);
		obj = items[component.renderTo].getDhxForm();
	}
	else if (component.itemType == 'menu') {
		items[component.renderTo] = new ui.menu(layoutContainer, component, css);
		obj = items[component.renderTo].getDhxMenu();
	}

	else if (component.itemType == 'grid') {
		items[component.renderTo] = new ui.grid(layoutContainer, component, css, callback);
		obj = items[component.renderTo].getDhxGrid();
	}
	else if (component.itemType == 'tabbar') {
		items[component.renderTo] = new ui.tabbar(layoutContainer, component, css);
		obj = items[component.renderTo].getDhxTabbar();
	}
	else if (component.itemType == 'htmlObj') {
		items[component.renderTo] = new ui.htmlObj(layoutContainer, component, css);
		items[component.renderTo] = layoutContainer;
	}
	else if (component.itemType == 'page') {
		items[component.renderTo] = new ui.page(layoutContainer, component, css);
		items[component.renderTo] = layoutContainer;
	}
	else if (component.itemType == 'empty') {
		items[component.renderTo] = layoutContainer;
	}
	else if (component.itemType == 'messagebox') {
		items[component.renderTo] = new ui.messagebox(layoutContainer, component, css);
	}
	
	compatInitConfig(component);
	
	if (typeof (component.menu) !== "undefined") {
		var menu = component.menu;
		if(typeof(layoutContainer) === "string" && component.itemType == 'layout') {
			// 제일 바같쪽 layout 이면 위에서 생성된 오브젝트를 인자로 넘긴다.
			items[menu.renderTo] = new ui.menu(obj.getDhxLayout(), menu, css);	
		}
		else {
			items[menu.renderTo] = new ui.menu(layoutContainer, menu, css);
		}
		// 왜 메뉴를 obj변수에 담는지 모르겠음... 생각이 안남, 그래서 주석처리
		// obj = items[menu.renderTo].getDhxMenu();
		compatInitConfig(component.menu);
	}
	return obj;
};

ui.layoutRendering = function(targetComponent, layoutDescription, css) {
	if (layoutDescription.dirType == "tab") {
		return new ui.tab(targetComponent, layoutDescription, css);
	}
	else {
		return new ui.layout(targetComponent, layoutDescription, css);
	}
}

compatInitConfig = function (component) {
	var initElement = {};
	
	for (var attr in component) {
		if (attr != "rows" && attr != "cols" && attr != "components" && attr != "menu") {
			initElement[attr] = component[attr];
		}
	}
	initConfig.push(initElement);
};

var attachEvents = function (obj, eventList) {
	if (obj != null && typeof (eventList) != "undefined") {
		for (var _key in eventList) {
			console.log(_key);
			if (eventList[_key] != null && eventList[_key] != "") {
				//obj.attachEvent(_key, dynamicFuncCall(eventList[_key]));
				obj.attachEvent(_key, eval(eventList[_key]));
				//obj.attachEvent(_key, eval("function() {console.log('hello');alert('hello');}"));
				//obj.attachEvent(_key, function() { alert("b");});
			}
		}
	}
};

var dynamicFuncCall = function (func) {
	try {
		var args = new Array();
		for (var i = 1; i < arguments.length; i++)
			args.push(arguments[i]);
			
		window[func].apply(this, args);
		
	} catch (exception) {
		dhtmlx.alert('지정 함수 실행 오류');
	}
};

var adjustHeader = function (grid) {
	var gridId = grid;
	if (typeof (grid) == "object") gridId = grid.id;
	var objbox = $("#" + gridId).find("div.objbox").find("table.obj.row20px");
	var hbrbox = $("#" + gridId).find('table.hdr');
	
	for (var x = 0; x < objbox.length; x++) {
		var objStyle = objbox[x].getAttribute('style');
		var temp = objStyle.match("width:[ ]*([0-9]+)px");
		if(temp) {
			var width = parseInt(temp[1]) + 20;
			hbrbox[x].setAttribute("style", hbrbox[x].getAttribute("style").replace(temp[0], "width: " + width + "px"));
		}
	}
};

function changeStyleById(style, changeKey, changeVal) {
	$.each(style, function(i, outerItem) {
		var arrOuterItem = $(outerItem).attr("style") ? $(outerItem).attr("style").split(';') : [changeKey + ": " + changeVal + "px"];
		$.each(arrOuterItem, function(j, innerItem) {
			if (innerItem.includes(changeKey))
				arrOuterItem[j] = " " + changeKey + ": " + changeVal + "px";
		});
		$(style[i]).attr("style", arrOuterItem.join(";"));
	});
}

window.onerror = function (msg, url, l) {
	uiCommon.progressOff(parent);
	var message = "Error: " + msg + "\n";
	message += "URL: " + url + "\n";
	message += "Line: " + l + "\n";
	dhtmlx.alert({
		type: "alert-info",
		title: "UI Script Error",
		text: message
	});
	return true;
};

/**
* jQuery plugin to convert a given $.ajax response xml object to json.
*
* @example var json = $.xml2json(response);
https://github.com/sergeyt/jQuery-xml2json/tree/master/src
*/
(function() {
	// default options based on https://github.com/Leonidas-from-XIV/node-xml2js
	var defaultOptions = {
		attrkey: '$',
		charkey: '_',
		normalize: false
	};
	
	// extracted from jquery
	function parseXML(data) {
		var xml, tmp;
		if (!data || typeof data !== "string") {
			return null;
		}
		try {
			if (window.DOMParser) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString(data, "text/xml");
			} else { // IE
				xml = new ActiveXObject("Microsoft.XMLDOM");
				xml.async = "false";
				xml.loadXML(data);
			}
		} catch (e) {
			xml = undefined;
		}
		if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
			throw new Error("Invalid XML: " + data);
		}
		return xml;
	}
	
	function normalize(value, options){
		if (!!options.normalize){
			return (value || '').trim();
		}
		return value;
	}
	
	function xml2jsonImpl(xml, options) {
		var i, result = {}, attrs = {}, node, child, name;
		result[options.attrkey] = attrs;
		
		if (xml.attributes && xml.attributes.length > 0) {
			for (i = 0; i < xml.attributes.length; i++){
				var item = xml.attributes.item(i);
				attrs[item.nodeName] = item.value;
			}
		}
		
		// element content
		if (xml.childElementCount === 0) {
			result[options.charkey] = normalize(xml.textContent, options);
		}
		
		for (i = 0; i < xml.childNodes.length; i++) {
			node = xml.childNodes[i];
			if (node.nodeType === 1) {
				if (node.attributes.length === 0 && node.childElementCount === 0){
					child = normalize(node.textContent, options);
				} else {
					child = xml2jsonImpl(node, options);
				}
				
				name = node.nodeName;
				if (result.hasOwnProperty(name)) {
					// For repeating elements, cast/promote the node to array
					var val = result[name];
					if (!Array.isArray(val)) {
						val = [val];
						result[name] = val;
					}
					val.push(child);
				} else {
					result[name] = child;
				}
			}
		}
		
		return result;
	}
	
	/**
	 * Converts an xml document or string to a JSON object.
	 *
	 * @param xml
	 */
	function xml2json(xml, options) {
		if (!xml) {
			return xml;
		}
		
		options = options || defaultOptions;
		
		if (typeof xml === 'string') {
			xml = parseXML(xml).documentElement;
		}
		
		var root = {};		
		if ( (typeof xml.attributes === 'undefined') || (xml.attributes === null) ) {
			root[xml.nodeName] = xml2jsonImpl(xml, options);
		} else if (xml.attributes.length === 0 && xml.childElementCount === 0){
			root[xml.nodeName] = normalize(xml.textContent, options);
		} else {
			root[xml.nodeName] = xml2jsonImpl(xml, options);
		}
		
		return root;
	}
	
	if (typeof jQuery !== 'undefined') {
		jQuery.extend({xml2json: xml2json});
	} else if (typeof module !== 'undefined') {
		module.exports = xml2json;
	} else if (typeof window !== 'undefined') {
		window.xml2json = xml2json;
	}
})();

// JJI XML을 Json으로 바꾼 결과를 다시 편집한다.
function json2tabbarJson(json) {
	var tabbar = {};
	var tabsTarget = [];
	
	tabbar = json["#document"].tabbar.$;
	var rows = [];
	if(typeof(json["#document"].tabbar.row.length) === "number") { // 배열형 row가 여러개 있을 경우
		rows = json["#document"].tabbar.row;
	}
	else { // 배열이 아니고 바로 오브젝트 인 경우, <row type="row"> 가 하나만 존재 할 경우
		rows[0] = json["#document"].tabbar.row;
	}
	// debugger;
	for(var i = 0; i < rows.length; i ++) {
		var tabs = [];
		if(rows[i].tab.length)
			tabs = rows[i].tab;
		else
			tabs[0] = rows[i].tab;
			
		for(var j = 0; j < tabs.length; j ++) {
			var tab = {};
			tab = tabs[j].$;
			tab["itemType"] = "page";
			tab["row"] = i; // tab의 몇번째 그룹, tab을 여러 층으로 구현 가능함
			tab["header"] = tabs[j]._;
			tab["position"] = j;
			if(typeof(tab["href"]) === "undefined") {
				tab["href"] = tab["id"] + ".jsp";
			}
			tabsTarget.push(tab);
		}
	}
	tabbar["components"] = tabsTarget;
	return tabbar;
}

function getTimeStamp() {
	var d = new Date();
	var s =
		leadingZeros(d.getFullYear(), 4) + '-' +
		leadingZeros(d.getMonth() + 1, 2) + '-' +
		leadingZeros(d.getDate(), 2) + ' ' +
		
		leadingZeros(d.getHours(), 2) + ':' +
		leadingZeros(d.getMinutes(), 2) + ':' +
		leadingZeros(d.getSeconds(), 2);
	return s;
}

function leadingZeros(n, digits) {
	var zero = '';
	n = n.toString();

	if (n.length < digits) {
		for (i = 0; i < digits - n.length; i++)
			zero += '0';
	}
	return zero + n;
}

if(_isIE > 9) { _isIE = false;}
