import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Center, Heading, Button, Skeleton, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom"

export default function Item() {
    const navigate = useNavigate();
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
        if (Object.keys(item).length > 1) {
            fetch(`http://localhost:3000/user/${item.user_id}`)
                .then(res => res.json())
                .then(json => setUser(json))
        }
    }, [item])

    if (Object.keys(item).length < 1) {
        return (
            <Skeleton />
        )
    }

    return (
        <>
            <Helmet>
                <title>{item.item_name} Details</title>
            </Helmet>
            <Center>
                <Button marginY="1em" leftIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Go Back</Button>
            </Center>
            <Box boxShadow='md' borderWidth='1px' borderRadius='lg' marginY="1em" paddingY="5em" maxW="50%" margin="0 auto" textAlign="center">
                <Stack spacing="1em">
                    <Heading>{item.item_name}</Heading>
                    <Text>Description: {item.description}</Text>
                    <Text>Quantity: {item.quantity}</Text>
                    <Text>Posted by: {user.first_name} ({user.username})</Text>
                </Stack>
            </Box>
        </>
    )
}