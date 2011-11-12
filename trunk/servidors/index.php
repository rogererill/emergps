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
    <style>
    *{ margin: 0; padding: 0; }
    html, body{
        width: 100%;
        height: 100%;
        margin: 0px;
		padding: 0px;
    }
	
	.main {
		width: 1024px;
		height: 900px;
		margin: 0px auto;
	}
	
	.main-top {
		width: inherit;
		height: 20px;
		float: left;
		margin-bottom: 40px;
	}
	
	.main-center {
		width: inherit;
		height: 540px;
		float: left;
	}
	
	#llista_inc {
		width: 172px;
		height: inherit;
		float: left;
		padding-top: 40px;
	}
	
	.incidencies {
		width: 600px;
		height: inherit;
		float: left;
	}
	
	#incidencies-nav {
		width: inherit;
		height: 40px;
		float: left;
	}
	
	.incidencia-titol {
		width: 40px;
		height: 40px;
		float: left;
	}
	
	#map {
		width: inherit;
		height: 500px;
		float: left;
	}
	
	.info-incidencies {
		width: 252px;
		height: inherit;
		float: left;
		padding-top: 40px;
		text-align: center;
	}
	
	div label {
	  width: 25%;
	  float: left;
	  text-align: left;
	}
	
	.info {
		width: inherit;
		height: 500px;
		float: left;
	}
    </style>
    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&amp;language=es"></script>
    <script type="text/javascript" src="map.js"></script>
</head>
<body onload="initialize()">
    <div class="main">
		<div class="main-top">
			CENTRAL DE BOMBERS <a href="#"> sortir </a>
		</div>
		<div class="main-center">
			<div id="llista_inc">
				
			</div>
			<div class="incidencies">
				<div id="incidencies-nav">

				</div>
				<div id="map"></div>
			</div>
			<div class="info-incidencies">
				<div id="info">
					
				</div>
				<fieldset>
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
				
				</fieldset>
			</div>
		</div>
	</div>	
</body>
</html>