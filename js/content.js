var ES_ENDPOINT = "https://calendar-riferrei-com.es.us-east4.gcp.elastic-cloud.com:9243";
var AUTHORIZATION = "ApiKey bnR2TEpYb0JUNXNyVDh4ZEJwVEU6VF9mSG5YaGtRYWVkVUtKV3REOVRldw==";

function getWelcome(callback) {

    var endpoint = ES_ENDPOINT + "/welcome/_doc/latest";
    
    fetch(endpoint, {
        method: 'GET',
        headers: {
            'Authorization': AUTHORIZATION
        }
    })
    .then(response => response.json())
    .then(data => callback(data))

}

function getNextEvent(callback) {

    var endpoint = ES_ENDPOINT + "/events/_search";

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
                  range: {
                    "@timestamp": {
                      gte: "now"
                    }
                  }
                }
             }
        }
    }
    
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Authorization': AUTHORIZATION,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchBody)
    })
    .then(response => response.json())
    .then(response => response.hits.hits[0])
    .then(data => callback(data))

}

function getEvents(callback) {

    var endpoint = ES_ENDPOINT + "/events/_search";

    var searchBody = {
        sort: [
            {
                "@timestamp": {
                    order: "asc"
                }
            }
        ]
    }
    
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Authorization': AUTHORIZATION,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchBody)
    })
    .then(response => response.json())
    .then(response => response.hits.hits)
    .then(data => callback(data))

}
