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
		
		sb.append(FAIL_CODE);
		sb.append(",\"msg\":\"").append("로그아웃에 실패했습니다.").append("\"");
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