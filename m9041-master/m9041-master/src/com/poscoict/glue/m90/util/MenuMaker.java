package com.poscoict.glue.m90.util;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import com.posdata.glue.web.security.PosMenu;

/**
 * 이 클래스는 전달받은 Memu 객체를 메뉴 화면의 Tree에 전달하기 위해 XML 또는 Json 형태의 Data로 변환하는 클래스이다 
 * @author 송범용
 */
public class MenuMaker
{
	/**
	 * Hidden 메뉴를 보여줄 것인지 여부
	 */
	private boolean hideHiddenMenu;
	
	/**
	 * 생성자
	 * @param hideHiddenMenu Hidden 메뉴에 대한 Display 여부
	 */
	public MenuMaker(boolean hideHiddenMenu){
		this.hideHiddenMenu = hideHiddenMenu;
	}
	
	/**
	 * 이 메소드는 PosMenu 객체를 XML로 변환하는 메소드이다.
	 * PosMenu 객체가 Sub Menu를 가지고 있는 경우 재귀적으로 makeXML()을 호출한다
	 * @param menu 변환하려는 PosMenu 객체
	 * @return 변환된 XML
	 */
    public String makeXml( PosMenu menu )
    {
        Map infoMap = menu.getInfo();
        List subMenuList = menu.getSubMenus();
        
        /* 화면인 경우 */
        if ( subMenuList == null || subMenuList.size() == 0 )	
        {
        	if(infoMap.get("PROGRAM_ID") == null) return "";
        	
            String programId = ( (BigDecimal) infoMap.get( "PROGRAM_ID" ) ).toString();
            String programKey = (String) infoMap.get( "PROGRAM_KEY" );
            String programName = (String) infoMap.get( "PROGRAM_NAME" );
            String hostUrl = (String) infoMap.get( "HOST_URL" );
            String programUrl = (String) infoMap.get( "PROGRAM_URL" );
            programUrl = programUrl.replaceAll("&amp;", "&");
            String openType = (String) infoMap.get( "OPEN_TYPE" );

            /* HiddenMenu 속성이 True인 경우 XML을 만들지 않는다 */
            if ( hideHiddenMenu && isHiddenMenu(infoMap, "PROMPT_DISPLAY_FLAG") ) return "";

            StringBuffer sb = new StringBuffer();

            /* 메뉴 클릭 시 Link될 URL을 구한다 */
            String linkURL = null;
            if(programUrl.indexOf("?") > 0){	
            	linkURL = hostUrl + programUrl + "&pageID=" + menu.getPageID();
            } else  {
            	linkURL = hostUrl + programUrl + "?pageID=" + menu.getPageID();
            }
            
            /* XML 생성 */
            sb.append( "<item text='" ).append( programName ).append( "' id='" ).append( menu.getPageID() ).append( "' >\n" );
            sb.append( "\t<userdata name='url'><![CDATA[" ).append(linkURL).append( "]]></userdata>\n" );
            sb.append( "\t<userdata name='programId'><![CDATA[" + programId + "]]></userdata>" );
            if ( "newWin".equals( openType ) ) {	// openType 항목이 newWin인 경우 Menu 화면에서 새 창으로 띄울 수 있게 한다
            	sb.append( "\n\t<userdata name='openType'><![CDATA[newWin]]></userdata>" );
            }
            sb.append( "</item>\n" );

            return sb.toString();
            
        } 
        /* 메뉴인 경우 */
        else	  
        {
            if ( hideHiddenMenu && isHiddenMenu(infoMap, "DISPLAY_FLAG")) return "";

            String menuId = ( (BigDecimal) infoMap.get( "MENU_ID" ) ).toString();
            String menuKey = (String) infoMap.get( "MENU_KEY" );
            String menuName = (String) infoMap.get( "MENU_NAME" );
            String menuType = (String) infoMap.get( "MENU_TYPE" );

            StringBuffer sb = new StringBuffer();
            
            /* XML 생성 */
            sb.append( "<item text='" ).append( menuName ).append( "' id='" ).append( menuId ).append( "' child='1\'>\n" );

            /* Sub Menu에 대해서도 XML을 구한다 */
            for ( int i = 0; i < subMenuList.size(); i++ )
            {
                sb.append( this.makeXml( (PosMenu) subMenuList.get( i ) ) );
            }

            sb.append( "</item>\n" );

            return sb.toString();
        }
    }
    
