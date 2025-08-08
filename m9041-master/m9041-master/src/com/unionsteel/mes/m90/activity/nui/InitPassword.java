package com.unionsteel.mes.m90.activity.nui;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Random;

import com.poscoict.glue.security.ext.sso.SapSSO;
import com.posdata.glue.biz.activity.PosActivity;
import com.posdata.glue.context.PosContext;
import com.posdata.glue.dao.PosGenericDao;
import com.posdata.glue.dao.vo.PosParameter;
import com.posdata.glue.dao.vo.PosRow;
import com.posdata.glue.dao.vo.PosRowSetImpl;
import com.posdata.glue.web.security.SecurityConstants;
import com.posdata.glue.web.security.exception.PosSecurityLoaderException;
import com.unionsteel.mes.m90.common.constant.M90ConstantsIF;

/**
 * 이 클래스는 initPassword-service에서 초기화 요청한 사용자에 대해 인증 여부 체크 후 임시 비밀번호로 초기화 하는 Activity이다.
 * @author 김주현
 */
public class InitPassword extends PosActivity implements SecurityConstants {

	public String runActivity(PosContext ctx) {
//		PosGenericDao dao = this.getDao(this.getProperty("dao"));
		PosGenericDao dao = this.getDao(this.getProperty(M90ConstantsIF.DAO));
		PosRowSetImpl userRowSet = (PosRowSetImpl) ctx.get("USER_INFO");

		/* 1. 사용자 ID 체크 */
		logger.logInfo("====== 1. 사용자 ID 체크 ======");

		if (userRowSet == null || userRowSet.count() == 0) {
			throw new PosSecurityLoaderException("사용자 아이디가 존재하지 않습니다.");
		}

		PosRow userRow = (PosRow) userRowSet.get(0);
		String userNo = (String) userRow.getAttribute("USER_NO");
		String toEmail = (String) userRow.getAttribute("EMAIL");

		/* 2. 메일 체크 */
		logger.logInfo("====== 2. 메일 체크 ======");
		if (toEmail == null) {
			throw new PosSecurityLoaderException("등록된 <b>메일 주소가 없는</b> 사용자입니다.<br>비밀번호 재설정을 원하실 경우<br>관리자에게 문의하세요.");
		}

		/* 3. 임시 유효기간 생성 */
		logger.logInfo("====== 3. 임시 비밀번호 생성 ======");
		String encryptedTempPw = getEncryptedTempPw();

		/* 4. 임시 유효기간 생성 */
		logger.logInfo("====== 4. 임시 유효기간 생성 ======");
		Timestamp expirationDate = getExpirationDate();

		/* 5. 임시 비밀번호, 임시 유효기간 갱신 */
		logger.logInfo("====== 5. 임시 비밀번호 / 임시 유효기간 갱신 ======");

		// 비밀번호 초기화 요청 시, 임시 비밀번호 / 임시 유효기간 갱신
		PosParameter param = new PosParameter();
		param.setNamedParamter("USER_NO", userNo);
		param.setNamedParamter("ENCRYPTED_TEMPORARY_PASSWORD", encryptedTempPw);
		param.setNamedParamter("TEMPORARY_EXPIRATION_DATE", expirationDate);
		param.setNamedParamter("PROGRAM_ID", this.getClass().getSimpleName());

		dao.update("glue_security.init.password", param);
		logger.logInfo("임시 비밀번호, 임시 유효기간 갱신 처리");

		/* 6. 비밀번호 오류 횟수 초기화 */
		logger.logInfo("====== 6. 비밀번호 오류 횟수 초기화 ======");

		// 비밀번호 초기화 요청 시, 비밀번호 오류 횟수 초기화
		param = new PosParameter();
		param.setNamedParamter("USER_NO", userNo);
		param.setNamedParamter("PASSWORD_FAIL_CNT", BigDecimal.ZERO);
		param.setNamedParamter("PROGRAM_ID", this.getClass().getSimpleName());

		dao.update("glue_security.fail.update", param);
		logger.logInfo("비밀번호 오류 횟수 초기화 처리");

		String userName = (String) userRow.getAttribute("USER_NAME");
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("M월 d일 H시 m분");

		String serverType = System.getProperty("Server.Type");
		String mesUrl = "http://m90.mes";

		if ("DEV".equals(serverType)) {
			mesUrl += "dev";
		} else if ("TST".equals(serverType)) {
			mesUrl += "tst";
		} else if ("PRD".equals(serverType)) {
			mesUrl += "prd";
		} else {
			mesUrl += "tst";
		}

		mesUrl += ".dongkukcm.com/M9041/login.jsp";
		String urlParam1 = "?USER_NO=" + userNo;
		String urlParam2 = "&TEMP_PASS=" + encryptedTempPw;

		/* 7. 메일 발송 */
		logger.logInfo("====== 7. 메일 발송 ======");
		logger.logInfo("serverType : " + serverType);
		logger.logInfo("mesUrl : " + mesUrl);

		// Tamplate 없이 바로 발송 처리
//		String content = userName + "님, 안녕하세요.<br><br>" +
//				"동국시스템즈 MES 시스템에서 발송된 비밀번호 초기화 관련 메일입니다.<br><br>" +
//				"아래의 링크를 통해 MES 자동 접속이 가능합니다.<br><br>" +
//				"아래 링크는 " + simpleDateFormat.format(expirationDate) + " 까지 사용 가능합니다.<br><br>" +
//				"접속 이후 비밀번호 변경을 통해 새로운 비밀번호로 MES 사용이 가능합니다.<br><br>" +
//				"<a href='" + mesUrl + urlParam1 + urlParam2 + "' target='_blank' style='color: blue;'><b>MES 시작하기</b></a><br><br>" +
//				"감사합니다.<br>";
//		param = new PosParameter();
//		param.setNamedParamter("fromEmail", null);
//		param.setNamedParamter("toEmails", toEmail);
//		param.setNamedParamter("subject", "MES 비밀번호 초기화 관련 안내");
//		param.setNamedParamter("content", content);
//		param.setNamedParamter("systemCode", "MES-INIT_PASSWORD");
//		param.setNamedParamter("createdBy", "InitPassword.java");
//		dao.insert("glue_security.send.email", param);

		SendMailByIris mail = new SendMailByIris(dao, "InitPassword", userNo);
		mail.setTitle("MES 비밀번호 재설정 관련 안내");
		mail.setSenderEmail(null);
		mail.addReceiver(toEmail);
		mail.addTemplateMapping("userName", userName);
		mail.addTemplateMapping("expirationDate", simpleDateFormat.format(expirationDate));
		mail.addTemplateMapping("linkHref", mesUrl + urlParam1 + urlParam2);
		mail.setTemplatePath("template/mailTemplate_initPassword.html");
		mail.sendMail();

		// 처리 결과를 화면에 전달
		String irisUrl = "https://mail.worksmobile.com";
		String message = "<b>비밀번호 재설정 요청이 완료</b>되었습니다.<br>" +
						"비밀번호 재설정 관련 <b>메일을 발송</b>했습니다.<br>" +
						"<a href='" + irisUrl + "' target='_blank'><b>IRiS 개인 메일</b></a>을 확인해주세요.";

		ctx.put("result", message);

		return "success";
	}

