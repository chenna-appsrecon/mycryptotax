import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { FiUploadCloud } from "react-icons/fi";
// import { FiUploadCloud } from "react-icons/fi";

function FileUpload() {
  const [file, setFile] = useState();
  const [array, setArray] = useState([]);

  const fileReader = new FileReader();

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
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

    setArray(array);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };
      fileReader.readAsText(file);
    }
  };

  const headerKeys = Object.keys(Object.assign({}, ...array));

  return (
    <div style={{ textAlign: "center" }}>
      <Container maxW="container.sm" bg="white" p={"20px"}>
        <Center
          borderWidth="1px"
          borderRadius="lg"
          px="6"
          s
          py="4"
          bg={mode("white", "gray.800")}
        >
          <VStack spacing="3">
            <Square size="10" bg="bg-subtle" borderRadius="lg">
              <Icon as={FiUploadCloud} boxSize="5" color="muted" />
            </Square>
            <label class="custom-file-upload">
              <center style={{ textAlignLast: "center" }}>
                <input
                  accept="text/csv"
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

        <Button
          mt={4}
          //   disabled={!(array && array.length > 0)}
          onClick={(e) => {
            handleOnSubmit(e);
          }}
        >
          Preview
        </Button>
      </Container>
      <br />
      <Box bg={"white"} flex="1" p="6">
        <Box
          w="full"
          h="full"
          rounded="lg"
          //   border="3px dashed currentColor"
          color={mode("gray.200", "gray.700")}
        >
          <TableContainer>
            <Table variant="simple">
              {/* <TableCaption>Preview Data Here</TableCaption> */}
              <Thead>
                <Tr>
                  {headerKeys &&
                    headerKeys.length > 0 &&
                    headerKeys.map((key) => {
                      return <Th>{key}</Th>;
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
                          <Td>{val}</Td>
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
