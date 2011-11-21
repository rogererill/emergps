<?php
	include("inc/util.php");
	//connect_DB();
	
	if ($_POST['crear']) {
		$name = $_POST['titol'];
		$lat = $_POST['lang'];
		$lng = $_POST['lng'];
		$sql = "insert into incidencia(name,lat,lng) values ('$name','$lat','$lng')";
		
		$r = mysql_query($sql);
	}
	
?>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>EmerGPS</title>
    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&amp;language=es"></script>
    <script type="text/javascript" src="js/map.js"></script>
    <link rel="stylesheet" type="text/css" href="css/style.css" />
</head>

<body onload="initialize()">
	
    <div class="main">
		<div class="main-top">
			<div style="float: left; margin-right: 200px;"> <span> EmerGPS </span> </div>
			<div style="float: left; margin-right: 4px;"> <span> <a href="#" onclick="vista_general();"> Mapa general </a> | </span> </div>
			<div style="float: left;"> <div style="position: relative; top: -6px; width: 32px; height: 37px; background: url(img/fire_alert.png);"> </div> </div>
			<div class="notificacion" style="float: left;"> <a href="#"> <div class="not_img"> </div> </a> </div>
			<div style="float: right;"> <span> CENTRAL DE BOMBERS | <a href="index.php">sortir</a> </span> </div>
		</div>
		<div class="main-center">
			
			<div id="llista_inc">
				
			</div>
			<div class="incidencies">
				<div id="map"></div>
			</div>
			<div class="info-incidencies">
				<div id="info">
					
				</div>
				<div id="geocode">
					<fieldset>
					<legend> Incidencia </legend>
					<form name="formGeocode">
					<div>
						<label for="titolInc"> Titol </label>
						<input type="text" name="titolInc" id="titolInc">
					</div>
					
					<div>
						<label for="inputTextAddress"> Adreça </label> 
						<input type="text" id="inputTextAddress" title="Address to Geocode" />
					</div>
						<input type="button" onclick="codeAddress()" id="inputButtonGeocode" style="width:150px" title="Click to Geocode" value="Click to Geocode" />									
						<input type="button" onclick="calculateDistance()" id="moure" style="width:150px" title="moure" value="distancia" />												
					</form>
				</fieldset>
				</div>
			</div>
		</div>
	</div>	
</body>
</html>