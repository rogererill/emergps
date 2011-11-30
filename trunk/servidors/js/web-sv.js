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
	
function cridar() {
	    var id = 10004;
		alert(id);
		var url = "http://roger90.no-ip.org/HelloWorld/resources/emergps/lectura/" + id;
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
		  //var posx =  document.getElementById("posx");
          //var posy =  document.getElementById("posy");
		  
		  //posx.value = resp;
		  //posy.value = resp;
		  // ... and use it as needed by your app.
		}
		req.open("GET", url, true);
		req.send();
}

function estat() {
		alert("cridem estat");
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
		  alert(resp);
		  //var posx =  document.getElementById("posx");
          //var posy =  document.getElementById("posy");
		  
		  //posx.value = resp;
		  //posy.value = resp;
		  // ... and use it as needed by your app.
		}
		req.open("GET", url, true);
		req.send();
}

