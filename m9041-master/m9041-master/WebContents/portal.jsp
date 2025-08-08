<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.posdata.glue.context.PosContext"%>
<%@ page import="com.posdata.glue.web.security.*"%>
<%@ page import="com.poscoict.glue.security.ext.sso.SapSSO"%>
<%@ page import="java.util.*"%>
<%@ page import="java.text.SimpleDateFormat"%>
<%@ page import="java.text.ParseException"%>
<%@ page import="com.posdata.glue.util.log.PosLogFactory" %>
<%@ page import="com.posdata.glue.util.log.PosLog" %>
<%
	PosLog logger = PosLogFactory.getLogger("portal.jsp");

	ServletContext context = request.getSession().getServletContext();

	String sapSso = (request.getParameter("MYSAPSSO2") == null) ? request.getParameter("EBIZSSO1") : request.getParameter("MYSAPSSO2");
	// 2023.05.16 - iris MY시스템 SSO 접속 사번 암호화 ParamKey 변경
//	sapSso = (sapSso == null) ? request.getParameter("mysysBase64") : sapSso;
	sapSso = (sapSso == null) ? request.getParameter("MYSYSSSO3") : sapSso;
	String isSSO = (pageContext.getSession().getAttribute("IS_SSO") == null) ? "N" : (String) pageContext.getSession().getAttribute("IS_SSO");
	String loginPage = "http://m90." + System.getProperty("Mes.Domain") + context.getInitParameter("loginPage");
	// 2023.05.25 - 지주사 전환 대응, 과거 Domain으로 접근 시 도메인 변경 안내 Popup 처리
	String isDomainNotify = (pageContext.getSession().getAttribute("isDomainNotify") == null) ? "N" : (String) pageContext.getSession().getAttribute("isDomainNotify");
	Boolean isTempPassUser = (pageContext.getSession().getAttribute("isTempPassUser") == null) ? false : (Boolean) pageContext.getSession().getAttribute("isTempPassUser");

	// 2021.01.08
	// UniDos / E-Biz등 Sap SSO를 통해 접속 되는 경우
	//	GET 방식의 URL이 주소창에 노출 되어 보안에 취약점 발생
	//	Redirect를 통해 URL 숨김 처리
	if (sapSso != null) {
		loginPage = loginPage.replace("..", ".");
		pageContext.getSession().setAttribute("IS_SSO", "Y");
		response.sendRedirect(loginPage);
	}

//	PosContext ctx = (PosContext) request.getAttribute("PosContext");
	String pageID = request.getParameter("pageID");
	if (pageID == null || pageID.equals("menu")) {
		pageID = "";
	}
	PosUser user = (PosUser) session.getAttribute(PosSecurityConstants.USER);
	String userId;
	String userName;
	String userNo;
	String forceChnageType = "";
	String encryptTempPw = "";
	SimpleDateFormat transFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

	if (user != null) {
		Map userInfoMap = user.getUserInfoMap();

		if (userInfoMap == null) {
			System.out.println("userInfoMap is null");
		}

		userName = (String) userInfoMap.get("USER_NAME");
		userId = userInfoMap.get("USER_ID").toString();
		userNo = (String) userInfoMap.get("USER_NO");

		// 2021.02.09 - 사번 비밀번호 사용자 Check
		String encryptId = SapSSO.encrypt(userNo);
		String encryptPw = (String) userInfoMap.get("ENCRYPTED_FOUNDATION_PASSWORD");
		// 2024.01.10 - LAST_UPDATE_TIMESTAMP 항목에 변경 시간 관리를 하기 위해 PASSWORD_CHANGE_DATE 항목 신규 생성
		//				비밀번호 변경 시 PASSWORD_CHANGE_DATE 값을 통해 비밀번호 변경 정책 처리
		String lastUpdate = userInfoMap.get("PASSWORD_CHANGE_DATE").toString();
		encryptTempPw = (String) userInfoMap.get("ENCRYPTED_TEMPORARY_PASSWORD");

		logger.logInfo("isTempPassUser : " + isTempPassUser);

		Calendar cal= Calendar.getInstance();
		cal.add(Calendar.MONTH, -3);
		String threeMonthsAgo = transFormat.format(cal.getTime());

		Date _lastUpdate = null;
		Date _threeMonthsAgo = null;

		try {
			_lastUpdate = transFormat.parse(lastUpdate);
			_threeMonthsAgo = transFormat.parse(threeMonthsAgo);
		}
		catch(ParseException e) {
			e.printStackTrace();
		}

		int updateResult = _lastUpdate.compareTo(_threeMonthsAgo);

		// SSO를 통한 부재료 공급업체 접속자의 경우 비밀번호 변경 대상에서 제외
		if ("N".equals(isSSO)) {
			if (encryptId.equals(encryptPw)) {
				logger.logInfo("비밀번호 변경 대상 - 사번 비밀번호 사용자");
				// 사번 비밀번호 사용자
				forceChnageType = "CASE1";
			}
			else if (updateResult < 0 || updateResult == 0) {
				logger.logInfo("비밀번호 변경 대상 - 비밀번호 변경 3개월 초과 사용자");
				// 비밀번호 변경 대상 (updateResult < 0 / _lastUpdate < _threeMonthsAgo)
				// 비밀번호 변경 대상 (updateResult = 0 / _lastUpdate = _threeMonthsAgo)
				forceChnageType = "CASE2";
			}
			else if (isTempPassUser && encryptTempPw != null) {
				logger.logInfo("비밀번호 변경 대상 - 임시 비밀번호 사용자");
				// 임시 비밀번호 사용자
				forceChnageType = "CASE3";
			}
			logger.logInfo("forceChnageType : " + forceChnageType);
		}
	}
	else {
		userName = "";
		userId = "";
		userNo = "";
	}
