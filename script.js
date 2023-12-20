/**
 * Created by Rahul on 9/22/2016.
 */

var playerOneCode = 1;
var playerTwoCode = 2;
var blockWidth = 16;
var strokeWidth = 2;
var numberOfTurns = 0;
var rows = 7;
var columns = 7;
var clickedX;
var clickedY;
var clickSound;
var positionMatrix = new Array(7);
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var turn = 0;
var prevTurn = 0;
var millRed = 0;
var millGreen = 0;
var redBlocks = 0;
var greenBlocks = 0;
var activeRed = false, activeGreen = false;
var greenThreeLeft = false, redThreeLeft = false;
var lastX = 0;
var lastY = 0;
var lastCenterX = 0;
var lastCenterY = 0;


// 0 = Human
// 1 = minimax
// 2 = alphaBeta
var agent1 = 1;
var agent2 = 1;

const depth = 3;
var currentState;


function selectAgent(agent, player, type) {
    // Update the dropdown button label with the selected agent
    if (player === 1) {
        document.querySelector('.p1').textContent = agent;
        agent1 = type;
    }
    else {
        document.querySelector('.p2').textContent = agent;
        agent2 = type;
    }
}

class GameState {
    constructor(positionMatrix) {
        this.board = positionMatrix;
        this.redBlocks = 0;
        this.greenBlocks = 0;
        this.isMillRed = false;
        this.isMillGreen = false;
        this.isActiveRed = false;
        this.isActiveGreen = false;
        this.isGreenThreeLeft = false;
        this.isRedThreeLeft = false;
        this.lastX = 0;
        this.lastY = 0;
        this.lastCenterX = 0;
        this.lastCenterY = 0;
    }

    copy() {
        const copiedInstance = new GameState(this.board);
        copiedInstance.redBlocks = this.redBlocks;
        copiedInstance.greenBlocks = this.greenBlocks;
        copiedInstance.isMillRed = this.isMillRed;
        copiedInstance.isMillGreen = this.isMillGreen;
        copiedInstance.isActiveRed = this.isActiveRed;
        copiedInstance.isActiveGreen = this.isActiveGreen;
        copiedInstance.isGreenThreeLeft = this.isGreenThreeLeft;
        copiedInstance.isRedThreeLeft = this.isRedThreeLeft;
        copiedInstance.lastX = this.lastX;
        copiedInstance.lastY = this.lastY;
        copiedInstance.lastCenterX = this.lastCenterX;
        copiedInstance.lastCenterY = this.lastCenterY;
        return copiedInstance;
    }

    XYCenters(X, Y) {
        var xCenter;
        var yCenter;
        switch (X) {
            case 0: {
                switch (Y) {
                    case 0: {
                        yCenter = 25;
                        xCenter = 25;
                        break;
                    }
                    case 3: {
                        yCenter = 275;
                        xCenter = 25;
                        break;
                    }
                    case 6: {
                        yCenter = 525;
                        xCenter = 25;
                        break;
                    }
                }
                break;
            }
            case 1: {
                switch (Y) {
                    case 1: {
                        yCenter = 115;
                        xCenter = 115;
                        break;
                    }
                    case 3: {
                        yCenter = 275;
                        xCenter = 115;
                        break;
                    }
                    case 5: {
                        yCenter = 435;
                        xCenter = 115;
                        break;
                    }
                }
                break;
            }
            case 2: {
                switch (Y) {
                    case 2: {
                        yCenter = 195;
                        xCenter = 195;
                        break;
                    }
                    case 3: {
                        yCenter = 275;
                        xCenter = 195;
                        break;
                    }
                    case 4: {
                        yCenter = 355;
                        xCenter = 195;
                        break;
                    }
                }
                break;
            }
            case 3: {
                switch (Y) {
                    case 0: {
                        yCenter = 25;
                        xCenter = 275;
                        break;
                    }
                    case 1: {
                        yCenter = 115;
                        xCenter = 275;
                        break;
                    }
                    case 2: {
                        yCenter = 195;
                        xCenter = 275;
                        break;
                    }
                    case 4: {
                        yCenter = 355;
                        xCenter = 275;
                        break;
                    }
                    case 5: {
                        yCenter = 435;
                        xCenter = 275;
                        break;
                    }
                    case 6: {
                        yCenter = 525;
                        xCenter = 275;
                        break;
                    }
                }
                break;
            }
            case 4: {
                switch (Y) {
                    case 2: {
                        yCenter = 195;
                        xCenter = 355;
                        break;
                    }
                    case 3: {
                        yCenter = 275;
                        xCenter = 355;
                        break;
                    }
                    case 4: {
                        yCenter = 355;
                        xCenter = 355;
                        break;
                    }
                }
                break;
            }
            case 5: {
                switch (Y) {
                    case 1: {
                        yCenter = 115;
                        xCenter = 435;
                        break;
                    }
                    case 3: {
                        yCenter = 275;
                        xCenter = 435;
                        break;
                    }
                    case 5: {
                        yCenter = 435;
                        xCenter = 435;
                        break;
                    }
                }
                break;
            }
            case 6: {
                switch (Y) {
                    case 0: {
                        yCenter = 25;
                        xCenter = 525;
                        break;
                    }
                    case 3: {
                        yCenter = 275;
                        xCenter = 525;
                        break;
                    }
                    case 6: {
                        yCenter = 525;
                        xCenter = 525;
                        break;
                    }
                }
                break;
            }
        }
        return { x: xCenter, y: yCenter };
    }

