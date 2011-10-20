<!DOCTYPE html>
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
	      title:"emergencia"
	  	});
	  
		google.maps.event.addListener(marker, 'click', function() {
		 	var finestra = new google.maps.InfoWindow(
		 		{ content: this.title,
		 		  size: new google.maps.Size(50,50)
		 		});
		 	finestra.open(map,marker);
		});
	  	map.setCenter(location);
	}

</script>
</head>
<body onload="initialize()">
  <div id="map_canvas" style="width:50%; height:50%"></div>
</body>
</html>