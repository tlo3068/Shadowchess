import React from "react";
import { Container, Header } from "semantic-ui-react";

const titleStyle = {
  backgroundColor: "#261E1E",
  paddingTop: "25px",
  paddingBottom: "25px"
};

const TitleHeader = () => (
  <Container fluid textAlign="center" style={titleStyle}>
    <Header inverted color="grey">
      Shadow Chess
    </Header>
  </Container>
);

export default TitleHeader;
