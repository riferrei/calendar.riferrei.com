function buildTimeline(placeHolder) {

    let buildWelcome = (welcomeDocument) => {

        photoUrl = welcomeDocument._source.photoUrl
        photoComment = welcomeDocument._source.photoComment
        headline = welcomeDocument._source.headline
        headlineComment = welcomeDocument._source.headlineComment

        var timelineData = {
            title: {
                media: {
                    url: photoUrl,
                    credit: photoComment
                },
                text: {
                    headline: headline,
                    text: headlineComment
                }
            }
        };

        let buildNextEvent = (nextEventDocument) => {

            nextEventDocId = nextEventDocument._id;
            var selectedSlide = 0;

            let buildEvents = (eventsDocuments) => {

                timelineData.events = []
                for (var i = 0; i < eventsDocuments.length; i++) {

                    if (eventsDocuments[i]._id == nextEventDocId) {
                        selectedSlide = i+1;
                    }

                    rawEvent = eventsDocuments[i]._source;
                    timestamp = new Date(rawEvent['@timestamp']);

                    timelineEvent = {
                        group: rawEvent.groupName,
                        start_date: {
                            year: timestamp.getFullYear(),
                            month: timestamp.getMonth()+1,
                            day: timestamp.getDate(),
                            hour: timestamp.getHours(),
                            minute: timestamp.getMinutes(),
                            second: timestamp.getSeconds(),
                            millisecond: timestamp.getMilliseconds()
                        },
                        text: {
                            headline: rawEvent.headline,
                            text: rawEvent.text
                        },
                        media: {
                            url: rawEvent.mediaUrl,
                            thumbnail: rawEvent.thumbnail
                        }
                    }
                    timelineData.events.push(timelineEvent);

                }

                var additionalOptions = {
                    marker_padding: 2,
                    timenav_height_percentage: 50,
                    start_at_slide: selectedSlide,
                    zoom_sequence: [0, 0.2, 0.4, 0.6, 0.8, 1, 2, 3, 4, 5],
                    initial_zoom: 3,
                    font: "ubuntu",
                }

                window.timeline = new TL.Timeline(
                    placeHolder, timelineData, additionalOptions);

            }
            getEvents(buildEvents);

        }
        getNextEvent(buildNextEvent);

    }
    getWelcome(buildWelcome);

}

function getWelcome(callback) {

    fetch(getElasticsearchEndpoint() + "/welcome/_doc/latest", {
        method: 'GET',
        headers: {
            'Authorization': getAuthorizationHeader()
        }
    })
    .then(response => response.json())
    .then(document => callback(document))

}

function getNextEvent(callback) {

    var searchBody = {
        size: 1,
        query: {
            range: {
                "@timestamp": {
                    gte: "now-1d"
                }
            }
        },
        sort: [
            {
                "@timestamp": {
                    order: "asc"
                }
            }
        ]
    }
    
    fetch(getElasticsearchEndpoint() + "/events/_search", {
        method: 'POST',
        headers: {
            'Authorization': getAuthorizationHeader(),
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
    
    fetch(getElasticsearchEndpoint() + "/events/_search", {
        method: 'POST',
        headers: {
            'Authorization': getAuthorizationHeader(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchBody)
    })
    .then(response => response.json())
    .then(response => response.hits.hits)
    .then(documents => callback(documents))

}

const contentPayload = "ewogICAgImVsYXN0aWNzZWFyY2hFbmRwb2ludCI6ICJodHRwczovL2NhbGVuZGFyLXJpZmVycmVpLWNvbS5lcy51cy1lYXN0NC5nY3AuZWxhc3RpYy1jbG91ZC5jb206OTI0MyIsCiAgICAiYXV0aG9yaXphdGlvbkhlYWRlciI6ICJBcGlLZXkgYm5SMlRFcFliMEpVTlhOeVZEaDRaRUp3VkVVNlZGOW1TRzVZYUd0UllXVmtWVXRLVjNSRU9WUmxkdz09Igp9Cg==";

function getElasticsearchEndpoint() {
    return JSON.parse(atob(contentPayload)).elasticsearchEndpoint;
}

function getAuthorizationHeader() {
    return JSON.parse(atob(contentPayload)).authorizationHeader;
}
