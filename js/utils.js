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
	setTimeout(() => { reloadPage()
		// if (window.localStorage) {
		// 	if (!localStorage.getItem("reload")) {
		// 		localStorage["reload"] = true;
		// 		window.location.reload();
		// 	} else {
		// 		localStorage.removeItem("reload");
		// 	}
		// }
	}, 1500);
}

function reloadPage() {
	// The last "domLoading" Time //
	var currentDocumentTimestamp =
	new Date(performance.timing.domLoading).getTime();
	// Current Time //
	var now = Date.now();
	// Ten Seconds //
	var tenSec = 5 * 1000;
	// Plus Ten Seconds //
	var plusTenSec = currentDocumentTimestamp + tenSec;
	if (now > plusTenSec) {
	location.reload();
	} else {}
	}
	reloadPage();

// Set function to compare player and enemy HP
function determineWinner({ player, enemy, timerId }) {
	clearTimeout(timerId);
	document.querySelector("#displayText").style.display = "flex";

	if (player.health === enemy.health) {
		document.querySelector("#displayText").innerHTML = "Draw!";
		refresh()
	} else if (player.health > enemy.health) {
		document.querySelector("#displayText").innerHTML = "Player 1 Wins!";
		refresh()
	} else if (enemy.health > player.health) {
		document.querySelector("#displayText").innerHTML = "Player 2 Wins!";
		refresh()
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
