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
<html>
	<head>
		<link rel="stylesheet" href="/dhtmlx/codebase/addCommon.css">
		<style>
			body {
				font-family: Roboto, Arial, Helvetica;
				font-size: 14px;
				color: rgb(208, 208, 208);
				box-sizing: border-box;
				line-height: normal;
				margin: 0;
				padding: 0;
				background-color: #dbdbdb;
			}
			
			div {
				margin: 0px;
				padding: 8px;
			}
			
			p {
				margin: 0px;
			}
			
			p.index_title {
				color: #334e9e;
				width: 100%;
				border-bottom: 1px solid #334e9e;
				font-size: 15px;
				font-weight: 600;
				width: calc(100% - 7px);
				padding: 7px 5px 1px 5px;
				margin-bottom: 5px;
			}
			
			table {
				width: 100%;
			}
			
			.prd_group {
				font-weight: bold;
				width: 30%;
				color: #000000;
			}
			
			.prd_name {
				font-weight: bold;
				width: 30%;
				color: #122b4b;
				padding: 3px;
			}
			
			.prd_wgt {
				font-weight: normal;
				color: #555555;
				text-align: right;
			}
			
			.prd_wgt_sum {
				font-weight: bold;
				color: #555555;
				text-align: right;
			}
		</style>
		<script type="text/javascript" src="/dhtmlx/codebase/jquery-3.3.1.min.js"></script>
		<script>
			var whsWgt = [];
			
			$(document).ready(function(){
				$.ajax({
					url: "/M9041/json.do?ServiceName=noticeWhswgt-service&find=1",
					success: function(result) {
						whsWgt = JSON.parse(result);

						for(var i =0,element; element = whsWgt[i];i++ ){
							var id = element.PRD_NM_GRP_CD==undefined?"total":element.PRD_NM_GRP_CD + element.PRD_NM_CD;
							
							var value = element.COIL_WGT;
							$("#"+id).text(formatNumberToString(value));
						}
					}
				});
			});
			
			function formatNumberToString(n){
				if(n==0) return 0;
			
				var reg = /(^[+-]?\d+)(\d{3})/;
				var n = (n + '');
			
				while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');
			
				return n;
			}
		</script>
	</head>
	<body class="scrollbar_5" oncontextmenu="return false;" onselectstart="return false;" ondragstart="return false;">
		<div>
			<p class="index_title">냉연사업본부 누적 입고량 (1967년 9월29일~)</p>
			<table>
				<tr>
					<td class="prd_group">냉연</td>
					<td class="prd_name">PO</td>
					<td class="prd_wgt" id="1A"></td>
				</tr>
				<tr>
					<td class="prd_group"></td>
					<td class="prd_name">CR</td>
					<td class="prd_wgt" id="1C"></td>
				</tr>
				<tr>
					<td class="prd_group"></td>
					<td class="prd_name">F/H</td>
					<td class="prd_wgt" id="1D"></td>
				</tr>
				<tr>
					<td class="prd_group">전기도금</td>
					<td class="prd_name">EGI</td>
					<td class="prd_wgt" id="2E"></td>
				</tr>
				<tr>
					<td class="prd_group"></td>
					<td class="prd_name">ZNNI</td>
					<td class="prd_wgt" id="2N"></td>
				</tr>
				<tr>
					<td class="prd_group">용융도금</td>
					<td class="prd_name">GI</td>
					<td class="prd_wgt" id="3G"></td>
				</tr>
				<tr>
					<td class="prd_group"></td>
					<td class="prd_name">G/A</td>
					<td class="prd_wgt" id="3J"></td>
				</tr>
				<tr>
					<td class="prd_group"></td>
					<td class="prd_name">HGI</td>
					<td class="prd_wgt" id="3K"></td>
				</tr>
				<tr>
					<td class="prd_group"></td>
					<td class="prd_name">G/L</td>
					<td class="prd_wgt" id="3L"></td>
				</tr>
				<tr>
					<td class="prd_group"></td>
					<td class="prd_name">GIX</td>
					<td class="prd_wgt" id="3V"></td>
				</tr>
				<tr>
					<td class="prd_group"></td>
					<td class="prd_name">GLX</td>
					<td class="prd_wgt"  id="3W"></td>
				</tr>
				<tr>
					<td class="prd_group">칼라</td>
					<td class="prd_name">CCI</td>
					<td class="prd_wgt" id="41"></td>
				</tr>
				<tr>
					<td class="prd_group"></td>
					<td class="prd_name">CCEI</td>
					<td class="prd_wgt" id="42"></td>
				</tr>
				<tr>
					<td class="prd_group"></td>
					<td class="prd_name">CCGI</td>
					<td class="prd_wgt" id="43"></td>
				</tr>
				<tr>
					<td class="prd_group"></td>
					<td class="prd_name">CCLI</td>
					<td class="prd_wgt" id="44"></td>
				</tr>
				<tr>
					<td class="prd_group"></td>
					<td class="prd_name">CCAI</td>
					<td class="prd_wgt" id="45"></td>
				</tr>
				<tr>
					<td class="prd_group"></td>
					<td class="prd_name">CCGX</td>
					<td class="prd_wgt" id="46"></td>
				</tr>
				<tr>
					<td class="prd_group"></td>
					<td class="prd_name">CCUS</td>
					<td class="prd_wgt" id="47"></td>
				</tr>
				<tr>
					<td class="prd_group"></td>
					<td class="prd_name">CCNI</td>
					<td class="prd_wgt" id="48"></td>
				</tr>
				<tr>
					<td class="prd_group"></td>
					<td class="prd_name">CCLX</td>
					<td class="prd_wgt" id="49"></td>
				</tr>
				<tr>
					<td class="prd_group">합 계</td>
					<td></td>
					<td class="prd_wgt_sum"  id="total"></td>
				</tr>
			</table>
		</div>
	</body>
</html>