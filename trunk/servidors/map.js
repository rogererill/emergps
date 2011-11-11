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
            , 'info':'<div id="contentInfoWindow' + n++ + '" style="width: 300px; height: 300px; border: 1px solid #000;"></div>'
        },
        {
            'position':new google.maps.LatLng(18.464008, -66.117776)
            , 'info':'<div id="contentInfoWindow' + n++ + '" style="width: 300px; height: 300px; border: 1px solid #000;"></div>'
        },
        {
            'position':new google.maps.LatLng(18.470826, -66.136205)
            , 'info':'<div id="contentInfoWindow' + n++ + '" style="width: 300px; height: 300px; border: 1px solid #000;"></div>'
        }
    ];
 
    n=1;
    for(var i in markers){
        marker = new google.maps.Marker({
            position: markers[i]['position']
            , map: map
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
};