<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>

<%@ page import="com.posdata.glue.web.security.*"%>
<%@ page import="com.posdata.glue.context.PosContext"%>
<%@ page import="com.posdata.glue.util.log.PosLog"%>
<%@ page import="com.posdata.glue.util.log.PosLogFactory"%>
<%@ page import="com.posdata.glue.dao.vo.PosRow"%>
<%@ page import="com.posdata.glue.dao.vo.PosRowSet"%>
<%@ page import="com.posdata.glue.dao.vo.PosColumnDef"%>

<%
	StringBuffer sb = new StringBuffer();
	sb.append("{\"code\":");
	
	int SUCCESS_CODE = 0;
	int FAIL_CODE = -1;
	int EXCEPTION_CODE = -2;
	
	try {
		PosLog logger = PosLogFactory.getLogger(getClass());
		PosContext ctx = (PosContext) request.getAttribute("PosContext");
		// CheckUserInfo에서 인증된 사용자 정보
		PosUser user = (PosUser)ctx.get("PosUser");
		String errMsg = request.getParameter("errMsg") == null ? "" : request.getParameter("errMsg");
		Boolean existsCookieLogin = false;
//		logger.logInfo(System.getProperty("Mes.Domain"));
		
		if (errMsg == null || errMsg == "") {
			Cookie[] cookies = request.getCookies();
			
			logger.logInfo("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
			//HttpSession httpSession = request.getSession(true);
			//logger.logInfo("httpSession.getId() : " + httpSession.getId());
			String[] strobj = (String[]) ctx.get("SESSION_ID");
			
			for (int k = 0; k < strobj.length; k++) {
				logger.logInfo("strobj[" + k + "] : " + strobj[k]);
			}
			
			logger.logInfo("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
			
			// Cookie에 로그인 정보가 있을 경우
			// 	자동 로그인 처리
			if (cookies != null) {
				logger.logInfo("cookie is not null");
				for (int i = 0; i < cookies.length; i++) {
					//logger.logInfo("cookies["+i+"].getName() : " + cookies[i].getName());
					//logger.logInfo("cookies["+i+"].getValue() : " + cookies[i].getValue());
					
					if (SecurityConstants.MES_COOKIE_ID.equals(cookies[i].getName()) && cookies[i].getValue() != null) {
						logger.logInfo("cookie is exists");
						
						sb.append(SUCCESS_CODE);
						sb.append(",\"msg\":\"").append("정상적으로 인증되었습니다. - cookie").append("\"");
						existsCookieLogin = true;
						
						/*
						// Glue에서 인증된 사용자 정보
						Map userInfoMap = user.getUserInfoMap();
						Iterator<String> it = userInfoMap.keySet().iterator();
						
						sb.append(",\"loginInfo\":{");
						
						while(it.hasNext()) {
							String itKey = it.next();
							logger.logInfo(" key : " + itKey + " / value : " + userInfoMap.get(itKey));
							
							sb.append("\""+itKey+"\"")
								.append(":")
								.append("\""+userInfoMap.get(itKey)+"\"")
								.append(",");
						}
						*/
						
						sb.append(",\"loginInfo\":{");
						
						PosRowSet rowSet = (PosRowSet) ctx.get("USER_INFO");
						
						if(rowSet.hasNext()) {
							PosRow row = rowSet.next();
							Map<String, Object> rowMap = row.getAttributes();
							Iterator<String> iter = rowMap.keySet().iterator();
							
							while(iter.hasNext()) {
								String colName = iter.next();
								Object colValue = (row.getAttribute(colName) == null) ? "" : row.getAttribute(colName);
								
								sb.append("\"" + colName + "\"")
									.append(":")
									.append("\"" + colValue + "\"")
									.append(",");
							}
						}
						
						sb.deleteCharAt(sb.length() - 1);
						sb.append("}");
						
						sb.append(",\"sessionId\":\"").append(session.getId()).append("\"");
						logger.logInfo("session Id : " + session.getId());
					}
				}
			}
			
			logger.logInfo("existsCookieLogin : " + existsCookieLogin);
			
			if (!existsCookieLogin) {
				if (user != null) {
					//logger.logInfo("user is not null");
					
					/*
					Map userInfoMap = user.getUserInfoMap();
					Iterator<String> it = userInfoMap.keySet().iterator();
					*/
					
					sb.append(SUCCESS_CODE);
					sb.append(",\"msg\":\"").append("정상적으로 인증되었습니다. - security").append("\"");
					sb.append(",\"loginInfo\":{");
					
					/*
					while(it.hasNext()) {
						String itKey = it.next();
						logger.logInfo(" key : " + itKey + " / value : " + userInfoMap.get(itKey));
						
						sb.append("\""+itKey+"\"")
							.append(":")
							.append("\""+userInfoMap.get(itKey)+"\"")
							.append(",");
					}
					*/
					
					PosRowSet rowSet = (PosRowSet) ctx.get("USER_INFO");
					
					if(rowSet.hasNext()) {
						PosRow row = rowSet.next();
						Map<String, Object> rowMap = row.getAttributes();
						Iterator<String> iter = rowMap.keySet().iterator();
						
						while(iter.hasNext()) {
							String colName = iter.next();
							Object colValue = (row.getAttribute(colName) == null) ? "" : row.getAttribute(colName);
							
							sb.append("\"" + colName + "\"")
								.append(":")
								.append("\"" + colValue + "\"")
								.append(",");
						}
					}
					
					sb.deleteCharAt(sb.length() - 1);
					sb.append("}");
					
					sb.append(",\"sessionId\":\"").append(session.getId()).append("\"");
					logger.logInfo("session Id : " + session.getId());
				}
				else {
					logger.logInfo("user is null");
					sb.append(FAIL_CODE);
					sb.append(",\"msg\":\"").append("사용자 정보가 존재하지 않습니다.").append("\"");
				}
			}
		}
		else {
			sb.append(FAIL_CODE);
			sb.append(",\"msg\":\"").append(errMsg).append("\"");
		}
	}
	catch (Exception e) {
		e.printStackTrace();
		sb.append(EXCEPTION_CODE);
		sb.append(",\"msg\":\"").append(e.getMessage()).append("\"");
	}
	finally {
		sb.append("}");
		out.print(sb);
	}
%>