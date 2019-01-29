# API Documentation

# Syntax

func: {
data: jsonInfo;
}

# Return SUCCESS

func: {
OK: true;
data: jsonInfo;
}

# Return FAILURE

func: {
OK: false;
error: errorText;
}

# Board

```javascript
getAllBoard; /* Requires null*/
getBoard; /* Requires boardID, myID */
addPiece; /* Requires pieceID, position_x, position_y */
removePiece; /* Requires boardID, pieceID */
movePiece; /* Requires pieceID, initial_x, initial_y, final_x, final_y */
startBoard; /* Requires boardID */
getPieceByLocation; /* Requires pieceID, position_x, position_y */
```

# Game

```javascript
// getAllGame; /* Requires null */
getGame; /* Requires boardID */
hostGame; /* Requires playerID */
joinGame; /* Requires boardID, playerID*/
leaveGame; /* Requires playerID */
startGame; /* Requires playerID */
endGame; /* Requires boardID */
```

# Piece --> This should not need to be touched

```javascript
getAllPiece; /* Requires null */
getPiece; /* Requires pieceID */
removePiece; /* Requires pieceID */
addPiece; /* Requires team, name */
```

# Player

```javascript
getAllPlayer; /* Requires null */
getPlayer; /* Requires playerID */
newPlayer; /* Requires null */
setTeam; /* Requires playerID, team*/
deletePlayer; /* Requires playerID */
```
