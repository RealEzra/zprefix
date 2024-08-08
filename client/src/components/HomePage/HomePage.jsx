import { useEffect, useState } from "react"
import { SimpleGrid, Box, Heading, Text } from "@chakra-ui/react"
import {Helmet} from 'react-helmet';
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const [items, setItems] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3000/items')
        .then(res => res.json())
        .then(json => setItems(json))
    }, [])

    const handleClick = (id) => {
        return navigate(`/item/${id}`)
    }

    return(
        <>
        <Helmet>
            <title>Lameazon | Home</title>
        </Helmet>
        <Heading marginY="1em" textAlign="center">Lameazon Inventory</Heading>
        <SimpleGrid minChildWidth='120px' spacing='40px' marginX="1em">
        {items.map(item => {
            return (
                <Box boxShadow='lg' textAlign="center" borderWidth='1px' borderRadius='lg' overflow='hidden' key={item.id} onClick={() => handleClick(item.id)}>
                    <Heading>{item.item_name}</Heading>
                    <Text>{item.description.length < 100 ? item.description: item.description.substring(0,100)+"..."}</Text>
                    <Text>Quantity: {item.quantity}</Text>
                </Box>
            )
        })}
    </SimpleGrid>
        </>
    )
}