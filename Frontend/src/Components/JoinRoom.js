import React, { Component } from "react";
import { joinLobby } from "./../Controllers/GameController";
import { Button, Input, Container, Header } from "semantic-ui-react";

const divStyle = {
  backgroundColor: "#939090",
  paddingTop: "25px",
  paddingBottom: "25px",
  height: "500px",
  width: "500px"
};

class JoinRoom extends Component {
  state = {
    roomNumber: ""
  };
  joinGameHandler = async () => {
    this.props.lobbyRoom("join");
    await joinLobby(this.props.state.socket, {
      playerID: this.props.state.myID,
      boardID: this.state.roomNumber
    });
    this.setState({
      roomNumber: ""
    });
  };
  render() {
    return (
      <div>
        <Container textAlign="center" style={divStyle}>
          <Header>Join Room</Header>
          <Input
            type="text"
            placeholder="Enter Room Number"
            onChange={evt => {
              this.setState({ roomNumber: evt.target.value });
            }}
            value={this.state.roomNumber}
          />

          <br />
          <Button basic color="violet" onClick={this.joinGameHandler}>
            Join Game
          </Button>

          <br />
          <Button basic color="violet" onClick={() => this.props.nav("home")}>
            Go Home
          </Button>
        </Container>
      </div>
    );
  }
}

export default JoinRoom;
