import React, { Component } from "react";

class Piece extends Component {
  renderPiece() {
    if (this.props.vision === 1) {
      if (this.props.name !== undefined && this.props.team !== undefined) {
        const myImg = require("./../sprites/" +
          this.props.name +
          this.props.team +
          ".png");
        return (
          <div
            className={"tile " + this.props.squareShade}
            id={"x" + this.props.location_x + "y" + this.props.location_y}
          >
            <img
              draggable="true"
              onDragOver={this.props.onDragOver}
              onDragStart={this.props.onDragStart}
              onDragEnd={this.props.onDragEnd}
              onDrop={this.props.onDrop}
              src={myImg}
              alt="Piece"
            />
          </div>
        );
      } else {
        return (
          <div
            className={"tile " + this.props.squareShade}
            id={"x" + this.props.location_x + "y" + this.props.location_y}
          />
        );
      }
    } else {
      return (
        <div
          className={"tile " + this.props.squareShade + " darker-span"}
          id={"x" + this.props.location_x + "y" + this.props.location_y}
        />
      );
    }
  }
  render() {
    return <div>{this.renderPiece()}</div>;
  }
}

export default Piece;
