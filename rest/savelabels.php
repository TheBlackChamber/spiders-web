<?PHP
require_once('dbsupport.php');
try{
	$bugid = $_REQUEST['bugid'];
	$labels = json_decode($_REQUEST['labels']);
	
	if (!isset($_COOKIE["auth"])){
		http_response_code(401);
	}else{
error_log('IN THIS TO WIN');
		//Get cookie
		$auth_cookie = json_decode($_COOKIE['auth']);

		//Find user and compare to auth token from auth cookie
		$get_user_query = $mysqli->prepare("SELECT id FROM user WHERE email = ? and auth_token = ?");
		$get_user_query->bind_param('ss', $auth_cookie->{'email'},$auth_cookie->{'authtoken'});
		$get_user_query->execute();
		$get_user_query->bind_result($returned_user_id);

		if($get_user_query->fetch()){
			$get_user_query->free_result();
			
			$get_bug_label_query = $mysqli->prepare("SELECT bug_id, label_id from bug_label where bug_id = ? and label_id = ?");

			foreach ($labels as &$label) {
				$get_bug_label_query->bind_param('ii',$bugid,$label);
			}
			

/*


			$update_bug_query = $mysqli->prepare("UPDATE bug set priority = ? where id = ?");
			
			$update_bug_query->bind_param('ii', $priorityid,$bugid);
			$update_bug_query->execute();
			$update_bug_query->close();
*/
			echo json_encode($bugid);

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