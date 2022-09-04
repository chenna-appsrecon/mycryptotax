import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Box,
  Container,
  Center,
  HStack,
  Icon,
  Square,
  Text,
  useColorModeValue as mode,
  VStack,
  Flex,
  Link,
} from "@chakra-ui/react";
let headerKeys = [
  "Asset",
  "Purchased value",
  "Current Price",
  "Holdings",
  "Current Value",
];

const PortfolioTable = ({ holdings, coinsLatestPrice }) => {
  const [array, setArray] = useState([]);
  useEffect(() => {
    getHoldingsDetails();
  }, [coinsLatestPrice, holdings]);

  const getHoldingsDetails = () => {
    let data = [];
    Object.keys(holdings).map((key) => {
      let obj = {};
      obj["Asset"] = key;
      obj["Holdings"] = holdings[key].quantity;
      obj["Purchased value"] = holdings[key].grossAmount;
      obj["Current Value"] =
        coinsLatestPrice[holdings[key].name.toLowerCase()] &&
        coinsLatestPrice[holdings[key].name.toLowerCase()].inr *
          holdings[key].quantity;
      obj["Current Price"] =
        coinsLatestPrice[holdings[key].name.toLowerCase()] &&
        coinsLatestPrice[holdings[key].name.toLowerCase()].inr;
      data.push(obj);
    });
    setArray(data);
  };

  return (
    <Box flex="1" p="6">
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
  );
};

export default PortfolioTable;
