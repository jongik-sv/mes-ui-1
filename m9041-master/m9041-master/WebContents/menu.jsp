<%@ page contentType="text/xml;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import = "java.util.*" %> 
<%@ page import = "java.sql.Types" %> 
<%@ page import = "javax.servlet.http.Cookie" %>

<%@ page import = "com.posdata.glue.context.PosContext" %> 
<%@ page import = "com.posdata.glue.dao.vo.*" %> 
<%@ page import = "com.posdata.glue.web.control.*" %> 
<%@ page import = "com.posdata.glue.util.log.PosLog" %>
<%@ page import = "com.posdata.glue.web.security.*" %>

<%

try
{
	String isRootMenu = request.getParameter("rootMenu");
	String id = request.getParameter("MENU_ID");
	
	if(isRootMenu != null && "1".equals(isRootMenu)){
		PosContext ctx = (PosContext)request.getAttribute("PosContext");

		PosUser user = (PosUser)session.getAttribute(PosSecurityConstants.USER);
		String userName;
		if(user != null){
			Map userInfoMap = user.getUserInfoMap();
			if(userInfoMap == null){
				System.out.println("userInfoMap is null");
			}
			userName = (String)userInfoMap.get("USER_NAME");
		} else {
			userName = ""; 
		}
		
//		out.println("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
	    out.println("<tree id=\"0\" radio=\"1\">\n");
	    
	    PosRowSet rootMenuSet = (PosRowSet)ctx.get("RK_ROOT_MENU");	// MES 로그인
		if(rootMenuSet == null){
			rootMenuSet = (PosRowSet)ctx.get("root_menu");			// 다른 루트로 들어온 로그인
		}

   		out.println("<item text='"+userName+"님의 메뉴입니다' id='menuRoot' >\n");

	    while(rootMenuSet.hasNext()){
	    	PosRow rootMenuRow = rootMenuSet.next();
	    	Object menuId =  rootMenuRow.getAttribute("MENU_ID");
			String menuName = (String) rootMenuRow.getAttribute("MENU_NAME");
			String displayName = (String) rootMenuRow.getAttribute("DISPLAY_NAME");
			String displayFlag = (String) rootMenuRow.getAttribute("DISPLAY_FLAG");
System.out.println("<item text=\""+menuName+"\" id=\""+menuId+"\" child=\"1\"/>\n");
			out.println("<item text=\""+menuName+"\" id=\""+menuId+"\" child=\"1\"/>\n");
	 	}
		out.println("</item>\n");
		out.println("</tree>\n");
	} else {
		PosContext ctx = (PosContext)request.getAttribute("PosContext");
		String xmlContents = (String)ctx.get("RK_SUB_MENU");
System.out.println(xmlContents);
		out.println(xmlContents);
	}


}catch (Exception e){
	e.printStackTrace();
}	
%>
