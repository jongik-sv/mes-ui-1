/*===========================================================================
*Copyright(c) 2011 유니온스틸
*@FileName : LoopRouter.java
*Change history
*@LastModifyDate : 20111227
*@LastModifier     :  박영진
*@LastVersion      :  1.0
*    2011-12-28   박영진
*        1.0         최초 생성
*
===========================================================================*/
package com.unionsteel.mes.m90.activity.common;

import com.poscoict.glue.biz.dhtmlx.DhtmlxActivity;
import com.posdata.glue.PosException;
import com.posdata.glue.biz.activity.PosActivity;
import com.posdata.glue.biz.constants.PosBizControlConstants;
import com.posdata.glue.context.PosContext;
import com.unionsteel.mes.m90.common.constant.M90ConstantsIF;


/**
 * 이 클래스는 화면의 grid에서 dml된 row로 LOOP를 하는 custom Activity 이다.
 * 
 * <xmp>
 * 사용방법
  <activity name="LOOP_ROUTER" class="com.unionsteel.mes.m60.activity.common.LoopRouter">
    <transition name="endLoop" value="end" />
    <transition name="UPDATE" value="checkFlag" />
    <transition name="INSERT" value="상차편성공통저장" />
    <transition name="DELETE" value="상차편성공통저장" />
  </activity>
 * 
 * Property 상세
 *   
 * </xmp>
 * @author 박영진
 *
 */
public class LoopRouter extends PosActivity implements M90ConstantsIF{

	@Override
	/**
     * 이 메소드는 메인 메소드이다.
     * @param PosContext
     * @return String
     */
	public String runActivity(PosContext ctx) {
		
		// M42IDS의 이름의 키가 ctx에 존재하지 않을 때 해당 키로 맵을 만듦. 
		if(ctx.get(M90IDS) == null){
        	ctx.put(M90IDS, (String[])ctx.get(IDS));
        }
		
		String ids[] = (String[])ctx.get(M90IDS);
		
        if(ids == null || ids.length < 1)
            throw new PosException(LOG_STANDARD_OF_JUDGE_EMPTY_CASE);
        
        String idsValue[] = ids[0].split(DELIMITER_SPLIT);
        
        int i = (Integer)ctx.get(LOOP_CNT) == null ? 0 : (Integer)ctx.get(LOOP_CNT);
        
        // ctx에 loop-cnt로 닮긴 값이 grid에서 넘겨받은 resultkey에 존재하는 row의 개수보다 작으면
        if(i < idsValue.length)
        {
        	// 하나의 row만큼 resultkey 에 담고
        	String[] tmp = new String[1];
        	tmp[0] = idsValue[i];
        	ctx.put(IDS, tmp);
        	
        	// resultkey에 담긴 모든 항목의 값을 ctx에 담아 각 column 이름을 키로 값을 매핑하여 ctx에 담는다. 
        	getRecordToNormalValue(ctx, idsValue[i]);

        	// 다음 row를 ctx에 담기 위해 loop-cnt를 하나 증가 시켜 ctx에 담는다.
        	i++;
        	ctx.put(LOOP_CNT, i);
        	
        	//Loop 계속
            return PosBizControlConstants.SUCCESS;
            
        }
		
        ctx.put(IDS, ctx.get(M90IDS));

        //Loop 종료
		return LOOP_END;
	}

	/**
     * 이 메소드는 returnkey로부터 string 값으로 record를 얻는 메소드이다.
     * @param PosContext, string
     */
	public void getRecordToNormalValue(PosContext ctx, String recordId){
		if(ctx.get(COLUMN_INFO_M90) == null)
		{
			ctx.put(COLUMN_INFO_M90, ctx.get(COLUMN_INFO));
		}
		String[] columnInfo = (String[])ctx.get(COLUMN_INFO_M90);
		
		String [] colOrder = columnInfo[0].split(DELIMITER_SPLIT);
		String[] tmp = null;
		
		for(int i = 0 ; i < colOrder.length; i++){

			// ctx의 resultkey에 담긴 모든 정보를 담는다.
			tmp = (String[])ctx.get(recordId+"_"+colOrder[i]);
			
			logger.logDebug(colOrder[i]);
			
			// ctx에 담긴 모든 정보를 해당하는 column 이름으로 ctx에 담는다.
			ctx.put(colOrder[i], tmp[0]);
		}
	}
}