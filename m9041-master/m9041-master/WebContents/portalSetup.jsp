<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.posdata.glue.context.PosContext"%>
<%@ page import="com.posdata.glue.web.security.*"%>
<%@ page import="java.util.*"%>
<%
	PosContext ctx = (PosContext) request.getAttribute("PosContext");
	PosUser user = (PosUser) session.getAttribute(PosSecurityConstants.USER);
	String userId;
	String userName;
	String userNo;

	if (user != null) {
		Map userInfoMap = user.getUserInfoMap();

		if (userInfoMap == null) {
			System.out.println("userInfoMap is null");
		}

		userName = (String) userInfoMap.get("USER_NAME");
		userId = (String) userInfoMap.get("USER_ID").toString();
		userNo = (String) userInfoMap.get("USER_NO").toString();
	} else {
		userName = "";
		userId = "";
		userNo = "";
	}
%>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>MES Portal</title>

		<link rel="stylesheet" href="/dhtmlx/codebase/dhtmlx_modify.css">
		<link rel="stylesheet" href="/dhtmlx/codebase/portalSetup.css">
		<link rel="stylesheet" href="/dhtmlx/codebase/portalMessageList.css">
		<link rel="stylesheet" href="/dhtmlx/codebase/addCommon.css">

		<script type="text/javascript" src="./dhtmlx/codebase/glue.ui.bootstrap.js"></script>

		<script type="text/javascript">
		var userData;
		var userId = "<%=userId%>";
		var userNo = "<%=userNo%>";
		var userName = "<%=userName%>";

		$(document).ready(function() {
			$.ajax({
				url: "/M9041/json.do?ServiceName=userInfo-service&USER_NO="+userNo,
				success: function(result) {
					userData = JSON.parse(result);
					if (userData.length > 0) {
						userData = userData[0];
						// 2022.07.22 김주현
						// 그룹사가 아닐 경우 DEPT_NM 항목에 업체명이 표기
						//	이름과 업체명이 같을 경우 업체명 생략 처리
						if (userData.DEPT_NM != undefined && !(userData.DEPT_NM.indexOf(userData.USER_NAME) > -1))
							$("#deptName").text(userData.DEPT_NM);
						//$("#userImage").attr("src", "http://niris.dongkuk.com/service/getProfileImage.action?socialPerId=" + userData.NIRIS_ID);
						// 2021.12.16 - 김주현 수정
						// CORS 정책으로 인한 이미지 서버 우회 적용
						getProfileImage(userData.NIRIS_ID);
					}
				}
			});
		});

		// 2021.12.16 - 김주현 수정
		// CORS 정책으로 인한 이미지 서버 우회 적용
		function getProfileImage(nIrisId) {
			if (nIrisId != undefined && nIrisId != '') {
				$.ajax({
					url: "/M9041/jsonBase64ImgForCors.do?url=http://niris.dongkuk.com/service/getProfileImage.action?socialPerId=" + nIrisId,
//					url: "/M9041/jsonBase64ImgForCors.do?url=http://iris.dongkuk.com/gwstorage/PhotoPath/" + nIrisId + ".jpg",
					success: function (result) {
						var profileData = JSON.parse(result);
						if (profileData != undefined &&
								profileData.data != undefined &&
								profileData.data.result != undefined &&
								profileData.data.result.img != undefined) {
							$("#userImage").attr("src", profileData.data.result.img);
						}
					}
				});
			}
		}
		</script>
	</head>

	<body>
		<div id="controlContainer">
			<div class="ctrl_root">
				<div class="ctrl_body">
					<div class="ctrl_bodyHeader">
						<div class="ctrl_company">
							<div class="ctrl_glyph glyph_logo"></div>
						</div>
						<a id="ctrl_body_signOut" class="ctrl_resetStyle ctrl_signout ctrl_truncate" href="./logout.do" target="_top">로그아웃</a>
					</div>
					<div class="ctrl_currentAccount">
						<img id="userImage" class="ctrl_accountImage"/>
						<div class="ctrl_accountInfo">
							<div class="ctrl_name ctrl_truncate"><%=userName%></div>
							<div id="deptName" class="ctrl_truncate"></div>
							<a class="ctrl_resetStyle ctrl_link ctrl_truncate" onclick="parent.openModifyingPasswordWindow();">비밀번호 변경</a>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="message_list_title">
			<div class="bell"></div>
			<div>메시지</div>
		</div>
	</body>
</html>