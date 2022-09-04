import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export const PageHeader = ({ totalAssets, holdings, coinsLatestPrice }) => {
  const [portfolioValue, setPortfolioValue] = useState("");

  // console.log(coinsLatestPrice);
  // console.log(holdings);

  useEffect(() => {
    getPortfolioValue();
  }, [coinsLatestPrice]);

  const getPortfolioValue = () => {
    let value = 0;
    Object.values(holdings).map((item) => {
      value = value + coinsLatestPrice[item.name].inr * item.quantity;
    });
    setPortfolioValue(value);
  };

  return (
    <Box
      as="section"
      // pt={{
      //   base: "4",
      //   md: "8",
      // }}
      // pb={{
      //   base: "12",
      //   md: "24",
      // }}
      // bgColor="white"
    >
      <Box
        bg="bg-surface"
        //   px={{
        //     base: "4",
        //     md: "6",
        //   }}
        //   py="5"
        //   boxShadow={useColorModeValue("sm", "sm-dark")}
        //   borderTopWidth="4px"
        //   borderColor="accent"
      >
        <Stack spacing="1">
          <Text fontSize="lg" fontWeight="medium">
            <span style={{ fontSize: "1.5em" }}>
              <b>{"Rs." + portfolioValue}</b>
            </span>
          </Text>
          <Text color="muted" fontSize="sm">
            Your Portfolio Value
          </Text>
        </Stack>
      </Box>
    </Box>
  );
};
