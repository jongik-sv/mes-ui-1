/* ==============================================================================
 * Copyright(c) 2016 UNIONSTEEL
 * @FileName : B30R4010.java
 * Change history
 * @LastModifyDate : 2015. 01. 10
 * @LastModifier : 김종화
 * @LastVersion : 1.0
 * 1.0 2016. 01. 10     김종화    최초 생성
 * ==============================================================================
 */
package com.unionsteel.mes.m90.activity.nui;

import com.poscoict.glue.biz.dhtmlx.DhtmlxActivity;
import com.posdata.glue.biz.constants.PosBizControlConstants;
import com.posdata.glue.context.PosContext;
import com.posdata.glue.dao.PosGenericDao;
import com.posdata.glue.dao.vo.PosParameter;
import com.posdata.glue.dao.vo.PosRow;
import com.posdata.glue.dao.vo.PosRowSet;
import com.unionsteel.mes.m90.common.constant.M90ConstantsIF;
//import com.unionsteel.mes.m30.activity.common.M30ErrorRgs;
/**
 * ERP(MM)로부터 부재료표준단가를 수신 받아 I/F수신 Table에서 업무Table로 정보를 EDIT(Inser/Update)처리  
 * <xmp>
 * 사용방법
 * <activity name="부재료표준단가 동기화" class="com.unionsteel.mes.m30.activity.nui.B30R4030">
 *  	<transition name="success" value="end" />
 *		<transition name="failure" value="end" />
 *	</activity>
 * 
 * @author 김종화
 * @version 1.0
 */

public class B90R0010 extends DhtmlxActivity{
	/**
	 * ERP(MM)로부터 부재료표준단가를 수신 받아 I/F수신 Table에서 업무Table로 정보를 EDIT(Inser/Update)처리   
	 * 
	 * @param ctx PosContext 객체
	 * @return String - 분기 될 Transaction name을 리턴한다. 
	 */
	@Override
	public String doMainActivity(PosContext ctx) {
		String result = PosBizControlConstants.SUCCESS;
		PosGenericDao dao 	= this.getDao(M90ConstantsIF.M90DAO);
		PosGenericDao eaidao= this.getDao(M90ConstantsIF.EAIDAO);
		PosParameter param = new PosParameter();
				
		//Group_id를 수신받아 해당 Group_id의 공급업체코드 조회
		PosRowSet rowset = (PosRowSet)ctx.get(M90ConstantsIF.XML_RESULT);
		//부재료표준단가 동기화 수신 데이터가 있다면  공급업체코드테이블(TB_M30_SMTL_UNT_PRC)에 등록
		if(rowset.count()>0){
			param.setNamedParamter("IF_GRP_ID", ctx.get("IF_GRP_ID"));
			param.setNamedParamter("EMP_ID", ctx.get("EMP_ID"));
			param.setNamedParamter("EMP_NM", ctx.get("EMP_NM"));
			param.setNamedParamter("ObjectType"	, ctx.get(M90ConstantsIF.OBJECT_TYPE));
			param.setNamedParamter("ObjectId"	, ctx.get(M90ConstantsIF.OBJECT_ID));
			param.setNamedParamter("ProgramId"	, ctx.get(M90ConstantsIF.PROGRAM_ID));
			param.setNamedParamter("Timestamp"	, ctx.get(M90ConstantsIF.TIMESTAMP));
			
			int success_yn = 0;
			// 부재료표준단가 테이블(TB_M30_SMTL_UNT_PR)에 등록
			success_yn = dao.insert(M90ConstantsIF.USER_PRC_INSERT_SQL , param);
			
			if(success_yn < 0){
				//ctx.put("XMSGS", M90ConstantsIF.ERP_ERROR_MSG_2);
				return PosBizControlConstants.FAILURE;
			}
			// 부재료표준단가수신 테이블(TB_M30_B30R4030)에 등록
			/*
			success_yn = eaidao.update(M90ConstantsIF.SMTL_PRC_ERP_SUCCESS_SQL , param);
			if(success_yn < 0){
				return PosBizControlConstants.FAILURE;
			}
			*/			
			//데이터 등록이 제대로 이루어 졌다면 SUCCESS 아니면 FAILURE 리턴
			if(success_yn>0){
				result = PosBizControlConstants.SUCCESS;
			}else{
				result = PosBizControlConstants.FAILURE;				
			}
		}else{
			//등록할 데이터가 없다면 데이터 변화없이 종료
			result = "nocnt";
		}
		return result;
	}

	@Override
	public String doPostActivity(PosContext arg0) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String doPreActivity(PosContext arg0) {
		// TODO Auto-generated method stub
		return null;
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
