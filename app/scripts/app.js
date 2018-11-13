


// @codekit-prepend "jquery-3.3.1.min.js"
// @codekit-prepend "slick.js"
// @codekit-prepend "creativeConfigObj.js"


/*------------------------*/
/*-----> VARIABLES  <-----*/
/*------------------------*/
var creativeId = "HTMLResponsiveRichMediaBanner";
var creativeVersion = "1.1.0";
var lastModified = "2017-02-07";
var lastUploaded = "2017-02-07";
var templateVersion = "2.0.24"; // sdf replace
var templateName = "cf_deluxe_banner_flex_frame_iq_1x1_" + creativeVersion + "_6266"; // cf_[format_name]_[template_name]_[wxh]_version_BlockID
var scrollPos = {x:undefined, y:undefined};
var adId, rnd, uid, versionID;

var feedCallBackFailsafeTimer; // Vairable to hold timeout for tritggering of failsafe
var failsafeDuration = 3000;   // Duration of time without response from data feed call to triggering of failsafe
var dataArray; 

var mobileTotalGalleryFrames;
var mobileCurrentGalleryFrame = 1;

var desktopTotalGalleryFrames;
var desktopCurrentGalleryFrame = 1;
var desktopGalleryFramePosArr = [];

var isIE10 = (navigator.userAgent.indexOf("MSIE 10") !== -1)?true:false;


/*------------------------------*/
/*-----> TEMPLATE CONFIG  <-----*/
/*------------------------------*/




function checkIfAdKitReady(event) {
    try {
		if (window.localPreview) {
			window.adkit.onReady(function() {
				window.initializeLocalPreview(); 
				initializeCreative();
			});
			return;
		} else {window.localPreview = false;}
	} catch (e) {window.localPreview = false;}
	if (window.adkit) {window.adkit.onReady(initializeCreative);} else {initializeCreative();}
}

