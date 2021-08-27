var socket = io.connect({secure: true}); 
socket.emit('connections', 'value');

var socket = io.connect({secure: true}); 
socket.emit('connections', 'value');

var sldr = [
    [document.getElementById("work_slider"), document.getElementById("work_time_total_seconds"), document.getElementById("work_time_minutes"), document.getElementById("work_time_seconds"), 0, "Work"],
    [document.getElementById("rest_slider"), document.getElementById("rest_time_total_seconds"), document.getElementById("rest_time_minutes"), document.getElementById("rest_time_seconds"), 0, "Rest"]
]

var sldrarr;

var start_trigger = 1

var total_time_text = document.getElementById("total_time_text");

var trigger_button = document.getElementById("trigger_button")
var timer_minute_text = document.getElementById("timer_minute_text")
var timer_second_text = document.getElementById("timer_second_text")
var title_text = document.getElementById("title_text")
var timer_exercises_text = document.getElementById("timer_exercises_text")
var timer_rounds_text = document.getElementById("timer_rounds_text")

var exercisecount = document.getElementById('exercisecount')
var roundcount = document.getElementById('roundcount')

function increaseValue(arg) {
    stop_time()
    active = 1

    title_text.innerHTML = ''
    timer_minute_text.innerHTML = ''
    timer_second_text.innerHTML = ''
    timer_exercises_text.innerHTML = ''
    timer_rounds_text.innerHTML = ''
    
    if (arg == 0) {
        var value = parseInt(document.getElementById('exercisecount').value, 10);
        value++;
        document.getElementById('exercisecount').value = value;
    } else {
        var value = parseInt(document.getElementById('roundcount').value, 10);
        value++;
        document.getElementById('roundcount').value = value;       
    }

    totalTime()
}

function decreaseValue(arg) {
    stop_time()
    active = 1

    title_text.innerHTML = ''
    timer_minute_text.innerHTML = ''
    timer_second_text.innerHTML = ''
    timer_exercises_text.innerHTML = ''
    timer_rounds_text.innerHTML = ''

    if (arg == 0) {
        var value = parseInt(exercisecount.value, 10);
        if (value <= 0) {
            value = 0
        } else {
            value--;
        }
        exercisecount.value = value;
    } else {
        var value = parseInt(roundcount.value, 10);
        if (value <= 0) {
            value = 0
        } else {
            value--;
        }
        roundcount.value = value;       
    }

    totalTime()
}


function reset() {
    for (var i = 0; i < sldr.length; i++) {
        sldr[i][0].value = 0  
        sldr[i][2].value = 0
        sldr[i][1].value = 0
        sldr[i][3].value = 0    

        sldr[i][2].innerHTML = ''
        sldr[i][1].innerHTML = ''
        sldr[i][3].innerHTML = ''    
    }
}
reset()

var refreshIntervalId;
var pos = 0;
var exerciseinit = 0
var roundinit = 0;
function runTime() {
    var audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-clock-countdown-bleeps-916.mp3');
    audio.autoplay = true;
    if (roundinit >= roundcount.value) {
        pos = parseInt(sldr.length)
        exerciseinit = parseInt(exercisecount.value)
        roundinit = parseInt(roundcount.value)
        return stop_time() 
     }

     if ((parseInt(sldrarr[pos][0][1]) <= 0) && (parseInt(sldrarr[pos][1][1]) == 5)) {
        audio.play();
    }

    timer_exercises_text.innerHTML = "Exercises: "+exerciseinit+" / "+exercisecount.value
    timer_rounds_text.innerHTML = "Rounds: "+roundinit+" / "+roundcount.value
    if ((parseInt(sldrarr[pos][0][1]) <= 0) && (parseInt(sldrarr[pos][1][1]) <= 0)) {
        pos +=1
    }

    if (pos >= sldr.length) {
        for (var i = 0; i < sldr.length; i++) {
            sldrarr[i][0][1] = sldrarr[i][0][0]
            sldrarr[i][1][1] = sldrarr[i][1][0]
        }
        exerciseinit += 1
        timer_exercises_text.innerHTML = "Exercises: "+exerciseinit+" / "+exercisecount.value
        pos = 0
    } 

    if (exerciseinit >= exercisecount.value) {
        exerciseinit = 0
        roundinit +=1
        timer_exercises_text.innerHTML = "Exercises: "+exerciseinit+" / "+exercisecount.value
        timer_rounds_text.innerHTML = "Rounds: "+roundinit+" / "+roundcount.value
    }

    minute = sldrarr[pos][0][1]
    second = sldrarr[pos][1][1]
    sldrarr[pos][1][1] -=1
    timer_minute_text.innerHTML = parseInt(minute)+"min"
    timer_second_text.innerHTML = parseInt(second)+"sec"

    if ((minute <= 0) && (second > 0)) {
        second += 60
        minute -=1
    } 
    title_text.innerHTML = sldr[pos][5]+" - Exercise "+(exerciseinit+1)
}



