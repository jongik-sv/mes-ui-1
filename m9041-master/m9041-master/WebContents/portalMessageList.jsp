<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>MES Portal</title>

	<link rel="stylesheet" href="/dhtmlx/codebase/portalMessageList.css">
	<link rel="stylesheet" href="/dhtmlx/codebase/addCommon.css">

	<script type="text/javascript" src="./dhtmlx/codebase/glue.ui.bootstrap.js"></script>

	<script type="text/javascript">
		$(document).ready(function () {
			render("messageContainer", parent._JSON_MESSAGE_STACK_);
		});

		function render(targetId, json) {
			document.getElementById(targetId).innerHTML = "";
			var targetElement = document.getElementById(targetId);
			var ul = document.createElement("ul");
			ul.className = "grid";
			targetElement.appendChild(ul);

			if (json !== undefined && json.length > 0) {
				$.each(json, function (id, obj) {
					var li = document.createElement("li");
					li.id = obj.uuid;
					ul.appendChild(li);

					var figure = document.createElement("figure");
					li.appendChild(figure);

					var h1 = document.createElement("h1");
					h1.innerText = obj.pageName;
					figure.appendChild(h1);

					var figure_div_content = document.createElement("div");
					figure_div_content.className = "content scrollbar_5";
					figure_div_content.innerText = obj.msg;
					figure.appendChild(figure_div_content);

					var h3 = document.createElement("h3");
					h3.className = "occur_time";
					h3.innerText = obj.date;
					figure.appendChild(h3);

					var figcaption = document.createElement("figcaption");
					figure.appendChild(figcaption);

					var figcaption_div = document.createElement("div");
					figcaption_div.className = "icons_area";
					figcaption.appendChild(figcaption_div);

					var figcaption_div_icon_1 = document.createElement("div");
					figcaption_div_icon_1.className = "icon_item share";
					figcaption_div_icon_1.title = "공유";
					figcaption_div.appendChild(figcaption_div_icon_1);

					var figcaption_div_icon_2 = document.createElement("div");
					figcaption_div_icon_2.className = "icon_item close";
					figcaption_div_icon_2.title = "삭제";
					figcaption_div.appendChild(figcaption_div_icon_2);
				});
			}
			else
				ul.appendChild(renderEmptyMessage());

			$(".icon_item.share").click(function (e) {

				parent.dhtmlx.confirm({
					title: "메시지 공유",
					ok: "네", cancel: "아니요",
					text: "선택한 메시지를 시스템 관리자에게 전송할까요?",
					callback: function (result) {
						if (result) {
							var selectedId = e.target.parentElement.parentElement.parentElement.parentElement.id;
							var data = parent._JSON_MESSAGE_STACK_.find(function (item) { if (item.uuid == selectedId) return DataTransferItem });
							var requestData = { "PAGE_ID": data.pageId, "UI_MSG": data.msg, "MSG_ISS_DH": data.date };
							$.ajax({
								url: "/M9041/handlePlainDataProcess.do?ServiceName=userReport-service&report=1",
								type: 'POST',
								data: requestData,
								complete: function (result, status) {
									var resultJson = JSON.parse(result.responseText);
									var mgs = (status == "success") ? "전송했습니다." : "처리에 실패했습니다.\n다시 시도해 주세요.";

									parent.toastMessage(mgs);
								}
							});
						}
					}
				});
			});

			$(".icon_item.close").click(function (e) {
				var selObj = $(e.target).closest("li");

				$.each(parent._JSON_MESSAGE_STACK_, function (index, obj) {
					if (obj && obj.uuid == selObj[0].id) {
						parent._JSON_MESSAGE_STACK_.splice(index, 1);
						selObj.remove();
						parent.toastMessage("삭제되었습니다");
					}
				});

				if (parent._JSON_MESSAGE_STACK_.length === 0)
					ul.appendChild(renderEmptyMessage());
			});
		}

		function renderEmptyMessage() {
			var li = document.createElement("li");
			li.className = "empty_message";
			li.style.textAlign = "center";
			li.innerText = "등록된 메세지가 존재하지 않습니다.";
			return li;
		}
	</script>
</head>

<body class="scrollbar_invisible">
	<div id="messageContainer"></div>
</body>

</html>