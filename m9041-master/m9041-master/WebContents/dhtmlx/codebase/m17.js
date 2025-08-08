/**
 * @class DHTMLX Grid Cell link Type Custom Function  
 * @constructor
 * @param {object} Grid cell object ( excell name is defined here )
 * @see http://docs.dhtmlx.com/doku.php?id=dhtmlxgrid:toc_custom_excell_creation
 */ 
function eXcell_ahref_idx(cell){       
  /** default pattern, just copy it */
	if (cell){                                                     
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
	}
	this.setValue=function(val){
	  /** get related row id */
		  var row_id=this.cell.parentNode.idd; 
		  var cell_idx = this.cell._cellIndex;	
		  if(val){
			  this.setCValue("<a href='javascript:void(0)' onclick='doLink(\""+val+"\",\""+row_id+"\",\""+cell_idx+"\")' onFocus='blur()'>"+addCommas(val)+"</a>",val);  
		  }else{
			  this.setCValue("&nbsp;");
		  }
		                                        
		},
    this.getValue=function(){
		 return this.cell.childNodes[0].innerHTML; // get value
	};
}
function eXcell_ahref_mo(cell){       
  /** default pattern, just copy it */
	if (cell){                                                     
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
	}
	this.setValue=function(val){
	  /** get related row id */	
		  var row_id=this.cell.parentNode.idd; 
		  var cell_idx = this.cell._cellIndex;	
		  if(val){
			  this.setCValue("<a href='javascript:void(0)' onclick='doLink(\""+val+"\",\""+row_id+"\",\""+cell_idx+"\")'  onFocus='blur()'>"+val+"</a>",val);
		  }else{
			  this.setCValue("&nbsp;");
		  }
		},
    this.getValue=function(){
		 return this.cell.childNodes[0].innerHTML; // get value
	};
}
/** nest all other methods from base class */
eXcell_ahref_idx.prototype = new eXcell;    
eXcell_ahref_mo.prototype = new eXcell;   

var dayOfMonth = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
    
function doNumberCheck(e) {
	//if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;
	var key = _isIE ? e.keyCode:e.which;
	var sKey = String.fromCharCode(key);
	var re = new RegExp("[0-9]");
	if(sKey.match(re) == null){
	    if(_isIE) e.returnValue = false;
	    else{
	    	if(key != 8 && key != 0) e.preventDefault();
	    }
	}
}

function checkDigit(str)  {
	var str = str.toString();
	var ch = '\0';
	var flag = true;
	for (var i = 0, ch = str.charAt(i); (i < str.length) && (flag); ch = str.charAt(++i)) {
		if (ch >= '0' && ch <= '9') flag = true;
		else flag = false;
	}
	return flag;
}

