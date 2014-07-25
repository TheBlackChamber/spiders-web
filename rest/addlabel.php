<?PHP
require_once('dbsupport.php');
try{
	$bugid = $_REQUEST['bugid'];
	$labelid = json_decode($_REQUEST['labelid']);
	
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

		if($get_user_query->fetch()){
			$get_user_query->free_result();
			
			$insert_bug_label_query = $mysqli->prepare("INSERT INTO bug_label (bug_id,label_id) VALUES (?,?)");
			$insert_bug_label_query->bind_param('ii',$bugid,$labelid);
			$insert_bug_label_query->execute();
			$insert_bug_label_query->close();

			echo json_encode($labelid);

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