    makeMove(type, move) {
        var yCenter;
        var xCenter;


        var X, Y;
        if ((type == 2 || type == 3) &&
            ((turn === 1 && agent2 !== 0 && this.isActiveRed === false) || (turn === 0 && agent1 !== 0 && this.isActiveGreen === false))) {
            X = move.from.X;
            Y = move.from.Y;
        }
        else {
            X = move.X;
            Y = move.Y;
        }

        let XY = this.XYCenters(X, Y);
        xCenter = XY.x;
        yCenter = XY.y;

        // place
        if (type === 1) {
            let { X, Y } = move;

            ////clickSound.play();
            if (turn === 1) {
                //Player two made a move, hence made a block red.
                this.redBlocks++;
                this.board[X][Y] = 2;
                context.beginPath();
                context.arc(xCenter, yCenter, blockWidth, 0, 2 * Math.PI, false);
                context.fillStyle = '#F44336';
                context.fill();
                context.lineWidth = strokeWidth;
                context.strokeStyle = '#003300';
                context.stroke();
                document.getElementById("turn").innerHTML = "P1";
                if (this.checkMill(X, Y, 2)) {
                    this.isMillRed = true;
                    document.getElementById("turn").innerHTML = "P2";
                    document.getElementById("message").innerHTML = "A Mill is formed. Click on green block to remove it.";
                } else {
                    turn = 0;
                    document.getElementById("message").innerHTML = "Click on empty spot to place your piece";
                }
            }
            else {
                //Player one just made a move, hence made a block green
                this.greenBlocks++;
                this.board[X][Y] = 1;
                context.beginPath();
                context.arc(xCenter, yCenter, blockWidth, 0, 2 * Math.PI, false);
                context.fillStyle = '#2E7D32';
                context.fill();
                context.lineWidth = strokeWidth;
                context.strokeStyle = '#003300';
                context.stroke();
                document.getElementById("turn").innerHTML = "P2";
                if (this.checkMill(X, Y, 1)) {
                    this.isMillGreen = true;
                    document.getElementById("turn").innerHTML = "P1";
                    document.getElementById("message").innerHTML = "A Mill is formed. Click on red block to remove it.";
                } else {
                    turn = 1;
                    document.getElementById("message").innerHTML = "Click on empty spot to place your piece";
                }
            }
            if (this.redBlocks === 9 || this.greenBlocks === 9) {
                document.getElementById("message").innerHTML = "Now, Move one step by clicking on Block";
            }
        }
        // move adj or jump
        else if (type < 4) {
            let X, Y;
            let agent = false;

            if (turn === 1) {
                if (agent2 !== 0) {
                    if (this.isActiveRed === false) {
                        X = move.from.X;
                        Y = move.from.Y;
                    }
                    else {
                        X = move.X;
                        Y = move.Y;
                    }
                    agent = true;
                }
                else {
                    X = move.X;
                    Y = move.Y;
                }
            }
            else if (turn === 0) {
                if (agent1 !== 0) {
                    if (this.isActiveGreen === false) {
                        X = move.from.X;
                        Y = move.from.Y;
                    }
                    else {
                        X = move.X;
                        Y = move.Y;
                    }
                    agent = true;
                }
                else {
                    X = move.X;
                    Y = move.Y;
                }
            }

            if (this.isActiveRed || this.isActiveGreen) {
                if ((((X == this.lastX) && (Y == this.lastY)) || (this.board[X][Y] == 1 || this.board[X][Y] == 2))) {
                    this.turnOffActive(this.lastCenterX, this.lastCenterY);
                }

                if ((this.board[X][Y] == 0)) {
                    let playerCode = this.isActiveGreen ? playerOneCode : playerTwoCode;
                    //Checking for adjacent element.
                    if (type === 2 && ((X == this.lastX) || (Y == this.lastY))) {
                        if (X == 0 || X == 6 || Y == 0 || Y == 6) {
                            if (((Math.abs(X - this.lastX) + Math.abs(Y - this.lastY)) == 3) || ((Math.abs(X - this.lastX) + Math.abs(Y - this.lastY)) == 1)) {
                                //Remove previous block and make a new block at the the given position
                                this.board[this.lastX][this.lastY] = 0;
                                this.clearBlock(this.lastCenterX, this.lastCenterY);
                                this.drawBlock(xCenter, yCenter, X, Y);

                                if (playerCode === playerOneCode) {
                                    document.getElementById("turn").innerHTML = "P2";
                                }
                                else {
                                    document.getElementById("turn").innerHTML = "P1";
                                }
                                if (this.checkMill(X, Y, playerCode)) {
                                    if (playerCode === 1) {
                                        this.isMillGreen = true;
                                    }
                                    else {
                                        this.isMillRed = true;
                                    }
                                    if (playerCode === playerOneCode) {
                                        document.getElementById("turn").innerHTML = "P1";
                                    }
                                    else {
                                        document.getElementById("turn").innerHTML = "P2";
                                    }
                                    document.getElementById("message").innerHTML = "A Mill is formed. Click on green block to remove it.";
                                } else {
                                    turn = 1 - turn;
                                    document.getElementById("message").innerHTML = "Click on empty spot to place your piece";
                                }
                            }
                        } else if (X == 1 || X == 5 || Y == 1 || Y == 5) {
                            if (((Math.abs(X - this.lastX) + Math.abs(Y - this.lastY)) == 2) || ((Math.abs(X - this.lastX) + Math.abs(Y - this.lastY)) == 1)) {
                                //Remove previous block and make a new block at the the given position
                                this.board[this.lastX][this.lastY] = 0;
                                this.clearBlock(this.lastCenterX, this.lastCenterY);
                                this.drawBlock(xCenter, yCenter, X, Y);

                                if (playerCode === playerOneCode) {
                                    document.getElementById("turn").innerHTML = "P2";
                                }
                                else {
                                    document.getElementById("turn").innerHTML = "P1";
                                }
                                if (this.checkMill(X, Y, playerCode)) {
                                    if (playerCode === 1) {
                                        this.isMillGreen = true;
                                    }
                                    else {
                                        this.isMillRed = true;
                                    }
                                    if (playerCode === playerOneCode) {
                                        document.getElementById("turn").innerHTML = "P1";
                                    }
                                    else {
                                        document.getElementById("turn").innerHTML = "P2";
                                    }
                                    document.getElementById("message").innerHTML = "A Mill is formed. Click on green block to remove it.";
                                } else {
                                    turn = 1 - turn;
                                    document.getElementById("message").innerHTML = "Click on empty spot to place your piece";
                                }
                            }
                        } else if (X == 2 || X == 4 || Y == 2 || Y == 4) {
                            if (((Math.abs(X - this.lastX) + Math.abs(Y - this.lastY)) == 1)) {
                                //Remove previous block and make a new block at the the given position
                                this.board[this.lastX][this.lastY] = 0;
                                this.clearBlock(this.lastCenterX, this.lastCenterY);
                                this.drawBlock(xCenter, yCenter, X, Y);

                                if (playerCode === playerOneCode) {
                                    document.getElementById("turn").innerHTML = "P2";
                                }
                                else {
                                    document.getElementById("turn").innerHTML = "P1";
                                }
                                if (this.checkMill(X, Y, playerCode)) {
                                    if (playerCode === 1) {
                                        this.isMillGreen = true;
                                    }
                                    else {
                                        this.isMillRed = true;
                                    }
                                    if (playerCode === playerOneCode) {
                                        document.getElementById("turn").innerHTML = "P1";
                                    }
                                    else {
                                        document.getElementById("turn").innerHTML = "P2";
                                    }
                                    document.getElementById("message").innerHTML = "A Mill is formed. Click on green block to remove it.";
                                } else {
                                    turn = 1 - turn;
                                    document.getElementById("message").innerHTML = "Click on empty spot to place your piece";
                                }
                            }
                        }
                    } else if (type === 3) {
                        if (this.isGreenThreeLeft && (this.board[this.lastX][this.lastY] == playerOneCode)) {
                            this.board[this.lastX][this.lastY] = 0;
                            this.clearBlock(this.lastCenterX, this.lastCenterY);
                            this.drawBlock(xCenter, yCenter, X, Y);

                            if (playerCode === playerOneCode) {
                                document.getElementById("turn").innerHTML = "P2";
                            }
                            else {
                                document.getElementById("turn").innerHTML = "P1";
                            }
                            if (this.checkMill(X, Y, playerCode)) {
                                if (playerCode === 1) {
                                    this.isMillGreen = true;
                                }
                                else {
                                    this.isMillRed = true;
                                }
                                if (playerCode === playerOneCode) {
                                    document.getElementById("turn").innerHTML = "P1";
                                }
                                else {
                                    document.getElementById("turn").innerHTML = "P2";
                                }
                                document.getElementById("message").innerHTML = "A Mill is formed. Click on green block to remove it.";
                            } else {
                                turn = 1 - turn;
                                document.getElementById("message").innerHTML = "Click on empty spot to place your piece";
                            }
                        }
                        else if (this.isRedThreeLeft && (this.board[this.lastX][this.lastY] == playerTwoCode)) {
                            this.board[this.lastX][this.lastY] = 0;
                            this.clearBlock(this.lastCenterX, this.lastCenterY);
                            this.drawBlock(xCenter, yCenter, X, Y);

                            if (playerCode === playerOneCode) {
                                document.getElementById("turn").innerHTML = "P2";
                            }
                            else {
                                document.getElementById("turn").innerHTML = "P1";
                            }
                            if (this.checkMill(X, Y, playerCode)) {
                                if (playerCode === 1) {
                                    this.isMillGreen = true;
                                }
                                else {
                                    this.isMillRed = true;
                                }
                                if (playerCode === playerOneCode) {
                                    document.getElementById("turn").innerHTML = "P1";
                                }
                                else {
                                    document.getElementById("turn").innerHTML = "P2";
                                }
                                document.getElementById("message").innerHTML = "A Mill is formed. Click on green block to remove it.";
                            } else {
                                turn = 1 - turn;
                                document.getElementById("message").innerHTML = "Click on empty spot to place your piece";
                            }
                        }
                    } else {
                        this.turnOffActive(this.lastCenterX, this.lastCenterY);
                    }
                }
            }
            else if (this.board[X][Y] !== 0) {
                //Do nothing when clicked on empty element and check the all possible moves that
                // a player have after clicking on a  particular position of his own color.
                if (turn === 1 && this.board[X][Y] == 2) {
                    //Player two made a move, hence made a block fade red.
                    ////clickSound.play();
                    this.isActiveRed = true;
                    if (this.checkThreeLeft(playerTwoCode)) {
                        this.isRedThreeLeft = true;
                        document.getElementById("message").innerHTML = "Red can now move anywhere (3 are left only)";
                    } else {
                        document.getElementById("message").innerHTML = "Move one step by clicking on Block";
                    }
                    this.updateLastParam(xCenter, yCenter, X, Y);
                    context.beginPath();
                    context.arc(xCenter, yCenter, blockWidth, 0, 2 * Math.PI, false);
                    context.fillStyle = '#FFCDD2';
                    context.fill();
                    context.lineWidth = strokeWidth;
                    context.strokeStyle = '#003300';
                    context.stroke();
                }
                else if (turn === 0 && this.board[X][Y] == 1) {
                    //Player one just made a move, hence made a block green
                    //clickSound.play();
                    this.isActiveGreen = true;
                    if (this.checkThreeLeft(playerOneCode)) {
                        this.isGreenThreeLeft = true;
                        document.getElementById("message").innerHTML = "Green can now move anywhere (3 are left only)";
                    }
                    else {
                        document.getElementById("message").innerHTML = "Move one step by clicking on Block";
                    }
                    this.updateLastParam(xCenter, yCenter, X, Y);
                    context.beginPath();
                    context.arc(xCenter, yCenter, blockWidth, 0, 2 * Math.PI, false);
                    context.fillStyle = '#AED581';
                    context.fill();
                    context.lineWidth = strokeWidth;
                    context.strokeStyle = '#003300';
                    context.stroke();
                }

                if (agent) {
                    this.makeMove(type, { X: move.to.X, Y: move.to.Y });
                }
            }
        }
        // remove opponent 
        else {
            //In this case don't change player turn and remove other player block in next click
            var playerCode = (this.isMillGreen) ? 1 : 2;
            if (this.board[X][Y] != playerCode && (this.board[X][Y] != 0)) {
                //Check that it shouldn't be the part of other mill
                if (!this.checkMill(X, Y, ((this.isMillRed) ? 1 : 2)) || this.allArePartOfMill(((this.isMillRed) ? 1 : 2))) {
                    //Remove that block and update array value to zero
                    //clickSound.play();
                    if (playerCode == 1) {
                        this.redBlocks--;
                        document.getElementById("message").innerHTML = "Red block removed";
                    } else {
                        document.getElementById("message").innerHTML = "Green block removed";
                        this.greenBlocks--;
                    }
                    context.clearRect(xCenter - blockWidth - strokeWidth, yCenter - blockWidth - strokeWidth,
                        2 * (blockWidth + strokeWidth), 2 * (blockWidth + strokeWidth));
                    this.board[X][Y] = 0;
                    this.turnOffMill();
                    this.update();
                    turn = 1 - turn;
                }
                else {
                    document.getElementById("message").innerHTML = "Can't remove a block which is already a part of mill";
                }
            }
        }
    }

