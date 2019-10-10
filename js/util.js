'use script'
var gSmile = '☺'


function renderBoard(board) {
    var strHtml = `<table>
                   <thead><span class="score"></span><span class="smile" onclick="initGame()">${gSmile}</span><span class="mark"></span></thead><tbody>`;
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            if (board[i][j].isMine) cell = 'X'
            var tdId = `cell ${i}-${j}`;
            strHtml += `<td id="${tdId}" onclick="cellClicked(this,event)" oncontextmenu="cellClicked(this,event)">
            ${' '}
                        </td>`;
        }
        strHtml += '</tr>';
    }
    strHtml += '</tbody></table>'
    var elMat = document.querySelector('.game');
    elMat.innerHTML = strHtml;
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}


function renderCell(location, value) {
    var cellSelector = '#' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}


function updateScore() {
    gGame.shownCount++;
    document.querySelector('.score').innerText = `Score:${gGame.shownCount}`;
}


function renderIsMarked() {
    document.querySelector('.mark').innerText = `Mark:${gGame.markedCount}`;
}


function showModal(txt) {
    var elmodal = document.querySelector('.modal')
    elmodal.style.display = 'block'
    elmodal.querySelector('h3').innerText = txt

}


function timer() {
    gGame.secsPassed += 1000
    var timeRun = gGame.secsPassed / 1000
    var timer = document.querySelector('.timer')
    timer.innerHTML = `${timeRun}`

}