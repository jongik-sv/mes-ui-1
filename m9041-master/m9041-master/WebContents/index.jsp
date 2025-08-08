<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv='Content-Type' content='text/html'/>
    <meta http-equiv='Pragma' content='no-cache'/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <title>MES Portal</title>
    <script language='javascript'>
        window.onload = redirectToLogin;
        function redirectToLogin() {
            // similar behavior as an HTTP redirect
            window.location.replace("./login.jsp");
        }
    </script>
</head>
<body>
</body>
</html>
