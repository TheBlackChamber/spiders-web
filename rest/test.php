<?PHP
//require_once('personaverify.php');
//require_once('model/authresponse.php');
require_once('dbsupport.php');
//require_once('service/UserService.php');

// Call the BrowserID API

//$json = new authresponse;

// If the authentication is successful constuct response
//$result = json_decode($response, true);
    
//$userService = new UserService();

//$returnval = $userService->getUserByEmail($mysqli, 'simon@simons.net');

//echo json_encode($returnval);

//$email = 'sminogue@yahoo.com';
//$auth_token = '1234-1234-1234-1234';

//$userService = new UserService();
//$result = $userService->createUser($mysqli,$email,$auth_token);

//if($result){
//echo 'Good';
//}else{
//echo 'Bad';
//}

try{
	
	// If the authentication is successful constuct response
	//$result = json_decode($response, true);
	    $email = 'sminogue3@yahoo.com';

	    $get_user_by_email_query = $mysqli->prepare("SELECT email, created_on, last_seen, auth_token FROM user WHERE email = ?");
	    $get_user_by_email_query->bind_param('s', $email);
	    $get_user_by_email_query->execute();
	    $get_user_by_email_query->bind_result($returned_email,$returned_created_on, $returned_last_seen, $returned_auth_token);
	    if($get_user_by_email_query->fetch()){
	    	echo "Gots Results";
	    }else{
	    	echo "Aint got nobody";
	    }
	    $get_user_by_email_query->close();
	    $json->authtoken = md5(uniqid($email, true));
	    $json->lastseen = $returned_last_seen;
	    $mysqli -> close();
	    echo json_encode($json);
	
} catch (Exception $e) {
	error_log('Shit went bad: ' . $e);
}

?>