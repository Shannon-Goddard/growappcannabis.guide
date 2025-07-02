const StorageService = {
    getPlantStrain: function() {
        return localStorage.getItem('plantStrain') || '';
    },
    getPlantHeight: function() {
        return localStorage.getItem('plantHeight') || '';
    },
    getPlantLogo: function() {
        return localStorage.getItem('plantLogo') || '';
    },
    getPlantGrow: function() {
        return localStorage.getItem('plantGrow') || '';
    },
    getPlantWatts: function() {
        return localStorage.getItem('plantwatts') || '';
    },
    removeItem: function(key) {
        localStorage.removeItem(key);
    }
};

window.StorageService = StorageService;