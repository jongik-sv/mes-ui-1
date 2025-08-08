<%@ page contentType="text/xml;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import = "java.util.*" %> 
<%@ page import = "java.text.*" %> 
<%@ page import = "java.sql.Timestamp"%>
<%@ page import = "java.math.BigDecimal"%>

<%@ page import = "com.posdata.glue.dao.vo.*" %>
<%@ page import = "com.posdata.glue.util.log.PosLog" %>
<%@ page import = "com.posdata.glue.context.PosContext" %>
<%@ page import = "com.posdata.glue.web.control.PosWebConstants" %>
<%@ page import = "com.posdata.glue.biz.constants.PosBizControlConstants" %>
<%@ page import = "com.posdata.glue.web.security.*" %>
<%@ page import = "com.posdata.glue.util.log.PosLogFactory"%>

<%@ page import = "com.poscoict.glue.m90.util.MenuMaker"%>

<%
PosLog logger = PosLogFactory.getLogger(getClass());

try{
	
	PosUser user = (PosUser)session.getAttribute(PosSecurityConstants.USER);
	
	
	if(user != null) {

		Map userInfo = user.getUserInfoMap();
		
		String name			= userInfo.get("USER_NAME") != null ? (String)userInfo.get("USER_NAME") : "";
		String employeeID	= userInfo.get("USER_NO") != null ? (String)userInfo.get("USER_NO") : "";
		String user_id		= userInfo.get("USER_ID") != null ? ((BigDecimal)userInfo.get("USER_ID")).toString() : ""; 
	
		logger.logDebug("USER ID : " + user_id + ", USER NO : " + employeeID + ", USER NAME : " + name);
		
		StringBuffer sb = new StringBuffer();

		List topList = user.getMenu();
		sb.append("[");
		
		if(topList != null ){

			for(int i = 0, topListSize = topList.size(); i < topListSize; i++){
		    
				PosMenu menu = (PosMenu)topList.get(i); 

				if(sb.length() > 1 && i < topListSize){
					Map map = menu.getInfo();
					Object flag = map.get("DISPLAY_FLAG");
					
					if(flag != null && ("Y".equals(flag) || "1".equals(flag))){
						sb.append(", ");
					}
				}

				MenuMaker maker = new MenuMaker(true);
				sb.append(maker.makeJson(menu));
				
			}
		} else {
			logger.logInfo("TopList is null");
		}
		
		sb.append("]");
		
		out.println(sb.toString());
		logger.logInfo(sb.toString());
	} else {
		logger.logWarn("========================================= PosUser is null");
	}

} catch(Exception e) {
	e.printStackTrace();
	logger.logError(e.getMessage());
	out.println("menuXml.jsp [Error] : " + e.getMessage());
}
%>

