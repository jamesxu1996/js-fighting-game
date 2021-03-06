// Set rectangle collision function, detects collision between player attackboxes
function rectangularCollision({ rectangle1, rectangle2 }) {
	return (
		rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
			rectangle2.position.x &&
		rectangle1.attackBox.position.x <=
			rectangle2.position.x + rectangle2.width &&
		rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
			rectangle2.position.y &&
		rectangle1.attackBox.position.y <=
			rectangle2.position.y + rectangle2.height
	);
}


// Set function to compare player and enemy HP
function determineWinner({ player, enemy, timerId }) {
	clearTimeout(timerId);
	document.querySelector("#displayText").style.display = "flex";

	if (player.health === enemy.health) {
		document.querySelector("#displayText").innerHTML = "Draw! Press Enter To Restart!";
	} else if (player.health > enemy.health) {
		document.querySelector("#displayText").innerHTML = "Player 1 Wins! Press Enter To Restart!";
	} else if (enemy.health > player.health) {
		document.querySelector("#displayText").innerHTML = "Player 2 Wins! Press Enter To Restart!";
	}
}

// Set game timer
let timer = 60;
let timerId;

function decreaseTimer() {
	if (timer > 0) {
		timerId = setTimeout(decreaseTimer, 1000);
		timer--;
		document.querySelector("#timer").innerHTML = timer;
	}

	// Set win condition for player on highest HP when timer runs out
	if (timer === 0) {
		determineWinner({ player, enemy, timerId });
	}
}
