/* --Notes-- /*
Sprites are positioned from their center, while DOM images are positioned from their top left corner.
To deal with this, we subtract half the image width/height from the values of the sprite to position the DOM image.
*/

var timer_draw = '00';
var timer_min = 0;
var timer_sec = 5;
var timer_text;
var time_start = false;
var question_count = 0;
var question_text;
var questions = [];
var left = [];
var right = [];
var q_nums = [];
for(var i = 0; i < q_json.length; i++){

    questions.push(q_json[i].question_text);
    left.push(q_json[i].question_left);
    right.push(q_json[i].question_right);
    q_nums.push(q_json[i].question_number);
}

var mock_answers = {
    1: "B",
    2: "B",
    3: "B",
    4: "B",
    5: "B",
    6: "B",
    7: "B",
    8: "B",
    9: "B",
    10: "B",
    11: "B",
    12: "B",
    13: "B",
    14: "B",
    15: "B",
    16: "B",
    17: "B",
    18: "B",
    19: "B",
    20: "B",
    21: "B",
    22: "B",
    23: "B",
    24: "B",
    25: "B",
    26: "B",
    27: "B",
    28: "B",
    29: "B",
    30: "B",
    31: "B",
    32: "B"
};
var percent = 0;
var results_timer;
var timerinterval;
var prog_done = false;
var y_velocity = 0;
var y2_velocity = 0;
var acceleration = 10;
var left_choice;
var right_choice;
var stopped = false;
var start = false;
var end = false;
var wrong_prompt = false;
var wrong_count = 0;
var answers_ten = [];
var answers_twenty = [];
var to_ask_index = 0;
var myTimer;

var gameState = 0;

var myR1;
var myR2;
var myR3;
var myTrans;
var timerinterval;


function preload(){
    podium = loadImage("/static/img/podium.png");
    overlay = loadImage("/static/img/Tree_Overlay.png")
}

function setup() {

    myTimer = createP();
    myTimer.hide();
    question_text = createDiv('Click To Start'); //dummy, so that we can have remove() as the first line of the newquestion function
    question_text.class("questionText");
    var canv = createCanvas(windowWidth,windowHeight);
    canv.parent("bgCanvas");
    background("#8bc4b6");
    left_choice = createImg("blank.png");
    right_choice = createImg("blank.png");
    aspect = podium.width/podium.height;
    pod_width = width * 0.75;
    pod_height = podium.height/(podium.width/(pod_width))
    textFont("Exo2");

}

