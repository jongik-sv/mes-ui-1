<%@ page language="java" contentType="text/plain; charset=UTF-8" pageEncoding="UTF-8"%> 
<%@ page import="java.util.*"%> 

<%@ page import="com.posdata.glue.context.PosContext"%> 
<%@ page import="com.posdata.glue.util.log.PosLog"%>
<%@ page import="com.posdata.glue.util.log.PosLogFactory"%>
<%@ page import="com.posdata.glue.dao.vo.PosRowSetImpl"%> 
<%@ page import="com.posdata.glue.web.control.PosWebConstants"%> 

<%
try{
	PosContext ctx = (PosContext) request.getAttribute(PosWebConstants.CONTEXT);
	String lov = (String)ctx.get("lov-result");
	
	//System.out.println(lov);
	
	out.print(lov);
    out.flush();
} catch (Exception e){
	e.printStackTrace();
}
%>