var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var users = [];
var originalBoard = [
    [0, 0, 0, 2, 6, 0, 7, 0, 1],
    [6, 8, 0, 0, 7, 0, 0, 9, 0],
    [1, 9, 0, 0, 0, 4, 5, 0, 0],
    [8, 2, 0, 1, 0, 0, 0, 4, 0],
    [0, 0, 4, 6, 0, 2, 9, 0, 0],
    [0, 5, 0, 0, 0, 3, 0, 2, 8],
    [0, 0, 9, 3, 0, 0, 0, 7, 4],
    [0, 4, 0, 0, 5, 0, 0, 3, 6],
    [7, 0, 3, 0, 1, 8, 0, 0, 0]
];
var currentBoard = [
    [0, 0, 0, 2, 6, 0, 7, 0, 1],
    [6, 8, 0, 0, 7, 0, 0, 9, 0],
    [1, 9, 0, 0, 0, 4, 5, 0, 0],
    [8, 2, 0, 1, 0, 0, 0, 4, 0],
    [0, 0, 4, 6, 0, 2, 9, 0, 0],
    [0, 5, 0, 0, 0, 3, 0, 2, 8],
    [0, 0, 9, 3, 0, 0, 0, 7, 4],
    [0, 4, 0, 0, 5, 0, 0, 3, 6],
    [7, 0, 3, 0, 1, 8, 0, 0, 0]
];
var solutionBoard = [
    [4, 3, 5, 2, 6, 9, 7, 8, 1],
    [6, 8, 2, 5, 7, 1, 4, 9, 3],
    [1, 9, 7, 8, 3, 4, 5, 6, 2],
    [8, 2, 6, 1, 9, 5, 3, 4, 7],
    [3, 7, 4, 6, 8, 2, 9, 1, 5],
    [9, 5, 1, 7, 4, 3, 6, 2, 8],
    [5, 1, 9, 3, 2, 6, 8, 7, 4],
    [2, 4, 8, 9, 5, 7, 1, 3, 6],
    [7, 6, 3, 4, 1, 8, 2, 5, 9]
];

function isComplete() {
    for (var i = 0; i < currentBoard.length; i++) {
        for (var j = 0; j < currentBoard[i].length; j++) {
            if (currentBoard[i][j] === 0) {
                return false;
            }
        }
    }
    return true;
}
io.on('connection', function(socket) {
    socket.on('userJoined', function(name) {
        console.log(socket.id + " (" + name + ") " + 'connected');
        users.push({
            _id: socket.id,
            name: name,
            points: 0,
        });
        console.log("\nUPDATED USERS:");
        console.log("------------------------------------");
        console.log(users);
        console.log("------------------------------------\n");
        io.emit('userChange', users);
        io.emit('board', currentBoard);
    });
    socket.on('disconnect', function() {
        console.log(socket.id + ' disconnected');
        users = users.filter(function(el) {
            return el._id !== socket.id;
        });
        console.log("\nUPDATED USERS:");
        console.log("------------------------------------");
        console.log(users);
        console.log("------------------------------------\n");
        io.emit('userChange', users);
    });
    socket.on('submitSolution', function(row, col, value) {
        console.log(socket.id + ' submitted answer');
        if (solutionBoard[row][col] == value) {
            currentBoard[row][col] = parseInt(value);
            for (var i = 0; i < users.length; i++) {
                if (users[i]._id == socket.id) {
                    users[i].points += 1;
                }
            }
            io.emit('userChange', users);
            io.emit('board', currentBoard);
            var complete = isComplete();
            if (complete) {
                io.emit('gameOver', users);
            }
        } else {
            for (var i = 0; i < users.length; i++) {
                if (users[i]._id == socket.id) {
                    users[i].points -= 1;
                }
            }
            io.emit('userChange', users);
            io.emit('board', currentBoard);
        }
    });
    socket.on('chat message', function(msg, name) {
        console.log(msg + " " + name);
        io.emit('chat message', msg, name);
    });
    socket.on('reset', function() {
        console.log("RESET");
        for (var i = 0; i < currentBoard.length; i++) {
            for (var j = 0; j < currentBoard[i].length; j++) {
                currentBoard[i][j] = originalBoard[i][j];
            }
        }
        for (var i = 0; i < users.length; i++) {
            users[i].points = 0;
        }
        io.emit('userChange', users);
        io.emit('board', currentBoard)
        io.emit('reset');
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
