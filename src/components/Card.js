import { Box, Container, Flex, Link } from "@chakra-ui/react";
import * as React from "react";
// import { Link } from "react-router-dom";
import { Stat } from "./Stats";
const stats = [
  {
    label: "Total Subscribers",
    value: "71,887",
    delta: {
      value: "320",
      isUpwardsTrend: true,
    },
  },
  {
    label: "Avg. Open Rate",
    value: "56.87%",
    delta: {
      value: "2.3%",
      isUpwardsTrend: true,
    },
  },
  {
    label: "Avg. Click Rate",
    value: "12.87%",
    delta: {
      value: "0.1%",
      isUpwardsTrend: false,
    },
  },
];

let USDT = 79.35;

export const Card = ({ holdings }) => {
  let coins = holdings && Object.keys(holdings);
  return (
    <Box
      as="section"
      py={{
        base: "4",
        md: "8",
      }}
    >
      {/* <Container> */}
      <Flex
        wrap={"wrap"}
        columns={{
          base: 1,
          md: 5,
        }}
        gap={{
          base: "5",
          md: "6",
        }}
      >
        {coins &&
          coins.length > 0 &&
          coins.map((coin, i) => (
            <Link
              href="/coindetails"
              // as="span"
              ms="5px"
              fontWeight="bold"
            >
              <Stat
                key={i}
                id={i}
                quantity={holdings[coin].quantity}
                grossAmount={holdings[coin].grossAmount}
                coin={coin}
              />
            </Link>
          ))}
      </Flex>
      {/* </Container> */}
    </Box>
  );
};
