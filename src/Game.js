import React, { useState } from "react"

const Game = () => {

    var [board, setBoard] = useState([
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0]
    ])

    const [focusedPiece, setFocusedPiece] = useState([])
    const [focusedNum, setFocusedNum] = useState()
    const [focusedPieceTravels, setFocusedPiecedTravels] = useState({})
    const movementLogic = (num, coordinate, initialBoard = board, ) => {
        const radius = []
        if (num === 2) {
            console.log("hello")
            radius.push([coordinate[0] - 1, coordinate[1] - 1])
            radius.push([coordinate[0] - 1, coordinate[1] + 1])
        } else if (num == 1) {
            radius.push([coordinate[0] + 1, coordinate[1] - 1])
            radius.push([coordinate[0] + 1, coordinate[1] + 1])
        }

        const potentialSpaces = radius.filter(space => (initialBoard[space[0]] !== undefined && initialBoard[space[0]][space[1]] !== undefined))

        const possibleSpaces = potentialSpaces.map(space => {
            if (initialBoard[space[0]][space[1]] == 0) {
                return space
            } else if (initialBoard[space[0]][space[1]] !== num) {
                const direction = [space[0] - coordinate[0], space[1] - coordinate[1]]
                const jumpSpot = [space[0] + direction[0], space[1] + direction[1]]
                if (initialBoard[jumpSpot[0]] && initialBoard[jumpSpot[0]][jumpSpot[1]] == 0) {
                    return jumpSpot
                }
            }
        })
        return possibleSpaces.filter(space => space)
    }

    const onPieceClick = (col, rowIndex, colIndex) => {
        setFocusedPiecedTravels({})
        setFocusedPiece([rowIndex, colIndex])
        setFocusedNum(col)
        const movements = movementLogic(col, [rowIndex, colIndex])
        setFocusedPiecedTravels(() => {
            const paths = {}
            movements.forEach(travels => {
                if (travels !== undefined) {
                    const key = travels[0]
                    const value = travels[1]
                    if (key in paths) {
                        paths[key] = [...paths[key], value]
                    } else {
                        paths[key] = [value]
                    }
                }
            })
            return paths
        })
    }

    const makeMove = (col, rowIndex, colIndex) => {
        if (Math.abs(focusedPiece[0] - rowIndex)==2) {
            setBoard(()=>{
                const newBoard = [...board]
                const diffenceRate = [(rowIndex - focusedPiece[0])/2, (colIndex - focusedPiece[1])/2]
                console.log(diffenceRate)
                newBoard[focusedPiece[0] + diffenceRate[0]][ focusedPiece[1] + diffenceRate[1]] = 0
                newBoard[rowIndex][colIndex] = focusedNum
                newBoard[focusedPiece[0]][focusedPiece[1]] = col
                return newBoard
            })

        } else {
            setBoard(() => {
                const newBoard = [...board]
                newBoard[rowIndex][colIndex] = focusedNum
                newBoard[focusedPiece[0]][focusedPiece[1]] = col
                return newBoard
            })
        }
        setFocusedPiece([])
        setFocusedPiecedTravels({})
        setFocusedNum()

    }

    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {board.map((row, rowIndex) => (
                <div style={{ display: "flex", textAlign: "center", alignSelf: "center" }}>
                    {row.map((col, colIndex) => {
                        return <p
                            className={`piece-${col} piece`}
                            style={rowIndex in focusedPieceTravels && focusedPieceTravels[rowIndex].includes(colIndex) ? { color: "dodgerblue", cursor: "pointer" } : {}}
                            onClick={(e) => col == 1 || col == 2 ? onPieceClick(col, rowIndex, colIndex) : rowIndex in focusedPieceTravels && focusedPieceTravels[rowIndex].includes(colIndex) ? makeMove(col, rowIndex, colIndex) : null}>{col.toString()}</p>
                    })}
                </div>
            ))}
        </div>
    )
}

export default Game