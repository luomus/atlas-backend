var observer = new MutationObserver(function(mutations) {
    if (document.getElementsByClassName("topbar-wrapper").length > 0) {
        const topBarWrapper = document.getElementsByClassName("topbar-wrapper")[0]
        topBarWrapper.getElementsByTagName("img")[0].src = "../images/atlas_api_logo.svg"
        topBarWrapper.getElementsByTagName("a")[0].href = "https://github.com/ATLAS-ohtuprojekti/ATLAS"
        const luomusLink = document.createElement("a")
        luomusLink.className = "luomus-link"
        luomusLink.href = "https://luomus.fi/en"
        const luomusLogo = document.createElement("img")
        luomusLogo.src = "../images/luomuslogo-white_en.png"
        luomusLogo.className = "luomus-logo"
        luomusLink.appendChild(luomusLogo)
        topBarWrapper.appendChild(luomusLink)
        observer.disconnect();
    }
});

observer.observe(document.getElementById("swagger-ui"),
    {attributes: false, childList: true, characterData: false, subtree:false})