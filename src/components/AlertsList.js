import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  List,
  ListItem,
  ListIcon,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { headers } from "../api";
import { APP_URL } from "../constants";
import SidebarWithHeader from "./SideNavBar";

const AlertsList = () => {
  const [AlertsData, setAlertsData] = useState([]);

  const fetchAlerts = () => {
    axios
      .get(APP_URL + "getalertsbyuser", { headers: headers })
      .then((response) => {
        let data = response;
        // setGraphData(data);
        console.log("AlertsData =======", response);
        setAlertsData(response.data.alert);
      })
      .catch((err) => console.log("err: ", err));
  };

  useEffect(() => {
    fetchAlerts();
    return () => {};
  }, []);

  console.log("AlertsData &&&&&", AlertsData);

  return (
    <SidebarWithHeader>
      <Text>Alerts Lists </Text>
      <br />
      {AlertsData && AlertsData.length > 0 && (
        <List spacing={3}>
          {/* <ListItem>
            <ListIcon as={MdCheckCircle} color="green.500" />
            Lorem ipsum dolor sit amet, consectetur adipisicing elit
          </ListItem> */}
          {AlertsData.map((item) => {
            return (
              <ListItem>
                <Text>
                  You will receive an alert for {item.coin} when it is{" "}
                  {item.typeofchange} {item.value}
                </Text>
                {/* {item.platform} */}
              </ListItem>
            );
          })}
        </List>
      )}
    </SidebarWithHeader>
  );
};

export default AlertsList;
