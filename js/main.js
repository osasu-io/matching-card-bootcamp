let flippedCards = []; // store currently flipped cards
let matchedCards = []; // store indexes of matched cards
let cardsFromServer = []; // store the shuffled deck from the server

// Fetch cards from server when page loads
fetch('/api/cards')
  .then(function (response) {
    return response.json();
  })
  .then(function (cardArray) {
    cardsFromServer = cardArray;

    const board = document.getElementById('gameBoard');

    for (let i = 0; i < cardArray.length; i++) {
      let cardDiv = document.createElement('div');
      cardDiv.classList.add('card');
      cardDiv.setAttribute('data-index', i);
      cardDiv.textContent = '';

      // Add click event
      cardDiv.addEventListener('click', handleCardClick);

      board.appendChild(cardDiv);
    }
  });

// Function to handle card clicks
function handleCardClick(event) {
  const clickedCard = event.target;
  const cardIndex = clickedCard.getAttribute('data-index');

  // Don't allow clicking more than two or already matched
  if (
    flippedCards.length === 2 ||
    clickedCard.classList.contains('flipped') ||
    matchedCards.includes(cardIndex)
  ) {
    return;
  }

  // Show emoji and flip the card
  clickedCard.textContent = cardsFromServer[cardIndex];
  clickedCard.classList.add('flipped');

  // Save info about flipped card
  flippedCards.push({
    index: cardIndex,
    emoji: cardsFromServer[cardIndex],
    element: clickedCard
  });

  if (flippedCards.length === 2) {
    checkIfMatch();
  }
}

// Function to check if two flipped cards match
function checkIfMatch() {
  const firstCard = flippedCards[0];
  const secondCard = flippedCards[1];

  // If both cards show the same emoji
  if (
    firstCard.emoji === secondCard.emoji &&
    firstCard.index !== secondCard.index
  ) {
    matchedCards.push(firstCard.index);
    matchedCards.push(secondCard.index);

    firstCard.element.classList.add('matched');
    secondCard.element.classList.add('matched');

    flippedCards = [];

    // If all cards are matched
    if (matchedCards.length === cardsFromServer.length) {
      document.getElementById('message').textContent =
        '🎉 You matched all the cards!';
    }
  } else {
    // Flip cards back after delay
    setTimeout(function () {
      firstCard.element.textContent = '';
      secondCard.element.textContent = '';
      firstCard.element.classList.remove('flipped');
      secondCard.element.classList.remove('flipped');
      flippedCards = [];
    }, 1000);
  }
}