function getDateArray(lsDate, format){
	var tempDate = new String(lsDate);
	var strDate = deleteFormat(tempDate);
	
	var arrDate = new Array();
	if(format == 'YYYYMM'){
		arrDate[0] = parseInt(strDate.substring(0,4),10);
		arrDate[1] = parseInt(strDate.substring(4,6),10);
	}else if(format == 'MMYYYY'){
		arrDate[0] = parseInt(strDate.substring(2,6),10);
		arrDate[1] = parseInt(strDate.substring(0,2),10);
	}else if(format == 'YYYYMMDD'){
		arrDate[0] = parseInt(strDate.substring(0,4),10);
		arrDate[1] = parseInt(strDate.substring(4,6),10);
		arrDate[2] = parseInt(strDate.substring(6,8),10);		
	}else if(format == 'DDMMYYYY'){
		arrDate[0] = parseInt(strDate.substring(4,8),10);
		arrDate[1] = parseInt(strDate.substring(2,4),10);
		arrDate[2] = parseInt(strDate.substring(0,2),10);	
	}else if(format == 'YYYYMMDDHHMM'){
		arrDate[0] = parseInt(strDate.substring(0,4),10);
		arrDate[1] = parseInt(strDate.substring(4,6),10);
		arrDate[2] = parseInt(strDate.substring(6,8),10);		
		arrDate[3] = parseInt(strDate.substring(8,10),10);
		arrDate[4] = parseInt(strDate.substring(10,12),10);
	}else if(format == 'YYYYMMDDHHMMSS'){
		arrDate[0] = parseInt(strDate.substring(0,4),10);
		arrDate[1] = parseInt(strDate.substring(4,6),10);
		arrDate[2] = parseInt(strDate.substring(6,8),10);		
		arrDate[3] = parseInt(strDate.substring(8,10),10);
		arrDate[4] = parseInt(strDate.substring(10,12),10);
		arrDate[5] = parseInt(strDate.substring(12,14),10);
	}else if(format == 'DDMMYYYYHHMMSS'){
		arrDate[0] = parseInt(strDate.substring(4,8),10);
		arrDate[1] = parseInt(strDate.substring(2,4),10);
		arrDate[2] = parseInt(strDate.substring(0,2),10);	
		arrDate[3] = parseInt(strDate.substring(8,10),10);
		arrDate[4] = parseInt(strDate.substring(10,12),10);
		arrDate[5] = parseInt(strDate.substring(12,14),10);
	}else{
		return null;
	}
	return arrDate;
}
function getDateTimeArray(lsDate, format){
	var tempDate = new String(lsDate);
	var strDate = deleteFormat(tempDate);
	
	var arrDate = new Array();
	if(format == 'YYYYMMDDHHMM'){
		arrDate[0] = strDate.substring(0,4);
		arrDate[1] = strDate.substring(4,6);
		arrDate[2] = strDate.substring(6,8);		
		arrDate[3] = strDate.substring(8,10);
		arrDate[4] = strDate.substring(10,12);
	}else if(format == 'YYYYMMDDHHMMSS'){
		arrDate[0] = strDate.substring(0,4);
		arrDate[1] = strDate.substring(4,6);
		arrDate[2] = strDate.substring(6,8);		
		arrDate[3] = strDate.substring(8,10);
		arrDate[4] = strDate.substring(10,12);
		arrDate[5] = strDate.substring(12,14);
	}else{
		return null;
	}
	return arrDate;
}
function checkValidDate(lsDate, format) {
	if(format == null || format == undefined) format = 'YYYYMMDD';
	var t_date = getDateArray(lsDate, format);
	if(t_date == null){
		alert('날자형식이 맞는지 확인하세요.');
		return false;
	}
	
	var t_year  = t_date[0];
	var t_month = t_date[1];
	var t_day   = t_date[2];
	
	if(!checkDigit(t_year) || !checkDigit(t_month) || !checkDigit(t_day)) {
		alert('날짜는 숫자만 가능합니다.');
		return false;
	}
	
	if (t_year < 1900 || t_year >2100) {
		alert('날짜가 틀렸습니다. 년도는 1900년에서 2100년까지 입니다.');
		return false;
	}
	
	if (t_month <1 || t_month > 12) {
		alert('날짜가 틀렸습니다. 달은 1월에서 12월까지 입니다.');
		return false;
	}
	
	if (t_day <1 || t_day > getLastday(t_year, t_month)) {
		alert('날짜가 틀렸습니다.'+t_month+'월에는 '+t_day+'일이 없습니다.');
		return false;
	}
	return true;
}

function getLastday(calyear,calmonth) {
	if (((calyear % 4 == 0) && (calyear % 100 != 0))||(calyear % 400 == 0)) dayOfMonth[1] = 29;
	
	var nDays = dayOfMonth[calmonth-1];
	return nDays;
}

function getLastDate(date,sep) {
	var calyear = date.getFullYear();
	var calmonth = date.getMonth()+1;
	if (((calyear % 4 == 0) && (calyear % 100 != 0))||(calyear % 400 == 0)) dayOfMonth[1] = 29;
		var nDays = dayOfMonth[calmonth-1];
	if(calmonth.toString().length == 1) calmonth = "0" + calmonth;
	
	return ""+calyear+sep+calmonth+sep+nDays;
}

function getFirstDate(date,sep) {
	var calyear = date.getFullYear();
	var calmonth = date.getMonth()+1; 
	
	return ""+calyear+sep+calmonth+sep+"01";
}

