



// @codekit-prepend "slick.js"


var creativeId = "HTMLResponsiveRichMediaBanner";
var creativeVersion = "1.1.0";
var lastModified = "2017-02-07";
var lastUploaded = "2017-02-07";
var templateVersion = "2.0.24"; // sdf replace
var templateName = "cf_deluxe_banner_flex_frame_iq_1x1_" + creativeVersion + "_6266"; // cf_[format_name]_[template_name]_[wxh]_version_BlockID
var scrollPos = {x:undefined, y:undefined};
var adId, rnd, uid, versionID;

var feedCallBackFailsafeTimer; 
var failsafeDuration = 3000; 
var dataArray; 

var mobileTotalGalleryFrames;
var mobileCurrentGalleryFrame = 1;

var desktopTotalGalleryFrames;
var desktopCurrentGalleryFrame = 1;
var desktopGalleryFramePosArr = [];
var totalNumberOfItem;

var listenerQueue;
var creativeIFrameId;




function initializeCreative() {
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

function openURL (whichURL) {
    window.open(whichURL, "_blank");
}

function callAJAX(url, version){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){ if(this.readyState === 4){ if(this.status === 200){ if(version === "json"){ handleReturnedFeedData(JSON.parse(xhttp.responseText)); }
    else{ handleReturnedFeedData(xhttp.responseXML); } }else if(this.status >= 400){  goFailsafe();} } };
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
    if (data !== null && typeof data !== "undefined"){ populateConfigObjArticleFramesWithFeedData(data);} else{goFailsafe();}
}

function populateConfigObjArticleFramesWithFeedData(data) {
    console.log("populateConfigObjArticleFramesWithFeedData");
    var numberOfItem = data.data.anyWorks.length;
    totalNumberOfItem = numberOfItem;

    for (var i = 0; i < numberOfItem; i++) {
        creativeConfigObj.articleFrames[i].headline = {
            copy:data.data.anyWorks[i].promotionalHeadline, 
            color: "#FFF"
        };
        creativeConfigObj.articleFrames[i].headline
        creativeConfigObj.articleFrames[i].url = data.data.anyWorks[i].url;
        creativeConfigObj.articleFrames[i].logo.url = data.data.anyWorks[i].promotionalMedia.crops[0].renditions[0].url;
    }

    goCreative();
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
    console.log("goCreative");
    document.getElementById("contentContainer").style.display = "block";
    createFramesDesktop(creativeConfigObj.heroFrame, creativeConfigObj.articleFrames);
    document.getElementById("desktopLeftArrowBtn").addEventListener("mouseenter", showDesktopLeftNav, false);
    document.getElementById("desktopLeftArrowBtn").addEventListener("click", onDesktopLeftArrowClk, false);
    document.getElementById("desktopRightArrowBtn").addEventListener("click", onDesktopRightArrowClk, false);
}


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

        div.innerHTML = divCopy.trim() + "...";
        divHeight = div.offsetHeight;
        breakOutCounter = 0;
        breakOutCount = 4;

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



function createFramesDesktop (heroFrameObj, articleFramesObj) {
   
    var frameNum = 0;
    document.getElementById("desktopHeroContainer").appendChild(createHeroFrame(frameNum, "desktop", heroFrameObj.backgroundImageURL.desktop, heroFrameObj.kicker, heroFrameObj.headline, heroFrameObj.descriptor, heroFrameObj.logo));

    for(var i=0; i < totalNumberOfItem; i++){
        frameNum++;
        var createdFrame = createArticleFrame ({
            layout: "desktop",
            framenumber: frameNum,
            kicker: articleFramesObj[i].kicker,
            headline: articleFramesObj[i].headline,
            descriptor: articleFramesObj[i].descriptor,
            cta: articleFramesObj[i].cta,
            logo: articleFramesObj[i].logo,
            clickThrough: articleFramesObj[i].url
        });

        document.getElementById("desktopGallery").appendChild(createdFrame);
    }

    desktopTotalGalleryFrames = frameNum;
  
    $('#desktopGallery').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        draggable: false,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    dots: true
                }
            }
        ]
    });

    fixCloneEventListenerIssue ();
}

function fixCloneEventListenerIssue () {

    var clonedItems = document.getElementsByClassName("slick-cloned");
    console.log("number of cloned item: ",clonedItems.length);

    for (var i = 0; i < clonedItems.length; i++) {
        var currentItem = clonedItems[i].firstChild.firstChild;
        currentItem.addEventListener("click", articleClicked, false)
       // console.log(currentItem);
    }

 


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

   

    var frameLogoContainer = document.createElement("div");
    frameLogoContainer.id = layout + "_frame_" + frameNum + "_logo";
    frameLogoContainer.className = "hero_logo";
    frameLogoContainer.addEventListener("click", onHeroLogoClk, false);
    frame.appendChild(frameLogoContainer);

    var frameLogo = document.createElement("img");
    frameLogo.id = layout + "_frame_" + frameNum + "_logoImg";
    frameLogo.src = logo.url;
    frameLogoContainer.appendChild(frameLogo);

    if (frameNum == 0) {frame.addEventListener("click", onHeroFrameClk, false);}
    return frame;
}

