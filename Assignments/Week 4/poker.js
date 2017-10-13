//Check poker hand for matching hands
function handAssessor(pokerHand){
	var isValidHand = false; //Used to check for matching hand

	//Sort poker hand into separate rank and suit arrays.
	var sortedRankArray = sortArray(pokerHand, "rank");
	var sortedSuitArray = sortArray(pokerHand, "suit");


	//Print hand dealt and possible matches
	console.log("Poker Hand Dealt:" + displayCards(pokerHand));
	console.log("Possible Matching Hands");

	//Check for single pair
	if(isPair(sortedRankArray)){
		console.log("\tPair");
		isValidHand = true;
	}
	//Check for double pair
	if(isTwoPair(sortedRankArray)){
		console.log("\tTwo Pair");
		isValidHand = true;
	}
	//Check for 3 of a kind
	if(isThreeOfAKind(sortedRankArray)){
		console.log("\tThree of a Kind");
		isValidHand = true;
	}
	//Check for 4 of a kind
	if(isFourOfAKind(sortedRankArray)){
		console.log("\tFour of a Kind");
		isValidHand = true;
	}
	//Check for a Flush
	if(isFlush(sortedSuitArray)){
		console.log("\tFlush");
		isValidHand = true;
	}
	//Check for a Full House
	if(isFullHouse(sortedRankArray)){
		console.log("\tFull House");
		isValidHand = true;
	}
	//Check for a Straight
	if(isStraight(sortedRankArray)){
		console.log("\tStraight");
		isValidHand = true;
	}
	//Check for a Straight Flush
	if(isStraightFlush(sortedRankArray, sortedSuitArray)){
		console.log("\tStraight Flush");
		isValidHand = true;
	}
	//Check for a Royal Flush
	if(isRoyalFlush(sortedRankArray, sortedSuitArray)){
		console.log("\tRoyal Flush");
		isValidHand = true;
	}

	//Check for no matching hands
	if(!isValidHand){
		console.log("\tBust");
	}
}

//Check for existing Pair
function isPair(array){
	var result = false;

	//Loop through array and check if there is a match
	for(var i = 0; i < array.length; i++){
		if(array[i] == array[i+1]){
			result = true;
		}
	}

	return result;
}

//Check for 2 Pairs
function isTwoPair(array){
	var result = false;
	var counter = 0;

	//Check for 4 of a Kind
	//if match we know there's 2 pairs of cards
	if(isFourOfAKind(array)){
		result = true;
	}
	//Check for a Full House
	//if match we know there's 2 pairs of cards
	else if(isFullHouse(array)){
		result = true;
	}
	//Check for 3 of a Kind
	//if match we know there are no 2 pairs of cards
	//otherwise it would be a Full House
	else if(isThreeOfAKind(array)){
		result = false;
	} 
	//Check for matching pairs
	else{
		for(var i = 0; i < array.length; i++){
			if(array[i] == array[i+1]){
				counter++;
			}
		}
	}
	
	//Check for 2 matching pairs
	if(counter == 2){
		result = true;
	}

	return result;
}

//Check for 3 of a Kind
function isThreeOfAKind(array){
	var result = false;
	var counter = 0;

	//Check for a card to match the next 2 cards in the array
	//if so, it's 3 of a Kind
	for(var i = 0; i < array.length; i++){
		if(array[i] == array[i+1] && array[i] == array[i+2]){
			result = true;
		}
	}

	return result;
}

//Check for 4 of a Kind
function isFourOfAKind(array){
	var result = false;
	var counter = 0;

	//Check for a card to match the next 3 cards in the array
	//if so, it's 4 of a Kind
	for(var i = 0; i < array.length; i++){
		if(array[i] == array[i+1] && array[i] == array[i+2] && array[i] == array[i+3]){
			result = true;
		}
	}

	return result;
}

//Check for a flush
function isFlush(array){
	var result = false;
	var counter = 0;

	//Check for all cards to match the same suit
	for(var i = 0; i < array.length; i++){
		if(array[i].toLowerCase() == array[0].toLowerCase()){
			counter++;
		}
	}
	//if all cards match the same suit
	if(counter == 5){
		result = true;
	}
	return result;
}

//Check for a Full House
function isFullHouse(array){
	var result = false;
	var counter = 0;

	var isValid3OfAKind = false;
	var isValidMatch = false;

	//Check if there are 3 of a Kind
	if(isThreeOfAKind(array)){
		isValid3OfAKind = true;
	}

	//Check the remaining for a pair
	if(array[3] == array[4]){
		isValidMatch = true;
	}

	//Check for valid matches
	if(isValid3OfAKind && isValidMatch){
		result = true;
	}
	return result;	
}

