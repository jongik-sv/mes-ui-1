<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<html>
	<head>
		<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
		<title>
			domainNotify
		</title>

		<link rel="stylesheet" href="/dhtmlx/codebase/domainNotify.css">

		<script type="text/javascript" src="./dhtmlx/codebase/glue.ui.bootstrap.js"></script>
		<script type="text/javascript">
			$(document).ready(function () {
			});

			function winClose() {
				parent._dhxWindow.window(parent.createWindow.getId()).close();
				return true;
			}
		</script>
	</head>

	<body>
		<div class="domainNotifyPanel">
			<div class="guide1"></div>
			<div class="guide2"></div>
		</div>
	</body>
</html>