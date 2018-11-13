/********************************************************************************************************************************************************************************/
/*                                                                                                                                                                              */
/*    ============                                                                                                                                                              */
/*    INSTRUCTIONS                                                                                                                                                              */
/*    ============                                                                                                                                                              */
/*                                                                                                                                                                              */
/*    - The templateSettings.js file must contain the templateSettings object only and be placed in the scripts folder of the template workspace.                               */
/*                                                                                                                                                                              */
/*    - The templateSettings object should be populated with all template specific variables desired and/or required for use with the current implementation of the template.   */
/*                                                                                                                                                                              */
/*    - Please refer to the template build guide for all available template specific variables, their accepted value, data type, description and default value if applicable.   */
/*      The build guide also documents which variables are option and which are mandatory.                                                                                      */
/*                                                                                                                                                                              */
/*    - Any unused variables should be set to null or omitted from the templateSettings object.                                                                                 */
/*                                                                                                                                                                              */
/*                                                                                                                                                                              */
/********************************************************************************************************************************************************************************/


var templateSettings = {

    tsBgBaseAssetPath: null,
    tsBgImgAll: "bgTile.png",
    tsBgImgDoubleMobileLandscape: "double_mobile_landscape_f1.png",
    tsBgImgDoubleMobileProtrait: "double_mobile_portrait_f1.png",
    tsBgImgDoubleTabletLandscape: "double_tablet_landscape_f1.png",
    tsBgImgDoubleTabletProtrait: "double_tablet_portrait_f1.png",
    tsBgImgIAB728x90: "iab728x90_all_f1.png",
    tsBgImgInterstitialMobileLandscape: "interstitial_mobile_landscape_f1.png",
    tsBgImgInterstitialMobileProtrait: "interstitial_mobile_portrait_f1.png",
    tsBgImgInterstitialTabletLandscape: "interstitial_tablet_landscape_f1.png",
    tsBgImgInterstitialTabletProtrait: "interstitial_tablet_portrait_f1.png",
    tsBgImgLandscape: "land.jpg",
    tsBgImgLargeMobileLandscape: "large_mobile_landscape_f1.png",
    tsBgImgLargeMobileProtrait: "large_mobile_portrait_f1.png",
    tsBgImgLargeTabletLandscape: "large_tablet_landscape_f1.png",
    tsBgImgLargeTabletProtrait: "large_tablet_portrait_f1.png",
    tsBgImgMRec: "mrec_all_f1.png",
    tsBgImgProtrait: "port.jpg",
    tsBgImgStandardMobileLandscape: "standard_mobile_landscape_f1.png",
    tsBgImgStandardMobileProtrait: "standard_mobile_portrait_f1.png",
    tsBgImgStandardTabletLandscape: "standard_tablet_landscape_f1.png",
    tsBgImgStandardTabletProtrait: "standard_tablet_portrait_f1.png",
    tsBgRule: "singlePerOrientationTile",
    tsBorderColor: "#000",
    tsCopy1: "Impressions That Inspire",
    tsCopy2: "<strong>Impressions That Inspire</strong><br><br>Connect to consumers with the largest independent buy-side platform.",
    tsCopy3: "<strong style=\"font-size: 1.25em; line-height: 1em;\">Impressions That Inspire</strong><br><br>Connect to consumers with the largest independent buy-side platform.",
    tsCopy4: "<strong>Impressions That Inspire</strong><br><br>At Sizmek, we believe creating impressions that inspire is vital to building meaningful, long-lasting relationships with your customers. We believe in solutions that help your data, creative and media work together for optimal campaign performance across the entire customer journey. We believe when your messages resonate, your impact amplifies, and your business reaches new heights.",
    tsCopy5: "<strong style=\"font-size: 1.5em; line-height: 1.25em;\">Impressions That Inspire</strong><br><br>At Sizmek, we believe creating impressions that inspire is vital to building meaningful, long-lasting relationships with your customers. We believe in solutions that help your data, creative and media work together for optimal campaign performance across the entire customer journey. We believe when your messages resonate, your impact amplifies, and your business reaches new heights.",
    tsCopy6: "<br><strong style=\"font-size: 2em; line-height: 1em;\">Impressions That Inspire</strong><br><br><span style=\"font-style: italic; font-size: 1.25em; line-height: 1em;\">Drive deeper connections,<br>get better results</span><br><br>At Sizmek, we believe creating impressions that inspire is vital to building meaningful, long-lasting relationships with your customers. We believe in solutions that help your data, creative and media work together for optimal campaign performance across the entire customer journey. We believe when your messages resonate, your impact amplifies, and your business reaches new heights.<br>",
    tsCopyAlignment: "center",
    tsCopyColor: "#FFF",
    tsCopyFontFamily: "Titillium-Regular",
    tsCtaBgColor: "rgba(0,0,0,0.5)",
    tsCtaBorderColor: "white",
    tsCtaCopy: "LEARN MORE",
    tsCtaCopyColor: "white",
    tsCtaFontFamily: null,
    tsLogoBaseAssetPath: "images/",
    tsLogoImg: "Sizmek_logo.png",
    tsNounTrackAdType: true,
    tsShowBorder: true,
    tsShowDynamicElements: true

};