function initializeCreative() {
	var viewportMeta = document.querySelector('meta[name="viewport"]');
    viewportMeta.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=0");
    window.setTimeout(function(e){viewportMeta.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=0");}, 500);
	typeof Modernizr == "object" && (Modernizr.touch = Modernizr.touch || "ontouchstart" in window);
    window.EBG.pm.bind("sendCreativeId", function() {eventManager.apply(this, arguments);}, this);
	window.EBG.pm.bind("eventCallback", function() {eventManager.apply(this, arguments);}, this);
    initializeGlobalVariables();
    setCreativeVersion();
    getFeed(creativeConfigObj.feedURL, creativeConfigObj.feedVersion);
    window.setTimeout(function(e){ document.getElementById("adWrapper").style.visibility = "visible"; }, 250);
}

function initializeGlobalVariables() {
	adId = window.EB._adConfig.adId;
	rnd = window.EB._adConfig.rnd;
	uid = window.EB._adConfig.uid;
    try{versionID = EB._adConfig.massVersioning.adVersions.split("_")[0];}catch(err){versionID = "";}
}

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

function populateConfigObjArticleFramesWithFeedData(data) {
    var dataArray = null;
    if (creativeConfigObj.feedVersion === "xml"){
        dataArray = data.getElementsByTagName("item");
        for(var i=0; i<creativeConfigObj.articleFrames.length; i++){
            creativeConfigObj.articleFrames[i].headline = {copy:dataArray[i].getElementsByTagName("promotionalHeadline")[0].childNodes[0].nodeValue, color: "#FFF"};
            creativeConfigObj.articleFrames[i].url = dataArray[i].getElementsByTagName("link")[0].childNodes[0].nodeValue;
            creativeConfigObj.articleFrames[i].descriptor = {copy:dataArray[i].getElementsByTagName("description")[0].childNodes[0].nodeValue, color: "#FFF"};
        }
    }else{
        dataArray = (creativeConfigObj.feedVersion === "xml_jsonp_mirror")?data["rss"]["channel"]["item"]:data["data"]["anyWorks"];
        for(var i=0; i<creativeConfigObj.articleFrames.length; i++){
            creativeConfigObj.articleFrames[i].headline = {copy :(creativeConfigObj.feedVersion === "xml_jsonp_mirror")?dataArray[i]["promotionalHeadline"]["$t"]:dataArray[i]["promotionalHeadline"], color: "#FFF"};
            var rei = creativeConfigObj.articleFrames[i].logo.url = (creativeConfigObj.feedVersion === "xml_jsonp_mirror")?dataArray[i]['promotionalMedia']["$t"]:dataArray[i]['promotionalMedia']['crops'][0]['renditions'][0]['url']; 
            creativeConfigObj.articleFrames[i].url = (creativeConfigObj.feedVersion === "xml_jsonp_mirror")?dataArray[i]["link"]["$t"]:dataArray[i]["url"]; 
            if (dataArray[i]['promotionalMedia']['__typename'] !== "Image") {}     
        }
    }
}


function goFailsafe(){
    try{window.clearTimeout(feedCallBackFailsafeTimer);}catch(err){};
    document.getElementById("contentContainer").style.display = "none";
    document.getElementById("failsafeContainer").style.display = "block";
    document.getElementById("failsafeContainer").style.visibility = "visible";
    document.getElementById("failsafeContainer").addEventListener("click", onFailsafeClk, false);
    document.getElementById("mobileFailsafe").style.backgroundImage = "url(" + creativeConfigObj.failsafeMobileImageURL + ")";
    document.getElementById("desktopFailsafe").style.backgroundImage = "url(" + creativeConfigObj.failsafeDesktopImageURL + ")";
    document.getElementById("desktopFailsafe").style.backgroundPosition = "center";
}

function goCreative(){
    document.getElementById("contentContainer").style.display = "block";
    setCreativeElements();
    positionCreativeElements();
    addEventListeners();

}


function setCreativeElements(){createFrames(creativeConfigObj.heroFrame, creativeConfigObj.articleFrames);}

function positionCreativeElements(){
    window.setTimeout(function(e){
        trimAllCopyOfClass("article_headline", 4);
        trimAllCopyOfClass("article_descriptor", 2);
    }, 10);
}

function trimAllCopyOfClass(clsName, maxLines){
    var clsArr = document.getElementsByClassName(clsName);
    for (var i=0; i<clsArr.length; i++){
        trimCopy(clsArr[i], maxLines);
    }
}

function trimCopy(div, maxLines){
    // Breakout counter to aviod getting stuck in while statement
    var breakOutCounter = 0;
    var breakOutCount = 1000;

    var maxHeight = null;

    var divWidth = div.offsetWidth;
    var divHeight = div.offsetHeight;
    var divStyles = window.getComputedStyle(div);
    var divCopy = div.innerHTML;

    // Create dummy copy using samefont/text styles to measure actual height of a single line on stage
    var dummyDiv = document.createElement("div");
    dummyDiv.id = "testDiv";
    dummyDiv.innerHTML = "TEST";
    dummyDiv.style.position = "absolute";
    dummyDiv.style.top = "-1000%";
    dummyDiv.style.left = "-1000%";
    dummyDiv.style.visibility = "hidden";
    dummyDiv.style.fontFamily = divStyles["font-family"];
    dummyDiv.style.fontSize = divStyles["font-size"];
    dummyDiv.style.lineHeight = divStyles["line-height"];
    dummyDiv.style.letterSpacing = divStyles["letter-spacing"];
    dummyDiv.style.wordSpacing = divStyles["word-spacing"];
    dummyDiv.style.textDecoration = divStyles["text-decoration"];
    dummyDiv.style.fontStyle = divStyles["font-style"];
    dummyDiv.style.fontWeight = divStyles["font-weight"];
    div.parentNode.appendChild(dummyDiv);

    // Set max height (line height x total lines)
    maxHeight = (dummyDiv.offsetHeight * maxLines);

    // If copy exceeds max height start taking off one letter at a time untill acceptable height is acheived
    if(divHeight > maxHeight){
        while(divHeight > maxHeight){
            divCopy = div.innerHTML = divCopy.substring(0, (divCopy.length - 1));
            divHeight = div.offsetHeight;

            breakOutCounter++;
            if(breakOutCounter >= breakOutCount){
                console.log("trimCopy function error.  Function exited.");
                break;
            }
        }

        // Trim whitespace and add ellipses
        div.innerHTML = divCopy.trim() + "...";
        divHeight = div.offsetHeight;

        // Reset breakout counter and reduce breakout count as max char overage should not exceed the 3 added characters
        breakOutCounter = 0;
        breakOutCount = 4;

        // If additional characters pushed height over the limit repeat trim & measure again untill acceptable height is acheived
        if(divHeight > maxHeight){
            while(divHeight > maxHeight){
                divCopy = div.innerHTML = divCopy.substring(0, (divCopy.length - 4)).trim() + "...";
                divHeight = div.offsetHeight;

                breakOutCounter++;
                if(breakOutCounter >= breakOutCount){
                    console.log("trimCopy function error.  Function exited.");
                    break;
                }
            }
        }
    }
}

function addEventListeners(){
    document.getElementById("desktopLeftArrowBtn").addEventListener("mouseenter", showDesktopLeftNav, false);
    document.getElementById("desktopLeftArrowBtn").addEventListener("click", onDesktopLeftArrowClk, false);
    document.getElementById("desktopRightArrowBtn").addEventListener("click", onDesktopRightArrowClk, false);

    var bgClks = document.getElementsByClassName("genClk");
    for(var i=0; i<bgClks.length; i++){ bgClks[i].addEventListener("click", onBgClk, false); }
}


function createFrames(heroFrameObj, articleFramesObj){
    console.log(articleFramesObj);
    createFramesDesktop(heroFrameObj, articleFramesObj);
}


function createFramesDesktop (heroFrameObj, articleFramesObj) {
    console.group("createSlideshow");
    var frameNum = 0;
    document.getElementById("desktopHeroContainer").appendChild(createHeroFrame(frameNum, "desktop", heroFrameObj.backgroundImageURL.desktop, heroFrameObj.kicker, heroFrameObj.headline, heroFrameObj.descriptor, heroFrameObj.logo));
    for(var i=0; i< articleFramesObj.length; i++){
        frameNum++;
        document.getElementById("desktopGallery").appendChild(createArticleFrame(frameNum, "desktop", articleFramesObj[i].kicker, articleFramesObj[i].headline, articleFramesObj[i].descriptor,  articleFramesObj[i].cta, articleFramesObj[i].logo));
    }

    desktopTotalGalleryFrames = frameNum;
    populateDesktopGalleryFramePosArr(desktopTotalGalleryFrames);
  
    $('#desktopGallery').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 850,
                settings: {
                    slidesToShow: 1,
                    dots: true
                }
            }
        ]
    });


}



