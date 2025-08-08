package com.poscoict.glue.m90.activity;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.poscoict.glue.security.ext.sso.SapSSO;
import com.posdata.glue.PosException;
import com.posdata.glue.biz.activity.PosActivity;
import com.posdata.glue.context.PosContext;
import com.posdata.glue.dao.vo.PosRow;
import com.posdata.glue.dao.vo.PosRowSetImpl;
import com.posdata.glue.web.security.SecurityConstants;
import com.posdata.glue.web.security.exception.PosSecurityLoaderException;

/**
 * 화면에서 받은 Password 파라미터 AS_PASSWORD, NEW_PASSWORD를 암호화하여
 * PosContext에 encAsPw, encNewPw로 각각 넣는다
 * 
 */
public class PWEncryption extends PosActivity implements SecurityConstants {
	public String runActivity(PosContext ctx) {
		String asPassword = ((String[]) ctx.get("AS_PASSWORD"))[0]; // 사용자가 입력한 현재 비밀번호
		String newPassword = ((String[]) ctx.get("NEW_PASSWORD"))[0]; // 사용자가 입력한 새로운 비밀번호
		String userNo = ((String[]) ctx.get("USER_NO"))[0];

		// 사용자 정보 가져오기
		PosRowSetImpl passRowSet = (PosRowSetImpl) ctx.get("RK_PASSWORD");

		/* 1. 사용자 ID 체크 */
		logger.logInfo("====== 1. 사용자 ID 체크 ======");

		if (passRowSet == null || passRowSet.count() == 0) {
			throw new PosSecurityLoaderException("사용자가 존재하지 않습니다.");
		}

		PosRow passRow = (PosRow) passRowSet.get(0);
		String encryptedPw = ""; // 사용자가 입력한 비밀번호
		String encryptedDbPw = ""; // DB에 저장된 현재 비밀번호
		String oldPassword = (String) passRow.getAttribute("ENCRYPTED_OLD_PASSWORD"); // 최근 사용했던 비밀번호
		oldPassword = oldPassword == null ? "" : oldPassword;

		/* 2. 기존 비밀번호 여부 체크 */
		logger.logInfo("====== 2. 기존 비밀번호 여부 체크 ======");

		boolean isOriginPassword = isOriginPassword(asPassword);

		// 기존 비밀번호
		if (isOriginPassword) {
			encryptedDbPw = (String) passRow.getAttribute("ENCRYPTED_FOUNDATION_PASSWORD");
			
			logger.logInfo("기존 비밀번호");
		}
		// 임시 비밀번호
		else {
			encryptedDbPw = (String) passRow.getAttribute("ENCRYPTED_TEMPORARY_PASSWORD");
			logger.logInfo("임시 비밀번호");
		}

		// 암호화된 사용자가 입력한 현재 비밀번호
		encryptedPw = getPassword(isOriginPassword, asPassword);

		/* 3. 비밀번호 일치 여부 체크 */
		logger.logInfo("====== 3. 비밀번호 일치 여부 체크 ======");

		logger.logInfo("curPassword : " + encryptedDbPw);
		logger.logInfo("asPassword : " + asPassword);

		if (!encryptedDbPw.equals(encryptedPw)) {
			throw new PosException("기존 비밀번호가 일치하지 않습니다.");
		}

		/* 4. Validation 체크 */
		logger.logInfo("====== 4. Validation 체크 ======");

		// 2023.12.22 - 내부회계 감사 지적사항 개선
		//	최근 사용했던 5개 비밀번호 재사용 불가
		//	문자, 숫자, 특수문자 조합 비밀번호 사용 처리
		String resultValid = checkValidPassword(newPassword);

		if (!resultValid.isEmpty()) {
			throw new PosException(resultValid);
		}

		/* 5. 최근 사용 비밀번호 여부 체크 */
		logger.logInfo("====== 5. 최근 사용 비밀번호 여부 체크 ======");

		if (isUsedPassword(oldPassword, newPassword)) {
			throw new PosException("최근 사용했던 5개 비밀번호는 재사용할 수 없습니다.");
		}

		/* AS_PASSWORD와 NEW_PASSWORD에 put하면 get할 때 우선순위에서 밀림 */
		// 2021.03.02 - 입력받은 비밀번호 대문자변환 처리
		//	MES Portal 기준 협력업체의 경우 사번에 대문자가 포함되는 경우가 많다.
		//	사번으로 비밀번호 초기화 시 대소문자 구분으로 인한 비밀번호 의뢰가 다수 발생
		//	Portal 화면단에 입력받은 비밀번호를 대문자로 치환 처리하였으나,
		//	권한 페이지의 비밀번호 변경 처리 시에는 대소문자가 구분되어 정상적인 로그인이 불가
		//	PDA APP의 별도 배포 없이 동일한 효과를 내기 위해 해당 작업 진행
		//	AS-IS : 화면단에서 대문자 치환 후 처리
		//	TO-BE : JAVA단에서 대문자 치환 후 처리 (PDA APP 별도 배포를 생략하기 위함)
		//			권한 페이지 비밀번호 변경, Portal 비밀번호 변경, MESSecurity.jar 일괄 JAVA단에서 처리
		// 2024.01.09 - getPassword 함수를 이용해 encryptedPw 변수로 대처
//		encAsPw = SapSSO.encrypt(asPassword.toUpperCase());
		String newOldPassword = makeOldPassword(oldPassword, encryptedPw);

		ctx.put("NEW_PASSWORD", SapSSO.encrypt(newPassword.toUpperCase()));
		ctx.put("USER_NO", userNo);
		ctx.put("AS_PASSWORD", encryptedPw);
		ctx.put("OLD_PASSWORD", newOldPassword);

		return "success";
	}

