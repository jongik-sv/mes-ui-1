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
		// 결과값은 String 형태의 message만 허용 가능
		Object result = ctx.get("result");

		out.print("{");
		if (error != null) {
			out.print("\"type\":\"error\",\"msg\":\""+error.getMessage()+"\"");
			logger.logDebug(error.getMessage());
		} else {
			if (result != null) {
				out.print("\"type\":\"success\",\"msg\":\""+result.toString()+"\"");
			}
			else {
				out.print("\"type\":\"success\",\"msg\":\"처리되었습니다.\"");
			}
		}
		out.println("}");
		
	} catch (Exception e) {
		out.print("{");
		out.print("\"type\":\"error\",\"msg\":\""+e.getMessage()+"\"");
		out.println("}");
		logger.logDebug(e.getMessage());
	}

	out.flush();
%>