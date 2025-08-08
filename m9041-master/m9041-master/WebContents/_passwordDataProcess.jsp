<%@page contentType="text/xml;charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="java.util.*"%>
<%@page import="com.posdata.glue.context.PosContext"%>
<%@page import="com.poscoict.glue.dhtmlx.constant.DhtmlxConstantsIF"%>
<%@page import="com.posdata.glue.dao.vo.*"%>
<%@page import="com.posdata.glue.web.control.*"%>
<%@page import="com.posdata.glue.util.log.PosLogFactory" %>
<%@page import="com.posdata.glue.util.log.PosLog"%>
<%@page import="com.posdata.glue.web.security.*"%>

<%
	PosLog logger = PosLogFactory.getLogger("_passwordDataProcess.jsp");

	logger.logInfo("=============Start===========");
	try {
		PosContext ctx = (PosContext) request.getAttribute(PosWebConstants.CONTEXT);

		if (ctx == null) {
			String service = request.getParameter("ServiceName");
			String message = "Context is null, because Service [" + service + "] did not execute or has a problem!";
			out.print("비밀번호 변경에 실패했습니다. 다시 로그인 후 시도하시기 바랍니다.");
			logger.logInfo("비밀번호 변경에 실패했습니다. 다시 로그인 후 시도하시기 바랍니다.");
		}

		PosUser user = (PosUser) session.getAttribute(PosSecurityConstants.USER);

		if (user == null) {
			out.print("사용자 세션 정보가 없습니다. 다시 로그인 후 시도하시기 바랍니다.");
			logger.logInfo("사용자 세션 정보가 없습니다. 다시 로그인 후 시도하시기 바랍니다.");
		} else {
			Throwable error = ctx.getException();

			if (error != null) {
				out.print(error.getMessage());
				logger.logInfo(error.getMessage());
			} else {
				String appMsg = (String) ctx.get("xml-result");

				if ("1".equals(appMsg)) {
					out.print("비밀번호 변경을 완료했습니다.");
				} else {
					out.print("기존 비밀번호가 일치하지 않습니다.");
				}

				logger.logInfo("appMsg : " + appMsg);
			}
		}
	} catch (Exception e) {
		out.print("비밀번호 변경에 실패했습니다. " + e.getMessage());
	}

	out.flush();
	logger.logInfo("=============end===========");
%>