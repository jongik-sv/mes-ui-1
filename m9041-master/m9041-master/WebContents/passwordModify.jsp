<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.posdata.glue.context.PosContext" %>
<%@ page import="com.posdata.glue.web.security.*" %>
<%@ page import="com.posdata.glue.util.log.PosLogFactory" %>
<%@ page import="com.posdata.glue.util.log.PosLog" %>

<%
	PosLog logger = PosLogFactory.getLogger("passwordModify.jsp");

	PosContext ctx = (PosContext)request.getAttribute("PosContext");
	PosUser user = (PosUser) session.getAttribute(PosSecurityConstants.USER);
	String USER_NO = null;
	if(user != null){
		logger.logInfo("user is not null");
		USER_NO = (String) user.getUserInfoMap().get("USER_NO");
	}
	else {
		logger.logInfo("user is null");
		USER_NO = request.getParameter("USER_NO");
	}
	// 2021.02.19 - 사번 비밀번호 사용자 Check
	String forceChnageType = (request.getParameter("forceChnageType") == null) ? "" : request.getParameter("forceChnageType");
	String encryptTempPw = (request.getParameter("encryptTempPw") == null) ? "" : request.getParameter("encryptTempPw");

	logger.logInfo("forceChnageType : " + forceChnageType);
	logger.logInfo("encryptTempPw : " + encryptTempPw);
