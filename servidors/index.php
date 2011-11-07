<!DOCTYPE html>
<?php 
	include("util.php");
	$titul = $_GET['titul'];
	
	$sql = "select * from recurs";
	$r = mysql_query($sql);
?>
<html>
<title> emerGPS </title>
<head>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
<style type="text/css">
  html { height: 100% }
  body { height: 100%; margin: 0; padding: 0 }
  #map_canvas { height: 100% }
</style>
<script type="text/javascript"
    src="http://maps.googleapis.com/maps/api/js?sensor=false">
</script>
<script type="text/javascript">
	function incidencia(posicio,hora_ini,tipus) {
		this.posicio = posicio;
		this.hora_ini = hora_ini;
		this.tipus = tipus;
	}
  	var map;
	function initialize() {
	var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
	var myOptions = {
		zoom: 4,
	    center: myLatlng,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	 }
	 map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	  
	 google.maps.event.addListener(map, 'click', function(event) {
	 	placeMarker(event.latLng);
	 });
	  
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

<style>
	html,body {
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
	
	.recursos {
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
	
	.incidencies-nav {
		width: inherit;
		height: 40px;
		float: left;
	}
	
	.incidencia-titol {
		width: 40px;
		height: 40px;
		float: left;
	}
	
	#map_canvas {
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
	
	
	
</style>
</head>
<body onload="initialize()">
	<div class="main">
		<div class="main-top">
			CENTRAL DE BOMBERS <a href="#"> sortir </a>
		</div>
		<div class="main-center">
			<div class="recursos">
				Recursos
				<?php
					while($fila=mysql_fetch_array($r)) {
						echo "<p> Recurs ".$fila['id_recurs'].": disponible </p>";
					}
				?>
			</div>
			<div class="incidencies">
				<div class="incidencies-nav">
					<div class="incidencia-titol"> I1 </div>
					<div class="incidencia-titol"> I2 </div>
					<div class="incidencia-titol"> I3 </div>
					<div class="incidencia-titol"> I4 </div>
				</div>
				<div id="map_canvas"></div>
			</div>
			<div class="info-incidencies">
				INFORMACIO INCIDENCIA
			</div>
		</div>
	</div>	
  <p> <?php echo $titul ?> </p>
</body>
</html>