function populateDesktopGalleryFramePosArr(totalNumFrames){
    for(var i=0; i<totalNumFrames; i++){desktopGalleryFramePosArr.push("desktop_frame_" + (i+1));}
    updateDesktopGalleryPosTrackerArr("prev");
    console.log(desktopGalleryFramePosArr);
}

function createHeroFrame(frameNum, layout, bgImgURL, kicker, headline, descriptor, logo){
    var frame = document.createElement("div");
    frame.id = layout + "_frame_" + frameNum;
    frame.className = "hero";
    frame.style.backgroundImage = "url(" + bgImgURL + ")";
    frame.style.width = "100%";

    var frameGrad = document.createElement("div");
    frameGrad.id = layout + "_frame_" + frameNum + "_grad";
    frameGrad.className = "grad";
    frame.appendChild(frameGrad);

    var frameCopyContainer = document.createElement("div");
    frameCopyContainer.id = layout + "_frame_" + frameNum + "_copy_container";
    frameCopyContainer.className = "hero_copyContainer";
    frame.appendChild(frameCopyContainer);

    var frameKicker = document.createElement("div");
    frameKicker.id = layout + "_frame_" + frameNum + "_kicker";
    frameKicker.className = "hero_kicker";
    frameKicker.innerHTML = kicker.copy;
    if(kicker.color !== "" && kicker.color !== null){frameKicker.style.color = kicker.color;}
    frameCopyContainer.appendChild(frameKicker);

    var frameHeadline = document.createElement("div");
    frameHeadline.id = layout + "_frame_" + frameNum + "_headline";
    frameHeadline.className = "hero_headline";
    frameHeadline.innerHTML = headline.copy;
    if(headline.color !== "" && headline.color !== null){frameHeadline.style.color = headline.color;}
    frameCopyContainer.appendChild(frameHeadline);

    if(descriptor !== "" && descriptor !== null){
        var frameDescriptor = document.createElement("div");
        frameDescriptor.id = layout + "_frame_" + frameNum + "_descriptor";
        frameDescriptor.className = "hero_descriptor";
        frameDescriptor.innerHTML = descriptor.copy;
        if(descriptor.color !== "" && descriptor.color !== null){frameDescriptor.style.color = descriptor.color;}
        frameCopyContainer.appendChild(frameDescriptor);
    }

    var frameClk = document.createElement("div");
    frameClk.id = layout + "_frame_" + frameNum + "_click";
    frameClk.className = "frameClk";
    if (layout === "mobile"){frameClk.addEventListener("click", onMobileFrameClk, false);}
    else {frameClk.addEventListener("click", onHeroFrameClk, false);}
    frame.appendChild(frameClk);

    var frameLogoContainer = document.createElement("div");
    frameLogoContainer.id = layout + "_frame_" + frameNum + "_logo";
    frameLogoContainer.className = "hero_logo";
    frameLogoContainer.addEventListener("click", onHeroLogoClk, false);
    frame.appendChild(frameLogoContainer);

    var frameLogo = document.createElement("img");
    frameLogo.id = layout + "_frame_" + frameNum + "_logoImg";
    frameLogo.src = logo.url;
    frameLogoContainer.appendChild(frameLogo);

    return frame;
}

