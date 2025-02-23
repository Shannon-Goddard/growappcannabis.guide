// Storage Service
const StorageService = {
  saveTable: (content) => {
    localStorage.setItem('page_html3', JSON.stringify(content));
  },

  loadTable: () => {
    return JSON.parse(localStorage.getItem('page_html3'));
  },

  getPlantStrain: () => {
    return localStorage.plant3Strain;
  },

  getPlantHeight: () => {
    return localStorage.plant3Height;
  },

  getPlantGrow: () => {
    return localStorage.plant3Grow;
  },

  getPlantWatts: () => {
    return localStorage.plant3watts;
  },

  getPlantLogo: () => {
    return localStorage.getItem('plant3Logo');
  },

  removeItem: (key) => {
    localStorage.removeItem(key);
  }
};