    getPossibleMoves(type) {
        const playerCode = turn === 1 ? playerTwoCode : playerOneCode;
        const oppositeCode = turn === 1 ? playerOneCode : playerTwoCode;

        const empty = [];
        const possibleMoves = [];

        for (let r = 0; r < rows; ++r) {
            for (let c = 0; c < columns; ++c) {
                if (this.board[c][r] === 0) {
                    empty.push({ X: c, Y: r });
                }
                else if (type === 4 && this.board[c][r] === oppositeCode) {
                    possibleMoves.push({ X: c, Y: r });
                }
            }
        }

        if (type === 1) {
            return empty;
        }
        if (type === 4) {
            return possibleMoves;
        }

        for (let r = 0; r < rows; ++r) {
            for (let c = 0; c < columns; ++c) {
                if (this.board[c][r] === playerCode) {
                    if (type === 2) {
                        const adj = this.getPossibleAdjacent(c, r);

                        for (let a of adj) {
                            possibleMoves.push({ from: { X: c, Y: r }, to: a });
                        }
                    }
                    else if (type === 3) {
                        for (let e of empty) {
                            possibleMoves.push({ from: { X: c, Y: r }, to: e });
                        }
                    }
                }
            }
        }
        return possibleMoves;
    }

    getPossibleAdjacent(x, y) {
        const adj = [];

        if (x > 0 && this.board[x - 1][y] === 0) {
            adj.push({ X: x - 1, Y: y });
        }
        if (x < 6 && this.board[x + 1][y] === 0) {
            adj.push({ X: x + 1, Y: y });
        }
        if (y > 0 && this.board[x][y - 1] === 0) {
            adj.push({ X: x, Y: y - 1 });
        }
        if (y < 6 && this.board[x][y + 1] === 0) {
            adj.push({ X: x, Y: y + 1 });
        }

        return adj;
    }

