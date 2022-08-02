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

const TableComponent = ({ tableData }) => {
  const [data, setData] = useState(tableData);
  let keys = [];

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  if (data && data.length) {
    keys = Object.keys(data[0]);
    console.log("keys", keys);
  }
  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>Imperial to metric conversion factors</TableCaption>
        <Thead>
          <Tr>
            {keys &&
              keys.length > 0 &&
              keys.map((key) => {
                return <Th>{key}</Th>;
              })}
          </Tr>
        </Thead>
        <Tbody>
          {data &&
            data.length > 0 &&
            data.map((rowData) => {
              return (
                <Tr>
                  {keys.map((key) => {
                    return <Td>{rowData[key]}</Td>;
                  })}
                </Tr>
              );
            })}
        </Tbody>
        <Tfoot>
          <Tr>
            {keys &&
              keys.length > 0 &&
              keys.map((key) => {
                return <Th>{key}</Th>;
              })}
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
