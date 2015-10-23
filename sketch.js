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
var img;
var start = 0;
var urls = ["https://pbs.twimg.com/profile_images/429055564262277120/fjuVYyFu.jpeg","https://pbs.twimg.com/profile_images/551143684671291392/Nx_lx21L_400x400.jpeg","http://chan.catiewayne.com/b/src/137230208038.jpg"];

function setup() {
  var canv = createCanvas(windowWidth,windowHeight);
  canv.parent("bgCanvas");
  s = createSprite(0,0,0,0);
  line = createSprite(width/2,300,width,2);
  line.immovable = true;
  img = createImg("blank.png");
}

function draw() {
  background(255,255,255);
  img_width = img.width;
  img_height = img.height;
  fill('rgb(0,255,0)');
  rect((width/2)+110, 350, 60, 60);
  fill('rgb(255,0,0)');
  rect((width/2)-170, 350, 60, 60);  
  fill(0);

  if(start == 1){
    //the image will follow the image's movement, so we can use collision from p5sprite on the DOM
    img.position((width/2)-(img_width/2), s.position.y-(img_height/2));
    zz = img.position();
    //floored since sprites can have non integer positions, while DOM image objects can't
    y_velocity += Math.floor(acceleration);
    s.position.y = s.position.y + y_velocity;
    //check collision with line
    s.bounce(line, invert);
  }
  drawSprites();
}

function invert(){
    y_velocity = Math.floor(y_velocity * -0.5);
    s.position.y = 171;
}

function checkDimensions(){
    if (img_width != 0 && img_height != 0) {
        spawn();
    }
    else {
        console.log("Caught");
        window.setTimeout("checkDimensions();",100);
    }

}

function spawn(){
    //makes our DOM image object un-highlight-able, so it's indistinguishable from the canvas
    img.class("noselect")
    s = createSprite(width/2, 10, img_width, img_height);
    s.shapeColor = color(0, 0, 0, 0);
    img.position((width/2)-(img_width/2), 10-(img_height/2));
}

function mousePressed() {
    start = 1;
    y_velocity = 0;
    acceleration = 1;
    img.remove();
    s.remove();
    img = createImg(urls[ Math.floor( Math.random() * urls.length ) ]);
    img_width = img.width;
    img_height = img.height;
    //Make sure img_width and image_height have values before drawing them, so the image collides properly.
    checkDimensions();
}