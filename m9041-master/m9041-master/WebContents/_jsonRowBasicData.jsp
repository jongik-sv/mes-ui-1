<%@ page contentType="text/plain;charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import = "java.util.*" %> 
<%@page import = "com.posdata.glue.context.PosContext" %> 
<%@page import = "com.posdata.glue.dao.vo.*" %> 
<%@page import = "com.posdata.glue.web.control.*" %> 

<%
  Throwable error = null;
  PosContext ctx = null;
  String[] columnInfo = null;  
  StringBuffer sb = new StringBuffer();
  if(request.getParameter("column-info") != null){
    columnInfo = request.getParameter("column-info").split(",");
  }else{
   columnInfo[0] = "";
   columnInfo[1] = "";
  }
  
try
{
    ctx = (PosContext)request.getAttribute(PosWebConstants.CONTEXT);
    
    String resultKey = "xml-result";
    sb.append("{"); 
    error = ctx.getException();
    if(error != null) {
    for (int col = 0, colSize = columnInfo.length; col < colSize;col++){ 
                      if(col != (colSize -1)){
                          if(columnInfo[col].equals("USER_MSG") )
                          {
                            sb.append("\"").append(columnInfo[col]).append("\":\"").append(error.getMessage()).append("\"").append(",");
                          }else{
                               sb.append("\"").append(columnInfo[col]).append("\":\"").append("").append("\"").append(","); 
                          }
                      }else{
                           sb.append("\"").append(columnInfo[col]).append("\":\"").append("").append("\"");
            }
    }       
    }
    if(error == null && resultKey != null) {     
   
        Object result = ctx.get(resultKey);         
        if(result != null ){
            if (result instanceof List || result instanceof PosRowSet)
            { 
                List rowSetList = (List)result;     
                Map rowMap = null;
               if(rowSetList.size() != 0){
                for(int i = 0, listSize = rowSetList.size(); i < listSize; i++){
                    rowMap = (Map)rowSetList.get(i);
                 
                    if(rowMap != null)
                    {
                     for (int col = 0, colSize = columnInfo.length; col < colSize;col++){ 
                     Object colData = (rowMap.get(columnInfo[col]) == null)?"":rowMap.get(columnInfo[col]);
                     if(col != (colSize -1)){
                          sb.append("").append("\"").append(columnInfo[col]).append("\":\"").append(colData).append("\"").append(",");
                     }else{
                         sb.append("").append("\"").append(columnInfo[col]).append("\":\"").append(colData).append("\"").append("");
                     }
                    }                    
                  }
               }
              }else{
               for (int col = 0, colSize = columnInfo.length; col < colSize;col++){ 
                      if(col != (colSize -1)){
                          sb.append("\"").append(columnInfo[col]).append("\":\"").append("").append("\"").append(",");
                      }else{
                        sb.append("\"").append(columnInfo[col]).append("\":\"").append("").append("\"");
                      }
                }          
              
              } 
            
            } else {
                 for (int col = 0, colSize = columnInfo.length; col < colSize;col++){ 
                      if(col != (colSize -1)){
                          sb.append("\"").append(columnInfo[col]).append("\":\"").append("").append("\"").append(",");
                      }else{
                        sb.append("\"").append(columnInfo[col]).append("\":\"").append("").append("\"");
                       }
            }          
           }                   
        }
  }
    sb.append("}");

}catch (Exception e){

    for (int col = 0, colSize = columnInfo.length; col < colSize;col++){ 
        if(col != (colSize -1)){
            sb.append("\"").append(columnInfo[col]).append("\":\"").append("").append("\"").append(",");
        }else{
          sb.append("\"").append(columnInfo[col]).append("\":\"").append("").append("\"");
        }
    } 
}
out.println(sb.toString());
%>