

/*-----> DATA FEED <-----*/
function getFeed(url, version){
    feedCallBackFailsafeTimer = window.setTimeout(goFailsafe, failsafeDuration);
    // Check current protocol and replace current URL protocol to match
    var proto = ('https:' == document.location.protocol ? 'https://' : 'http://');
    var finalURL =  proto + url.slice(url.indexOf("://")+3);

    switch(version){
        case "json": case "xml":
            callAJAX(finalURL, version);
            break;
        case "json_jsonp_mirror": case "xml_jsonp_mirror":
            callJSONP(finalURL);
            break;
        default:
            goFailsafe();
            break;
    }
}

function callJSONP(url){
    var dataFeed = document.createElement('script');
    dataFeed.src = url;
    dataFeed.type = "text/javascript";
    dataFeed.id = "dataFeed";
    dataFeed.charset = "utf-8";
    dataFeed.async = false;
    document.getElementsByTagName("head")[0].appendChild(dataFeed);
}


function iqCallback(data){handleReturnedFeedData(data);}



function handleReturnedFeedData(data){
    window.clearTimeout(feedCallBackFailsafeTimer);
    if(data !== null && typeof data !== "undefined"){
        populateConfigObjArticleFramesWithFeedData(data);
        goCreative();
    } else{goFailsafe();}
}

// Call JSON or XML type feed via AJAX request
function callAJAX(url, version){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState === 4){
            if(this.status === 200){ // Status 200 = successful HTTP requests, pass returned data for check/use
                if(version === "json"){
                    // Due to browser compatibility issues do not use XMLHttpRequest.responseType("json") for JSON feed
                    // JSON returns should be received as text and parsed as per below to JSON
                    handleReturnedFeedData(JSON.parse(xhttp.responseText));
                }else{
                    handleReturnedFeedData(xhttp.responseXML);
                }
            }else if(this.status >= 400){ // status of 400 and above are error codes, fire failsafe on error
                goFailsafe();
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}
