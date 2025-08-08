<%@ page contentType="text/xml;charset=UTF-8" pageEncoding="UTF-8"%> 
<%@page import = "java.util.*" %> 
<%@page import = "java.sql.Types" %> 
<%@page import = "com.posdata.glue.context.PosContext" %> 
<%@page import = "com.posdata.glue.dao.vo.*" %> 
<%@page import = "com.posdata.glue.web.control.*" %> 
<%@page import = "com.posdata.glue.util.log.PosLog" %>

<%@page import = "com.poscoict.glue.dhtmlx.constant.DhtmlxConstantsIF" %> 

<%
String columnInfo = null;
String[] columnMerge = null;
String blankRowCntParam = null;
int blankRowCnt = 0;
Throwable error = null;
PosContext ctx = null;
try
{

	ctx = (PosContext)request.getAttribute(PosWebConstants.CONTEXT);
    
    if (ctx == null) {
		out.println("<rows>");
		String service = request.getParameter("ServiceName");
		String message = "Context is null, because Service ["+service+"] did not execute or has a problem!";     
		throw new Exception(message);
	}

	String posStart = request.getParameter(DhtmlxConstantsIF.START_POINT);
	String totalRows = (String)ctx.get(DhtmlxConstantsIF.TOTAL_ROW_COUNT);
	int startNum = 1;
	if(totalRows == null) {
		out.println("<rows>");
	} else {
		String rowsHeader = DhtmlxConstantsIF.ROWS_STARTTAG.replaceAll("#total",totalRows);
		if (posStart == null) posStart = "0";
			rowsHeader = rowsHeader.replaceAll("#pos",posStart);
			out.println(rowsHeader);   
			try{
				startNum = Integer.parseInt(posStart)+1;
			}catch (Exception in) {	
		}
	}
 
	String resultKey = "xml-result";
	columnInfo = (String)ctx.get("column-info");  
	columnMerge = (String[])ctx.get("column-merge"); 

	String [] colOrder = columnInfo.split(",");
	String [] colMerge = columnMerge[0].split(",");  

	if(resultKey != null && colOrder != null) {
		Object result = ctx.get(resultKey);
		if(result != null ){

			/* Making Screen Message For User */
			out.print("<userdata name=\"appMsg\">");
			out.print((String)ctx.get("appMsg")); 
			out.println("</userdata>");

			/*  Merge 작업*/
			if (result instanceof List){ 

				List rList = (List)result;

				Map rMap = null;
				int idx = startNum;
				Object cData = null;
				Object tempData = null;
				String sData =""; 
				String tData ="";

				String[]	colData = new String[colMerge.length+1];
				String[]	cellsData = new String[colMerge.length+1];
				int[][]		colCount = new int[colMerge.length+1][rList.size()+1];
				int[]		rCount = new int[colMerge.length+1];
				int[]		pCount = new int[colMerge.length+1];
 
				// init
				for(int ii = 0 ;ii < colMerge.length; ii++) {  
				 
					colData[ii] = "";
				}  
 

				for(int mi = 0, size = rList.size(); mi < size; mi++){
					rMap = (Map)rList.get(mi); 
					
					for(int mj = 0 ; mj < colMerge.length; mj++) { 

						cData = rMap.get(colMerge[mj]);
						sData = cData.toString(); 
						tData = (String)colData[mj];
  
					
						if(tData.equals(sData)){ 
							if(colCount[mj][rCount[mj]] == 0){
								colCount[mj][rCount[mj]] =1;
							}
							colCount[mj][rCount[mj]]= colCount[mj][rCount[mj]]+1; 
						}else{
							colData[mj] = sData;
							
							if(colCount[mj][rCount[mj]] == 0){
								colCount[mj][rCount[mj]] =1;
							}
							rCount[mj] ++;
						}

					}
				}
  

			/* List인 경우와 PosRowSet인 두 가지 경우에 대해 처리한다. */
				List rowSetList = (List)result;
 
				Map rowMap = null;
				int index = startNum;
				Object cellData = null; 

				for(int i = 0, listSize = rowSetList.size(); i < listSize; i++){
					rowMap = (Map)rowSetList.get(i);
					out.println(DhtmlxConstantsIF.ROW_STARTTAG.replaceAll("#rowid",resultKey+"_"+index)); 
					
					for(int j = 0 ; j < colOrder.length; j++) {
						cellData = rowMap.get(colOrder[j]); 
						out.print("<cell "); 
 
						for(int k =0 ; k < colMerge.length;k++){
							if(colOrder[j].equals(colMerge[k])){ 

								cData=cellData.toString();
								
								if(!cData.equals(cellsData[k])){
									pCount[k]++;
									if(colCount[k][pCount[k]] == 0 ){
										out.print(" rowspan='1'"); 
									}else{
										out.print(" rowspan='"+ colCount[k][pCount[k]] +"'"); 
									} 
									cellsData[k]=(String)cData; 
								}else{ 
								
								}
							}
						}



						out.print(" ><![CDATA["); 
						if (cellData != null){
							out.print(cellData);  
						}
						else if (DhtmlxConstantsIF.CHK_TYPE.equals(colOrder[j])){
							out.print("0");  
						}
						else if (DhtmlxConstantsIF.NUM_TYPE.equals(colOrder[j])){
							out.print(index);  
						}
						else{
							out.print(""); 

						}

						out.println(DhtmlxConstantsIF.CELL_ENDTAG); 
					}
					
					
					out.println(DhtmlxConstantsIF.ROW_ENDTAG); 
					index++;
					if(index > 100 && index%100 == 0) out.flush();
				}
			} else if(result instanceof String){
				out.println("<rows><row><cell>" + result + "</cell></row></rows>");
				
				
			} else {
				throw new Exception("This resultkey type can not support! Type:"+result);
			}
		} else {
			throw new Exception("Context didn't have a result with this key "+resultKey);
		}
	} else if (resultKey == null) {
		throw new Exception("Context didn't have "+DhtmlxConstantsIF.XML_RESULT);
	} else {
		throw new Exception("Context didn't have "+DhtmlxConstantsIF.COLUMN_ORDER);
	}
	
	error = ctx.getException();
	if(error != null) {
		columnInfo = request.getParameter("column-info") != null ?  request.getParameter("column-info") : "";
		blankRowCntParam = request.getParameter("blank-row-count") != null ?  request.getParameter("blank-row-count") : "";
		out.println("<rows>");
		out.print(DhtmlxConstantsIF.ERROR_STARTTAG);
		out.print("<![CDATA["+error.getMessage()+"]]>");
		out.println(DhtmlxConstantsIF.ERROR_ENDTAG);
		out.println("<userdata name='column-info'>"+columnInfo+"</userdata>");	
		out.println("<userdata name='blank-row-count'>"+blankRowCntParam+"</userdata>");	
		out.println(DhtmlxConstantsIF.ROWS_ENDTAG); 
	}
}catch (Exception e){
	e.printStackTrace();
	error = ctx.getException();
	if(error != null) {
		columnInfo = request.getParameter("column-info") != null ?  request.getParameter("column-info") : "";
		blankRowCntParam = request.getParameter("blank-row-count") != null ?  request.getParameter("blank-row-count") : "";
		out.println("<rows>");
		out.print(DhtmlxConstantsIF.ERROR_STARTTAG);
		out.print("<![CDATA["+error.getMessage()+"]]>");
		out.println(DhtmlxConstantsIF.ERROR_ENDTAG);
		out.println("<userdata name='column-info'>"+columnInfo+"</userdata>");	
		out.println("<userdata name='blank-row-count'>"+blankRowCntParam+"</userdata>");	
		out.println(DhtmlxConstantsIF.ROWS_ENDTAG); 
	}
}

out.println("<userdata name='column-info'>"+columnInfo+"</userdata>");	
out.println(DhtmlxConstantsIF.ROWS_ENDTAG);
%>
