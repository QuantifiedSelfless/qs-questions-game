//TODO
//Python code to rate set similarity based on Jaccard Index
//Create interface for comparisons, spawn new image on answer instead of on click
//Drop 2 images, display text
//Figure out level loading/AJAX call
//Arduino testing
//Figure out how to get image URLS/other user data from database
//Make it pretty

/* --Notes-- /*
Sprites are positioned from their center, while DOM images are positioned from their top left corner.
To deal with this, we subtract half the image width/height from the values of the sprite to position the DOM image.
*/

var y_velocity = 0;
var acceleration = 10;
var image_width = 0;
var image_height = 0;
var image2_width = 0;
var image2_height = 0;
var line_height = 400;
var img;
var img2;
var start = false;
var stopped = false;
var urls = ["https://pbs.twimg.com/profile_images/429055564262277120/fjuVYyFu.jpeg","https://pbs.twimg.com/profile_images/551143684671291392/Nx_lx21L_400x400.jpeg","http://chan.catiewayne.com/b/src/137230208038.jpg"];

function setup() {
  background(255,255,255);
  var canv = createCanvas(windowWidth,windowHeight);
  canv.parent("bgCanvas");
  s = createSprite(0,0,0,0);
  s2 = createSprite(0,0,0,0);
  line = createSprite(width/2,line_height,width,2);
  line.immovable = true;
  img = createImg("blank.png");
  img2 = createImg("blank.png");
  fill(0);
}

function draw() {

  img_width = img.width;
  img_height = img.height;

  if(start){
    //the image will follow the image's movement, so we can use collision from p5sprite on the DOM
    img.position(s.position.x-(img_width/2), s.position.y-(img_height/2));
    img2.position(s2.position.x-(img_width/2), s2.position.y-(img_height/2));
    //floored since sprites can have non integer positions, while DOM image objects can't
    y_velocity += Math.floor(acceleration);
    s.position.y = s.position.y + y_velocity;
    s2.position.y = s2.position.y + y_velocity;
    //check collision with line
    s.bounce(line, invert);
    s2.bounce(line, invert);
  }
  drawSprites();
}

function invert(){
    y_velocity = Math.floor(y_velocity * -0.5);
    s.position.y = line_height-129;
    s2.position.y = line_height-129;
    if(y_velocity == -1 && stopped == false){
        stopped = true;
        textSize(32);
        textAlign(CENTER);
        fill(0, 0, 0);
        text("This or that?", (width/2), 450);
    }
}

function checkDimensions(){
    if (img_width != 0 && img_height != 0 && img2_width != 0 && img2_height != 0) {
        spawn();
    }
    else {
        console.log("Caught");
        window.setTimeout("checkDimensions();",100);
    }

}

function spawn(){
    //makes our DOM image object un-highlight-able, so it's indistinguishable from the canvas
    img.class("noselect");
    s = createSprite(width/3, 10, img_width, img_height);
    s2 = createSprite(2*(width/3), 10, img_width, img_height);
    s.shapeColor = color(0, 0, 0, 0);
    s2.shapeColor = color(0, 0, 0, 0);
    img.position(s.position.x-(img_width/2), 10-(img_height/2));
    img2.position(s.position.x-(img_width/2), 10-(img_height/2));

}

function mousePressed() {
    background(255,255,255);
    stopped = false;
    start = true;
    y_velocity = 0;
    acceleration = 1;
    img.remove();
    img2.remove();
    s.remove();
    s2.remove();
    img = createImg(urls[ Math.floor( Math.random() * urls.length ) ]);
    img2 = createImg(urls[ Math.floor( Math.random() * urls.length ) ]);
    img_width = img.width;
    img_height = img.height;
    img2_width = img2.width;
    img2_height = img2.height;
    //Make sure img_width and image_height have values before drawing them, so the image collides properly.
    checkDimensions();
}