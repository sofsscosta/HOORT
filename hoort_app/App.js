import React, { useState, useEffect } from 'react'
import {
  InitScreen, Landing, Login, Register, Header, Footer, Menu,
  Search, Detail, Results, Lands, CreateLand, PlantLand, Modal,
  CreateLandModal, Land, Calendar, EditProfile, CalendarModal,
  PlantNowModal
} from './components'
import logic from './logic'
import { isLoggedIn, retrieveUser } from './logic'
import config from './config'
import { AsyncStorage } from 'react-native'

logic.__context__.storage = AsyncStorage
logic.__context__.API_URL = config.API_URL

export default function App() {

  const [error, setError] = useState()
  const [view, setView] = useState('init')
  const [menu, setMenu] = useState(false)
  const [veggie, setVeggie] = useState(undefined)
  const [veggies, setVeggies] = useState(undefined)
  const [resultsType, setResultsType] = useState()
  const [lands, setLands] = useState()
  const [land, setLand] = useState()
  const [landForModal, setLandForModal] = useState()
  const [modal, setModal] = useState(false)
  const [createLandModal, setCreateLandModal] = useState(false)
  const [calendarModal, setCalendarModal] = useState(false)
  const [plantNowModal, setPlantNowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState()
  const [calendarModalInfo, setCalendarModalInfo] = useState()
  const [modalType, setModalType] = useState()
  const [newLandProps, setNewLandProps] = useState()
  const [coordinates, setCoordinates] = useState()
  const [user, setUser] = useState()

  useEffect(() => {
    (async () => {
      try {
        let token = await isLoggedIn()
        if (token !== null) {

          let _user = await retrieveUser()
          setUser(_user)
        }
      } catch (error) {
        return setError(error.message)
      }
    })()
  }, [])


  function handleStart() {
    setMenu(false)
    setView('start')
  }

  function handleGoToRegister() {
    setMenu(false)
    setView('register')
  }

  function handleGoToLogin() {
    setMenu(false)
    setView('login')
  }

  function handleGoToLanding() {
    setMenu(false)
    setView('start')
  }

  const handleMenu = () => {
    !menu ? setMenu(true) : setMenu(false)
  }

  function handleGoToMyLands(userLands, _error) {
    menu ? setMenu(false) : ''
    setError(undefined)

    _error && setError(_error)

    userLands && setLands(userLands)
    setView('myLands')
  }

  function handleGoToMyVeggies(userVeggies, _error) {
    setMenu(false)
    setError(undefined)

    _error && setError(_error)
    setView('userVeggies')
    setVeggies(userVeggies)
    setResultsType('myVeggies')
  }

  function handleGoToCalendar() {
    setMenu(false)
    setError(undefined)
    setCalendarModal(false)
    setView('calendar')
  }

  function handleGoToCalendarModal(name, month, lands) {
    setCalendarModalInfo({ lands, name, month })
    !calendarModal ? setCalendarModal(true) : setCalendarModal(false)
  }

  function handleGoToEditProfile() {
    setMenu(false)
    setView('editProfile')
  }

  function handleGoToSearch() {
    setMenu(false)
    setView('search')
  }

  function handleGoToSuggestions(suggestedVeggies, _error) {
    setMenu(false)
    setError(undefined)
    _error && setError(_error)
    setView('userVeggies')
    setVeggies(suggestedVeggies)
    setResultsType('suggested')
  }

  function handleGoToTutorial() {

  }

  function handleGoToDetail(veggie) {
    setMenu(false)
    setError(undefined)
    setVeggie(veggie)
    setView('detail')
  }

  function handleGoToCreateLand(props) {
    setCreateLandModal(false)
    setMenu(false)
    setError(undefined)
    if (props) {
      setNewLandProps(props)
      handleCreateLandModal()
      setView('createLand')
    }
    else {
      setView('createLand')
    }
  }

  function handleGoToPlantLand(land) {
    setMenu(false)
    setError(undefined)
    setPlantNowModal(false)
    setLand(land)
    setView('plantLand')
  }

  function handleGoToPlantNowModal(_land) {
    setLandForModal(_land)
    !plantNowModal ? setPlantNowModal(true) : setPlantNowModal(false)
  }

  function handleModal(veg, _land, type, _coordinates, ) {
    setMenu(false)
    setError(undefined)
    setVeggie(veg)
    setLandForModal(_land)
    setModalType(type)
    setCoordinates(_coordinates)
    !modal ? setModal(true) : setModal(false)
  }

  function handleCreateLandModal(_error) {
    _error && setError(_error)
    !createLandModal ? setCreateLandModal(true) : setCreateLandModal(false)
  }

  function handleGoToRetrievedLand(land, ) {
    setMenu(false)
    setError(undefined)
    setLand(land)
    setView('land')
  }

  function handleSetSelectedItem(veg) {
    setSelectedItem(veg)
  }

  return (
    <>
      {view === 'init' && <InitScreen start={handleStart} />}
      {view === 'createLand' && createLandModal && <CreateLandModal onBackgroundClick={handleGoToMyLands} goToCreateLand={handleGoToCreateLand} />}
      {view === 'calendar' && calendarModal && <CalendarModal modalInfo={calendarModalInfo} onBackgroundClick={handleGoToCalendarModal} goToLandDetails={handleGoToRetrievedLand} />}
      {view === 'plantLand' && plantNowModal && <PlantNowModal onBackgroundClick={handleGoToPlantLand} land={landForModal} selectItem={handleSetSelectedItem} />}
      {view !== 'init' && view !== 'landing' && modal && <Modal onBackgroundClick={handleModal} veggie={veggie} type={modalType} land={landForModal} unitPressed={coordinates} />}
      {menu && <Menu goToMyLands={handleGoToMyLands} goToMyVeggies={handleGoToMyVeggies} goToCalendar={handleGoToCalendar} goToEditProfile={handleGoToEditProfile} goToSearch={handleGoToSearch} goToSuggestions={handleGoToSuggestions} goToTutorial={handleGoToTutorial} goToLanding={handleGoToLanding} menu={handleMenu} />}
      {view !== 'init' && < Header goToLanding={handleGoToLanding} menuClick={handleMenu} goToMyVeggies={handleGoToMyVeggies} />}
      {view === 'start' && <Landing goToRegister={handleGoToRegister} goToMyLands={handleGoToMyLands} fromMenu={menu} />}
      {view === 'register' && <Register goToLogin={handleGoToLogin} />}
      {view === 'login' && <Login goToRegister={handleGoToRegister} goToLanding={handleGoToLanding} />}
      {view === 'editProfile' && <EditProfile />}
      {view === 'search' && <Search goToDetail={handleGoToDetail} />}
      {view === 'myLands' && <Lands goToLandDetail={handleGoToRetrievedLand} goToCreateLand={handleGoToCreateLand} lands={lands} _error={error} />}
      {view === 'userVeggies' && <Results goToDetail={handleGoToDetail} results={veggies} resultsType={resultsType} _error={error} />}
      {view === 'createLand' && <CreateLand goToPlantLand={handleGoToPlantLand} initModal={handleCreateLandModal} newLandProps={newLandProps} _error={error} />}
      {view === 'plantLand' && <PlantLand land={land} onClickVeggie={handleModal} updatedLand={landForModal} submit={handleGoToRetrievedLand} goToPlantNow={handleGoToPlantNowModal} selectedVeg={selectedItem} />}
      {view === 'land' && <Land landFromMyLands={land} landFromPlantLand={landForModal} submit={handleGoToMyLands} goToPlantLand={handleGoToPlantLand} />}
      {view === 'calendar' && <Calendar goToCalendarModal={handleGoToCalendarModal} />}
      {view === 'detail' && <Detail item={veggie} goToLandDetail={handleGoToRetrievedLand} />}
      {view !== 'init' && <Footer view={view} />}
    </>
  )
}