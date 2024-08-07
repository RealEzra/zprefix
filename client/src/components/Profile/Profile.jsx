import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import {
    Heading,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Th,
    Thead,
    Tr,
    Td,
    ButtonGroup,
    IconButton,
    Button,
    useDisclosure,
    Modal,
    ModalContent,
    ModalOverlay,
    ModalHeader,
    ModalCloseButton,
    FormControl,
    ModalBody,
    FormLabel,
    Input,
    ModalFooter,
    Textarea,
    Center
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const initialRef = useRef(null)
    const finalRef = useRef(null)
    // const [userId, setUserId] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newItem, setNewItem] = useState({item_name: "", description: "", quantity: 0})

    useEffect(() => {
        fetch(`http://localhost:3000/items/${localStorage.getItem('user')}`)
            .then(res => res.json())
            .then(json => {
                setItems(json)
                // setUserId(json[0].user_id)
            });
        
    }, [])

    const handleChange = (e) => {
        if (e.target.id === "title") {
            setNewItem({...newItem, item_name: e.target.value})
        } else if (e.target.id === "description") {
            setNewItem({...newItem, description: e.target.value})
        } else if (e.target.id === "quantity") {
            setNewItem({...newItem, quantity: e.target.value})
        }
    }

    const handleNewItem = () => {
        // console.log(userId, 'save')
    }

    return (
        <>
            <Helmet>
                <title>{localStorage.getItem('user') + '\'s Profile'}</title>
            </Helmet>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create your account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl onChange={handleChange}>
                            <FormLabel>Item Name</FormLabel>
                            <Input id="title" ref={initialRef} placeholder='Macbook' />
                        </FormControl>

                        <FormControl onChange={handleChange} mt={4}>
                            <FormLabel>Item Description</FormLabel>
                            <Textarea id="description" placeholder='a super cool description' />
                        </FormControl>

                        <FormControl onChange={handleChange} mt={4}>
                            <FormLabel>Item Quantity</FormLabel>
                            <Input id="quantity" type="number" placeholder="1" />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleNewItem}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Heading paddingY="1em" textAlign="center">{localStorage.getItem('user')}&apos;s Inventory</Heading>
            <Center>
                <Button onClick={onOpen}>Add New Item</Button>
            </Center>
            <TableContainer marginX="1em">
                <Table variant="simple">
                    <TableCaption>Current Inventory</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Title</Th>
                            <Th>Description</Th>
                            <Th>Quantity</Th>
                            <Th>Options</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {items.map(item => {
                            return (
                                <Tr key={item.id}>
                                    <Td>{item.item_name}</Td>
                                    <Td>{item.description.length < 100 ? item.description : item.description.substring(0, 100) + "..."}</Td>
                                    <Td>Quantity: {item.quantity}</Td>
                                    <Td>
                                        <ButtonGroup>
                                            <IconButton isRound={true} onClick={() => navigate(`/item/${item.id}`)} icon={<ViewIcon />} />
                                            <IconButton isRound={true} icon={<EditIcon />} />
                                            <IconButton isRound={true} icon={<DeleteIcon />} />
                                        </ButtonGroup>
                                    </Td>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    )
}