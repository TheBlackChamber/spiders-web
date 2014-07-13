<?PHP
function getUserByEmail($mysqli, $email){

	if($get_user_by_email_query = $mysqli->prepare("SELECT email, created_on, last_seen, auth_token FROM user WHERE email = ?")){

		$get_user_by_email_query->bind_param('s', $email);
		$get_user_by_email_query->bind_result($returned_email,$returned_created_on, $returned_last_seen, $returned_auth_token);
		$get_user_by_email_query->execute();

		while($get_user_by_email_query->fetch()){
			$result = array(
				"email" => $returned_email,
				"created_on" => $returned_created_on,
				"last_seen" => $returned_last_seen,
				"auth_token" => $returned_auth_token
				);
		}

		$get_user_by_email_query->free_result();
	}else{
		error_log("Error: Failed to prepare statement in UserService.getUserByEmail");
		$result = null;
	}
	$mysqli->close();

	if(isset($result)){
		return $result;
	}else{
		return array();
	}

}

function createUser($mysqli, $email, $auth_token){

	if($create_user_insert = $mysqli->prepare("INSERT INTO user (email,created_on,last_seen,auth_token) values (?,now(),now(),?)")){

		$create_user_insert->bind_param('ss', $email, $auth_token);
		if($create_user_insert->execute()){
			$result = true;
		}else{
			error_log("Failed to insert new user: " . $create_user_insert->error);
			$result = false;
		}

	}else{
		
		error_log("Error: Failed to prepare statement in UserService.createUser");
		$result = false;

	}
	$mysqli->close();

	return $result;

}
?>

