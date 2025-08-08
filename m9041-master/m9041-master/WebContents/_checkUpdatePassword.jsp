<%@ page contentType="text/xml;charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import = "java.util.*" %>
<%@page import = "com.posdata.glue.context.PosContext" %>
<%@page import = "com.poscoict.glue.dhtmlx.constant.DhtmlxConstantsIF" %> 
<%@page import = "com.posdata.glue.dao.vo.*" %>
<%@page import = "com.posdata.glue.web.control.*" %>
<%@page import="com.posdata.glue.util.log.PosLogFactory" %>
<%@page import = "com.posdata.glue.util.log.PosLog" %>
<%
	PosLog logger = PosLogFactory.getLogger("_checkUpdatePassword.jsp");

	try{
		PosContext ctx = (PosContext)request.getAttribute(PosWebConstants.CONTEXT);
		if (ctx == null) 
		{
			String service = request.getParameter("ServiceName");
			String message = "Context is null, because Service ["+service+"] did not execute or has a problem!";
			logger.logInfo(message);
			out.print("false");
		}

		Object result = ctx.get("xml-result");

		if(result == null){
			logger.logInfo("xml_result is null");
			out.print("false");
		} else {
			PosRowSet resultRow = (PosRowSet)result;
			if(resultRow.hasNext()){
				logger.logInfo("hasNext is ture");
				out.print("true");
			} else {
				logger.logInfo("hasNext is fasle");
				out.print("false");
			}
		}
	} catch (Exception e) {
		logger.logInfo(e.getMessage());
		out.print("false");
		e.printStackTrace();
	}

	out.flush();
%>