import { myJsonify } from "./Helpers";
import { sendData } from "./SocketController";

export const initArray = size => new Array(size).fill(null);
const init2dArray = size => new Array(size).fill(0);

export async function initialiseBoard(socket, data) {
  sendData(socket, "startBoard", data);
}
export async function startBoard(message, updateState, state) {
  try {
    console.log(message);
    let new_message = await myJsonify(/^startBoard: /, message);
    if (!new_message.OK) {
      throw Error("Could not start game");
    }
    // console.log(new_message);
    // console.log(new_message.data);
    // console.log(new_message.data[0]);
    // console.log(new_message.data[0].boardID);

    if (state.lobbyID === new_message.data[0].boardID) {
      let squares = initArray(64);
      let board = new_message.data;

      for (let piece of board) {
        squares[(piece.position_y - 1) * 8 + piece.position_x - 1] =
          piece.pieceData;
        // console.log(piece.position_x + piece.position_y + piece.pieceData);
      }

      updateState({ squares });
    }
  } catch (error) {
    console.log(error);
  }
}
export async function getBoardData(socket, data) {
  sendData(socket, "getBoard", data);
}

export async function getBoard(message, updateState, state) {
  try {
    // console.log(message);
    let new_message = await myJsonify(/^getBoard: /, message);
    if (!new_message.OK) {
      throw Error("Could not start game");
    }
    console.log("Get board ", new_message);
    let squares = initArray(64);
    let board = new_message.data;

    for (let piece of board) {
      squares[(piece.position_y - 1) * 8 + piece.position_x - 1] =
        piece.pieceData;
      console.log(piece.position_x + piece.position_y + piece.pieceData);
    }

    updateState({ squares });
  } catch (error) {
    console.log(error);
  }
}

export async function moveAPiece(socket, data) {
  sendData(socket, "movePiece", data);
}

export async function movePiece(message, updateState, state) {
  try {
    // console.log(message);
    let new_message = await myJsonify(/^movePiece: /, message);
    if (!new_message.OK) {
      throw Error("Could not move piece");
    }
    // console.log("move piece", new_message);
    let board = new_message.data;
    console.log(board);

    let i_index =
      Number(board.initial.position_y - 1) * 8 +
      Number(board.initial.position_x) -
      1;
    let f_index =
      Number(board.final.position_y - 1) * 8 +
      Number(board.final.position_x) -
      1;
    console.log(i_index, f_index);
    let squares = state.squares;
    squares[f_index] = state.squares[i_index];
    squares[i_index] = null;

    if (board.special === "KSC") {
      squares[i_index + 1] = state.squares[i_index + 3];
      squares[i_index + 3] = null;
    } else if (board.special === "QSC") {
      squares[i_index - 1] = state.squares[i_index - 4];
      squares[i_index - 4] = null;
    }

    let new_turn = state.turn === "white" ? "black" : "white";
    updateState({ squares, turn: new_turn });
  } catch (error) {
    console.log(error);
  }
}

