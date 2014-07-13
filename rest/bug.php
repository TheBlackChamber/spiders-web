<?PHP
require_once('model/bug.php');
require_once('model/label.php');
date_default_timezone_set('US/Eastern');

require_once('bugdata.php');

$bugid = $_GET['id'];
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

?>