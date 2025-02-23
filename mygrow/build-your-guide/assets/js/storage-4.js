// Storage Service
const StorageService = {
  saveTable: (content) => {
    localStorage.setItem('page_html4', JSON.stringify(content));
  },

  loadTable: () => {
    return JSON.parse(localStorage.getItem('page_html4'));
  },

  getPlantStrain: () => {
    return localStorage.plant4Strain;
  },

  getPlantHeight: () => {
    return localStorage.plant4Height;
  },

  getPlantGrow: () => {
    return localStorage.plant4Grow;
  },

  getPlantWatts: () => {
    return localStorage.plant4watts;
  },

  getPlantLogo: () => {
    return localStorage.getItem('plant4Logo');
  },

  removeItem: (key) => {
    localStorage.removeItem(key);
  }
};
