/*
 * ==============================================================================
 * Copyright(c) 2011 POSCO ICT
 * Change history
 * @LastModifyDate : 2011.12.15
 * @LastModifier : 송 범 용
 * @LastVersion : 1.0
 * 2011.12.15 송 범 용
 * 1.0 최초 생성
 * ==============================================================================
 */
package com.poscoict.glue.biz.dhtmlx;

import java.util.List;
import java.util.Map;

import com.posdata.glue.PosException;
import com.posdata.glue.biz.activity.PosServiceParamIF;
import com.posdata.glue.biz.constants.PosBizControlConstants;
import com.posdata.glue.context.PosContext;
import com.posdata.glue.dao.PosGenericDao;
import com.posdata.glue.dao.PosQueryStringHelper;
import com.posdata.glue.dao.manager.PosQueryDefinition;
import com.posdata.glue.dao.vo.PosParameter;
import com.posdata.glue.web.security.PosSecurityConstants;
import com.posdata.glue.web.security.PosUser;

/**
 * PosTreeSave Class는 Dhtmlx의 DataProcessor로 처리되어 수정,삭제,추가된 Data를 
 * 추출하여 DB Server로 자동으로 저장하는 Reusable Activity이다. 
 * <xmp> 
 * PosTreeSave는 Dhtmlx의 DataProcessor로 올라온 Data만을 처리 할 수 있다.
 * </xmp>
 */
public class PosTreeSave extends DhtmlxActivity {
    public static final String IDS = "ids"; // TteeROW_ID
    public static final String DELETE_SQL_KEY = "delete_sql";
    public static final String INSERT_SQL_KEY = "insert_sql";
    public static final String DELETE_BIND = "delete_bind";
    public static final String INSERT_BIND = "insert_bind";

    public String doPreActivity(PosContext ctx) {
    	return "";
    }

    public String doPostActivity(PosContext ctx) {
    	return "";
    }

    public String doMainActivity(PosContext ctx) {
		String[] ids = (String[]) ctx.get(IDS);
		PosUser user = (PosUser) ctx.getSessionUserData(PosSecurityConstants.USER);
		if(user == null){
			ctx.setException(new PosException("Session 정보가 없습니다. 다시 로그인 후 시도하시기 바랍니다."));
			return "success";
		}
		Map map = user.getUserInfoMap();
		String userId = (String) map.get("USER_ID").toString();
	
		PosGenericDao dao = this.getDao(this.getProperty(PosServiceParamIF.DAO));
		
		if (ids == null || ids.length < 1)		    throw new PosException("There is no edit data!");
		
		String[] idsValue = ids[0].split(",");
		String deleteSql = this.getProperty(DELETE_SQL_KEY);
		String insertSql = this.getProperty(INSERT_SQL_KEY);
	
		PosParameter deleteWherParam = new PosParameter();
	
		deleteWherParam.setNamedParamter("USER_ID", userId);
		int deletedCt = dao.delete(deleteSql, deleteWherParam);
	
		int seqValue = 10;
		for (int i = 0, n = idsValue.length; i < n; i++) {
			String[] status = (String []) ctx.get(idsValue[i] + "_!nativeeditor_status");
			
			if("deleted".equals(status[0])){
				continue;
			}
		    PosParameter insertWherParam = makePosParameter(ctx, idsValue[i], seqValue, userId, this.getBindingNames(ctx, dao, insertSql));
		    dao.insert(insertSql, insertWherParam);
		    seqValue += 10;
		}
		return PosBizControlConstants.SUCCESS;
    }

	private PosParameter makePosParameter(PosContext ctx, String idxValue, int seq, String userId, List namedParam) {
		String namedParamValue = null;
		PosParameter wherParam = new PosParameter();
		for (int j = 0, listSize = namedParam.size(); j < listSize; j++) {
		    namedParamValue = (String) namedParam.get(j);
	
		    Object bindParam = null;
		    if ("MENU_ID".equals(namedParamValue)) {
				if (ctx.get(idxValue + "_programId") != null) {
				    bindParam = ctx.get(idxValue + "_programId");
				} else {
				    bindParam = Integer.parseInt(idxValue);
				}
	
		    } else if ("USER_ID".equals(namedParamValue)) {
		    	bindParam = userId;
		    } else if ("SEQ".equals(namedParamValue)) {
				if (ctx.get(idxValue + "_seq") != null) {
				    bindParam = ctx.get(idxValue + "_seq");
				} else {
				    bindParam = seq;
				}
		    } else if ("WORK_LOCATION".equals(namedParamValue)) {
		    	bindParam = null;
		    }
	
		    if (bindParam instanceof String[]) {
		    	bindParam = ((String[]) bindParam)[0];
		    }
		    
		    logger.logInfo("###########bindParam ##########" + bindParam);
	
		    wherParam.setNamedParamter(namedParamValue, bindParam);
		}
	
		return wherParam;
    }

    /**
     * 이 메소드는 지정한 Query ID에서 Named Param를 추출하여 Return하는 메소드이다.
     * 
     * @param dao
     *            DAO bean id
     * @param key
     *            query id
     * @return List - Named Param List
     */
    protected List getBindingNames(PosContext ctx, PosGenericDao dao, String key) {
	PosQueryDefinition def = dao.getQueryManager().getQueryDefinition(key);
	if (def.isIncludedNamedParameter()) {
	    if (def.getNamedParameter() == null) {
		def = PosQueryStringHelper.createQueryDefinition(def,
			def.getQueryStatement(true));
	    }
	    return def.getNamedParameter();
	} else {
	    throw new PosException("check query definition.[isNamed=\"true\"]");
	}

    }

    private int insert(PosContext ctx, String rowId, String sqlKey, String[] bind, PosGenericDao dao) {
		PosParameter valueParam = new PosParameter();
		String[] bindParam = (String[]) ctx.get(rowId);
		int bindIdx = -1;
		for (int i = 0; i < bind.length; i++) {
		    try {
				bindIdx = Integer.parseInt(bind[i]);
				String bindData = null;
				if (bindParam[bindIdx] != null) {
				    bindData = bindParam[bindIdx].trim();
				}
				valueParam.setValueParamter(i, bindData);
		    } catch (NumberFormatException e) {
				Object data = ctx.get(bind[i]);
				if (data instanceof String[]) {
				    valueParam.setValueParamter(i, ((String[]) data)[0].trim());
				} else {
				    valueParam.setValueParamter(i, data);
				}
		    }
		}
		int count = dao.insert(sqlKey, valueParam);
		return count;
    }

    @Override
    public String getDefaultMsgCode() {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public String[] getDefaultMsgParam(PosContext arg0) {
	// TODO Auto-generated method stub
	return null;
    }
}