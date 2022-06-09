// Select canvas element
const canvas = document.querySelector("canvas");

// Set the context c as 2d
const c = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

// Set global gravity const
const gravity = 0.75;

// Set Sprite class
class Sprite {
	constructor({ position, velocity, color = "red", offset }) {
		this.position = position;
		this.velocity = velocity;
		this.width = 50;
		this.height = 150;
		this.lastKey;
		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			offset,
			width: 100,
			height: 50,
		};
		this.color = color;
		this.isAttacking;
		this.health = 100;
	}

	draw() {
		c.fillStyle = this.color;
		c.fillRect(this.position.x, this.position.y, this.width, this.height);

		// Attack box
		if (this.isAttacking) {
			c.fillStyle = "green";
			c.fillRect(
				this.attackBox.position.x,
				this.attackBox.position.y,
				this.attackBox.width,
				this.attackBox.height
			);
		}
	}

	update() {
		this.draw();
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
		this.attackBox.position.y = this.position.y;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		if (this.position.y + this.height + this.velocity.y >= canvas.height) {
			this.velocity.y = 0;
		} else this.velocity.y += gravity;
	}

	// Set attack
	attack() {
		this.isAttacking = true;
		setTimeout(() => {
			this.isAttacking = false;
		}, 100);
	}
}

// Create new player & enemy object using Sprite class blueprint
const player = new Sprite({
	position: {
		x: 0,
		y: 0,
	},
	velocity: {
		x: 0,
		y: 0,
	},
	offset: {
		x: 0,
		y: 0,
	},
});

const enemy = new Sprite({
	position: {
		x: 400,
		y: 100,
	},
	velocity: {
		x: 0,
		y: 0,
	},
	color: "blue",
	offset: {
		x: -50,
		y: 0,
	},
});

// Set keys object to track press state of keys
const keys = {
	a: {
		pressed: false,
	},
	d: {
		pressed: false,
	},
	ArrowRight: {
		pressed: false,
	},
	ArrowLeft: {
		pressed: false,
	},
};

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
    clearTimeout(timerId)
	document.querySelector("#displayText").style.display = "flex";

	if (player.health === enemy.health) {
		document.querySelector("#displayText").innerHTML = "Draw!";
	} else if (player.health > enemy.health) {
		document.querySelector("#displayText").innerHTML = "Player 1 Wins!";
	} else if (enemy.health > player.health) {
		document.querySelector("#displayText").innerHTML = "Player 2 Wins!";
	}
}

// Set game timer
let timer = 60;
let timerId

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

decreaseTimer();

// Set animate function
function animate() {
	window.requestAnimationFrame(animate);
	c.fillStyle = "black";
	c.fillRect(0, 0, canvas.width, canvas.height);
	player.update();
	enemy.update();

	// Set default velocity for player and enemy at 0
	player.velocity.x = 0;
	enemy.velocity.x = 0;

	// Player movement
	if (keys.a.pressed && player.lastKey === "a") {
		player.velocity.x = -5;
	} else if (keys.d.pressed && player.lastKey === "d") {
		player.velocity.x = 5;
	}

	// Enemy movement
	if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
		enemy.velocity.x = -5;
	} else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
		enemy.velocity.x = 5;
	}

	// Collision detection
	if (
		rectangularCollision({
			rectangle1: player,
			rectangle2: enemy,
		}) &&
		player.isAttacking
	) {
		player.isAttacking = false;
		enemy.health -= 5;
		document.querySelector("#enemyHealth").style.width = enemy.health + "%";
	}

	if (
		rectangularCollision({
			rectangle1: enemy,
			rectangle2: player,
		}) &&
		enemy.isAttacking
	) {
		enemy.isAttacking = false;
		player.health -= 5;
		document.querySelector("#playerHealth").style.width =
			player.health + "%";
	}

	// Set win condition based on player HP
	if (enemy.health <= 0 || player.health <= 0) {
		determineWinner({ player, enemy, timerId });
	}
}

animate();

// Add event listeners for keystrokes
window.addEventListener("keydown", (e) => {
	// Player keystrokes
	switch (e.key) {
		case "d":
			keys.d.pressed = true;
			player.lastKey = "d";
			break;
		case "a":
			keys.a.pressed = true;
			player.lastKey = "a";
			break;
		case "w":
			player.velocity.y = -20;
			break;
		case " ":
			player.attack();
			break;

		// Enemy keystrokes
		case "ArrowRight":
			keys.ArrowRight.pressed = true;
			enemy.lastKey = "ArrowRight";
			break;
		case "ArrowLeft":
			keys.ArrowLeft.pressed = true;
			enemy.lastKey = "ArrowLeft";
			break;
		case "ArrowUp":
			enemy.velocity.y = -20;
			break;
		case "ArrowDown":
			enemy.isAttacking = true;
			break;
	}
	console.log(e.key);
});

window.addEventListener("keyup", (e) => {
	// Player Keystrokes
	switch (e.key) {
		case "d":
			keys.d.pressed = false;
			break;
		case "a":
			keys.a.pressed = false;
			break;
	}

	// Enemy keystrokes
	switch (e.key) {
		case "ArrowRight":
			keys.ArrowRight.pressed = false;
			break;
		case "ArrowLeft":
			keys.ArrowLeft.pressed = false;
			break;
	}
	console.log(e.key);
});
