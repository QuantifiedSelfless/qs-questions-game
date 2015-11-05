//TODO
//Python code to rate set similarity based on Jaccard Index w/ fake data sets
//Data Spec
//Data Collecting Version of Game

//Arduino testing
//Figure out how to get image URLS/other user data from database
//Figure out level loading/AJAX call
//Make it pretty
/* --Notes-- /*
Sprites are positioned from their center, while DOM images are positioned from their top left corner.
To deal with this, we subtract half the image width/height from the values of the sprite to position the DOM image.
*/
var questions = ["Pizza or Hot Dogs?", "Would you rather eat a scorpion or a nail?", "47 or 62?", "Mice or Rice?"];
var left = ["Pizza", "Scorpion", "47", "Mice"];
var right = ["Hot Dogs", "Nail", "62", "Rice"];
var img_bool = [true, false, false, false];

var y_velocity = 0;
var y2_velocity = 0;
var acceleration = 10;
var img_width = 0;
var img_height = 0;
var img2_width = 0;
var img2_height = 0;
var line_height = 400;
var img;
var img2;
var start = false;
var stopped = false;
var answers = [];
var to_ask_index = 0;
var urls = ["http://previewcf.turbosquid.com/Preview/2014/08/01__22_25_34/256x256.jpgeda9e67c-b397-47b3-a12b-2fd410090bfbLarge.jpg", "http://www.fancyicons.com/free-icons/220/foods/png/256/hot_dog2_256.png","http://petcaretips.net/turtle_waving.gif","http://wristbandbros.s3.amazonaws.com/assets/blog/0431.png"];
function setup() {
    background(255,255,255);
    var canv = createCanvas(windowWidth,windowHeight);
    canv.parent("bgCanvas");
    s = createSprite(0,0,0,0);
    s2 = createSprite(0,0,0,0);
    s.mouseActive = true;
    s2.mouseActive = true;
    line = createSprite(width/2,line_height,width,2);
    line.immovable = true;
    img = createImg("blank.png");
    img2 = createImg("blank.png");
    fill(0);
}

function draw() {

  if(start){
    //the image will follow the image's movement, so we can use collision from p5sprite on the DOM
    img.position(s.position.x-(img_width/2), s.position.y-(img_height/2));
    img2.position(s2.position.x-(img2_width/2), s2.position.y-(img2_height/2));
    //floored since sprites can have non integer positions, while DOM image objects can't
    y_velocity += Math.floor(acceleration);
    y2_velocity += Math.floor(acceleration);
    s.position.y = s.position.y + y_velocity;
    s2.position.y = s2.position.y + y2_velocity;

    if (s.position.y > line_height){
        s.position.y = line_height;
    }
    if (s2.position.y > line_height){
        s2.position.y = line_height;
    }
    s.bounce(line, invert);
    s2.bounce(line, invert2);

    if(stopped && s.mouseIsPressed){
        newImages();
        //answers.push("A");
        //console.log(answers);
    }
    if(stopped && s2.mouseIsPressed){
        newImages();
        //answers.push("B");
        //console.log(answers);
    }
  }
  drawSprites();
}

function invert(){
    y_velocity = Math.floor(y_velocity * -0.5);
    s.position.y = line_height-(img_height/2)+1;
    if(y_velocity == -1 && stopped == false){
        stopped = true;
        textSize(32);
        textAlign(CENTER);
        fill(0, 0, 0);
        if(to_ask.length > 0){
            text(to_ask[0], (width/2), 450);
        }
        
    }
}

function invert2(){
    y2_velocity = Math.floor(y2_velocity * -0.5);
    s2.position.y = line_height-(img2_height/2)+1;
}

function spawn(){
    //makes our DOM image object un-highlight-able, so it's indistinguishable from the canvas
    img.removeClass("hide");
    img2.removeClass("hide");
    img.class("noselect");
    img2.class("noselect");
    s = createSprite(width/3, 10, img_width, img_height);
    s2 = createSprite(2*(width/3), 10, img2_width, img2_height);
    s.mouseActive = true;
    s2.mouseActive = true;
    s.shapeColor = color(0, 0, 0, 0);
    s2.shapeColor = color(0, 0, 0, 0);
    img.position(s.position.x-(img_width/2), 10-(img_height/2));
    img2.position(s.position.x-(img2_width/2), 10-(img2_height/2));
    start = true;
}

function mousePressed(){
    if(start == false){
        console.log("Start!");
        newImages();
    }
}

function doStuff() {
    if(img_width == 0 || img_height == 0 || img2_width == 0 || img2_height == 0) {
        img_width = img.width;
        img_height = img.height;
        img2_width = img2.width;
        img2_height = img2.height;
        setTimeout(doStuff, 50);//wait 50 millisecnds then recheck
        return;
    }
    spawn();
}

function newImages() {
    background(255,255,255);
    stopped = false;
    y2_velocity = 0;
    y_velocity = 0;
    acceleration = 1;
    img.remove();
    img2.remove();
    s.remove();
    s2.remove();
    //Randomly grab question from list of unasked questions
    to_ask_index = Math.floor(Math.random() * questions.length);
    //Remove that question from the pool of questions to be asked
    to_ask = questions.splice(to_ask_index, 1);
    //if question needs images, load image. otherwise, load text.
    if(img_bool[to_ask_index] == true){

        image1url = urls[0];
        image2url = urls[1];
        img = createImg(image1url);
        img2 = createImg(image2url);

        img_bool.splice(to_ask_index,1);
        left.splice(to_ask_index, 1);
        right.splice(to_ask_index,1);

    }
    else if(img_bool[to_ask_index] == false){
        

        img_bool.splice(to_ask_index,1);
        left_text = left.splice(to_ask_index, 1);
        right_text = right.splice(to_ask_index,1);
        img = createElement('h2',left_text);
        img2 = createElement('h2',right_text);

    }
    else{
        textSize(32);
        textAlign(CENTER);
        text("No more questions!", (width/2), 450);
    }

    img.class("hide");
    img2.class("hide");
    img_width = 0;
    img_height = 0;
    img2_width = 0;
    img2_height = 0;
    doStuff(); 
}