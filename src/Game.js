import React, { useState, useEffect } from "react"
import checkerPiece from './checkerPiece.png'
import { Player } from './player'

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


    useEffect(() => {
        // const player1 = new Player(1,true)
        // const player2 = new Player(2,true)
    }, [])

    const [player1, setPlayer1] = useState(new Player(1, true))
    const [player2, setPlayer2] = useState(new Player(2, false))
    const [player1DeadPieces, setPlayer1DeadPieces] = useState(0)
    const [player2DeadPieces, setPlayer2DeadPieces] = useState(0)
    const [focusedPiece, setFocusedPiece] = useState([])
    const [focusedNum, setFocusedNum] = useState()
    const [focusedPieceTravels, setFocusedPiecedTravels] = useState({})
    const movementLogic = (num, coordinate, initialBoard = board, ) => {
        const radius = []
        if (num === 2) {
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
        if (Math.abs(focusedPiece[0] - rowIndex) == 2) {
            setBoard(() => {
                const newBoard = [...board]
                const diffenceRate = [(rowIndex - focusedPiece[0]) / 2, (colIndex - focusedPiece[1]) / 2]
                console.log(diffenceRate)
                newBoard[focusedPiece[0] + diffenceRate[0]][focusedPiece[1] + diffenceRate[1]] = 0
                newBoard[rowIndex][colIndex] = focusedNum
                newBoard[focusedPiece[0]][focusedPiece[1]] = col
                console.log(player1.turn, player2.turn)
                if (player1.turn) {
                    setPlayer2DeadPieces(player2DeadPieces+1)
                } else {
                    setPlayer1DeadPieces(player1DeadPieces+1)
                }
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


    const clickHandler = (col, rowIndex, colIndex) => {
        if (rowIndex in focusedPieceTravels && focusedPieceTravels[rowIndex].includes(colIndex)) {
            makeMove(col, rowIndex, colIndex)
            player1.endTurn()
            player2.endTurn()
            return
        }
        if (player1.turn) {
            if (col == player1.color) {
                onPieceClick(col, rowIndex, colIndex)
            }
        } else {
            if (col == player2.color) {
                onPieceClick(col, rowIndex, colIndex)
            }
        }
    }

    console.log(player1DeadPieces, player2DeadPieces)

    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", margin: "1% 0" }}>
            {player2DeadPieces == 12 || player1DeadPieces == 12 ? <h1>{player2DeadPieces == 12 ? "Player 2 Wins!!": "Player 1 Wins!!" }</h1>: <h1>Who Will One?</h1>}
            {board.map((row, rowIndex) => (
                <div style={{ display: "flex", textAlign: "center", alignSelf: "center" }}>
                    {row.map((col, colIndex) => {
                        return <div
                            className="piece-wrap"
                            style={rowIndex in focusedPieceTravels && focusedPieceTravels[rowIndex].includes(colIndex) ? { background: "dodgerblue", cursor: "pointer" } : (colIndex + rowIndex) % 2 ? { background: "black", cursor: "pointer" } : { background: "green" }}
                            onClick={(e) => clickHandler(col, rowIndex, colIndex)}
                        >
                            {/* <p className={`piece-${col} piece`}>•</p> */}
                            <img className={`piece-${col} piece`} src={checkerPiece} style={{ borderRadius: "50%", padding: 0 }} height={"75px"} />
                        </div>
                    })}
                </div>
            ))}
        </div>
    )
}

export default Game