function checkValidTime(lsDate, format) {
	if(format == null || format == undefined) format = 'YYYYMMDDHHMMSS';
	var t_date = getDateArray(lsDate, format);
	if(t_date == null){
		alert('날자형식이 맞는지 확인하세요.');
		return false;
	}

	var t_year  = t_date[0];
	var t_month = t_date[1];
	var t_day   = t_date[2];
	var t_hour  = t_date[3];
	var t_min   = t_date[4];
	var t_second = t_date[5];
	
	if(!checkDigit(t_year) || !checkDigit(t_month) || !checkDigit(t_day) || !checkDigit(t_hour) || !checkDigit(t_min) || !checkDigit(t_second)) {
		alert('날짜는 숫자만 가능합니다.');
		return false;
	}
	
	if (t_year < 1900 || t_year > 2100) {
		alert('날짜가 틀렸습니다. 년도는 1900년에서 2100년까지 입니다.');
		return false;
	}
	
	if (t_month < 1 || t_month > 12) {
		alert('날짜가 틀렸습니다. 달은 1월에서 12월까지 입니다.');
		return false;
	}
	
	if (t_day < 1 || t_day > getLastday(t_year, t_month)) {
		alert('날짜가 틀렸습니다.'+t_month+'월에는 '+t_day+'일이 없습니다.');
		return false;
	}
	
	if (t_hour < 0 || t_hour > 24 ) {
		alert('날짜가 틀렸습니다. 시간은 0시부터 24시까지 입니다.');
		return false;
	}
	
	if (t_min < 0 || t_min > 60 ) {
		alert('날짜가 틀렸습니다. 분은 0분부터 60분까지 입니다.');
		return false;
	}
	
	if (t_second < 0 || t_second > 60 ) {
		alert('날짜가 틀렸습니다. 초는 0초부터 60초까지 입니다.');
		return false;
	}
	return true;
}

function checkValidYearMonth(lsDate, format) {
	if(format == null || format == undefined) format = 'YYYYMM';
	var t_date = getDateArray(lsDate, format);
	if(t_date == null){
		alert('날자형식이 맞는지 확인하세요.');
		return false;
	}

	var t_year  = t_date[0];
	var t_month = t_date[1];
	
	if(!checkDigit(t_year) || !checkDigit(t_month)) {
		alert('날짜는 숫자만 가능합니다.');
		return false;
	}
	
	if (t_year < 1900 || t_year >2100) {
		alert('날짜가 틀렸습니다. 년도는 1900년에서 2100년까지 입니다.');
		return false;
	}
	
	if (t_month <1 || t_month > 12) {
		alert('날짜가 틀렸습니다. 달은 1월에서 12월까지 입니다.');
		return false;
	}
	
	return true;
}

function getCurrentDate(sep,format) {
	var today = new Date();
	var t_year = today.getFullYear();
	var t_mon  = today.getMonth()+1;
	var t_day  = today.getDate();
	
	if(t_mon.toString().length == 1) t_mon = "0" + t_mon;
	if(t_day.toString().length == 1) t_day = "0" + t_day;
	
	if(format == null || format == undefined || format == 'YYYYMMDD'){
    	return ""+t_year+sep+t_mon+sep+t_day;
    }else if(format == 'DDMMYYYY'){
    	return ""+t_day+sep+t_mon+sep+t_year;
    }else if(format == 'YYYY'){
    	return ""+t_year;
    }else if(format == 'YYYYMM'){
    	return ""+t_year+sep+t_mon+sep+"01";
    }
}
function getCurrentDateAdd(sep,format,addDay) { 
	var today = new Date();
	today.setDate(today.getDate()+(addDay));
	var t_year = today.getFullYear();
	var t_mon  = today.getMonth()+1;
	var t_day  = today.getDate();
	
	if(t_mon.toString().length == 1) t_mon = "0" + t_mon;
	if(t_day.toString().length == 1) t_day = "0" + t_day;
	
	if(format == null || format == undefined || format == 'YYYYMMDD'){
    	return ""+t_year+sep+t_mon+sep+t_day;
    }else if(format == 'DDMMYYYY'){
    	return ""+t_day+sep+t_mon+sep+t_year;
    }else if(format == 'YYYY'){
    	return ""+t_year;
    }else if(format == 'YYYYMM'){
    	return ""+t_year+sep+t_mon+sep+"01";
    }
}

function getCurrentLastDate(sep) {
	var today = new Date();
	var calyear = today.getFullYear();
	var calmonth = today.getMonth()+1;
	if (((calyear % 4 == 0) && (calyear % 100 != 0))||(calyear % 400 == 0)) dayOfMonth[1] = 29;
		var nDays = dayOfMonth[calmonth-1];
	if(calmonth.toString().length == 1) calmonth = "0" + calmonth;
	return ""+calyear+sep+calmonth+sep+nDays;
}

