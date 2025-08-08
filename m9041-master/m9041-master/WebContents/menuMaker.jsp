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
		
		/* 20120504 추가 */
		Object hiddenFlag = request.getParameter("hideHiddenMenu");
		
		boolean hideHiddenMenu = true;
		if(hiddenFlag != null && "false".equals(hiddenFlag.toString())){
			hideHiddenMenu = false;
		}

		logger.logDebug("USER ID : " + user_id + ", USER NO : " + employeeID + ", USER NAME : " + name + ", hideHiddenMenu : " + hideHiddenMenu);
		
		StringBuffer sb = new StringBuffer();
		sb.append("<tree id=\"0\" radio=\"1\">\n");

		List topList = user.getMenu();
		if(topList != null ){

			/* M권한 XML Data 생성 */
			PosMenu menu = null;
			MenuMaker maker = null;
			for(int i = 0; i < topList.size(); i++){
				menu = (PosMenu)topList.get(i); 
				maker = new MenuMaker(hideHiddenMenu);
				sb.append(maker.makeXml(menu));
			}
		} else {
			logger.logWarn("PosUser is null");
		}

		sb.append("</tree>\n");

		out.println(sb.toString());
		//logger.logInfo(sb.toString());
	} else {
		logger.logWarn("========================================= PosUser is null");
	}

} catch(Exception e) {
	e.printStackTrace();
	logger.logError(e.getMessage());
	out.println("menuXml.jsp [Error] : " + e.getMessage());
}
%>

