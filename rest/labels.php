<?PHP
try{
	//Get list of Bug Labels
	require_once('dbsupport.php');
	require_once('model/label.php');

	//Query database and get bug list
	$labels = array();

	$get_all_labels_query = $mysqli->prepare("SELECT id, label, color FROM label");
	$get_all_labels_query->execute();
	$get_all_labels_query->bind_result($returned_id,$returned_label, $returned_color);

	//Construct label response list
	while($get_all_labels_query->fetch()){
		$label = new label;
		$label->id = $returned_id;
		$label->label = $returned_label;
		$label->color = $returned_color;
		array_push($labels, $label);
	}

	$get_all_labels_query->close();

	//Print out JSON label list
	echo json_encode($labels);
} catch (Exception $e) {
	error_log('Unexpected Exception occurred: ' . $e);
	echo json_encode(array('status'=>'ERROR','message'=>'Unexpected exception occurred'));
}
?>