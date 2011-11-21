var map;
var markers = new Array();
var links = ""; 
var index = 0;
var bounds = new google.maps.LatLngBounds();
var geocoder = new google.maps.Geocoder();
var finestra;
var markerG;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var recursos = new Array();
var id_actual = 30000;

function timeMsg() {
	//var t=setTimeout("alertMsg()",3000);
	var t = setTimeout("mouRecursos()",2000);
}

function mouRecursos() {
	for (var i = 0; i < 2; i++) {
		mouRecurs(i);
	}
}	

function mouRecurs(pos) {
	
	var location = recursos[pos].getPosition();
	
	recursos[pos].setPosition(new google.maps.LatLng(location.lat()+0.1*Math.random(), location.lng()-0.1*Math.random()));
	
	var location2 = recursos[pos].getPosition();
	
	var text = "primera posicio: " + location.lat() + ", " + location.lng() + ". I segona posicio: " + location2.lat() + ", " + location2.lng();
	document.getElementById("info").innerHTML = text;
	//var t = setTimeout("mouRecursos()",2000);
}

function alertMsg() {
	
	if (Math.random() > 0.5) {
	var title = "fetaAmbTimer";
	var tIni = horaActual();
	var info = creaInfo(title,"-",tIni);
	var location = new google.maps.LatLng(41.387917-Math.random(), 2.169919+Math.random()); 
	
	placeRandomMarker(location,info);
	updateLinks(title);
	index++;
	
	alert("Hello");
	
	}
	var t=setTimeout("alertMsg()",3000);
}

function initialize() {
	directionsDisplay = new google.maps.DirectionsRenderer();
	var options = {
		zoom: 10,
		center: new google.maps.LatLng(18.470338, -66.123503),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	map = new google.maps.Map(document.getElementById('map'), options);
	directionsDisplay.setMap(map);
  	
  	randomIncidencies();
  	randomRecursos();
	google.maps.event.addListener(map, 'click', function(event) {
    	placeMarker(event.latLng);
  	});
  	map.fitBounds(bounds);
  	var text = "";
  	for (var i = 0; i < recursos.length; i++) {
  		text += recursos[i].getTitle();
  	}
  	document.getElementById("info").innerHTML = text;
  	//timeMsg();
}

function calculateDistance() {
	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer(
	{
	   suppressMarkers: true,
	   suppressInfoWindows: true
	});
	directionsDisplay.setMap(map);
	
	var location1 = new google.maps.LatLng(39.99742423181819, 3.8307711482048035);  	
	var location2 = new google.maps.LatLng(39.997206425976294, 3.8302507996559143);  
	
	var request = {
	   origin:location1,
	   destination:location2,
	   travelMode: google.maps.DirectionsTravelMode.DRIVING
	};
	directionsService.route(request, function(response, status)
	{
	   if (status == google.maps.DirectionsStatus.OK)
	   {
	      directionsDisplay.setDirections(response);
	      distance = "The distance between the two points on the chosen route is: "+response.routes[0].legs[0].distance.text;
	      distance += "The aproximative driving time is: "+response.routes[0].legs[0].duration.text;
	      document.getElementById("info").innerHTML = distance;
	   }
	});
}

function placeRecurs(location) {
  var image = 'cotxe_bombers.png';
  var recurs = new google.maps.Marker({
      position: location, 
      map: map,
      icon: image,
      title: id_actual+""
  });
  id_actual++;
  bounds.extend(location);
  recursos.push(recurs);
}

function randomIncidencies() {
	for (var i = 0; i < 5; i++) {
	    var location = new google.maps.LatLng(41.387917+(i/10), 2.169919-(i/10));  	
  		var title = "Incendi Balmes";
		var tIni = horaActual();
		var info = creaInfo(title,"-",tIni);
		
		placeRandomMarker(location,info);
		updateLinks(title);
		index++;
  	}

	document.getElementById("llista_inc").innerHTML = links;
}

function randomRecursos() {
	for (var i = 0; i < 6; i++) {
		var location = new google.maps.LatLng(41.387917+(i/32)+Math.random()/3, 1.5-(i/64)+Math.random()/3);
		/*var recurs = {
			pos: location,
			id: id
		};*/
		placeRecurs(location);
	}
}

function dibuixaCami(start,end) {
	var request = {
	    origin:start,
	    destination:end,
	    travelMode: google.maps.TravelMode.DRIVING
	  };
	  
  	directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
    }
  });
}

function creaInfo(titol,direccio,horaIn) {
	return "Nom incidencia: "+titol+" <br> Direccio: " + direccio + " <br> Hora inici: " + horaIn + " </div></a>";
}

function updateLinks(title) {
		links += "<a href='#'><div class='element_llista' id="+index+" onclick='eventLlista_inc(this.id)'> "+title+"</div></a>";
		document.getElementById("llista_inc").innerHTML = links;
}

function horaActual() {
	var momentoActual = new Date(); 
	var hora = momentoActual.getHours();
	var minuto = momentoActual.getMinutes(); 
	return hora + ":" + minuto;
}

function crearIncidencia() {
	
	var title = document.formCrearInc.titol.value;
	var lat = document.formCrearInc.lat.value;
	var lng = document.formCrearInc.lng.value;
	var location = new google.maps.LatLng(lat,lng);
	var tIni = horaActual();
	var info = creaInfo(title,"-",tIni);
	
	placeRandomMarker(location,info);
	updateLinks(title);
	index++;
}

function crearIncidenciaGeocode(location) {
	var title = document.formGeocode.titolInc.value;
	var tIni = horaActual();
	var info = creaInfo(title,"-",tIni);
	
	placeRandomMarker(location,info);
	updateLinks(title);
	index++;
}

function codeAddress() { 
	var sAddress = document.getElementById("inputTextAddress").value;
	geocoder.geocode( { 'address': sAddress}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			crearIncidenciaGeocode(results[0].geometry.location);
		}
		else{
			alert("Geocode was not successful for the following reason: " + status);
		}
	 });
}

function vista_general() {
	//Ajustar el zoom según los límites
	map.fitBounds(bounds);
}

function eventLlista_inc(index) {
	document.getElementById('info').innerHTML = markers[index].title;
	map.setCenter(markers[index].position);
	map.setZoom(15);
}

//el nom pot crear confusio, no es crear un marker a una posicio random, sino que es posa a la posicio
//location i amb titol:info
function placeRandomMarker(location,info) {
  var image = 'fire.png';
  var marker = new google.maps.Marker({
      position: location, 
      map: map,
      title: info,
      icon: image
  });
  var infowindow = new google.maps.InfoWindow({ 
	content: marker.title,
    size: new google.maps.Size(50,50)
  });
  
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
    document.getElementById('info').innerHTML = marker.title;
  });

  bounds.extend(location);
  markers.push(marker);
  map.setCenter(location);
}

function placeMarker(location) {
  var image = 'fire.png';
  var marker = new google.maps.Marker({
      position: location, 
      map: map,
      icon: image
  });
    
  finestra = new google.maps.InfoWindow({ 
  	content: "<form name='formCrearInc'><input type='text' name='titol'><input type='hidden' name='lat' value="+location.lat()+"><input type='hidden' name='lng' value="+location.lng()+"><input type='button' value='crear' name='crear' onclick='crearIncidencia()'></form>",			
    size: new google.maps.Size(50,50)
  });
    
    
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });

  map.setCenter(location);
  finestra.open(map,marker);
  markerG = marker;
}

