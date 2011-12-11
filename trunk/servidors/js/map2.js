var map;
var markers = new Array();
var links = new Array(); 
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
var bol = 1;



function enquesta() {
        var s = setTimeout("updateEstat()",5000);
        var t = setTimeout("updatePosicions()",2000);
}

function mouRecursos() {
        var posic = new Array();
        posic = getPosicions();
}       

/* s'encarrega de les noves incidencies, el logins i logouts dels recursos */
function updateEstat() {                
                var url = "http://roger90.no-ip.org/HelloWorld/resources/emergps/estat";
                //var url = "http://mihizawi.redirectme.net/HelloWorld/resources/emergps/estat";
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
                  bol++;
                  var text = "";
                  text+=resp;
                  text+=bol;
                  document.getElementById('info').innerHTML = text;
                  resp = resp.split("#"); //separem en noves incidencies,les q hagin finalitzat, logins i logouts
                  
                  
                  var inc_noves = resp[0].split("&");
                  inc_noves.splice(0,1); //tenim incidencies  
                  
                  var inc_fin = resp[1].split("&");
                  inc_fin.splice(0,1); //tenim incidencies finalitzades
                  
                  var login = resp[2].split("&");
                  login.splice(0,1); //tenim logins
                  
                  var logout = resp[3].split("&");
                  logout.splice(0,1); //tenim logouts
                  
                  
                   /*Logouts - ara cal fer coses:
                   *    1) posar map:null al recurs
                   *    2) eliminar recurs del vector de recursos
                   *    3) enviar confirmacio al servidor central
                   */
                        
                  //format logout: id_recurs
                  for (var i = 0; i < logout.length; i++) {
                        logoutRecurs(logout[i]);
                        //falta enviar confirmacio cv central
                  }     
                  
                  
                  /*Acabar incidencies - ara cal fer 3 coses:
                   *    1) borrar la incidencia en questio del mapa
                   *    2) desasignar les unitas que estaven assignades a la incidencia
                   *    3) notificar al sv central la baixa de la incidencia
                   */
                  
                  //format incidencies finalitzades: id_inc,posx,posy
                  for (var i = 0; i < inc_fin.length; i+=3) {
                        deleteIncidencia(inc_fin[i]); //eliminada i recursos alliberats
                        //falta avisar servidor central
                  }
                  
                   /*Login - ara cal fer 1 coses:
                   *    1) crear nous recursos al mapa  
                   */
                  
                  //format login: id,lat,lon
                 
                  for (var i = 0; i < login.length; i+=3) {
                        var pos_rec = new google.maps.LatLng();
                        logInRecurs(login[i],login[i+2],login[i+1]);
                  }
                  

                  
                  /*Crear incidencies - ara cal fer 2 coses: 
                   *    1) crear la incidencia
                   *    2) assignar automaticament les unitats pertintents i notificar-ho al sv central
                   */
                  
                  // format de la incidencia: id,lat,lon,descripcio
                  for (var i = 0; i < inc_noves.length; i+=4) {
                        //var i = 0;
                        var pos = new google.maps.LatLng(inc_noves[i+2],inc_noves[i+1]);
                        placeRandomMarker(pos,inc_noves[i],inc_noves[i+3]);
                        updateLinks(inc_noves[i],inc_noves[i+3]);
                        //index++;
                        distRecursos(inc_noves[i],pos);
                  }               
                }
                req.open("GET", url, true);
                req.send();
                var s = setTimeout("updateEstat()",5000);
}

function updatePosicions() {
                var url = "http://roger90.no-ip.org/HelloWorld/resources/emergps/posicions";
                //var url = "http://mihizawi.redirectme.net/HelloWorld/resources/emergps/posicions";
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
                  
                  for (var i = 0; i < resp.length; i+=3) {
                        for (var j = 0; j < recursos.length; j++) {
                                id_rec = obteId(recursos[j].getTitle());
                                if (id_rec == resp[i]) {
                                        var pos = new google.maps.LatLng(resp[i+2],resp[i+1]);
                                        recursos[j].setPosition(pos);
                                }
                        }
                  }
                  var t = setTimeout("updatePosicions()",2000);
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
        var t = setTimeout("mouRecursos()",2000);
}

function initialize() {
        directionsDisplay = new google.maps.DirectionsRenderer();
        var center = new google.maps.LatLng(41.387917, 2.169919);
        var options = {
                zoom: 10,
                center: center,
                mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        bounds.extend(center);
        
        map = new google.maps.Map(document.getElementById('map'), options);
        directionsDisplay.setMap(map);

        google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(event.latLng);
        });
        var text = "";
        for (var i = 0; i < recursos.length; i++) {
                text += recursos[i].getTitle();
        }
        document.getElementById("info").innerHTML = text;
        //enquesta();
        var t = setTimeout("updatePosicions()",2000);
        var s = setTimeout("updateEstat()",5000);
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
        return index;
}

