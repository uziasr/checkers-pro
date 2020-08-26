import React, { useState } from "react"

const Game = () => {

    var [board, setBoard] = useState([
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0]
    ])

    const [focusedPiece, setFocusedPieced] = useState()
    const [focusedPieceTravels, setFocusedPiecedTravels] = useState()
    const movementLogic = (num, coordinate, initialBoard = board, ) => {
        //[1,2] --> [0,1], [0,3], [2,1],[2,3]
        const radius = []
        console.log(num)
        if (num === 2) {
            console.log("hello")
            radius.push([coordinate[0] - 1, coordinate[1] - 1])
            radius.push([coordinate[0] - 1, coordinate[1] + 1])
        } else if (num == 1) {
            radius.push([coordinate[0] + 1, coordinate[1] - 1])
            radius.push([coordinate[0] + 1, coordinate[1] + 1])
        }

        const potentialSpaces = radius.filter(space => (initialBoard[space[0]] != undefined && initialBoard[space[0]][space[1]] != undefined))

        const possibleSpaces = potentialSpaces.map(space => {
            if (initialBoard[space[0]][space[1]] == 0) {
                return space
            } else if (initialBoard[space[0]][space[1]] != num) {
                // [4,5] [3,6]  4 - 3 = 1 5 -6 = -1    [-1,  1] [3,4] [4,5] [-1, 1]
                // 3-4, 6-5 = [-1, 1]                           3 - 4, 4 - 5
                // y1 - y0, x1 - x0                             4 - 3, 5 - 4                                             
                // 



                // coordinate - enemyCoordinate = direction
                const direction = [space[0] - coordinate[0], space[1] - coordinate[1]]
                const jumpSpot = [space[0] + direction[0], space[1] + direction[1]]
                if (initialBoard[jumpSpot[0]] && initialBoard[jumpSpot[0]][jumpSpot[1]] == 0) {
                    return jumpSpot
                }
            }
        })
        console.log(possibleSpaces)
        return possibleSpaces
    }
    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {board.map((row, rowIndex) => (
                <div style={{ display: "flex", textAlign: "center", alignSelf: "center" }}>
                    {row.map((col, colIndex) => (
                        <p onClick={(e) => col != 0 ? movementLogic(col, [rowIndex, colIndex]) : null} style={{ color: col == 0 ? "black" : col == 1 ? "blue" : "red" }}>{col.toString()}</p>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default Game