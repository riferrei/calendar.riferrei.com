function getWelcome(callback){fetch(getElasticsearchEndpoint()+"/welcome/_doc/latest",{method:"GET",headers:{Authorization:getAuthorizationHeader()}}).then(response=>response.json()).then(document=>callback(document))}function getNextEvent(callback){var searchBody={size:1,query:{range:{"@timestamp":{gte:"now-1d"}}},sort:[{"@timestamp":{order:"asc"}}]};fetch(getElasticsearchEndpoint()+"/events/_search",{method:"POST",headers:{Authorization:getAuthorizationHeader(),"Content-Type":"application/json"},body:JSON.stringify(searchBody)}).then(response=>response.json()).then(response=>response.hits.hits[0]).then(document=>callback(document))}function getEvents(callback){var searchBody={size:1e4,sort:[{"@timestamp":{order:"asc"}}]};fetch(getElasticsearchEndpoint()+"/events/_search",{method:"POST",headers:{Authorization:getAuthorizationHeader(),"Content-Type":"application/json"},body:JSON.stringify(searchBody)}).then(response=>response.json()).then(response=>response.hits.hits).then(documents=>callback(documents))}const contentPayload="ewogICAgImVsYXN0aWNzZWFyY2hFbmRwb2ludCI6ICJodHRwczovL2NhbGVuZGFyLXJpZmVycmVpLWNvbS5lcy51cy1lYXN0NC5nY3AuZWxhc3RpYy1jbG91ZC5jb206OTI0MyIsCiAgICAiYXV0aG9yaXphdGlvbkhlYWRlciI6ICJBcGlLZXkgYm5SMlRFcFliMEpVTlhOeVZEaDRaRUp3VkVVNlZGOW1TRzVZYUd0UllXVmtWVXRLVjNSRU9WUmxkdz09Igp9Cg==";function getElasticsearchEndpoint(){return JSON.parse(atob(contentPayload)).elasticsearchEndpoint}function getAuthorizationHeader(){return JSON.parse(atob(contentPayload)).authorizationHeader}