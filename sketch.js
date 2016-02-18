/* --Notes-- /*
Sprites are positioned from their center, while DOM images are positioned from their top left corner.
To deal with this, we subtract half the image width/height from the values of the sprite to position the DOM image.
*/

var timer_draw = '00'
var timer_min = 0;
var timer_sec = 5;
var timer_text;
var time_start = false;
var question_count = 0;
var question_text;
var questions = [];
var left = [];
var right = [];
var img_bool = [];
var q_nums = [];
for(var i = 0; i < q_json.length; i++){

    questions.push(q_json[i].question_text);
    left.push(q_json[i].question_left);
    right.push(q_json[i].question_right);
    img_bool.push(q_json[i].image);
    q_nums.push(q_json[i].question_number);
}
//var questions = ["Pizza or Hot Dogs?", "Would you rather eat a scorpion or a nail?", "47 or 62?", "Mice or Rice?", "A or B?", "C or D?", "2 or K?", "Yes or No?", "Now or later?", "Uh or Huh?", "Cars or Cats?", "W or U?"];
//var left = ["Pizza", "Scorpion", "47", "Mice", "A", "C", "2", "Yes", "Now", "Uh", "Cars", "W"];
//var right = ["Hot Dogs", "Nail", "62", "Rice", "B", "D", "K", "No", "Later", "Huh", "Cats", "U"];
var mock_answers = ['1B','2B','3B','4B','5B','6B','7B','8B','9B','10B','11B','12B','13B','14B','15B','16B','17B','18B','19B','20B','21B','22B','23B','24B','25B','26B','27B','28B','29B','30B'];
//var img_bool = [true, false, false, false, false, false, false, false, false, false, false, false];
var percent = 0;
var results_timer;
var timerinterval;
var prog_done = false;
var y_velocity = 0;
var y2_velocity = 0;
var acceleration = 10;
var img_width = 0;
var img_height = 0;
var img2_width = 0;
var img2_height = 0;
var img;
var img2;
var start = false;
var end = false;
var stopped = false;
var wrong_prompt = false;
var wrong_count = 0;
var answers_ten = [];
var answers_twenty = [];
var to_ask_index = 0;
var urls = ["http://previewcf.turbosquid.com/Preview/2014/08/01__22_25_34/256x256.jpgeda9e67c-b397-47b3-a12b-2fd410090bfbLarge.jpg", "http://www.fancyicons.com/free-icons/220/foods/png/256/hot_dog2_256.png","http://petcaretips.net/turtle_waving.gif","http://wristbandbros.s3.amazonaws.com/assets/blog/0431.png"];

function preload(){
    podium = loadImage("podium.png");
    overlay = loadImage("Tree_Overlay.png")
}

function setup() {

    question_text = createDiv('Click To Start'); //dummy, so that we can have remove() as the first line of the newquestion function
    question_text.class("questionText");
    question_text
    var canv = createCanvas(windowWidth,windowHeight);
    canv.parent("bgCanvas");
    background("#8bc4b6");
    s = createSprite(0,0,0,0);
    s2 = createSprite(0,0,0,0);
    s.mouseActive = true;
    s2.mouseActive = true;
    img = createImg("blank.png");
    img2 = createImg("blank.png");
    aspect = podium.width/podium.height;
    pod_width = width * 0.75;
    pod_height = podium.height/(podium.width/(pod_width))
    line_height = height-pod_height-10 
    line = createSprite(width/2,line_height,width*0.75,10);
    line.shapeColor = color(200,175,75);
    line.immovable = true;
}

