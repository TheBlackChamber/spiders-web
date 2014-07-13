<?PHP
require_once('model/bug.php');
require_once('model/label.php');
require_once('model/comment.php');
date_default_timezone_set('US/Eastern');
//Get Filter options from request

//Query database and get bug list
//Use test data
require_once('bugdata.php');

//Construct bug response list

//Print out JSON bug list
echo json_encode($bugs);

?>