%>
<html>
<head>
	<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
	<title>
		passwordModify
	</title>
	<style>
		body {
			background-color: white;
		}
		input {
			border-radius: 3px;
			-moz-border-radius: 3px;
			-webkit-border-radius: 3px;
			height: 40px;

			font-size: 14px;
			border: none;
			font-weight: bold;
			width: 100%;
			-webkit-box-sizing: border-box;
			/* Safari/Chrome, other WebKit */
			-moz-box-sizing: border-box;
			/* Firefox, other Gecko */
			box-sizing: border-box;
			/* Opera/IE 8+ */
		}

		input:hover {
			background: #fddf2f;
			color: #122b4b;
		}

		.password {
			border: lightgray solid 1px;
			padding-left: 20px;
			font-size: 14px;
			letter-spacing: 5px;
			width: 100%;
			padding-right: 20px;
		}

		.changeButton {
			cursor: pointer;
			background-color: #122b4b;
			color: #FFFFFF;
			-webkit-padding-after: 3px;
			line-height: 1.5em;
			-webkit-appearance: none;
		}

		.message {
			margin-top: 20px;
			color: #122b4b;
			font-size: 14px;
		}
		.message.error{
			color: #aa0000;
		}

		.changePasswordPanel {
			width: 306px;
		}
	</style>

	<script type="text/javascript" src="./dhtmlx/codebase/glue.ui.bootstrap.js"></script>
	<script type="text/javascript">
		// 2021.02.09 - 사번 비밀번호 사용자 Check
		$(document).ready(function () {
			if ("CASE1" == "<%=forceChnageType%>") {
				$('#changePasswordPanel #message').addClass('error');
				setMessage('내부 보안 정책으로<br><b>사번</b> 및 <b>숫자 비밀번호</b>를 사용할 수 없습니다.<br>비밀번호를 변경하세요.');
				$("#asPassword").attr("disabled", false);
				setFocusById("asPassword");
			}
			else if ("CASE2" == "<%=forceChnageType%>") {
				$('#changePasswordPanel #message').addClass('error');
				setMessage('내부 보안 정책으로<br><b>비밀번호를 3개월 이상</b> 사용할 수 없습니다.<br>비밀번호를 변경하세요.');
				$("#asPassword").attr("disabled", false);
				setFocusById("asPassword");
			}
			else if ("CASE3" == "<%=forceChnageType%>") {
				$('#changePasswordPanel #message').addClass('error');
				setMessage('내부 보안 정책으로<br><b>임시 비밀번호</b>를 사용할 수 없습니다.<br>비밀번호를 변경하세요.');
				$("#asPassword").val("<%=encryptTempPw%>");
				$("#asPassword").attr("disabled", true);
				setFocusById("newPassword");
			}
		});

		function winClose() {
			parent._dhxWindow.window(parent.createWindow.getId()).close();
			return true;
		}

		function isNull(str) {
			if (str == null || str == "" || str == "null") {
				return true;
			}
			return false;
		}

		function isValidPassword(password) {
			chkString = /[a-zA-Z]/i;
			chkNumber = /\d/;
			chkSpecialChar = /[~!@\#$%^&*\()\-=+_]/gi; // 적어도 한 개의 특수문자

			if (password.length < 8) {
				setMessage("비밀번호를 8자 이상 입력하시기 바랍니다.");
				return false;
			}

			if (!chkString.test(password)) {
				setMessage("영문[A~Z]이 반드시 포함되어야 합니다.");
				return false;
			}

			if (!chkNumber.test(password)) {
				setMessage("숫자[0~9]가 반드시 포함되어야 합니다.");
				return false;
			}

			if (!chkSpecialChar.test(password)) {
				setMessage("특수문자[~!@\#$%^&*\()\-=+_]가 반드시 포함되어야 합니다.");
				return false;
			}

			if (password.search(/\s/) > 0) {
				setMessage("공백 문자는 사용할 수 없습니다.");
				return false;
			}
			return true;
		}

		function findAfterFunction() {
			uiCommon.progressOff(parent);
			return true;
		}

		function changePassword() {
			var userNo = '<%=USER_NO%>';
			var asPassword = $("#asPassword").val();
			var newPassword = $("#newPassword").val();
			var newPasswordConfirm = $("#newPasswordConfirm").val();

			if (!validateForm(userNo, asPassword, newPassword, newPasswordConfirm)) {
				return;
			}

			parent._dhxWindow.window("passwordModify").progressOn();
			$.ajax({
				url: "/M9041/passwordHandleDataProcess.do?ServiceName=passwordModify-service&save=1",
				async: true,
				type: "POST",
				data: {
					"USER_NO": userNo,
					"AS_PASSWORD": asPassword,
					"NEW_PASSWORD": newPassword,
					"NEW_PASSWORD_CONFIRM": newPasswordConfirm
				},
				complete: function (result, status) {
					parent._dhxWindow.window("passwordModify").progressOff();
					var mgs = $.trim(result.responseText);

					if (mgs == "비밀번호 변경을 완료했습니다.") {
						$("#asPassword").val("");
						$("#newPassword").val("");
						$("#newPasswordConfirm").val("");
						// 2021.02.09 - 비밀번호 변경 후 새로 고침 처리
						parent.location.reload(true);
					}

					setMessage(mgs);
				}
			});
		}

		function setMessage(message) {
			if(message == "비밀번호 변경을 완료했습니다."){
				message = "비밀번호를 변경했습니다.";
				$("#message").removeClass("error");
			}
			else{
				$("#message").addClass("error");
			}

			$("#message").html(message);
		}

		function setFocusById(id) {
			$("#" + id).focus();
		}

		function validateForm(userNo, asPassword, newPassword, newPasswordConfirm) {
			if (isNull(asPassword)) {
				setMessage("<b>기존 비밀번호</b>를 입력해 주세요.");
				setFocusById("asPassword");
				return;
			}

			if (isNull(newPassword)) {
				setMessage("<b>새 비밀번호</b>를 입력해 주세요.");
				setFocusById("newPassword");
				return;
			}
			else if (isNull(newPasswordConfirm)) {
				setMessage("<b>새 비밀번호</b>를 다시 한번 입력해 주세요.");
				setFocusById("newPasswordConfirm");
				return;
			}
			else if (newPassword != newPasswordConfirm) {
				setMessage("<b>새 비밀번호</b>와 <b>새 비밀번호 확인</b>이 다릅니다.<br>다시 입력해 주세요.");
				$("#newPasswordConfirm").val("");
				setFocusById("newPasswordConfirm");
				return;
			}
			else if (asPassword == newPassword) {
				setMessage("<b>사용하던 비밀번호</b>를 다시 사용할 수 없습니다.<br>다른 비밀번호를 입력해 주세요.");
				$("#newPassword").val("");
				$("#newPasswordConfirm").val("");
				setFocusById("newPassword");
				return;
			}
			else if (!isValidPassword(newPassword)) {
				setFocusById("newPassword");
				return;
			}
			var valPass = isValidPassword(newPassword);

			return valPass;
		}
	</script>
</head>

<body>
	<div class="changePasswordPanel" id="changePasswordPanel">
		<div>
			<p>
				<input class="password" id="asPassword" type="password" Placeholder="기존 비밀번호" name="AS_PASSWORD" required>
			</p>
		</div>
		<div>
			<p>
				<input class="password" id="newPassword" type="password" Placeholder="새 비밀번호" name="NEW_PASSWORD" required>
			</p>
		</div>
		<div>
			<p>
				<input class="password" id="newPasswordConfirm" type="password" Placeholder="새 비밀번호 확인" name="NEW_PASSWORD_CONFIRM" required>
			</p>
		</div>
		<div>
			<input class="changeButton" type="button" value="변경하기" onclick="changePassword()" style="cursor: pointer;">
		</div>
		<div class="message" id="message">
		</div>
	</div>
</body>
</html>