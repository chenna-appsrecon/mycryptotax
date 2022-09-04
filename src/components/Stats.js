import {
  Badge,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiMoreVertical,
} from "react-icons/fi";

export const Stat = (props) => {
  const {
    label,
    value,
    delta,
    quantity,
    coin,
    id,
    currentPrice,
    grossAmount,
    inr_24h_change,
    ...boxProps
  } = props;
  let ADA = 44.05;
  return (
    <Box
      bg="bg-surface"
      borderRadius="lg"
      boxShadow={"0px 12px 40px rgba(16, 24, 64, 0.24)"}
      {...boxProps}
      bgColor={"white"}
      maxWidth={"100%"}
      minWidth={"200px"}
    >
      <Box
        px={{
          base: "4",
          md: "6",
        }}
        py={{
          base: "5",
          md: "6",
        }}
      >
        <Stack>
          <HStack justify="space-between">
            <Heading
              size={useBreakpointValue({
                base: "sm",
                md: "md",
              })}
            >
              {coin}
            </Heading>

            {/* <Icon as={FiMoreVertical} boxSize="5" color="muted" /> */}
          </HStack>
          <HStack justify="space-between">
            <Text fontSize="sm" color="muted">
              {quantity.toFixed(2)}
            </Text>

            <Badge
              variant="subtle"
              colorScheme={inr_24h_change > 0 ? "green" : "red"}
            >
              <HStack spacing="1">
                <Icon
                  as={inr_24h_change > 0 ? FiArrowUpRight : FiArrowDownRight}
                />
                <Text>{inr_24h_change && inr_24h_change.toFixed(5)}</Text>
              </HStack>
            </Badge>
          </HStack>

          <Text fontSize="sm" color="muted">
            <span>
              Current Price: Rs.<b>{currentPrice}</b>
            </span>
          </Text>
          <Text fontSize="sm" color="muted">
            {"Cost Basis: Rs." + grossAmount}
          </Text>
        </Stack>
      </Box>
      <Divider />
      {/* <Box
        px={{
          base: "4",
          md: "6",
        }}
        py="4"
      >
        <Button variant="link" colorScheme="blue" size="sm">
          Learn more
        </Button>
      </Box> */}
    </Box>
  );
};