function getCurrentTime(sep, format) {
	var today = new Date();
	var t_year = today.getFullYear();
	var t_mon  = today.getMonth()+1;
	var t_day  = today.getDate();
	var t_hour = today.getHours();
	var t_min  = today.getMinutes();
	var t_sec  = today.getSeconds();
	
	
	if(t_mon.toString().length == 1)  t_mon = "0" + t_mon;
	if(t_day.toString().length == 1)  t_day = "0" + t_day;
	if((""+t_hour).toString().length == 1) t_hour = "0" + t_hour;
	if((""+t_min).toString().length == 1)  t_min = "0" + t_min;
	if((""+t_sec).toString().length == 1)  t_sec = "0" + t_sec;
	
	if(format == null || format == undefined || format == 'YYYYMMDD'){
    	return ""+t_year+sep+t_mon+sep+t_day+" "+t_hour+":"+t_min+":"+t_sec;
    }else if(format == 'DDMMYYYY'){
    	return ""+t_day+sep+t_mon+sep+t_year+" "+t_hour+":"+t_min+":"+t_sec;
    }
}

function isCompareDate(preDate,nextDate, format) {
	if(format == null || format == undefined) format = 'YYYYMMDD';
		
	if(checkValidDate(preDate, format) !== checkValidDate(nextDate, format)) return false;
	
	var pre_date = getDateArray(preDate, format);
	var next_date = getDateArray(nextDate, format);
	
	preDate = pre_date[0]+""+LPad(pre_date[1],2,"0")+""+LPad(pre_date[2],2,"0");
	nextDate = next_date[0]+""+LPad(next_date[1],2,"0")+""+LPad(next_date[2],2,"0"); 
	
	if (eval(preDate) > eval(nextDate)) {
		 alert("[From 일자]~[To 일자] 보다 미래일자 입니다.");
		return false;
	}
	return true;
}
//dateTimecheck
function isCompareDateTime(preDate,nextDate, format) {
	if(format == null || format == undefined) format = 'YYYYMMDD';

	if(checkValidTime(preDate, format) !== checkValidTime(nextDate, format)) return false;

	var pre_date = getDateTimeArray(preDate, format);
	var next_date = getDateTimeArray(nextDate, format);

  if (eval(pre_date.join("")) > eval(next_date.join(""))){
    alert("[From 일시]~[To 일시] 보다 미래일시 입니다.");
    return false;
  }  

	return true;
}
function deleteFormat(str){
	return str.replace(/(\$|\ |\/|\^|\*|\(|\)|\+|\.|\?|\\|\{|\}|\||\[|\]|-|:)/g,"");
} 

function LPad(str, totalLen, strReplace){ 
	var strVal = "";
	var dffLen = totalLen - (str.toString().length);
	for(var  i=0; i< dffLen;i++){
		strVal += strReplace ;
	} 
	return strVal + str;
}
function RPad(str, totalLen, strReplace){ 
	var strVal = ""; 
	var dffLen = totalLen - (str.toString().length);
	for(var  i=0; i< dffLen;i++){
		strVal += strReplace ;
	}
	return str + strVal;
}
function M17FormParameter(_data,dhxFormObj){	
	var _formdata = dhxFormObj.getFormData();     
	  /** dhtmlx item type 에 대한 key,value 추출 calendar는 data를 추출하는 방법이 다름 */
      for (var _key in _formdata){	
       var _itemtype = dhxFormObj.getItemType(_key);
         if(_itemtype == 'radio'){ 
        	 var _radioItem = dhxFormObj.getCheckedValue(_key);
         	_data.push(_key+"="+encodeURIComponent(_radioItem)); 
         }else if(_itemtype == 'calendar'){			 
			 if(dhxFormObj.getInput(_key).value !== ""){
				 var _dhxCalendar = dhxFormObj.getCalendar(_key);	
	            _data.push(_key+"="+encodeURIComponent(dhxFormObj.getInput(_key).value));				
				delete _dhxCalendar; 
			 }			 
         }else if(_itemtype != 'label'){
              var _itemValue = (typeof(_formdata[_key]) == 'undefined')?"":_formdata[_key]; 
              _data.push(_key+"="+encodeURIComponent((_itemValue === null)?"":_itemValue));
         }   
	  }
}
function m17CustomParameter(){
     /** dhtmlx form item data */
      var _formdata = arguments[0].getFormData();
    
      /** parameter array */
      var _data = [];
      /** activity serviceName push */
      _data.push(arguments[1]+"?ServiceName="+arguments[2]);
      /** activity event push */
      _data.push(arguments[3]+"=1");
      /** dhtmlx item type 에 대한 key,value 추출 calendar는 data를 추출하는 방법이 다름 */
      M17FormParameter(_data,arguments[0]);	
      /** item 에 대한 rendering 을 하기위한 정보 */
      _data.push("column-info="+arguments[4].getUserData("", "column-info"));
 	    _data.push("blank-row-count="+arguments[5]);
       return _data.join("&");
   }
