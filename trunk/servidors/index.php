<html>
	<title> </title>
	<head> 
		 <script src="http://maps.google.com/maps?file=api&amp;v=2&amp;sensor=false&amp;key=ABQIAAAABXxTjx_6_HqFtM_KOT_ZHBS04KOqFTod7Y1A32VKs8iM4xzi3RSWCvFYurYmL5a9AUmSrHcJyJ5REg" type="text/javascript"></script>
		 <script type="text/javascript">
		 	function iniciar() {
		 		var mapa = new GMap2(document.getElementById("mapa"));
		 		mapa.setCenter(new GLatLng(37.4419, -122.1419, 13);
		 		map.setUIToDefault();
		 	}
		 </script>
	</head>
		
	<body onload="iniciar()" onunload="GUnload()">
		<div id="mapa" style="width: 500px; height: 300px"></div>
	</body>
</html>