'use script'


var gSafeClick = 3
var gLives = 3
var gInterval;
var gBoard
var gLevel = { SIZE: 4, MINES: 2 };
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }

//this function init the game and reset all the game details
function initGame() {
    clearInterval(gInterval)
    gGame.isOn = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gSafeClick = 3
    gLives = 3
    renderDetails()
    var elmodal = document.querySelector('.modal')
    elmodal.style.display = 'none'
    gBoard = buildBoard(gLevel.SIZE);
    renderBoard(gBoard)
}

//this function build your board
function buildBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false }
        }
    }
    // console.table(board)
    return board
}

//this function get you board acording to the level you choose
function getLevel(num) {
    gGame.isOn = false
    gLevel.SIZE = num
    if (num === 4) gLevel.MINES = 2
    if (num === 8) gLevel.MINES = 12
    if (num === 12) gLevel.MINES = 30
    initGame()

}

//this function is the body of the game check move, start timer, put mines, check victory.
function cellClicked(elCell, e) {
    var cell = elCell.id
    var rowIdx = +cell.substring(cell.indexOf('-') + 1, cell.length)
    var colIdx = +cell.substring(cell.indexOf(' ') + 1, cell.indexOf('-'))
    if (!gGame.isOn) {
        gInterval = setInterval(timer, 1000)
        createMines(colIdx, rowIdx)
    }
    gGame.isOn = true
    if (e.type === "contextmenu") {
        e.preventDefault()
        if (gBoard[colIdx][rowIdx].isShown) {
            return
        } else {
            getFlag(colIdx, rowIdx)
            checkVictory()
        }
    } else {
        if (gBoard[colIdx][rowIdx].isMine) {
            if (useLive()) {
                revealCell(colIdx, rowIdx)
            } else {
                gameOver()
            }
        }
        if (gBoard[colIdx][rowIdx].isShown) {
            return
        } else {
            revealCell(colIdx, rowIdx)
            checkVictory()
        }
    }
}

// this function execute game over
function gameOver() {
    clearInterval(gInterval)
    gGame.isOn = false
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMarked) continue
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true
                var cells = document.getElementById(`cell ${i}-${j}`)
                cells.innerText = 'X'
                cells.style.backgroundColor = 'red'
                document.querySelector('.smile').innerText = '☹'

                showModal('Game Over')
            }
        }
    }
}

//this function count the number of mines around
function setMinesNegsCount(colIdx, rowIdx) {
    for (var i = colIdx - 1; i <= colIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = rowIdx - 1; j <= rowIdx + 1; j++) {
            if (j < 0 || j > gBoard.length - 1) continue
            gBoard[i][j].minesAroundCount++
        }
    }
    return gBoard
}

//this function expand cells, update score, render to the document
function revealCell(colIdx, rowIdx) {
    if (gBoard[colIdx][rowIdx].isMarked) return
    if (gBoard[colIdx][rowIdx].minesAroundCount > 0) {
        renderRevealCell(colIdx, rowIdx)
        gBoard[colIdx][rowIdx].isShown = true
        updateScore()
        return
    }
    for (var i = colIdx - 1; i <= colIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = rowIdx - 1; j <= rowIdx + 1; j++) {
            if (j < 0 || j > gBoard.length - 1) continue
            if (gBoard[i][j].isMine) continue
            if (gBoard[i][j].isMarked) continue
            if (gBoard[i][j].isShown) continue
            if (gBoard[i][j].minesAroundCount === 0) {
                gBoard[i][j].isShown = true
                updateScore()
                renderRevealCell(i, j)
                revealCell(i, j)
            } else {
                gBoard[i][j].isShown = true
                updateScore()
                renderRevealCell(i, j)
            }
        }
    }
}

//this function execute render cells
function renderRevealCell(i, j) {
    var cells = document.getElementById(`cell ${i}-${j}`)
    if (gBoard[i][j].isMine) {
        cells.innerText = 'X'
    } else {
        cells.innerText = gBoard[i][j].minesAroundCount
    }
    cells.style.backgroundColor = 'white'
}

//this function check if mark, mark cell, render
function getFlag(i, j) {
    var cells = document.getElementById(`cell ${i}-${j}`)
    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false
        gGame.markedCount--
        renderIsMarked(gGame.markedCount)
        cells.innerText = ' '
    } else {
        gBoard[i][j].isMarked = true
        gGame.markedCount++
        renderIsMarked(gGame.markedCount)
        cells.innerText = '!'
    }

}

//this function execute check win
function checkVictory() {
    var totalShownToWin = gLevel.SIZE * gLevel.SIZE - gLevel.MINES
    if (gGame.shownCount >= totalShownToWin && gGame.markedCount === gLevel.MINES ||
        gGame.shownCount >= totalShownToWin + 3 - gLives && gGame.markedCount === gLevel.MINES - (3 - gLives)) {
        clearInterval(gInterval)
        document.querySelector('.smile').innerText = '☻'
        gGame.isOn = false
        showModal('Victory')
        bsetScore(gGame.secsPassed)
    }
}

//this function hint you on safe cell to click
function safeClicked() {
    if (gSafeClick === 0) return
    var safeCells = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                safeCells.push({ i: i, j: j })
            }
        }
    }
    var random = safeCells[getRandomInt(0, safeCells.length)]
    gSafeClick--
    var cells = document.getElementById(`cell ${random.i}-${random.j}`)
    cells.style.backgroundColor = 'yellow'
    setTimeout(function () {
        if (gBoard[random.i][random.j].isShown) {
            cells.style.backgroundColor = 'white'
        } else {
            cells.style.backgroundColor = 'gray'
        }
    }, 3000);
    document.querySelector(`.safe span`).innerText = gSafeClick
}

//this function get permission to use live, update and render
function useLive() {
    if (gLives === 0) return
    var permission = confirm('Do you want use life?')
    gLives--
    document.querySelector('.live').innerText = gLives
    return permission
}

//this function render timer, safe click and lives when game restart
function renderDetails() {
    document.querySelector('.timer').innerHTML = gGame.secsPassed
    document.querySelector('.safe span').innerText = gSafeClick
    document.querySelector('.live').innerText = gLives
}

function bsetScore(time) {
    if (localStorage.bsetScore === null) {
        localStorage.bsetScore = time
    } else if (localStorage.bsetScore < time) {
        localStorage.bsetScore = time
    }
    document.querySelector('.bestscore').innerText = localStorage.bsetScore
}