function distRecursos(id_inc,pos_incidencia) {
        var cont = 0;
        for (var i = 0; i < recursos.length; i++) {
                if (obteIdInc(recursos[i].getTitle()) == -1) {
                        calculateDistance(obteId(recursos[i].getTitle()),recursos[i].getPosition(),pos_incidencia);     
                        cont++;
                }
        }

        if (cont > 0) t = setTimeout("assignarIncidencies("+id_inc+")",1000);
}

function assignarIncidencies(id_inc) {
        var text = "?id="+id_inc+"&id_ass=";
        for (var i = 0; i < rutes.length; i++) {
                assignarInc(rutes[i].recurs,id_inc);
                if(i < rutes.length-1) text += rutes[i].recurs+"z";
                else text += rutes[i].recurs+"";
        }
        rutes.splice(0,rutes.length);
        distancies.splice(0,distancies.length);
        enviarAssignacio(text); 
}

function enviarAssigFormulari() {
        var id_inc = document.formGeocode.id_inc.value;
        var id_recurs = document.formGeocode.id_recurs.value;
        var atributs = "?id="+id_inc+"&id_ass="+id_recurs;
        assignarInc(id_recurs,id_inc);
        enviarAssignacio(atributs);
}

function enviarAssignacio(atributs) {
        
                var url_base = "http://roger90.no-ip.org/HelloWorld/resources/emergps/asign_uni_web";
                //atributs = "?id=1&id_ass=10002";
                var url = url_base+atributs;
                //var url = url_base + "?id=2&id_ass=10002&";
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
                  alert(resp);  
                }
                req.open("GET", url, true);
                req.send();
}

//assignar una incidencia a un recurs 
function assignarInc(id_recurs,id_inc) {
        var index;
        index = buscaRecursId(id_recurs);
        if(index != -1) {
                        var title = recursos[index].getTitle().split("#");
                        title = title[0]+"#"+id_inc+"";
                        recursos[index].setTitle(title);        
                        alert("s'ha assignat al recurs num " + id_recurs + " la incidencia num " + recursos[index].getTitle());         
        }
        else alert("error al assignar incidencia a recurs "+ id_recurs);
}

function calculateDistance(id_recurs,location1, location2) {
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
                	var pos = afegeixDistancia(durada.value);
                	if (pos != -1) {
                    	directionsDisplay = new google.maps.DirectionsRenderer(
                        {
                        	suppressMarkers: true,
                        	suppressInfoWindows: true
                        });
                                directionsDisplay.setDirections(response);
                                var ruta = {
                                                cami: directionsDisplay,
                                                recurs: id_recurs
                                };
                                if (pos == -2) {
                                        rutes.push(ruta);
                                }
                                else {
                                        rutes[pos] = ruta;
                                }
                        }
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
        for (var i = 0; i < rutes.length; i++) rutes[i].cami.setMap(map);
}

function placeRecurs(location) {
        
  var image = 'img/cotxe_bombers.png';
  
  var marker = new google.maps.Marker({
      position: location, 
      map: map,
      icon: image,
      title: id_actual+"#-1"
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

function logInRecurs(id,lat,ln) {       
        var location = new google.maps.LatLng(lat,ln);
        
        var id2 = id+"";
        id2 = id2.split("");
        alert("let's login " + id2);
        if(id2[0] == 1) {
                var image = 'img/policia.png';
        }
        else if(id2[0] == 2) {
                var image = 'img/bomber.png';   
        }
        else if(id2[0] == 3) {
                var image = 'img/ambulancia.png';
        }
        
        
  
        var marker = new google.maps.Marker({
                position: location, 
            map: map,
            icon: image,
            title: id+"#-1"
        });
          
        var infowindow = new google.maps.InfoWindow({ 
            size: new google.maps.Size(50,50)
        });
        
        infowindow.open(map,marker);
          
        google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map,marker);
        });
                  
        bounds.extend(location);
        recursos.push(marker);
}

