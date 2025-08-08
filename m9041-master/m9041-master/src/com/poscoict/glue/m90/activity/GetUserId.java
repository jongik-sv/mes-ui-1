package com.poscoict.glue.m90.activity;

import com.posdata.glue.biz.activity.PosActivity;
import com.posdata.glue.context.PosContext;
import com.posdata.glue.dao.vo.PosRow;
import com.posdata.glue.dao.vo.PosRowSet;

/**
 * 이 Activity는 DB에서 조회한 USER_NO 컬럼(사번)의 값을 user_id를 Key로 PosContext에 저장한다
 */
public class GetUserId extends PosActivity{
	public String runActivity(PosContext ctx){
		PosRowSet rowSet = (PosRowSet) ctx.get("USER_INFO");
		
		if(rowSet.hasNext()){
			PosRow row = (PosRow) rowSet.next();
			ctx.put("user_id", row.getAttribute("USER_NO"));
		}
		
		return "success";
	}

}
