const context = require('./context')

module.exports = {
    get __context__() { return context },
    registerUser: require('./register-user'),
    authenticateUser: require('./authenticate-user'),
    retrieveUser: require('./retrieve-user'),
    isLoggedIn: require('./is-logged-in'),
    logout: require('./logout'),
    searchItems: require('./search-items'),
    retrieveItem: require('./retrieve-item'),
    retrieveItemForUser: require('./retrieve-item-for-user'),
    retrieveUserVeggies: require('./retrieve-user-veggies'),
    searchSuggested: require('./search-suggested'),
    retrieveUserLands: require('./retrieve-user-lands'),
    retrieveLand: require('./retrieve-land'),
    createLand: require('./create-land'),
    changeDivisions: require('./change-divisions'),
    retrieveAll: require('./retrieve-all'),
    plantInLand: require('./plant-in-land'),
    updateLandAddVeggie: require('./update-land-add-veggie'),
    updateLandPlantVeggie: require('./update-land-plant-veggie'),
    updateLandHarvestVeggie: require('./update-land-harvest-veggie'),
    deleteVeggieFromLand: require('./delete-veggie-from-land'),
    deleteLand: require('./delete-land'),
    retrieveUserPlantations: require('./retrieve-user-plantations'),
    updateUser: require('./update-user'),
    createItem: require('./create-item-for-testing')
}