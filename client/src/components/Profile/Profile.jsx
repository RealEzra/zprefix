import { CheckIcon, CloseIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
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
    Center,
    useToast
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from 'react-router-dom';
import CheckAuth from "../../hooks/useAuth/useAuth";

export default function Profile() {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const initialRef = useRef(null)
    const finalRef = useRef(null)
    const toast = useToast();
    // const [userId, setUserId] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newItem, setNewItem] = useState({ item_name: "", description: "", quantity: 0, session: localStorage.getItem('session') })
    const [result, setResult] = useState({});
    const [invalid, setInvalid] = useState(false);
    const [editing, setEditing] = useState({})
    const [saving, setSaving] = useState(false);
    const [editedItem, setEditedItem] = useState({item_name: "", description: "", quantity: 0, session: localStorage.getItem('session')});


    useEffect(() => {
        if (result.error) {
            toast({
                title: "Error",
                description: result.error,
                position: "bottom-right",
                status: "error",
                isClosable: true,
                duration: 5000
            })
        } else if (result.success) {
            onClose()
            toast({
                title: "New Item Created!",
                description: result.success,
                position: "bottom-right",
                status: "success",
                isClosable: true,
                duration: 5000
            })
        } else if (result.alert) {
            toast({
                title: "Item Deleted!",
                description: result.alert,
                position: "bottom-left",
                status: "warning",
                isClosable: true,
                duration: 5000
            })
        } else if (result.info) {
            toast({
                title: "Item Updated!",
                description: result.info,
                position: "bottom-right",
                status: "info",
                isClosable: true,
                duration: 5000
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result])

    useEffect(() => {
        fetch(`http://localhost:3000/items/${localStorage.getItem('user')}`)
            .then(res => res.json())
            .then(json => {
                setItems(json)
                // setUserId(json[0].user_id)
            });
    }, [result])

    const handleChange = (e) => {
        if (e.target.id === "title") {
            setNewItem({ ...newItem, item_name: e.target.value })
        } else if (e.target.id === "description") {
            setNewItem({ ...newItem, description: e.target.value })
        } else if (e.target.id === "quantity") {
            setNewItem({ ...newItem, quantity: e.target.value })
        }
    }

    const deleteItem = (item_id) => {
        fetch("http://localhost:3000/item", {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: item_id, session: localStorage.getItem('session') })
        }).then((response) => {
            if (response.ok) {
                return response.json()
            }
            return response.json()
        })
            .then((json) => setResult(json))
            .catch(() => {
                toast({
                    title: "Error",
                    description: "Something went wrong please try again later!",
                    position: "bottom-right",
                    status: "error",
                    isClosable: true,
                    duration: 5000
                })
            });
    }

    const handleNewItem = () => {
        if (newItem.description.length < 5 || newItem.item_name.length < 5 || newItem.quantity < 1) {
            setInvalid(true)
            toast({
                title: "Error",
                description: "Description and Name must be more than 5 character and Quantity must be greater than 0!",
                position: "bottom-right",
                status: "error",
                isClosable: true,
                duration: 5000
            })
        } else {
            setInvalid(false)
            fetch("http://localhost:3000/item", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            }).then((response) => {
                if (response.ok) {
                    return response.json()
                }
                return response.json()
            })
                .then((json) => setResult(json))
                .catch(() => {
                    toast({
                        title: "Error",
                        description: "Something went wrong please try again later!",
                        position: "bottom-right",
                        status: "error",
                        isClosable: true,
                        duration: 5000
                    })
                });
        }
    }

    const handleEdit = (id) => {
        let obj = items.find(o => o.id === id);
        setEditing(obj)
        setEditedItem(obj)
    }

    const handleEdits = (e) => {
        if(e.target.id === "name") {
            setEditedItem({...editedItem, item_name: e.target.value })
        } else if (e.target.id === "description") {
            setEditedItem({...editedItem, description: e.target.value})
        } else if (e.target.id === "quantity") {
            setEditedItem({...editedItem, quantity: e.target.value})
        }
    }

    const submitEdits = () => {
        let obj = items.find(o => o.id === editedItem.id);
        if (editedItem === obj) {
            toast({
                title: "Alert",
                description: "No changes were made!",
                position: "bottom-right",
                status: "info",
                isClosable: true,
                duration: 5000
            })
        } else {
            setSaving(true)
            fetch("http://localhost:3000/item", {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({...editedItem, session: localStorage.getItem('session')})
            }).then((response) => {
                if (response.ok) {
                    setSaving(false)
                    setEditing({})
                    return response.json()
                }
                return response.json()
            })
                .then((json) => setResult(json))
                .catch(() => {
                    setEditing(false)
                    toast({
                        title: "Error",
                        description: "Something went wrong please try again later!",
                        position: "bottom-right",
                        status: "error",
                        isClosable: true,
                        duration: 5000
                    })
                });
        }
    }


    if (!localStorage.getItem('session') || !localStorage.getItem('user')) {
        return (
            <CheckAuth />
        )
    }

    return (
        <>
            <Helmet>
                <title>{localStorage.getItem('name') + '\'s Profile'}</title>
            </Helmet>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add new item</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl isRequired={true} onChange={handleChange} isInvalid={invalid && newItem.item_name.length < 5}>
                            <FormLabel>Item Name</FormLabel>
                            <Input id="title" ref={initialRef} placeholder='Macbook' />
                        </FormControl>

                        <FormControl isRequired={true} onChange={handleChange} mt={4} isInvalid={invalid && newItem.description.length < 5}>
                            <FormLabel>Item Description</FormLabel>
                            <Textarea id="description" placeholder='a super cool description' />
                        </FormControl>

                        <FormControl isRequired={true} onChange={handleChange} mt={4} isInvalid={invalid && newItem.quantity < 1}>
                            <FormLabel>Item Quantity</FormLabel>
                            <Input id="quantity" type="number" placeholder="1" />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleNewItem}>
                            Add
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Heading paddingY="1em" textAlign="center">{localStorage.getItem('name')}&apos;s Inventory</Heading>
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
                                    {editing.id === item.id ? <Td><Input id="name" onChange={handleEdits} defaultValue={item.item_name}/></Td> : <Td>{item.item_name}</Td>}
                                    {editing.id === item.id ? <Td><Textarea id="description" onChange={handleEdits} defaultValue={item.description}/></Td> : <Td>{item.description.length < 100 ? item.description : item.description.substring(0, 100) + "..."}</Td> }
                                    {editing.id === item.id ? <Td><Input id="quantity" onChange={handleEdits} type="number" defaultValue={item.quantity}/></Td> : <Td>{item.quantity}</Td>}
                                    {editing.id === item.id ? 
                                    <Td>
                                        <ButtonGroup>
                                            <IconButton isRound={true} icon={<CloseIcon/>} onClick={() => setEditing({})}/>
                                            <IconButton isLoading={saving} isRound={true} onClick={submitEdits} icon={<CheckIcon/>}/>
                                        </ButtonGroup>
                                    </Td>
                                    : <Td>
                                        <ButtonGroup>
                                            <IconButton isRound={true} onClick={() => navigate(`/item/${item.id}`)} icon={<ViewIcon />} />
                                            <IconButton isRound={true} onClick={() => handleEdit(item.id)} icon={<EditIcon />} />
                                            <IconButton isRound={true} icon={<DeleteIcon />} onClick={() => deleteItem(item.id)} />
                                        </ButtonGroup>
                                    </Td>}
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    )
}