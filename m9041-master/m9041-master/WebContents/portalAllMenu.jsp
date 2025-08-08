<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
	<%@ page import="com.posdata.glue.context.PosContext" %>
		<%@ page import="com.posdata.glue.web.security.*" %>
			<%@ page import="java.util.*" %>
				<%@ page import="java.text.SimpleDateFormat" %>
					<% PosContext ctx=(PosContext) request.getAttribute("PosContext"); PosUser user=(PosUser)
						session.getAttribute(PosSecurityConstants.USER); String userId; String userName; String userNo;
						String userDept="" ; if (user !=null) { Map userInfoMap=user.getUserInfoMap(); if
						(userInfoMap==null) { System.out.println("userInfoMap is null"); } userName=(String)
						userInfoMap.get("USER_NAME"); userId=(String) userInfoMap.get("USER_ID").toString();
						userNo=(String) userInfoMap.get("USER_NO").toString(); /* userDept=(String)
						userInfoMap.get("USER_DEPT").toString(); */ } else { userName="" ; userId="" ; userNo="" ;
						userDept="" ; } // menu_column.json 컬럼정보 캐싱 방지 Date nowDate=new Date(); SimpleDateFormat
						simpleDateFormat=new SimpleDateFormat("yyyyMMddHHmm"); String
						strNowDate=simpleDateFormat.format(nowDate); %>
						<!DOCTYPE html>
						<html>

						<head>
							<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
							<title>MES Portal All menu</title>

							<link rel="stylesheet" href="/dhtmlx/codebase/bootstrap.min.css">
							<link rel="stylesheet" href="/dhtmlx/codebase/portalAllMenu.css">
							<link rel="stylesheet" href="/dhtmlx/codebase/portalAllDtree.css">
							<link rel="stylesheet" href="/dhtmlx/codebase/addCommon.css">

							<script type="text/javascript" src="./dhtmlx/codebase/glue.ui.bootstrap.js"></script>
							<script type="text/javascript" src="/dhtmlx/codebase/simpom.js?ver=1"></script>

							<script type="text/javascript"
								src="/dhtmlx/data/menu_column.json?ver=<%=strNowDate%>"></script>

							<script type="text/javascript">
								var searchTimer;
								var blindTimer;
								var selectedMenuId;
								var treeView = new TreeView();
								var userNo = "<%=userNo%>";

								treeView.target = "here";
								treeView.attachEvent("bookmarkClicked", function (event) {
									(event.source.bookmarked) ?
										parent.removeFavorite(event.source.programId, function (result) { treeView.updateData(event.source.idPath); })
										: parent.addFavorite(event.source.programId, function (result) { treeView.updateData(event.source.idPath); });
								});

								treeView.attachEvent("nodeClicked", function (event) {
									if (!event.source.hasItems)
										parent._addTab(event.source.id);
								});

								$(document).ready(function () {
									// 좌측 메뉴
									$("div.fxs-sidebarflyout-category-button").click(function (e) {
										$(".fxs-portal-activated").toggleClass("fxs-portal-activated");
										selectedMenuId = e.target.id;
										selectNode(e.target.id);
										$(e.target).toggleClass("fxs-portal-activated");
									});

									// 검색
									$(".fxs-sidebar-filter-input").keyup(function (e) {
										search();
									});

									// 검색 초기화
									$(".fxs-search-clear-button").click(function (e) {
										$(".fxs-sidebar-filter-input").val("");
										$(".fxs-search-clear-button").css("visibility", "hidden");
										toggleVisibleItem();
									});

									// 전체 보기
									$("input[name='all_menu_toggle']").click(function (e) {
										toggleVisibleItem();
									});

									// 즐겨찾기 보기
									$("input[name='favorite_menu_toggle']").click(function (e) {
										toggleVisibleItem();
									});

									// 항목찾기 보기
									$("input[name='column_menu_toggle']").click(function (e) {
										toggleVisibleItem();
									});

									// 닫기 버튼
									$(".fxs-sidebar-flyout-close").click(function (e) {
										parent.toggleAllMenu();
									});

									parent.attachFavoriteChangedEventHandler(function () {
										treeView.load(parent.json_all_menu.menus);
										treeView.render();
									});
								});

								function loadMenuInfo() {
									$.ajax({
										url: "/M9041/menuInfo.do?ServiceName=menuInfo-service&allmenu=1&USER_NO=" + userNo,
										success: function (result) {
											var menus = JSON.parse(result);
											var menusColumn = menuColumnInfo;
											//						var mergeMenuAndColumn = mergeObjects(menus, menusColumn);
											var mergeMenuAndColumn = mergeMenuAndColumnInfo(menus, menusColumn);
											for (key in mergeMenuAndColumn) {
												if (mergeMenuAndColumn[key].hasOwnProperty("id")) {
													parent.json_all_menu.menus.push(mergeMenuAndColumn[key])
												}
											}
											drawTree();
										}
									});
								}

								function drawTree() {
									treeView.load(parent.json_all_menu.menus);
									treeView.render();
									toggleVisibleItem();
								}

								function toggleVisibleItem() {
									var arrFilter = [];
									var arrBlind = [];

									// 즐겨찾기 ON
									if ($("input[name='favorite_menu_toggle']").is(":checked")) {
										arrFilter = [searchByText];
										arrBlind.push(blindByFavorite);
									}
									// 즐겨찾기 OFF
									else {
										arrFilter = [searchByText];
										arrBlind.filter((obj) => obj !== blindByFavorite);
									}

									// 항목찾기 ON
									if ($("input[name='column_menu_toggle']").is(":checked"))
										arrFilter = [searchByColumnText];
									// 항목찾기 OFF
									else
										arrFilter = [searchByText];

									// 전체보기 ON
									if ($("input[name='all_menu_toggle']").is(":checked"))
										arrBlind.filter((obj) => obj !== blindByAuth);
									// 전체보기 OFF
									else
										arrBlind.push(blindByAuth);

									treeView.filter(arrFilter);
									treeView.blind(arrBlind);

									if (treeView.getVisibleNodeCount() == 0)
										$("#emptyView").show();
									else
										$("#emptyView").hide();
								}

								function validateText(text) {
									if (text == null || text == undefined || text == "")
										return false;
									else
										return true;
								}

								function search() {
									var text = document.getElementById("searchText");
									if (!validateText(text.value)) {
										$(".fxs-search-clear-button").css("visibility", "hidden");
										return;
									}
									$(".fxs-search-clear-button").css("visibility", "visible");
									clearTimeout(searchTimer);
									searchTimer = setTimeout(function () {
										toggleVisibleItem();
									}, 100);
								}

								function selectNode(id) {
									if (!validateText(id)) return;
									treeView.filterParentNode([selectNodeByText]);
								}

								function selectNodeByText(node) {
									if (selectedMenuId == undefined || selectedMenuId == null || selectedMenuId == "" || selectedMenuId == "all")
										return undefined;

									if (node.id == selectedMenuId)
										return true;
									else
										return false;
								}

								function blindByFavorite(node) {
									return !node.bookmarked;
								}

								function blindByAuth(node) {
									return !node.isAuth;
								}

								function searchByText(node) {
									var input = document.getElementById("searchText");
									if (input.value == null || input.value == undefined || input.value == "")
										return undefined;
									var keyword = input.value.toUpperCase().replace(/ /g, "");
									if (node.text.toUpperCase().replace(/ /g, "").indexOf(keyword) >= 0 ||
										node.id.toUpperCase().replace(/ /g, "").indexOf(keyword) >= 0)
										return true;
									else
										return false;
								}

								function searchByColumnText(node) {
									var input = document.getElementById("searchText");
									if (input.value == null || input.value == undefined || input.value == "")
										return undefined;
									if (node.column.form == undefined || node.column.form.id == undefined || node.column.form.name == undefined ||
										node.column.grid == undefined || node.column.grid.id == undefined || node.column.grid.name == undefined)
										return false;
									var keyword = input.value.toUpperCase().replace(/ /g, "");
									if (node.column.form.id.map(value => value.toUpperCase().replace(/ /g, "")).some(element => element.includes(keyword)) ||
										node.column.form.name.map(value => value.toUpperCase().replace(/ /g, "")).some(element => element.includes(keyword)) ||
										node.column.grid.id.map(value => value.toUpperCase().replace(/ /g, "")).some(element => element.includes(keyword)) ||
										node.column.grid.name.map(value => value.toUpperCase().replace(/ /g, "")).some(element => element.includes(keyword)))
										return true;
									else
										return false;
								}

								function getProgramIdByPageId(pageId) {
									var programId;
									$.each(parent.json_all_menu.menus, function (obj_index, obj) {
										$.each(obj.items, function (menu_index, menu) {
											var filter = menu.items.filter(function (page) {
												return page.id.toUpperCase().replace(/(\s*)/g, "").match(pageId.toUpperCase());
											});
											if (filter.length > 0)
												programId = filter[0].userdata.programId;
										});
									});
									return programId;
								};

								function favoriteService(type, pageId) {
									var programId = getProgramIdByPageId(pageId);
									(type === favoriteIcon_false) ? parent.addFavorite(programId, function (result) { markingFavorite(result); }) : parent.removeFavorite(programId, function (result) { markingFavorite(result); });
								}

								function markingFavorite(json) {
									if (json.status === "success") {
										$.each($("li #" + json.id + " .fxs-sidebar-star"), function (index, obj) {
											obj.innerText = (json.userdata.bookmarked == "Y") ? favoriteIcon_true : favoriteIcon_false;
											(json.userdata.bookmarked == "Y") ? $(obj.closest("li")).addClass("fxs-siderbar-favorite-item") : $(obj.closest("li")).removeClass("fxs-siderbar-favorite-item");
										});
									}
								}

								function mergeObjects(obj1, obj2) {
									for (let key in obj2) {
										if (obj2.hasOwnProperty(key)) {
											if (obj2[key] instanceof Object && obj1[key] instanceof Object)
												obj1[key] = mergeObjects(obj1[key], obj2[key]);
											else
												obj1[key] = obj2[key];
										}
									}
									return obj1;
								}

								// menu 정보와 column 정보 병합
								function mergeMenuAndColumnInfo(menus, menusColumn) {
									for (key in menus) {
										//console.log("Check Module");
										var menuItems = menus[key].items;

										if (menuItems != undefined) {
											for (var i = 0; i < menuItems.length; i++) {
												//console.log("Check Menu");
												var pageItems = menus[key].items[i].items;

												for (var j = 0; j < pageItems.length; j++) {
													//console.log("Check Page");
													var item = pageItems[j];
													var columnItems = menusColumn[key];

													if (columnItems != undefined)
														menus[key].items[i].items[j].column = columnItems[item.id];
												}
											}
										}
									}
									return menus;
								}
							</script>
						</head>

						<body class="fxs-mode-light no-drag" onload="loadMenuInfo();" oncontextmenu="return false;"
							onselectstart="return false;" ondragstart="return false;">
							<div class="menu_content_layout">
								<div
									class="fxs-sidebar-flyout fxs-popup fxs-portal-bg-txt-br msportalfx-shadow-level2 fxs-sidebar-improvedallservices">
									<div class="fxs-sidebar-browse-flyout">
										<div class="fxs-sidebar-content-wrapper">
											<div class="fxs-sidebar-content">
												<div class="fxs-sidebar-flyout-info">
													<span class="fxs-sidebar-flyout-title-text">모든 서비스</span>
													<div class="fxs-sidebar-flyout-filter-wrapper">
														<!--
										<div class="fxs-search-icon-mini">
											돋보기
										</div>
									-->
														<input id="searchText"
															class="fxs-sidebar-filter-input fxs-input fxs-portal-border fxs-portal-background fxs-portal-text"
															type="text" placeholder="검색할 화면명을 입력하세요">
														<button
															class="fxs-search-clear-button fxs-portal-svg fxs-sidebar-button"
															title="검색조건 초기화" style="visibility: hidden;">
															×
														</button>
													</div>

													<div
														class="menu-flyout-toggle-wrapper toggle-first_item_margin_left">
														<span class="menu-flyout-toggle-title-text">전체 보기</span>
														<label class="menu-toggle-switch">
															<input type="checkbox" name="all_menu_toggle">
															<span
																class="menu-toggle-switch-slider menu-toggle-switch-round"></span>
														</label>
													</div>

													<div class="menu-flyout-toggle-wrapper">
														<span class="menu-flyout-toggle-title-text">항목찾기</span>
														<label class="menu-toggle-switch">
															<input type="checkbox" name="column_menu_toggle">
															<span
																class="menu-toggle-switch-slider menu-toggle-switch-round"></span>
														</label>
													</div>

													<div class="menu-flyout-toggle-wrapper">
														<span class="menu-flyout-toggle-title-text">즐겨찾기</span>
														<label class="menu-toggle-switch">
															<input type="checkbox" name="favorite_menu_toggle">
															<span
																class="menu-toggle-switch-slider menu-toggle-switch-round"></span>
														</label>
													</div>
												</div>
											</div>

											<button class="fxs-sidebar-flyout-close fxs-portal-svg fxs-sidebar-button">
												×
											</button>
										</div>
										<ul class="fxs-sidebar-list">
											<li class="fxs-sidebarflyout-category-list">
												<ul class="fxs-sidebar-list">
													<li class="fxs-sidebar-category-name">
														<div id="all"
															class="fxs-sidebarflyout-category-button fxs-list-tit fxs-portal-activated">
															전체메뉴</div>
														<div id="C10" class="fxs-sidebarflyout-category-button">품질설계
														</div>
														<div id="M20" class="fxs-sidebarflyout-category-button">품질판정
														</div>
														<div id="M17" class="fxs-sidebarflyout-category-button">생산관제
														</div>
														<div id="M47" class="fxs-sidebarflyout-category-button">조업관리
														</div>
														<div id="M42" class="fxs-sidebarflyout-category-button">원재료관리
														</div>
														<div id="M30" class="fxs-sidebarflyout-category-button">부재료관리
														</div>
														<div id="M26" class="fxs-sidebarflyout-category-button">구내운송
														</div>
														<div id="M77" class="fxs-sidebarflyout-category-button">야드관리
														</div>
														<div id="M60" class="fxs-sidebarflyout-category-button">출하관제
														</div>
														<div id="M80" class="fxs-sidebarflyout-category-button">통합관제
														</div>
														<div id="M90" class="fxs-sidebarflyout-category-button">공통관리
														</div>
													</li>
											</li>
											</li>
										</ul>
										<div id="here" class="fxs-sidebarflyout-nav"></div>
										<div id="emptyView" class="fxs-sidebarflyout-nav"
											style="display: none; margin-top: 121px;">
											<div class="fxs-sidebar-sub-item-category">
												<ul class="fxs-sidebar-category fxs-sidebar-list">
													<div class="fxs-sidebar-flyout-no-item-content">
														일치하는 겸색 결과가 존재하지 않습니다
													</div>
												</ul>
											</div>
										</div>
									</div>
								</div>
							</div>
						</body>

						</html>