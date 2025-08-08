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
	String userDept = "";
	
	if (user != null) {
		Map userInfoMap = user.getUserInfoMap();
		
		if (userInfoMap == null) {
			System.out.println("userInfoMap is null");
		}
		
		userName = (String) userInfoMap.get("USER_NAME");
		userId = (String) userInfoMap.get("USER_ID").toString();
		userNo = (String) userInfoMap.get("USER_NO").toString();
		/* userDept = (String) userInfoMap.get("USER_DEPT").toString(); */
	} else {
		userName = "";
		userId = "";
		userNo = "";
		userDept = "";
	}
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Dashboard</title>
		
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link rel="stylesheet" href="/dhtmlx/codebase/dhtmlx_org.css">
		<link rel="stylesheet" href="/dhtmlx/codebase/dhtmlx_modify_dashboard.css">
		<link rel="stylesheet" href="/dhtmlx/codebase/portal2.css">
		<link rel="stylesheet" href="/dhtmlx/codebase/addCommon.css">
		
		<script type="text/javascript" src="./dhtmlx/codebase/glue.ui.bootstrap.js"></script>
		
		<script>
			var uiLayout, uiUserLayout, uiFavoriteMenuList, uiFrequentlyUsedMenuList, uiRecentlyUsedMenuList, uiLatestUpdateList;
			var userId = "<%=userId%>";
			var userNo = "<%=userNo%>";
			
			
			var RECENT_WIDTH = 250;
			var FAVORITE_WIDTH = 250;
			
			var loadingTimer;
			var jsonFrequentlyUsed;
			//var NOTICE_WIDTH = 400;
			
			var objIcons = {
				icon_1: 	{
					title: "최근항목", id: "r_visit", class: "refresh", tooltip: "새로고침"
				},
				icon_2: 	{
					title: "즐겨찾기", id: "r_favorite", class: "refresh", tooltip: "새로고침"
				},
				icon_3: 	{
					title: "최근 업데이트", id: "r_update", class: "refresh", tooltip: "새로고침"
				},
				icon_4: 	{
					title: "자주사용 <div style='font-size:10px;display:inline'><a href='#' onclick='openAllFrequentlyUsedMenu()'>전체열기</a></div>", id: "r_freq", class: "refresh", tooltip: "새로고침"
				}
			};
			
			function loadLayout() {
				
				uiLayout = new dhtmlXLayoutObject({
					parent: main_body,
					pattern: "3W",
					offsets: {
						top: 12, left: 12, right: 12, bottom: 12
					},
					cells: [
						{
							id: "a",
							fix_size: [true, true],
							width: RECENT_WIDTH,
							header: false
						},
						{
							id: "b",
							fix_size: [true, true],
							width: FAVORITE_WIDTH,
							header: true,
							text: setHoverIcon(objIcons.icon_2)	// 즐겨찾기
						},
						{
							id: "c",
							fix_size: [true, true],
							//width: NOTICE_WIDTH,
							header: false
						}
					]
				});
				
				uiUserLayout = new dhtmlXLayoutObject({
					parent: uiLayout.cells("a"),
					pattern: "2E",
					cells: [
						{
							id: "a",
							fix_size: [true, true],
							height: 430,
							header: true,
							text: setHoverIcon(objIcons.icon_4)
						},
						{
							id: "b",
							fix_size: [false, true],
							header: true,
							text: setHoverIcon(objIcons.icon_1)	// 최근 항목
						}
					]
				});
				
				uiLayout.cells("b").hideArrow();
				uiUserLayout.cells("a").hideArrow();
				uiUserLayout.cells("b").hideArrow();
				
				uiFrequentlyUsedMenuList = uiUserLayout.cells("a").attachList({
					template: "<span class='dhx_strong'>#text#</span><span class='dhx_light'>#id#</span>",
					type: {
						height: "auto",
					}
				});
				
				uiFrequentlyUsedMenuList.load("/M9041/favoritesMenuJson.do?ServiceName=frequently-service&freq=1&USER_NO="+userNo,"json");
				uiFrequentlyUsedMenuList.attachEvent("onItemClick",favoriteMenuClickedHandler);
				
				uiRecentlyUsedMenuList = uiUserLayout.cells("b").attachList({
					template: "<span class='dhx_strong'>#text#</span><span class='dhx_light'>#id#</span><br/><span class='dhx_light'>#recentAccessTime#</span>",
					type: {
						height: "auto",
					}
				});
				
				uiRecentlyUsedMenuList.load("/M9041/favoritesMenuJson.do?ServiceName=frequently-service&recent=1&USER_NO="+userNo,"json");
				uiRecentlyUsedMenuList.attachEvent("onItemClick",favoriteMenuClickedHandler);
				
				uiFavoriteMenuList = uiLayout.cells("b").attachList({
					template: "<span class='dhx_strong'>#text#</span><span class='dhx_light'>#id#</span>",
					type: {
						height: "auto"
					},
					drag: true
				});
				
				uiFavoriteMenuList.load("/M9041/favoritesMenuJson.do?ServiceName=favorites-service&find=1&USER_ID="+userId, "json");
				uiFavoriteMenuList.attachEvent("onItemClick",favoriteMenuClickedHandler);
				uiFavoriteMenuList.attachEvent("onAfterDrop",favoriteAfterDropHandler);
				
				uiNoticeLayout = new dhtmlXLayoutObject({
					parent: uiLayout.cells("c"),
					pattern: "2E",
					cells: [
						{
							id: "a",
							fix_size: [true, false],
							height: 250,
							header: true,
							text: setHoverIcon(objIcons.icon_3)	// 최근 업데이트
						},
						{
							id: "b",
							fix_size: [true, false],
							header: true,
							text: setHoverIcon('주요 지표')	// 주요지표
						}
					]
				});
				
				uiNoticeLayout.cells("a").hideArrow();
				uiNoticeLayout.cells("b").hideArrow();
				
				uiLatestUpdateList = uiNoticeLayout.cells("a").attachList({
					template: "<span class='dhx_strong'>#NOTICE_PUB_TITLE#</span><span class='dhx_light'>#DPL_DH#</span><br/><span class='dhx_light'>#NOTICE_PUB_CONTENT#</span>",
					type: {
						height: "auto"
					}
				});
				
				uiLatestUpdateList.load("/M9041/json.do?ServiceName=notice-service&findDeploy=1","json");
				
				uiNoticeLayout.cells("b").attachURL("./majorIndex.jsp");
				
				$.each($(".dhx_list"), function (index, obj) {
					$(obj).addClass("scrollbar_5");
				});


				$("#"+objIcons.icon_1.id).click(function(e) {
					console.log(objIcons.icon_1.title);
					reloadReceltlyUsedMenuList();
				});
				
				$("#"+objIcons.icon_2.id).click(function(e) {
					console.log(objIcons.icon_2.title);
					parent.lazyLoadFavoriteMenu();
					//reloadFavorite();
					
				});
				
				$("#"+objIcons.icon_3.id).click(function(e) {
					console.log(objIcons.icon_3.title);
					reloadLatestUpdateList();
				});
				$("#"+objIcons.icon_4.id).click(function(e) {
					console.log(objIcons.icon_4.title);
					reloadFrequentlyUsedMenuList();
				});

			}
			
			function favoriteMenuClickedHandler(id, ev, obj) {
				parent._addTab(id,null);
			}
			
			function favoriteAfterDropHandler(context, ev) {
				if (context.target == null)
					context.target = uiFavoriteMenuList.data.order[uiFavoriteMenuList.data.order.length - 2];
				
				if (context.start !== context.target) {
					var json = new Object();
					
					$.each(uiFavoriteMenuList.data.order, function(index, val) {
						if (val == context.start) {
							var jsonList = new Object();
							jsonList.programId = uiFavoriteMenuList.get(val).programId;
							jsonList.seq = uiFavoriteMenuList.get(context.target).seq;
							jsonList.org_seq = uiFavoriteMenuList.get(val).seq;
							json[val] = jsonList;
						}
					});
					
					$.ajax({
						// 2022.01.11 - 최초 등록 시 seq 발번 오류로 SEQ가 null인 경우 1로 대처 처리
						url: "/M9041/handlePlainDataProcess.do?ServiceName=favorites-service&dragFind=1&USER_ID="+userId+"&MENU_ID="+json[context.start].programId+"&S_VAL="+(json[context.start].org_seq == 'null' ? 1 : json[context.start].org_seq)+"&E_VAL="+(json[context.start].seq == 'null' ? 1 : json[context.start].seq)+"&column-info=SEQ",
						success: function(result) {
							var json = JSON.parse(result);
							
							if (json.type.toLowerCase().match("error") != null) {
								dhtmlx.message({
									type: json.type,
									text: json.msg,
									expire: 2000
								});
							}
							parent.loadFavoriteMenu();
						}
					});
				}
			}
			
			function lazyLoadFavoriteMenu(){
				clearTimeout(loadingTimer);
				loadingTimer = setTimeout(function(){
					 parent.loadFavoriteMenu();
					 }, 1500);
			}
			
			function favoriteChangedEventHandler(){
				reloadFavorite();
			}
			
			function reloadFavorite(){
				uiFavoriteMenuList.clearAll();
				for(var i =0, element; element = parent.json_favorite_list[i]; i++){
					uiFavoriteMenuList.add(element);
				}
			}
			
			function resizeDashboardByParent() {
				uiLayout.setSizes();
			}
			
			function openAllFrequentlyUsedMenu(){
				for(var i = 0; i < uiFrequentlyUsedMenuList.dataCount(); i++){
					var id = uiFrequentlyUsedMenuList.get(uiFrequentlyUsedMenuList.idByIndex(i)).id;
					parent._addTab(id,null);
					
				}
			}
			
			function dashboardTabSelectedEventHandler(){
				reloadReceltlyUsedMenuList();
				
			}
			
			function reloadReceltlyUsedMenuList(){
				uiRecentlyUsedMenuList.clearAll();
				uiRecentlyUsedMenuList.load("/M9041/favoritesMenuJson.do?ServiceName=frequently-service&recent=1&USER_NO="+userNo,"json");
			}
			
			
			function reloadFrequentlyUsedMenuList(){
				uiFrequentlyUsedMenuList.clearAll();
				uiFrequentlyUsedMenuList.load("/M9041/favoritesMenuJson.do?ServiceName=frequently-service&freq=1&USER_NO="+userNo,"json");
			}
			
			function reloadLatestUpdateList(){
				uiLatestUpdateList.clearAll();
				uiLatestUpdateList.load("/M9041/json.do?ServiceName=notice-service&findDeploy=1","json");
			}
			
			parent.attachFavoriteChangedEventHandler(favoriteChangedEventHandler);
			parent.attachDashboardTabSelectedEventHandler(dashboardTabSelectedEventHandler);
			
			function setHoverIcon(obj) {
				if (typeof(obj) === "object")
					return obj.title+"<div class='icons_area'><div id='"+obj.id+"' class='icon_item "+obj.class+"' title='"+obj.tooltip+"'></div>";
				else if ((typeof(obj) === "string"))
					return obj;
			}
		</script>
	</head>
	<body onload="loadLayout();" style="background-color: #e6e6e6" class="scrollbar_5">
		<div id="main_body" style="width:975px; height:100%"></div>
	</body>
</html>