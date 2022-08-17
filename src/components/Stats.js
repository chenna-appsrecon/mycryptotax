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
  const { label, value, delta, quantity, coin, id, grossAmount, ...boxProps } =
    props;
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

            <Badge variant="subtle" colorScheme={id % 2 == 0 ? "green" : "red"}>
              <HStack spacing="1">
                <Icon as={id % 2 == 0 ? FiArrowUpRight : FiArrowDownRight} />
                <Text>{id}</Text>
              </HStack>
            </Badge>
          </HStack>
          <Text fontSize="sm" color="muted">
            {"Cost Basis: " + grossAmount}
          </Text>
          <Text fontSize="sm" color="muted">
            {"Current Price: 79.37"}
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
