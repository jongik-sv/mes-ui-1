package com.unionsteel.mes.m90;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.posdata.glue.util.log.PosLog;
import com.posdata.glue.util.log.PosLogFactory;
/**
 * 도메인 변경 작업을 위해 추가된 Class
 * 허용된 도메인(dongkukcm.com)을 포함하지 않은 도메인 URL로 접근 시 필터를 이용해 loginPage로 리다이렉트 처리
 * 
 * 기존 unionsteel.co.kr 도메인으로 접속을 시도하는 사람 및 외부접속자(Host 변조 사용)를 위한 기능
 * 
 * @author juhyun2.kim
 */
public class IllegalURLFilter implements Filter {
	protected PosLog logger = PosLogFactory.getLogger(getClass());
	private FilterConfig filterConfig;

	public void init(FilterConfig config) throws ServletException {
		this.filterConfig = config;
	}

	public void doFilter(ServletRequest req, ServletResponse res,
			FilterChain chain) throws ServletException, IOException {
		String allowDomain = "dongkukcm.com";

		HttpServletRequest httpReq = (HttpServletRequest) req;
		HttpServletResponse httpRes = (HttpServletResponse) res;
		ServletContext context = httpReq.getSession().getServletContext();
		String reqDomain = req.getServerName();
		String reqURL = httpReq.getRequestURL().toString();
		String redirectUrl = "http://m90." + System.getProperty("Mes.Domain");

		// 2023.02.27 - 지주사 전환으로 인한 안내 페이지 Redirect 처리
		// 2023.05.10 - 안내 페이지 미사용 처리, 각 Portal로 Redirect 처리
		/*if (reqDomain.contains("dongkuk.com")) {
			logger.logInfo("@@@AS-IS URL Access : " + getClientIP(httpReq) + " | " + httpReq.getRequestURL());

			redirectUrl = redirectUrl + context.getInitParameter("infoPage");

			// TST 기준 WAS Mes.Domain 설정 변경에도 불구하고 .이 포함되는 경우가 있어 변환 처리
			redirectUrl = redirectUrl.replace("..", ".");
			// 접근 불가
			httpRes.sendRedirect(redirectUrl);
		}*/

		if (reqDomain.contains(allowDomain)) {
			// 접근 가능
			chain.doFilter(req, res);
		}
		else {
			logger.logInfo("@@@IllegalURL Access : " + getClientIP(httpReq) + " | " + httpReq.getRequestURL());

			if (!reqURL.contains("loginGalaxy.jsp")) {
				redirectUrl = redirectUrl + context.getInitParameter("loginPage") + "?isDomainNotify=Y";
			}
			else
				redirectUrl = redirectUrl + context.getInitParameter("loginGalaxyPage");

			// 2021.01.07 도메인 변경 배포 이후 추가 수정
			// TST 기준 WAS Mes.Domain 설정 변경에도 불구하고 .이 포함되는 경우가 있어 변환 처리
			redirectUrl = redirectUrl.replace("..", ".");
			// 접근 불가
			httpRes.sendRedirect(redirectUrl);
		}
	}

	public void destroy() {}

	/**
	 * 접속자의 IP를 반환하는 함수
	 */
	public static String getClientIP(HttpServletRequest request) {
		String ip = request.getHeader("X-Forwarded-For");

		if (ip == null) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null) {
			ip = request.getHeader("HTTP_CLIENT_IP");
		}
		if (ip == null) {
			ip = request.getHeader("HTTP_X_FORWARDED_FOR");
		}
		if (ip == null) {
			ip = request.getRemoteAddr();
		}

		return ip;
	}
}