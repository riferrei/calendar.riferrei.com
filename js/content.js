const elasticsearchEndpoint="elasticsearchEndpoint",authorizationHeader="authorizationHeader";function getWelcome(t){fetch(localStorage.getItem(elasticsearchEndpoint)+"/welcome/_doc/latest",{method:"GET",headers:{Authorization:localStorage.getItem(authorizationHeader)}}).then(t=>t.json()).then(e=>t(e))}function getNextEvent(t){fetch(localStorage.getItem(elasticsearchEndpoint)+"/events/_search",{method:"POST",headers:{Authorization:localStorage.getItem(authorizationHeader),"Content-Type":"application/json"},body:JSON.stringify({size:1,query:{range:{"@timestamp":{gte:"now-1d"}}},sort:[{"@timestamp":{order:"asc"}}]})}).then(t=>t.json()).then(t=>t.hits.hits[0]).then(e=>t(e))}function getEvents(t){fetch(localStorage.getItem(elasticsearchEndpoint)+"/events/_search",{method:"POST",headers:{Authorization:localStorage.getItem(authorizationHeader),"Content-Type":"application/json"},body:JSON.stringify({size:1e4,sort:[{"@timestamp":{order:"asc"}}]})}).then(t=>t.json()).then(t=>t.hits.hits).then(e=>t(e))}let handleContent=t=>{localStorage.setItem(elasticsearchEndpoint,t.elasticsearchEndpoint),localStorage.setItem(authorizationHeader,t.authorizationHeader)};fetch("js/content.json").then(t=>t.json()).then(t=>handleContent(t));