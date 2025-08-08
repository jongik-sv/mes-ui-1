package com.poscoict.glue.m90.activity;

import java.math.BigDecimal;

import com.posdata.glue.biz.activity.PosActivity;
import com.posdata.glue.biz.activity.PosServiceParamIF;
import com.posdata.glue.context.PosContext;
import com.posdata.glue.dao.PosGenericDao;
import com.posdata.glue.dao.vo.PosParameter;
import com.posdata.glue.dao.vo.PosRow;
import com.posdata.glue.dao.vo.PosRowSet;

/**
 * 이 Class는 사용하지 않는다
 */
public class SubMenuItemMaker extends PosActivity
{

    public String runActivity( PosContext ctx )
    {
        PosGenericDao dao = this.getDao( this.getProperty( PosServiceParamIF.DAO ) );
        String[] menuId = (String[]) ctx.get( "MENU_ID" );

        String xmlContents = makeSubMenu( dao, menuId[0] );
        ctx.put( "RK_SUB_MENU", xmlContents );

        return "success";
    }

    private String makeSubMenu( PosGenericDao dao, String parentMenuId )
    {
        PosRowSet subMenuRowSet = getSubMenu( dao, parentMenuId );
        StringBuffer sb = new StringBuffer();

        sb.append( "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" ).append( "<item id='" ).append( parentMenuId ).append( "' im0='folderClosed.gif' im1='folderOpen.gif' im2='folderClosed.gif' child='1'>\n" );
        while ( subMenuRowSet.hasNext() )
        {
            PosRow subMenuRow = subMenuRowSet.next();

            BigDecimal menuId = (BigDecimal) subMenuRow.getAttribute( "MENU_ID" );
            String menuName = (String) subMenuRow.getAttribute( "MENU_NAME" );
            String displayName = (String) subMenuRow.getAttribute( "DISPLAY_NAME" );
            String displayFlag = (String) subMenuRow.getAttribute( "DISPLAY_FLAG" );
            String subEntryTp = (String) subMenuRow.getAttribute( "SUB_ENTRY_TP" );
            BigDecimal programId = (BigDecimal) subMenuRow.getAttribute( "PROGRAM_ID" );

            if ( "M".equals( subEntryTp ) )
            {
                // sb.append("<item text=\""+menuName+"\" id=\""+menuId+"\" im0=\"folderClosed.gif\" im1=\"folderOpen.gif\" im2=\"folderClosed.gif\" child=\"1\"/>\n");
                sb.append( "<item text='" ).append( menuName ).append( "' id='" ).append( menuId ).append( "' im0='folderClosed.gif' im1='folderOpen.gif' im2='folderClosed.gif' child='1\'/>\n" );
            } else if ( "P".equals( subEntryTp ) )
            {
                sb.append( "<item text='" ).append( menuName ).append( "' id='" ).append( menuId ).append( "' im0='iconText.gif' im1='iconText.gif' im2='iconText.gif' child='1\'>\n" );

                PosRowSet programRowSet = getProgramInfo( dao, programId.toString() );

                if ( programRowSet.hasNext() )
                {
                    PosRow programRow = programRowSet.next();
                    String programName = (String) programRow.getAttribute( "PROGRAM_NAME" );

                    sb.append( "<item text='" ).append( programName ).append( "' id='" ).append( programId.toString() ).append( "' im0='iconText.gif' im1='iconText.gif' im2='iconText.gif'>\n" ).append( "<userdata name='url'>" ).append( (String) programRow.getAttribute( "HOST_URL" ) + (String) programRow.getAttribute( "PROGRAM_URL" ) )// +
                                                                                                                                                                                                                                                                                                                                                // "?pageID="
                                                                                                                                                                                                                                                                                                                                                // +
                                                                                                                                                                                                                                                                                                                                                // (String)programRow.getAttribute("PAGE_ID"))
                    .append( "</userdata>" ).append( "</item>" );
                }

                sb.append( "</item>" );

            } else
            {
                sb.append( "<item text='" ).append( menuName ).append( "' id='" ).append( menuId ).append( "' im0='folderClosed.gif' im1='folderOpen.gif' im2='folderClosed.gif'/>\n" );
            }
        }

        sb.append( "</item>" );

        return sb.toString();
    }

    /**
     * 이 메소드는 Sub Menu를 가져오는 메소드이다.
     * 
     * @param menuId
     * @return
     */
    private PosRowSet getSubMenu( PosGenericDao dao, String menuId )
    {
        PosParameter param = new PosParameter();
        System.out.println( "menuId : " + menuId.toString() );
        param.setWhereClauseParameter( 0, menuId.toString() );
        // param.setValueParamter(1, menuId);

        return dao.find( this.getProperty( "sqlkeyForSubMenu" ), param );
    }

    private PosRowSet getProgramInfo( PosGenericDao dao, String programId )
    {
        PosParameter param = new PosParameter();
        param.setWhereClauseParameter( 0, programId );

        return dao.find( this.getProperty( "sqlkeyForProgram" ), param );
    }
}
