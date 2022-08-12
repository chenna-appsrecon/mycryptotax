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
  const { label, value, delta, quantity, coin, id, ...boxProps } = props;
  return (
    <Box
      bg="bg-surface"
      borderRadius="lg"
      boxShadow={useColorModeValue("sm", "sm-dark")}
      {...boxProps}
      bgColor={"white"}
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
            <Text fontSize="sm" color="muted">
              {quantity}
            </Text>
            <Icon as={FiMoreVertical} boxSize="5" color="muted" />
          </HStack>
          <HStack justify="space-between">
            <Heading
              size={useBreakpointValue({
                base: "sm",
                md: "md",
              })}
            >
              {coin}
            </Heading>
            <Badge variant="subtle" colorScheme={id % 2 == 0 ? "green" : "red"}>
              <HStack spacing="1">
                <Icon as={id % 2 == 0 ? FiArrowUpRight : FiArrowDownRight} />
                <Text>{id}</Text>
                {console.log(quantity)}
                {console.log(id)}
              </HStack>
            </Badge>
          </HStack>
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