    /**
     * 이 메소드는 Hidden Menu인지 판단하는 메소드이다.
     * @param infoMap Menu의 속성을 가진 map
     * @param columnName Hidden Menu인지 판단하기 위한 Key명
     * @return Hidden 여부
     */
    private boolean isHiddenMenu(Map infoMap, String columnName) {
    	Object displayFlag = infoMap.get( columnName );
    	
    	return displayFlag == null || "0".equals(displayFlag) || "N".equals( displayFlag);
    }
    
	/**
	 * 이 메소드는 PosMenu 객체를 Json로 변환하는 메소드이다.
	 * PosMenu 객체가 Sub Menu를 가지고 있는 경우 재귀적으로 makeJson()을 호출한다
	 * @param menu 변환하려는 PosMenu 객체
	 * @return 변환된 Json
	 */
    public String makeJson( PosMenu menu )
    {
        Map infoMap = menu.getInfo();
        List subMenuList = menu.getSubMenus();

        /* 화면인 경우 */
        if ( subMenuList == null || subMenuList.size() == 0 )
        {
        	if(infoMap.get("PROGRAM_ID") == null) return "";
        	
            String programId = ( (BigDecimal) infoMap.get( "PROGRAM_ID" ) ).toString();
            String programKey = (String) infoMap.get( "PROGRAM_KEY" );
            String programName = (String) infoMap.get( "PROGRAM_NAME" );
            String hostUrl = (String) infoMap.get( "HOST_URL" );
            String programUrl = (String) infoMap.get( "PROGRAM_URL" );
            String openType = (String) infoMap.get( "OPEN_TYPE" );
            
            /* HiddenMenu 속성이 True인 경우 XML을 만들지 않는다 */
            if (hideHiddenMenu && isHiddenMenu(infoMap, "PROMPT_DISPLAY_FLAG") ) return "";

            StringBuffer sb = new StringBuffer();
            
            /* 메뉴 클릭 시 Link될 URL을 구한다 */
            String linkURL = null;
            if(programUrl.indexOf("?") > 0){
            	linkURL = hostUrl + programUrl + "&pageID=" + menu.getPageID();
            } else  {
            	linkURL = hostUrl + programUrl + "?pageID=" + menu.getPageID();
            }
            
            /* Json 생성*/
            sb.append(" { ").append("id: \"").append(menu.getPageID()).append("\", type: \"file\", text: \"").append(programName).append("\", url: \"");
            sb.append(linkURL).append("\" }");

            return sb.toString();
        /* 메뉴인 경우 */
        } else
        {

            if ( hideHiddenMenu && isHiddenMenu(infoMap, "DISPLAY_FLAG") ) return "";

            String menuId = ( (BigDecimal) infoMap.get( "MENU_ID" ) ).toString();
            String menuKey = (String) infoMap.get( "MENU_KEY" );
            String menuName = (String) infoMap.get( "MENU_NAME" );
            String menuType = (String) infoMap.get( "MENU_TYPE" );

            StringBuffer sb = new StringBuffer();
            

            /* Sub Menu에 대해서도 Json을 구한다 */
            StringBuffer subSb = new StringBuffer();
            String jsonExpression = null;
            for ( int i = 0, subMenuListSize = subMenuList.size(); i < subMenuListSize; i++ )
            {
                jsonExpression = this.makeJson( (PosMenu) subMenuList.get( i ) );
                
                if(subSb.length() > 0 && ! "".equals(jsonExpression)){	// ""인 경우는 hidden 메뉴인 경우임
                	subSb.append(",\n");
                } 
                
                subSb.append( jsonExpression );
            }

            if(subSb.length() > 0){
            	sb.append(" { ").append("id: \"").append(menuId).append("\", type: \"folder\", text: \"").append(menuName).append("\", item: [").append(subSb).append(" ] } ");
            } else {
            	sb.append(" { ").append("id: \"").append(menuId).append("\", type: \"folder\", text: \"").append(menuName).append("\" }");
            }

            return sb.toString();
        }
    }
}
