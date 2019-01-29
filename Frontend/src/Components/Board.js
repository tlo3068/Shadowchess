import React, { Component } from "react";
import Piece from "./Piece";
import {
  initialiseBoard,
  getBoardData,
  moveAPiece,
  initVision
} from "./../Controllers/BoardController";
const init2dArray = size => new Array(size).fill(0);

class Board extends Component {
  state = {
    // data: this.props.data,
    // myID: this.props.myID,
    inital_position: null,
    final_position: null,
    team: null,
    vision: init2dArray(64)
  };
  async componentDidMount() {
    this.initBoard();
    this.setState({
      team:
        this.props.state.myID === this.props.state.playerAID ? "white" : "black"
    });
    // initVision(this.props.state, this.updateState);
  }
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    console.log(
      "now",
      this.props.state.squares,
      "previous",
      prevProps.state.squares
    );
    if (this.props.state !== prevProps.state) {
      console.log("changing vision");
      initVision(this.props.state, this.updateState, this.state.team);
    }
  }
  updateState = data => this.setState(data);

  initBoard = async () => {
    console.log("initializing board");
    if (this.props.state.myID === this.props.state.playerAID) {
      await initialiseBoard(this.props.state.socket, {
        boardID: this.props.state.lobbyID
      });
    }
  };
  onDragStart = e => {
    console.log("onDragStart", e.target.parentNode.id);
    let position = e.target.parentNode.id;
    console.log(position);
    this.setState({
      initial_position: e.target.parentNode.id
    });
  };
  onDragOver = e => {
    e.preventDefault();
  };
  onDrop = e => {
    console.log(e.target.id);
    console.log(this.state.side, this.props.state.turn);
    console.log(
      "myID",
      this.props.state.myID,
      "playerAID:",
      this.props.state.playerAID
    );
    let i_position_x = Number(this.state.initial_position.charAt(1));
    let i_position_y = Number(this.state.initial_position.charAt(3));
    let pieceData = this.props.state.squares[
      (i_position_y - 1) * 8 + i_position_x - 1
    ];

    if (
      this.state.team === this.props.state.turn &&
      this.props.state.turn === pieceData.team
    ) {
      let position = e.target.id;
      if (e.target.className === "") {
        position = e.target.parentNode.id;
      }
      this.setState(
        {
          final_position: position
        },
        async () => {
          moveAPiece(this.props.state.socket, {
            boardID: this.props.state.lobbyID,
            i_position_x: Number(this.state.initial_position.charAt(1)),
            i_position_y: Number(this.state.initial_position.charAt(3)),
            f_position_x: Number(this.state.final_position.charAt(1)),
            f_position_y: Number(this.state.final_position.charAt(3))
          });
        }
      );
    } else {
      this.props.setErrorText("Not your turn buddy");
    }
  };

  renderBoard() {
    const board = [];
    for (let i = 1; i < 9; i++) {
      const squareRows = [];
      for (let j = 1; j < 9; j++) {
        const squareShade =
          (isOdd(j) && isOdd(i)) || (!isOdd(j) && !isOdd(i)) ? "dark" : "light";

        if (!this.props.state.squares[(i - 1) * 8 + j - 1]) {
          squareRows.push(
            <Piece
              key={(i - 1) * 8 + j - 1}
              boardID={this.props.state.lobbyID}
              location_x={j}
              location_y={i}
              squareShade={squareShade}
              vision={this.state.vision[(i - 1) * 8 + j - 1]}
            />
          );
        } else {
          squareRows.push(
            <Piece
              key={(i - 1) * 8 + j - 1}
              boardID={this.props.state.lobbyID}
              location_x={j}
              location_y={i}
              name={this.props.state.squares[(i - 1) * 8 + j - 1].name}
              team={this.props.state.squares[(i - 1) * 8 + j - 1].team}
              squareShade={squareShade}
              vision={this.state.vision[(i - 1) * 8 + j - 1]}
            />
          );
        }
      }
      board.push(
        <div
          key={i}
          className="board-row"
          onDragStart={this.onDragStart}
          onDragOver={this.onDragOver}
          onDrop={this.onDrop}
        >
          {squareRows}
        </div>
      );
    }

    return <div>{board}</div>;
  }
  render() {
    return <div>{this.renderBoard()}</div>;
  }
}

export default Board;

function isOdd(num) {
  return num % 2 === 1;
}
