import { startBoard, getBoard } from "./../controller/BoardController";

export const initArray = size => new Array(size).fill(null);

export const initialiseChessBoard = async boardID => {
  const squares = initArray(64);

  await startBoard({ boardID });
  let board = await getBoard({ boardID });
  for (let piece of board) {
    squares[(piece.position_y - 1) * 8 + piece.position_x - 1] =
      piece.pieceData;
  }
  console.log("squares", squares);
  return squares;
};
