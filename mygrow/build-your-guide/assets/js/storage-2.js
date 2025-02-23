// Storage Service
const StorageService = {
  saveTable: (content) => {
    localStorage.setItem('page_html2', JSON.stringify(content));
  },

  loadTable: () => {
    return JSON.parse(localStorage.getItem('page_html2'));
  },

  getPlantStrain: () => {
    return localStorage.plant2Strain;
  },

  getPlantHeight: () => {
    return localStorage.plant2Height;
  },

  getPlantGrow: () => {
    return localStorage.plant2Grow;
  },

  getPlantWatts: () => {
    return localStorage.plant2watts;
  },

  getPlantLogo: () => {
    return localStorage.getItem('plant2Logo');
  },

  removeItem: (key) => {
    localStorage.removeItem(key);
  }
};
