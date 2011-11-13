<?php
		
        // Crear el cliente suministrado la ruta del servicio
        // Utilizar el uri
        $client = new SoapClient(null,
                array(
                        'location' => 'http://emergps.site90.com/servicio.php',
                        'uri' => 'urn:webservices',
                ));
 
        // Llamar el metodo como si fuera del cliente
        echo $client->hola();
?>