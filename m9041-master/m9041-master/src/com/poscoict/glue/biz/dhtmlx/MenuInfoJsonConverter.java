package com.poscoict.glue.biz.dhtmlx;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.Gson;
import com.posdata.glue.context.PosContext;
import com.posdata.glue.dao.vo.PosRowSetImpl;
import com.posdata.glue.util.log.PosLog;
import com.posdata.glue.util.log.PosLogFactory;

public class MenuInfoJsonConverter {
	public String convert(PosContext ctx) {
		StringBuffer sb = new StringBuffer();
		try{
			sb.append(makeGrid(ctx));
		}
		catch(Exception e){
			PosLog logger = PosLogFactory.getLogger(getClass());
			
			StringWriter sw = new StringWriter();
			PrintWriter pw = new PrintWriter(sw);
			e.printStackTrace(pw);
			String sStackTrace = sw.toString(); // stack trace as a string
			
			pw.close();
			try {
				sw.close();
			} catch (IOException e1) {
				e1.printStackTrace();
			}
			logger.logError(sStackTrace);
		}
		return sb.toString().trim();
	}

	/**
	 * @param ctx
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private String makeGrid(PosContext ctx) {
		Object appMsg = ctx.get("appMsg") != null ? ctx.get("appMsg") : "";

		Map<String, Object> menus = new HashMap<String, Object>();
		menus.put("appMsg", appMsg);

		/* Error Message */
		Throwable error = ctx.getException();
		if (error != null) {
			menus.put("errMsg", "SQL 오류가 발생 했습니다.");
		}

		String resultKey = "xml-result";

		PosRowSetImpl rowList = (PosRowSetImpl) ctx.get(resultKey);
		Map<String, Integer> taskMap = new HashMap<String, Integer>();

		// CHAIN_NAME,CHAIN_ID,TASK_NAME,TASK_ID,PROGRAM_NAME,PROGRAM_ID,HOST_URL,PROGRAM_URL,PAGE_ID,DISPLAY_FLAG,PROMPT_DISPLAY_FLAG
		Map<String, Object> row;
		for (int i = 0, listSize = rowList.size(); i < listSize; i++) {
			row = (Map<String, Object>) rowList.get(i);
			String chainId = (String) row.get("CHAIN_ID");

			if (!menus.containsKey(chainId)) {
				ChainMenu chainMenu = new ChainMenu();
				chainMenu.id = chainId;
				chainMenu.text = (String) row.get("CHAIN_NAME");
				chainMenu.seq = ((BigDecimal) row.get("CHAIN_SEQ"));
				String displayFlag = ((String) row.get("DISPLAY_FLAG"));
				
				if(displayFlag != null)
					chainMenu.visible = displayFlag.equals("1") ? true : false;
				else
					chainMenu.visible = false;
				
				menus.put(chainId, chainMenu);
			}

			ChainMenu selectedChain = (ChainMenu) menus.get(chainId);

			String taskId = (String) row.get("TASK_ID");
			if (!taskMap.containsKey(taskId)) {
				ChainMenu chainMenu = new ChainMenu();
				chainMenu.id = taskId;
				chainMenu.text = (String) row.get("TASK_NAME");
				chainMenu.visible = true;

				ArrayList<ChainMenuItem> items = selectedChain.items;

				taskMap.put(taskId, items.size());

				items.add(chainMenu);
			}

			ChainMenu selectedTask = (ChainMenu) selectedChain.items
					.get(taskMap.get(taskId));

			String programUrl = (String) row.get("PROGRAM_URL");
			if (programUrl != null) {
				programUrl = programUrl.replaceAll("&amp;", "&");
			}
			String hostUrl = (String) row.get("HOST_URL");
			String openType = (String) row.get("OPEN_TYPE");
			BigDecimal programIdDec = ((BigDecimal) row.get("PROGRAM_ID"));
			String programId = "";
			if (programIdDec != null)
				programId = programIdDec.toString(); // 3232 숫자 4자리

			String pageId = (String) row.get("PAGE_ID"); // M471010010
			String isAuth = (String) row.get("IS_AUTH");
			String bookmarked = (String) row.get("BOOKMARKED");
			String programName = (String) row.get("PROGRAM_NAME");
			String promptDisplayFlag = (String) row.get("PROMPT_DISPLAY_FLAG");

			Program program = new Program();

			program.id = pageId; // 메뉴정보를 줄 때는 화면 서비스 번호를 넣는다. 4자리
			program.text = programName;

			if (promptDisplayFlag != null) {
				program.visible = (promptDisplayFlag).equals("1") ? true
						: false;
			} else {
				program.visible = false;
			}

			HashMap<String, String> userdata = new HashMap<String, String>();

			String linkURL = null;
			if (programUrl != null) {
				if (programUrl.indexOf("?") > 0
						&& programUrl.length() > programUrl.indexOf("?") + 1) {
					linkURL = hostUrl + programUrl + "&pageID=" + program.id;
				} else if (programUrl.indexOf("?") > 0
						&& programUrl.length() == programUrl.indexOf("?") + 1) {
					linkURL = hostUrl + programUrl + "pageID=" + program.id;
				} else {
					linkURL = hostUrl + programUrl + "?pageID=" + program.id;
				}
			}
			userdata.put("url", linkURL);
			userdata.put("programId", programId);
			if (openType == null || openType.equals("")) {
				// 오픈 타입이 없으면 아무것도 안함
			} else {
				userdata.put("openType", openType);
			}

			if (isAuth == null || isAuth.equals("")) {
				// 오픈 타입이 없으면 아무것도 안함
			} else {
				userdata.put("isAuth", isAuth);
			}

			if (bookmarked == null || bookmarked.equals("")) {
				// 오픈 타입이 없으면 아무것도 안함
			} else {
				userdata.put("bookmarked", bookmarked);
			}

			program.userdata = userdata;
			selectedTask.items.add(program);
		}

		Gson gson = new Gson();
		String result = gson.toJson(menus);

		return result;
	}
}

class ChainMenu implements ChainMenuItem {
	String id;
	String text;
	Boolean visible;
	BigDecimal seq;
	ArrayList<ChainMenuItem> items;

	public ChainMenu() {
		items = new ArrayList<ChainMenuItem>();
	}
}

interface ChainMenuItem {
	// ArrayList<ChainMenuItem> getItems();
}

class Program implements ChainMenuItem {
	String id;
	String text;
	Boolean visible;
	Map<String, String> userdata;

	public Program() {
		userdata = new HashMap<String, String>();
	}
}
