export class Player {
    constructor(color, turn){
        this.turn = turn;
        this.color = color;
    }
    endTurn() {
        this.turn = !this.turn
    }
}