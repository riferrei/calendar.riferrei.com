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

            const NOVALUESET = -1;
            var nextEventDocId = NOVALUESET;
            var selectedSlide = NOVALUESET;

            try {
                nextEventDocId = nextEventDocument._id;
            } catch (err) {
            }

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
                            day: timestamp.getDate()
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

                if (selectedSlide == NOVALUESET) {
                    selectedSlide = eventsDocuments.length;
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

    fetch("js/getWelcome.json")
        .then(response => response.json())
        .then(document => callback(document))

}

function getNextEvent(callback) {

    fetch("js/getNextEvent.json")
        .then(response => response.json())
        .then(document => callback(document))

}

function getEvents(callback) {

    fetch("js/getEvents.json")
        .then(response => response.json())
        .then(document => callback(document))

}
