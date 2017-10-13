function max(numbersArray){
	//Check for array longer than 1 value
	if (numbersArray.length > 1){
		//Final array with highest values
		var highest3Vals = [];
		//Counter value
		var counter = 0;

		//Sort the array
		numbersArray.sort(function(a, b){
			return b - a
		});

		//Loop and add 3 highest values from original array into return array
		while (counter < numbersArray.length){
			highest3Vals[counter] = numbersArray[counter];
			counter++;
			//Break loop after 3 values are added
			if(counter == 3){
				break;
			}
		}
		//Return array with highest values
		return highest3Vals;
	}
	//Check for array with 1 value
	else if(numbersArray.length == 1){
		//Return single value array
		return numbersArray;
	}
	//Check for empty array
	else{
		//Return message
		return "Empty list. Please provide values to calculate.";
	}
}

$(document).ready(function(){
	//Test cases
	var numbersArray = [1,34,4,67,123,543,290,90];
	//var numbersArray = [5,34];
	//var numbersArray = [99];
	//var numbersArray = [];
	var highestVals = max(numbersArray);
	console.log(highestVals);
});