function createArticleFrame(frameNum, layout, kicker, headline, descriptor, cta, logo){

    var frame = document.createElement("div");
    frame.id = layout + "_frame_" + frameNum;
    frame.className = "frame";
   
    var frameLogoContainer = document.createElement("div");
    frameLogoContainer.id = layout + "_frame_" + frameNum + "_logo";
    frameLogoContainer.className = "article_logo";
   // frameLogoContainer.style.height = (layout === "mobile")?logo.mobileHeight:logo.desktopHeight;
    frame.appendChild(frameLogoContainer);

    var frameLogo = document.createElement("img");
    frameLogo.id = layout + "_frame_" + frameNum + "_logoImg";
    frameLogo.className = "article_logoImg";
    frameLogo.src = logo.url;
  //  frameLogo.style.height = (layout === "mobile")?logo.mobileHeight:logo.desktopHeight;
    frameLogoContainer.appendChild(frameLogo);

    var frameCopyContainer = document.createElement("div");
    frameCopyContainer.id = layout + "_frame_" + frameNum + "_copy_container";
    frameCopyContainer.className = "article_copyContainer";
    //frameCopyContainer.style.maxHeight = "calc(100% - 68px - " + logo.height + ")"; // 68 = (25px margin top + 25px margin bottom + 18px spacing from logo bottom per comps)
    frame.appendChild(frameCopyContainer);

    var frameKicker = document.createElement("div");
    frameKicker.id = layout + "_frame_" + frameNum + "_kicker";
    frameKicker.className = "article_kicker";
    frameKicker.innerHTML = (layout === "mobile")?kicker.copy + " | The New York Times":"The New York Times";
    if(kicker.color !== "" && kicker.color !== null){frameKicker.style.color = kicker.color;}
    frameCopyContainer.appendChild(frameKicker);



    var frameHeadline = document.createElement("div");
    frameHeadline.id = layout + "_frame_" + frameNum + "_headline";
    frameHeadline.className = "article_headline";
    frameHeadline.innerHTML = headline.copy;
    if(headline.color !== "" && headline.color !== null){frameHeadline.style.color = headline.color;}
    frameCopyContainer.appendChild(frameHeadline);


    if(layout === "mobile" && descriptor !== "" && descriptor !== null && typeof descriptor !== "undefined"){
        var frameDescriptor = document.createElement("div");
        frameDescriptor.id = layout + "_frame_" + frameNum + "_descriptor";
        frameDescriptor.className = "article_descriptor";
        frameDescriptor.innerHTML = descriptor.copy;
        if(descriptor.color !== "" && descriptor.color !== null){frameDescriptor.style.color = descriptor.color;}
        frameCopyContainer.appendChild(frameDescriptor);
    }


    var frameClk = document.createElement("div");
    frameClk.id = layout + "_frame_" + frameNum + "_click";
    frameClk.className = "frameClk";
    if(layout === "mobile"){
        frameClk.addEventListener("click", onMobileFrameClk, false);
    }else{
        frameClk.addEventListener("click", function(e){
            onDesktopFrameClk(frameNum);
        }, false);
    }
    frame.appendChild(frameClk);

    var frameCta = document.createElement("div");
    frameCta.id = layout + "_frame_" + frameNum + "_cta";
    frameCta.className = "article_cta";
    frameCta.innerHTML = cta.copy;
    if(cta.color !== "" && cta.color !== null){frameCta.style.color = cta.color;}
    frameCopyContainer.appendChild(frameCta);

    return frame;
}



