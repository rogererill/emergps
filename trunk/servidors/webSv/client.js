   var http_request = false;
   function makePOSTRequest(method,url, parameters) {
      http_request = false;
      if(window.XMLHttpRequest) { // Mozilla, Safari,...
         http_request = new XMLHttpRequest();
         if (http_request.overrideMimeType) {
               // Set type accordingly to anticipated content type.
            http_request.overrideMimeType('text/xml');
            // http_request.overrideMimeType('text/html');
         }
      } 
      if (!http_request) {
         alert('Cannot create XMLHttpRequest object');
         return false;
      }

      http_request.onreadystatechange = alertContents;
     // http_request.open(method, url, true);

     if(method=='GET'){
                 http_request.open(method, url+parameters, true);
                 http_request.setRequestHeader("Content-type", "text/xml");
                 http_request.setRequestHeader("Content-length", parameters.length);
                 http_request.setRequestHeader("Connection", "close");
                 http_request.send(null);
         }
     if(method=='POST')  {
                 http_request.open(method, url, true);
                 http_request.setRequestHeader("Content-type", "text/xml");
                 http_request.setRequestHeader("Content-length", parameters.length);
                 http_request.setRequestHeader("Connection", "close");
                 http_request.send(parameters);
         }
     if(method=='PUT')  {
                 http_request.open(method, url, true);
                 http_request.setRequestHeader("Content-type", "text/xml");
                 http_request.setRequestHeader("Content-length", parameters.length);
                 http_request.setRequestHeader("Connection", "close");
                 http_request.send(parameters);
         }
     if(method=='DELETE')  {
                 http_request.open(method, url+parameters, true);
                 http_request.setRequestHeader("Content-type", "text/xml");
                 http_request.setRequestHeader("Content-length", parameters.length);
                 http_request.setRequestHeader("Connection", "close");
                 http_request.send(null);
         }
	}

function alertContents() {
   if (http_request.readyState == 4) {
      if (http_request.status == 200) {
        alert('Response received from server:\n'+http_request.responseText);
        result = http_request.responseText;
   // Turn < and > into &lt; and &gt; for displaying on the page.
        result = result.replace(/\<([^!])/g, '&lt;$1');
        result = result.replace(/([^-])\>/g, '$1&gt;');
       document.getElementById('serverresponse').innerHTML = result;
    } else {
      alert('There was a problem with the request.' 
                    +http_request.responseText +' '+http_request.status);
      document.getElementById('serverresponse').innerHTML = http_request.responseText;
      }
   }
}
   
   function postTheForm() {
      var poststr = document.myform.xmldata.value ;
      alert('Sending XML to server:\n'+poststr);
      makePOSTRequest('POST',document.myform.endpointURL.value , poststr);
   }
   
   function getTheForm() {
      var getStr = encodeURI(document.myform.xmldata.value) ;
      alert('Sending XML to server:\n'+getStr);
      makePOSTRequest('GET',document.myform.endpointURL.value , getStr);
   }
   
   function putTheForm() {
      var poststr = document.myform.xmldata.value ;
      alert('Sending XML to server:\n'+poststr);
      makePOSTRequest('PUT',document.myform.endpointURL.value , poststr);
   }
   
   function deleteTheForm() {
      var getStr = encodeURI(document.myform.xmldata.value) ;
      alert('Sending XML to server:\n'+getStr);
      makePOSTRequest('DELETE',document.myform.endpointURL.value , getStr);
   }
