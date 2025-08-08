package com.poscoict.glue.m90.activity;

import com.posdata.glue.biz.activity.PosActivity;
import com.posdata.glue.biz.constants.PosBizControlConstants;
import com.posdata.glue.context.PosContext;

/**
 * BlankClass.java Class는 아무 일도 하지 않는 Class이다.
 * Glue Security(Filter) 사용 시 TrustForm의 Log In 화면에서 Target으로 하는 Service에서 사용된다. 
 * Security 적용 시 이미 Filter에서 로그인 하여 메뉴정보를 가지고 있기 때문에 
 * TrustForm의 Login 화면에서 로그인 service를 바라본다면 두 번 로그인 하는 결과를 초래한다.
 * @author  송범용
 * @see     PosActivity
 */
public class VirtualLogin extends PosActivity {

	public String runActivity(PosContext ctx) {
		logger.logDebug("securitylogin-service 정상 실행");
		return PosBizControlConstants.SUCCESS;
	}
}
 