    evaluate() {
        const playerOnePieces = this.countPlayerPieces(playerOneCode);
        const playerTwoPieces = this.countPlayerPieces(playerTwoCode);
        const playerOneMills = this.countPlayerMills(playerOneCode);
        const playerTwoMills = this.countPlayerMills(playerTwoCode);

        return (playerOnePieces - playerTwoPieces) + 2 * (playerOneMills - playerTwoMills);
    }

    countPlayerPieces(playerCode) {
        let count = 0;

        for (let r = 0; r < rows; ++r) {
            for (let c = 0; c < columns; ++c) {
                if (this.board[c][r] === playerCode) count++;
            }
        }

        return count;
    }

    countPlayerMills(playerCode) {     // similar to checkMill function
        let count = 0;
        let oppositeCode = (playerCode == 1) ? 2 : 1;

        for (let r = 0; r < rows; ++r) {
            for (let i = 0; i < 5; ++i) {
                let flag = 0;

                for (let j = i; j < i + 3; ++j) {
                    if (this.board[j][r] == playerCode) {
                        continue;
                    } else {
                        flag = 1;
                        break;
                    }
                }
                if (flag == 0) {
                    count++;
                }
            }

            let flag = 0;
            for (let c = 0; c < columns; ++c) {
                if ((this.board[c][r] == oppositeCode) || (this.board[c][r] == 0)) {
                    flag = 1;
                    break;
                }
            }
            if (flag == 0) {
                count++;
            }
        }

        for (let c = 0; c < columns; ++c) {
            for (let i = 0; i < 5; ++i) {
                let flag = 0;
                for (let j = i; j < i + 3; ++j) {
                    if (this.board[c][j] == playerCode) {
                        continue;
                    } else {
                        flag = 1;
                        break;
                    }
                }
                if (flag == 0) {
                    count++;
                }
            }

            let flag = 0;
            for (let r = 0; r < rows; ++r) {
                if ((this.board[c][r] == oppositeCode) || (this.board[c][r] == 0)) {
                    flag = 1;
                    break;
                }
            }
            if (flag == 0) {
                count++;
            }
        }

        return count;
    }
    /**
     *  1 = place
     *  2 = move adj
     *  3 = jump
     *  4 = remove opp
     */
    getMoveType(playerCode) {
        console.log(this.isMillGreen, this.isMillRed);
        if ((this.isMillGreen && turn === 0) || (this.isMillRed && turn === 1)) {
            return 4;
        }
        else if (numberOfTurns < 18) {
            return 1;
        }
        else if (numberOfTurns >= 18) {
            if ((this.isGreenThreeLeft && turn === 0) || (this.isRedThreeLeft && turn === 1)) {
                return 3;
            }
            else {
                return 2;
            }
        }
    }