var Round1 = function () {
    this.QR1 = [];
    this.q_num = 0;
    this.ready = false;
    this.question;

    this.createQuestions = function () {
        for (i=0; i<10; i++) {
            var num = _.random(0, q_json.length - 1);
            var myQues = q_json[num]
            //console.log(myQues);
            this.QR1.push(myQues);
            _.remove(q_json, function (n) {
                return n["question_number"] == myQues['question_number'];
            });
        }

    }

    this.start= function () {
        this.createQuestions();
        this.drawCanvas();
        this.questionTime();
    }

    this.questionTime= function () {
        //console.log(this);
        if (this.q_num < 10) {
            this.askQuestion()
        } else {
            //console.log("About to transition");
            transitionGame(2);
        }
    }

    this.askQuestion= function () {
        //console.log('asking a question :)')
        timerinterval = setInterval(update_timer, 1000);
        question_text.remove();
        stopped = false;
        y2_velocity = 0;
        y_velocity = 0;
        acceleration = 1;
        left_choice.remove();
        right_choice.remove();
        this.question = this.QR1[this.q_num];
        //Increment for next pass
        this.q_num += 1;
        left_text = this.question['question_left'];
        right_text = this.question['question_right'];
        question_text = this.question['question_text'];
        left_choice = createElement('h2',left_text);
        right_choice = createElement('h2',right_text);
        left_choice.position((width/3) - (left_choice.width/2), 400);
        right_choice.position((2*width/3) - (right_choice.width/2), 400);
        question_text = createDiv(this.question['question_text']);
        question_text.class("questionText");
        question_text.class("noselect");  
    }

    this.leftFire= function () {
        me = this;
        myq = parseInt(this.question["question_number"]);
        mya = mock_answers[myq];
        answers_ten.push({myq: 'A'});
        if ('A' == mya) {
            left_choice.style('background-color', 'green');
            setTimeout(function () {me.questionTime()}, 1000);
        } else {
            left_choice.style('background-color', 'red');
            wrong_count++;
            setTimeout(function () {me.wrongDisplay()}, 1000);
            
        }

    }

    this.rightFire = function () {
        me = this;
        myq = parseInt(this.question["question_number"]);
        mya = mock_answers[myq];
        answers_ten.push({myq: 'B'});
        if ('B' == mya) {
            right_choice.style('background-color', 'green');
            setTimeout(function () {me.questionTime()}, 1000);
        } else {
            right_choice.style('background-color', 'red');
            wrong_count++;
            setTimeout(function () {me.wrongDisplay()}, 1000);
        }
    }

    this.wrongDisplay = function () {
        me = this;
        imageMode(CORNER);
        image(overlay, 0, 0, width, height);
        text("DesignCraft would like you to take a moment to think about what you just said.", width/2, 300);
        left_choice.class("hide");
        right_choice.class("hide");
        question_text.class("hide");
        setTimeout(function () {me.endWrong()}, 5000);
    }

    this.endWrong = function () {
        left_choice.removeClass("hide"); 
        right_choice.removeClass("hide"); 
        question_text.removeClass("hide");
        this.drawCanvas();
        this.questionTime();
    }

    this.drawCanvas = function () {
        clear();
        myTimer.show();
        myTimer.html(timer_draw)
        myTimer.position(width/2, 65);
        background("#8bc4b6");
        imageMode(CENTER);
        rectMode(CENTER);
        fill(255);
        rect(width/2, height-pod_height-200, width*0.75, pod_height+200);
        image(podium, width/2, height - (pod_height/2), pod_width, pod_height);
        textSize(32);
        fill(0);
        textAlign(CENTER);
        fill("#483d39");
    }
}
// END OF ROUND 1 OBJECT

var Transition = function ( state ) {
    var done = false;
    myState = state;

    this.start = function () {
        /*
        data = {
            answers: answers_ten,
        }
        $.ajax({
        type: 'POST',
        url: '/recommender/answers',
        data: data,
        success: function( myRecs ) {
            //Replace this with our good variables!
            mock_answers = myRecs;
            text("Press Enter when you're ready to keep it going!", width/2, 500);
            done = true;
        }
        error: function(xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
        */
    }

    this.finisher = function () {
        if (done == true) {
            //Recognize the key press
        }
    }

    this.display = function () {
        if (myState == 2){
            imageMode(CORNER);
            image(overlay, 0, 0, width, height);
            text("You seem to really know what you like. But now let us help you get to know yourself even better!", width/2, 300);
        }
    }

}

var transitionGame = function (state) {
    gameState = state;
    myTrans = new Transition(gameState);
    myTrans.start();
    myTrans.display();
};

function keyPressed () {
    if (gameState == 0) {
        if (keyCode === ENTER) {
            gameState = 1;
            myR1 = new Round1();
            myR1.start();

        }
    } else if (gameState == 1) {
        clearInterval(timerinterval);
        timer_sec = 8;
        if (keyCode === LEFT_ARROW) {
            myR1.leftFire();
        } else if(keyCode === RIGHT_ARROW) {
            myR1.rightFire();
        }

    } else if (gameState == 2) {
        if (keyCode === ENTER) {
            myTrans.finisher();
        }
        
    } else if (gameState == 3) {
        
    } else if (gameState == 4) {
        
    } else if (gameState == 5) {
        
    } else if (gameState == 6) {
        
    }

}

function newQuestion() {
    //background(255,255,255);
    if(start){
        clearInterval(timerinterval);
        timer_sec = 5;
    }
    
  
    else{

        // Draw the results screen
        clearInterval(timerinterval);
        end = true;
        if(!wrong_prompt) results_timer = setInterval(increase_percentage, 20);
        // Refresh page here
    }

}

function update_timer(){
    if( timer_min == 0 && timer_sec == 0){
        question_num = q_nums.splice(to_ask_index,1);    
    } else if(timer_sec == 0){
        timer_min--;
        timer_sec = 59;
    } else{
        timer_sec--;
    }
    timer_draw = ('0' + timer_sec).slice(-2);
    myTimer.html(timer_draw)
    myTimer.position(width/2, 65);
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


