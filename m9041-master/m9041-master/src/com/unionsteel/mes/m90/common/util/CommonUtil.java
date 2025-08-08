/*===========================================================================
*Copyright(c) 2011 유니온스틸
*Change history
*@LastModifyDate : 20111227
*@LastModifier     :  박영진
*@LastVersion      :  1.0
*    2011-12-28   박영진
*        1.0         최초 생성
*
===========================================================================*/
package com.unionsteel.mes.m90.common.util;



import java.util.ArrayList;
import java.util.List;

import com.posdata.glue.PosException;
import com.posdata.glue.context.PosContext;
import com.posdata.glue.dao.PosGenericDao;
import com.posdata.glue.dao.vo.PosParameter;
import com.posdata.glue.dao.vo.PosRow;
import com.posdata.glue.dao.vo.PosRowSet;
import com.posdata.glue.util.log.PosLog;
import com.posdata.glue.util.log.PosLogFactory;
import com.unionsteel.mes.m90.common.constant.M90ConstantsIF;
/**
 * 이 클래스는 물류관리 - 출하관제의 UTIL CLASS 이다.
 * 
 * <xmp>
 *   물류관리 - 출하관제의 UTIL CLASS
 * </xmp>
 * @author 박영진
 *
 */
public class CommonUtil implements M90ConstantsIF{

	PosLog logger = PosLogFactory.getLogger("CommonUtil");
	
	/**
	 * PosRowSet 내의 column값을 반환한다.
	 * 결과 값을 꺼낼 수 없을 경우 ""값을 반환한다.
	 * */
	public Object getRowSetValue(PosContext ctx, String rowsetNm, String colNm){
		
		PosRowSet rowset = (PosRowSet)ctx.get(rowsetNm);
		
		if(rowset == null){
			logger.logDebug("rowset["+rowsetNm+"]이 NULL 입니다.");
			return "";
		} 
		
		PosRow[] row = rowset.getAllRow();
		
		if(row.length < 1){
			logger.logDebug("rowset["+rowsetNm+"]의 ["+colNm+"]값을 가져올 수 없습니다.");
			return "";
		} 
		
		return row[0].getAttribute(colNm);
		
	}
	
	
}
