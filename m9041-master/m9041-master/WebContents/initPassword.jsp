<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<html>
<head>
	<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
	<title>
		initPassword
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

		.userNo {
			border: lightgray solid 1px;
			padding-left: 20px;
			font-size: 14px;
			letter-spacing: 5px;
			width: 100%;
			padding-right: 20px;
		}

		.initButton {
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

		.initPasswordPanel {
			width: 306px;
		}
	</style>

	<script type="text/javascript" src="./dhtmlx/codebase/glue.ui.bootstrap.js"></script>
	<script type="text/javascript">
		$(document).ready(function () {
			if (parent.username.value != null || parent.username.value != "") {
				$("#userNo").val(parent.username.value);
			}

			setFocusById("userNo");
			setMessage("사번 입력 후 <b>요청 버튼</b>을 누르세요.<br><b>발송된 IRiS 메일 안내</b>에 따라,<br><b>비밀번호를 재설정</b>할 수 있습니다.");
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
			chkSpecialChar = /[~!@\#$%^&*\()\-=+_]/gi;

			if (chkSpecialChar.test(password)) {
				setMessage("특수문자는 사용할 수 없습니다.");
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

		function initPassword() {
			var userNo = $("#userNo").val();

			if (!validateForm(userNo)) {
				return;
			}

			parent._dhxWindow.window("initPassword").progressOn();
			$.ajax({
				url: "/M9041/newHandlePlainDataProcess.do?ServiceName=initPassword-service",
				async: true,
				type: "POST",
				data: {
					"USER_NO": userNo
				},
				complete: function (result, status) {
					parent._dhxWindow.window("initPassword").progressOff();

					var msg = $.trim(result.responseText);

					if (msg != null) {
						msg = JSON.parse(msg).msg;
						$("#userNo").val("");
					}

					setMessage(msg);
				}
			});
		}

		function setMessage(message) {
			//$("#message").removeClass("error");
			//$("#message").addClass("error");
			$("#message").html(message);
		}

		function setFocusById(id) {
			$("#" + id).focus();
		}

		function validateForm(userNo) {
			if (isNull(userNo)) {
				setMessage("<b>사번</b>을 입력해 주세요.");
				setFocusById("userNo");
				return;
			}

			var valPass = isValidPassword(userNo);

			return valPass;
		}
	</script>
</head>

<body>
	<div class="initPasswordPanel" id="initPasswordPanel">
		<div>
			<p>
				<input class="userNo" id="userNo" type="text" Placeholder="사용자 아이디" name="AS_PASSWORD" required>
			</p>
		</div>
		<div>
			<input class="initButton" type="button" value="요청" onclick="initPassword()" style="cursor: pointer;">
		</div>
		<div class="message error" id="message">
		</div>
	</div>
</body>
</html>