//Check for a Straight
function isStraight(array){
	var result = false;
	var counter = 0;
	var num1 = 0;
	var num2 = 0;

	//Create an array with numerical values
	//for all the ranks and order it
	var newArray = setNumericalRankValues(array);

	//Loop through the new array
	for(var i = 0; i < newArray.length; i++){

		//Set the first number to the current array value
		num1 = newArray[i];

		//Check if index hasn't reached the end of the array
		//and set second number to the next value in the array
		if(i < newArray.length -1){
			num2 = newArray[i+1];
		}
		//Check if the index has reached the end of the array
		//and if the current value in the array is 13 (King)
		//and the first value in the array is 1 (Ace)
		//set the second number to 14 to make the math easier
		//increase the counter by 1
		else if(i == newArray.length -1 && newArray[i] == 13 && newArray[0] == 1) {
			counter++;
			num2=14;
		}
		//In all other cases, set the second number
		//to the previous value in the array
		else {
			num2 = newArray[i-1];
		}

		//Check for difference between both numbers
		var abs = Math.abs(num1.valueOf() - num2.valueOf())
		//If difference is 1, increase counter by 1
		if(abs == 1){
			counter++;

		}
	}
	//If counter is 5, we have a sequential array
	if(counter == 5){
		result = true;
	}

	return result;
}

//Check for a Straight Flush
function isStraightFlush(rankArray, suitArray){
	var result = false;

	//Check if array is a Straight and a Flush
	if(isStraight(rankArray) && isFlush(suitArray)){
		result = true;
	}

	return result;
}

//Check for a Royal Flush
function isRoyalFlush(rankArray, suitArray){
	var result = false;

	//Check if array is a Stright Flush
	if(isStraightFlush(rankArray, suitArray)){
		//Create an array with numerical values
		//for all the ranks and order it
		var orderedArray = setNumericalRankValues(rankArray);

		//Check the first value in the array to be 1 (Ace)
		if(orderedArray[0] == 1){
			result = true;
		}	
	}
	return result;
}

//Set numerical values for the card ranks
function setNumericalRankValues(array){
	var newNumericalArray = [];
	//Loop through the array
	for(var i = 0; i < array.length; i++){
		//Set value of 1 for an Ace
		if(array[i].toLowerCase() == "ace".toLowerCase()){
			newNumericalArray.push(1);
		}
		//Set value of 11 for a Jack
		else if(array[i].toLowerCase() == "jack".toLowerCase()){
			newNumericalArray.push(11);
		}
		//Set value of 12 for a Queen
		else if(array[i].toLowerCase() == "queen".toLowerCase()){
			newNumericalArray.push(12);
		}
		//Set value of 13 for a King
		else if(array[i].toLowerCase() == "king".toLowerCase()){
			newNumericalArray.push(13);
		}
		//Set value of original array for anything else
		else{
			newNumericalArray.push(parseInt(array[i]));
		}
	}

	//Return the new array sorted
	return newNumericalArray.sort(function(a, b){
			return a - b
		});
}

//Sort the array of Objects
function sortArray(array, property){
	var newSortedArray = [];

	//Sort based on the property desired
	array.sort(function(a, b){
		if(property == "suit"){
		    var x = a.suit.toLowerCase();
		    var y = b.suit.toLowerCase();
		}else{
		    var x = a.rank.toLowerCase();
		    var y = b.rank.toLowerCase();
		}
	    if (x < y) {return -1;}
	    if (x > y) {return 1;}
	    return 0;
	});

	//Create a new array
	for(var i = 0; i < array.length; i++){
		if(property == "suit"){
			newSortedArray.push(array[i].suit.toLowerCase());
		}else{
			newSortedArray.push(array[i].rank.toLowerCase());
		}
	}

	return newSortedArray;
}

//Display the cards in the poker hand
function displayCards(pokerHand){
	var newArray = [];
	var cardName = "";

	//Loop through the cards in the hand
	for(var i = 0; i < pokerHand.length; i++){
		//Check for rank of 1 (Ace)
		if(pokerHand[i].rank == "1"){
			cardName = "Ace";
		}
		//Check for rank of 11 (Jack)
		else if(pokerHand[i].rank == "11"){
			cardName = "Jack";
		}
		//Check for rank of 12 (Queen)
		else if(pokerHand[i].rank == "12"){
			cardName = "Queen";
		}
		//Check for rank of 13 (King)
		else if(pokerHand[i].rank == "13"){
			cardName = "King";
		}
		//Otherwise, return current rank
		else{
			cardName = pokerHand[i].rank;
		}

		//Create a new array with the poker hand
		newArray.push(" " + cardName + " of " + pokerHand[i].suit);
	}

	return newArray;
}
