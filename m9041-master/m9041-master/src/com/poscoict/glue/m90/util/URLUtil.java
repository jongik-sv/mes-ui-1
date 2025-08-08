package com.poscoict.glue.m90.util;

public class URLUtil {
	
	static String serverType = System.getProperty("Server.Type");
	
	public static String getRemoveSessionURL(String chainCode){
		StringBuffer url = new StringBuffer();
		
		if("DEV".equals(serverType)){
			url.append("http://").append(chainCode).append(".mesdev.dongkukcm.com/").append(chainCode.toUpperCase()).append("/_removeSessionData.jsp");
		} else if("TST".equals(serverType)){
			url.append("http://").append(chainCode).append(".mestst.dongkukcm.com/").append(chainCode.toUpperCase()).append("/_removeSessionData.jsp");
		} else if("PRD".equals(serverType)){
			url.append("http://").append(chainCode).append(".mesprd.dongkukcm.com/").append(chainCode.toUpperCase()).append("/_removeSessionData.jsp");
		} else {
			// 설정되어 있지 않으면 Local로 간주
			url.append("http://127.0.0.1:7001/").append(chainCode.toUpperCase()).append("/_removeSessionData.jsp");
		}
		
		return url.toString();
	}
}