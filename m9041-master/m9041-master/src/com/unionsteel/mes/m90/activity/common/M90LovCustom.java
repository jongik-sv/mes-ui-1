package com.unionsteel.mes.m90.activity.common;

import com.poscoict.glue.biz.dhtmlx.DhtmlxActivity;
import com.posdata.glue.PosException;
import com.posdata.glue.context.PosContext;
import com.posdata.glue.master.easyaccess.easymaster.EasyAccess;
import com.posdata.glue.master.easyaccess.returnType.PosCodeLOV;
import com.posdata.glue.master.easyaccess.returnType.PosCodeValueInfo;

public class M90LovCustom extends DhtmlxActivity
{
    public M90LovCustom() {
    }
    
    public String doPreActivity(PosContext ctx) {
        return "";
    }
    
    public String doPostActivity(PosContext ctx) {
        return "";
    }
    
    private String getRequiredParameter(PosContext ctx, String paramName) {
        Object object = ctx.get(paramName);
        if(object == null) {
            String errMsg = (new StringBuilder("Parameter [")).append(paramName).append("] \uC815\uC758\uAC00 \uB204\uB77D\uB418\uC5C8\uC2B5\uB2C8\uB2E4.").toString();
            logger.logError(errMsg);
            throw new PosException(errMsg);
        }
        else {
            return ((String[])object)[0];
        }
    }
    
    private String getParameter(PosContext ctx, String paramName) {
        Object object = ctx.get(paramName);
        if(object == null) {
            logger.logDebug((new StringBuilder("Parameter [")).append(paramName).append("] \uC9C0\uC815\uAC12 \uC5C6\uC74C").toString());
            return null;
        }
        else {
            return ((String[])object)[0];
        }
    }
    
    public String doMainActivity(PosContext ctx) {
        String category = getRequiredParameter(ctx, "category");
        String codeName = getRequiredParameter(ctx, "code");
        
        String firstItem = getParameter(ctx, "isFirstItem");
        boolean isFirstItem = firstItem != null ? Boolean.valueOf(firstItem).booleanValue() : false;
        String firstItemCd = getParameter(ctx, "firstItemCd");
        String firstItemCdNm = getParameter(ctx, "firstItemCdNm");
        
        String orderBy = getParameter(ctx, "orderBy");
        String ascending = getParameter(ctx, "isAscending");
        boolean isAscending = ascending != null ? Boolean.valueOf(ascending).booleanValue() : true;
        
        String displayType = getParameter(ctx, "displayType");
        PosCodeLOV codeLov = null;
        
        if(orderBy == null)
        	orderBy = "meaning";
        
        if(displayType == null)
        	displayType = "meaning-code";
        
        if(isFirstItem && firstItemCd == null)
        	firstItemCd = "%";
        
        logger.logInfo("##################################");
        logger.logInfo("category : " + category);
        logger.logInfo("codeName : " + codeName);
//        logger.logInfo("totalValue : " + totalValue);
//        logger.logInfo("selectValue : " + selectValue);
        logger.logInfo("firstItem : " + firstItem);
        logger.logInfo("isFirstItem : " + isFirstItem);
        logger.logInfo("firstItemCd : " + firstItemCd);
        logger.logInfo("firstItemCdNm : " + firstItemCdNm);
        
        logger.logInfo("orderBy : " + orderBy);
        
        logger.logInfo("ascending : " + ascending);
        logger.logInfo("isAscending : " + isAscending);
        logger.logInfo("displayType : " + displayType);
        logger.logInfo("##################################");
        
        if("value".equals(orderBy))
        	codeLov = EasyAccess.getCodeLOVOrderByValue(codeName, category, isAscending);
        else if("meaning".equals(orderBy))
        	codeLov = EasyAccess.getCodeLOVOrderByMeaning(codeName, category, isAscending);
        else if("sequence".equals(orderBy))
        	codeLov = EasyAccess.getCodeLOVOrderBySequence(codeName, category);
        
        StringBuffer sb = new StringBuffer();
        
        sb.append("{\"code\":");
        sb.append(0);
        sb.append(",\"msg\":\"").append("정상적으로 처리되었습니다.").append("\"");
        sb.append(",\"jsonResults\":[");
        
        String keyTitle = "CD";
        String valueTitle = "CD_NM";
        
        if(isFirstItem) {
        	sb.append("{")
        		.append("\"" + keyTitle + "\"").append(":").append("\"" + firstItemCd + "\"")
        		.append(",")
        		.append("\"" + valueTitle + "\"").append(":").append("\"" + firstItemCdNm + "\"")
        		.append("},");
        }
        
        for(int i = 0; i < codeLov.codeLOV.size(); i++) {
        	PosCodeValueInfo valueInfo = (PosCodeValueInfo)codeLov.codeLOV.get(i);
        	
            sb.append("{");
            
            if("meaning-code".equals(displayType)) {
            	sb.append("\"" + keyTitle + "\"").append(":").append("\"" + valueInfo.codeValue + "\"")
            		.append(",")
            		.append("\"" + valueTitle + "\"").append(":").append("\"" + valueInfo.codeValueMeaning + "\"");
            }
            else if("code-code".equals(displayType)) {
            	sb.append("\"" + keyTitle + "\"").append(":").append("\"" + valueInfo.codeValue + "\"")
            		.append(",")
            		.append("\"" + valueTitle + "\"").append(":").append("\"" + valueInfo.codeValue + "\"");
            }
	        else if("all-code".equals(displayType)) {
        		sb.append("\"" + keyTitle + "\"").append(":").append("\"" + valueInfo.codeValue + "\"")
        			.append(",")
        			.append("\"" + valueTitle + "\"").append(":").append("\"" + valueInfo.codeValue).append(" - ").append(valueInfo.codeValueMeaning + "\"");
	        }
            
            sb.append("},");
        }
        
        sb.deleteCharAt(sb.length() - 1);
        sb.append("]}");
        ctx.put("lov-result", sb.toString());
        
        logger.logInfo("##################################");
        logger.logInfo("sb.toString() : " + sb.toString());
        logger.logInfo("##################################");
        
        return "success";
    }
    
    public String getDefaultMsgCode() {
        return "";
    }
    
    public String[] getDefaultMsgParam(PosContext ctx) {
        return null;
    }
}