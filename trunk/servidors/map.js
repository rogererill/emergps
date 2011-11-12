var map;
var nInc;
var markers = new Array();
function initialize() {
	nInc = 0;
	var options = {
		zoom: 5,
		center: new google.maps.LatLng(18.470338, -66.123503),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	map = new google.maps.Map(document.getElementById('map'), options);
	var links = "<form name='form_inc'><select name='incidencies' size=5 onclick='eventLlista_inc(this.selectedIndex)'";
		
	for (var i = 0; i < 5; i++) {
	    var location = new google.maps.LatLng(18.470338+i, -66.123503+i);
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

function modificaMapa(centre) {
	map.setCenter(centre);
}

function eventLlista_inc(index) {
	document.getElementById('info').innerHTML = markers[index].title;
	modificaMapa(markers[index].position);
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

function placeMarker(location) {
  var marker = new google.maps.Marker({
      position: location, 
      map: map,
  });
  
  var infowindow = new google.maps.InfoWindow({ 
  	content: "<form method='post' action='index.php'><input type='text' name='titol'><input type='hidden' name='lat' value="+location.lat()+"><input type='hidden' name='lng' value="+location.lng()+"><input type='text' name='index' value="+nInc+"><input type='submit' name='crear' value='ok'>",			
    size: new google.maps.Size(50,50)
  });
  
  nInc++; //identificador de la incidencia
  
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });

  map.setCenter(location);
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