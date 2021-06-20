const elasticsearchEndpoint = "elasticsearchEndpoint";
const authorizationHeader = "authorizationHeader";

function getWelcome(callback) {

    fetch(localStorage.getItem(elasticsearchEndpoint) + "/welcome/_doc/latest", {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem(authorizationHeader)
        }
    })
    .then(response => response.json())
    .then(document => callback(document))

}

function getNextEvent(callback) {

    var searchBody = {
        size: 1,
        query: {
            function_score: {
                functions: [
                   {
                      linear: {
                          "@timestamp": {
                               origin: "now",
                               scale: "1d"
                          }
                      }
                   }
                ],
                score_mode : "multiply",
                boost_mode: "multiply",
                query: {
                    match_all: {}
                }
             }
        }
    }
    
    fetch(localStorage.getItem(elasticsearchEndpoint) + "/events/_search", {
        method: 'POST',
        headers: {
            'Authorization': localStorage.getItem(authorizationHeader),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchBody)
    })
    .then(response => response.json())
    .then(response => response.hits.hits[0])
    .then(document => callback(document))

}

function getEvents(callback) {

    var searchBody = {
        size: 10000,
        sort: [
            {
                "@timestamp": {
                    order: "asc"
                }
            }
        ]
    }
    
    fetch(localStorage.getItem(elasticsearchEndpoint) + "/events/_search", {
        method: 'POST',
        headers: {
            'Authorization': localStorage.getItem(authorizationHeader),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchBody)
    })
    .then(response => response.json())
    .then(response => response.hits.hits)
    .then(documents => callback(documents))

}

let handleContent = (content) => {
    localStorage.setItem(elasticsearchEndpoint, content.elasticsearchEndpoint);
    localStorage.setItem(authorizationHeader, content.authorizationHeader);
}

fetch('js/content.json')
    .then(response => response.json())
    .then(content => handleContent(content))
