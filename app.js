// const
const gameStatus = document.querySelector('.game-status')
const largeGameGrid = document.querySelector('.large-game-grid')
const startBtn = document.querySelector('.startBtn')
const resetBtn = document.querySelector('.resetBtn')
const width = 3
const grid = width * width
const winningPattern = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

// variables 
let x = 'X'
let o = 'O'
let player = x
let computer = o
let currentPlayer = x
const smallGameResultArray = []
const smallGameCells = []
const largeGameResultArray = Array(9).fill(null)
let activeLargeGameCellIndex = null
let running = false

// displayGrid for smaller games and large game

function displayGridLargeGame() {
    for (let i = 0; i < grid; i++) {
        const largeGameCell = document.createElement('div')
        largeGameCell.classList.add('largeGameCell')
        largeGameCell.setAttribute('large-game-data-index', i)
        largeGameCell.dataset.winner = ''

        const smallGameGrid = document.createElement('div')
        smallGameGrid.classList.add('small-game-grid')

        const smallGameResultArray = []

        for (let index = 0; index < grid; index++) {
            const smallGameCell = document.createElement('div')
            smallGameCell.classList.add('small-game-cell')
            smallGameCell.setAttribute('small-game-data-index', index)
            smallGameResultArray.push(smallGameCell)
            smallGameCell.addEventListener('click', (e) => handleCellClick(e, smallGameResultArray))
            smallGameGrid.appendChild(smallGameCell)
            smallGameCells.push(smallGameCell)
        }

        largeGameCell.appendChild(smallGameGrid)
        largeGameGrid.appendChild(largeGameCell)
    }
}

displayGridLargeGame()

//start game function

startBtn.addEventListener('click', startGame)
resetBtn.disabled = true

function startGame() {
    running = true
    gameStatus.textContent = `Player ${currentPlayer}, click any cell to begin your move!`
    startBtn.disabled = true
    resetBtn.disabled = false
}


// handleCellClick for the player (OMG!)

function handleCellClick(e) {
    const smallGameCellIndex = parseInt(e.target.getAttribute('small-game-data-index'))
    const largeGameCell = e.target.closest('.largeGameCell')
    const largeGameCellIndex = parseInt(largeGameCell.getAttribute('large-game-data-index'))

    if (largeGameCell.dataset.winner !== '' || !running || e.target.textContent !== '') {
        return
    }

    if (activeLargeGameCellIndex !== null && largeGameResultArray[activeLargeGameCellIndex] !== null) {
        activeLargeGameCellIndex = null
    }

    if (activeLargeGameCellIndex !== null && activeLargeGameCellIndex !== largeGameCellIndex) {
        return
    }

    e.target.textContent = currentPlayer

    const smallGameCells = Array.from(largeGameCell.querySelectorAll('.small-game-cell'))

    if (checkWinner(currentPlayer, smallGameCells)) {
        gameStatus.textContent = `Player ${currentPlayer} wins!`
        largeGameCell.dataset.winner = currentPlayer
        largeGameResultArray[largeGameCellIndex] = currentPlayer
        largeGameCell.classList.add('player-wins')
        if (!checkLargeGameWinner()) {
            activeLargeGameCellIndex = null
            currentPlayer = computer
            setTimeout(() => computerMove(), 2000)
        }
    } else if (smallGameCells.every(cell => cell.textContent !== '')) {
        gameStatus.textContent = `It's a draw!`
        largeGameCell.dataset.winner = 'draw'
        activeLargeGameCellIndex = null
        largeGameCell.classList.add('game-draw')
        if (!checkLargeGameWinner()) {
            currentPlayer = computer
            setTimeout(() => computerMove(), 2000)
        }
    }
    else {
        activeLargeGameCellIndex = smallGameCellIndex
        updateActiveLargeGameCell()
        currentPlayer = computer
        gameStatus.textContent = `It's Player ${currentPlayer}'s turn`
        setTimeout(() => computerMove(), 2000)
    }
}

// activelargeGameCell CSS for user experience 

function updateActiveLargeGameCell() {
    document.querySelectorAll('.largeGameCell').forEach(cell => cell.classList.remove('activeLargeGameCell'))
    if (activeLargeGameCellIndex !== null) {
        const cell = document.querySelector(`.largeGameCell[large-game-data-index="${activeLargeGameCellIndex}"]`);
        if (cell) cell.classList.add('activeLargeGameCell')
    }
}

