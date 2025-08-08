package com.unionsteel.mes.m90.activity.nui;

import com.posdata.glue.dao.PosGenericDao;
import com.posdata.glue.dao.vo.PosParameter;
import com.posdata.glue.util.log.PosLog;
import com.posdata.glue.util.log.PosLogFactory;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * IRiS 그룹웨어 메일 전송 프로그램 with template
 */
public class SendMailByIris {
	protected static PosLog logger = PosLogFactory.getLogger(SendMailByIris.class);

	private final String programId;
	private final String userId;
	private String senderEmail;
	private final List<String> receiverEmail = new ArrayList<String>();
	private String title;
	private String templatePath;
	private final Map<String, String> templateMap = new HashMap<String, String>();
	private final PosGenericDao dao;

	public SendMailByIris(PosGenericDao dao, String programId, String userID) {
		this.dao = dao;
		this.programId = programId;
		this.userId = userID;
	}

	public void sendMail() {
//		if (senderEmail == null || senderEmail.isEmpty())
//			throw new RuntimeException("발신자가 존재하지 않습니다. 발신자는 필수 항목입니다.");
		if (title == null || title.isEmpty())
			throw new RuntimeException("제목이 존재하지 않습니다. 제목은 필수 항목입니다.");
		if (receiverEmail.size() == 0)
			throw new RuntimeException("수신자가 존재하지 않습니다. 수신자는 최소한 한 명 이상이어야 합니다.");

		String template = getTemplate(templatePath);
		if (!template.isEmpty()) {
			logger.logInfo("template 생성");
			for (Map.Entry<String, String> stringStringEntry : templateMap.entrySet()) {
				template = template.replaceAll("\\{\\{" + stringStringEntry.getKey() + "\\}\\}", stringStringEntry.getValue());
			}
		}

		PosParameter posParameter = new PosParameter();
		StringBuilder toEmails = new StringBuilder();
		for (int i = 0; i < receiverEmail.size(); i++) {
			toEmails.append(receiverEmail.get(i));
			if (i != receiverEmail.size() - 1)
				toEmails.append(",");
		}
		posParameter.setNamedParamter("fromEmail", senderEmail);
		posParameter.setNamedParamter("toEmails", toEmails.toString());
		posParameter.setNamedParamter("subject", title);
		posParameter.setNamedParamter("content", template);
		posParameter.setNamedParamter("systemCode", "MES-" + programId);
		posParameter.setNamedParamter("userId", userId);

		dao.insert("email.send.procedure", posParameter);
	}

	private static String getTemplate(String path) {
		StringBuilder stringBuilder = new StringBuilder();

		InputStream fileInputStream = null;
		BufferedReader bufferedReader = null;
		try {
			fileInputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(path);
			bufferedReader = new BufferedReader(new InputStreamReader(fileInputStream, "utf-8"));
			String line;
			while ((line = bufferedReader.readLine()) != null) {
				stringBuilder.append(line);
			}
		}
		catch (FileNotFoundException e) {
			logger.logError(e.getMessage(), e);
		}
		catch (UnsupportedEncodingException e) {
			logger.logError(e.getMessage(), e);
		}
		catch (IOException e) {
			logger.logError(e.getMessage(), e);
		}
		finally {
			if (bufferedReader != null) {
				try {
					bufferedReader.close();
				}
				catch (IOException e) {
					e.printStackTrace();
				}
			}
			else if (fileInputStream != null) {
				try {
					fileInputStream.close();
				}
				catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

		return stringBuilder.toString();
	}

	public void addReceiver(String email) {
		this.receiverEmail.add(email);
	}

	public void addTemplateMapping(String key, String value) {
		this.templateMap.put(key, value);
	}

	public void setSenderEmail(String senderEmail) {
		this.senderEmail = senderEmail;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setTemplatePath(String templatePath) {
		this.templatePath = templatePath;
	}
}
