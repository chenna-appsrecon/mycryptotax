import { Box, Container, SimpleGrid } from "@chakra-ui/react";
import * as React from "react";
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

export const Card = ({ holdings }) => {
  let coins = holdings && Object.keys(holdings);
  console.log("coins", coins);
  console.log("holdings", holdings);
  return (
    <Box
      as="section"
      py={{
        base: "4",
        md: "8",
      }}
    >
      {/* <Container> */}
      <SimpleGrid
        columns={{
          base: 1,
          md: 4,
        }}
        gap={{
          base: "5",
          md: "6",
        }}
      >
        {coins &&
          coins.length > 0 &&
          coins.map((coin, i) => (
            <Stat key={i} id={i} quantity={holdings[coin]} coin={coin} />
          ))}
      </SimpleGrid>
      {/* </Container> */}
    </Box>
  );
};
