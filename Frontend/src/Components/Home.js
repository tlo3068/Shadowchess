import React, { Component } from "react";
import { Button, Container, Header } from "semantic-ui-react";

const divStyle = {
  backgroundColor: "#d3cfcf",
  paddingTop: "25px",
  paddingBottom: "25px"
};
class Home extends Component {
  state = {};

  render() {
    return (
      <div>
        <Container fluid textAlign="center" style={divStyle}>
          <Header>Home</Header>
          <Button
            basic
            color="violet"
            onClick={() => {
              this.props.lobbyRoom("create");
              // this.props.nav("lobby");
            }}
          >
            Create Game
          </Button>
          <Button basic color="violet" onClick={() => this.props.nav("join")}>
            Join Game
          </Button>
        </Container>
      </div>
    );
  }
}

export default Home;
