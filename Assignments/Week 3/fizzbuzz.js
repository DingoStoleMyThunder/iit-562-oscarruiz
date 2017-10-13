function fizzbuzz(start, end){
	if (start <= end){
		while (start <= end){
			//Check multiplier of 3
			var isMultiple3 = isMultiplier(start, 3);
			//Check multiplier of 5
			var isMultiple5 = isMultiplier(start, 5);

			//Print FizzBuzz if multiplier of 3 & 5
			if (isMultiple3 && isMultiple5){
				document.write("FizzBuzz<br>");
			}
			//Print FizzBuzz if multiplier of 3
			else if (isMultiple3){
				document.write("Fizz<br>");
			}
			//Print FizzBuzz if multiplier of 5
			else if (isMultiple5){
				document.write("Buzz<br>");
			}
			//Print number otherwise
			else{
				document.write(start + "<br>");
			}
			//Go to next value
			start++;
		}
	}
	//Output message if not a valid range
	else{
		document.write("Please enter a valid range. Starting number is higher than ending number.")
	}
}

function isMultiplier(number, multiplier){
	//Check for valid multiplier
	if(number % multiplier == 0){
		return true;
	}else{
		return false;
	}
}

$(document).ready(function(){
	fizzbuzz(1, 150);
});