function setLeftNavActive(){
    document.getElementById("desktopLeftArrowContainer").style.display = "block"; 
    
}

function setLeftNavInactive(){
    document.getElementById("desktopLeftArrowContainer").style.display = "block"; 
    
}

function desktopGoPrevFrame(){
    var nextFrame = desktopCurrentGalleryFrame - 1;
	if(nextFrame < 1){nextFrame = desktopTotalGalleryFrames;}
	desktopCurrentGalleryFrame = nextFrame;
}


function desktopGoNextFrame(){
    var nextFrame = desktopCurrentGalleryFrame + 1;
    if(nextFrame > desktopTotalGalleryFrames){nextFrame = 1;}
    desktopCurrentGalleryFrame = nextFrame;
}


function updateDesktopGalleryPosTrackerArr(navDirection){
    var temp;

    if(navDirection === "next"){
        temp = desktopGalleryFramePosArr.shift();
        desktopGalleryFramePosArr.push(temp);
    }else if(navDirection === "prev"){
        temp = desktopGalleryFramePosArr.pop();
        desktopGalleryFramePosArr.unshift(temp);
    }else{
        console.log("updateDesktopGalleryPosTrackerArr \"navDirection\" parameter invalid!");
    }
}

function desktopGalleryAnimate(navDirection){

    var newStagePos = 0;    // calculated position to translate gallery frame to
    var arr = desktopGalleryFramePosArr;
    var travel = document.getElementById(arr[0]).offsetWidth;

    updateDesktopGalleryPosTrackerArr(navDirection);

    for(var i=0; i<arr.length; i++){
        newStagePos = (i-1);
        document.getElementById(arr[i]).style.zIndex = "10";

        if(navDirection === "next"){ if(newStagePos === arr.length-2) { document.getElementById(arr[i]).style.zIndex = "0"; } }
        else{ if(newStagePos === -1){ document.getElementById(arr[i]).style.zIndex = "0"; } }

        setNewPos(arr[i], newStagePos);
    }

    function setNewPos(elemID, pos){
        var elem = document.getElementById(elemID);
        if(pos === 0 || pos === 1){
            elem.addEventListener("mouseenter", showDesktopLeftNav, false);
            elem.addEventListener("mouseleave", hideDesktopLeftNav, false);
            elem.setAttribute("activateNavigationArrow", "true");
        }
        else if(elem.getAttribute("activateNavigationArrow") === "true"){
            elem.setAttribute("activateNavigationArrow", "false");
            elem.removeEventListener("mouseenter", showDesktopLeftNav, false);
        }
    }

}



