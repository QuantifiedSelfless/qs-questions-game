var percent = 0;
var bar_width = 800;
var bar_height = 50;
var timerinterval;
var prog_done = false;

function setup() {
	var canv = createCanvas(windowWidth,windowHeight);
	canv.parent("bgCanvas");
	timerinterval = setInterval(increase_percentage, 20);
}

function draw(){
	background(255);
	bar_x = (width/2) - (bar_width/2);
	fill(75,66,59);
	textAlign(CENTER);
	textSize(40);
	text("Results", width/2, 50);
	rect(bar_x, height/2, bar_width, bar_height);
	fill(139,196,182);
	rect(bar_x, height/2, ((percent * bar_width)/(100)), bar_height);
	textSize(32);
	fill(42,56,47);
	stroke(139,196,182);
	strokeWeight(3);
	text(percent + "%", width/2, height/2+35);
	if(prog_done){
		strokeWeight(0);
		text("I don't think you are who you say you are.", width/2, 300);
	} 

}

function increase_percentage(){
	if(percent < 48) percent++;
	else{
		clearInterval(timerinterval);
		prog_done = true;
	}
}