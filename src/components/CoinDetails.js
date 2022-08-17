import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Skeleton,
  Container,
  Badge,
  Button,
  Divider,
  Heading,
  HStack,
  Icon,
  Text,
  Flex,
  useBreakpointValue,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Center,
  Link,
} from "@chakra-ui/react";
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiMoreVertical,
} from "react-icons/fi";
import SidebarWithHeader from "./SideNavBar";
import TableComponent from "./Tables";
import axios from "axios";
import { headers } from "../api";
import { APP_URL, headerKeys } from "../constants";

const API_URL = "https://stockpalapi.glassball.app";

const CoinDetails = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [cryptoData, setCryptoData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [holdings, setHoldings] = useState({});
  const [totalAssets, setTotalAssets] = useState(0);
  const [transactionData, setTransactionData] = useState();
  const [array, setArray] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);
  const fetchTransactions = () => {
    axios
      .get(APP_URL + "gettransaction", { headers: headers })
      .then((response) => {
        setArray(response.data);
        // console.log("response", response);
      })
      .catch((err) => console.log("err: ", err));
  };
  // console.log("transactionData", transactionData);
  return (
    <SidebarWithHeader>
      {/* <Container mb={8}> */}
      <Flex alignItems={"flex-start"} justifyContent="flex-start" mb={6}>
        <Box
          bg="bg-surface"
          borderRadius="lg"
          boxShadow={"0px 12px 40px rgba(16, 24, 64, 0.24)"}
          bgColor={"white"}
          padding={5}
          //   maxWidth={"100%"}
          //   minWidth={"200px"}
        >
          <Box>
            <Stack>
              <HStack justify="space-between">
                <Heading
                  size={useBreakpointValue({
                    base: "sm",
                    md: "md",
                  })}
                >
                  {"USDT"}
                </Heading>

                {/* <Icon as={FiMoreVertical} boxSize="5" color="muted" /> */}
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="muted">
                  {"36"}
                </Text>

                <Badge variant="subtle" colorScheme={true ? "green" : "red"}>
                  <HStack spacing="1">
                    <Icon as={true ? FiArrowUpRight : FiArrowDownRight} />
                    <Text>2</Text>
                  </HStack>
                </Badge>
              </HStack>
              <Text fontSize="sm" color="muted">
                {"Cost Basis: 79"}
              </Text>
              <Text fontSize="sm" color="muted">
                {"Current Price: 79.37"}
              </Text>
            </Stack>
          </Box>
          <Divider />
        </Box>
      </Flex>
      {/* </Container> */}
      <Box bg={"white"} flex="1" p="6">
        <Box
          w="full"
          h="full"
          rounded="lg"
          // border="3px dashed currentColor"
          // color={mode("gray.200", "gray.700")}
        >
          {array.length == 0 && (
            <Center>
              <Flex
                direction={"column"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Text>No Transactions Found! </Text>
                <Text>
                  Please Upload transactions from
                  <Link ms="5px" fontWeight="bold" href={"/fileUpload"}>
                    Add Sources tab
                  </Link>
                </Text>
              </Flex>
            </Center>
          )}
          <TableContainer>
            <Table variant="simple">
              {/* <TableCaption>Preview Data Here</TableCaption> */}
              <Thead>
                <Tr>
                  {array &&
                    array.length > 0 &&
                    headerKeys.map((key, i) => {
                      return <Th key={i}>{key}</Th>;
                    })}
                </Tr>
              </Thead>
              <Tbody>
                {array &&
                  array.length > 0 &&
                  array.map((rowData, i) => {
                    return (
                      <Tr key={i}>
                        {headerKeys.map((val, i) => (
                          <Td key={i}>{rowData[val]}</Td>
                        ))}
                        {/* {keys.map((key) => {
                      return <Td>{rowData[key]}</Td>;
                    })} */}
                      </Tr>
                    );
                  })}
              </Tbody>
              {/* <Tfoot>
            <Tr>
              {headerKeys &&
                headerKeys.length > 0 &&
                headerKeys.map((key) => {
                  return <Th>{key}</Th>;
                })}
            </Tr>
          </Tfoot> */}
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </SidebarWithHeader>
  );
};

export default CoinDetails;
