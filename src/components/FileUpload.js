import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  Stack,
  Select,
} from "@chakra-ui/react";
import { FiMonitor, FiMoon, FiSun } from "react-icons/fi";
import { FiUploadCloud } from "react-icons/fi";
import axios from "axios";
import { APP_URL, headerKeys } from "../constants";
import { headers } from "../api";
import { CustomSelect } from "./CustomSelect";
import { Option } from "./Option";
// import { FiUploadCloud } from "react-icons/fi";

function FileUpload() {
  const [files, setFile] = useState("");
  const [array, setArray] = useState([]);
  const [value, setValue] = useState("zebpay");
  const [isLoading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dataUploaded, setDataUploaded] = useState(false);
  const [colorMode, setColorMode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const titleColor = mode("teal.300", "teal.200");
  const fileReader = new FileReader();

  const handleOnChange = (e) => {
    setFile(e.target.files);
    console.log(e.target.files);
  };

  const csvFileToArray = (string) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map((i) => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });
    // console.log("array", array);
    setArray(array);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    formData.append("name", value);
    // console.log("files", files);
    // console.log("formData", formData);
    axios
      .post(APP_URL + "upload", formData, { headers: headers })
      .then((response) => {
        // console.log("response", response);
        setDataUploaded(true);
        // setLoading(false);
        handleProftfolio();
        // onOpen();
        // setTimeout(() => {
        //   navigate("/transactions");
        // }, 3000);
      })
      .catch((err) => {
        console.log("err: ", err);
        setError(err);
      });
  };
  const handleProftfolio = () => {
    axios
      .get(APP_URL + "getportfoliodata", { headers: headers })
      .then((response) => {
        console.log(response);
        setLoading(false);
        onOpen();
        setTimeout(() => {
          navigate("/transactions");
        }, 3000);
      })
      .catch((err) => console.log("err: ", err));
  };
  const handleTransactions = () => {
    fetch(APP_URL + "getportfoliodata", {
      method: "GET",
      headers: headers,
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        setLoading(false);
        onOpen();
        setTimeout(() => {
          navigate("/transactions");
        }, 3000);
      })
      .catch((err) => console.log(err));
  };

  const handlePreview = (e) => {
    e.preventDefault();
    if (files && files[0]) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        // console.log("text", text);
        csvFileToArray(text);
      };
      fileReader.readAsText(files[0]);
    }
  };

  const onCloseModal = () => {
    onClose();
    navigate("/transactions");
  };
  console.log("setValue", value);
  return (
    <div style={{ textAlign: "center" }}>
      <Container maxW="container.sm" bg="white" p={"20px"}>
        <Center
          borderWidth="1px"
          borderRadius="lg"
          px="6"
          py="4"
          bg={mode("white", "gray.800")}
        >
          <VStack spacing="3">
            {/* <FormControl id="colormode">
              <FormLabel>ColorMode</FormLabel>
              <CustomSelect
                name="ColorMode"
                colorScheme="blue"
                value={colorMode}
                onChange={setColorMode}
                placeholder="Select a color mode"
              >
                <Option value="light">
                  <HStack>
                    <Icon as={FiSun} />
                    <Text>Light</Text>
                  </HStack>
                </Option>
                <Option value="dark">
                  <HStack>
                    <Icon as={FiMoon} />
                    <Text>Dark</Text>
                  </HStack>
                </Option>
                <Option value="system">
                  <HStack>
                    <Icon as={FiMonitor} />
                    <Text>System</Text>
                  </HStack>
                </Option>
              </CustomSelect>
            </FormControl> */}
            <Select
              placeholder="Select Exchange"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            >
              {/* <option value="wazirx">Wazirx</option> */}
              <option value="zebpay">Zebpay</option>
            </Select>
            <Square size="10" bg="bg-subtle" borderRadius="lg">
              <Icon as={FiUploadCloud} boxSize="5" color="muted" />
            </Square>
            <label className="custom-file-upload">
              <center style={{ textAlignLast: "center" }}>
                <input
                  accept=".csv"
                  onDragEnter={handleOnChange}
                  onChange={handleOnChange}
                  name="File Upload"
                  type="file"
                  tabIndex="-1"
                />
              </center>
            </label>
            <VStack spacing="1">
              <HStack spacing="1" whiteSpace="nowrap">
                {/* <Button variant="link" colorScheme="blue" size="sm">
                  Click to upload
                </Button> */}
                <Text fontSize="sm" color="muted">
                  Click to upload
                </Text>
                <Text fontSize="sm" color="muted">
                  or drag and drop
                </Text>
              </HStack>
              <Text fontSize="xs" color="muted">
                PNG, JPG or GIF up to 2MB
              </Text>
            </VStack>
          </VStack>
        </Center>
        <Flex
          w="100%"
          maxW="1044px"
          mx="auto"
          justifyContent="space-around"
          pt={{ sm: "100px", md: "0px" }}
        >
          <Button
            mt={4}
            //   disabled={!(array && array.length > 0)}
            onClick={(e) => {
              handlePreview(e);
            }}
            disabled={!files}
          >
            Preview
          </Button>
          <Button
            mt={4}
            //   disabled={!(array && array.length > 0)}
            onClick={(e) => {
              handleOnSubmit(e);
            }}
            disabled={!files}
          >
            Upload
          </Button>
        </Flex>
      </Container>
      <br />
      {isLoading && !dataUploaded && !error && (
        <Center bg="lightblue" h="100px" color="white">
          Uploading document
        </Center>
      )}
      {error && (
        <Alert status="error" variant="subtle" mb={5}>
          <AlertIcon />
          Something went wrong, please try later
        </Alert>
      )}
      {dataUploaded && (
        <Alert status="success" variant="subtle" mb={5}>
          <AlertIcon />
          Data uploaded successfully!
        </Alert>
      )}
      {dataUploaded && !error && (
        <Center bg="lightblue" h="100px" color="white">
          Processing transactions, Please wait!
        </Center>
      )}
      {isLoading && (
        <>
          <Progress size="xs" isIndeterminate />
        </>
      )}

      <Modal
        isCentered
        onClose={onCloseModal}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton /> */}
          <ModalBody p={3}>
            <Alert
              status="success"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="200px"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Document uploaded successfully!
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                Thanks for submitting your transactions, You will see your tax
                details under transactions tab.
              </AlertDescription>
            </Alert>
          </ModalBody>
          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
      {array && array.length > 0 && (
        <Box bg={"white"} flex="1" p="6">
          <Box
            w="full"
            h="full"
            rounded="lg"
            // border="3px dashed currentColor"
            // color={mode("gray.200", "gray.700")}
          >
            <TableContainer>
              <Table variant="simple">
                {/* <TableCaption>Preview Data Here</TableCaption> */}
                <Thead>
                  <Tr>
                    {array &&
                      array.length > 0 &&
                      Object.keys(array[0]).map((key, i) => {
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
                          {Object.values(rowData).map((val, i) => (
                            <Td key={i}>{val}</Td>
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
      )}
      {/* <table>
        <thead>
          <tr key={"header"}>
            {headerKeys.map((key) => (
              <th>{key}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {array.map((item) => (
            <tr key={item.id}>
              {Object.values(item).map((val, i) => (
                <td key={i}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
}

export default FileUpload;
