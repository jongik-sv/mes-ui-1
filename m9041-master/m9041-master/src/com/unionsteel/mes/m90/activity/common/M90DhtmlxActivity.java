/*===========================================================================
*Copyright(c) 2011 유니온스틸
*Change history
*@LastModifyDate : 20120306
*@LastModifier     :  박영진
*@LastVersion      :  1.0
*    2012-03-06   박영진
*        1.0         최초 생성
*
===========================================================================*/
package com.unionsteel.mes.m90.activity.common;

import java.util.ArrayList;
import java.util.List;

import com.poscoict.glue.biz.dhtmlx.DhtmlxActivity;
import com.poscoict.glue.biz.dhtmlx.form.FormSearch;
import com.poscoict.glue.biz.dhtmlx.grid.GridSearch;
import com.poscoict.glue.dhtmlx.util.ActivityUtil;
import com.posdata.glue.PosException;
import com.posdata.glue.context.PosContext;
import com.posdata.glue.dao.PosGenericDao;
import com.posdata.glue.dao.manager.PosQueryDefinition;
import com.posdata.glue.dao.vo.PosParameter;
import com.posdata.glue.dao.vo.PosRow;
import com.posdata.glue.dao.vo.PosRowSet;
import com.posdata.glue.dao.vo.PosRowSetImpl;
import com.posdata.glue.web.security.PosSecurityConstants;
import com.posdata.glue.web.security.PosUser;
import com.unionsteel.mes.m90.common.constant.M90ConstantsIF;

/**
 * 이 클래스는 출하관제의 상속받기 위한 공통 CLASS 이다.
 * 
 * <xmp>
 * 사용방법
 * 
 * Property 상세
 *   
 * </xmp>
 * @author 박영진
 *
 */

public class M90DhtmlxActivity extends DhtmlxActivity implements M90ConstantsIF  {

