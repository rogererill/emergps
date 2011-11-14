<?php

function connect_DB() {
	$mysql_host = "mysql4.000webhost.com";
	$mysql_database = "a7211314_bombers";
	$mysql_user = "a7211314_bombers";
	$mysql_password = "ensaimada9";
	mysql_connect($mysql_host, $mysql_user, $mysql_password);
	mysql_select_db($mysql_database);
}

function connect_DB_users() {
	$mysql_host = "mysql4.000webhost.com";
	$mysql_database = "a7211314_central";
	$mysql_user = "a7211314_central";
	$mysql_password = "ensaimada9";
	mysql_connect($mysql_host, $mysql_user, $mysql_password);
	mysql_select_db($mysql_database);
}
	
?>