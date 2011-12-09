<!DOCTYPE html>
<?php 
	$titul = $_GET['titul'];
	$id = $_GET['id'];
	$mode = $_GET['mode'];
	$posx = $_GET['posx'];
	$posy = $_GET['posy'];
?>
<html>
<title> emerGPS </title>
<head>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
<style type="text/css">
  html { height: 100% }
  body { height: 100%; margin: 0; padding: 0 }
  div#map_canvas { height: 100% }
</style>

<?php

echo "<br><br><br>";


// Per quan cridem la primera vegada, que prengui 10000 com a valor per defecte
if ($id == null) $id = 10000;


//Mode 1 = lectura, mode 2 = escriptura
if ($mode == "1" || $mode == null) {
	//Construim la url que cridarem segons els valors que ens han introduit
	$url_base = "http://roger90.no-ip.org/HelloWorld/resources/emergps/lectura/";
	$url = $url_base.$id;
}

else if ($mode == "2") {
	$url_base = "http://roger90.no-ip.org/HelloWorld/resources/emergps/env_pos_web";
	$url = $url_base."?id=".$id."&posx=".$posx."&posy=".$posy;
	$incidencia = file_get_contents($url);
	if ($incidencia == "1") echo "Te una incidencia nova<br>";
	else echo "No te incidencies noves<br>";
	
	// Ara hem canviat la posicio, perque es vegi preparem la url per fer una lectura despres
	$url_base = "http://roger90.no-ip.org/HelloWorld/resources/emergps/lectura/";
	$url = $url_base.$id;
}

else if ($mode == "3") {
	$user = $_GET['user'];
	$pass = $_GET['pass'];
	$url_base = "http://roger90.no-ip.org/HelloWorld/resources/emergps/login_web";
	$url = $url_base."?user=".$user."&pass=".$pass;
	$resultat = file_get_contents($url);
	if ($resultat == "-1") echo "<b>Usuari o contrassenya incorrecte</b><br>";
	else echo "Benvingut, ".$resultat;
}

else if ($mode == "4") {
	$coment = $_GET['comentari'];
	$url_base = "http://roger90.no-ip.org/HelloWorld/resources/emergps/new_inc2";
	$url = $url_base."?posx=".$posx."&posy=".$posy."&comentari=".$coment;
	$resultat = file_get_contents($url);
	echo "Incidència creada ".$resultat."<br>";
}

else if ($mode == "5") {
	$url_base = "http://roger90.no-ip.org/HelloWorld/resources/emergps/logout_web";
	$url = $url_base."?id=".$id;
	$resultat = file_get_contents($url);
	echo "Adeu usuari ".$resultat."<br>";
}

else if ($mode == "6") {
	$url_base = "http://roger90.no-ip.org/HelloWorld/resources/emergps/asign_uni_web";
	$id_inc = $_GET['id_inc'];
	$assignats = $_GET['assignats'];
	$url = $url_base."?id=".$id_inc."&id_ass=".$assignats;
	$resultat = file_get_contents($url);
	echo "Hem assignat a la incidencia ".$id_inc." A les persones ".$resultat."<br>";
}

else if ($mode == "7") {
	$url_base = "http://roger90.no-ip.org/HelloWorld/resources/emergps/fin_inc_web";
	$url = $url_base."?id=".$id;
	echo $url;
	$resultat = file_get_contents($url);
	echo "Hem finalitzat la incidencia ".$resultat."<br>";
}

	// Ara hem canviat la posicio, perque es vegi preparem la url per fer una lectura despres
	$url_base = "http://roger90.no-ip.org/HelloWorld/resources/emergps/lectura/";
	$url = $url_base.$id;



//Fem el get, a codi tenim el que retorna el web service per la crida GET
$codi = file_get_contents($url);
echo $codi; 

//Del codi retornat, agafem els valors que ens interessen
$findme = 'Latitud';
$pos = strpos($codi, $findme);
$lat = substr($codi,$pos+9,6);

$findme = 'Longitud';
$pos = strpos($codi, $findme);
$lon = substr($codi,$pos+10,6);

//Ens assegurem que les variables han pres el valor correcte
echo "<br><br>";
echo $lat;
echo "<br>"; echo $lon;
?>

<script type="text/javascript"
    src="http://maps.googleapis.com/maps/api/js?sensor=false">
