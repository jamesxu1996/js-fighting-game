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

// Set function to reload game
function refresh() {
	// setTimeout(() => {
	// 	if (window.localStorage) {
	// 		if (!localStorage.getItem("reload")) {
	// 			localStorage["reload"] = true;
	// 			document.location.reload();
	// 		} else {
	// 			localStorage.removeItem("reload");
	// 		}
	// 	}
	// }, 1500);
	// setTimeout("location.reload(true);", 1500);
}

// Set function to compare player and enemy HP
function determineWinner({ player, enemy, timerId }) {
	clearTimeout(timerId);
	document.querySelector("#displayText").style.display = "flex";

	if (player.health === enemy.health) {
		document.querySelector("#displayText").innerHTML = "Draw!";
		setTimeout("location.reload(true);", 1500);
	} else if (player.health > enemy.health) {
		document.querySelector("#displayText").innerHTML = "Player 1 Wins!";
		setTimeout("location.reload(true);", 1500);
	} else if (enemy.health > player.health) {
		document.querySelector("#displayText").innerHTML = "Player 2 Wins!";
		setTimeout("location.reload(true);", 1500);
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
