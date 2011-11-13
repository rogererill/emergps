<?php
	include("util.php");
	connect_DB();
	
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
    <title>test</title>
    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&amp;language=es"></script>
    <script type="text/javascript" src="map.js"></script>
    <link rel="stylesheet" type="text/css" href="style.css" />
</head>

<body onload="initialize()">
	
    <div class="main">
		<div class="main-top">
			<span style="margin-right: 200px;"> EmerGPS</span>
			<span> <a href="#" onclick="vista_general();"> Mapa general </a> </span>
			<span style="float: right"> CENTRAL DE BOMBERS <a href="#"> | sortir </a> </span>
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
					
				</div>
				<!--<fieldset>
					<legend> Incidencia </legend>
					<div>
						<label for="titol"> Titol </label>
						<input type="text" name="titol" id="titol">
					</div>
					
					<div>
						<label for="direccio"> Direccio </label>
						<input type="text" name="direccio" id="direccio">
					</div>
					
					Address: <input type="text" id="inputTextAddress" style=" width:200px" title="Address to Geocode" />
					<input type="button" onclick="codeAddress()" id="inputButtonGeocode" style="width:150px" title="Click to Geocode" value="Click to Geocode" />
				
				</fieldset>-->
			</div>
		</div>
	</div>	
</body>
</html>