/*-----> TRACKING <-----*/
function fireNounTracking(interaction, noun){
    // MDX 2.0 and MDX NXT use different noun tracking URLs
    // The below will auto detect which platform the unit is running and set the appropriate base URL
    var isNXT = (adId.toString().length >= 10);
    var baseURL = (isNXT)?"https://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=tf&c=19&mc=imp&pli=16478984&PluID=0&ord=%time%&rtu=-1&pcp=$$adID=" 
    + adId 
    + "|vId=" 
    + versionID 
    + "|interactionName=" : "https://bs.serving-sys.com/Serving/adServer.bs?cn=display&c=19&pli=1073952795&adid=1073972634&ord=[timestamp]&rtu=-1&pcp=$$adID=" 
    + adId 
    + "|vID=" 
    + versionID 
    + "|interactionName=";

    var pixel = new Image();
    pixel.src = baseURL + interaction + "|noun=" + noun + "$$";

    try{
        if(localPreview === true){
            console.log(baseURL + interaction + "|noun=" + noun + "$$");
        }
    }catch(err){}
}

/*-----------------------------*/
/*-----> EVENT LISTENERS <-----*/
/*-----------------------------*/
function showDesktopLeftNav(e){
    setLeftNavActive();
}

function hideDesktopLeftNav(e){
    setLeftNavActive();
}


function onDesktopLeftArrowClk(e){
    console.log("nav left");
    window.EB.userActionCounter('Previous_Frame');
    $('#desktopGallery').slick("slickPrev");
}
function onDesktopRightArrowClk(e){
    console.log("nav right");
    window.EB.userActionCounter('Next_Frame');
  $('#desktopGallery').slick("slickNext");
}


/*-----> CLICK OUTS <-----*/
function onHeroLogoClk(e){
    EB.clickthrough('Hero_Logo_Click');
}

function onBgClk(e){
    EB.clickthrough('Background_Click');
}

function onHeroFrameClk(e){
    EB.clickthrough('Hero_Frame_Click');
}

function onFailsafeClk(e){
    EB.clickthrough('Failsafe_Click');
}

function onDesktopFrameClk(frameNum){
    switch(frameNum){
        case 1:
            fireNounTracking('Article_Frame_1_Click', creativeConfigObj.articleFrames[0].url);
            EB.clickthrough('Article_Frame_1_Click', creativeConfigObj.articleFrames[0].url);
            break;
        case 2:
            fireNounTracking('Article_Frame_2_Click', creativeConfigObj.articleFrames[1].url);
            EB.clickthrough('Article_Frame_2_Click', creativeConfigObj.articleFrames[1].url);
            break;
        case 3:
            fireNounTracking('Article_Frame_3_Click', creativeConfigObj.articleFrames[2].url);
            EB.clickthrough('Article_Frame_3_Click', creativeConfigObj.articleFrames[2].url);
            break;
        case 4:
            fireNounTracking('Article_Frame_4_Click', creativeConfigObj.articleFrames[3].url);
            EB.clickthrough('Article_Frame_4_Click', creativeConfigObj.articleFrames[3].url);
            break;
        case 5:
            fireNounTracking('Article_Frame_5_Click', creativeConfigObj.articleFrames[4].url);
            EB.clickthrough('Article_Frame_5_Click', creativeConfigObj.articleFrames[4].url);
            break;
        case 6:
            fireNounTracking('Article_Frame_6_Click', creativeConfigObj.articleFrames[5].url);
            EB.clickthrough('Article_Frame_6_Click', creativeConfigObj.articleFrames[5].url);
            break;
        default:
    }
}
//************** NOTE END **************//

