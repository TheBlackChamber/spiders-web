<?PHP
require_once('model/bug.php');
require_once('model/priority.php');
require_once('model/label.php');
require_once('model/comment.php');
date_default_timezone_set('US/Eastern');

//For now... create test data

$priorities = array();
$priority_high = new priority;
$priority_high->id = 1;
$priority_high->label = 'High';
$priority_high->css_class = 'high';
array_push($priorities, $priority_high);
$priority_medium = new priority;
$priority_medium->id = 1;
$priority_medium->label = 'Medium';
$priority_medium->css_class = 'medium';
array_push($priorities, $priority_medium);
$priority_low = new priority;
$priority_low->id = 1;
$priority_low->label = 'Low';
$priority_low->css_class = 'low';
array_push($priorities, $priority_low);

$label_ui = new label;
$label_ui->label = "UI";
$label_ui->color = "1975FF";
$label_styling = new label;
$label_styling->label = "Styling";
$label_styling->color = "751975";
$label_business = new label;
$label_business->label = "Business";
$label_business->color = "19A319";


$bugs = array();

$bug = new bug;
$bug->id = 1;
$bug->project = "mylibrary";
$bug->subject = "Lorem ipsum Commodo ut ad cillum.";
$bug->assigned = "sminogue";
$bug->createdby =  "sminogue";
$bug->status =  "Open";
$bug->priority = $priority_high;
$comments = array();
$comment = new comment;
$comment->comment = "Lorem ipsum Deserunt ad ex id adipisicing ullamco minim sit esse ex sit voluptate sint voluptate in velit cillum ea ut aliquip aute cillum do eu veniam in.";
$comment->date =  date("2014-01-01");
$comment->user = "sminogue";
$comment->id = 3;
$comment->editing = false;
$comment->uid = uniqid($bug->id .":");
array_push($comments, $comment);
$comment = new comment;
$comment->comment = "Lorem ipsum Deserunt ad ex id adipisicing ullamco minim sit esse ex sit voluptate sint voluptate in velit cillum ea ut aliquip aute cillum do eu veniam in.";
$comment->date =  date("2014-02-01");
$comment->user = "sminogue";
$comment->id = 4;
$comment->editing = false;
$comment->uid = uniqid($bug->id .":");
array_push($comments, $comment);
$comment = new comment;
$comment->comment = "Lorem ipsum Deserunt ad ex id adipisicing ullamco minim sit esse ex sit voluptate sint voluptate in velit cillum ea ut aliquip aute cillum do eu veniam in.";
$comment->date =  date("2014-02-05");
$comment->user = "jfrangom";
$comment->id = 5;
$comment->editing = false;
$comment->uid = uniqid($bug->id .":");
array_push($comments, $comment);
$bug->comments = $comments;
$labels = array();
array_push($labels, $label_ui);
array_push($labels, $label_styling);
$bug->labels = $labels;
$bug->modified =  date("2013-03-01");
$bug->created =  date("2013-03-01");
$bug->description = "Lorem ipsum Nostrud ullamco consectetur laborum ut quis non veniam consectetur quis sint aute quis irure sunt Excepteur eu sint tempor fugiat officia in ad culpa eu tempor labore sed proident irure do pariatur veniam ut est dolor.";
array_push($bugs, $bug);

$bug = new bug;
$bug->id = 2;
$bug->project = "mylibrary";
$bug->subject = "Lorem ipsum Occaecat adipisicing velit mollit dolor nisi";
$bug->assigned = "sminogue";
$bug->createdby =  "jfrangom";
$bug->status =  "Open";
$bug->priority = $priority_medium;
$labels = array();
array_push($labels, $label_business);
$bug->labels = $labels;
$bug->created =  date("2014-01-01");
$bug->modified =  date("2014-01-01");
$bug->description = "Lorem ipsum Fugiat exercitation exercitation Excepteur culpa nulla ut irure laborum in veniam in id commodo tempor ea enim voluptate dolore minim minim et aliquip ut.";
array_push($bugs, $bug);

$bug = new bug;
$bug->id = 3;
$bug->project = "cryptograms";
$bug->subject = "Lorem ipsum Dolor cupidatat veniam magna Excepteur.";
$bug->createdby =  "sminogue";
$bug->status =  "Open";
$bug->priority = $priority_low;
$labels = array();
array_push($labels, $label_ui);
$bug->labels = $labels;
$bug->modified =  date("2013-01-01");
$bug->created =  date("2013-01-01");
$bug->description = "Lorem ipsum Anim non irure proident dolor do qui in esse amet dolore nostrud exercitation elit occaecat id nostrud enim dolor dolore quis laboris ad.";
array_push($bugs, $bug);

$bug = new bug;
$bug->id = 4;
$bug->project = "mylibrary";
$bug->subject = "Lorem ipsum Reprehenderit nostrud ullamco dolor incididunt aliqua.";
$bug->createdby =  "jfrangom";
$bug->status =  "Open";
$labels = array();
array_push($labels, $label_business);
$bug->labels = $labels;
$bug->modified =  date("2014-01-01");
$bug->created =  date("2014-01-01");
$bug->description = "Lorem ipsum Fugiat exercitation exercitation Excepteur culpa nulla ut irure laborum in veniam in id commodo tempor ea enim voluptate dolore minim minim et aliquip ut.";
array_push($bugs, $bug);
?>