var map;
var markers = new Array();
var links = ""; 
var index = 0;
var bounds = new google.maps.LatLngBounds();
var geocoder = new google.maps.Geocoder();
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var recursos = new Array();
var recursos_ocupats = new Array();
var id_actual = 10000;
var distancies = new Array();
var dist_actual;
var pos = 0;
var rutes = new Array();
var id_incidencia_actual = 0;


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

/* s'encarrega de les noves incidencies, el logins i logouts dels recursos */
function updateEstat() {
		alert("cridem updateStat");
		var url = "http://roger90.no-ip.org/HelloWorld/resources/emergps/estat";
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
		  resp = resp.split("#"); //separem en noves incidencies,les q hagin finalitzat, logins i logouts
		  
		  var inc_noves = resp[0].split("&");
		  inc.splice(0,1); //tenim incidencies  
		  alert("noves inc: " + inc);
		  
		  /*ara cal fer 2 coses: 
		   * 	1) crear la incidencia
		   * 	2) assignar automaticament les unitats pertintents i notificar-ho al sv central
		   */
		  
		  // format de la incidencia: id,lat,lon,descripcio
		  for (var i = 0; i < inc_noves.length; i+=4) {
		  	var pos = new google.maps.LatLng(inc_noves[i+2],inc_noves[i+1]);
		  	placeRandomMarker(pos,inc_noves[i],inc_noves[i+3]);
		  	//falta assignar unitats a la incidencia (unitats que no estiguin ja assignades)
		  }
		  
		  var inc_fin = resp[1].split("&");
		  inc_fin.splice(0,1); //tenim incidencies finalitzades
		  alert("incidencies finalitzades: "+ inc_fin);
		  
		  /*ara cal fer 3 coses:
		   * 	1) borrar la incidencia en questio del mapa
		   * 	2) desasignar les unitas que estaven assignades a la incidencia
		   * 	3) notificar al sv central la baixa de la incidencia
		   */
		  
		  //format incidencies finalitzades: id_inc
		  for (var i = 0; i < inc_fin.length; i++) {
		  	deleteIncidencia(inc_fin[i]); //eliminada i recursos alliberats
		  	//falta avisar servidor central
		  }
		  
		  //var login = resp[2].split("&");
		  //login.splice(0,1); //tenim logins
		  
		  /*ara cal fer 1 coses:
		   * 	1) crear nous recursos al mapa 	
		   */
		  /*
		  //format login: id,lat,lon
		 
		  for (var i = 0; i < login.length; i+=3) {
		  	var pos_rec = new google.maps.LatLng(login[i+2],login[i+1]);
		  	logInRecurs(id,location)
		  }*/
		  		  
		  //var logout = resp[3].split("&");
		  //login.splice(0,1); //tenim logouts
		  
		  /*ara cal fer coses:
		   * 	1) posar map:null al recurs
		   * 	2) eliminar recurs del vector de recursos
		   * 	3) enviar confirmacio al servidor central
		   */
		  
		  //format logout: id_recurs
		  for (var i = 0; i < logout.length; i++) {
		  	logoutRecurs(logout[i]);
		  	//falta enviar confirmacio cv central
		  }
		  		  
		  alert("logins: " );
		  alert("logouts: ");
		  		  
		}
		req.open("GET", url, true);
		req.send();
}

function updatePosicions() {
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
		  		id_rec = obteId(recursos[j].getTitle());
		  		if (id_rec == resp[i]) {
		  			var pos = new google.maps.LatLng(resp[i+2],resp[i+1]);
		  			recursos[j].setPosition(pos);
		  		}
		  	}
		  }
		  
		}
		req.open("GET", url, true);
		req.send();
}

/*donat el titol d'un RECURS, retorna l'id del recurs*/
function obteId(title) {
	title = title.split("#");
	return title[0];
}

/*donat el titol d'un RECURS, retorna l'id de l'incidencia la qual esta assignat*/
function obteIdInc(title) {
	title = title.split("#");
	return title[1];
}

function mouRecurs(pos) {
	
	var location = recursos[pos].getPosition();
	
	recursos[pos].setPosition(new google.maps.LatLng(location.lat()+0.1*Math.random(), location.lng()-0.1*Math.random()));
	
	var location2 = recursos[pos].getPosition();
	
	var text = "primera posicio: " + location.lat() + ", " + location.lng() + ". I segona posicio: " + location2.lat() + ", " + location2.lng();
	document.getElementById("info").innerHTML = text;
	//var t = setTimeout("mouRecursos()",2000);
}
/*
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
}*/

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
	for (var i = 0; i < recursos.length; i++) {
		calculateDistance(recursos[i].getPosition(),posIncidencia);
	}
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
			//alert ("la durada es " + durada.value);
	      	var pos = afegeixDistancia(durada.value);
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
}

