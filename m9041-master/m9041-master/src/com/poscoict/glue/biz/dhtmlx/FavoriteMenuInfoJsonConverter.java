package com.poscoict.glue.biz.dhtmlx;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import EDU.oswego.cs.dl.util.concurrent.Takable;

import com.google.gson.Gson;
import com.poscoict.glue.dhtmlx.constant.DhtmlxConstantsIF;
import com.posdata.glue.context.PosContext;
import com.posdata.glue.dao.vo.PosRowSetImpl;
import com.posdata.glue.util.log.PosLog;
import com.posdata.glue.util.log.PosLogFactory;

public class FavoriteMenuInfoJsonConverter {
	static PosLog logger = PosLogFactory.getLogger(FavoriteMenuInfoJsonConverter.class);
	
	public String convert(PosContext ctx) {
		StringBuffer sb = new StringBuffer();
		StringWriter sw = new StringWriter();
		PrintWriter pw = new PrintWriter(sw);
		
		try{
		sb.append(makeGrid(ctx));
		}catch(Exception e){
			e.printStackTrace(pw);
			String sStackTrace = sw.toString();

			logger.logError(sStackTrace);
			
		}finally{
			try {
				sw.close();
			} catch (IOException e) {
				logger.logError(e.getMessage());
			}
		}
		return sb.toString().trim();
	}

	/**
	 * @param ctx
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String makeGrid(PosContext ctx) {
		String resultKey = "favoritesMenuResult";

		PosRowSetImpl rowList = (PosRowSetImpl) ctx.get(resultKey);
		
		if(rowList == null){
			Iterator itr = ctx.entrySet().iterator();
			while(itr.hasNext()){
				Map.Entry entry = (Map.Entry)itr.next();
				logger.logError("key:" + entry.getKey());
				logger.logError("value:" + entry.getValue());
			}
		}
			
		List<FavoriteMenuItem> menuList = new ArrayList<FavoriteMenuItem>();
		
		

		Map<String, Object> row;
		for (int i = 0, listSize = rowList.size(); i < listSize; i++) {
			row = (Map<String, Object>) rowList.get(i);

			String hostUrl = String.valueOf(row.get("HOST_URL"));
			String programUrl = String.valueOf(row.get("PROGRAM_URL"));
			String programName = String.valueOf(row.get("PROGRAM_NAME"));
			String programId = String.valueOf(row.get("PROGRAM_ID"));
			String pageId = String.valueOf(row.get("PAGE_ID"));	
			String openType = String.valueOf(row.get("OPEN_TYPE"));	
			String seq = String.valueOf(row.get("SEQ"));	
			String recentAccessTime = String.valueOf(row.get("RECENT_ACCESS"));	
			
			
			programUrl = programUrl.replaceAll("&amp;", "&");
			
			FavoriteMenuItem program = new FavoriteMenuItem();
			
			program.id = pageId;  //메뉴정보를 줄 때는 화면 서비스 번호를 넣는다. 4자리
			program.text = programName;
			
			String linkURL = null;
			if (programUrl.indexOf("?") > 0
					&& programUrl.length() > programUrl.indexOf("?") + 1) {
				linkURL = hostUrl + programUrl + "&pageID=" + program.id;
			} else if (programUrl.indexOf("?") > 0
					&& programUrl.length() == programUrl.indexOf("?") + 1) {
				linkURL = hostUrl + programUrl + "pageID=" + program.id;
			} else {
				linkURL = hostUrl + programUrl + "?pageID=" + program.id;
			}
			
			program.url = linkURL;
			program.programId = programId;
			program.openType = openType;
			program.seq = seq;
			program.recentAccessTime = recentAccessTime;
			
			menuList.add(program);
		}
		
		Gson gson = new Gson();
		String result = gson.toJson(menuList);
		
		return result;
	}

}

class FavoriteMenuItem  {
	String id;
	String text;
	String programId;
	String pageId;
	String url;
	String openType;
	String seq;
	String recentAccessTime;
}