function m17CustomParameter2(){
    /** dhtmlx grid item data */
     var params = items[arguments[0]].parentColumnInfo(items[arguments[0]].getSelectedRowId());
   
     /** parameter array */
     var _data = [];
     /** activity serviceName push */
     _data.push(arguments[1]+"?ServiceName="+arguments[2]);
     /** activity event push */
     _data.push(arguments[3]+"=1"); 
     /** merge */
     _data.push(arguments[6]); 
     /** dhtmlx item type 에 대한 key,value 추출 calendar는 data를 추출하는 방법이 다름 */
     for(var _key in params){
        _data.push(_key+"="+encodeURIComponent(params[_key])); 
     }
     /** item 에 대한 rendering 을 하기위한 정보 */
     _data.push("column-info="+arguments[4].getUserData("", "column-info"));
	    _data.push("blank-row-count="+arguments[5]);
      return _data.join("&");
  }
function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

var tooltip=function(){
	var id = 'tt';
	var top = 3;
	var left = 3;
	var maxw = 300;
	var speed = 10;
	var timer = 20;
	var endalpha = 95;
	var alpha = 0;
	var tt,t,c,b,h;
	var ie = document.all ? true : false;
	return{
		show:function(v,w){
			if(tt == null){
				tt = document.createElement('div');
				tt.setAttribute('id',id);
				t = document.createElement('div');
				t.setAttribute('id',id + 'top');
				c = document.createElement('div');
				c.setAttribute('id',id + 'cont');
				b = document.createElement('div');
				b.setAttribute('id',id + 'bot');
				tt.appendChild(t);
				tt.appendChild(c);
				tt.appendChild(b);
				document.body.appendChild(tt);
				tt.style.opacity = 0;
				tt.style.filter = 'alpha(opacity=0)';
				document.onmousemove = this.pos;
			}
			tt.style.display = 'block';
			c.innerHTML = v;
			tt.style.width = w ? w + 'px' : 'auto';
			if(!w && ie){
				t.style.display = 'none';
				b.style.display = 'none';
				tt.style.width = tt.offsetWidth;
				t.style.display = 'block';
				b.style.display = 'block';
			}
			if(tt.offsetWidth > maxw){tt.style.width = maxw + 'px'}
			h = parseInt(tt.offsetHeight) + top;
			clearInterval(tt.timer);
			tt.timer = setInterval(function(){tooltip.fade(1)},timer);
		},
		pos:function(e){
			var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
			var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
			tt.style.top = (u - h) + 'px';
			tt.style.left = (l + left) + 'px';
		},
		fade:function(d){
			var a = alpha;
			if((a != endalpha && d == 1) || (a != 0 && d == -1)){
				var i = speed;
				if(endalpha - a < speed && d == 1){
					i = endalpha - a;
				}else if(alpha < speed && d == -1){
					i = a;
				}
				alpha = a + (i * d);
				tt.style.opacity = alpha * .01;
				tt.style.filter = 'alpha(opacity=' + alpha + ')';
			}else{
				clearInterval(tt.timer);
				if(d == -1){tt.style.display = 'none'}
			}
		},
		hide:function(){
			clearInterval(tt.timer);
			tt.timer = setInterval(function(){tooltip.fade(-1)},timer);
		}
	};
}();
function str_custom(a,b,order){    // the name of the function must be > than 5 chars
	//a next cell value,prev cell value
	//a 값을 체크 하여 널이면 asc 이면 뒤로 나오게 하기위해 높은 문자를
	//a 값을 체크 하여 널이면 desc 이면 뒤로 나오게 하기위해 낮은 문자를
	    if (order=="asc"){
	        var ac = (a === '')?"ZZZZZ11111":a;
	        if(ac.toLowerCase()==b.toLowerCase()){
	          return 1;
	        }else if(ac.toLowerCase()>b.toLowerCase()){
	          return 1; 
	        }else{
	          return -1;
	        }    
	    }else{
	        var ac = (a === '')?"-9999999999999":a;
	        if(ac.toLowerCase()==b.toLowerCase()){
	          return 1;
	        }else if(ac.toLowerCase()>b.toLowerCase()){
	          return -1; 
	        }else{
	          return 1;
	        }    
	    }       
	}
