var map;
var markers = new Array();
var links = ""; // onclick='eventLlista_inc(this.selectedIndex)'>";
var index = 5;
var bounds = new google.maps.LatLngBounds();
var geocoder = new google.maps.Geocoder();
function initialize() {
	var options = {
		zoom: 10,
		center: new google.maps.LatLng(18.470338, -66.123503),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	map = new google.maps.Map(document.getElementById('map'), options);
		
	for (var i = 0; i < 5; i++) {
	    var location = new google.maps.LatLng(41.387917+(i/10), 2.169919-(i/10));
      	var title = "<ul><li> Nom incidencia: Incendi Balmes </li> <li> Direccio: c/Balmes 51 </li> <li> Hora inici: 21:45 </li></ul>";
	    placeRandomMarker(location,title);
	    links += "<a href='#'><div class='element_llista' id="+i+" onclick='eventLlista_inc(this.id)'> Incidencia "+i+"</div></a>";
  	}

	document.getElementById("llista_inc").innerHTML = links;
  	
	google.maps.event.addListener(map, 'click', function(event) {
    	placeMarker(event.latLng);
  	});
}


function crearIncidenciaGeocode(location) {
	var title = document.formGeocode.titolInc.value;
	
	//var momentoActual = new Date(); 
	//var hora = momentoActual.getHours();
	//var minuto = momentoActual.getMinutes(); 
	
	var info = "Nom incidencia: "+title+""; //+" <br> Direccio: - <br> Hora inici: " + hora + ":" + minuto + "</div></a>";
	
	placeRandomMarker(location,info);
	links += "<a href='#'><div class='element_llista' id="+index+" onclick='eventLlista_inc(this.id)'> "+title+"</div></a>";
	document.getElementById("llista_inc").innerHTML = links;
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

function placeRandomMarker(location,info) {
  var marker = new google.maps.Marker({
      position: location, 
      map: map,
      title: info
  });
  bounds.extend(location);
  markers.push(marker);
  var infowindow = new google.maps.InfoWindow({ 
	content: marker.title,
    size: new google.maps.Size(50,50)
  });
  
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
    document.getElementById('info').innerHTML = marker.title;
  });

  map.setCenter(location);
}

function crearIncidencia() {
	var title = document.formCrearInc.titol.value;
	var info = "Nom incidencia: "+title+" <br> Direccio: - <br> Hora inici: - </div></a>";
	var lat = document.formCrearInc.lat.value;
	var lng = document.formCrearInc.lng.value;
	var location = new google.maps.LatLng(lat,lng);
	placeRandomMarker(location,info);
	//links = chopLinks(links);
	//links += "<option value=3>"+title+"";
	//links+="</select></form>";
	links += "<a href='#'><div class='element_llista' id="+index+" onclick='eventLlista_inc(this.id)'> "+title+"</div></a>";
	document.getElementById("llista_inc").innerHTML = links;
	index++;
}

function placeMarker(location) {
  var marker = new google.maps.Marker({
      position: location, 
      map: map,
  });
  
  var infowindow = new google.maps.InfoWindow({ 
  	content: "<form name='formCrearInc'><input type='text' name='titol'><input type='hidden' name='lat' value="+location.lat()+"><input type='hidden' name='lng' value="+location.lng()+"><input type='button' value='crear' name='crear' onclick='crearIncidencia()'></form>",			
    size: new google.maps.Size(50,50)
  });
    
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });

  map.setCenter(location);
  
  infowindow.open(map,marker);
}

/*
window.onload = function(){
    var options = {
        zoom: 14
        , center: new google.maps.LatLng(18.470338, -66.123503)
        , mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    var map = new google.maps.Map(document.getElementById('map'), options);
 
    var n=1;
    var markers = [
        {
            'position':new google.maps.LatLng(18.470338, -66.123503)
            , 'info': "abracadabra1"
        },
        {
            'position':new google.maps.LatLng(18.464008, -66.117776)
            , 'info': "abracadabra2"
        },
        {
            'position':new google.maps.LatLng(18.470826, -66.136205)
            , 'info': "abracadabra3"
        }
    ];
 
    n=1;
    for(var i in markers){
        marker = new google.maps.Marker({
            position: markers[i]['position']
            , map: map
	      	, title: markers[i]['info']
        });
        
        popup = new google.maps.InfoWindow({
            content: markers[i]['info']
            , zIndex: n
        });
        
        //popup.open(map, marker);
        
        (function(id, popup){
            google.maps.event.addListener(popup, 'domready', function(){
                google.maps.event.addDomListener(document.getElementById('contentInfoWindow' + id), 'click', function(){
                    popup.setZIndex(n++);
                });
            })
        })(n++, popup);     
    }
};*/