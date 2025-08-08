<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.posdata.glue.util.log.PosLogFactory" %>
<%@ page import = "com.posdata.glue.util.log.PosLog" %>
<%@ page import="com.posdata.glue.context.PosContext" %>
<%
	PosLog logger = PosLogFactory.getLogger("login.jsp");

	String errMsg = (request.getParameter("errMsg") == null) ? "" : request.getParameter("errMsg");
	String userNo = (request.getParameter("USER_NO") == null) ? "" : request.getParameter("USER_NO");
	// 2024.01.10 - 비밀번호 초기화 이후 메일 내 링크를 통한 접속 처리
	String tempPass = (request.getParameter("TEMP_PASS") == null) ? "" : request.getParameter("TEMP_PASS");
	String isSSO = (pageContext.getSession().getAttribute("IS_SSO") == null) ? "N" : (String) pageContext.getSession().getAttribute("IS_SSO");
	// 2023.05.25 - 지주사 전환 대응, 과거 Domain으로 접근 시 도메인 변경 안내 Popup 처리
	String isDomainNotify = (request.getParameter("isDomainNotify") == null) ? "N" : request.getParameter("isDomainNotify");

	if (errMsg == null || errMsg == "") {
		PosContext ctx = (PosContext) request.getAttribute("PosContext");
		if (ctx != null) {
			Throwable th = ctx.getException();
			errMsg = th.getMessage();

			logger.logInfo("***************************");
			logger.logInfo("Throwable : " + th);
			logger.logInfo("errMsg : " + errMsg);
			logger.logInfo("***************************");
		}
	}	
	Cookie[] cookies = request.getCookies();

	if (cookies != null) {
		for (int i = 0 ; i<cookies.length; i++) {
			if ("_mesid".equals(cookies[i].getName())) {
				logger.logInfo("login.jsp - cookies is not null");
				// TODO - redirect 처리 시 기존 요청 전달은 불가... get param 방식으로 전달 해야되나?...
				pageContext.getSession().setAttribute("IS_SSO", isSSO);
				pageContext.getSession().setAttribute("isDomainNotify", isDomainNotify);
				response.sendRedirect("/M9041/portal.jsp");
			}
		}
	}
%>
<!DOCTYPE html>
<html>
	<head>
		<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
		<meta http-equiv="X-UA-Compatible" content="IE=11" />
		<title>NEW ERA 동국 부산 MES 로그인</title>

		<link rel="stylesheet" href="/dhtmlx/codebase/dhtmlx_org.css">
		<link rel="stylesheet" href="/dhtmlx/codebase/dhtmlx_modify.css">
		<link rel="stylesheet" href="/dhtmlx/codebase/portal2.css">
		<link rel="stylesheet" href="/dhtmlx/codebase/login.css">

		<script type="text/javascript" src="./dhtmlx/codebase/glue.ui.bootstrap.js"></script>
		<script type="text/javascript">
			var _dhxWindow;

			$(document).ready(function () {
				if ('<%=userNo%>' != "" && '<%=errMsg%>' !== '') {
					$(".message").html('<%=errMsg%>');
				}

				if ($("#username").val() == '') {
					$("#username").focus();
				}

				if ('<%=userNo%>' !== "") {
					$("#username").val('<%=userNo%>');
					$("#password").focus();
				}

				if ('<%=tempPass%>' !== "") {
					$("#password").val('<%=tempPass%>');
					document.getElementById('loginForm').submit();
				}

				$(".div_remote_support").click(function (e) {
					window.open("https://939.co.kr/dkshead01", "remoteSupport", "");
				});
			});

			function openInitPasswordWindow() {
				if (_dhxWindow == undefined || _dhxWindow == null) {
					_dhxWindow = new dhtmlXWindows();
					_dhxWindow.attachViewportTo(document.body);
				}

				var initPasswordWindow = _dhxWindow.createWindow("initPassword", "0", "0", "355", "275", "");
				initPasswordWindow.setText("비밀번호 재설정");
				var uiLayout = initPasswordWindow.attachLayout("1C");
				uiLayout.cells("a").hideHeader();
				uiLayout.cells("a").attachURL("initPassword.jsp");
				initPasswordWindow.denyMove();
				initPasswordWindow.denyResize();

				var arr = ['park', 'minmax', 'stick', 'help'];
				$.each(arr, function (index, item) {
					initPasswordWindow.button(item).disable();
					initPasswordWindow.button(item).hide();
				});

				initPasswordWindow.attachEvent("onClose", function (win) {
					return true;
				});

				initPasswordWindow.setModal(true);
				initPasswordWindow.center();

				return true;
			};
		</script>
	</head>
	<body>
		<div class="login_container">
			<div class="left_area">
				<div class="logo"></div>
			</div>
			<div class="right_area">
				<div class="form_content">
					<p class="title">냉연MES</p>
					<form action="login.do" method="post" id="loginForm">
						<input type='hidden' name='ServiceName' value='login-service'>
						<input type='hidden' name='pageID' value='menu'>
						<input type='hidden' name='isDomainNotify' value='<%=isDomainNotify%>'>
						<fieldset>
							<div style="margin-top: 35px;">
								<input id="username" type="text" placeholder="사용자 아이디" name="USER_NO" required>
							</div>
							<div>
								<input id="password" type="password" placeholder="암호" name="USER_PW" required>
							</div>
							<div style="margin-top: 20px;">
								<input type="submit" value="로그인">
							</div>
							<div style="margin-top: 10px;">
								<span class="init_password_link" onClick="openInitPasswordWindow()">비밀번호 재설정</span>
							</div>
							<div class="message"></div>
							<div class="div_remote_support">
								<div class="remote_support_link">원격지원 바로가기</div>
								<div class="remote_support_icon" title="원격지원 바로가기"></div>
							</div>
						</fieldset>
					</form>
				</div>
			</div>
		</div>
	</body>
</html>