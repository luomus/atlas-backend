/*
DOM-manipulaatio tehty näillä ohjeilla: 
https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents
https://developer.mozilla.org/en-US/docs/Web/API/Document/createDocumentFragment
HTTP-pyynnöt näillä ohjeilla:
https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
*/


//Kun selain on ladannut, niin tallennetaan SVG-kartta selaimen globaaliin muuttujaan svgMap
//ja tehdään HTTP GET pyyntö lintujen lataamiseksi APIsta
window.onload = function () {
    window.svgMap = document.getElementById("map-of-finland").getSVGDocument()
    makeGetRequest("/api/get-birds", loadBirds)
}

function loadBirds(responseText) {
    const birds = JSON.parse(responseText)
    const birdRows = birds.map(toBirdRow)
    var fragment = document.createDocumentFragment()
    birdRows.forEach(birdRow => fragment.appendChild(birdRow))
    document.getElementById('bird-rows').appendChild(fragment)
}

function toBirdRow(bird) {
    const speciesCell = document.createElement('td')
    const prevalenceCell = document.createElement('td')
    speciesCell.textContent = bird.species
    prevalenceCell.textContent = bird.prevalence
    const tableRow = document.createElement('tr')
    tableRow.appendChild(speciesCell)
    tableRow.appendChild(prevalenceCell)
    tableRow.addEventListener('click', () => changeMapData(bird))
    return tableRow
}

function changeMapData(bird) {
    svgMap.getElementById("species-map-name").textContent = bird.species
    svgMap.querySelectorAll(".prevalence-area[visibility='visible']")
        .forEach(e => e.setAttribute('visibility', 'hidden'))
    svgMap.getElementById(bird.prevalence).setAttribute('visibility', 'visible')
}

function makeGetRequest(URL, callbackFunction) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', URL)
    xhr.onload = function () {
        if (xhr.status === 200) callbackFunction(xhr.responseText)
        else alert('Request to ' + URL + ' failed.  Returned status of ' + xhr.status)
    }
    xhr.send()
}