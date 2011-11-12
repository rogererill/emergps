var map;
var nInc;
function initialize() {
	nInc = 0;
	var options = {
		zoom: 5,
		center: new google.maps.LatLng(18.470338, -66.123503),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	map = new google.maps.Map(document.getElementById('map'), options);
	var links = "";
	
	for (var i = 0; i < 5; i++) {
	    var location = new google.maps.LatLng(18.470338+i, -66.123503+i);
	    var marker = new google.maps.Marker({
	        position: location, 
	        map: map,
	    });
	    placeRandomMarker(location);
	    links += "<a href=#> <div class='incidencia-titol'> Inc " + i +"</div> </a>";
  	}
	document.getElementById("incidencies-nav").innerHTML = links;

	google.maps.event.addListener(map, 'click', function(event) {
    	placeMarker(event.latLng);
  	});
}

function placeRandomMarker(location) {
  var marker = new google.maps.Marker({
      position: location, 
      map: map,
      title: "<ul><li> Nom incidencia: Incendi Balmes </li> <li> Direccio: c/Balmes 51 </li> <li> Hora inici: 21:45 </li></ul>"
  });
  
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