var initiate = 0;
function stop_time() {
    trigger_button.setAttribute("onclick", "start_time()");
    trigger_button.innerHTML = "Start Time"
    if ((roundinit>=roundcount.value) && (pos >= sldr.length)) {
        title_text.innerHTML = "Finished, Congratulations!"
        timer_minute_text.innerHTML = ''
        timer_second_text.innerHTML = ''
        timer_exercises_text.innerHTML = ''
        timer_rounds_text.innerHTML = ''
        active = 1
        pos = 0
        reset()
    } else {
        initiate = 1
    }
    clearInterval(refreshIntervalId);
}

var active = 1
function start_time() { 
    trigger_button.setAttribute("onclick", "stop_time()");
    trigger_button.innerHTML = "Stop Time"
    
    if ((initiate != 1) || (active == 1)) {
        active = 0
        sldrarr = [
            [
                [sldr[0][2].value, sldr[0][2].value], 
                [sldr[0][3].value, sldr[0][3].value]
            ],
            [
                [sldr[1][2].value, sldr[1][2].value], 
                [sldr[1][3].value, sldr[1][3].value]
            ]                
        ]
    }

    refreshIntervalId = setInterval(runTime, 1000);
}

function slider_input(i) {
    stop_time()
    active = 1

    title_text.innerHTML = ''
    timer_minute_text.innerHTML = ''
    timer_second_text.innerHTML = ''
    timer_exercises_text.innerHTML = ''
    timer_rounds_text.innerHTML = ''

    if (sldr[i][0].value >= sldr[i][4]) {
        sldr[i][2].value += 1
        sldr[i][2].innerHTML = "minute: "+(sldr[i][2].value)
        sldr[i][4] += 60
    } 

    if (sldr[i][0].value-(sldr[i][2].value*60) < 0) {
        sldr[i][2].value -=1  
        sldr[i][2].value = sldr[i][2].value
        sldr[i][2].innerHTML = "minute: "+sldr[i][2].value  
        sldr[i][4] -= 60 
    }

    sldr[i][3].value = sldr[i][0].value-(sldr[i][2].value*60)
    sldr[i][3].innerHTML = "seconds: "+(sldr[i][0].value-(sldr[i][2].value*60))

    sldr[i][1].innerHTML = "total seconds: "+sldr[i][0].value
    sldr[i][1].value = sldr[i][0].value

    totalTime()

}

function totalTime() {
    var a1 = (parseInt(sldr[0][1].value))
    var a2 = (parseInt(sldr[1][1].value))
    var a3 = (parseInt(document.getElementById('exercisecount').value))
    var a4 = (parseInt(document.getElementById('roundcount').value))

    var total_time = (a1+a2)*a3*a4
    var output = secondstoMinutes(total_time);
    total_time_text.innerHTML = "Total Workout: "+output[0]+"min & "+output[1]+"sec"
}

function secondstoMinutes(seconds) {
    var min = Math.floor(seconds/60)
    var sec  = (seconds)%60
    return [min, sec]
}

function addSeconds(work, rest, exercise, rounds, rounds_reset) {
    var total_seconds = work+rest+exercise+rounds+rounds_reset
    var conversion = secondstoMinutes(total_seconds)
    minutes = conversion[0]
    seconds = conversion[1]
}

addSeconds(20, 12, 44, 100, 123)




































































