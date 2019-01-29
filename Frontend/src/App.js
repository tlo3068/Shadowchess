import React, { Component } from "react";
import Home from "./Components/Home";
import Lobby from "./Components/Lobby";
import Game from "./Components/Game";
import JoinRoom from "./Components/JoinRoom";
import {
  initSocket,
  initSocketMessages
} from "./Controllers/SocketController.js";
import { initPlayer } from "./Controllers/PlayerController.js";
import {
  initLobby,
  joinLobby,
  leaveLobby,
  exitLobby
} from "./Controllers/GameController";
import { getBoardData } from "./Controllers/BoardController";
import TitleHeader from "./Components/Header";
const init2dArray = size => new Array(size).fill(null);
const background = {
  backgroundColor: "#d3cfcf",
  minHeight: "100vh"
};
class App extends Component {
  state = {
    socket: null,
    myID: 1,
    visible: "home",
    // Lobby info
    lobbyID: 1,
    playerAID: 1,
    playerBID: 1,
    // Game info
    running: false,
    turn: "white",
    squares: init2dArray(64)
  };
  async componentDidMount() {
    this.setState({
      socket: await new WebSocket("ws://localhost:5000", "connect")
    });
    await initSocket(this.state.socket, this.updateState, this.state);
    await initSocketMessages(this.state.socket, this.updateState, this.state);
    await initPlayer(this.state.socket);
  }
  async componentDidUpdate(prevProps) {
    await initSocketMessages(this.state.socket, this.updateState, this.state);
    // if (this.props.squares !== prevProps.squares) {
    //   await getBoardData(this.state.socket, {
    //     boardID: this.state.lobbyID
    //     // playerID: this.props.state.myID
    //   });
    // }
  }
  updateState = data => this.setState(data);
  updateVisible = destination => this.setState({ visible: destination });
  lobbyRoom = async condition => {
    if (condition === "create") {
      console.log("Creating lobby room");
      // CreateRoom
      await initLobby(this.state.socket, { playerID: this.state.myID });
    } else if (condition === "join") {
      console.log("Joining lobby room");
    } else if (condition === "leave") {
      console.log("Leaving lobby room");
      if (this.state.myID === this.state.playerBID) {
        await leaveLobby(this.state.socket, {
          playerID: this.state.myID,
          boardID: this.state.lobbyID
        });
      } else {
        await exitLobby(this.state.socket, {
          playerID: this.state.myID,
          boardID: this.state.lobbyID
        });
      }
    }
  };
  renderVisible() {
    if (this.state.visible === "home") {
      return (
        <Home
          state={this.state}
          nav={this.updateVisible}
          lobbyRoom={this.lobbyRoom}
        />
      );
    }
    if (this.state.visible === "lobby") {
      return (
        <Lobby
          state={this.state}
          nav={this.updateVisible}
          lobbyRoom={this.lobbyRoom}
        />
      );
    }
    if (this.state.visible === "game") {
      return <Game state={this.state} nav={this.updateVisible} />;
    }
    if (this.state.visible === "join") {
      return (
        <JoinRoom
          state={this.state}
          nav={this.updateVisible}
          lobbyRoom={this.lobbyRoom}
        />
      );
    }
  }
  render() {
    return (
      <div className="App" style={background}>
        <TitleHeader />
        {this.renderVisible()}
      </div>
    );
  }
}

export default App;
