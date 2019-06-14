let clickedSoundID
let clickedKeyID
let clickedSBID
let clickedOnSB
let clickedTarget
let userID

document.addEventListener('DOMContentLoaded', () => {
  const usersURL = 'http://localhost:3000/api/v1/users'

  const usernameField = document.querySelector('#usernameField')
  const loginBtn = document.querySelector('#loginBtn')
  const internal = document.querySelector('#internal')
  const splash = document.querySelector('#splash')
  const welcome = document.querySelector('#welcome')
  const newUserBtn = document.querySelector('#newUser')

  let loggedIn = true
  let allUsers = []



  fetch(usersURL,{})
  .then(obj => obj.json())
  .then(parsed => allUsers = parsed)

  newUserBtn.addEventListener('click', (e) => {
    fetch(usersURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        'username': usernameField.value
      })
    }).then(obj => obj.json())
    .then(parsed => allUsers.push(parsed))
  })

  loginBtn.addEventListener('click', (e) => {
    e.preventDefault()
    let usernames = allUsers.map(user => user.username)

    if (usernames.includes(usernameField.value)) {
      loggedIn = true
      let loggedInUser = allUsers.find(user => {
        return user.username == usernameField.value
      })
      userID = loggedInUser.id
      // debugger

      if (loggedIn) {
        internal.style.display = 'block'
        splash.style.display = 'none'
        welcome.innerText = `Welcome, ${usernameField.value}`
        usernameField.value = ""
        // -----------------
        const soundboardsURL = 'http://localhost:3000/api/v1/soundboards'
        const soundsURL = 'http://localhost:3000/api/v1/sounds'

        const logoutBtn = document.querySelector('#logoutBtn')
        const currentSBName = document.querySelector('#currentSBName')
        const soundboardDiv = document.querySelector('#soundboard')
        const audioDiv = document.querySelector('#audioDiv')
        const newSoundForm = document.querySelector('#newSoundForm')
        const soundList = document.querySelector('#soundList')
        const editBtn = document.querySelector('#editBtn')
        const saveBtn = document.querySelector('#saveBtn')
        const newBtn = document.querySelector('#newBtn')
        const newForm = document.querySelector('#newForm')
        const newName = document.querySelector('#newName')
        const savedSB = document.querySelector('#savedSB')
        const sbList = document.querySelector('#sbList')


        let newSoundName = document.querySelector('#newSoundName')
        let newSoundURL = document.querySelector('#newSoundURL')
        let newSB = false
        let allSoundboards = []

        newSoundForm.addEventListener('submit', (e) => {
          e.preventDefault()
          fetch(soundsURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({
              'name': newSoundName.value,
              'source': newSoundURL.value
            })
          }).then(obj => obj.json())
          .then(parsed => {
            soundList.innerHTML += makeSoundItem(parsed)
            audioDiv.innerHTML += addAudio(parsed)
            newSoundName.value = ''
            newSoundURL.value = ''
          })
        })

        fetch(soundsURL, {})
        .then(obj => obj.json())
        .then(parsed => {
          console.log(parsed)
          soundList.innerHTML = ''
          audioDiv.innerHTML = ''
          parsed.forEach(sound => {
            soundList.innerHTML += makeSoundItem(sound)
            audioDiv.innerHTML += addAudio(sound)
          })
        })

        makeSoundItem = (sound) => {
          return `
          <li data-id=${sound.id}>${sound.name}
          <br>
          <button data-id=${sound.id} data-action="play">Play</button>
          <button data-id=${sound.id} data-action="delete">Delete</button>
          </li>`
        }

        addAudio = (sound) => {
          return `<audio data-id=${sound.id}>
          <source src="${sound.source}" type="audio/wav">
          <source src="${sound.source}" type="audio/mp3">
          </audio>`
        }

        soundList.addEventListener('click', (e) => {
          clickedSoundID = e.target.dataset.id
          // debugger
          if (e.target.dataset.action === "play") {
            // debugger
            let currentAudio = audioDiv.querySelector(`audio[data-id="${clickedSoundID}"]`)
            currentAudio.currentTime = 0
            console.log(currentAudio)
            currentAudio.play()
          }
          else if (e.target.dataset.action === "delete") {
            e.target.parentElement.remove()
            fetch(`${soundsURL}/${clickedSoundID}`, {
              method: 'DELETE'
            })
          }
        })

        soundboardDiv.addEventListener('click', (e) => {
          clickedOnSB = true
          if (editBtn.dataset.action === "on") {
            if (e.target.id) {
              clickedKeyID = e.target.id
              console.log(clickedKeyID)
              e.target.dataset.id = clickedSoundID
            }
          }
        })

        document.addEventListener('click', (e) => {
          clickedTarget = e.target
          if (soundboardDiv.contains(e.target)) {
            clickedOnSB = true
          } else {
            clickedOnSB = false
          }
        })

        document.addEventListener('keypress', (e) => {
          if (clickedOnSB) {
            let keyName = e.key;
            let soundID = soundboard.querySelector(`#${keyName}`).dataset.id
            console.log(soundID)
            let myAudio = audioDiv.querySelector(`audio[data-id="${soundID}"]`)
            console.log(myAudio)
            myAudio.currentTime = 0
            myAudio.play()
          }
        })

        editBtn.addEventListener('click', (e) => {
          if (e.target.dataset.action === "off") {
            e.target.dataset.action = "on"
            e.target.innerText = "Edit: On"
          }
          else {
            e.target.dataset.action = "off"
            e.target.innerText = "Edit: Off"
          }
        })

        newBtn.addEventListener('click', () => {
          newSB = !newSB
          if (newSB) {
            newForm.style.display = 'block'
          } else {
            newForm.style.display = 'none'
          }
        })

        makeSoundboardItem = (soundboard) => {
          return `
          <li data-id=${soundboard.id}>
          <button data-id=${soundboard.id} data-action="soundboard">${soundboard.name}</button>
          <br>
          <button data-id=${soundboard.id} data-action="delete">Delete</button>
          </li>
          `
        }

        fetch(soundboardsURL, {})
        .then(obj => obj.json())
        .then(parsed => {
          allSoundboards = parsed
          sbList.innerHTML = ''
          parsed.forEach(soundboard => {
            if (soundboard.user_id == userID) {
              sbList.innerHTML += makeSoundboardItem(soundboard)
            }
          })
        })

        newForm.addEventListener('submit', (e) => {
          e.preventDefault()
          let soundboardEls = [].slice.call(soundboardDiv.querySelectorAll(".foo"))
          let dataIDs = soundboardEls.map(els => els.dataset.id)
          dataIDs.unshift("")
          currentSBName.innerText = newName.value
          // debugger
          fetch(soundboardsURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({
              'name': newName.value,
              'user_id': userID,
              'array': `${dataIDs}`
            })
          }).then(obj => obj.json())
          .then(parsed => {
            allSoundboards.push(parsed)
            sbList.innerHTML += makeSoundboardItem(parsed)
            // debugger
          })
        })

        saveBtn.addEventListener('click', (e)=>{
          let soundboardEls = [].slice.call(soundboardDiv.querySelectorAll(".foo"))
          let dataIDs = soundboardEls.map(els => els.dataset.id)
          dataIDs.unshift("")
          // debugger
          fetch(`${soundboardsURL}/${clickedSBID}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({
              'array': `${dataIDs}`
            })
          })
        })

        sbList.addEventListener('click', (e) => {
          let clickedSoundboard = allSoundboards.find(soundboard => {
            return soundboard.id == e.target.dataset.id
          })
          if (e.target.dataset.action === "soundboard") {
            clickedSBID = clickedSoundboard.id
            let soundboardEls = [].slice.call(soundboardDiv.querySelectorAll(".foo"))
            let i = 0
            soundboardEls.forEach(el => {
              let changeEl = document.querySelector(`#${el.id}`)
              changeEl.dataset.id = clickedSoundboard.array[i]
              ++i
            })
            currentSBName.innerText = e.target.innerText
          }
          else if (e.target.dataset.action === "delete") {
            e.target.parentElement.remove()
            fetch(`${soundboardsURL}/${clickedSoundboard.id}`, {
              method: 'DELETE'})
            }
          })

        logoutBtn.addEventListener('click', (e) => {
            loggedIn = false
            clickedSBID = null
            let soundboardEls = [].slice.call(soundboardDiv.querySelectorAll(".foo"))
            soundboardEls.forEach(el => {
              let changeEl = document.querySelector(`#${el.id}`)
              changeEl.dataset.id = null
            })
            currentSBName.innerText = 'Untitled'
            if (!loggedIn) {
              internal.style.display = 'none'
              // internal.innerHTML = ''
              splash.style.display = 'block'
            }
        })
      }
    }
  })




})