function int_custom(a,b,order){    // the name of the function must be > than 5 chars
	//a next cell value,prev cell value
	//a 값을 체크 하여 널이면 asc 이면 뒤로 나오게 하기위해 높은 문자를
	//a 값을 체크 하여 널이면 desc 이면 뒤로 나오게 하기위해 낮은 문자를
	    if (order=="asc"){
	        var ac = (a === '')?"9999999999":a;
	         if(ac==b){
	          return 1;
	        }else if(ac>b){
	          return 1; 
	        }else{
	          return -1;
	        }    
	    }else{
	        var ac = (a === '')?"-9999999999999":a;
	       if(ac==b){
	          return 1;
	        }else if(ac>b){
	          return -1; 
	        }else{
	          return 1;
	        }    
	    }       
}
function selfFormSearchParameter(){

    if(arguments.length < 1 || arguments.length < 2 || arguments.length < 3){
      dhtmlx.alert("function arguments setting not found<br>"+
            "arguments[0] : form div object id<br>"+
            "arguments[1] : target form div object<br>"+
            "arguments[2] : service url<br>"+
            "arguments[3] : event  <br>"+
            "arguments[4] : custom parameters array");
      return true;
    }  
     var _data = [];
     _data.push(arguments[2]+"?ServiceName="+items[arguments[0]].getServiceName());
     _data.push(arguments[3]+"=1");
     uiCommon.formParameter(_data,items[arguments[0]].getDhxForm());	
     var _formdata1 = items[arguments[1]].getDhxForm().getFormData();
     var _formParam =[];
     for (var _key in _formdata1){	
          if(_key !== 'messageBox')
          _formParam.push(_key);
     }
     _data.push("column-info="+_formParam);

     var customParams = (typeof(arguments[4]) == "object")?arguments[4]:null;
     
     for(var _key in customParams){
        _data.push(_key+"="+encodeURIComponent(customParams[_key])); 
     }  
     return _data.join("&");
}
function initializeM47DHTMLX(){
  try{
     if(initConfig.length){
			 for(var i = 0,n = initConfig.length; i < n; i++){
				/** form init */
				if(initConfig[i].itemType == 'form'){
				 	items[initConfig[i].renderTo] = new m47Form(i);   
				}
				/** grid init */
				if(initConfig[i].itemType == 'grid'){						
					items[initConfig[i].renderTo] = new m47Grid(i);
				}
	 		}
		}
 	 }catch(e){alert(e);}
}
var m47Form = function (idx){
  var xmlUrl = "_getCrossDomainGridHeaderXml.jsp?xml="+initConfig[idx].xml+"&chain=M47"; 
  var _dhxForm = new dhtmlXForm(initConfig[idx].renderTo);
  /** dhtmlxformObject rendering xml load */
  _dhxForm.loadStruct(xmlUrl);
  
  this.getDhxForm = function(){
    return _dhxForm;
  };    
}
var m47Grid = function (idx){
  var xmlUrl = "_getCrossDomainGridHeaderXml.jsp?xml="+initConfig[idx].xml+"&chain=M47";
  var _dhxGrid =  new dhtmlXGridObject(initConfig[idx].renderTo);
  _dhxGrid.setUserData("","blank-row-count",initConfig[idx].rowCnt);
  _dhxGrid.init();
  _dhxGrid.loadXML(xmlUrl);	
 if(initConfig[idx].borderline === "true"){	  
     _dhxGrid.setStyle("","border:1px solid; border-color : #FFFFFF #DFDFDF #DFDFDF #FFFFFF;","","");
 }
 this.setColumnHidden = function(columnIndex){
	  var columnArray = columnIndex.split(',');;
	  for(var i=0; i<columnArray.length; i++){
		  _dhxGrid.setColumnHidden(parseInt(columnArray[i]),true);
	  }
  },
 this.getDhxGrid = function(){
	  return _dhxGrid;  
  }; 		
}
function parameters(){

      /** parameter array */
      var _data = [];
      _data.push("targetUrl="+initConfig[0].url);
      _data.push("chain=M47");
      /** activity serviceName push */
      _data.push("serviceName="+initConfig[0].service);
      /** activity event push */
      _data.push("event="+initConfig[0].event);
      /** dhtmlx item type 에 대한 key,value 추출 calendar는 data를 추출하는 방법이 다름 */
      _data.push("column-info="+dhxGrid1.getUserData("", "column-info"));
	    _data.push("blank-row-count="+initConfig[0].rowCnt);
      /** 추가 parameter 를 설정하기 */
      _data.push("COIL_ID="+parent.uiForm1.getItemValue("COIL_ID"));
      _data.push("PROC_CD="+parent.uiForm1.getItemValue("PROC_CD"));
      _data.push("PAS_PROC_SEQ="+parent.uiForm1.getItemValue("PAS_PROC_SEQ"));
      _data.push("WK_LOC_TP=A");
      
      return _data.join("&");
}
function ajaxLoadData(serviceUrl,parameters){
     var xmlObj = null;
     var loader = dhtmlxAjax.postSync(serviceUrl,parameters);
     if(loader.xmlDoc.responseXML !=null){
            /*server response xml data */
        xmlObj = loader.xmlDoc.responseXML;
     }			
    return xmlObj;
}  
function renderToGrid(gridDivId,xml){
   	var gridObj = items[gridDivId].getDhxGrid();
   	var rowCount = gridObj.getRowsNum();
    var cellCount = gridObj.getColumnsNum();
    var cells = xml.getElementsByTagName("cell");
     
    if(cells.length != 0){
      gridObj.forEachRow(function(id){
          gridObj.forEachCell(id,function(cellObj,ind){
              if(typeof(cellObj.getAttribute("id")) != 'undefined'){
               for(var i=0; i<cells.length;i++){
                if(cellObj.getAttribute("id") === cells.item(i).attributes[0].nodeValue){
                  var cellValue = cells.item(i).firstChild?cells.item(i).firstChild.nodeValue:"";
  			        cellObj.setValue(cellValue);
  			        } 
               }
              }	     	     
          });
      });
	 }else{
	    gridObj.forEachRow(function(id){
          gridObj.forEachCell(id,function(cellObj,ind){
              if(typeof(cellObj.getAttribute("id")) != 'undefined'){
                cellObj.setValue("");
               }	     	     
          });
      });
	 }
 }
