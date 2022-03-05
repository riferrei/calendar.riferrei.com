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

        let buildEvents = (eventsDocuments) => {

            const NOVALUESET = -1;
            
            selectedSlide = NOVALUESET;
            timelineData.events = []
            latestEvent = new Date();
            latestEvent.setDate(latestEvent.getDate()-1);

            for (var i = 0; i < eventsDocuments.length; i++) {

                rawEvent = eventsDocuments[i]._source;
                timestamp = new Date(rawEvent['@timestamp']);

                if (selectedSlide == NOVALUESET) {
                    if (timestamp.getTime() > latestEvent.getTime()) {
                        selectedSlide = i+1;
                    }
                }

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
    getWelcome(buildWelcome);

}

function getWelcome(callback) {

    fetch("js/welcome.json")
        .then(response => response.json())
        .then(document => callback(document))

}

function getEvents(callback) {

    fetch("js/events.json")
        .then(response => response.json())
        .then(document => callback(document))

}
