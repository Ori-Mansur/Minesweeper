'use script'


function createMines(curri, currj) {
    var count = 0
    for (var idx = 0; idx < gLevel.MINES + count; idx++) {
        var colIdx = getRandomInt(0, gLevel.SIZE)
        var rowIdx = getRandomInt(0, gLevel.SIZE)
        if (curri === colIdx && currj === rowIdx) {
            count++
            // console.log(curri,colIdx,currj,rowIdx)
        } else if (!gBoard[colIdx][rowIdx].isMine) {
            gBoard[colIdx][rowIdx].isMine = true
            setMinesNegsCount(colIdx, rowIdx)
        } else {
            count++
        }
    }
    renderBoard(gBoard)
}