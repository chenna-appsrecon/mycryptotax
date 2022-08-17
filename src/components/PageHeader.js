import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";

export const PageHeader = ({ totalAssets }) => (
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
          Total Portfolio Value: {totalAssets} Coins
        </Text>
        <Text color="muted" fontSize="sm">
          Overview of all your assets
        </Text>
      </Stack>
    </Box>
  </Box>
);
