<?PHP
try{
	require_once('model/priority.php');
	require_once('dbsupport.php');
	//Get list of Bug Priorities
	$priorities = array();
	//Query database and get bug list
	$get_all_priorities_query = $mysqli->prepare("SELECT id, label, css_class FROM priority");
	$get_all_priorities_query->execute();
	$get_all_priorities_query->bind_result($returned_id,$returned_label, $returned_css_class);

	//Construct priority response list
	while($get_all_priorities_query->fetch()){
		$priority = new priority;
		$priority->id = $returned_id;
		$priority->label = $returned_label;
		$priority->css_class = $returned_css_class;
		array_push($priorities, $priority);
	}

	$get_all_priorities_query->close();

	//Print out JSON priority list
	echo json_encode($priorities);
} catch (Exception $e) {
	error_log('Unexpected Exception occurred: ' . $e);
	echo json_encode(array('status'=>'ERROR','message'=>'Unexpected exception occurred'));
}
?>