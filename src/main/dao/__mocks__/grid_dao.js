class GridDao {
  #data

  constructor() {
    this.#data = [
      {
        'id': 661312,
        'coordinateN': 661,
        'coordinateE': 312,
        'municipality_id': 147,
        'gridName': 'Bogskär',
      },
      {
        'id': 663318,
        'coordinateN': 663,
        'coordinateE': 318,
        'municipality_id': 181,
        'gridName': 'Alu',
      },
      {
        'id': 663319,
        'coordinateN': 663,
        'coordinateE': 319,
        'municipality_id': 181,
        'gridName': 'Kalkskär',
      },
      {
        'id': 663320,
        'coordinateN': 663,
        'coordinateE': 320,
        'municipality_id': 181,
        'gridName': 'Flutun',
      },
      {
        'id': 663321,
        'coordinateN': 663,
        'coordinateE': 321,
        'municipality_id': 181,
        'gridName': 'Ståtbådarna',
      },
      {
        'id': 664318,
        'coordinateN': 664,
        'coordinateE': 318,
        'municipality_id': 181,
        'gridName': 'Utö',
      },
      {
        'id': 664329,
        'coordinateN': 664,
        'coordinateE': 329,
        'municipality_id': 279,
        'gridName': 'Älgö',
      },
      {
        'id': 667317,
        'coordinateN': 667,
        'coordinateE': 317,
        'municipality_id': 181,
        'gridName': 'Gråskär',
      },
      {
        'id': 667318,
        'coordinateN': 667,
        'coordinateE': 318,
        'municipality_id': 181,
        'gridName': 'Kälö',
      },
      {
        'id': 680320,
        'coordinateN': 680,
        'coordinateE': 320,
        'municipality_id': 181,
        'gridName': 'Sipoo',
      },
      {
        'id': 680330,
        'coordinateN': 680,
        'coordinateE': 330,
        'municipality_id': 183,
        'gridName': 'Espoo',
      },
      {
        'id': 683319,
        'coordinateN': 683,
        'coordinateE': 319,
        'municipality_id': 180,
        'gridName': 'Säpin länsiosa',
      },
      {
        'id': 766327,
        'coordinateN': 766,
        'coordinateE': 327,
        'municipality_id': 13,
        'gridName': 'Unkkavaara',
      },
      {
        'id': 768326,
        'coordinateN': 768,
        'coordinateE': 326,
        'municipality_id': 13,
        'gridName': 'Goddejássavri',
      },
      {
        'id': 769326,
        'coordinateN': 769,
        'coordinateE': 326,
        'municipality_id': 13,
        'gridName': 'Lossujärvi',
      },
      {
        'id': 769327,
        'coordinateN': 769,
        'coordinateE': 327,
        'municipality_id': 13,
        'gridName': 'Pitsusjärvi',
      },
      {
        'id': 773352,
        'coordinateN': 773,
        'coordinateE': 352,
        'municipality_id': 352,
        'gridName': 'Guorboaivi',
      },
    ]
  }

  getAll() {
    return Promise.resolve(this.#data)
  }
}

module.exports = GridDao