	/**
	 * 임시 비밀번호 유효기간을 가져오는 함수 (현재 시간 기준  1시간 부여)
	 * @return
	 */
	public Timestamp getExpirationDate() {
		Timestamp current = new Timestamp(System.currentTimeMillis());
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(current.getTime());
		cal.add(Calendar.HOUR, 1);
		Timestamp expirationDate = new Timestamp(cal.getTime().getTime());

		logger.logInfo("현재 시간 : " + current);
		logger.logInfo("유효 시간 : " + expirationDate);

		return expirationDate;
	}

	/**
	 * 암호화된 임시 비밀번호를 가져오는 함수 (PREFIX_TEMP_PASS 문자 + 난수를 암호화 처리)
	 * @return
	 */
	public String getEncryptedTempPw() {
		Random random = new Random(); //랜덤 객체 생성(디폴트 시드값 : 현재시간)
		random.setSeed(System.currentTimeMillis()); //시드값 설정을 따로 할수도 있음
		Long randomDigit = random.nextLong();

		String encryptedPrefix = SapSSO.encrypt(PREFIX_TEMP_PASS);
		String encryptedRandomDigit = SapSSO.encrypt(Long.toString(randomDigit));
		String encryptedTempPw = encryptedPrefix + encryptedRandomDigit;

		logger.logInfo("암호화된 고정 임시 비밀번호 : " + encryptedPrefix);
		logger.logInfo("암호화된 임시 비밀번호 : " + encryptedTempPw);

		return encryptedTempPw;
	}
}
