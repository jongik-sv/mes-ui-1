package com.unionsteel.mes.m90.activity.common;

import java.util.*;

import com.posdata.glue.biz.constants.PosBizControlConstants;
import com.posdata.glue.context.PosContext;
import com.posdata.glue.dao.vo.PosRow;
import com.posdata.glue.dao.vo.PosRowSet;
import com.posdata.glue.dao.vo.PosRowSetImpl;
import com.unionsteel.mes.m90.activity.common.M90GridActivity;
import com.unionsteel.mes.m90.common.constant.M90ConstantsIF;

public class RowSetLoopRouter extends M90DhtmlxActivity implements M90ConstantsIF{

	@Override
	public String doMainActivity(PosContext ctx) {		
		
		String loopCntNm = getProperty(LOOP_CNT) == null ? LOOP_CNT : getProperty(LOOP_CNT) ;
		
		PosRowSet rowset = (PosRowSet)ctx.get(getProperty(BIND_KEY));
		String resultkey = getProperty(RESULTKEY);
		PosRow [] row = rowset.getAllRow();
		List list = new ArrayList();
		
		int loopCnt = (Integer)ctx.get(loopCntNm) == null ? 0 : (Integer)ctx.get(loopCntNm); 
		
		logger.logDebug("************loopCnt : "+loopCnt);
		
		logger.logDebug("************rowset.count() : "+rowset.count());
		
		if(loopCnt < rowset.count())
		{
			list.add(row[loopCnt]);
			PosRowSet rowSet = new PosRowSetImpl(list);
			ctx.put(resultkey, rowSet);
			ctx.setRowSet(resultkey, rowSet);
			
			loopCnt++;
			ctx.put(loopCntNm, loopCnt);
			
			//return M90ConstantsIF.NEXT;
			//return PosBizControlConstants.SUCCESS;
			return M90ConstantsIF.SUCCESS;
		}
		ctx.put(loopCntNm, 0);
		//return M90ConstantsIF.SUCCESS;
		return LOOP_END;
	}
	
}
