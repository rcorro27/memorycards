const motifsCartes = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8]
let bestTime = 0
const max = 8
const messageWin = document.getElementById('winningMessage')
const timer = document.getElementById('temps')
let nbPairesTrouvees = 0
let cardFlipped = false
let blockFlip = false
let car1, car2
const textPairesTrouve = document.getElementById('pairesTrouver')
const textBestTime = document.getElementById('meilleurTemps')
const restart = document.getElementById('restartButton')
restart.addEventListener('click', restartFunction)
const imgSrc = document.getElementById('cardContainer').getElementsByClassName('card__face--back')
const imgInit = document.getElementById('cardContainer').getElementsByClassName('card__face--front')
const car = document.getElementById('cardContainer')
const card = document.getElementsByClassName('card')
const bouton = document.getElementsByClassName('btn')
bouton[0].addEventListener('click', showCartes)
let counterSec = 0
let counterMin = 0
let update = 0
const storageMinName = 'min'
const storageSecName = 'sec'
const minutesValue = readStorage(storageMinName)
const secondsValue = readStorage(storageSecName)

function shuffleCards (arrayNumbers) {
    for (let i = arrayNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = arrayNumbers[i]
        arrayNumbers[i] = arrayNumbers[j]
        arrayNumbers[j] = temp
    }
    return arrayNumbers
}
function showCartes () {
    shuffleCards(motifsCartes)
    for (let index = 0; index < imgInit.length; index++) {
        imgInit[index].src = 'photos/Car' + motifsCartes[index] + '.png '
        imgInit[index].setAttribute('alt', motifsCartes[index])
    }
    setTimeout(initialiserJeu, 3000)
}
function initialiserJeu () {
    if (minutesValue===null && secondsValue===null ) {
        textBestTime.innerHTML= 0
    }else{
    textBestTime.innerHTML = minutesValue + ' min ' + secondsValue + ' sec '
    }
    setup()
    bouton[0].innerHTML = 'Arreter Partie'
    bouton[0].addEventListener('click', arreterPartie)

    /* AJOUTER DES CHIFFRES ALEATOIRES AU SRC */
    for (let i = 0; i < imgSrc.length; i++) {
        imgInit[i].src = 'photos/Interrogation.png'
        imgInit[i].setAttribute('alt', 'meme1')
        imgSrc[i].src = 'photos/Car' + motifsCartes[i] + '.png '
        imgSrc[i].setAttribute('alt', motifsCartes[i])
        card[i].setAttribute('data-car', motifsCartes[i])
        card[i].addEventListener('click', flippe)
    }

    function flippe () {
        console.log(blockFlip)
        if (blockFlip) return
        /* console.log('this', this) ON PEUT EFFACER CA ???
        console.log('car1', car1) */
        if (this === car1) return
        this.classList.add('is-flipped')
        if (!cardFlipped) {
            cardFlipped = true
            car1 = this
        } else {
            cardFlipped = false
            car2 = this
            checkMatch()
        }
    }

    function checkMatch () {
        if (car1.dataset.car === car2.dataset.car) {
            car1.removeEventListener('click', flippe)
            car2.removeEventListener('click', flippe)
            nbPairesTrouvees = nbPairesTrouvees + 1
            textPairesTrouve.innerHTML = nbPairesTrouvees
            initialiserBoard()
        } else {
            removeFlip()
        }
    }
    function removeFlip () {
        blockFlip = true
        setTimeout(() => {
            car1.classList.remove('is-flipped')
            car2.classList.remove('is-flipped')
            initialiserBoard()
        }, 800)
    }
    function initialiserBoard () {
        blockFlip = false
        cardFlipped = false

        car1 = null
        car2 = null
    }
}
function setup () {
    function timeIt () {
        counterSec++

        if (counterSec < 60) {
            timer.innerHTML = counterMin + ' min ' + counterSec + ' sec '
        }

        if (counterSec > 60) {
            counterSec = 0
            counterMin++
        }

        if (nbPairesTrouvees === max) {
            clearInterval(update)

            if (counterMin < minutesValue || counterSec < secondsValue) {
                bestTime = timer.innerHTML
                createStorage(storageSecName, counterSec)
                createStorage(storageMinName, counterMin)
                document.getElementById('winning-text').innerHTML = 'Bravo Vous Avez Gagner </br>  Votre temps est ' + timer.innerHTML +
            '</br> Vous avez batttu le  Meilleur Temps '
            } else {
                bestTime = timer.innerHTML
                createStorage(storageMinName, counterMin)
                createStorage(storageSecName, counterSec)
                document.getElementById('winning-text').innerHTML = 'Bravo Vous Avez Gagner </br>  Votre temps est ' + timer.innerHTML + '</br> Meilleur Temps ' + bestTime
            }

            console.log(document.getElementById('winning-text'))

            document.getElementById('cardContainer').style.display = 'none'
            car.classList.add('hide')
            messageWin.classList.add('show')
        }
    }
    update = setInterval(timeIt, 1000)
}

function arreterPartie () {
    location.reload()
}
function createStorage (nom, value) {
    sessionStorage[nom] = value
}
function readStorage (nom) {
    const number = sessionStorage.getItem(nom)
    return number
}

function restartFunction () {
    clearInterval(update)
    document.getElementById('cardContainer').style.display = 'flex'
    document.getElementById('cardContainer').style.flexWrap = 'wrap'
    messageWin.classList.remove('show')
    location.reload()
}
