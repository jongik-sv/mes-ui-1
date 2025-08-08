/*===========================================================================
*Copyright(c) 2018 동국제강
*Change history
*@LastModifyDate : 20180504
*@LastModifier     :  이돈석
*@LastVersion      :  1.0
*    2018-05-04   이돈석
*        1.0         최초 생성
*
===========================================================================*/
package com.unionsteel.mes.m90.common.constant;

import com.posdata.glue.biz.constants.PosBizControlConstants;
/**
 * 이 인터페이스는 MES공통의 상수정의 interface이다.
 * 
 * <xmp>
 * MES공통의 상수를 정의한다.  
 * </xmp>
 * @author 이돈석
 *
 */
public interface M90ConstantsIF extends PosBizControlConstants {

	public final String LOOP_CNT			= "loop-cnt";
	public final String LOOP_END			= "endLoop";
	public final String MESDAO				= "mesdao";
	public final String EAIDAO				= "eaidao";
	public final String M90DAO				= "m90dao";
	public final String SQLKEY				= "sqlkey";
	public final String BIND_KEY			= "bind-key";
	public final String COLUMN_ID			= "column-id";
	public final String CHECK_COUNT			= "check-count";
	public final String CHK_PARAM			= "chk-param";
	public final String ELSE				= "ELSE";
	public final String DAO					= "dao";
	public final String UPDATE_SQL			= "update-sql";
	public final String DELETE_SQL			= "delete-sql";
	public final String INSERT_SQL			= "insert-sql";
	public final String UPDATE				= "UPDATE";
	public final String DELETE				= "DELETE";
	public final String INSERT				= "INSERT";
	public final String IDS					= "ids";
	public final String RESULTKEY			= "resultkey";
	public final String CHKCOLUMN			= "chk-column";
	public final String IF_ELSE_EXCEPTION	= "if-else-exception";
	public final String M90_USER_ID			= "M90_USER_ID";
	public final String COLUMN_INFO			= "column-info";
	public final String RK_LOOP				= "RK_LOOP";
	public final String MSG_KEY				= "msgKey";
	public final String APP_MSG				= "appMsg";
	public final String MSG					= "msg";
	public final String IF_GRP_ID			= "IF_GRP_ID";
	public final String M90IDS				= "m90Ids";

	public final String LOG_STANDARD_OF_JUDGE_EMPTY_CASE = "There is no edit data!";
	public final String DELIMITER_SPLIT		= ",";
	public final String COLUMN_INFO_M90		= "column-info_m90";

	public static final String SQL_KEY		= "sql-key";
	public static final String PARAM_COUNT	= "param-count"; 
	public static final String PARAM		= "param";
	public static final String XML_RESULT	= "xml-result";

	public static final String OBJECT_TYPE	= "ObjectType";
	public static final String OBJECT_ID	= "ObjectId";
	public static final String PROGRAM_ID	= "ProgramId";
	public static final String TIMESTAMP	= "Timestamp";
	public static final String TRANSACTION	= "transaction";

	public static final String USER_PRC_INSERT_SQL	= "B90R0010.upsertTbM90B90R0010";
}
