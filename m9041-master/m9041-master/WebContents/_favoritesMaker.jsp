<%@ page contentType="text/xml;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import = "java.util.*" %>
<%@ page import = "com.posdata.glue.context.PosContext" %>
<%@ page import = "com.posdata.glue.dao.vo.*" %>
<%@ page import = "com.posdata.glue.web.control.*" %>
<%@ page import = "com.posdata.glue.util.log.PosLog" %>
<%@ page import = "com.posdata.glue.util.log.PosLogFactory"%>
<%
    PosLog log = PosLogFactory.getLogger("treeBasicData");

	try
    {
		PosContext ctx = (PosContext)request.getAttribute(PosWebConstants.CONTEXT);
		System.out.println("ctx==>"+ctx);   
        if (ctx == null)
        {
            String service = request.getParameter("ServiceName");
            String message = "Context is null, because Service ["+service+"] did not execute or has a problem!";     
            throw new Exception(message);
        }
        
        StringBuffer sb = new StringBuffer();
//        sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        sb.append("<tree id=\"0\">\n");        
        Object result = ctx.get("favoritesMenuResult");
		if(result != null ){					        
			if (result instanceof List || result instanceof PosRowSet)
            {
				List rowSetList = (List)result;     
				Map rowMap = null;
				for(int i = 0, listSize = rowSetList.size(); i < listSize; i++){
					rowMap = (Map)rowSetList.get(i);
					if(rowMap != null)
					{
						String hostUrl = String.valueOf(rowMap.get("HOST_URL"));
						String programUrl = String.valueOf(rowMap.get("PROGRAM_URL"));
						String programName = String.valueOf(rowMap.get("PROGRAM_NAME"));
						String programId = String.valueOf(rowMap.get("PROGRAM_ID"));
						String pageId = String.valueOf(rowMap.get("PAGE_ID"));	
						String openType = String.valueOf(rowMap.get("openType"));	
						
						sb.append("<item text='")
						  .append(programName)
						  .append("' id='")
//						  .append(programId) 20120612 수정
						  .append(pageId)
						  .append("' name='")
						  .append(programName)
						  .append("' >\n")
						  .append("\t<userdata name='url'><![CDATA[")
						  .append(hostUrl + programUrl + "?pageID=" + pageId)
						  .append("]]></userdata>\n")
						  .append("</item>\n");
 						if ( "newWin".equals( openType ) )
            			{
		                	sb.append( "\n\t<userdata name='openType'><![CDATA[newWin]]></userdata>" );
            			}					
					}
				}
			}			
		}
		sb.append("</tree>\n");
		out.println(sb.toString());
        System.out.println(sb.toString());           
	} catch(Exception e) {
		e.printStackTrace();
		out.println("favoritesMaker.jsp [Error] : " + e.getMessage());
	}
%>
