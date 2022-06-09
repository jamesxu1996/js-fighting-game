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

// Set background
const background = new Sprite({
	position: {
		x: 0,
		y: 0,
	},
	imageSrc: "./assets/background.png",
});

// Set shop sprite
const shop = new Sprite({
	position: {
		x: 650,
		y: 223,
	},
	imageSrc: "./assets/shop.png",
	scale: 2,
    framesMax: 6
});

// Create new player & enemy object using Sprite class blueprint
const player = new Fighter({
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
    imageSrc: "./assets/samuraiMack/Idle.png",
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 156
    },
    sprites: {
        idle: {
            imageSrc: "./assets/samuraiMack/Idle.png",
            framesMax: 8
        },
        run: {
            imageSrc: "./assets/samuraiMack/Run.png",
            framesMax: 8
        },
    }
});

const enemy = new Fighter({
	position: {
		x: 973,
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

decreaseTimer();

// Set animate function
function animate() {
	window.requestAnimationFrame(animate);
	c.fillStyle = "black";
	c.fillRect(0, 0, canvas.width, canvas.height);
	background.update();
	shop.update();
	player.update();
	// enemy.update();

	// Set default velocity for player and enemy at 0
	player.velocity.x = 0;
	enemy.velocity.x = 0;

	// Player movement
    player.image = player.sprites.idle.image
	if (keys.a.pressed && player.lastKey === "a") {
		player.velocity.x = -5;
        player.image = player.sprites.run.image
	} else if (keys.d.pressed && player.lastKey === "d") {
		player.velocity.x = 5;
        player.image = player.sprites.run.image
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
