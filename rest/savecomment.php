<?PHP
require_once('dbsupport.php');
try{
	$bugid = $_REQUEST['bugid'];
	$comment = $_REQUEST['comment'];
	$commentid = $_REQUEST['id'];

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
			
			if(isset($bugid)){
				$insert_comment_query = $mysqli->prepare("INSERT into comment (contents, created_by, created_on, bug_id) VALUES (?,?,NOW(),?)");
				$insert_comment_query->bind_param('sii',$comment,$returned_user_id,$bugid);
				$insert_comment_query->execute();
				$comment_id = $mysqli->insert_id;
				$insert_comment_query->free_result();
			}else{
				$update_comment_query = $mysqli->prepare("UPDATE comment set contents=? where id = ?");
				$update_comment_query->bind_param('si',$comment,$commentid);
				$update_comment_query->execute();
				$comment_id = $mysqli->insert_id;
				$update_comment_query->free_result();
			}

			echo json_encode($comment_id);

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