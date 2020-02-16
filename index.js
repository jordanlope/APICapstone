'use strict';


const searchURL = 'https://opentdb.com/api.php';


function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function renderQuestion(question) {
    console.log(question.results[0].question);
    $('#start-button').addClass('hide');
    $('#quiz').removeClass('hide');
    $('h1').append(`<p>${question.results[0].question}</p>`);
}

function fetchQuestion() {
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

$('#start-button').click(function(event){
    fetchQuestion();
});
