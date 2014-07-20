<?PHP
	$mysqli = new mysqli("127.0.0.1", "root", null, "spidersweb");
	if ($mysqli->connect_errno) {
	    error_log("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
	    exit();
	}

	
?>