import React, { useEffect, useState } from "react";
import axios from "axios";
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
  Text,
  useColorModeValue as mode,
  Select,
  Flex,
  Link,
} from "@chakra-ui/react";
import { useTable, useSortBy } from "react-table";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import FileUpload from "./FileUpload";
import SidebarWithHeader from "./SideNavBar";
import Dropzone from "./Dropzone";
import { APP_URL } from "../constants";
import { headers } from "../api";

const headerKeys = [
  "securityName",
  "quantity",
  "feePaidIn",
  "tradeType",
  "platform",
  "transactionDate",
  "gain",
  // "grossAmount",
  "costBasis",
  "currentValue",
  // "difference",
  "TDS",
  // "expiryDate",
  // "optionStrike",
  // "optionType",
  // "settlementDate",
  // "serviceTax",
  // "stt",
  // "fees",
  // "otherCharges",
  // "fileRef",
];
export const ProfitLossTransactions = () => {
  const [data, setData] = useState([]);
  const [wholedata, setWholeData] = useState([]);
  const [value, setValue] = useState("all");
  // const headerKeys = Object.keys(Object.assign({}, ...data));
  const columns = React.useMemo(
    () => [
      {
        Header: "Security Name",
        accessor: "securityName",
      },
      {
        Header: "Quantity",
        accessor: "quantity",
      },
      {
        Header: "FeePaidIn",
        accessor: "feePaidIn",
      },
      {
        Header: "Trade Type",
        accessor: "tradeType",
      },
      {
        Header: "Transaction Date",
        accessor: "transactionDate",
      },
      {
        Header: "Gain",
        accessor: "gain",
      },
      {
        Header: "Cost Basis",
        accessor: "costBasis",
      },
      {
        Header: "Current Value",
        accessor: "currentValue",
      },
      {
        Header: "TDS",
        accessor: "TDS",
      },
    ],
    []
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );

  const fetchPLTransactions = () => {
    axios
      .post(
        APP_URL + "getprofitlossposition",
        {
          parameter: "zebpay",
        },
        { headers: headers }
      )
      .then((response) => {
        setData(response.data.profitLossTransactions);
        setWholeData(response.data.profitLossTransactions);
        // console.log("getprofitlossposition: ", response);
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
    fetchPLTransactions();
  }, []);

  const handleFilter = (platform) => {
    console.log(platform);
    let reqData = [...wholedata];

    if (platform !== "all") {
      let res = reqData.filter((item) => item.platform == platform);
      setData(res);
    } else {
      setData(reqData);
    }
  };

  const firstPageRows = rows.slice(0, 20);

  return (
    <SidebarWithHeader>
      <Flex justifyContent={"space-between"} alignItems={""}>
        <Text fontSize="3xl">All Profit loss positions list</Text>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Select
            // placeholder="Select Exchange"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              handleFilter(e.target.value);
            }}
            style={{ marginBottom: "0.5em" }}
          >
            <option value="all">ALL</option>
            <option value="wazirx">Wazirx</option>
            <option value="zebpay">Zebpay</option>
          </Select>
          <Button
            mb={6}
            marginLeft={3}
            colorScheme="blue"
            mt={4}
            disabled={!(data && data.length > 0)}
            onClick={(e) => {
              exportCSVFromTable(headerKeys, data);
            }}
          >
            Export
          </Button>
        </Flex>
      </Flex>
      <Box bg={"white"} flex="1" p="6">
        <Box
          w="full"
          h="full"
          rounded="lg"
          // border="3px dashed currentColor"
          // color={mode("gray.200", "gray.700")}
        >
          {data.length == 0 && (
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
            <Table {...getTableProps()} variant="simple">
              <Thead>
                {headerGroups.map((headerGroup) => (
                  <Tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      // Add the sorting props to control sorting. For this example
                      // we can add them into the header props
                      <Th
                        userSelect="none"
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        <Flex alignItems="center">
                          {column.render("Header")}
                          {/* Add a sort direction indicator */}
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <ChevronDownIcon ml={1} w={4} h={4} />
                            ) : (
                              <ChevronUpIcon ml={1} w={4} h={4} />
                            )
                          ) : (
                            ""
                          )}
                        </Flex>
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody {...getTableBodyProps()}>
                {firstPageRows.map((row, i) => {
                  prepareRow(row);
                  return (
                    <Tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <Td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })}
              </Tbody>
              {/* <Tbody {...getTableBodyProps()}>
                {data &&
                  data.length > 0 &&
                  data.map((rowData, i) => {
                    return (
                      <Tr key={i}>
                        {headerKeys.map((val, i) => {
                          if (val == "gain") {
                            if (parseInt(rowData[val]) < 0) {
                              return (
                                <Td
                                  style={{
                                    color: "#FF0000",
                                    fontWeight: "bold",
                                  }}
                                  key={i}
                                >
                                  {parseFloat(rowData[val]).toFixed(2)}
                                </Td>
                              );
                            } else if (parseInt(rowData[val]) > 0) {
                              return (
                                <Td
                                  style={{
                                    color: "#5AC53B",
                                    fontWeight: "bold",
                                  }}
                                  key={i}
                                >
                                  {parseFloat(rowData[val]).toFixed(2)}
                                </Td>
                              );
                            } else {
                              return <Td key={i}>{rowData[val]}</Td>;
                            }
                          } else {
                            return <Td key={i}>{rowData[val]}</Td>;
                          }
                        })}
                      </Tr>
                    );
                  })}
              </Tbody> */}
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
