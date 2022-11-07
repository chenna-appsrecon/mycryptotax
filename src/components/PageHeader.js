import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export const PageHeader = ({ portfolioValue }) => {
  // const [portfolioValue, setPortfolioValue] = useState("");

  useEffect(() => {
    // if (Object.keys(coinsLatestPrice).length > 0) {
    //   // console.log("coinsLatestPrice", coinsLatestPrice);
    //   // console.log("holdings", holdings);
    //   getPortfolioValue();
    // }
  }, []);

  // const getPortfolioValue = () => {
  //   let value = 0;
  //   Object.values(holdings).map((item) => {
  //     // console.log(item.name, coinsLatestPrice[item.name]);
  //     value =
  //       value +
  //       (coinsLatestPrice[item.name] ? coinsLatestPrice[item.name].inr : 0) *
  //         item.quantity;
  //   });
  //   setPortfolioValue(value);
  // };

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
              <b>
                {"Rs." +
                  `${
                    portfolioValue
                      ? parseFloat(portfolioValue).toFixed(2)
                      : "Calculating..."
                  }`}
              </b>
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
