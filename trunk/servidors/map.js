var map;
var markers = new Array();
var links = "<form name='form_inc'><select name='incidencies' size=6 onclick='eventLlista_inc(this.selectedIndex)'>";

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
	    links += "<option value="+i+"> Incidencia "+i;
  	}
  	links+="</select></form>";
	document.getElementById("llista_inc").innerHTML = links;
  	
	google.maps.event.addListener(map, 'click', function(event) {
    	placeMarker(event.latLng);
  	});
}


function eventLlista_inc(index) {
	document.getElementById('info').innerHTML = markers[index].title;
	map.setCenter(markers[index].position)
}

function placeRandomMarker(location,info) {
  var marker = new google.maps.Marker({
      position: location, 
      map: map,
      title: info
  });
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

function chopLinks(links) {
	var trobat = false;
	for (var i = 0; i < links.length && !trobat; i++) {      
		if (links[i] == "/") return links.substring(0,i-1);
	}
}

function crearIncidencia() {
	var title = document.formCrearInc.titol.value;
	var lat = document.formCrearInc.lat.value;
	var lng = document.formCrearInc.lng.value;
	var location = new google.maps.LatLng(lat,lng);
	placeRandomMarker(location,title);
	links = chopLinks(links);
	links += "<option value=3>"+title+"";
	links+="</select></form>";
	document.getElementById("llista_inc").innerHTML = links;
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