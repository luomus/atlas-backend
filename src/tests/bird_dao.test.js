const bird_dao = require('../main/dao/bird_dao.js');

test('retuns a bird', () => {
    expect(bird_dao.getBirds()).toEqual(expec.anything());
});