/*
var time;

var timer_minute_text = document.getElementById("timer_minute_text");
var timer_second_text = document.getElementById("timer_second_text");
var progressBar = document.getElementById("progressBar");

var minute = 0;
var minute_threshold = 60
var timer_active = 0

var work_slider = document.getElementById("work_slider")
var work_time_total_seconds = document.getElementById("work_time_total_seconds")
var work_time_minutes = document.getElementById("work_time_minutes")
var work_time_seconds = document.getElementById("work_time_seconds")

var rest_slider = document.getElementById("rest_slider")
var rest_time_total_seconds = document.getElementById("rest_time_total_seconds")
var rest_time_minutes = document.getElementById("rest_time_minutes")
var rest_time_seconds = document.getElementById("rest_time_seconds")

var start_time = document.getElementById("start_time")
var stop_time = document.getElementById("stop_time")

work_time_total_seconds.innerHTML = "total seconds: "+0
work_time_minutes.innerHTML = "minutes: "+0
work_time_seconds.innerHTML = "seconds: "+0

rest_time_total_seconds.innerHTML = "total seconds: "+0
rest_time_minutes.innerHTML = "minutes: "+0
rest_time_seconds.innerHTML = "seconds: "+0

if (timer_active == 0) {
    start_time.onclick = function() {starttime()};
}

var refreshIntervalId;
function run() {
    if (timer_second_text.value == 0) {
        if (timer_minute_text.value == 0) {
            timer_minute_text.innerHTML = " "
        } else {
            timer_minute_text.innerHTML = timer_minute_text.value+"min"
        }
        if (minute >= 1) {
            timer_minute_text.value -= 1
            timer_minute_text.innerHTML = timer_minute_text.value+"min"
            timer_second_text.value = 60
            timer_second_text.innerHTML = 60+"sec"
        } else {
            timer_second_text.value = (work_slider.value-(minute*60))
            timer_second_text.innerHTML = (work_slider.value-(minute*60))+"sec"
        }
    }
    
    timer_second_text.value -= 1;
    timer_second_text.innerHTML = timer_second_text.value+"sec";
    progressBar.value += 1;
    if ((timer_second_text.value <= 0) && (timer_minute_text.value <= 0)) {
        clearInterval(refreshIntervalId);
        timer_active = 0;
    }
}

function stopfunc() {
    clearInterval(refreshIntervalId);
    timer_active = 0;   
}

function downloadTimer() {
    refreshIntervalId = setInterval(run, 1000);
}

// Update the current slider value (each time you drag the slider handle)
work_slider.oninput = function() {
    work_time_minutes.value = 0
    if (work_slider.value >= minute_threshold) {
        minute +=1
        work_time_minutes.value = minute
        work_time_minutes.innerHTML = "minute: "+minute
        minute_threshold += 60
    } 
    if (work_slider.value-(minute*60) >= 0) {
        work_time_seconds.value = (work_slider.value-(minute*60))
        work_time_seconds.innerHTML = "seconds: "+(work_slider.value-(minute*60))
    } else {
        minute -=1  
        work_time_minutes.value = minute
        work_time_minutes.innerHTML = "minute: "+minute  
        minute_threshold -= 60 
    }
    work_time_total_seconds.innerHTML = "total seconds: "+work_slider.value
    work_time_total_seconds.value = work_slider.value
}

rest_slider.oninput = function() {
    rest_time_minutes.value = 0
    if (work_slider.value >= minute_threshold) {
        minute +=1
        rest_time_minutes.value = minute
        rest_time_minutes.innerHTML = "minute: "+minute
        minute_threshold += 60
    } 
    if (rest_slider.value-(minute*60) >= 0) {
        rest_time_seconds.value = (rest_slider.value-(minute*60))
        rest_time_seconds.innerHTML = "seconds: "+(rest_slider.value-(minute*60))
    } else {
        minute -=1  
        rest_time_minutes.value = minute
        rest_time_minutes.innerHTML = "minute: "+minute  
        minute_threshold -= 60 
    }
    rest_time_total_seconds.innerHTML = "total seconds: "+rest_slider.value
    rest_time_total_seconds.value = rest_slider.value
}

function starttime() {
    timer_minute_text.value = parseInt(work_time_minutes.value)+parseInt(rest_time_minutes.value)
    timer_minute_text.innerHTML = (timer_minute_text.value)+"min"
    if ((parseInt(work_time_total_seconds.value)+parseInt(rest_time_total_seconds.value)) < 60) {
        timer_second_text.value = parseInt(work_time_total_seconds.value)+parseInt(rest_time_total_seconds.value)
        timer_second_text.innerHTML = (timer_second_text.value)+"sec"    
    } else {
        timer_second_text.value = (parseInt(work_time_total_seconds.value)+parseInt(rest_time_total_seconds.value))-((parseInt(work_time_minutes.value)+parseInt(rest_time_minutes.value))*120)
        timer_second_text.innerHTML = (timer_second_text.value)+"sec"
    }
    progressBar.setAttribute("max",(parseInt(work_time_total_seconds.value)+parseInt(rest_time_total_seconds.value))); 

    timer_active = 1;
    downloadTimer()
}


// downloadTimer()

*/