function placeRecurs(location) {
	
  var image = 'cotxe_bombers.png';
  
  var marker = new google.maps.Marker({
      position: location, 
      map: map,
      icon: image,
      title: id_actual+"#0"
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

function logInRecurs(id,location) {	
	var image = 'cotxe_bombers.png';
  
	var marker = new google.maps.Marker({
		position: location, 
	    map: map,
	    icon: image,
	    title: id+"#-1"
	});
	  
	var infowindow = new google.maps.InfoWindow({ 
	    size: new google.maps.Size(50,50)
	});
	  
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map,marker);
	});
		  
	bounds.extend(location);
	recursos.push(marker);
}

function randomIncidencies() {
	for (var i = 0; i < 5; i++) {
	    var location = new google.maps.LatLng(41.387917+(i/10), 2.169919-(i/10));  	
  		var title = "Incendi Balmes";
		var tIni = horaActual();
		var info = creaInfo(title,"-",tIni);
		
		placeRandomMarker(location,i,info);
		updateLinks(title);
		index++;
  	}

	document.getElementById("llista_inc").innerHTML = links;
}

function randomRecursos() {
	for (var i = 0; i < 10; i++) {
		var location = new google.maps.LatLng(41.387917+(i/32)+Math.random()/3, 1.5-(i/64)+Math.random()/3);
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
	
	placeRandomMarker(location,id_incidencia_actual+1,info);
	updateLinks(title);
	index++;
}

function crearIncidenciaGeocode(location) {
	var title = document.formGeocode.titolInc.value;
	var tIni = horaActual();
	var info = creaInfo(title,"-",tIni);
	
	placeRandomMarker(location,id_incidencia_actual+1,info);
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
function placeRandomMarker(location,id,info) {
  var image = 'fire.png';
  var marker = new google.maps.Marker({
      position: location, 
      map: map,
      title: info+"#"+id+"",
      icon: image
  });
  
  var infowindow = new google.maps.InfoWindow({ 
	content: info,
    size: new google.maps.Size(50,50)
  });
  
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
    var info = marker.title;//.split("#");
    //info = info[0];
    document.getElementById('info').innerHTML = info;
  });

  bounds.extend(location);
  markers.push(marker);
  id_incidencia_actual = id;
  map.setCenter(location);
}

function placeMarker(location) {
  var image = 'fire.png';
  var marker = new google.maps.Marker({
      position: location, 
      map: map,
      icon: image
  });
    
  var finestra = new google.maps.InfoWindow({ 
  	content: "<form name='formCrearInc'><input type='text' name='titol'><input type='hidden' name='lat' value="+location.lat()+"><input type='hidden' name='lng' value="+location.lng()+"><input type='button' value='crear' name='crear' onclick='crearIncidencia()'></form>",			
    size: new google.maps.Size(50,50)
  });
    
    
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });

  map.setCenter(location);
  finestra.open(map,marker);
}

//assignar una incidencia a un recurs 
function assignarInc(id_recurs,id_inc) {
	var title = recursos[id_recurs].getTitle().split("#");
	title = title[0]+"#"+id_inc+"";
	recursos[id_recurs].setTitle(title);	
}

//desasignar qualsevol el recurs duna incidencia
function alliberarRecurs(id_recurs) {
	var title = recursos[id_recurs].getTitle().split("#");
	title = title[0]+"#-1";
	recursos[id_recurs].setTitle(title);	
}

function deleteIncidencia(id_inc) {
	for (var i = 0; i < markers.length; i++) {
		var id = markers[i].getTitle();
		id = id.split("#");
		id = id[1];
		if (id == id_inc) {
			markers[i].setMap(null);
			markers.splice(i,1);
			alert("hem eliminat incidencia correctament");
		}
	}
	for (var j = 0; j < recursos.length; j++) {
		if (obteIdInc(recursos[j].getTitle()) == id_inc) {
			alliberarRecurs(j);
		}
	}
}

function logoutRecurs(recurs) {
	for (var i = 0; i < recursos.length; i++) {
		var id = obteId(markers[i].getTitle());
		if (id == recurs) {
			recursos[i].setMap(null);
			recursos.splice(i,1);
			alert("hem eliminat incidencia recurs correctament");
		}
	}
	alert("error: no s'ha pogut logout algun recurs");
}