</script>
<script type="text/javascript">
  	var map;
	function initialize() {
	var myLatlng = new google.maps.LatLng(41.4,2.12);
	var myOptions = {
		zoom: 12,
	    center: myLatlng,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	 }
	 map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	  
	 google.maps.event.addListener(map, 'click', function(event) {
	 	placeMarker(event.latLng);
	 });
	 
		var pos = new google.maps.LatLng(<? echo $lat; echo ","; echo $lon; ?>);
		placeMarker(pos);
	}
	  
	function placeMarker(location) {
		var marker = new google.maps.Marker({
	      position: location, 
	      map: map,
	      title:"<html> <body> <form> <input type='text' name='titul'> <input type='submit' name='enviar' value='ok'> </form></body> </html>"
	  	});
	  
		google.maps.event.addListener(marker, 'click', function() {
		 	var finestra = new google.maps.InfoWindow(
		 		{ content: this.title,
		 		  size: new google.maps.Size(50,50)
		 		});
		 	finestra.open(map,marker);
		});
	  	map.setCenter(location);
	  	map.addOverlay(marker);
	}

</script>
</head>
<body onload="initialize()">
  <div id="map_canvas" style="width:50%; height:50%"></div>
  <p> <?php echo $titul ?> </p>
<h2> Consulta la posició d'una unitat del servei d'emerg&egrave;ncies </h2> <br><br>

<FORM ACTION="prova3.php" METHOD="GET"> 
ID de la persona:<INPUT TYPE="text" NAME="id"><BR>
<INPUT TYPE="hidden" NAME="mode" VALUE="1">
<INPUT TYPE="submit" VALUE="Enviar"> 
</FORM> 
 <br><br>

<h2> Canvia la posició d'una unitat del servei d'emerg&egrave;ncies </h2>
<FORM ACTION="prova3.php" METHOD="GET"> 
ID de la persona:<INPUT TYPE="text" NAME="id"><BR>
Latitud:<INPUT TYPE="text" NAME="posy"><BR>
Longitud:<INPUT TYPE="text" NAME="posx"><BR>
<INPUT TYPE="hidden" NAME="mode" VALUE="2">
<INPUT TYPE="submit" VALUE="Enviar">
</FORM>
 <br><br> 

<h2> Login </h2>
<FORM ACTION="prova3.php" METHOD="GET"> 
User:<INPUT TYPE="text" NAME="user"><BR>
Pass:<INPUT TYPE="text" NAME="pass"><BR>
<INPUT TYPE="hidden" NAME="mode" VALUE="3">
<INPUT TYPE="submit" VALUE="Enviar">
</FORM> 
 <br><br>

<h2> Crear incid&eacute;ncia </h2>
<FORM ACTION="prova3.php" METHOD="GET"> 
Latitud:<INPUT TYPE="text" NAME="posy"><BR>
Longitud:<INPUT TYPE="text" NAME="posx"><BR>
Comentari:<INPUT TYPE="text" NAME="comentari"><BR>
<INPUT TYPE="hidden" NAME="mode" VALUE="4">
<INPUT TYPE="submit" VALUE="Enviar">
</FORM>

 <br><br>
 <h2> Logout </h2>
<FORM ACTION="prova3.php" METHOD="GET"> 
id:<INPUT TYPE="text" NAME="id"><BR>
<INPUT TYPE="hidden" NAME="mode" VALUE="5">
<INPUT TYPE="submit" VALUE="Enviar">
</FORM> 

<br><br>
<h2> Assignar gent a incid&eacute;ncia </h2>
<FORM ACTION="prova3.php" METHOD="GET"> 
id incidencia:<INPUT TYPE="text" NAME="id_inc"><BR>
id assignats:<INPUT TYPE="text" NAME="assignats"><BR>
<INPUT TYPE="hidden" NAME="mode" VALUE="6">
<INPUT TYPE="submit" VALUE="Enviar">
</FORM> 

<br><br>
<h2> Eliminar incid&eacute;ncia </h2>
<FORM ACTION="prova3.php" METHOD="GET"> 
id assignat:<INPUT TYPE="text" NAME="id"><BR>
<INPUT TYPE="hidden" NAME="mode" VALUE="7">
<INPUT TYPE="submit" VALUE="Enviar">
</FORM> 

</body>
</html>