// QA NOTE: The below is lft in for QA.  Comment out the object above and uncomment the below for the alternate version of this template.

// var templateSettings = {
//
//     tsBgBaseAssetPath: null,
//     tsBgImgAll: "bgTile.png",
//     tsBgImgDoubleMobileLandscape: "double_mobile_landscape_f1.png",
//     tsBgImgDoubleMobileProtrait: "double_mobile_portrait_f1.png",
//     tsBgImgDoubleTabletLandscape: "double_tablet_landscape_f1.png",
//     tsBgImgDoubleTabletProtrait: "double_tablet_portrait_f1.png",
//     tsBgImgIAB728x90: "iab728x90_all_f1.png",
//     tsBgImgInterstitialMobileLandscape: "interstitial_mobile_landscape_f1.png",
//     tsBgImgInterstitialMobileProtrait: "interstitial_mobile_portrait_f1.png",
//     tsBgImgInterstitialTabletLandscape: "interstitial_tablet_landscape_f1.png",
//     tsBgImgInterstitialTabletProtrait: "interstitial_tablet_portrait_f1.png",
//     tsBgImgLandscape: "land.jpg",
//     tsBgImgLargeMobileLandscape: "large_mobile_landscape_f1.png",
//     tsBgImgLargeMobileProtrait: "large_mobile_portrait_f1.png",
//     tsBgImgLargeTabletLandscape: "large_tablet_landscape_f1.png",
//     tsBgImgLargeTabletProtrait: "large_tablet_portrait_f1.png",
//     tsBgImgMRec: "mrec_all_f1.png",
//     tsBgImgProtrait: "port.jpg",
//     tsBgImgStandardMobileLandscape: "standard_mobile_landscape_f1.png",
//     tsBgImgStandardMobileProtrait: "standard_mobile_portrait_f1.png",
//     tsBgImgStandardTabletLandscape: "standard_tablet_landscape_f1.png",
//     tsBgImgStandardTabletProtrait: "standard_tablet_portrait_f1.png",
//     tsBgRule: "adTypeAndOrientationSpecific",
//     tsBorderColor: "#000",
//     tsCopy1: "Impressions That Inspire",
//     tsCopy2: "<strong>Impressions That Inspire</strong><br><br>Connect to consumers with the largest independent buy-side platform.",
//     tsCopy3: "<strong style=\"font-size: 1.25em; line-height: 1em;\">Impressions That Inspire</strong><br><br>Connect to consumers with the largest independent buy-side platform.",
//     tsCopy4: "<strong>Impressions That Inspire</strong><br><br>At Sizmek, we believe creating impressions that inspire is vital to building meaningful, long-lasting relationships with your customers. We believe in solutions that help your data, creative and media work together for optimal campaign performance across the entire customer journey. We believe when your messages resonate, your impact amplifies, and your business reaches new heights.",
//     tsCopy5: "<strong style=\"font-size: 1.5em; line-height: 1.25em;\">Impressions That Inspire</strong><br><br>At Sizmek, we believe creating impressions that inspire is vital to building meaningful, long-lasting relationships with your customers. We believe in solutions that help your data, creative and media work together for optimal campaign performance across the entire customer journey. We believe when your messages resonate, your impact amplifies, and your business reaches new heights.",
//     tsCopy6: "<br><strong style=\"font-size: 2em; line-height: 1em;\">Impressions That Inspire</strong><br><br><span style=\"font-style: italic; font-size: 1.25em; line-height: 1em;\">Drive deeper connections,<br>get better results</span><br><br>At Sizmek, we believe creating impressions that inspire is vital to building meaningful, long-lasting relationships with your customers. We believe in solutions that help your data, creative and media work together for optimal campaign performance across the entire customer journey. We believe when your messages resonate, your impact amplifies, and your business reaches new heights.<br>",
//     tsCopyAlignment: "center",
//     tsCopyColor: "#FFF",
//     tsCopyFontFamily: "Titillium-Regular",
//     tsCtaBgColor: "rgba(0,0,0,0.5)",
//     tsCtaBorderColor: "white",
//     tsCtaCopy: "LEARN MORE",
//     tsCtaCopyColor: "white",
//     tsCtaFontFamily: null,
//     tsLogoBaseAssetPath: "images/",
//     tsLogoImg: "Sizmek_logo.png",
//     tsNounTrackAdType: true,
//     tsShowBorder: true,
//     tsShowDynamicElements: null
//
// };