function createArticleFrame(data){

    var layout = data.layout;
    var frameNum = data.framenumber;
    var kicker = data.kicker;
    var headline = data.headline;
    var descriptor = data.descriptor;
    var cta = data.cta;
    var logo = data.logo;
    var clickThrough = data.clickThrough;

    var frame = document.createElement("div");
    frame.id = layout + "_frame_" + frameNum;
    frame.className = "frame";


    frame.setAttribute('data-exit', clickThrough);
    frame.setAttribute('data-index-number', frameNum);
    //console.debug(event.target.dataset.indexNumber);    
   
    var frameLogoContainer = document.createElement("div");
    frameLogoContainer.id = layout + "_frame_" + frameNum + "_logo";
    frameLogoContainer.className = "article_logo";
    frame.appendChild(frameLogoContainer);

    var frameLogo = document.createElement("img");
    frameLogo.id = layout + "_frame_" + frameNum + "_logoImg";
    frameLogo.className = "article_logoImg";
    frameLogo.src = logo.url;
    frameLogoContainer.appendChild(frameLogo);

    var frameCopyContainer = document.createElement("div");
    frameCopyContainer.id = layout + "_frame_" + frameNum + "_copy_container";
    frameCopyContainer.className = "article_copyContainer";
    frame.appendChild(frameCopyContainer);

    var frameKicker = document.createElement("div");
    frameKicker.id = layout + "_frame_" + frameNum + "_kicker";
    frameKicker.className = "article_kicker";
    frameKicker.innerHTML = "The New York Times";
    if(kicker.color !== "" && kicker.color !== null){frameKicker.style.color = kicker.color;}
    frameCopyContainer.appendChild(frameKicker);

    var frameHeadline = document.createElement("div");
    frameHeadline.id = layout + "_frame_" + frameNum + "_headline";
    frameHeadline.className = "article_headline";
    frameHeadline.innerHTML = headline.copy;
    if(headline.color !== "" && headline.color !== null){frameHeadline.style.color = headline.color;}
    frameCopyContainer.appendChild(frameHeadline);

    frame.addEventListener("click", articleClicked, false);
    return frame;
}



function setLeftNavActive(){
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



function showDesktopLeftNav(e){
    setLeftNavActive();
}

function hideDesktopLeftNav(e){
    setLeftNavActive();
}

function showHideNav (what) {
    document.getElementById("desktopLeftArrowContainer").style.display = what;
    document.getElementById("desktopRightArrowContainer").style.display = what;
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

function articleClicked (event) {
   // console.log(event.target.dataset.exit);
    // console.log(event.target.id);
    var currentArticle = event.target.dataset.indexNumber;
    var clickThroughURL = event.target.dataset.exit

    if ( currentArticle == "1")         { window.EB.clickthrough('article-1-Click');}
    else if ( currentArticle == "2")    { window.EB.clickthrough('article-2-Click');}
    else if ( currentArticle == "3")    { window.EB.clickthrough('article-3-Click');}
    else if ( currentArticle == "4")    { window.EB.clickthrough('article-4-Click');}
    else if ( currentArticle == "5")    { window.EB.clickthrough('article-5-Click');}
    else if ( currentArticle == "6")    { window.EB.clickthrough('article-6-Click');}

    openURL (clickThroughURL);
}


function onHeroLogoClk(e){
    window.EB.clickthrough('Hero_Logo_Click');
}

function onBgClk(e){
    window.EB.clickthrough('Background_Click');
}

function onHeroFrameClk(e){
    console.log("hero clicked");
    window.EB.clickthrough('Hero_Frame_Click');
}

function onFailsafeClk(e){
    window.EB.clickthrough('Failsafe_Click');
}


function verticalyAlignText(obj){
	var parentContainerHeight 	= obj.parentNode.offsetHeight;
	var copyContainerHeight		= obj.offsetHeight;
	var pushMargin				= Math.floor((parentContainerHeight-copyContainerHeight)/2) + 'px';
	obj.style.marginTop = pushMargin;
}


function setCreativeVersion() {
	sendMessage("setCreativeVersion", {
		creativeId: creativeId + " - " + templateName,
		creativeVersion: creativeVersion,
		creativeLastModified: lastModified,
		uid: uid
	});
}

function onPageScroll(event) {
	scrollPos.x = event.scrollXPercent;
	scrollPos.y = event.scrollYPercent;
}


function sendMessage(type, data) {
	if (!data.type) data.type = type;
	window.EB._sendMessage(type, data);
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


window.addEventListener("load", checkIfAdKitReady);

