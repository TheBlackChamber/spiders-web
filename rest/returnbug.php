<?PHP
require_once('dbsupport.php');
try{
	$bugid = $_REQUEST['bugid'];
	
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
			
			$get_bug_query = $mysqli->prepare("SELECT assigned from bug where id = ? and assigned = ?");
			$get_bug_query->bind_param('ii', $bugid,$returned_user_id);
			$get_bug_query->execute();
			$get_bug_query->bind_result($returned_assigned_id);


			if($get_bug_query->fetch()){
				$get_bug_query->free_result();

				$update_bug_query = $mysqli->prepare("UPDATE bug set assigned = null where id = ?");
			
				$update_bug_query->bind_param('i',$bugid);
				$update_bug_query->execute();
				$update_bug_query->close();

				echo json_encode($bugid);

			}else{
				http_response_code(403);
			}
			$get_bug_query->close();

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