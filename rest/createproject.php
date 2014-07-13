<?PHP
try{
	$label = $_REQUEST['label'];
	$key = $_REQUEST['key'];

	if (!isset($_COOKIE["auth"])){
		http_response_code(401);
	}else{

		//Get cookie
		$auth_cookie = json_decode($_COOKIE['auth']);

		//Find user and compare to auth token from auth cookie
		$get_user_query = $mysqli->prepare("SELECT id FROM user WHERE email = ? and auth_token = ?");
		$get_user_query->bind_param('ss', $auth_cookie->{'email'},$auth_cookie->{'authtoken'});
		$get_user_query->execute();
		$get_user_query->bind_result($returned_user_id);

		if($get_user_query->find()){
			$get_project_query = $mysqli->prepare("SELECT id, name, key FROM project WHERE key = ?");
			$get_project_query->bind_param('s', $key);
			$get_project_query->execute();
			$get_project_query->bind_result($returned_label,$returned_key, $returned_id);

			if($get_project_query->fetch()){
				//Project already exists. Return error
				http_response_code(409);
			}else{
				//Project doesnt exist. Create it.
		    	$insert_user_query = $mysqli->prepare("INSERT INTO project (name,created_on,key,created_by) VALUES (?,NOW(),?,?)");
		    	$insert_user_query->bind_param("ss",$json->email,$json->authtoken);
		    	$insert_user_query->execute();
		    	$insert_user_query->close();
		    	http_response_code(200);
			}
			$get_project_query->close();
		}else{
			http_response_code(403);
		}
		$get_user_query->close();
	}
} catch (Exception $e) {
	error_log('Unexpected Exception occurred: ' . $e);
	http_response_code(500);
}
?>