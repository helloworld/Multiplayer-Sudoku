# Multiplayer Sudoku

###### Built for the Koding Hackathon

### Built with:
- Node.js
- Express
- Socket.io

### Documentation
-----------------

### Socket.io Events:

#### connection

Web socket created,

#### userJoined

User joined game.

#### userChange

User data changed.

#### board

Sends sudoku board data.

#### submitSolution

User sent a change to the sudoku.

#### chat message

User sent chat message.

#### reset

User requested to reset board. Resets all data.

#### gameOver

Sudoku board is filled.

### Variables:

#### users

Contains list of user objects.

#### user (Object)

    {
        _id: socket.id,
        name: name,
        points: 0,
    }

#### originalBoard

Unsolved sudoku board.

#### currentBoard

Current state of sudoku board. Changes are represented here.

#### solutionBoard

Completely solved board. Used to check changes.
