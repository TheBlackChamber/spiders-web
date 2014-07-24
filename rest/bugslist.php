<?PHP
require_once('model/bug.php');
require_once('model/project.php');
require_once('model/label.php');
require_once('model/priority.php');
require_once('model/comment.php');
require_once('dbsupport.php');
try{
	date_default_timezone_set('US/Eastern');
	//Get Filter options from request
	$assignment = $_REQUEST['assignment'];
	$project = $_REQUEST['project'];
	$status = $_REQUEST['status'];

	function generateAssignedQueryFragment($assigned){
		if(isset($assigned) and $assigned == 'mine'){
			return " AND assignedu.email = ?";
		}else if(isset($assigned) and $assigned == 'unassigned'){
			return " AND assignedu.email is null";
		}else{
			//Do Nothing. Case is all... no constraints needed. We want everything.
		}
	}

	function generateProjectQueryFragment($proj){

		if(isset($proj) and $proj != ''){
			return " AND p.key = ?";
		}else{
			//Return nothing. Not filtering by project key
		}

	}


	function fetchBugs($conn,$assigned, $proj, $state,$abuser_email){

		//Generate prepared SQL
		$sql_fetch_bugs = "select b.id as id, p.name as project_name,p.key as project_key,`subject`,description,created,modified,bstatus.label as `status`,SUBSTRING(assignedu.email,1,INSTR(assignedu.email,'@')-1) as assigned_email,SUBSTRING(reporteru.email,1,INSTR(reporteru.email,'@')-1) as reporter_email, priority.id as priority_id, priority.label as priority_label, priority.css_class as priority_class from bug as b left join user as assignedu ON assignedu.id = b.assigned left join user as reporteru ON reporteru.id = b.reporter left join project as p ON p.id = b.project left join priority as priority on priority.id = b.priority join bug_status as bstatus ON bstatus.id = b.status where bstatus.label = ?";

		$assigned_query_frag = generateAssignedQueryFragment($assigned);
		$project_query_frag = generateProjectQueryFragment($proj);

		$sql_fetch_bugs = $sql_fetch_bugs . $assigned_query_frag . $project_query_frag;

		//Prepare statement
		$get_bugs_query = $conn->prepare($sql_fetch_bugs);

		//Bind Parameters
		if(isset($assigned_query_frag) and stripos($assigned_query_frag, '?') and isset($project_query_frag) and $project_query_frag != ''){
			$get_bugs_query->bind_param('sss',$state,$abuser_email,$proj);
		}else if((isset($assigned_query_frag) and stripos($assigned_query_frag, '?') > 0 and $assigned_query_frag != '') and (!isset($project_query_frag) or $project_query_frag == '')){
			$get_bugs_query->bind_param('ss',$state,$abuser_email);
		}else if((!isset($assigned_query_frag) or !stripos($assigned_query_frag, '?')) and (isset($project_query_frag) and $project_query_frag != '')){
			$get_bugs_query->bind_param('ss',$state,$proj);
		}else {
			$get_bugs_query->bind_param('s',$state);
		}

		//Execute Fetch and construct response
		$bugs_list = array();
		$get_bugs_query->execute();
		$get_bugs_query->bind_result($id,$project_name,$project_key,$subject,$description,$created,$modified,$status,$assigned_email,$reporter_email,$priority_id,$priority_label,$priority_class);

		while($get_bugs_query->fetch()){
			$bug = new bug;
			if(isset($priority_id)){
				$priority = new priority;
				$priority->id = $priority_id;
				$priority->label = $priority_label;
				$priority->css_class = $priority_class;
				$bug->priority = $priority;
			}

			$projectobj = new project;
			$projectobj->label = $project_name;
			$projectobj->key = $project_key;

			$bug->id = $id;
			$bug->project = $projectobj;
			$bug->assigned = $assigned_email;
			$bug->createdby = $reporter_email;
			$bug->status = $status;
			$bug->labels = array();
			$bug->created = $created;
			$bug->modified = $modified;
			$bug->description = $description;
			$bug->subject = $subject;

			array_push($bugs_list, $bug);
		}
		$get_bugs_query->free_result();

		foreach ($bugs_list as &$value) {
			$bug_label_query = $conn->prepare('select id, label, color from bug_label join label on label_id = label.id where bug_id = ?');
			$bug_label_query->bind_param('i',$value->id);
			$bug_label_query->execute();
			$bug_label_query->bind_result($id,$bug_label,$color);

			$value->labels = array();
			while($bug_label_query->fetch()){
				$label = new label;
				$label->label = $bug_label;
				$label->id = $id;
				$label->color = $color;
				array_push($value->labels, $label);
			}
			$bug_label_query->free_result();

			$bug_comment_query = $conn->prepare("select comment.id,comment.contents,comment.created_on, SUBSTRING(user.email,1,INSTR(user.email,'@')-1) as creator from comment left join user on comment.created_by = user.id where comment.bug_id = ?");
			$bug_comment_query->bind_param('i',$value->id);
			$bug_comment_query->execute();
			$bug_comment_query->bind_result($comment_id,$content,$created_on,$createdby);

			$value->comments = array();
			while($bug_comment_query->fetch()){
				$comment = new comment;
				$comment->id = $comment_id;
				$comment->comment = $content;
				$comment->date = $created_on;
				$comment->user = $createdby;
				array_push($value->comments, $comment);
			}
			$bug_comment_query->free_result();

		}

		//Print out JSON bug list
		return $bugs_list;

	}


	//Build SQL to query database
	$bugs_list = array();
	
	if($status == 'opentoggle'){
		$statusstring = 'Open';
	}else{
		$statusstring = 'Closed';
	}

	//If getting "my bugs" make sure cookie is set
	if(isset($assignment) and $assignment == 'mine' and !isset($_COOKIE["auth"])){
		http_response_code(401);
	}else if(isset($assignment) and $assignment == 'mine'){
		//Get cookie
		$auth_cookie = json_decode($_COOKIE['auth']);

		//Find user and compare to auth token from auth cookie
		$get_user_query = $mysqli->prepare("SELECT id FROM user WHERE email = ? and auth_token = ?");
		$get_user_query->bind_param('ss', $auth_cookie->{'email'},$auth_cookie->{'authtoken'});
		$get_user_query->execute();
		$get_user_query->bind_result($returned_user_id);

		if($get_user_query->fetch()){
			$get_user_query->free_result();
			$listing = fetchBugs($mysqli,$assignment, $project, $statusstring,$auth_cookie->{'email'});
			echo json_encode($listing);
		}else{
			http_response_code(403);
		}

		$get_user_query->close();
		
	}else{

		$listing = fetchBugs($mysqli,$assignment, $project, $statusstring,null);
		echo json_encode($listing);
		
	}
} catch (Exception $e) {
	error_log('Unexpected Exception occurred: ' . $e);
	http_response_code(500);
}
?>