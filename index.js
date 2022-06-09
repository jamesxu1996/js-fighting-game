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
	framesMax: 6,
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
		y: 156,
	},
	sprites: {
		idle: {
			imageSrc: "./assets/samuraiMack/Idle.png",
			framesMax: 8,
		},
		run: {
			imageSrc: "./assets/samuraiMack/Run.png",
			framesMax: 8,
		},
		jump: {
			imageSrc: "./assets/samuraiMack/Jump.png",
			framesMax: 2,
		},
		fall: {
			imageSrc: "./assets/samuraiMack/Fall.png",
			framesMax: 2,
		},
		attack1: {
			imageSrc: "./assets/samuraiMack/Attack1.png",
			framesMax: 6,
		},
	},
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
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
	imageSrc: "./assets/kenji/Idle.png",
	framesMax: 4,
	scale: 2.5,
	offset: {
		x: 215,
		y: 166,
	},
	sprites: {
		idle: {
			imageSrc: "./assets/kenji/Idle.png",
			framesMax: 4,
		},
		run: {
			imageSrc: "./assets/kenji/Run.png",
			framesMax: 8,
		},
		jump: {
			imageSrc: "./assets/kenji/Jump.png",
			framesMax: 2,
		},
		fall: {
			imageSrc: "./assets/kenji/Fall.png",
			framesMax: 2,
		},
		attack1: {
			imageSrc: "./assets/kenji/Attack1.png",
			framesMax: 4,
		},
	},
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
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
	enemy.update();

	// Set default velocity for player and enemy at 0
	player.velocity.x = 0;
	enemy.velocity.x = 0;

	// Player movement
	if (keys.a.pressed && player.lastKey === "a") {
		player.velocity.x = -5;
		player.switchSprite("run");
	} else if (keys.d.pressed && player.lastKey === "d") {
		player.velocity.x = 5;
		player.switchSprite("run");
	} else {
		player.switchSprite("idle");
	}

	// Player jump/fall movement
	if (player.velocity.y < 0) {
		player.switchSprite("jump");
	} else if (player.velocity.y > 0) {
		player.switchSprite("fall");
	}

	// Enemy movement
	if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
		enemy.velocity.x = -5;
		enemy.switchSprite("run");
	} else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
		enemy.velocity.x = 5;
		enemy.switchSprite("run");
	} else {
		enemy.switchSprite("idle");
	}

	// Enemy jump/fall movement
	if (enemy.velocity.y < 0) {
		enemy.switchSprite("jump");
	} else if (enemy.velocity.y > 0) {
		enemy.switchSprite("fall");
	}

	// Collision detection
	if (
		rectangularCollision({
			rectangle1: player,
			rectangle2: enemy,
		}) &&
		player.isAttacking && player.framesCurrent === 4
	) {
		player.isAttacking = false;
		enemy.health -= 7;
		document.querySelector("#enemyHealth").style.width = enemy.health + "%";
	}

    // player attack miss
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }

	if (
		rectangularCollision({
			rectangle1: enemy,
			rectangle2: player,
		}) &&
		enemy.isAttacking && enemy.framesCurrent === 2
	) {
		enemy.isAttacking = false;
		player.health -= 5;
		document.querySelector("#playerHealth").style.width =
			player.health + "%";
	}

    // enemy attack miss
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
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
			if (player.position.y == 330) player.velocity.y = -20;
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
			if (enemy.position.y == 330) enemy.velocity.y = -20;
			break;
		case "ArrowDown":
			enemy.attack();
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