function randomIncidencies() {
        for (var i = 0; i < 5; i++) {
            var location = new google.maps.LatLng(41.387917+(i/10), 2.169919-(i/10));//41.387917, 2.169919      
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
        /*var location = new google.maps.LatLng(41.393062, 2.163788);
        placeRecurs(location);
        var location = new google.maps.LatLng(41.38498755231907, 2.1758079528808594);
        placeRecurs(location);
        var location = new google.maps.LatLng(41.394011, 2.112958);
        placeRecurs(location);
        var location = new google.maps.LatLng(41.38495535360129, 2.1345019340515137);
        placeRecurs(location);*/
        var location = new google.maps.LatLng(41.38597765510752, 2.1336543560028076);
        placeRecurs(location);
                
        /*for (var i = 0; i < 10; i++) {
                var location = new google.maps.LatLng(41.387917+(i/32)+Math.random()/3, 1.5-(i/64)+Math.random()/3);
                placeRecurs(location);
        }*/
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

function updateLinks(id_inc,title) {
        if (id_inc != -1) {
                var nou_link = {
                        html:"<a href='#'><div class='element_llista' id="+id_inc+" onclick='eventLlista_inc(this.id)'> "+title+"</div></a>",
                        id_inc: id_inc
                };
                links.push(nou_link);
                //index++;
        }
        /*else {
                index--;
        }*/
                var links_total = "";
                for (var i = 0; i < links.length; i++) {
                        links_total += links[i].html;
                }
                document.getElementById("llista_inc").innerHTML = links_total;
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
        var info = creaInfo(title,lat+","+lng,tIni);
        
        //updateLinks(title);
        //index++;
        enviaNovaIncidencia(location.lat(),location.lng(),title);
}

function crearIncidenciaGeocode(location) {
        var title = document.formGeocode.titolInc.value;
        var tIni = horaActual();
        var info = creaInfo(title,location.lat()+","+location.lng(),tIni);
        //updateLinks(title);
        //index++;
        enviaNovaIncidencia(location.lat(),location.lng(),title);
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

function eventLlista_inc(id_inc) {
        
        for (var i = 0; i < markers.length; i++) {
                var id = markers[i].getTitle();
                id = id.split("#");
                id = id[1];
                if (id == id_inc) {
                        document.getElementById('info').innerHTML = markers[i].title;
                        map.setCenter(markers[i].position);
                        map.setZoom(15);
                        i = 9999;
                }
        }
}

//el nom pot crear confusio, no es crear un marker a una posicio random, sino que es posa a la posicio
//location i amb titol:info
function placeRandomMarker(location,id,info) {
  var image = 'img/incidencia.png';
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
  map.setCenter(location);
}

function enviaNovaIncidencia(lat,ln,descr) {
        var url_base = "http://roger90.no-ip.org/HelloWorld/resources/emergps/new_inc_web";
        var atributs = "?posx="+ln+"&posy="+lat+"&comentari="+descr;
        
                var url = url_base+atributs;
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
                  alert(resp);  
                  var pos = new google.maps.LatLng(lat,ln);
                  placeRandomMarker(pos,resp,descr);
                  updateLinks(resp,descr);
                  distRecursos(resp,pos);
                }
                req.open("GET", url, true);
                req.send();
}

function placeMarker(location) {
  var image = 'wee/incidencia.png';
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

function buscaRecursId(id_recurs) {       
        for (var i = 0; i < recursos.length; i++) {
                var id_rec = obteId(recursos[i].getTitle());
                if (id_rec == id_recurs) return i;
        }
        return -1;
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
                }
        }
        
        for (var k = 0; k < links.length; k++) {
                if (links[k].id_inc == id_inc) {
                        links.splice(k,1);
                        updateLinks(-1,"");
                }               
        }       
        for (var j = 0; j < recursos.length; j++) {
                if (obteIdInc(recursos[j].getTitle()) == id_inc) {
                        alliberarRecurs(j);
                }
        }
}

function logoutRecurs(id_recurs) {
        var index;
        index = buscaRecursId(id_recurs);
        recursos[index].setMap(null);
        recursos.splice(index,1);
}

function createRequest() {
	  var result = null;
	  if (window.XMLHttpRequest) {
		// FireFox, Safari, etc.
		result = new XMLHttpRequest();
		if (typeof result.overrideMimeType != 'undefined') {
		  result.overrideMimeType('text/xml'); // Or anything else
		}
	  }
	  else if (window.ActiveXObject) {
		// MSIE
		result = new ActiveXObject("Microsoft.XMLHTTP");
	  } 
	  else {
		// No known mechanism -- consider aborting the application
	  }
	  return result;
}
/*
?id=3&id_ass=10009
just abans de cridar asign_uni_web, url = http://roger90.no-ip.org/HelloWorld/resources/emergps/asign_uni_web?id=3&id_ass=10009
just abans de cridar asign_uni_web, url = http://roger90.no-ip.org/HelloWorld/resources/emergps/asign_uni_web?id=2&id_ass=10002z10004z10005
just abans de cridar asign_uni_web, url = http://roger90.no-ip.org/HelloWorld/resources/emergps/asign_uni_web?id=2&id_ass=10002z10004z10005*/