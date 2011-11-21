<?php
	include("inc/util.php");
	connect_DB_users();
	
	if ($_POST['accedir']) {
		$user = $_POST['user'];
		$pass = $_POST['pass'];
		
		$sql = "select * from centrals where nom='$user' and pass='$pass'";
		$r = mysql_query($sql);
		
		if(mysql_num_rows($r) > 0) {
			$fila = mysql_fetch_array($r);
			$url = $fila['url'];
			header ("Location:".$url);
		}
	}
	
?>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>EmerGPS</title>
    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&amp;language=es"></script>
    <link rel="stylesheet" type="text/css" href="css/style.css" />
</head>

<body onload="initialize()">
	
    <div class="main">
		<div class="main-top">
			<div style="float: left; margin-right: 200px;"> <span> EmerGPS </span> </div>
			<div style="float: right;"> <span> BOMBERS | POLICIA | AMBUL&Agrave;NCIES </span> </div>
		</div>
		<div class="main-center-login">
			<div style="margin: 0px auto; width: 200px; height: 200px;"> 
				<form name="login" method="post" action="index.php">
					<div>
						<label for="user"> Usuari </label>
						<input type="text" name="user" id="user">
					</div>
					
					<div>
						<label for="pass"> Password </label> 
						<input type="pass" id="pass" name="pass"/>
					</div>
						<input style="margin-top: 20px;width: 154px;" name="accedir" type="submit" value="Accedir" />									
					</form>
			</div>
		</div>
	</div>	
</body>
</html>