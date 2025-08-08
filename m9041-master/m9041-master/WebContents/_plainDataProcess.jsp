<%-- <%@ page contentType="text/xml;charset=UTF-8" pageEncoding="UTF-8"%> --%>
<%@ page contentType="text/plain;charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="java.util.*"%>
<%@page import="com.posdata.glue.context.PosContext"%>
<%@page import="com.poscoict.glue.dhtmlx.constant.DhtmlxConstantsIF"%>
<%@page import="com.posdata.glue.dao.vo.*"%>
<%@page import="com.posdata.glue.web.control.*"%>
<%@page import="com.posdata.glue.util.log.PosLog"%>
<%@page import="com.posdata.glue.util.log.PosLogFactory"%>
<%
	/*
	 dhtmlx가 아닌 ajax로 서비스를 요청한 경우 응답정보 생성 로직
	 */
	PosLog logger = PosLogFactory.getLogger(this.getClass());
	
	try {
		PosContext ctx = (PosContext) request.getAttribute(PosWebConstants.CONTEXT);
		
		if (ctx == null) {
			String service = request.getParameter("ServiceName");
			String message = "Context is null, because Service ["
					+ service + "] did not execute or has a problem!";
			throw new Exception(message);
		}

		Throwable error = ctx.getException();
		
		out.print("{");
		if (error != null) {
			out.print("\"type\":\"error\",\"msg\":\""+error.getMessage()+"\"");
			logger.logDebug(error.getMessage());
			/*
			result.setType("invalid");
			result.setMessage(error.getMessage());
			*/
		} else {
			out.print("\"type\":\"success\",\"msg\":\"처리되었습니다.\"");
			/*
			result.setType("success");
			result.setMessage("processing completed");
			*/
		}
		out.println("}");
		
	} catch (Exception e) {
		out.print("{");
		out.print("\"type\":\"error\",\"msg\":\""+e.getMessage()+"\"");
		out.println("}");
		logger.logDebug(e.getMessage());
	}
	/*
	Gson gson = new Gson();
	resultJsonString = gson.toJson(result);
	
	out.flush(resultJsonString);
	*/
	out.flush();
%>