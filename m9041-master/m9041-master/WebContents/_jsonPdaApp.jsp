<%@ page language="java" contentType="text/plain; charset=UTF-8" pageEncoding="UTF-8"%> 
<%@ page import="java.util.*"%> 

<%@ page import="com.posdata.glue.context.PosContext"%> 
<%@ page import="com.posdata.glue.util.log.PosLog"%>
<%@ page import="com.posdata.glue.util.log.PosLogFactory"%>
<%@ page import="com.posdata.glue.dao.vo.PosRowSetImpl"%> 
<%@ page import="com.posdata.glue.web.control.PosWebConstants"%> 

<%@ page import="com.google.gson.Gson"%> 

<%
	StringBuffer sb = new StringBuffer();
	sb.append("{\"code\":");
	
	int SUCCESS_CODE = 0;
	int FAIL_CODE = -1;
	int EXCEPTION_CODE = -2;
	
	try {
		PosLog logger = PosLogFactory.getLogger(getClass());
		PosContext ctx = (PosContext)request.getAttribute(PosWebConstants.CONTEXT);
		
		if (ctx == null) {
			String service = request.getParameter("ServiceName");
			String message = "Context is null, because Service ["+service+"] did not execute or has a problem!";
			sb.append(FAIL_CODE);
			sb.append(",\"msg\":\"").append(message).append("\"");
		}
		
		String resultKey = "xml-result";
		
		PosRowSetImpl rowList = (PosRowSetImpl) ctx.get(resultKey);
		Gson gson = new Gson();
		String result = gson.toJson(rowList);
		sb.append(SUCCESS_CODE);
		sb.append(",\"msg\":\"").append("정상적으로 처리되었습니다.").append("\"");
		sb.append(",\"jsonResults\":");
		sb.append(result);
	} catch (Exception e) {
		e.printStackTrace();
		sb.append(EXCEPTION_CODE);
		sb.append(",\"msg\":\"").append(e.getMessage()).append("\"");
	}
	finally {
		sb.append("}");
		out.print(sb);
	}
%>