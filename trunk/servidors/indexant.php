<!DOCTYPE html>
<?php 
	include("util.php");
	connect_DB();
	$titul = $_GET['titul'];
	
	$sql = "select * from incidencia";
	$r = mysql_query($sql);
	$nInc = mysql_num_rows($r);
	
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
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&amp;language=es"></script>
<script type="text/javascript" src="map.js"></script>


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
	
</style>
</head>
<body>
	<div class="main">
		<div class="main-top">
			CENTRAL DE BOMBERS <a href="#"> sortir </a>
		</div>
		<div class="main-center">
			<div class="recursos">
			<?php
         		$incidencia = mysql_fetch_array($r);
				echo $incidencia['lat'];
				echo $incidencia['lng'];
				echo $incidencia['name'];
			?>
			var NOMBRE = <?php echo $nInc?>;
			var lng = <?php echo $lng?>;
			var titol = <?php echo $name?>;

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
				Introdueix nova incidencia
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
  <p> <?php echo $titul ?> </p>
</body>
</html>