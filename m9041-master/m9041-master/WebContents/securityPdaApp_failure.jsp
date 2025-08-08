<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>

<%@ page import="com.posdata.glue.web.security.*"%>
<%@ page import="com.posdata.glue.context.PosContext"%>
<%@ page import="com.posdata.glue.util.log.PosLog"%>
<%@ page import="com.posdata.glue.util.log.PosLogFactory"%>

<%
	StringBuffer sb = new StringBuffer();
	sb.append("{\"code\":");
	
	int FAIL_CODE = -1;
	int EXCEPTION_CODE = -2;
	
	try {
		PosLog logger = PosLogFactory.getLogger(getClass());
		PosContext ctx = (PosContext) request.getAttribute("PosContext");
		String errMsg = request.getParameter("errMsg") == null ? "" : request.getParameter("errMsg");
		
		if (errMsg == null || errMsg == "") {
			if (ctx != null) {
				Throwable th = ctx.getException();
				
				/*if (th == null)
					logger.logInfo("Throwable is null");
				else
					logger.logInfo("Throwable is not null");*/
				
				sb.append(FAIL_CODE);
				//sb.append(",\"msg\":\"").append(th.getMessage()).append("\"");
				sb.append(",\"msg\":\"").append("인증에 실패했습니다.").append("\"");
			}
		}
		else {
			sb.append(FAIL_CODE);
			//sb.append(",\"msg\":\"").append(errMsg).append("\""); 
			sb.append(",\"msg\":\"").append("인증에 실패했습니다.").append("\""); 
		}
	}
	catch (Exception e){
		e.printStackTrace();
		sb.append(EXCEPTION_CODE);
		sb.append(",\"msg\":\"").append(e.getMessage()).append("\"");
	}
	finally {
		sb.append("}");
		out.print(sb);
	}
%>