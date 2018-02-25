//select canvas and set context to 2d rendering obj
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var starCount = 750;

//mouse object for position
var mouse = {
	x: window.innerWidth / 2,
	y: window.innerHeight / 2 
};

var isMouseDown = false;
//window mouse move will update mouse obj x and y
window.addEventListener("mousemove", function(event) {
	mouse.x = event.clientX - canvas.width / 2;
	mouse.y = event.clientY - canvas.height / 2;
});

//window resize will resize the canvas and reintialize stars
window.addEventListener("resize", function() {
	canvas.width = window.innerWidth;	
	canvas.height = window.innerHeight;

	starParticles = [];
	initializeParticles();
});


window.addEventListener("mousedown", function() {
	isMouseDown = true;	
});


window.addEventListener("mouseup", function() {
	isMouseDown = false;	
});

//Star Particle object
function StarParticle(x, y, radius, color) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = color;

	this.update = () => {
		this.draw();
	};

	this.draw = () => {
		c.save();
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);	
		c.shadowColor = this.color;
		c.shadowBlur = 15;
		c.shadowOffsetX = 0;
		c.shadowOffsetY = 0;
		c.fillStyle = this.color;
		c.fill();
		c.closePath();
		c.restore();
	};
}

//array of star objects
var starParticles = [];
//function to create stars
initializeParticles = () => {
	for (var i = 0; i < starCount; i++) {
		var randomRadius = Math.random() * 2;

		// Create stars past canvas so filled when rotating
		var x = (Math.random() * (canvas.width + 200)) - (canvas.width + 200) / 2;
		var y = (Math.random() * (canvas.width + 200)) - (canvas.width + 200) / 2;
		starParticles.push(new StarParticle(x, y, randomRadius, randomColor(colors)));
	}
	//add a moon
	starParticles.push(new StarParticle(500, 300, 15, '#a5a995'));

};

var timer = 0;
var opacity = 1;
var speed = 0.0003;

animate = () => {
	window.requestAnimationFrame(animate);

	c.save();
	if (isMouseDown === true) {

		// Ease into the new opacity
		var desiredOpacity = 0.01;
		opacity += (desiredOpacity - opacity) * 0.03;
		c.fillStyle = "rgba(18, 18, 18,"+ opacity +")";

		// Ease into the new speed
		var desiredSpeed = 0.005;
		speed += (desiredSpeed - speed) * 0.005;
		timer += speed;

	} else {

		// Ease back to the original opacity
		var originalOpacity = 1;
		opacity += (originalOpacity - opacity) * 0.01;
		c.fillStyle = "rgba(18, 18, 18, " + opacity + ")";

		// Ease back to the original speed
		var originalSpeed = 0.0003;
		speed += (originalSpeed - speed) * 0.005;
		timer += speed;

	}

	c.fillRect(0, 0, canvas.width, canvas.height);
	c.translate(canvas.width / 2, canvas.height/2 );
	c.rotate(timer);

	for (var i = 0; i < starParticles.length; i++) {
		starParticles[i].update();
	}

	c.restore();
}

// Utility Functions
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

var colors = [
	"#0952BD",
	"#A5BFF0",
	"#118CD6",
	"#1AAEE8",
	"#F2E8C9",
	"#061826",
	"#F2E2D2",
	"#9FB7B9"
];
function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
}

function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1
    const yDist = y2 - y1
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

initializeParticles();
animate();