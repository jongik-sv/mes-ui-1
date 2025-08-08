package com.poscoict.glue.m90.activity;

import java.util.Map;

import com.posdata.glue.biz.activity.PosActivity;
import com.posdata.glue.biz.control.PosBizControlIF;
import com.posdata.glue.biz.control.PosBizProvider;
import com.posdata.glue.context.PosContext;
import com.posdata.glue.dao.vo.PosRow;
import com.posdata.glue.dao.vo.PosRowSet;
import com.posdata.glue.util.log.PosLog;
import com.posdata.glue.util.log.PosLogFactory;
import com.posdata.glue.web.security.PosSecurityConstants;
import com.posdata.glue.web.security.PosUser;
import com.posdata.glue.web.security.exception.PosSecurityLoaderException;

/**g
 * Portal에서 비밀번호 변경 시 호출
 * Session의 userInfoMap에 존재하는 암호화된 비밀번호를 변경된 암호화된 비밀번호로 갱신 처리
 * 
 * @author juhyun2.kim
 */
public class GetUserInfoForSession extends PosActivity {
	protected PosLog logger = PosLogFactory.getLogger(getClass());

	public String runActivity(PosContext ctx) {
		PosUser posUser = (PosUser) ctx.getSessionUserData(PosSecurityConstants.USER);
		Map userInfoMap = null;

		if (posUser != null) {
			userInfoMap = posUser.getUserInfoMap();
			if (userInfoMap == null) {
				logger.logInfo("session userInfoMap is null");
			}
			else {
				String userNo = (String) posUser.getUserInfo("USER_NO");

				ctx.put("user_id", userNo);
				ctx.put("login", "1");
				ctx.put("ServiceName", "security-service");

				PosBizControlIF controller = PosBizProvider.getController();

				try {
					controller.doAction(ctx);
				}
				catch (Exception e) {
					e.printStackTrace();
					throw new PosSecurityLoaderException(e.getMessage(), e);
				}

				/* security-service를 통해 검색된 사용자 정보를 가져온다 */
				PosRowSet rowSet = (PosRowSet) ctx.get("glue_user_info");

				if (rowSet.hasNext()) {
					PosRow row = (PosRow) rowSet.next();

					for (Object mapkey : userInfoMap.keySet()) {
						// logger.logInfo("key : " + mapkey.toString() + ", value : " + userInfoMap.get(mapkey));
						userInfoMap.put(mapkey.toString(), row.getAttribute(mapkey.toString()));
					}
				}
			}
		}

		return "success";
	}
}
