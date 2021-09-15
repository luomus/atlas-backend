function BirdDao () {
    this.getBirds = () => JSON.stringify([
        {species: "Laji 1", prevalence: "Yleinen"},
        {species: "Laji 2", prevalence: "Harvinainen"},
        {species: "Laji 3", prevalence: "Superharvinainen"}
    ])
}

module.exports = new BirdDao()