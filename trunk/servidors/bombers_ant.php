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
    <script type="text/javascript" src="js/web-sv.js"></script>
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
						
						<div>
						<label for="id_inc"> incidencia </label>
						<input type="text" name="id_inc" id="id_inc">
					</div>
					
					<div>
						<label for="id_recurs"> recurs </label> 
						<input type="text" id="id_recurs" title="id_recurs" />
					</div>
						<input type="button" onclick="enviarAssigFormulari()" id="inputButtonGeocode" style="width:150px" title="Click per assignar" value="Click per assignar" />									

						<input type="button" onclick="showRoute()" id="moure" style="width:150px" title="moure" value="distancia" />												
						<input type="button" onclick="distRecursos()" id="min" style="width:150px" title="min" value="min" />												
						<input type="button" onclick="showRecursos()" id="pos" style="width:150px" title="pos" value="showRecursos" />												
						<input type="button" onclick="showAssignacions()" id="cr" style="width:150px" title="cr" value="veure resultats dist" />												
						<input type="button" onclick="updateEstat()" id="est" style="width:150px" title="est" value="estatt" />												
						<input type="button" onclick="updatePosicions()" id="pos" style="width:150px" title="pos" value="pos" />												
						<input type="button" onclick="deleteIncidencia(1)" id="de" style="width:150px" title="de" value="delete" />												

						<input type="button" onclick="assignarInc(10009,777)" id="ass" style="width:150px" title="ass" value="assignar10009" />												
						<input type="button" onclick="alliberarRecurs(10009)" id="all" style="width:150px" title="all" value="alliberar10009" />												
						<input type="button" onclick="logoutRecurs(10009)" id="out" style="width:150px"  title="out" value="logout10009" />												
						<input type="button" onclick="logInRecurs(10009,41.416,2.1345)" id="in" style="width:150px"  title="in" value="login10009" />												
					
						<input type="button" onclick="assignarInc(10008,777)" id="ass" style="width:150px" title="ass" value="assignar10008" />												
						<input type="button" onclick="alliberarRecurs(10008)" id="all" style="width:150px" title="all" value="alliberar10008" />												
						<input type="button" onclick="logoutRecurs(10008)" id="out" style="width:150px"  title="out" value="logout10008" />												
						<input type="button" onclick="logInRecurs(10008,41.416,2.1345)" id="in" style="width:150px"  title="in" value="login10008" />							
					
						<input type="button" onclick="enviarAssignacio('?id=2&id_ass=10002z10004z10005')" id="in" style="width:150px"  title="in" value="enviarAssignacio()" />												

					</form>
				</fieldset>
				</div>
			</div>
		</div>
	</div>	
</body>
</html>