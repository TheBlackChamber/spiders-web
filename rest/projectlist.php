<?PHP
try{
	require_once('model/project.php');
	require_once('dbsupport.php');

	$projects = array();

	$get_all_projects_query = $mysqli->prepare("SELECT `key`, name FROM project order by name asc");
	$get_all_projects_query->execute();
	$get_all_projects_query->bind_result($returned_key, $returned_name);

	while($get_all_projects_query->fetch()){
		$project = new project;
		$project->key = $returned_key;
		$project->label = $returned_name;
		array_push($projects, $project);
	}

	$get_all_projects_query->close();

	echo json_encode($projects);
} catch (Exception $e) {
	error_log('Unexpected Exception occurred: ' . $e);
	echo json_encode(array('status'=>'ERROR','message'=>'Unexpected exception occurred'));
}
?>