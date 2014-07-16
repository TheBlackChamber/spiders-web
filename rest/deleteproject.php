<?PHP
require_once('dbsupport.php');
require_once('model/project.php');
try{

	$key = $_REQUEST['key'];
	
	if (!isset($_COOKIE["auth"])){
	
		http_response_code(401);
	
	}else{

		$auth_cookie = json_decode($_COOKIE['auth']);

	}

} catch (Exception $e) {
	error_log('Unexpected Exception occurred: ' . $e);
	http_response_code(500);
}
?>