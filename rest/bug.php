<?PHP
require_once('model/bug.php');
require_once('model/project.php');
require_once('model/label.php');
require_once('model/priority.php');
require_once('model/comment.php');
require_once('dbsupport.php');

try{
	date_default_timezone_set('US/Eastern');
	$bugid = $_GET['id'];
	
	$sql_fetch_bug = "select b.id as id, p.name as project_name,p.key as project_key,`subject`,description,created,modified,bstatus.label as `status`,SUBSTRING(assignedu.email,1,INSTR(assignedu.email,'@')-1) as assigned_email,SUBSTRING(reporteru.email,1,INSTR(reporteru.email,'@')-1) as reporter_email, priority.id as priority_id, priority.label as priority_label, priority.css_class as priority_class from bug as b left join user as assignedu ON assignedu.id = b.assigned left join user as reporteru ON reporteru.id = b.reporter left join project as p ON p.id = b.project left join priority as priority on priority.id = b.priority join bug_status as bstatus ON bstatus.id = b.status where b.id = ?";

	$get_bug_query = $mysqli->prepare($sql_fetch_bug);
	$get_bug_query->bind_param('i',$bugid);
	$get_bug_query->execute();
	$get_bug_query->bind_result($id,$project_name,$project_key,$subject,$description,$created,$modified,$status,$assigned_email,$reporter_email,$priority_id,$priority_label,$priority_class);

	if($get_bug_query->fetch()){
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

		$get_bug_query->free_result();

		$bug_label_query = $mysqli->prepare('select id, label, color from bug_label join label on label_id = label.id where bug_id = ?');
		$bug_label_query->bind_param('i',$bugid);
		$bug_label_query->execute();
		$bug_label_query->bind_result($id,$bug_label,$color);

		$labels = array();
		while($bug_label_query->fetch()){
			$label = new label;
			$label->label = $bug_label;
			$label->id = $id;
			$label->color = $color;
			array_push($labels, $label);
		}
		$bug_label_query->free_result();

		$bug->labels = $labels;

		$bug_comment_query = $mysqli->prepare("select comment.id,comment.contents,comment.created_on, SUBSTRING(user.email,1,INSTR(user.email,'@')-1) as creator from comment left join user on comment.created_by = user.id where comment.bug_id = ?");
		$bug_comment_query->bind_param('i',$bugid);
		$bug_comment_query->execute();
		$bug_comment_query->bind_result($comment_id,$content,$created_on,$createdby);

		$comments = array();
		while($bug_comment_query->fetch()){
			$comment = new comment;
			$comment->id = $comment_id;
			$comment->comment = $content;
			$comment->date = $created_on;
			$comment->user = $createdby;
			array_push($comments, $comment);
		}
		$bug_comment_query->free_result();

		$bug->comments = $comments;

		echo json_encode($bug);

	}else{
		http_response_code(404);	
	}

/*
	$returnblank = true;

	foreach ($bugs as $value) {
		if ($value->id == $bugid) {
			echo json_encode($value);
			$returnblank = false;
		}
	}

	if($returnblank){
		echo json_encode('');
	}
	*/
} catch (Exception $e) {
	error_log('Unexpected Exception occurred: ' . $e);
	http_response_code(500);
}
?>