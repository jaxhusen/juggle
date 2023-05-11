if($('#contest-game-type').val() == "Juggle") {
    questions.counter = $(container_selector + " .counter_box");

    var url = _baseURL + "/qgamestart/" + _view_key;
    $.get(url, {}, function (response, status) {
        questions.counter.reset = function () {
            $('#Juggle_counter').html("0");
            _st = Date.now();
            questions.counter.interval = setInterval(function () {
                var currentTimerDisplay = Math.floor((Date.now() - _st) / 1000);
                $('#Juggle_counter').html(currentTimerDisplay);
            }, 1000);
        }

        _ready();
        preload(scoreArr,
                done,
                "contestJuggle",
                /* $('#contest-game-level').val(), */ 
                _st, 
                _scoreToWin);


                
        console.log('response',response);
        if (response == "OK") {
            questions.counter.reset();
            var image1 = document.getElementById('ball').innerText;
            //var image2 = document.getElementById('grass').innerText;

            
            var scoreArr = [];
            scoreArr.push(
                {background_image: image1, type: 1, index: null}, {background_image: image1, type: 1, index: null},
                //{background_image: image2, type: 1, index: null}, {background_image: image2, type: 1, index: null}
                );

            _st = Date.now();
        }    
    });  
}