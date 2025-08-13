import React from "react";
import { Text } from "@chakra-ui/react"

const UserName = ({ name }) => {
    return (
    <Text textAlign={"right"} fontWeight={"Bold"}>
        {name}
    </Text>
    )
};

export default UserName;