    checkMill(x, y, playerCode) {
        //Using the fact that two mills cannot occur simultaneously
        var flag = 0;
        var temp = 0;
        //Transverse through the given row and column and check for mill
        for (var i = 0; i < 5; i++) {
            flag = 0;
            for (var j = temp; j < temp + 3; j++) {
                if (this.board[j][y] == playerCode) {
                    continue;
                } else {
                    flag = 1;
                    break;
                }
            }
            if (flag == 0) {
                //console.log("This is from : " + 1);
                return true;
            } else {
                temp++;
            }
        }

        flag = 0;
        temp = 0;
        //Now moving along the given column
        for (var k = 0; k < 5; k++) {
            flag = 0;
            for (var l = temp; l < temp + 3; l++) {
                if (this.board[x][l] == playerCode) {
                    continue;
                } else {
                    flag = 1;
                    break;
                }
            }
            if (flag == 0) {
                // console.log("This is from : " + 2);
                return true;
            } else {
                temp++;
            }
        }

        var check = true;
        var oppositeCode = (playerCode == 1) ? 2 : 1;
        for (var a = 0; a < 7; a++) {
            if ((this.board[a][y] == oppositeCode) || (this.board[a][y] == 0)) {
                check = false;
                break;
            }
        }
        if (check == true) {
            //console.log("This is from : " + 3);
            return true;
        }
        check = true;

        for (var b = 0; b < 7; b++) {
            //Check for any empty element of any element of anther type
            if ((this.board[x][b] == oppositeCode) || (this.board[x][b] == 0)) {
                check = false;
                break;
            }
        }
        if (check == true) {
            //console.log("This is from : " + 4);
            return true;
        }

        return false;
    }

    updateLastParam(xCenter, yCenter, X, Y) {
        this.lastCenterX = xCenter;
        this.lastCenterY = yCenter;
        this.lastX = X;
        this.lastY = Y;
    }

    checkThreeLeft(playerCode) {
        return (numberOfTurns >= 18 && (((playerCode == 1) ? this.greenBlocks : this.redBlocks) == 3));
    }

