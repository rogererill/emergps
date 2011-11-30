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
var recursos_ocupats = new Array();
var id_actual = 10000;
var distancies = new Array();
var dist_actual;
var pos = 0;
var rutes = new Array();

var resultat_distancies = "";

function timeMsg() {
	//var t=setTimeout("alertMsg()",3000);
	var t = setTimeout("mouRecursos()",2000);
}

function mouRecursos() {
	var posic = new Array();
	posic = getPosicions();
	alert(posic);
	//for (var i = 0; i < recursos.length; i++) {
		//mouRecurs(i);
	//}
}	

function getPosicions() {
		alert("cridem getPosicions");
		var url = "http://roger90.no-ip.org/HelloWorld/resources/emergps/posicions";
		var req = createRequest(); // defined above
		// Create the callback:
		req.onreadystatechange = function() {
		  if (req.readyState != 4) return; // Not there yet
		  if (req.status != 200) {
			// Handle request failure here...
			alert(req.status);
			return;
		  }
		  // Request successful, read the response
		  var resp = req.responseText;	  
		  resp = resp.split("&");
		  resp.splice(0,1); //ara ja tenim a resp, cada posicio: id,lat,lon,id,lat,lon... etc
		  alert(resp);
		  
		  for (var i = 0; i < resp.length; i+=3) {
		  	for (var j = 0; j < recursos.length; j++) {
		  		if (recursos[j].getTitle() == resp[i]) {
		  			var pos = new google.maps.LatLng(resp[i+2],resp[i+1]);
		  			recursos[j].setPosition(pos);
		  		}
		  	}
		  }
		  
		}
		req.open("GET", url, true);
		req.send();
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
  	//distancies.push(9999999);
  	//distancies.push(9999998);
  	//distancies.push(9999997);
  	//timeMsg();
}

function maxDistancia() {
		
	var max = distancies[0];
	var index = 0;
	
	for (var i = 1; i < distancies.length; i++) {
		if (distancies[i] > max) {
			max = distancies[i];
			index = i;
		}
	}
	//alert("la maxima distancia es "+ index);
	//distancies.splice(index,1);	
	return index;
}

function distRecursos() {
	var posIncidencia = new google.maps.LatLng(41.387917, 2.169919);
	for (var i = 0; i < recursos.length; i++) calculateDistance(posIncidencia,recursos[i].getPosition());
}

function calculateDistance(location1, location2) {
	directionsService = new google.maps.DirectionsService();
	
	var request = {
	   origin:location1,
	   destination:location2,
	   travelMode: google.maps.DirectionsTravelMode.DRIVING
	};
	
	directionsService.route(request, function(response, status)
	{
		if (status == google.maps.DirectionsStatus.OK)
	   	{   
			var distance = response.routes[0].legs[0].distance;
			var durada = response.routes[0].legs[0].duration;
			resultat_distancies += "distancia= " + distance.value + ", ";
			//alert ("la durada es " + durada.value);
	      	var pos = afegeixDistancia(distance.value);
	      	if (pos != -1) {
	      		directionsDisplay = new google.maps.DirectionsRenderer(
				{
			   		suppressMarkers: true,
			   		suppressInfoWindows: true
				});
		  		directionsDisplay.setDirections(response);
			  	if (pos == -2) {
			  		rutes.push(directionsDisplay);
			  		//alert("ha tret -2");
			  	}
			  	else {
			  		rutes[pos] = directionsDisplay;
					//alert("ha tret guai");
				}
			}
			//else alert("ha tret -1");
	      //distance += "The aproximative driving time is: "+response.routes[0].legs[0].duration.text;
	      document.getElementById("info").innerHTML = distance.value;	      
	   } 
	   else alert("Error al calcular distancia");
	});
}

function afegeixDistancia(distancia) {
	if (distancies.length < 3) {
		alert("encara no em picat el boto 3 cops");
		distancies.push(distancia);
		return -2;
	}
	else {
		return min3Dists(distancia);
	}
}

function min3Dists(distancia) {
	if (distancies[maxDistancia()] > distancia) {
		distancies[maxDistancia()] = distancia;
		return maxDistancia();
	}
	return -1;
}

function showRoute() {
	for (var i = 0; i < rutes.length; i++) rutes[i].setMap(map);
	document.getElementById("info").innerHTML = resultat_distancies;     
}

function placeRecurs(location) {
	
  var image = 'cotxe_bombers.png';
  
  var marker = new google.maps.Marker({
      position: location, 
      map: map,
      icon: image,
      title: id_actual+""
  });
  
  var infowindow = new google.maps.InfoWindow({ 
	content: marker.position+"",
    size: new google.maps.Size(50,50)
  });
  
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });
	  
  id_actual++;
  bounds.extend(location);
  recursos.push(marker);
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
	for (var i = 0; i < 10; i++) {
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