export async function initVision(state, updateState, team) {
  try {
    // console.log(state);
    let vision = init2dArray(64);
    for (let column = 0; column < 8; column++) {
      for (let row = 0; row < 8; row++) {
        // console.log(state.squares[column * 8 + row]);
        // let column = 0;
        // let row = 0;
        let pieceData = state.squares[column * 8 + row];
        if (pieceData !== null) {
          if (pieceData.team === team) {
            // Surrounding blocks
            let left_x = row >= 1 ? row - 1 : row;
            let right_x = row < 7 ? row + 1 : row;
            let top_y = column >= 1 ? column - 1 : column;
            let bottom_y = column < 7 ? column + 1 : column;

            for (
              let vision_column = top_y;
              vision_column <= bottom_y;
              vision_column++
            ) {
              for (
                let vision_row = left_x;
                vision_row <= right_x;
                vision_row++
              ) {
                vision[vision_column * 8 + vision_row] = 1;
              }
            }
            // Pawn
            if (pieceData.name === "pawn") {
              if (pieceData.team === "black") {
                if (column === 6) {
                  vision[(column - 2) * 8 + row] = 1;
                }
              } else if (pieceData.team === "white") {
                if (column === 1) {
                  vision[(column + 2) * 8 + row] = 1;
                }
              }
            }
            // Knight
            if (pieceData.name === "knight") {
              if (validPosition(column + 2, row + 1)) {
                vision[(column + 2) * 8 + row + 1] = 1;
              }
              if (validPosition(column + 2, row - 1)) {
                vision[(column + 2) * 8 + row - 1] = 1;
              }
              if (validPosition(column - 2, row + 1)) {
                vision[(column - 2) * 8 + row + 1] = 1;
              }
              if (validPosition(column - 2, row - 1)) {
                vision[(column - 2) * 8 + row - 1] = 1;
              }
              if (validPosition(column + 1, row + 2)) {
                vision[(column + 1) * 8 + row + 2] = 1;
              }
              if (validPosition(column + 1, row - 2)) {
                vision[(column + 1) * 8 + row - 2] = 1;
              }
              if (validPosition(column - 1, row + 2)) {
                vision[(column - 1) * 8 + row + 2] = 1;
              }
              if (validPosition(column - 1, row - 2)) {
                vision[(column - 1) * 8 + row - 2] = 1;
              }
            }
            // Bishop
            if (pieceData.name === "bishop" || pieceData.name === "queen") {
              let Acomplete = false;
              let Bcomplete = false;
              let Ccomplete = false;
              let Dcomplete = false;
              for (let index = 1; index < 8; index++) {
                console.log("index =", index);
                console.log("col, row =", column, row);
                if (validPosition(column + index, row + index) && !Acomplete) {
                  vision[(column + index) * 8 + row + index] = 1;
                  // if (
                  //   state.squares[(column + index) * 8 + row + index] !== null
                  // ) {
                  //   Acomplete = true;
                  // }
                }
                if (validPosition(column + index, row - index) && !Bcomplete) {
                  vision[(column + index) * 8 + row - index] = 1;
                  // if (state.squares[(column + index) * 8 + row - index]) {
                  //   Bcomplete = true;

                  // }
                }
                if (validPosition(column - index, row + index) && !Ccomplete) {
                  vision[(column - index) * 8 + row + index] = 1;
                  // if (state.squares[(column - index) * 8 + row + index]) {
                  //   Ccomplete = true;

                  // }
                }
                if (validPosition(column - index, row - index) && !Dcomplete) {
                  vision[(column - index) * 8 + row - index] = 1;
                  // if (state.squares[(column - index) * 8 + row - index]) {
                  //   Dcomplete = true;
                  // }
                }
              }
            }
            // Rook
            if (pieceData.name === "rook" || pieceData.name === "queen") {
              let Acomplete = false;
              let Bcomplete = false;
              let Ccomplete = false;
              let Dcomplete = false;
              for (let index = 1; index < 8; index++) {
                if (validPosition(column + index, row) && !Acomplete) {
                  vision[(column + index) * 8 + row] = 1;
                  // if (state.squares[(column + index) * 8 + row]) {
                  //   Acomplete = true;
                  // }
                }
                if (validPosition(column - index, row) && !Bcomplete) {
                  vision[(column - index) * 8 + row] = 1;
                  // if (state.squares[(column - index) * 8 + row]) {
                  //   Bcomplete = true;
                  // }
                }
                if (validPosition(column, row + index) && !Ccomplete) {
                  vision[column * 8 + row + index] = 1;
                  // if (state.squares[column * 8 + row + index]) {
                  //   Ccomplete = true;
                  // }
                }
                if (validPosition(column, row - index) && !Dcomplete) {
                  vision[column * 8 + row - index] = 1;
                  // if (state.squares[column * 8 + row - index]) {
                  //   Dcomplete = true;
                  // }
                }
              }
            }
            // King see if getting checked
            if (pieceData.name === "king") {
              // Check knights
              if (pieceCheck(column + 2, row + 1, state, "knight")) {
                vision[(column + 2) * 8 + row + 1] = 1;
              }
              if (pieceCheck(column + 2, row - 1, state, "knight")) {
                vision[(column + 2) * 8 + row - 1] = 1;
              }
              if (pieceCheck(column - 2, row + 1, state, "knight")) {
                vision[(column - 2) * 8 + row + 1] = 1;
              }
              if (pieceCheck(column - 2, row - 1, state, "knight")) {
                vision[(column - 2) * 8 + row - 1] = 1;
              }
              if (pieceCheck(column + 1, row + 2, state, "knight")) {
                vision[(column + 1) * 8 + row + 2] = 1;
              }
              if (pieceCheck(column + 1, row - 2, state, "knight")) {
                vision[(column + 1) * 8 + row - 2] = 1;
              }
              if (pieceCheck(column - 1, row + 2, state, "knight")) {
                vision[(column - 1) * 8 + row + 2] = 1;
              }
              if (pieceCheck(column - 1, row - 2, state, "knight")) {
                vision[(column - 1) * 8 + row - 2] = 1;
              }
              // Check bishops
              let Acheck = false;
              for (let index = 1; index < 8; index++) {
                if (validPosition(column + index, row + index)) {
                  if (
                    pieceCheck(column + index, row + index, state, "bishop") ||
                    pieceCheck(column + index, row + index, state, "queen")
                  ) {
                    Acheck = true;
                    break;
                  }
                  if (
                    state.squares[(column + index) * 8 + row + index] !== null
                  ) {
                    break;
                  }
                }
              }
              if (Acheck) {
                for (let index = 1; index < 8; index++) {
                  if (validPosition(column + index, row + index)) {
                    vision[(column + index) * 8 + row + index] = 1;
                    if (
                      pieceCheck(
                        column + index,
                        row + index,
                        state,
                        "bishop"
                      ) ||
                      pieceCheck(column + index, row + index, state, "queen")
                    ) {
                      break;
                    }
                  }
                }
              }
              let Bcheck = false;
              for (let index = 1; index < 8; index++) {
                if (validPosition(column + index, row - index)) {
                  if (
                    pieceCheck(column + index, row - index, state, "bishop") ||
                    pieceCheck(column + index, row - index, state, "queen")
                  ) {
                    Bcheck = true;
                    break;
                  }
                  if (
                    state.squares[(column + index) * 8 + row - index] !== null
                  ) {
                    break;
                  }
                }
              }
              if (Bcheck) {
                for (let index = 1; index < 8; index++) {
                  if (validPosition(column + index, row - index)) {
                    vision[(column + index) * 8 + row - index] = 1;
                    if (
                      pieceCheck(
                        column + index,
                        row - index,
                        state,
                        "bishop"
                      ) ||
                      pieceCheck(column + index, row - index, state, "queen")
                    ) {
                      break;
                    }
                  }
                }
              }
              let Ccheck = false;
              for (let index = 1; index < 8; index++) {
                if (validPosition(column - index, row + index)) {
                  if (
                    pieceCheck(column - index, row + index, state, "bishop") ||
                    pieceCheck(column - index, row + index, state, "queen")
                  ) {
                    Ccheck = true;
                    break;
                  }
                  if (
                    state.squares[(column - index) * 8 + row + index] !== null
                  ) {
                    break;
                  }
                }
              }
              if (Ccheck) {
                for (let index = 1; index < 8; index++) {
                  if (validPosition(column - index, row + index)) {
                    vision[(column - index) * 8 + row + index] = 1;
                    if (
                      pieceCheck(
                        column - index,
                        row + index,
                        state,
                        "bishop"
                      ) ||
                      pieceCheck(column - index, row + index, state, "queen")
                    ) {
                      break;
                    }
                  }
                }
              }
              let Dcheck = false;
              for (let index = 1; index < 8; index++) {
                if (validPosition(column - index, row - index)) {
                  if (
                    pieceCheck(column - index, row - index, state, "bishop") ||
                    pieceCheck(column - index, row - index, state, "queen")
                  ) {
                    Dcheck = true;
                    break;
                  }
                  if (
                    state.squares[(column - index) * 8 + row - index] !== null
                  ) {
                    break;
                  }
                }
              }
              if (Dcheck) {
                for (let index = 1; index < 8; index++) {
                  if (validPosition(column - index, row - index)) {
                    vision[(column - index) * 8 + row - index] = 1;
                    if (
                      pieceCheck(
                        column - index,
                        row - index,
                        state,
                        "bishop"
                      ) ||
                      pieceCheck(column - index, row - index, state, "queen")
                    ) {
                      break;
                    }
                  }
                }
              }
              // Check rooks
              Acheck = false;
              for (let index = 1; index < 8; index++) {
                if (validPosition(column + index, row)) {
                  if (
                    pieceCheck(column + index, row, state, "rook") ||
                    pieceCheck(column + index, row, state, "queen")
                  ) {
                    Acheck = true;
                    break;
                  }
                  if (state.squares[(column + index) * 8 + row] !== null) {
                    break;
                  }
                }
              }
              if (Acheck) {
                for (let index = 1; index < 8; index++) {
                  if (validPosition(column + index, row)) {
                    vision[(column + index) * 8 + row] = 1;
                    if (
                      pieceCheck(column + index, row, state, "rook") ||
                      pieceCheck(column + index, row, state, "queen")
                    ) {
                      break;
                    }
                  }
                }
              }
              Bcheck = false;
              for (let index = 1; index < 8; index++) {
                if (validPosition(column - index, row)) {
                  if (
                    pieceCheck(column - index, row, state, "rook") ||
                    pieceCheck(column - index, row, state, "queen")
                  ) {
                    Bcheck = true;
                    break;
                  }
                  if (state.squares[(column - index) * 8 + row] !== null) {
                    break;
                  }
                }
              }
              if (Bcheck) {
                for (let index = 1; index < 8; index++) {
                  if (validPosition(column - index, row)) {
                    vision[(column - index) * 8 + row] = 1;
                    if (
                      pieceCheck(column - index, row, state, "rook") ||
                      pieceCheck(column - index, row, state, "queen")
                    ) {
                      break;
                    }
                  }
                }
              }
              Ccheck = false;
              for (let index = 1; index < 8; index++) {
                if (validPosition(column, row - index)) {
                  if (
                    pieceCheck(column, row - index, state, "rook") ||
                    pieceCheck(column, row - index, state, "queen")
                  ) {
                    Ccheck = true;
                    break;
                  }
                  if (state.squares[column * 8 + row - index] !== null) {
                    break;
                  }
                }
              }
              if (Ccheck) {
                for (let index = 1; index < 8; index++) {
                  if (validPosition(column, row - index)) {
                    vision[column * 8 + row - index] = 1;
                    if (
                      pieceCheck(column, row - index, state, "rook") ||
                      pieceCheck(column, row - index, state, "queen")
                    ) {
                      break;
                    }
                  }
                }
              }
              Dcheck = false;
              for (let index = 1; index < 8; index++) {
                if (validPosition(column, row + index)) {
                  if (
                    pieceCheck(column, row + index, state, "rook") ||
                    pieceCheck(column, row + index, state, "queen")
                  ) {
                    Dcheck = true;
                    break;
                  }
                  if (state.squares[column * 8 + row + index] !== null) {
                    break;
                  }
                }
              }
              if (Dcheck) {
                for (let index = 1; index < 8; index++) {
                  if (validPosition(column, row + index)) {
                    vision[column * 8 + row + index] = 1;
                    if (
                      pieceCheck(column, row + index, state, "rook") ||
                      pieceCheck(column, row + index, state, "queen")
                    ) {
                      break;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    updateState({ vision });
    // console.log("vision = ", vision);
  } catch (error) {
    console.log(error);
  }
}

function pieceCheck(column, row, state, piece) {
  return (
    validPosition(column, row) &&
    state.squares[column * 8 + row] !== null &&
    state.squares[column * 8 + row].name === piece
  );
}

function validPosition(column, row) {
  return column < 8 && column >= 0 && row < 8 && row >= 0;
}
