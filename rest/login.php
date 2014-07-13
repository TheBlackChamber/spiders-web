<?PHP
require_once('personaverify.php');
require_once('model/authresponse.php');
require_once('dbsupport.php');
try{
	// Call the BrowserID API
	$response = PersonaVerify();
	$json = new authresponse;

	// If the authentication is successful constuct response
	$result = json_decode($response, true);
	if ('okay' == $result['status']) {
		$json->email = $result['email'];

	    $get_user_by_email_query = $mysqli->prepare("SELECT email, created_on, last_seen, auth_token FROM user WHERE email = ?");
	    $get_user_by_email_query->bind_param('s', $json->email);
	    $get_user_by_email_query->execute();
	    $get_user_by_email_query->bind_result($returned_email,$returned_created_on, $returned_last_seen, $returned_auth_token);
	    $json->authtoken = md5(uniqid($json->email, true));
	    
	    if($get_user_by_email_query->fetch()){

	    	$json->lastseen = $returned_last_seen;
	    	$get_user_by_email_query->close();
	    	$update_user_query = $mysqli->prepare("UPDATE user SET last_seen = NOW(), auth_token = ? where email = ?");
		    $update_user_query->bind_param("ss", $json->authtoken, $json->email);
		    $update_user_query->execute();
		    $update_user_query->close();

	    }else{
	    	$get_user_by_email_query->close();
	    	$insert_user_query = $mysqli->prepare("INSERT INTO user (email,created_on,last_seen,auth_token) VALUES (?,NOW(),NOW(),?)");
	    	$insert_user_query->bind_param("ss",$json->email,$json->authtoken);
	    	$insert_user_query->execute();
	    	$insert_user_query->close();
	    	
	    }
	    
	    $mysqli -> close();

	    echo json_encode($json);
	}else{
		error_log('Failed to Authenticate');
		echo json_encode(array('status'=>'ERROR','message'=>'Failed to authenticate'));
	}
} catch (Exception $e) {
	error_log('Unexpected Exception occurred: ' . $e);
	echo json_encode(array('status'=>'ERROR','message'=>'Unexpected exception occurred'));
}
?>