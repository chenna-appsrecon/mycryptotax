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
} from "@chakra-ui/react";
import { headerKeys } from "../../constants";

const TableComponent = ({ tableData }) => {
  const [data, setData] = useState(tableData);
  let keys = [];

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  if (data && data.length) {
    keys = Object.keys(data[0]);
  }
  return (
    <TableContainer>
      <Table variant="simple">
        {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
        <Thead>
          <Tr>
            {keys &&
              keys.length > 0 &&
              keys.map((key, i) => {
                return <Th key={i}>{key}</Th>;
              })}
          </Tr>
        </Thead>
        <Tbody>
          {data &&
            data.length > 0 &&
            data.map((rowData, i) => {
              return (
                <Tr key={i}>
                  {keys.map((key, i) => {
                    if (key == "at") {
                      return <Td>{new Date(rowData[key]).toDateString()}</Td>;
                    }
                    return <Td key={i}>{rowData[key].toUpperCase()}</Td>;
                  })}
                </Tr>
              );
            })}
        </Tbody>
        <Tfoot>
          <Tr>
            {keys &&
              keys.length > 0 &&
              keys.map((key, i) => {
                return <Th key={i}>{key}</Th>;
              })}
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