function ajaxLoadText(serviceUrl,parameters){
     var rsText = null;
     var loader = dhtmlxAjax.postSync(serviceUrl,parameters);
     if(loader.xmlDoc.responseText !=null){
            /*server response xml data */
        rsText = loader.xmlDoc.responseText;
     }			
    return rsText;
} 
/**
 * xml 파일을 로드한다. 1
 * @param serviceUrl
 * @param parameters
 * @returns
 */
function m17_ajaxLoadData(serviceUrl, parameters){
     var xmlObj = null;
     var xmlStr = null;
     var loader = dhtmlxAjax.postSync(serviceUrl,parameters);
     if(loader.xmlDoc.responseText !=null){
            /*server response xml data */
        xmlStr = loader.xmlDoc.responseText;
      	xmlObj = m17_loadStringFromXml(xmlStr);
     }
    return xmlObj;
}
/**
 * xml 파일을 로드한다. 2
 */
function m17_loadStringFromXml(xmlString){
    var xmlDocument;
    var xmlParser;
    if(window.ActiveXObject){   //IE
       xmlDocument = new ActiveXObject('Microsoft.XMLDOM');
       xmlDocument.async = false;
       xmlDocument.loadXML(xmlString);
    } else if (window.XMLHttpRequest) {   //Firefox, Netscape
       xmlParser = new DOMParser();
       xmlDocument = xmlParser.parseFromString(xmlString, 'text/xml');
    } else {
       return null;
    }
  return xmlDocument;
}
function getServerToDay(format){
 var param =  "format="+format;
 var toDay = ajaxLoadText("_getCurrentDate.jsp",param); 
 return toDay;
}  
function Request(valuename) 
{
   var rtnval;
   var nowAddress = unescape(location.href);
   var parameters = new Array();
   parameters = (nowAddress.slice(nowAddress.indexOf("?")+1,nowAddress.length)).split("&");
   for(var i = 0 ; i < parameters.length ; i++){

       if(parameters[i].indexOf(valuename) != -1){
           rtnval = parameters[i].split("=")[1];
           if(rtnval == undefined || rtnval == null){
               rtnval = "";
           }
          return rtnval;
        }
    }
}