	/**
	 * 변경할 비밀번호 정규식 체크
	 * 
	 * @param newPassword
	 * @return
	 */
	public String checkValidPassword(String newPassword) {
		String retMsg = "";

		Pattern patternAlphabet = Pattern.compile(".*[a-z].*");
		Pattern patternNumber = Pattern.compile(".*\\d.*");
		Pattern patternSpecialChar = Pattern.compile(".*[~!@#\\$%\\^&*\\(\\)\\-=\\+_].*");
		Pattern patternBlank = Pattern.compile(".*\\s.*");

		if (newPassword.length() < 8) {
			retMsg = "비밀번호를 8자 이상 입력하시기 바랍니다.";
		}

		Matcher matcherAlphabet = patternAlphabet.matcher(newPassword);
		if (!matcherAlphabet.matches()) {
			retMsg = "영문[A~Z]이 반드시 포함되어야 합니다.";
		}

		Matcher matcherNumber = patternNumber.matcher(newPassword);
		if (!matcherNumber.matches()) {
			retMsg = "숫자[0~9]가 반드시 포함되어야 합니다.";
		}

		Matcher matcherSpecialChar = patternSpecialChar.matcher(newPassword);
		if (!matcherSpecialChar.matches()) {
			retMsg = "특수문자[~!@#$%^&*\\()-=_+]가 반드시 포함되어야 합니다.";
		}

		Matcher matcherBlank = patternBlank.matcher(newPassword);
		if (matcherBlank.matches()) {
			retMsg = "공백 문자는 사용할 수 없습니다.";
		}

		return retMsg;
	}

	/**
	 * 변경할 비밀번호가 최근 사용했던 5개 비밀번호에 포함되는지 여부를 확인
	 * true가 반환되면 사용할 수 없는 비밀번호
	 * 
	 * @param oldPassword
	 * @param newPassword
	 * @return
	 */
	public boolean isUsedPassword(String oldPassword, String newPassword) {
		return oldPassword.contains(SapSSO.encrypt(newPassword.toUpperCase()));
	}

	/**
	 * 이전 사용 비밀번호 결과를 반환하는 함수
	 * 
	 * 이전 사용 비밀번호가 5개인 경우 가장 왼쪽(오래된 비밀번호) 비밀번호 부터 밀어내고 마지막으로 사용한 비밀번호를 오른쪽에 붙여준다. 
	 * @param oldPassword
	 * @param asPassword
	 * @return
	 */
	public String makeOldPassword(String oldPassword, String asPassword) {
		if (oldPassword.contains("|")) {
			int cnt = oldPassword.length() - oldPassword.replace(String.valueOf("|"), "").length();

			// 이전 사용 비밀번호가 가득 찬 경우 - 비밀번호 밀어내기
			if (cnt == 4) {
				oldPassword = oldPassword.substring(oldPassword.indexOf("|") + 1) + ("|" + asPassword);
			}
			// 이전 사용 비밀번호가 가득차지 않은 경우
			else {
				oldPassword += ("|" + asPassword);
			}
		}
		else {
			// 이전 사용 비밀번호가 없는 경우
			if (oldPassword.isEmpty()) {
				oldPassword += asPassword;
			}
			// 이전 사용 비밀번호가 있는 경우
			else {
				oldPassword += ("|" + asPassword);
			}
		}

		return oldPassword;
	}

	/**
	 * 기존 비밀번호 여부
	 * 
	 * @param userPw
	 * @return
	 */
	public boolean isOriginPassword(String userPw) {
		boolean result = false;

		// 입력 받은 비밀번호가 Prefix 문자열로 시작하거나
		// 				암호화된 Prefix 문자열로 시작하면 임시 비밀번호
		if (!userPw.startsWith(SapSSO.encrypt(PREFIX_TEMP_PASS))) {
			result = true;
		}

		return result;
	}

	/**
	 * 기존 비밀번호 여부에 따라 입력 받은 비밀번호를 반환하는 함수
	 * 
	 * 기존 비밀번호일 경우 사용자가 입력한 비밀번호를 대문자로 치환 후 암호화
	 * 임시 비밀번호일 경우 입력한 비밀번호를 그대로 사용
	 * 
	 * @param isOriginPassword
	 * @param password
	 * @return
	 */
	public String getPassword(boolean isOriginPassword, String password) {
		if (isOriginPassword) {
			return SapSSO.encrypt(password.toUpperCase());
		}
		else {
			return password;
		}
	}

	public static void main(String[] args) {
		System.out.println(SapSSO.encrypt("abcd"));
	}
}
