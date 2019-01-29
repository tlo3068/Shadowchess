import React, { Component } from "react";
import { startLobby } from "./../Controllers/GameController";
import { Button, Container, Header, Segment } from "semantic-ui-react";
const divStyle = {
  backgroundColor: "#d3cfcf",
  paddingTop: "25px",
  paddingBottom: "25px"
};

class Lobby extends Component {
  state = {};
  async componentDidMount() {}

  renderPlayers = () => {
    if (this.props.state.playerBID === null) {
      return (
        <div>
          {/* <Segment.Group> */}
          <Segment inverted>
            <p>Player 1 - </p>
            <p>{this.props.state.playerAID}</p>
          </Segment>
          <Segment inverted>
            <p>Player 2 - </p>
            <p>Not connected</p>
          </Segment>
          {/* </Segment.Group> */}
        </div>
      );
    } else {
      return (
        <div>
          {/* <Segment.Group> */}
          <Segment inverted>
            <p>Player 1 - </p>
            <p>{this.props.state.playerAID}</p>
          </Segment>
          <Segment inverted>
            <p>Player 2 - </p>
            <p>{this.props.state.playerBID}</p>
          </Segment>
          {/* </Segment.Group> */}
        </div>
      );
    }
  };
  startGameHandler = async () => {
    await startLobby(this.props.state.socket, {
      boardID: this.props.state.lobbyID
    });
  };
  leaveLobbyHandler = async () => {
    this.props.lobbyRoom("leave");
    this.props.nav("home");
  };
  renderStartButton = () => {
    if (this.props.state.myID === this.props.state.playerAID) {
      return (
        <Button basic color="violet" onClick={this.startGameHandler}>
          Start Game
        </Button>
      );
    }
  };
  render() {
    return (
      <div>
        <Container style={divStyle}>
          <Header>Lobby</Header>
          {this.renderPlayers()}
          <p>Room ID = {this.props.state.lobbyID}</p>
          {this.renderStartButton()}
          <Button basic color="violet" onClick={this.leaveLobbyHandler}>
            Home
          </Button>
        </Container>
      </div>
    );
  }
}

export default Lobby;
