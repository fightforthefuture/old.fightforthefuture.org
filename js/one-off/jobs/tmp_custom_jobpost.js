
document.write('<div class="resumator-buttons" style="margin:25px 0;padding:0;"><ul style="list-style-type:none;margin:0;padding:0;height:20px;"><li style="float:left;margin: 0 10px 0 0;padding:0;"><input type="button" onclick="resumatorApplyToggleDDejLK7mHA_b();" name="resumator-applybutton-DDejLK7mHA_b" id="resumator-applybutton-DDejLK7mHA_b" class="resumator-button, resumator-apply-button" value="Apply Now" /></li><li style="float:left;margin: 0 10px 0 0;padding:0;"><a href="http://app.jazz.co/app/share/DDejLK7mHA" target="_blank" type="button">Share Job</a></li></ul></div><div class="resumator-form-iframe" id="resumator-applyform-DDejLK7mHA_b" style="display:none;"><iframe id="resumator-applyframe-DDejLK7mHA_b" frameborder="0" style="background-color:transparent;margin-top:15px;overflow-x:hidden;overflow-y:auto;height:1065px;width:100%;" src=""></iframe></div>');


function resumatorFormatSource(resumatorResultSource){
	return encodeURIComponent(resumatorResultSource);
}

function resumatorApplyToggleDDejLK7mHA_b(){
	var resumatorApplyForm = document.getElementById("resumator-applyform-DDejLK7mHA_b");
	var resumatorApplyFrame = document.getElementById("resumator-applyframe-DDejLK7mHA_b");
	var resumatorApplyButton = document.getElementById("resumator-applybutton-DDejLK7mHA_b");
	//var resumatorForwardForm = document.getElementById("resumator-forwardform-DDejLK7mHA_b");
	//var resumatorForwardFrame = document.getElementById("resumator-forwardframe-DDejLK7mHA_b");
	//var resumatorForwardButton = document.getElementById("resumator-forwardbutton-DDejLK7mHA_b");

	//resumatorForwardForm.style.display = "none";
	//resumatorForwardButton.value = "Forward Position";
	if( resumatorApplyForm.style.display != "block" ){
		resumatorApplyButton.value = "Cancel";
		resumatorApplyForm.style.display = "block";
		resumatorSource = "Our Job Board Widget";
		resumatorApplyFrame.src = "https://fightforthefuture.applytojob.com/apply/embed/form/DDejLK7mHA/"+resumatorSource;
	}else{
		resumatorApplyButton.value = "Apply Now";
		resumatorApplyForm.style.display = "none";
	}
	window.jQuery(resumatorApplyButton).trigger("change");
	//window.jQuery(resumatorForwardButton).trigger("change");
}

function resumatorForwardToggleDDejLK7mHA_b(){
	//var resumatorForwardForm = document.getElementById("resumator-forwardform-DDejLK7mHA_b");
	//var resumatorForwardFrame = document.getElementById("resumator-forwardframe-DDejLK7mHA_b");
	//var resumatorForwardButton = document.getElementById("resumator-forwardbutton-DDejLK7mHA_b");
	var resumatorApplyForm = document.getElementById("resumator-applyform-DDejLK7mHA_b");
	var resumatorApplyFrame = document.getElementById("resumator-applyframe-DDejLK7mHA_b");
	var resumatorApplyButton = document.getElementById("resumator-applybutton-DDejLK7mHA_b");
	resumatorApplyForm.style.display = "none";
	resumatorApplyButton.value = "Apply Now";
	//if( resumatorForwardForm.style.display != "block" ){
	//	resumatorForwardButton.value = "Cancel";
	//	resumatorForwardForm.style.display = "block";
	//	resumatorForwardFrame.src = "https://fightforthefuture.applytojob.com/apply/embed/forward/DDejLK7mHA_b";
	//}else{
	//	resumatorForwardButton.value = "Forward Position";
	//	resumatorForwardForm.style.display = "none";
	//}
	window.jQuery(resumatorApplyButton).trigger("change");
	//window.jQuery(resumatorForwardButton).trigger("change");
}
if(typeof window.jQuery === "undefined"){document.write('<script type="text/javascript" charset="utf-8" src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script><script type="text/javascript">$.noConflict();</script>');}