//computerMove 

function computerMove() {
    let targetLargeGameCell = document.querySelector(`.largeGameCell[large-game-data-index="${activeLargeGameCellIndex}"]`)

    if (!running || !targetLargeGameCell || targetLargeGameCell.dataset.winner !== '') {

        const availableLargeGameCells = Array.from(document.querySelectorAll('.largeGameCell'))
            .filter(cell => cell.dataset.winner === '' && Array.from(cell.querySelectorAll('.small-game-cell')).some(cell => cell.textContent !== ''))

        if (availableLargeGameCells.length > 0) {
            targetLargeGameCell = availableLargeGameCells[Math.floor(Math.random() * availableLargeGameCells.length)]
        } else {
            gameStatus.textContent = `It's a draw! The ultimate tic-tac-toe ends in a tie.`
            running = false
            resetBtn.disabled = false
            return
        }
    }

    if (!targetLargeGameCell || targetLargeGameCell.dataset.winner !== '') {
        return
    }

    const smallGameCells = Array.from(targetLargeGameCell.querySelectorAll('.small-game-cell'))
    const availableSmallGameCells = smallGameCells.filter(cell => cell.textContent === '')

    if (availableSmallGameCells.length === 0) {
        return
    }

    const cell = availableSmallGameCells[Math.floor(Math.random() * availableSmallGameCells.length)]

    if (!cell) return

    cell.textContent = computer

    if (checkWinner(computer, smallGameCells)) {
        gameStatus.textContent = `Player O wins!`
        targetLargeGameCell.dataset.winner = computer
        largeGameResultArray[parseInt(targetLargeGameCell.getAttribute('large-game-data-index'))] = computer
        targetLargeGameCell.classList.add('computer-wins')
        if (!checkLargeGameWinner()) {
            activeLargeGameCellIndex = null
            currentPlayer = player
        }
    } else if (smallGameCells.every(cell => cell.textContent !== '')) {
        gameStatus.textContent = `It's a draw!`
        targetLargeGameCell.dataset.winner = 'draw'
        targetLargeGameCell.classList.add('game-draw')
        if (!checkLargeGameWinner()) {
            activeLargeGameCellIndex = null
            currentPlayer = player
        }
    } else {
        activeLargeGameCellIndex = parseInt(cell.getAttribute('small-game-data-index'))
        updateActiveLargeGameCell()
        currentPlayer = player
        gameStatus.textContent = `Player ${currentPlayer}'s turn`
    }

    if (!checkLargeGameWinner()) {
        activeLargeGameCellIndex = parseInt(cell.getAttribute('small-game-data-index'))
        updateActiveLargeGameCell()
        currentPlayer = player
    }

}

// smaller game - check winner

function checkWinner(currentPlayer, smallGameCells) {
    const win = winningPattern.some(combination => {
        return combination.every(index => {
            return smallGameCells[index].textContent === currentPlayer
        })
    })

    if (win) {
        const largeGameCell = smallGameCells[0].closest('.largeGameCell')
        largeGameCell.dataset.winner = currentPlayer
    }

    return win
}

//large game - check winner 

function checkLargeGameWinner() {
    const largeGameWin = winningPattern.some(pattern => {
        return pattern.every(index => {
            return largeGameResultArray[index] === currentPlayer;
        });
    });

    if (largeGameWin) {
        gameStatus.textContent = `Player ${currentPlayer} wins the ultimate tic-tac-toe!`
        running = false
    } else if (largeGameResultArray.every(result => result !== null)) {
        gameStatus.textContent = `It's a draw! The ultimate tic-tac-toe ends in a tie.`
        running = false
    }
    return largeGameWin
}

// Reset the game

resetBtn.addEventListener('click', () => {
    activeLargeGameCellIndex = null
    largeGameResultArray.fill(null)
    currentPlayer = x
    document.querySelectorAll('.largeGameCell').forEach(cell => {
        cell.dataset.winner = ''
        cell.classList.remove('player-wins', 'computer-wins', 'game-draw', 'activeLargeGameCell')
        cell.querySelectorAll('.small-game-cell').forEach(cell => cell.textContent = '')
    })
    startBtn.disabled = false
    resetBtn.disabled = true
    gameStatus.textContent = 'Game reset. Click Start button to begin.'
})



