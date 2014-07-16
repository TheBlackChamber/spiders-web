<?PHP
require_once('model/bug.php');
require_once('model/project.php');
require_once('model/label.php');
require_once('model/comment.php');
require_once('dbsupport.php');
date_default_timezone_set('US/Eastern');

$assignment = $_REQUEST['assignment'];
$project = $_REQUEST['project'];

$sqlQuery = 'SELECT id, project, reporter, assigned, subject, description, created, modified, status FROM project WHERE ';

if(isset($assignment){

}

?>