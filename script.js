const gameContainer = document.getElementById('game');
const bestScore = document.querySelector('#bestScore');
const startGame = document.querySelector('#startGame');
const newGame = document.querySelector('#newGame');
const cardForm = document.querySelector('#cardform');
const numCards = document.querySelector('#numCards');
const COLORS = [];

// const COLORS = [
// 	'rgb(90,150,120)',
// 	'blue',
// 	'green',
// 	'orange',
// 	'purple',
// 	'rgb(90,150,120)',
// 	'blue',
// 	'green',
// 	'orange',
// 	'purple'
// ];
let card1;
let card2;
let cardOneColor;
let cardTwoColor;
let guessCount = 0;
let cardsMatched = 0;
let gameStarted = false;
let cardsInGame = 10;
let totalCards = 10;

let cardCount = 0;
// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
	let counter = array.length;

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		let index = Math.floor(Math.random() * counter);

		// Decrease counter by 1
		counter--;

		// And swap the last element with it
		let temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
	for (let color of colorArray) {
		// create a new div
		const newDiv = document.createElement('div');

		// give it a class attribute for the value we are looping over
		console.log('color being assigned ', color);
		newDiv.classList.add(color);

		// call a function handleCardClick when a div is clicked on
		newDiv.addEventListener('click', handleCardClick);

		// append the div to the element with an id of game
		gameContainer.append(newDiv);
	}
}

let lsGuessCount = localStorage.getItem('memoryGame');
if (lsGuessCount !== null) {
	lsGuessCount = parseInt(lsGuessCount);
	bestScore.innerText = lsGuessCount;
} else {
	lsGuessCount = 0;
	bestScore.innerText = 0;
}

startGame.addEventListener('click', function(e) {
	console.log('game started');
	gameStarted = true;
});

newGame.addEventListener('click', function(e) {
	if (cardsMatched === totalCards) {
		window.location.reload(false);
	}
});

cardForm.addEventListener('submit', function(e) {
	e.preventDefault();
	if (gameStarted === true) {
		return;
	}
	cardsInGame = parseInt(numCards.value);
	if (cardsInGame >= 10 && cardsInGame <= 50) {
		if (cardsInGame % 2 !== 0) {
			cardsInGame--;
			numCards.value = cardsInGame;
		}
	} else {
		numCards.value = 10;
	}

	removeCards(COLORS);
	generateColors();
	createDivsForColors(shuffledColors);
	totalCards = COLORS.length;
});

function generateColors() {
	for (let i = 0; i < cardsInGame / 2; i++) {
		cardColor = randomColor();
		for (let j = 0; j < i; j++) {
			while (COLORS[j] === cardColor) {
				cardColor = randomColor();
			}
		}
		COLORS[i] = cardColor;
		COLORS[cardsInGame / 2 + i] = cardColor;
	}
}

function randomColor() {
	let r = Math.floor(Math.random() * 256);
	let g = Math.floor(Math.random() * 256);
	let b = Math.floor(Math.random() * 256);
	return `rgb(${r},${g},${b})`;
}

function removeCards(colorArray) {
	const allCards = gameContainer.querySelectorAll('div');

	for (let card of allCards) {
		card.remove();
	}

	if (COLORS.length > cardsInGame) {
		for (let i = COLORS.length; i > cardsInGame; i--) {
			COLORS.pop();
		}
	}
}

// TODO: Implement this function!
function handleCardClick(event) {
	if (gameStarted === false) {
		return;
	}

	// you can use event.target to see which element was clicked
	if (event.target.style.backgroundColor !== '') {
		return;
	}

	cardCount++;
	if (cardCount === 1) {
		card1 = event.target;
		cardOneColor = card1.className;
		event.target.style.backgroundColor = cardOneColor;
	}

	if (cardCount > 2) {
		return;
	}

	if (cardCount === 2) {
		guessCount++;
		card2 = event.target;
		cardTwoColor = card2.className;
		event.target.style.backgroundColor = cardTwoColor;

		if (cardOneColor !== cardTwoColor) {
			setTimeout(function() {
				card1.style.backgroundColor = '';
				card2.style.backgroundColor = '';
				cardCount = 0;
			}, 1000);
		} else {
			cardCount = 0;
			cardsMatched += 2;
		}

		if (cardsMatched === totalCards) {
			if (lsGuessCount === 0 || guessCount < lsGuessCount) {
				localStorage.setItem('memoryGame', guessCount);
				bestScore.innerText = guessCount;
			}
		}
		return;
	}
}

generateColors();
// when the DOM loads
createDivsForColors(shuffledColors);
