<%@ page contentType="text/xml;charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import = "java.util.*" %>
<%@page import = "com.posdata.glue.context.PosContext" %>
<%@page import = "com.poscoict.glue.dhtmlx.constant.DhtmlxConstantsIF" %> 
<%@page import = "com.posdata.glue.dao.vo.*" %>
<%@page import = "com.posdata.glue.web.control.*" %>
<%@page import = "com.posdata.glue.util.log.PosLog" %>
<%
	
	
	System.out.println("=============Start===========");
		try{			
			Map params = request.getParameterMap();
			Set keys = params.keySet();
			Iterator keyItr = keys.iterator();
			
			while(keyItr.hasNext()){
				Object key = keyItr.next();
				Object data = params.get(key);
				System.out.println("Type Key : "+key+"     value:"+data);
				if(data instanceof String[]){
				    String [] values = (String []) data;
				    for(int i = 0; i < values.length; i++){
				    	System.out.println("\tKey : "+key+"   value_"+i+":"+values[i]);
				    }
				}
			}
		}catch (Exception e){
			e.printStackTrace();
		}
    System.out.println("=============End===========");
//    out.print("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
    try{
        PosContext ctx = (PosContext)request.getAttribute(PosWebConstants.CONTEXT);
        if (ctx == null) 
        {
            String service = request.getParameter("ServiceName");
            String message = "Context is null, because Service ["+service+"] did not execute or has a problem!";     
            throw new Exception(message);
        }
        String[] ids = request.getParameter("ids").split(",");
        
        Throwable error = ctx.getException();
        if(error != null) {
          
           out.print("<data>");
        	for(int i = 0; i < ids.length; i++){
        		
        	  if(i == 0){
        	    out.print("<action type=\"invalid\" sid=\""+ids[i]+"\" message=\"errMsg\"><![CDATA["+error.getMessage()+"]]></action>");
        	  }else{
        	    out.print("<action type=\"invalid\" sid=\""+ids[i]+"\"><![CDATA["+error.getMessage()+"]]></action>");
        	  }
        	}
       	    out.println("</data>");	        	
        }else{
        	
    		   out.print("<data>");
        	for(int i = 0; i < ids.length; i++){
        		
        		String type = request.getParameter(ids[i] + "_!nativeeditor_status");
        		
		        out.print("<action type='"+type+"' sid='"+ids[i]+"' tid='"+ids[i]+"' message='Success'></action>");
        	}
			      out.print("<action type='appMsg'><![CDATA["+ ids.length +"건의 Data 처리에 성공했습니다]]></action>");
			      out.print("<action type='tcMsg'><![CDATA["+ ctx.get("xml-result") +"]]></action>");
       	    out.println("</data>");	        	
        }
    } catch (Exception e) {
    	  out.print("<data>");
        out.print("<action type='invalid'><![CDATA["+e.getMessage()+"]]></action>");
       	out.println("</data>");
    }
    out.flush();
	%>