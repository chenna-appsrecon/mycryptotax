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
  Center,
  Text,
  useColorModeValue as mode,
  Select,
  Flex,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  NumberInput,
  NumberInputField,
  Input,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useTable, useSortBy } from "react-table";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import axios from "axios";
import FileUpload from "./FileUpload";
import SidebarWithHeader from "./SideNavBar";
import Dropzone from "./Dropzone";
import { APP_URL, headerKeys } from "../constants";
import { symbolDetails } from "../Coindeckodetails";
// import { headers } from "../api";

const headers = {
  "Content-Type": "application/json",
};

export const Transactions = () => {
  let token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [wholedata, setWholeData] = useState([]);
  const [array, setArray] = useState([]);
  const [value, setValue] = useState("all");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCoin, setSelectedCoin] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [selectedTradeType, setSelectedTradeType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brokerage, setBrokerage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isCoinError, setIsCoinError] = useState("");
  const [isDateError, setIsDateError] = useState("");
  const [isQuantityError, setIsQuantityError] = useState("");
  const [isBrokerageError, setIsBrokerageError] = useState("");
  const [isCurrencyError, setIsCurrencyError] = useState("");
  const [isTradeTypeError, setIsTradeTypeError] = useState("");
  const [isPlatformError, setIsPlatformError] = useState("");
  const [transactionSuccess, setTransactionSuccess] = useState("");
  const [isLoadingTransaction, setisLoadingTransaction] = useState(false);

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [coinsList, setCoinsList] = useState(Object.keys(symbolDetails));
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
        Header: "Platform",
        accessor: "platform",
      },
      {
        Header: "Gross Amount",
        accessor: "grossAmount",
      },
      // {
      //   Header: "Cost Basis",
      //   accessor: "costBasis",
      // },
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
  const handleSelectedDate = (e) => {
    console.log(e.target.value);
    setSelectedDate(e.target.value);
    if (isDateError) setIsDateError("");
  };
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );
  // const headerKeys = Object.keys(Object.assign({}, ...array));

  const fetchTransactions = () => {
    axios
      .get(APP_URL + "gettransactions", {
        headers: { ...headers, "x-access-token": token },
      })
      .then((response) => {
        setData(response.data);
        setWholeData(response.data);
        // setArray(response.data);
        // console.log("response", response);
      })
      .catch((err) => console.log("err: ", err));
  };

  const handleAddTransaction = () => {
    setisLoadingTransaction(true);
    if (!selectedDate) {
      setIsDateError("error");
    }
    if (!quantity) {
      setIsQuantityError("error");
    }
    if (!brokerage) {
      setIsBrokerageError("error");
    }
    if (!selectedCurrency) {
      setIsCurrencyError("error");
    }
    if (!selectedTradeType) {
      setIsTradeTypeError("error");
    }
    if (!selectedCoin) {
      setIsCoinError("error");
    }
    if (!selectedPlatform) {
      setIsPlatformError("error");
    }

    if (
      isDateError ||
      isQuantityError ||
      brokerage == "" ||
      isCurrencyError ||
      isTradeTypeError ||
      isCoinError ||
      isPlatformError
    ) {
      setValidationError(true);
      setisLoadingTransaction(false);
      return;
    }
    // else {
    //   setIsDateError("");
    //   setIsQuantityError("");
    //   setIsBrokerageError("");
    //   setIsCurrencyError("");
    //   setIsTradeTypeError("");
    //   setIsCoinError("");
    //   setIsPlatformError("");
    // }
    setValidationError("");

    axios
      .post(
        APP_URL + "addtransaction",
        {
          securityName: selectedCoin,
          quantity: quantity,
          transactionDate: selectedDate,
          platform: selectedPlatform,
          tradeType: selectedTradeType,
          feePaidIn: selectedCurrency,
          brokerage: brokerage,
        },
        { headers: { ...headers, "x-access-token": token } }
      )
      .then((response) => {
        // let data = response.data;
        // setGraphData(data);
        setisLoadingTransaction(false);
        setTransactionSuccess(true);
        fetchTransactions();
        setTimeout(() => {
          setTransactionSuccess("");
          onClose();
        }, 2000);
        // console.log("reqData", response);
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

  const handleGivenQuantity = (e) => {
    setQuantity(e.target.value);
    if (isQuantityError) setIsQuantityError("");
  };
  const handleGivenBrokerage = (e) => {
    setBrokerage(e.target.value);
    if (isBrokerageError) setIsBrokerageError("");
  };

  const firstPageRows = rows;
  // console.log("firstPageRows", firstPageRows);

  return (
    <SidebarWithHeader>
      <Flex justifyContent={"flex-end"} alignItems={"flex-start"}>
        <Select
          // placeholder="Select Exchange"
          value={value}
          width={"fit-content"}
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
      </Flex>

      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Text fontSize="3xl"> All Transactions list</Text>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Button colorScheme="teal" variant="outline" onClick={onOpen}>
            + Add Transaction
          </Button>
          <Button
            // mb={6}
            marginLeft={5}
            colorScheme="blue"
            // mt={4}
            disabled={!(data && data.length > 0)}
            onClick={(e) => {
              exportCSVFromTable(headerKeys, data);
            }}
          >
            Export
          </Button>
        </Flex>
      </Flex>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {validationError ? (
              <p style={{ color: "red" }}>Please fill all fields</p>
            ) : (
              ""
            )}

            {/* <form onSubmit={handleSubmit}> */}
            <FormControl isRequired>
              <FormLabel>Coin</FormLabel>
              <Select
                isInvalid={isCoinError == "error"}
                placeholder="Select Coin"
                value={selectedCoin}
                onChange={(e) => {
                  setSelectedCoin(e.target.value);
                  if (isCoinError) {
                    setIsCoinError("");
                  }
                }}
              >
                {coinsList &&
                  coinsList.length > 0 &&
                  coinsList.map((item, i) => (
                    <option key={i}>{item.toUpperCase()}</option>
                  ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>TradeType</FormLabel>
              <Select
                isInvalid={isTradeTypeError == "error"}
                placeholder="Select TradeType"
                value={selectedTradeType}
                onChange={(e) => {
                  setSelectedTradeType(e.target.value);
                }}
              >
                <option>Deposit</option>
                <option>Withdrawl</option>
                <option>Buy</option>
                <option>Sell</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Platform</FormLabel>
              <Select
                isInvalid={isPlatformError == "error"}
                placeholder="Select Platform"
                value={selectedPlatform}
                onChange={(e) => {
                  setSelectedPlatform(e.target.value);
                  if (isPlatformError) {
                    setIsPlatformError("");
                  }
                }}
              >
                <option>Wazirx</option>
                <option>Zebpay</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Fee Paid In</FormLabel>
              <Select
                isInvalid={isCurrencyError == "error"}
                placeholder="Select currency"
                value={selectedCurrency}
                onChange={(e) => {
                  setSelectedCurrency(e.target.value);
                  if (isCurrencyError) {
                    setIsCurrencyError("");
                  }
                }}
              >
                <option>INR</option>
                {/* <option>BTC</option> */}
              </Select>
            </FormControl>
            <FormControl isRequired isInvalid={isDateError == "error"}>
              <FormLabel>Transaction date</FormLabel>
              <Input
                placeholder="Select Date"
                size="md"
                type="date"
                value={selectedDate}
                onChange={handleSelectedDate}
              />
              {!isDateError == "error" ? (
                <FormHelperText>Select Date of transaction</FormHelperText>
              ) : (
                <FormErrorMessage>Date is required.</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired isInvalid={isQuantityError == "error"}>
              <FormLabel>Quantity</FormLabel>
              <NumberInput min={0} value={quantity}>
                <NumberInputField onChange={handleGivenQuantity} />
              </NumberInput>
            </FormControl>
            <FormControl isRequired isInvalid={isBrokerageError == "error"}>
              <FormLabel>Brokerage</FormLabel>
              <NumberInput min={0} value={brokerage}>
                <NumberInputField onChange={handleGivenBrokerage} />
              </NumberInput>
            </FormControl>
            {/* </form> */}
          </ModalBody>
          {transactionSuccess && (
            <Alert status="success">
              <AlertIcon />
              Added New Transaction
            </Alert>
          )}
          <ModalFooter>
            <Button
              colorScheme="blue"
              isLoading={isLoadingTransaction}
              mr={3}
              onClick={() => handleAddTransaction()}
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
