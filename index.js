'use strict';

let STORE = {
    question: '',
    correctAnswer: ''
}

const searchURL = 'https://opentdb.com/api.php';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function renderQuestion(question) {
    console.log(question.results[0].question);
    STORE.question = question.results[0].question;
    STORE.correctAnswer = question.results[0].correct_answer;
    console.log(question.results[0].correct_answer);
    $('#start-button').replaceWith(
        '<h1>Question</h1>' + 
        `<h2>${STORE.question}</h2>` +
        '<form id="js-random-question" onsubmit="return false;">' + 
            '<input type="button" name="answer" class="js-form-option" aria-pressed="false" value="True">' +
            '<input type="button" name="answer" class="js-form-option" aria-pressed="false" value="False">' +
            '<input type="submit" id="js-submit-button" class="main-button" value="Submit">' +
        '</form>'
    );
}

function renderResults(result) {
    const style = result == 'Correct' ? 'feedback-correct' : 'feedback-incorrect';
    $('#content').replaceWith(
        '<section id="content">' +
        `<p class=${style}>${result}</p>` +
        '<button id="try-again-button">Try Again</button>' +
        '</section>'
    );
}

function fetchQuestion() {
    STORE.correctAnswer = '';
    STORE.question = '';
    const params = {
        'amount': 1,
        'difficulty': 'hard',
        'type': 'boolean',
    }

    const queryString = formatQueryParams(params);

    const url = searchURL + '?' + queryString;

    fetch(url).then((response) => {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.statusText)
    }).then(responseJSON => renderQuestion(responseJSON))
    .catch(err => {
        console.log(err.message);
    })
}

function formSubmit() {
    $('body').on('click', '#js-submit-button', function(event) {
        event.preventDefault();
    
        const selAnswer = $(this).closest('#content').find('.checked').attr('value');
        console.log(`Pressed answer is ${selAnswer}`);
        if(!selAnswer) {
            console.log('no answer');
        }
        else if(selAnswer == STORE.correctAnswer) {
            renderResults('Correct');
        } else if(selAnswer != STORE.correctAnswer) {
            renderResults('Incorrect');
        }
    });
}

function formOptions() {
    $('body').on('click', '.js-form-option', (event) => {
        const targetAnswer = $(event.currentTarget);
    
        const otherAnswer = $('.js-form-option').not(targetAnswer);
    
        const pressedBool = $(targetAnswer).attr('aria-pressed') === 'true';
    
        otherAnswer.removeClass('checked').attr('aria-pressed', false);
    
        targetAnswer.addClass('checked').attr('aria-pressed', !pressedBool);
    });
}

function startOver() {
    $('body').on('click', '#try-again-button', function(event) {
        $('#content').replaceWith(
            '<section id="content">' +
            '<button id="start-button">Start Question</button>' +
            '</section>'
        );
    });
}

function startQuestion() {
    $('body').on('click', '#start-button', function(event) {
        console.log('Start button pressed')
        fetchQuestion();
    });

    $('#start-button').click(function(event) {
        console.log('Start button pressed')
        fetchQuestion();
    });
}

function handleEvents() {
    formSubmit();
    formOptions();
    startOver();
    startQuestion();
}

$(handleEvents())