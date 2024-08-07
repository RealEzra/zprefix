import { Box, Heading, Skeleton, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom"

export default function Item() {
const param = useParams();
const [item, setItem] = useState({});
const [user, setUser] = useState({});

useEffect(() => {
    fetch(`http://localhost:3000/item/${param.id}`)
    .then(res => res.json())
    .then(json => setItem(json))
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

useEffect(() => {
    if(Object.keys(item).length > 1) {
        fetch(`http://localhost:3000/user/${item.user_id}`)
        .then(res => res.json())
        .then(json => setUser(json))
    }
}, [item])

if(Object.keys(item).length < 1) {
    return(
        <Skeleton/>
    )
}

    return(
        <>
        <Helmet>
            <title>{item.item_name} Details</title>
        </Helmet>
        <Box boxShadow='md' borderWidth='1px' borderRadius='lg' marginY="1em" paddingY="5em" maxW="50%" margin="0 auto" textAlign="center">
            <Heading>{item.item_name}</Heading>
            <Text>Description: {item.description}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Text>Posted by: {user.username}</Text>
        </Box>
        </>
    )
}