%>
<!DOCTYPE html>
<html>

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=11" />
	<title>MES Portal</title>

	<link rel="stylesheet" href="/dhtmlx/codebase/dhtmlx_org.css">
	<link rel="stylesheet" href="/dhtmlx/codebase/bootstrap.min.css">
	<link rel="stylesheet" href="/dhtmlx/codebase/dhtmlx_modify.css">
	<link rel="stylesheet" href="/dhtmlx/codebase/portal2.css">
	<link rel="stylesheet" href="/dhtmlx/codebase/portalForIE.css">
	<link rel="stylesheet" href="/dhtmlx/codebase/addCommon.css">

	<script type="text/javascript" src="./dhtmlx/codebase/glue.ui.bootstrap.js"></script>
	<script type="text/javascript" src="/dhtmlx/codebase/sideMenu.js"></script>

	<script type="text/javascript">
		var uiId = "portal";
		var userNoFromPortal = '<%=userNo%>';

		var uiLayout, uiLayoutInner, uiTabbar, uiListMenu,
			uiAllMenuLayout, uiAllMenu, uiUserInfoLayout, uiManagerInfoLayout,
			uiTreeMenu;
		var json_all_menu = { menus: [] };

		var SIDE_MENU_WIDTH = 47;
		var TREE_MENU_WIDTH = 200;
		var USER_INFO_HEIGHT = 198;

		var _initTabId = "dashboard";
		var _clickCount = 0;
		var _clickedId = "";
		var _timer;
		var loadingTimer;
		var _sidebarLastSelectedId;
		var _sideMenuInit;
		var _isSideMenuExpand = false;
		var _userCookie = getCookie("_mesid");

		var json_side_tree_menu;
		var json_side_tree_menu_hidden;
		var json_favorite_list;

		var favoriteChangedEventListners = [];
		var dashboardTabSelectedEventListners = [];

		var userData;

		var _JSON_MESSAGE_STACK_ = [];
		var MESSAGE_STACK_SIZE = 100;

		var _dhxWindow;

		var listener;

		var personalSessionInfo;

		var userId = "<%=userId%>";
		var userNo = "<%=userNo%>";
		var pageId = "<%=pageID%>";

		checkSessionTimer = setInterval(function () {
			if (_userCookie != getCookie("_mesid")) {
				dhtmlx.alert("로그아웃 되었습니다.");
				window.location.href = '/M9041/login.jsp';
			}
		}, 5000);

		$(window).resize(function () {
			clearTimeout(_timer);
			_timer = setTimeout(function () {
				if ($("#nav_all_menu").is(":visible"))
					uiAllMenuLayout.setSizes();

				if ($("#nav_user_info").is(":visible"))
					uiUserInfoLayout.setSizes();

				if ($("#nav_manager_info").is(":visible"))
					uiManagerInfoLayout.setSizes();

				if (uiTabbar.getActiveTab() == _initTabId) {
					$.each(document.getElementsByTagName("iframe"), function (index, obj) {
						if (obj.src.indexOf("blank") > 0)
							obj.contentWindow.resizeDashboardByParent();
					});
				} else {
					$.each(document.getElementsByTagName("iframe"), function (index, obj) {
						if (obj.src.indexOf(uiTabbar.getActiveTab()) > -1) {
							if (obj.contentWindow.layoutObj != undefined && obj.contentWindow.initLayout != undefined) {
								var _arrSize = obj.contentWindow.initLayout.childSize.split(",");
								var _layoutObj = obj.contentWindow.layoutObj.polyObj;

								$.each(Object.keys(_layoutObj), function (index, key) {
									if (_arrSize[index] != undefined && Number(_arrSize[index]))
										_layoutObj[key].setHeight(Number(_arrSize[index]));
								});
							}
						}
					});
				}
			}, 500);
		});

		$(document).ready(function () {
			// 2021.02.09 - 사번 비밀번호 사용자 Check
			if ("<%=forceChnageType%>" != "") {
				if (_dhxWindow == undefined || _dhxWindow == null) {
					_dhxWindow = new dhtmlXWindows();
					_dhxWindow.attachViewportTo(document.body);
				}

				var loginPageUrl = "<%=loginPage%>";
				var passwordChangeWindow = _dhxWindow.createWindow("passwordModify", "0", "0", "355", "400", "");
				passwordChangeWindow.setText("비밀번호 변경");
				var uiLayout = passwordChangeWindow.attachLayout("1C");
				uiLayout.cells("a").hideHeader();
				uiLayout.cells("a").attachURL("passwordModify.jsp", true, {forceChnageType: "<%=forceChnageType%>", encryptTempPw: "<%=encryptTempPw%>"});
				passwordChangeWindow.denyMove();
				passwordChangeWindow.denyResize();
				var arr = ['park', 'minmax', 'stick', 'help', 'close'];
				// TEST 계의 경우 비밀번호 변경 닫기 활성화 처리
				if (loginPageUrl.match('mestst') != null)
					arr = arr.filter((element) => element !== 'close');
				$.each(arr, function (index, item) {
					passwordChangeWindow.button(item).disable();
					passwordChangeWindow.button(item).hide();
				});
				passwordChangeWindow.setModal(true);
				passwordChangeWindow.center();
			}

			// 2023.05.22 - 지주사 전환 대응, 도메인 변경 안내 Popup
			//				SSO 접근자 Popup 제외, 지주사 전환 6월 1일 ~ 6월 10일 까지 Popup 처리
			// 2030.05.25 - 전환 전 Domain으로 접근 시 도메인 변경 안내 Popup 처리
			var notifyStartDate = new Date("2023-06-01");
			var notifyEndDate = new Date("2023-06-10");

			if ("<%=isSSO%>" == "N" && "<%=isDomainNotify%>" == "Y"
					&& (new Date()) <= notifyEndDate) {
					/*&& notifyStartDate <= (new Date())
									&& (new Date()) <= notifyEndDate) {*/
				if (_dhxWindow == undefined || _dhxWindow == null) {
					_dhxWindow = new dhtmlXWindows();
					_dhxWindow.attachViewportTo(document.body);
				}

				var domainNotifyWindow = _dhxWindow.createWindow("domainNotify", "0", "0", "1000", "625", "");
				domainNotifyWindow.setText("도메인 변경 안내");
				var uiLayout = domainNotifyWindow.attachLayout("1C");
				uiLayout.cells("a").hideHeader();
				uiLayout.cells("a").attachURL("domainNotify.jsp", true);
				domainNotifyWindow.denyMove();
				domainNotifyWindow.denyResize();
				var arr = ['park', 'minmax', 'stick', 'help'];
				$.each(arr, function (index, item) {
					domainNotifyWindow.button(item).disable();
					domainNotifyWindow.button(item).hide();
				});
				domainNotifyWindow.setModal(true);
				domainNotifyWindow.center();
			}

			if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (navigator.userAgent.toLowerCase().indexOf("msie") != -1)) {
				dhtmlx.alert({
					title:"<b>브라우저 사용 제한 안내</b>",
					text:"<span style='font-size: 12px;''><b>인터넷 익스플로러 브라우저</b>를 사용 중입니다.<br><b style='color: red;''>일부 서비스 사용이 제한적일 수 있습니다.</b><br><b style='color: blue;''>크롬 또는 엣지 브라우저</b>를 이용해 주세요.</span>"
				});
			}

			$(".toggle_all_menu_icon").click(function (e) {
				toggleAllMenu();
			});

			$(".nav_header_logo").click(function (e) {
				uiTabbar.cells("dashboard").setActive();
			});

			$(".nav_header_user_info").click(function (e) {
				toggleUserInfo();
			});

			$(".nav_header_manager_info").click(function (e) {
				toggleManagerInfo();
			});

			$(".nav_header_remote_support").click(function (e) {
				window.open("https://939.co.kr/dkshead01", "remoteSupport", "");
			});

			loadLayout();
		});

		$(document).bind("contextmenu", function (e) {
			if (($(e.target).hasClass("dhxtabbar_tab_text_close") && $(e.target.parentNode).hasClass("dhxtabbar_tab_actv"))
				|| $(e.target).hasClass("dhxtabbar_tab_close")) {
				toggleContextVisible();
				$("#nav_context_menu").css({
					top: e.pageY + "px",
					left: e.pageX + "px"
				});

				$("#nav_context_menu").fadeIn("fast", function () {
					$("#nav_context_menu").css("z-index", 999);
					uiContextMenuLayout.setSizes();
				});

				return false;
			}
			else {
				hideContextMenu();
			}
		});

		$(document).click(function () {
			hideContextMenu();
		});

		$(window).on("load", function () {
			continueWork();
			if(_isChrome && pageId !== ""){
				_addTab(pageId);
			}
		});

		function continueWork() {
			personalSessionInfo = JSON.parse(localStorage.getItem("_mesSession"));
			if (personalSessionInfo == null) {
				personalSessionInfo = new Object();
			}
			if (personalSessionInfo[userId] == undefined) {
				personalSessionInfo[userId] = { "opened": {}, "expire": Date.now() + (1000 * 60 * 60 * 24 * 7) };
			}else{
				personalSessionInfo[userId].expire = Date.now() + (1000 * 60 * 60 * 24 * 7);
			}

			var ids = Object.keys(personalSessionInfo);
			var idsToDelete = [];
			for (var i = 0, id; id = ids[i]; i++) {
				if (personalSessionInfo[id].expire < Date.now()) {
					idsToDelete.push(id);
				}
			}
			for (var i = 0, id; id = idsToDelete[i]; i++) {
				delete personalSessionInfo[id];
			}

			localStorage.setItem("_mesSession", JSON.stringify(personalSessionInfo));
			var pageCount = Object.keys(personalSessionInfo[userId].opened).length;

			if (pageCount > 0) {
				dhtmlx.confirm({
					title: "하던 일 계속하기",
					ok: "네", cancel: "아니요",
					text: "마지막으로 열었던 화면이 " + pageCount + "개 있습니다.<br>모두 열까요?",
					callback: function (result) {
						if (result) {
							var pages = Object.keys(personalSessionInfo[userId].opened);
							for (var i = 0, page; page = pages[i]; i++) {
								_addTab(page);
							}
						} else {
							personalSessionInfo[userId] = { "opened": {}, "expire": Date.now() + (1000 * 60 * 60 * 24 * 7) };
							localStorage.setItem("_mesSession", JSON.stringify(personalSessionInfo));
						}
					}
				});
			}
		}

		function menuSetting() {
			uiTreeMenu = uiLayout.cells("b").attachTreeView();
			uiLayout.cells("b").setMinWidth(0);
			uiLayout.cells("b").setWidth(0);
			$(".dhxtreeview_cont").addClass("scrollbar_5");

			uiTreeMenu.attachEvent("onClick", function (id) {
				// 즐겨찾기 항목은 펼침상태가 Defalut이다.
				// 즐겨찾기 메뉴 접기 불가처리
				if (id == "Favorite")
					return false;

				// TASK level 항목일 때
				if (!uiTreeMenu.getParentId(id)) {
					if (uiTreeMenu.items[id].opened) {
						uiTreeMenu.closeItem(id);
						// 다른 체인이 선택됐을 때 이전상태를 유지하기 위해 정보를 유지
						json_side_tree_menu[uiTreeMenu.chain].items.forEach((function (item) {
							if (item.id == id) {
								item.open = 0;
							}
						}));
					}
					else {
						uiTreeMenu.openItem(id);
						json_side_tree_menu[uiTreeMenu.chain].items.forEach((function (item) {
							if (item.id == id) {
								item.open = 1;
							}
						}));
					}
				}
				else {
					_addTab(id);
				}
			});

			uiListMenu = uiLayout.cells("a").attachList({
				template: "<div class='menu_btn'><div class='figure_2'><div class='front'><img src='#img#' width='28' height='28'/></div><div class='figcaption_2'><img src='#img2#' width='28' height='28'/></div></div></div>",
			});

			uiListMenu.parse(json_side_menu, "json");

			uiListMenu.attachEvent("onItemClick", function (id, ev, html) {
				if (_sidebarLastSelectedId !== id) {
					$.each(uiLayout.items, function (index, item) {
						if (item.dataType === "treeview" && (uiLayout.cells("b").getWidth() === 1 || uiLayout.cells("b").getWidth() === 0)) {
							//item.conf.min_width = TREE_MENU_WIDTH;
							uiLayout.cells("b").setMinWidth(TREE_MENU_WIDTH);
							uiLayout.cells("b").setWidth(TREE_MENU_WIDTH);
							_isSideMenuExpand = true;
							// $(".dhxtreeview_cont").css("overflow-x", "auto");
						}
					});
				}
				else {
					/*
					if (uiTabbar.getNumberOfTabs() === 1)
						return;
					*/
					$.each(uiLayout.items, function (index, item) {
						if (item.dataType === "treeview") {
							if (uiLayout.cells("b").getWidth() === 1) {
								uiLayout.cells("b").setMinWidth(TREE_MENU_WIDTH);
								uiLayout.cells("b").setWidth(TREE_MENU_WIDTH);
								_isSideMenuExpand = true;
								// $(".dhxtreeview_cont").css("overflow-x", "auto");
							}
							else {
								uiLayout.cells("b").setMinWidth(0);
								uiLayout.cells("b").setWidth(0);
								_isSideMenuExpand = false;
								// $(".dhxtreeview_cont").css("overflow-x", "hidden");
							}
						}
					});
				}
				_sidebarLastSelectedId = id;

				uiTreeMenu.clearAll();
				var selectedTreeMenu;

				if (id == "Favorite") {
					if (json_favorite_list == null) {
						//favorite 를 load하면 event handler에 의해서 reloadFavoriteSideMenu 함수가 호출된다.
						loadFavoriteMenu();
					}
					else {
						reloadFavoriteSideMenu(convert_json_from_list_to_tree(json_favorite_list), id);
					}
				}
				else {
					reloadFavoriteSideMenu(json_side_tree_menu, id);
				}

				loadEllipsisTooltip();

				return true;
			});

			attachFavoriteChangedEventHandler(favoriteChangedEventHandler);
		}

		function attachFavoriteChangedEventHandler(handler) {
			favoriteChangedEventListners.push(handler);
		}

		function attachDashboardTabSelectedEventHandler(handler) {
			dashboardTabSelectedEventListners.push(handler);
		}

		function favoriteChangedEventHandler() {
			if (_sidebarLastSelectedId != "Favorite") return;
			uiTreeMenu.clearAll();
			reloadFavoriteSideMenu(convert_json_from_list_to_tree(json_favorite_list), "Favorite");
		}

		function reloadFavoriteSideMenu(menulist, id) {
			selectedTreeMenu = menulist[id];
			if (selectedTreeMenu) {
				uiTreeMenu.loadStruct(selectedTreeMenu.items);
				uiTreeMenu.chain = id;
			}
		}

		function dashboardTabSelectedEventHandler() {
			if (uiLayout.cells("a").getWidth() === 1)
				toggleSidebarMenu();
		}

		/**
			즐겨찾기 정보를 가져온다.
			성공하면 FavoriteChanged 이벤트를 발생시킨다.
		*/
		function loadFavoriteMenu(callback) {
			$.ajax({
				url: "/M9041/favoritesMenuJson.do?ServiceName=favorites-service&find=1&USER_ID=" + userId,
				success: function (result) {
					json_favorite_list = JSON.parse(result);
					raiseFavoriteChanged();
					if (callback != null)
						callback();
				}
			});
		}

		function loadLayout() {
			$.ajax({
				url: "/M9041/menuInfo.do?ServiceName=menuInfo-service&visible=1&USER_NO=" + userNo,
				success: function (result) {
					json_side_tree_menu = JSON.parse(result);
					menuSetting();
					if(!_isChrome && pageId !== ""){
						_addTab(pageId);
					}
				}
			});

			$.ajax({
				url: "/M9041/menuInfo.do?ServiceName=menuInfo-service&invisible=1&USER_NO=" + userNo,
				success: function (result) {
					json_side_tree_menu_hidden = JSON.parse(result);
				}
			});

			$.ajax({
				url: "/M9041/json.do?ServiceName=userInfo-service&USER_NO=" + userNo,
				success: function (result) {
					userData = JSON.parse(result);
					if (userData.length > 0) {
						userData = userData[0];
						// 2022.07.22 김주현
						// 그룹사가 아닐 경우 DEPT_NM 항목에 업체명이 표기
						//	이름과 업체명이 같을 경우 업체명 생략 처리
						if (userData.DEPT_NM != undefined && !(userData.DEPT_NM.indexOf(userData.USER_NAME) > -1))
							$(".user_dept").text(userData.DEPT_NM);
						$(".user_name").text(userData.USER_NAME);
						//$(".user_image").attr("src", "http://niris.dongkuk.com/service/getProfileImage.action?socialPerId=" + userData.NIRIS_ID);
						// 2021.12.16 - 김주현 수정
						// CORS 정책으로 인한 이미지 서버 우회 적용
						getProfileImage(userData.NIRIS_ID);
					}
				}
			});

			// Menu (uiLayout 좌측 영역) - Start
			uiLayout = new dhtmlXLayoutObject({
				parent: document.body,
				//parent: $("#nav_container")[0],
				pattern: "3W",
				offsets: {
					top: 38, left: 0, right: 0, bottom: 0
				},
				cells: [
					{
						id: "a",
						fix_size: [true, true],
						width: SIDE_MENU_WIDTH,
						header: false
					},
					{
						id: "b",
						fix_size: [true, true],
						width: TREE_MENU_WIDTH,
						header: false
					},
					{
						id: "c",
						fix_size: [false, true],
						header: false
					}
				]
			});

			uiLayout.setSeparatorSize(0, 1);
			uiLayout.setSeparatorSize(1, 1);
			//uiLayout.conf.hh = 0;

			/*
			uiTreeMenu = uiLayout.cells("b").attachTreeView({
				// 메뉴 목록에 불필요한 사항이 있어 json 파일로 대처
				// 추후 필요 시 아래 url을 통한 처리로 변경 필요
				xml: "./header/kr/portal/testMenuTree.xml"
				//xml: 'menu.do?ServiceName=menu-service&rootMenu=1&pageID=menu'
				//json: '${pageContext.request.contextPath}/aaa/menu/admin'
			});
			*/
			// Menu (uiLayout 좌측 영역) - End

			// Tabbar (uiLayout 우측 영역) - start
			uiTabbar = uiLayout.cells("c").attachTabbar({
				mode: "top",
				align: "left",
				tabs: [
					{ id: _initTabId, text: "홈", width: 50, active: true }
				]
			});

			uiTabbar.attachEvent("onTabClick", onTabClickHandler);
			uiTabbar.attachEvent("onSelect", function (id, lastId) {
				if (id !== lastId && id === "dashboard") {
					raiseDashboardTabSelected();
				}
				return true;
			});
			uiTabbar.attachEvent("onTabClose", function (id) {
				delete personalSessionInfo[userId].opened[id];
				localStorage.setItem("_mesSession", JSON.stringify(personalSessionInfo));
				return true;
			});

			uiTabbar.tabs(_initTabId).attachURL("dashboard.jsp", null, true);

			attachDashboardTabSelectedEventHandler(dashboardTabSelectedEventHandler);
			//uiTabbar.enableTabCloseButton(true);//removeTab Option(true:가능 false:불가능)
			// Tabbar (uiLayout 우측 영역) - end

			// 전체 메뉴 - start
			uiAllMenuLayout = new dhtmlXLayoutObject({
				parent: "nav_all_menu",
				pattern: "1C",
				// offsets: {
				// 	top: -5, left: 25, right: 0, bottom: 0
				// },
				cells: [
					{
						id: "a",
						fix_size: [true, true],
						header: false,
						width: $(window).width() - 60,
						height: $(window).height() - 60
					}
				]
			});

			//uiAllMenu.load("menu.do?ServiceName=menu-service&rootMenu=1&hideHiddenMenu=false&pageID=menu");
			uiAllMenuLayout.cells("a").attachURL("./portalAllMenu.jsp");
			uiAllMenuLayout.setSizes();
			// 전체 메뉴 - end

			// 사용자 정보 - start
			uiUserInfoLayout = new dhtmlXLayoutObject({
				parent: "nav_user_info",
				pattern: "2E",
				cells: [
					{
						id: "a",
						fix_size: [true, true],
						header: false
					},
					{
						id: "b",
						fix_size: [true, true],
						header: false
					}
				]
			});

			uiUserInfoLayout.setSeparatorSize(0, 0);
			uiUserInfoLayout.cells("a").attachURL("./portalSetup.jsp");
			uiUserInfoLayout.cells("b").attachURL("./portalMessageList.jsp");
			uiUserInfoLayout.setSizes();
			// 사용자 정보 - end

			// 담당자 정보 - start
			uiManagerInfoLayout = new dhtmlXLayoutObject({
				parent: "nav_manager_info",
				pattern: "1C",
				cells: [
					{
						id: "a",
						fix_size: [true, true],
						header: true,
						text: "담당자 안내"
					}
				]
			});

			uiManagerInfoLayout.cells("a").attachURL("./managerNotice.jsp");
			uiManagerInfoLayout.setSizes();
			// 담당자 정보 - end

			// Context 메뉴 - start
			uiContextMenuLayout = new dhtmlXLayoutObject({
				parent: "nav_context_menu",
				pattern: "1C",
				cells: [
					{
						id: "a",
						fix_size: [true, true],
						header: false
						// width, height portal2.css에 정의
						//	항목 추가 시 한 줄에 38
						//	경계선 추가 시 한 줄에 1
					}
				]
			});

			uiContextMenuLayout.cells("a").attachURL("./portalContextMenu.jsp");
			uiContextMenuLayout.setSizes();
			// Context 메뉴 - end

			$(uiLayout.cont).attr("id", "nav_container");
			$(uiLayout.cells("a").cell).attr("id", "nav_sidebar");
			$(uiLayout.cells("b").cell).attr("id", "nav_sidebar_menu");
			$(uiLayout.cells("c").cell).attr("id", "nav_content");

			$("#nav_all_menu").fadeOut("fast", function () {
				$("#nav_all_menu").css("z-index", 999);
			});

			$("#nav_user_info").fadeOut("fast", function () {
				$("#nav_user_info").css("z-index", 999);
			});

			$("#nav_manager_info").fadeOut("fast", function () {
				$("#nav_manager_info").css("z-index", 999);
			});

			$("#nav_context_menu").fadeOut("fast", function () {
				$("#nav_context_menu").css("z-index", 999);
			});
			
			if(_isIE && pageId !== "")
				_addTab(pageId);
		}
		function reloadTab() {
			var tabId = uiTabbar.getActiveTab();
			tabClose();
			hideContextMenu();
			setTimeout(function () {
				_addTab(tabId);
			}, 500)

		}

		function _addTab(id, param) {
			setTimeout(function () {
				_addTabActor(id, param);
			}, 0);
		}

		function newOpenTab(id, param) {
			_addTab(id, param);
		}

		function _addTabActor(id, param) {
			try {
				if (uiTabbar.tabs(id) != null) {
					uiTabbar.tabs(id).setActive();
					return;
				}

				var targetObject = findProgram(id, json_side_tree_menu);
				if (!targetObject) {
					targetObject = findProgram(id, json_side_tree_menu_hidden);
				}

				if(!targetObject){
					dhtmlx.alert("권한이 없습니다.");
					return;
				}

				var url = targetObject.userdata.url;
				var tab_text = targetObject.text;
				var programId = targetObject.userdata.programId;
				var openType = targetObject.userdata.openType;

				if (url) {
					if (openType == "newWin") {
						openWindow(url, tab_text);
					}
					else if (!uiTabbar.cells(id)) {
						uiTabbar.addTab(id, tab_text, null, null, true, true);
						uiTabbar.tabs(id).attachURL(url + urlConcatingChar(url) + "programId=" + programId + "&" + param);

						personalSessionInfo[userId].opened[id] = 1;
						personalSessionInfo[userId].expire =  Date.now() + (1000 * 60 * 60 * 24 * 7);
						localStorage.setItem("_mesSession", JSON.stringify(personalSessionInfo));

						if ($("#nav_all_menu").is(":visible")) {
							toastMessage(tab_text + " 화면을 열었습니다.");
						}
					}
				}
				else
					dhtmlx.alert("권한이 없습니다.");
			}
			catch (err) {
				dhtmlx.alert(err.message);
			}
		}

		function openWindow(url, title) {
			var width = 1024; //팝업창 넓이
			var height = 633; //팝업창 높이

			// 사용자 권한 화면 사이즈 재정의
			if (url.match("/M90010000")) {
				width = 1300;
				height = 1057;
			}

			// 2024.01.23 - Popup 사이즈 정의 추가
			window.open(url, title, "width="+width+",height="+height+",scrollbars=0,resizable=yes,status=yes");
		}

		function onTabClickHandler(id, lastId) {
			_clickCount++;
			if (_clickCount === 1) {
				_timer = setTimeout(function () {
					_clickCount = 0;
					_clickedId = "";
				}, 400);
				_clickedId = id;
			}
			else if (_clickCount === 2) {
				if (_clickedId === id) {
					clearTimeout(_timer);
					_clickCount = 0;
					_clickedId = "";

					if (id !== "dashboard") {
						if (uiLayout.cells("a").getWidth() === 1)
							toggleSidebarMenu();
						else
							expandContentArea();
					}
				}
			}
		}

		function toggleAllMenu() {
			if ($("#nav_all_menu").is(":visible")) {
				hideAllMenu();
			}
			else {
				showAllMenu();
			}
		}
		function showAllMenu() {
			if ($("#nav_all_menu").is(":visible")) return;

			$("#nav_all_menu").fadeIn("fast", function () {
				$("#nav_all_menu").css("z-index", 999);
				uiAllMenuLayout.setSizes();
				$($("#nav_all_menu iframe").get(0).contentDocument).find("#searchText").focus();
			});
		}
		function hideAllMenu() {
			if (!$("#nav_all_menu").is(":visible")) return;

			$("#nav_all_menu").fadeOut("fast", function () {
				$("#nav_all_menu").css("z-index", 999);
			});
		}

		function toggleUserInfo() {
			if ($("#nav_manager_info").is(":visible")) {
				hideManagerInfo();
			}
			if ($("#nav_user_info").is(":visible")) {
				hideUserInfo();
			}
			else {
				showUserInfo();
			}
		}
		function hideUserInfo() {
			if (!$("#nav_user_info").is(":visible")) return;

			$("#nav_user_info").fadeOut("fast", function () {
				$("#nav_user_info").css("z-index", 999);
			});
		}

		function showUserInfo() {
			if ($("#nav_user_info").is(":visible")) return;

			$("#nav_user_info").fadeIn("fast", function () {
				$("#nav_user_info").css("z-index", 999);
				uiUserInfoLayout.cells("a").setMinHeight(USER_INFO_HEIGHT);
				uiUserInfoLayout.cells("a").setHeight(USER_INFO_HEIGHT);
				uiUserInfoLayout.setSizes();
				$("#nav_user_info iframe").get(1).contentWindow.render("messageContainer", _JSON_MESSAGE_STACK_);
			});
		}

		function toggleManagerInfo() {
			if ($("#nav_user_info").is(":visible")) {
				hideUserInfo();
			}

			if ($("#nav_manager_info").is(":visible")) {
				hideManagerInfo();
			}
			else {
				showManagerInfo();
			}
		}

		function showManagerInfo() {
			if ($("#nav_manager_info").is(":visible")) return;

			$("#nav_manager_info").fadeIn("fast", function () {
				$("#nav_manager_info").css("z-index", 999);
				uiManagerInfoLayout.setSizes();
			});
		}
		function hideManagerInfo() {
			if (!$("#nav_manager_info").is(":visible")) return;

			$("#nav_manager_info").fadeOut("fast", function () {
				$("#nav_manager_info").css("z-index", 999);
			});
		}

		function hideContextMenu() {
			if ($("#nav_context_menu").is(":visible")) {
				$("#nav_context_menu").fadeOut("fast", function () {
					$("#nav_context_menu").css("z-index", 999);
				});
			}
		}

		function expandContentArea() {
			uiLayout.cells("a").setMinWidth(0);
			uiLayout.cells("a").setWidth(0);
			uiLayout.cells("b").setMinWidth(0);
			uiLayout.cells("b").setWidth(0);
		}

		function toggleSidebarMenu() {
			uiLayout.cells("a").setMinWidth(SIDE_MENU_WIDTH);
			uiLayout.cells("a").setWidth(SIDE_MENU_WIDTH);

			if (_isSideMenuExpand) {
				uiLayout.cells("b").setMinWidth(TREE_MENU_WIDTH);
				uiLayout.cells("b").setWidth(TREE_MENU_WIDTH);
			}
			else {
				uiLayout.cells("b").setMinWidth(0);
				uiLayout.cells("b").setWidth(0);
			}
		}

		function toggleContextVisible() {
			var contextDocument = $("#nav_context_menu iframe").get(0).contentWindow.document;
			var activeTabId = uiTabbar.getActiveTab();
			var targetObject = findProgram(activeTabId, json_all_menu.menus);

			if (uiLayout.cells("a").getWidth() === 1) {
				$(contextDocument.getElementById("wideView")).addClass("disabled");
				$(contextDocument.getElementById("menuView")).removeClass("disabled");
			}
			else {
				$(contextDocument.getElementById("wideView")).removeClass("disabled");
				$(contextDocument.getElementById("menuView")).addClass("disabled");
			}

			if (targetObject.userdata.bookmarked === "N") {
				$(contextDocument.getElementById("addFavorite")).removeClass("disabled");
				$(contextDocument.getElementById("removeFavorite")).addClass("disabled");
			}
			else {
				$(contextDocument.getElementById("addFavorite")).addClass("disabled");
				$(contextDocument.getElementById("removeFavorite")).removeClass("disabled");
			}
		}

		function newRemoveOpenTab(id, param) {
			var targetObject = findProgram(id, json_side_tree_menu);
			if (!targetObject) {
				targetObject = findProgram(id, json_side_tree_menu_hidden);
			}

			if (targetObject) {
				if (uiTabbar.tabs(id) != null)
					uiTabbar.tabs(id).close();

				setTimeout(function () {
					_addTab(id, param);
				}, 500)
			}
			else {
				dhtmlx.alert("해당 페이지에 권한이 없습니다.");
				return;
			}
			return true;
		}

		function findProgram(id, menu) {
			var list = Object.keys(menu).map(function (e) {
				return menu[e]
			});

			for (var i = 0; i < list.length; i++) {
				if (typeof (list[i]) != "object")
					continue;

				for (var j = 0; j < list[i].items.length; j++) {
					if (typeof (list[i].items[j]) != "object")
						continue;

					for (var k = 0; k < list[i].items[j].items.length; k++) {
						if (typeof (list[i].items[j].items[k]) != "object")
							continue;

						if (list[i].items[j].items[k].id == id || list[i].items[j].items[k].userdata.programId == id) {
							return list[i].items[j].items[k];
						}
						else {
							continue;
						}
					}
				}
			}
		}

		//tab close
		function tabClose(id) {
			var tabId;

			if (id == undefined)
				tabId = uiTabbar.getActiveTab();
			else
				tabId = id;

			if (tabId == "dashboard") {
				return;
			}
			else {
				var pageId = tabId;
				uiTabbar.tabs(tabId).close();
				delete personalSessionInfo[userId].opened[pageId];
				localStorage.setItem("_mesSession", JSON.stringify(personalSessionInfo));
			}
			return true;
		}

		function closeAllTab() {
			var tabIds = uiTabbar.getAllTabs();
			for (var i = 0; i < tabIds.length; i++) {
				var tab = uiTabbar.tabs(tabIds[i])
				if (tab.getId() != "dashboard")
					tabClose(tab.getId());
			}
		}
		function closeOtherTabs() {
			var tabIds = uiTabbar.getAllTabs();
			for (var i = 0; i < tabIds.length; i++) {
				var tab = uiTabbar.tabs(tabIds[i])
				if (tab.getId() != "dashboard" && tab.getId() != uiTabbar.getActiveTab())
					tabClose(tab.getId());
			}
		}

		function customPopupLinkUrl(id, param) {
			var targetObject = findProgram(id, json_side_tree_menu);
			if (!targetObject) {
				targetObject = findProgram(id, json_side_tree_menu_hidden);
			}
			var url = targetObject.userdata.url;
			var programId = targetObject.userdata.programId;

			if (url) {
				url = url + urlConcatingChar(url) + "programId=" + programId;

				if (param != "") {
					url = url + "&" + param;
				}
			}
			return url;
		}

		function urlConcatingChar(url) {
			if (url.indexOf("?") > 0 && url.length > url.indexOf("?") + 1) {
				return "&";
			}
			else if (url.indexOf("?") > 0
				&& url.length == url.indexOf("?") + 1) {
				return "";
			}
			else {
				return "?";
			}
		}

		// uiTreeMenu에 추가하기 위한 즐겨찾기 상위 구조체 정의
		function struct_outer_tree_menu() {
			return jsonData = {
				"Favorite": {
					"id": "Favorite",
					"text": "즐겨찾기",
					"visible": true,
					"items": [
						{
							"id": "Favorite",
							"text": "즐겨찾기",
							"visible": true,
							"open": 1,
							"items": []
						}
					]
				}
			};
		}

		// uiTreeMenu에 추가하기 위한 items 하위 구조체 정의
		function struct_inner_tree_menu() {
			return jsonData = {
				"id": "",
				"text": "",
				"visible": true,
				"userdata": {
					"programId": "",
					"url": "",
					"seq": ""
				}
			};
		}

		// list 형태의 json을 tree 형태의 json으로 변환
		function convert_json_from_list_to_tree(jsonList) {
			// 정의된 Tree Outer 구조체 생성
			var jsonOuterTree = new struct_outer_tree_menu();
			var jsonArray = new Array();

			$.each(jsonList, function (index, item) {
				// 정의된 Tree Inner 구조체 생성
				var jsonInnerTree = new struct_inner_tree_menu();
				// Tree Inner 구조체에  List 값 Set
				jsonInnerTree.id = item.id;
				jsonInnerTree.text = item.text;
				jsonInnerTree.visible = true;
				jsonInnerTree.userdata.programId = item.programId;
				jsonInnerTree.userdata.url = item.url;
				jsonInnerTree.userdata.seq = item.seq;
				// Tree Inner 구조체에 set된 결과값을 배열에 Set
				jsonArray.push(jsonInnerTree);
			});

			// 정의된 Tree Outer 구조체에 변환된 Tree Inner값 Set
			jsonOuterTree.Favorite.items[0].items = jsonArray;

			return jsonOuterTree;
		}

		// 즐겨찾기 추가, 화면 다시 그리기
		function addFavorite(id, callback) {
			$.ajax({
				url: "/M9041/handlePlainDataProcess.do?ServiceName=favorites-service&add=1&MENU_ID=" + id + "&USER_ID=" + userId,
				complete: function (result, status) {
					var resultJson = JSON.parse(result.responseText);
					var favo = findProgram(id, json_all_menu.menus);
					var mgs = (status == "success") ? "추가되었습니다." : "처리에 실패했습니다.\n다시 시도해 주세요.";

					if (status == "success") {
						favo.userdata.bookmarked = "Y";
						lazyLoadFavoriteMenu();
					}

					if (callback != null && typeof (callback) == 'function') {
						favo.status = status;
						callback(favo);
					}

					toastMessage(mgs);
				}
			});
		}

		function addActiveTabToFavorite() {
			var activeTabId = uiTabbar.getActiveTab();
			var targetObject = findProgram(activeTabId, json_all_menu.menus);
			var id = targetObject.userdata.programId;
			$.ajax({
				url: "/M9041/handlePlainDataProcess.do?ServiceName=favorites-service&add=1&MENU_ID=" + id + "&USER_ID=" + userId,
				complete: function (result, status) {
					var resultJson = JSON.parse(result.responseText);
					var favo = findProgram(id, json_all_menu.menus);
					var mgs = (status == "success") ? "추가되었습니다." : "처리에 실패했습니다.\n다시 시도해 주세요.";

					if (status == "success") {
						favo.userdata.bookmarked = "Y";
						lazyLoadFavoriteMenu();
					}

					toastMessage(mgs);
				}
			});
		}

		// 즐겨찾기 삭제, 화면 다시 그리기
		function removeFavorite(id, callback) {
			$.ajax({
				url: "/M9041/handlePlainDataProcess.do?ServiceName=favorites-service&remove=1&MENU_ID=" + id + "&USER_ID=" + userId,
				complete: function (result, status) {
					var resultJson = JSON.parse(result.responseText);
					var favo = findProgram(id, json_all_menu.menus);
					var mgs = (status == "success") ? "삭제되었습니다." : "처리에 실패했습니다.\n다시 시도해 주세요.";

					if (status == "success") {
						favo.userdata.bookmarked = "N";
						lazyLoadFavoriteMenu();
					}

					if (callback != null && typeof (callback) == 'function') {
						favo.status = status;
						callback(favo);
					}

					toastMessage(mgs);
				}
			});
		}

		function removeActiveTabToFavorite() {
			var activeTabId = uiTabbar.getActiveTab();
			var targetObject = findProgram(activeTabId, json_all_menu.menus);
			var id = targetObject.userdata.programId;
			$.ajax({
				url: "/M9041/handlePlainDataProcess.do?ServiceName=favorites-service&remove=1&MENU_ID=" + id + "&USER_ID=" + userId,
				complete: function (result, status) {
					var resultJson = JSON.parse(result.responseText);
					var favo = findProgram(id, json_all_menu.menus);
					var mgs = (status == "success") ? "삭제되었습니다." : "처리에 실패했습니다.\n다시 시도해 주세요.";

					if (status == "success") {
						favo.userdata.bookmarked = "N";
						lazyLoadFavoriteMenu();
					}

					toastMessage(mgs);
				}
			});
		}

		function lazyLoadFavoriteMenu() {
			clearTimeout(loadingTimer);
			loadingTimer = setTimeout(function () {
				loadFavoriteMenu();
			}, 1500);
		}

		function raiseFavoriteChanged() {
			favoriteChangedEventListners.forEach(function (item) {
				item();
			});
		}

		function raiseDashboardTabSelected() {
			dashboardTabSelectedEventListners.forEach(function (item) {
				item();
			});
		}

		function toastMessage(msg) {
			if (msg == null || msg == undefined) return;

			dhtmlx.message.position = 'bottom';

			dhtmlx.message({
				text: msg,
				expire: 2000
			});
		}

		function openModifyingPasswordWindow() {
			toggleUserInfo();

			if (_dhxWindow == undefined || _dhxWindow == null) {
				_dhxWindow = new dhtmlXWindows();
				_dhxWindow.attachViewportTo(document.body);
			}

			var passwordChangeWindow = _dhxWindow.createWindow("passwordModify", "0", "0", "355", "400", "");
			passwordChangeWindow.setText("비밀번호 변경");
			var uiLayout = passwordChangeWindow.attachLayout("1C");
			uiLayout.cells("a").hideHeader();
			uiLayout.cells("a").attachURL("passwordModify.jsp");
			passwordChangeWindow.denyMove();
			passwordChangeWindow.denyResize();
			passwordChangeWindow.button("park").hide();
			passwordChangeWindow.button("minmax").hide();
			passwordChangeWindow.button("stick").hide();
			passwordChangeWindow.button("help").hide();

			passwordChangeWindow.attachEvent("onClose", function (win) {
				return true;
			});

			passwordChangeWindow.setModal(true);
			passwordChangeWindow.center();

			return true;
		}

		function loadEllipsisTooltip() {
			$('.dhxtreeview_item_label').bind('mouseenter', function () {
				var $this = $(this);

				if (this.offsetWidth < this.scrollWidth && !$this.attr('title')) {
					$this.attr('title', $this.text());
				}
			});
		}

		function customAddTab(id, customParam) {
			if (customParam != "") {
				_addTab(id, customParam);
			} else {
				_addTab(id, "");
			}

		}
		function getTimeStamp() {
			var d = new Date();
			var s = leadingZeros(d.getFullYear(), 4) + "-" + leadingZeros(d.getMonth() + 1, 2) + "-" + leadingZeros(d.getDate(), 2) + " " + leadingZeros(d.getHours(), 2) + ":" + leadingZeros(d.getMinutes(), 2) + ":" + leadingZeros(d.getSeconds(), 2);
			return s;
		}

		function leadingZeros(n, digits) {
			var zero = "";
			n = n.toString();

			if (n.length < digits) {
				for (i = 0; i < digits - n.length; i++) zero += "0";
			}
			return zero + n;
		}

		function stackMessage(pageId, msgType, msg) {
			if (typeof (_JSON_MESSAGE_STACK_) !== "undefined") {
				var obj = findProgram(pageId, json_side_tree_menu);
				if (!obj) {
					obj = findProgram(pageId, json_side_tree_menu_hidden);
				}
				var message_structure = new Object({
					"uuid": new Date().getUTCMilliseconds(),
					"pageId": pageId,
					"pageName": (obj == undefined) ? "예외사항" : obj.text,
					"type": msgType,
					"date": getTimeStamp(),
					"msg": msg
				});

				if (_JSON_MESSAGE_STACK_.length >= MESSAGE_STACK_SIZE)
					_JSON_MESSAGE_STACK_.pop();

				_JSON_MESSAGE_STACK_.push(message_structure);

				_JSON_MESSAGE_STACK_.sort(function (a, b) {
					return a.date > b.date ? -1 : a.date < b.date ? 1 : 0;
				});
			}
		}

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
							$(".user_image").attr("src", profileData.data.result.img);
						}
					}
				});
			}
		}
	</script>
</head>

<body oncontextmenu="return false;" onselectstart="return false;" ondragstart="return false;">
	<!-- [[[[ header -->
	<div class="nav_header_layout">
		<div class="nav_header_logo" title="홈으로 이동"></div>
		<div class="nav_header_all_menu toggle_all_menu_icon" title="전체 메뉴 보기"></div>
		<div class="nav_header_remote_support remote_support_icon" title="원격지원 바로가기"></div>
		<div class="nav_header_manager_info manager_info_icon" title="담당자 안내 보기"></div>
		<div class="nav_header_user_info" title="사용자 정보 보기">
			<span class="user_dept"></span>
			<span class="user_name"></span>
			<!-- <span class="user_name_suffix">님</span> -->
			<img class="user_image" />
		</div>
	</div>
	<!-- header ]]]] -->
	<div id="nav_all_menu"></div>
	<div id="nav_user_info"></div>
	<div id="nav_manager_info"></div>
	<div id="nav_context_menu"></div>
</body>

</html>