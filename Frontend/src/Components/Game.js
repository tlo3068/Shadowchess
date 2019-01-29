import React, { Component } from "react";
import Board from "./Board";
// import { initialiseChessBoard } from "./InitialiseChessBoard";
import { Grid, Container } from "semantic-ui-react";

const divStyle = {
  // paddingTop: "25px",
  // paddingBottom: "25px",
  padding: "25px"
};

class Game extends Component {
  state = {
    errorText: ""
  };

  setErrorText = text => {
    this.setState({
      errorText: text
    });
  };
  showTurn = () => {
    return <div>{this.props.state.turn}</div>;
  };
  render() {
    return (
      <div>
        <Container fluid style={divStyle}>
          <Grid divided="vertically">
            <Grid.Row columns={2}>
              <Grid.Column style={{ minWidth: "600px" }}>
                <Board
                  state={this.props.state}
                  setErrorText={this.setErrorText}
                />
              </Grid.Column>
              <Grid.Column>
                <p>Game Board</p>
                <div>
                  Current turn:
                  {this.showTurn()}
                </div>
                <div>{this.state.errorText}</div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default Game;