// For use with IE 10 only
function onIE10LeftArrowContainerClk(e){
    onDesktopFrameClk(desktopCurrentGalleryFrame);
}


function verticalyAlignText(obj){
	var parentContainerHeight 	= obj.parentNode.offsetHeight;
	var copyContainerHeight		= obj.offsetHeight;
	var pushMargin				= Math.floor((parentContainerHeight-copyContainerHeight)/2) + 'px';
	obj.style.marginTop = pushMargin;
}


/*------------------------------*/
/*-----> BASE FORMAT CODE <-----*/
/*------------------------------*/
/*******************
UTILITIES
*******************/
function setCreativeVersion() {
	sendMessage("setCreativeVersion", {
		creativeId: creativeId + " - " + templateName,
		creativeVersion: creativeVersion,
		creativeLastModified: lastModified,
		uid: uid
	});
}

function onPageScroll(event) {
	// use scrollPos anywhere to know the current x/y coordinates.
	scrollPos.x = event.scrollXPercent;
	scrollPos.y = event.scrollYPercent;
}

/*********************************
HTML5 Event System - Do Not Modify
*********************************/
var listenerQueue;
var creativeIFrameId;

function sendMessage(type, data) {
	//note: the message type we're sending is also the name of the function inside
	//		the custom script's messageHandlers object, so the case must match.

	if (!data.type) data.type = type;
	EB._sendMessage(type, data);
}

function addCustomScriptEventListener(eventName, callback, interAd) {
	listenerQueue = listenerQueue || {};
	var data = {
		uid: uid,
		listenerId: Math.ceil(Math.random() * 1000000000),
		eventName: eventName,
		interAd: !!(interAd),
		creativeIFrameId: creativeIFrameId
	};
	sendMessage("addCustomScriptEventListener", data);
	data.callback = callback;
	listenerQueue[data.listenerId] = data;
	return data.listenerId;
}

function dispatchCustomScriptEvent(eventName, params) {
	params = params || {};
	params.uid = uid;
	params.eventName = eventName;
	params.creativeIFrameId = creativeIFrameId;
	sendMessage("dispatchCustomScriptEvent", params);
}

function removeCustomScriptEventListener(listenerId) {
	var params = {
		uid: uid,
		listenerId: listenerId,
		creativeIFrameId: creativeIFrameId
	};

	sendMessage("removeCustomScriptEventListener", params);
	if (listenerQueue[listenerId])
		delete listenerQueue[listenerId];
}

function eventManager(event) {
	var msg;

	if (typeof event == "object" && event.data) {
		msg = JSON.parse(event.data);

	} else {
		// this is safe frame.
		msg = {
			type: event.type,
			data: event
		};
	}
	if (msg.type && msg.data && (!uid || (msg.data.uid && msg.data.uid == uid))) {
		switch (msg.type) {
			case "sendCreativeId":
				creativeIFrameId = msg.data.creativeIFrameId;
				addCustomScriptEventListener('pageScroll', onPageScroll);
				sendMessage("dispatchScrollPos", {
					uid: uid
				});
				if (creativeContainerReady)
					creativeContainerReady();
				break;
			case "eventCallback": // Handle Callback
				var list = msg.data.listenerIds;
				var length = list.length;
				for (var i = 0; i < length; i++) {
					try {
						var t = listenerQueue[list[i]];
						if (!t) continue;
						t.callback(msg.data);
					} catch (e) {}
				}
				break;
		}
	}
}







window.addEventListener("load", checkIfAdKitReady);