	/**
	 * 이 Activity는 Dhtmlx용 공통 Activity에 대한 Main 기능  전에 수행해야 할 내용에 대한 추상 Method이다
	 * 이 Class를 상속받는 Activity는 이 Method를 정의하도록 한다
	 * @param poscontext PosContext 객체
	 * @return Strind - "" 현재 정해진 기능은 없다.
	 */
	public String doPreActivity(PosContext poscontext) {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * 이 Activity는 Dhtmlx용 공통 Activity에 대한 Main 기능을 수행하는 추상 Method이다
	 * 이 Class를 상속받는 Activity는 이 Method를 정의하도록 한다
	 * @param poscontext PosContext 객체
	 * @return String - transition명으로 일반적으로 success또는 failure를 지정한다
	 */
	public String doMainActivity(PosContext poscontext) {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * 이 Activity는 Dhtmlx용 공통 Activity에 대한 Main 기능  후에 수행해야 할 내용에 대한 추상 Method이다
	 * 이 Class를 상속받는 Activity는 이 Method를 정의하도록 한다
	 * @param poscontext PosContext 객체
	 * @return "" 현재 정해진 기능은 없다.
	 */
	public String doPostActivity(PosContext poscontext) {
		// TODO Auto-generated method stub
		if(poscontext.get(COLUMN_INFO) != null && poscontext.get(COLUMN_INFO) instanceof String[])
			poscontext.put(COLUMN_INFO, ((String[])poscontext.get(COLUMN_INFO))[0]);
		
		return null;
	}

	/**
	 * 이 메소드는 Reusable Component 제작 시 Default Message Key를 지정하는 추상 메소드이다. 
	 * @return String 해당 Activity에서 지정한 default Message key
	 */
	public String getDefaultMsgCode() {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * 이 메소드는 Reusable Component 제작 시 Default Message Key에 Binding할 변수를 리턴하는 추상 메소드이다. 
	 * @return String[] 해당 Activity에서 지정한 default Message에 Biding할 변수에 대한 배열
	 */
	public String[] getDefaultMsgParam(PosContext poscontext) {
		// TODO Auto-generated method stub
		return null;
	}
	
	/**
	 * 이 메소드는 화면에 보여줄 메세지를 생성하는 메소드이다. 
	 * Reusable Component의 경우 Activity의 종류에 따라 자동으로 Default Message를 보여주도록 되어 있다 
	 * 
	 * 체크 로직은 아래와 같다
	 * 0. glue-gun에서 제공하는 Reusable Component는 Default Message를 가지고 있다
	 * 1. (기존 다른 Activity에서 생성한 )msgApp가 없다면 무조건 메세지를 생성한다
	 * 2. msg-code를 지정하지 않으면 Custom Activity의 경우 Skip하고 
	 *    Reusable Activity는 Default msg-code를 부여한다
	 * 3. 이전  Activity에서 생성한 메세지의 우선순위와 비교하여 우선순위가 높은 메세지를 저장한다
	 * 
	 * @param ctx PosContext 객체
	 * @param Object 조회용 Activity의 경우 건수를 알아오기 위한 PosRowSet과 같은 객체
	 * @return String 생성한 Message
	 */
	protected String makeMessage(PosContext ctx, Object object){
		
		Integer msgOrder = new Integer(this.getProperty(PN_MSG_ORDER, PV_LOWEST_PRIORITY));
		Integer prevMsgOrder = ctx.get(STR_APP_MSG_ORDER) == null ? new Integer(999): (Integer)ctx.get(STR_APP_MSG_ORDER);
		
		/* msg-order가 우선 순위가 낮으면(숫자가 더 크면) Skip  */
		if(ctx.get(STR_APP_MSG) != null && msgOrder.compareTo(prevMsgOrder) >= 0)	return STR_BLANK_STRING;
		
		/* 화면에 보여줄 메세지 코드를 가져온다. 
		 * property [msg-code]를 지정하지 않으면 Default Code 값을 가져온다. 
		 */
		String msgCode = this.getProperty(PN_MSG_CODE);
		String[] msgParam = null;

		if( msgCode == null){
			msgCode = this.getDefaultMsgCode();
			msgParam = this.getDefaultMsgParam(ctx);
		} else {
			int count = this.getIntProperty(PN_MSG_PARAM_COUNT);

			if(count >= 0){
				msgParam = new String[count];
				String propertyValue = null;
				for (int i = 0; i < count; i++) {
					propertyValue = this.getProperty(PN_MSG_PARAM + i);
					
					/* 송범용 : 모든 Activity에서 PosContext에 ROW_COUNT를 넣는 것은 비효율적임. 로직 변경*/
					if(PV_ROW_COUNT.equals(propertyValue)){
						if(object instanceof PosRowSet || object instanceof List){
							msgParam[i] = String.valueOf(((PosRowSet) object).count());
						} else {
							msgParam[i] = (String) object;
						}
					} else {
						msgParam[i] = ActivityUtil.convertToString(ctx.get(propertyValue));
					}
				}
			}
		}
		
		if(msgCode == null) return STR_BLANK_STRING;
		
		String appMsg = makeMessage(ctx, msgCode, msgParam);
		
		if(logger.isDebugEnabled())	logger.logDebug("생성된메세지 : " + appMsg + ", 우선순위 : " + msgOrder);
		
		ctx.put(STR_APP_MSG, appMsg);
		ctx.put(STR_APP_MSG_ORDER, msgOrder);
		
		return appMsg;
	}
	
	/**
	 * 이 메소드는 PosRowSet에 컬럼을 추가하는 메서드 이다.
	 * 
	 * @param ctx PosContext 객체
	 *         resultkey PosRowSet의 ID
	 *         val rowset에 추가할 value
	 *         columnId value를 담을 ID 
	 */
	
	public void setColToRowSet(PosContext ctx, String resultkey, String val, String columnId){
		
		PosRowSet rowset = (PosRowSet)ctx.get(resultkey);
		
		PosRow[] row = rowset.getAllRow();
		
		List list = new ArrayList();
		
		for(int i = 0 ; i < row.length ; i++){
			
			row[i].setAttribute(columnId, val);
			list.add(row[i]);
			
		}
		
		PosRowSet tmpRowSet = new PosRowSetImpl(list);
		
		ctx.put(resultkey, tmpRowSet);
	}
	

	/**
	 * 입력받은 중계테이블에 callback을 한다.
	 * @param ctx PosContext 객체
	 *         tableName callback을 할 중계테이블 name
	 *         XMSGS callback 메세지
	 *         flag exception 여부(true : exception, flase : pass)
	 * */
	public void setCallbackData(PosContext ctx, String tableName, String XMSGS, boolean flag){
		
		PosGenericDao dao = getDao(EAIDAO);
		
		rollbackTransaction("tx1");
		rollbackTransaction("tx2");
		
		String updateSqlKey = "CommonQry.updateEAITable";
		
		List list = this.getBindingNames(ctx, dao, updateSqlKey);
		
		//쿼리 정의 load
		PosQueryDefinition def = dao.getQueryManager().getQueryDefinition(updateSqlKey);
		
		//쿼리 String get
		String updateSql = def.getQueryStatement();
		
		//해당 부분 replace
		String tmpSql = updateSql.replaceAll("#TABLE_NAME#", tableName);
		
		//쿼리 String set
		def.setQueryStatement(tmpSql);
		
		PosParameter whereParam = new PosParameter();
		
		ctx.put("XMSGS", XMSGS);
		
		setPosParameterAllNamed(ctx, whereParam, list);
		
		/* Excute DAO Action */
		int cnt = dao.update(updateSqlKey, whereParam);
		
		//쿼리 String set
		def.setQueryStatement(updateSql);
		
		commitTransaction("tx2");
		
		if(flag){
			throw new PosException(XMSGS);
		}
		
	}
	
	/**
	 * 이 메소드는 그리드의 변경 된 rowID들을 배열로 return받는 메서드 이다.
	 * 
	 * @param ctx PosPosContext 객체
	 * @return record ID 의 String 배열
	 */
	public String[] getIdsValue(PosContext ctx){
		String ids[] = (String[])ctx.get("ids");
        if(ids == null || ids.length < 1)
            throw new PosException("There is no edit data!");
        String idsValue[] = ids[0].split(",");
        return idsValue;
	}
	

	/**
	 * 이 메소드는  DAO Query 실행 시 Bind 객체인 PosParameter 객체를 생성하여 Retrun하는 메소드이다. 
	 * @param ctx PosContext 객체
	 * @param idx DhtmlxGrid의 Row Index
	 * @param namedParam 화면 DhtmlxGrid에서 넘어온 Parameter의 Key
	 * @return PosParameter 객체
	 */
	public PosParameter makePosParameter(PosContext ctx, String idx, List namedParam)
    {
        String namedParamValue = null;
        PosParameter wherParam = new PosParameter();
        logger.logDebug("----- named param ------------------------");
        int j = 0;
        for(int listSize = namedParam.size(); j < listSize; j++)
        {
            namedParamValue = (String)namedParam.get(j);
            Object bindParam = ctx.get((new StringBuilder(String.valueOf(idx))).append("_").append(namedParamValue).toString());
            if(bindParam instanceof String[])
                bindParam = ((String[])bindParam)[0];
            logger.logDebug((new StringBuilder(String.valueOf(namedParamValue))).append(" : ").append(bindParam).toString());
            wherParam.setNamedParamter(namedParamValue, bindParam);
        }

        return wherParam;
    }
	
	/**
	 * 이 메소드는 해당 recordId의 record가 Insert, Update, Delete인지 리턴하는 메서드 이다.
	 * 
	 * @param ctx PosPosContext 객체
	 * @param ids record ID
	 * @return record ID 의 String 배열
	 */
	public String getDMLType(PosContext ctx, String ids)
    {
        String status[] = (String[])ctx.get((new StringBuilder(String.valueOf(ids))).append("_!nativeeditor_status").toString());
        logger.logDebug((new StringBuilder("DMLType - ")).append(ids).append("_!nativeeditor_status").append(" : ").append(status[0]).toString());
        if(status != null && "inserted".equals(status[0]))
            return "INSERT";
        if(status != null && "deleted".equals(status[0]))
            return "DELETE";
        if(status == null || "updated".equals(status[0]))
        {
            return "UPDATE";
        } else
        {
        	logger.logDebug("PosSaveByName.getQueryType : 정의되지 않은 타입입니다.");
            return "";
        }
    }
	
	/**
	 * 이 메소드는  DAO Query 실행 시 Bind 객체인 PosParameter 객체를 생성하여 Retrun하는 메소드이다. 
	 * @param ctx PosContext 객체
	 * @param idx DhtmlxGrid의 Row Index
	 * @param namedParam 화면 DhtmlxGrid에서 넘어온 Parameter의 Key
	 * @return PosParameter 객체
	 */
	public PosParameter makePosParameter(PosContext ctx, String dmlType, String idx, List namedParam)
    {
		String namedParamValue = null;
        PosParameter wherParam = new PosParameter();
        logger.logDebug("----- named param ------------------------");
        int j = 0;
        for(int listSize = namedParam.size(); j < listSize; j++)
        {
            namedParamValue = (String)namedParam.get(j);
            Object bindParam = ctx.get((new StringBuilder(String.valueOf(idx))).append("_").append(namedParamValue).toString());
            if(bindParam instanceof String[])
                bindParam = ((String[])bindParam)[0];
            logger.logDebug((new StringBuilder(String.valueOf(dmlType))).append(" - ").append(namedParamValue).append(" : ").append(bindParam).toString());
            wherParam.setNamedParamter(namedParamValue, bindParam);
        }

        return wherParam;
    }

}
