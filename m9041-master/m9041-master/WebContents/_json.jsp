<%@ page contentType="text/plain;charset=UTF-8" pageEncoding="UTF-8"%> 
<%@page import = "java.util.*" %> 
<%@page import = "java.sql.Types" %> 
<%@page import = "com.posdata.glue.context.PosContext" %> 
<%@page import = "com.posdata.glue.dao.vo.*" %> 
<%@page import = "com.posdata.glue.web.control.*" %> 
<%@page import = "com.posdata.glue.util.log.PosLog" %>

<%@page import = "com.poscoict.glue.dhtmlx.constant.DhtmlxConstantsIF" %> 
<%@page import = "com.poscoict.glue.biz.dhtmlx.*" %> 
<%@page import = "com.google.gson.Gson" %> 

<%
String columnInfo = null;
String blankRowCntParam = null;
int blankRowCnt = 0;

StringBuffer sb = new StringBuffer();
try
{
    PosContext ctx = (PosContext)request.getAttribute(PosWebConstants.CONTEXT);

    if (ctx == null) {
        String service = request.getParameter("ServiceName");
		String message = "Context is null, because Service ["+service+"] did not execute or has a problem!";     
		throw new Exception(message);
	}
    
    String resultKey = "xml-result";

	PosRowSetImpl rowList = (PosRowSetImpl) ctx.get(resultKey);
	Gson gson = new Gson();
	String result = gson.toJson(rowList);

	sb.append(result);
}catch (Exception e){
	e.printStackTrace();
	sb.append("{\"rows\":[");
	sb.append("\"errMsg\":\"").append(e.getMessage()).append("\"");
	sb.append("}");
	sb.append("]}");
	
	throw e;
}

out.print(sb);
%>