    checkGameOver() {
        //If less than 3 players left of any team.
        if (numberOfTurns >= 18) {
            if (this.redBlocks < 3 || this.greenBlocks < 3) {
                console.log("Only 2 " + ((this.greenBlocks < 3) ? "Green" : "Red") + " blocks left !\n" +
                    "Hence, Player " + ((this.greenBlocks < 3) ? 2 : 1) + " wins !");
                // location.reload(true);
                return true;
            }
            else {
                //Check if no adjacent element available for any of the player.
                if (!this.canMove(playerOneCode, this.greenBlocks)) {
                    console.log("No possible moves left for Player " + playerOneCode + "\n" +
                        "Hence, Player " + playerTwoCode + " wins !");
                    // location.reload(true);
                    return true;

                } else if (!this.canMove(playerTwoCode, this.redBlocks)) {
                    console.log("No possible moves left for Player " + playerTwoCode + "\n" +
                        "Hence, Player " + playerOneCode + " wins !");
                    // location.reload(true);
                    return true;

                }
            }
        }
        return false;
    }

    canMove(playerCode, blocksLeft) {
        //If only 3 are left then it can always move anywhere
        if (blocksLeft == 3) {
            return true;
        }
        //return true even if one of them have at least one valid move left
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                if (this.board[j][i] == playerCode) {
                    //now move in all four directions until index becomes < 0 || >6
                    // or after -1's zero comes at the given position.

                    //Left
                    if (!(j == 4 && i == 3)) {
                        for (var k = j - 1; k >= 0; k--) {
                            if (this.board[k][i] != -1) {
                                if (this.board[k][i] == 0) {
                                    return true;
                                } else {
                                    //Adjacent piece is occupied by some block
                                    break;
                                }
                            }
                        }
                    }

                    //Top
                    if (!(j == 3 && i == 4)) {
                        for (var l = i - 1; l >= 0; l--) {
                            if (this.board[j][l] != -1) {
                                if (this.board[j][l] == 0) {
                                    return true;
                                } else {
                                    //Adjacent piece is occupied by some block
                                    break;
                                }
                            }
                        }
                    }


                    //Right
                    if (!(j == 2 && i == 3)) {
                        for (var m = j + 1; m < 7; m++) {
                            if (this.board[m][i] != -1) {
                                if (this.board[m][i] == 0) {
                                    return true;
                                } else {
                                    //Adjacent piece is occupied by some block
                                    break;
                                }
                            }
                        }
                    }


                    //Bottom
                    if (!(j == 3 && i == 2)) {
                        for (var n = i + 1; n < 7; n++) {
                            if (this.board[j][n] != -1) {
                                if (this.board[j][n] == 0) {
                                    return true;
                                } else {
                                    //Adjacent piece is occupied by some block
                                    break;
                                }
                            }
                        }
                    }

                }
            }
        }

        return false;
    }

    turnOffActive(x, y) {
        //clickSound.play();
        context.beginPath();
        context.arc(x, y, blockWidth, 0, 2 * Math.PI, false);
        if (this.isActiveRed) {
            context.fillStyle = '#F44336';
        } else {
            context.fillStyle = '#2E7D32';
        }
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = '#003300';
        context.stroke();
        this.isActiveRed = false;
        this.isActiveGreen = false;
    }

    clearBlock(xI, yI, flag = 0, X = 0, Y = 0) {
        //clickSound.play();
        //Clear canvas at previous position
        context.clearRect(xI - blockWidth - strokeWidth, yI - blockWidth - strokeWidth,
            2 * (blockWidth + strokeWidth), 2 * (blockWidth + strokeWidth));
        if (flag == 0) this.board[this.lastX][this.lastY] = 0;
        else this.board[X][Y] = 0;
    }

    drawBlock(x, y, X, Y, color = 0) {
        context.beginPath();
        context.arc(x, y, blockWidth, 0, 2 * Math.PI, false);
        if (this.isActiveRed || color == 2) {
            this.board[X][Y] = 2;
            context.fillStyle = '#F44336';
            if (this.checkMill(X, Y, 2)) {
                this.isMillRed = true;
                document.getElementById("message").innerHTML = "Click on green block to remove it.";
            }
        } else {
            this.board[X][Y] = 1;
            context.fillStyle = '#2E7D32';
            if (this.checkMill(X, Y, 1)) {
                this.isMillGreen = true;
                document.getElementById("message").innerHTML = "Click on red block to remove it.";
            }
        }
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = '#003300';
        context.stroke();

        this.isActiveGreen = false;
        this.isActiveRed = false;
        this.update();
    }

    update() {
        //Update player turn
        if (turn === 1) {
            document.getElementById("turn").innerHTML = "P2";
        } else {
            document.getElementById("turn").innerHTML = "P1";
        }
    }

    turnOffMill() {
        this.isMillGreen = false;
        this.isMillRed = false;
    }

    allArePartOfMill(playerCode) {
        //return false if atleast one of them is not a part of the mill
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                if (this.board[i][j] == playerCode) {
                    if (!this.checkMill(i, j, playerCode)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    drawBoard() {
        var xCenter, yCenter;
        for (var X = 0; X < rows; X++) {
            for (var Y = 0; Y < columns; Y++) {
                let XY = this.XYCenters(X, Y);
                xCenter = XY.x;
                yCenter = XY.y;
                if (this.board[X][Y] == 0) this.clearBlock(xCenter, yCenter, 1, X, Y);
                else if (~this.board[X][Y]) this.drawBlock(xCenter, yCenter, X, Y, this.board[X][Y]);
            }
        }
    }
}

function initializeGame() {
    clickSound = new sound("sound.wav");
    initializeArray();
    currentState = new GameState(positionMatrix);
    // alert("Player 1 turns first followed by Player 2");
    start();
}

function start() {
    function makeMoveWithDelay(type, move) {
        turn = prevTurn;
        currentState.isMillRed = millRed;
        currentState.isMillGreen = millGreen;
        currentState.redBlocks = redBlocks;
        currentState.greenBlocks = greenBlocks;
        currentState.isActiveRed = activeRed;
        currentState.isActiveGreen = activeGreen;
        currentState.isGreenThreeLeft = greenThreeLeft;
        currentState.isRedThreeLeft = redThreeLeft;
        currentState.lastX = lastX;
        currentState.lastY = lastY;
        currentState.lastCenterX = lastCenterX;
        currentState.lastCenterY = lastCenterY;

        currentState.makeMove(type, move);
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    async function playerMove(type, agent) {
        let moved = false;

        if (agent === 0) { // human
            if (clickedX && clickedY) {
                currentState.makeMove(type, { X: clickedX, Y: clickedY });
                moved = true;
            }
        } else if (agent === 1) { // minimax
            prevTurn = turn;
            millRed = currentState.isMillRed;
            millGreen = currentState.isMillGreen;
            redBlocks = currentState.redBlocks;
            greenBlocks = currentState.greenBlocks;
            activeRed = currentState.isActiveRed;
            activeGreen = currentState.isActiveGreen;
            greenThreeLeft = currentState.isGreenThreeLeft;
            redThreeLeft = currentState.isRedThreeLeft;
            lastX = currentState.lastX;
            lastY = currentState.lastY;
            lastCenterX = currentState.lastCenterX;
            lastCenterY = currentState.lastCenterY;

            let move = getBestMove(type);
            let bMove = move.b;
            // let fMove = move.f;
            // console.log("xxx", agent, bMove === fMove);
            console.log(move);
            await makeMoveWithDelay(type, bMove);
            moved = true;
        } else { // alphaBeta
            currentState.makeMove(type, getBestMove_ABP(type));
            moved = true;
        }

        return moved;
    }

    async function playTurn(playerCode, agent) {
        type = currentState.getMoveType(playerCode);

        console.log(turn, type);

        const moved = await playerMove(type, agent);

        if (moved) {
            numberOfTurns++;
        }
    }

    async function playGame() {
        while (currentState.checkGameOver() === false) {
            if (turn === 1) {
                // player 2's turn
                await playTurn(playerTwoCode, agent2);
            } else {
                // player 1's turn
                await playTurn(playerOneCode, agent1);
            }
        }
    }

    playGame();
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    };
}

function initializeArray() {
    for (var i = 0; i < 7; i++) {
        positionMatrix[i] = new Array(7);
    }

    for (var j = 0; j < 7; j++) {
        for (var k = 0; k < 7; k++) {
            //Make all diagonal elements + boundary + center to zero
            if ((j == 3) || (k == 3) || (j == k) || (j + k == 6)) {
                positionMatrix[j][k] = 0;
            }
            else {
                positionMatrix[j][k] = -1;
            }
        }
    }
    //Finally making center also -1
    positionMatrix[3][3] = -1;
}

canvas.addEventListener("click", mouseClick);

function mouseClick(event) {
    //Get the X and Y co-ordinate at the point of touch in canvas
    var X = event.clientX - (canvas.getBoundingClientRect()).left;
    var Y = event.clientY - (canvas.getBoundingClientRect()).top;

    //Check if touch event occurs in canvas or not
    if ((X >= 0 && X <= 550) && (Y >= 0 && Y <= 550)) {
        //1st row
        if ((X >= 0 && X <= 75) && (Y >= 0 && Y <= 75)) {
            clickedX = 0;
            clickedY = 0;
        } else if ((X >= 235 && X <= 315) && (Y >= 0 && Y <= 75)) {
            clickedX = 3;
            clickedY = 0;
        } else if ((X >= 475 && X <= 550) && (Y >= 0 && Y <= 75)) {
            clickedX = 6;
            clickedY = 0;
        }
        //2nd row
        else if ((X >= 75 && X <= 155) && (Y >= 75 && Y <= 155)) {
            clickedX = 1;
            clickedY = 1;
        } else if ((X >= 235 && X <= 315) && (Y >= 75 && Y <= 155)) {
            clickedX = 3;
            clickedY = 1;
        } else if ((X >= 395 && X <= 475) && (Y >= 75 && Y <= 155)) {
            clickedX = 5;
            clickedY = 1;
        }
        //3rd row
        else if ((X >= 155 && X <= 235) && (Y >= 155 && Y <= 235)) {
            clickedX = 2;
            clickedY = 2;
        } else if ((X >= 235 && X <= 315) && (Y >= 155 && Y <= 235)) {
            clickedX = 3;
            clickedY = 2;
        } else if ((X >= 315 && X <= 395) && (Y >= 155 && Y <= 235)) {
            clickedX = 4;
            clickedY = 2;
        }
        //4th row
        else if ((X >= 0 && X <= 75) && (Y >= 235 && Y <= 315)) {
            clickedX = 0;
            clickedY = 3;
        } else if ((X >= 75 && X <= 155) && (Y >= 235 && Y <= 315)) {
            clickedX = 1;
            clickedY = 3;
        } else if ((X >= 155 && X <= 235) && (Y >= 235 && Y <= 315)) {
            clickedX = 2;
            clickedY = 3;
        } else if ((X >= 315 && X <= 395) && (Y >= 235 && Y <= 315)) {
            clickedX = 4;
            clickedY = 3;
        } else if ((X >= 395 && X <= 475) && (Y >= 235 && Y <= 315)) {
            clickedX = 5;
            clickedY = 3;
        } else if ((X >= 475 && X <= 550) && (Y >= 235 && Y <= 315)) {
            clickedX = 6;
            clickedY = 3;
        }
        //5th row
        else if ((X >= 155 && X <= 235) && (Y >= 315 && Y <= 395)) {
            clickedX = 2;
            clickedY = 4;
        } else if ((X >= 235 && X <= 315) && (Y >= 315 && Y <= 395)) {
            clickedX = 3;
            clickedY = 4;
        } else if ((X >= 315 && X <= 395) && (Y >= 315 && Y <= 395)) {
            clickedX = 4;
            clickedY = 4;
        }
        //6th row
        else if ((X >= 75 && X <= 155) && (Y >= 395 && Y <= 475)) {
            clickedX = 1;
            clickedY = 5;
        } else if ((X >= 235 && X <= 315) && (Y >= 395 && Y <= 475)) {
            clickedX = 3;
            clickedY = 5;
        } else if ((X >= 395 && X <= 475) && (Y >= 395 && Y <= 475)) {
            clickedX = 5;
            clickedY = 5;
        }
        //7th row
        else if ((X >= 0 && X <= 75) && (Y >= 475 && Y <= 550)) {
            clickedX = 0;
            clickedY = 6;
        } else if ((X >= 235 && X <= 315) && (Y >= 475 && Y <= 550)) {
            clickedX = 3;
            clickedY = 6;
        } else if ((X >= 475 && X <= 550) && (Y >= 475 && Y <= 550)) {
            clickedX = 6;
            clickedY = 6;
        }
    }
}

// minimax
function getBestMove(type) {
    let mx = -Infinity;
    let bestMove;

    const possibleMoves = currentState.getPossibleMoves(type);

    for (let move of possibleMoves) {
        let nextState = _.cloneDeep(currentState);
        nextState.makeMove(type, move);

        const ret = minimax(type, nextState, depth - 1, false);
        if (ret > mx) {
            mx = ret;
            bestMove = move;
        }
    }
    currentState.drawBoard();
    return { b: bestMove, f: possibleMoves[0] };
}

function minimax(type, state, depth, agent) {
    if (depth === 0 || state.checkGameOver()) {
        return state.evaluate();
    }

    const possibleMoves = state.getPossibleMoves(type);

    if (agent) {
        let mx = -Infinity;

        for (let move of possibleMoves) {
            const nextState = _.cloneDeep(state);
            nextState.makeMove(type, move);

            const ret = minimax(type, nextState, depth - 1, false);
            mx = Math.max(mx, ret);
        }

        return mx;
    }
    else {
        let mn = Infinity;

        for (let move of possibleMoves) {
            const nextState = _.cloneDeep(state);
            nextState.makeMove(type, move);

            const ret = minimax(type, nextState, depth - 1, true);
            mn = Math.min(mn, ret);
        }

        return mn;
    }
}

// alpha beta
function getBestMove_ABP(type) {
    let mx = -Infinity;
    let bestMove;

    const possibleMoves = currentState.getPossibleMoves(type);

    for (let move of possibleMoves) {
        const nextState = _.cloneDeep(state);
        nextState.makeMove(type, move);

        const ret = alpha_beta_pruning(type, nextState, depth - 1, -Infinity, Infinity, false);
        if (ret > mx) {
            mx = ret;
            bestMove = move;
        }
    }

    return bestMove;
}

function alpha_beta_pruning(type, state, depth, alpha, beta, maximizingPlayer) {
    if (depth === 0 || state.checkGameOver()) {
        return state.evaluate();
    }

    const possibleMoves = state.getPossibleMoves(type);

    if (maximizingPlayer) {
        let mx = -Infinity;

        for (let move of possibleMoves) {
            const nextState = _.cloneDeep(state);
            nextState.makeMove(type, move);

            const ret = alpha_beta_pruning(type, nextState, depth - 1, alpha, beta, false);
            mx = Math.max(mx, ret);
            alpha = Math.max(alpha, mx);

            if (beta <= alpha) {
                // Beta cut-off
                break;
            }
        }

        return mx;
    } else {
        let mn = Infinity;

        for (let move of possibleMoves) {
            const nextState = _.cloneDeep(state);
            nextState.makeMove(type, move);

            const ret = alpha_beta_pruning(type, nextState, depth - 1, alpha, beta, true);
            mn = Math.min(mn, ret);
            beta = Math.min(beta, mn);

            if (beta <= alpha) {
                // Alpha cut-off
                break;
            }
        }

        return mn;
    }
}