function draw() {
    clear()
    background("#8bc4b6");
    imageMode(CENTER);
    rectMode(CENTER);
    rect(width/2, line_height-200, width*0.75, line_height);
    image(podium, width/2, height - (pod_height/2), pod_width, pod_height);
    textSize(32);
    fill(0);
    textAlign(CENTER);
    fill("#483d39");
    textFont("Exo2");
    if(!end) text(timer_draw, width/2, 65);

  if(start){
    if(wrong_prompt){
        clearInterval(timerinterval);
        imageMode(CORNER);
        image(overlay, 0, 0, width, height);
        text("DesignCraft would like you to take a moment to think about what you just said.", width/2, 300);

        if(wrong_once){
            wrong_once = false;
            img.class("hide");
            img2.class("hide");
            question_text.class("hide");
            setTimeout(function(){wrong_prompt = false; img.removeClass("hide"); img2.removeClass("hide"); question_text.removeClass("hide"); timerinterval = setInterval(update_timer, 1000); if(end) results_timer = setInterval(increase_percentage, 20);}, 5000);
        }
    }
    else{
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
    }

    if(!end && stopped && s.mouseIsPressed){
        question_count++;
        question_num = q_nums.splice(to_ask_index,1);
        // Only push to initial array for first 10 questions
        // Then push to secondary array, start comparisons.
        if(question_count <= 10){
            answers_ten.push(question_num + "A");
            console.log(answers_ten);
        }
        else{
            answers_twenty.push(question_num + "A");
            console.log(answers_twenty);
            if($.inArray(question_num + "A", mock_answers) == -1){
                console.log("WRONG!");
                wrong_once = true;
                wrong_prompt = true;
            }
        }
        newQuestion();  
    }
    else if(!end && stopped && s2.mouseIsPressed){
        question_count++;
        question_num = q_nums.splice(to_ask_index,1);
        if(question_count <= 10){
            answers_ten.push(question_num + "B");
            console.log(answers_ten);
        }
        else{
            answers_twenty.push(question_num + "B");
            console.log(answers_twenty);
            if($.inArray(question_num + "B", mock_answers) == -1){
                console.log("WRONG!");
                wrong_once = true;
                wrong_prompt = true;
            }
        }
        newQuestion();
    }
    else if(end && !wrong_prompt) results();
  }
  drawSprites();
}

function update_timer(){
    if(timer_min == 0 && timer_sec == 0){
    question_num = q_nums.splice(to_ask_index,1);    
    
    // Need to decide what to do when time runs out on a 



    /*late_answer = ["A","B"][Math.floor(Math.random() * 2)];
        if(question_count <= 10){
            answers_ten.push(question_num + late_answer);
            console.log(answers_ten);
        }
        else{
            answers_twenty.push(question_num + late_answer);
            console.log(answers_twenty);
            if($.inArray(question_num + late_answer, mock_answers) == -1){
                console.log("WRONG!");
                wrong_once = true;
                wrong_prompt = true;
            }
        }
        newQuestion();*/ 
    }

    else if(timer_sec == 0){
        timer_min--;
        timer_sec = 59;
    }

    else{
        timer_sec--;
    }
    //timer_draw = ('0' + timer_min).slice(-2) + ':' + ('0' + timer_sec).slice(-2)
    timer_draw = ('0' + timer_sec).slice(-2)

    
}

function invert(){
    y_velocity = Math.floor(y_velocity * -0.5);
    s.position.y = line_height-5-(img_height/2);
    if(y_velocity == -1 && stopped == false){
        stopped = true;
        fill(0, 0, 0);

        if(to_ask.length > 0){
            question_text = createDiv(to_ask);
            question_text.class("questionText");
            question_text.class("noselect");            
        }
        
    }
}

function invert2(){
    y2_velocity = Math.floor(y2_velocity * -0.5);
    s2.position.y = line_height-5-(img2_height/2);
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
        newQuestion();
    }
}

function dimensionCheck() {
    if(img_width == 0 || img_height == 0 || img2_width == 0 || img2_height == 0) {
        img_width = img.width;
        img_height = img.height;
        img2_width = img2.width;
        img2_height = img2.height;
        setTimeout(dimensionCheck, 50);//wait 50 millisecnds then recheck
        return;
    }
    spawn();
}

function results(){
    rectMode(CORNER);
    bar_width = 800;
    bar_height = 50;
    bar_x = (width/2) - (bar_width/2);
    fill(75,66,59);
    textAlign(CENTER);
    textSize(40);
    text("Results", width/2, 100);
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
        clearInterval(results_timer);
        prog_done = true;
    }
}

function newQuestion() {
    //background(255,255,255);
    if(start){
        clearInterval(timerinterval);
        timer_sec = 5;
    }
    question_text.remove();
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

        // Draw the results screen
        clearInterval(timerinterval);
        end = true;
        if(!wrong_prompt) results_timer = setInterval(increase_percentage, 20);
        // Refresh page here
    }

    img.class("hide");
    img2.class("hide");
    img_width = 0;
    img_height = 0;
    img2_width = 0;
    img2_height = 0;
    timerinterval = setInterval(update_timer, 1000);
    dimensionCheck(); 
}