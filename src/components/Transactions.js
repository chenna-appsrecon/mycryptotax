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
import axios from "axios";
import FileUpload from "./FileUpload";
import SidebarWithHeader from "./SideNavBar";
import Dropzone from "./Dropzone";
import { APP_URL, headerKeys } from "../constants";
// import { headers } from "../api";

const headers = {
  "Content-Type": "application/json",
};

export const Transactions = () => {
  let token = localStorage.getItem("token");

  const [array, setArray] = useState([]);

  // const headerKeys = Object.keys(Object.assign({}, ...array));

  const fetchTransactions = () => {
    axios
      .get(APP_URL + "gettransactions", {
        headers: { ...headers, "x-access-token": token },
      })
      .then((response) => {
        setArray(response.data);
        // console.log("response", response);
      })
      .catch((err) => console.log("err: ", err));
  };

  const downloadCSV = (csvStr) => {
    var hiddenElement = document.createElement("a");
    // hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csvStr);
    hiddenElement.href = "data:attachment/csv," + csvStr;
    hiddenElement.target = "_blank";
    hiddenElement.download = "MyCryptoTaxDetails.csv";
    hiddenElement.click();
  };
  const exportCSVFromTable = (columns, csvData) => {
    // console.log("columns", columns);
    // console.log("csvData", csvData);
    var csvRow = [];
    var A = [["id", ...columns.map((item) => item)]];
    var re = csvData;

    for (let index = 0; index < re.length; index++) {
      A.push([
        index,
        ...columns.map((item) => {
          return re[index][item];
        }),
      ]);
    }
    // console.log("A", A);
    for (let index = 0; index < A.length; ++index) {
      csvRow.push(A[index].join(","));
    }
    // console.log("csvRow", csvRow);
    var csvString = csvRow.join("%0A");
    // console.log("csvString", csvString);
    downloadCSV(csvString);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <SidebarWithHeader>
      <Flex justifyContent={"space-between"} alignItems={""}>
        <Text fontSize="3xl"> All Transactions list</Text>
        <Button
          mb={6}
          colorScheme="blue"
          mt={4}
          disabled={!(array && array.length > 0)}
          onClick={(e) => {
            exportCSVFromTable(headerKeys, array);
          }}
        >
          Export
        </Button>
      </Flex>
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
                        {headerKeys.map((val, i) => {
                          if (val == "gain") {
                            return (
                              <Td style={{ fontWeight: "bold" }} key={i}>
                                {rowData[val]}
                              </Td>
                            );
                          } else {
                            return <Td key={i}>{rowData[val]}</Td>;
                          }
                        })}
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
