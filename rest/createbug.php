<?PHP
require_once('dbsupport.php');
require_once('model/bug.php');
try{
	$project = $_REQUEST['project'];
	$subject = $_REQUEST['subject'];
	$priority = $_REQUEST['priority'];
	$labels = json_decode($_REQUEST['labels']);
	$description = $_REQUEST['description'];



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
			
			//Get the ID of the project...
			$get_project_query = $mysqli->prepare("SELECT id from project where `key` = ?");
			$get_project_query->bind_param('s',$project);
			$get_project_query->execute();
			$get_project_query->bind_result($returned_project_id);

			if($get_project_query->fetch()){
				$get_project_query->free_result();

				$sqlstr = "INSERT INTO bug (project,reporter,subject,description,created,modified,`status`) VALUES (?,?,?,?,NOW(),NOW(),1)";
				if(!isset($priority)){
					$sqlstr = "INSERT INTO bug (project,reporter,subject,description,created,modified,`status`,priority) VALUES (?,?,?,?,NOW(),NOW(),1,?)";
				}


				$insert_bug_query = $mysqli->prepare($sqlstr);
				if(!isset($priority)){
					$insert_bug_query->bind_param('iissi',$returned_project_id,$returned_user_id,$subject,$description,$priority);
				}else{
					$insert_bug_query->bind_param('iiss',$returned_project_id,$returned_user_id,$subject,$description);
				}
				
				$insert_bug_query->execute();
				$bug_id = $mysqli->insert_id;
				$insert_bug_query->free_result();

				$insert_bug_label_query = $mysqli->prepare("INSERT INTO bug_label (bug_id,label_id) VALUES (?,?)");
				foreach ($labels as &$label) {
					
					$insert_bug_label_query->bind_param('ii',$bug_id,$label);
					$insert_bug_label_query->execute();

				}

				$insert_bug_label_query->free_result();

				$return_bug = new bug;
				$return_bug->id = $bug_id;

				echo json_encode($return_bug);

			}else{
				error_log('Failed to find project in DB.');
				http_response_code(404);
			}

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