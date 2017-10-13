var main = function(){
	//Colors list
	var colors = ['blue', 'red', 'green', 'purple', 'brown', 'violet', 'green', 'yellowgreen'];

	$(".relevant").children("p").each(function(index, element){
		//Fade-in with timer delay
		$(element).delay(index*500).fadeIn();
		//Set color for the text
		$(element).css("color", colors[index]);
		//Set background color for the text
		$(element).css("background-color", "lavender");
	});

}

$(document).ready(main);
