<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ page import="com.posdata.glue.context.PosContext"%>
<%@ page import="com.posdata.glue.util.log.PosLog"%>
<%@ page import="com.posdata.glue.util.log.PosLogFactory"%>

<%@ page import="java.net.URL"%>
<%@ page import="java.net.URLEncoder"%>

<%@ page import="java.io.InputStream"%>
<%@ page import="java.io.ByteArrayOutputStream"%>
<%@ page import="java.io.BufferedInputStream"%>

<%@ page import="org.json.simple.JSONObject"%>
<%@ page import="org.apache.commons.codec.binary.Base64"%>

<%
/*
	// url을 통해 응답받은 이미지를 서버단에서 base64로 인코딩 처리한 뒤 응답 처리한다.
	// 본 서비스를 통해 응답 받은 결과 값을 Script 또는 HTML을 통해 img Tag 내 src attribute 속성에 추가한다.

	// n-iris에서 제공하는 프로필 이미지를 가져오기 위해 구현된 기능이다.
	// CORS 정책으로 인해 서버를 통해 이미지를 우회해서 전달한다.

	// 응답 결과 JOSN 값 예시
	// return code는 사용할 시스템에서 처리
	// msg는 사용할 시스템에서 재정의 가능
	{
		"msg": "success",
		"data": {
			"results": {
				{
					"img": "data:image/jpg;base64,/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgK"
				}
			}
		}
	}
*/

	StringBuffer sb = new StringBuffer();
	sb.append("{");

	PosLog logger = PosLogFactory.getLogger("_getUserProfileImage.jsp");

	InputStream inputStream = null;
	ByteArrayOutputStream outputStream = null;

	try {
		String url = (request.getParameter("url") == null) ? "" : request.getParameter("url");

//logger.logInfo("######################################################");
//logger.logInfo("url : " + url);

		if (!url.isEmpty()) {
			URL _url = new URL(url);
			inputStream = new BufferedInputStream(_url.openStream());
			outputStream = new ByteArrayOutputStream();
			byte[] buffer = new byte[1024];

			int length = 0;
			while (-1 != (length = inputStream.read(buffer)))
				outputStream.write(buffer, 0, length);

			byte[] byteImg = outputStream.toByteArray();
			byte[] byteBase64 = new Base64().encode(byteImg);
			String strBase64 = new String(byteBase64);

//logger.logInfo("strBase64 : " + strBase64);

			JSONObject jsonObj = new JSONObject();
			jsonObj.put("img", "data:image/jpg;base64," + strBase64);

			sb.append("\"msg\":\"").append("success").append("\"");
			sb.append(",\"data\":{");
			sb.append("\"result\":").append(jsonObj);
			sb.append("}");
		}
		else {
			sb.append("\"msg\":\"").append("url is null").append("\"");
			sb.append(",\"data\":{");
			sb.append("\"result\":{}");
			sb.append("}");
		}
	} catch (Exception e) {
		logger.logInfo(e.getMessage(), e);
		response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);

		sb.append("\"msg\":\"").append(e.getMessage()).append("\"");
		sb.append(",\"data\":{");
		sb.append("\"result\":{}");
		sb.append("}");
	} finally {
		if (inputStream != null)
			inputStream.close();
		if (outputStream != null)
			outputStream.close();

//logger.logInfo("######################################################");
		sb.append("}");
		out.print(sb);
	}
%>
