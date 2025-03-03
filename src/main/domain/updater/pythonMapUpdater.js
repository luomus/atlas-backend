const InteractiveMapGenerator = require('../../../python/interactiveMapGenerator')

class PythonMapUpdater {
  constructor () {
    this.interactiveMapGenerator = new InteractiveMapGenerator();
  }

  async update () {
    console.log(new Date().toISOString(), ' ', 'Starting python map update');
    try {
      const map = await this.interactiveMapGenerator.getInteractiveMap();
      if (!map) {
        console.error('No python map data found');
      }
      console.log(new Date().toISOString(), ' ', 'Finished python map update');
    } catch (err) {
      console.error(new Date().toISOString(), ' ', 'Python map update error: ', err);
      throw err;
    }
  }
}

module.exports = PythonMapUpdater;