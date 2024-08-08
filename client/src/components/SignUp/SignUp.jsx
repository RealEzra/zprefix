import { Box, FormControl, FormHelperText, FormLabel, Input, Stack, Link, Text, Button, Flex, InputGroup, InputRightElement, IconButton, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const [loading, setLoading] = useState(false);
    const [login, setLogin] = useState({ username: "", password: "", firstname: "", lastname: "" });
    const [invalid, setInvalid] = useState(false);
    const [show, setShow] = useState(false)
    const [result, setResult] = useState({})
    const handleClick = () => setShow(!show)
    const toast = useToast();
    const navigate = useNavigate();
    const session = localStorage.getItem("session")


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
            setLoading(false)
        } else if (result.success) {
            toast({
                title: "Success",
                description: result.success,
                position: "bottom-right",
                status: "success",
                isClosable: true,
                duration: 5000
            })
            const session = localStorage.getItem("session")
            if (!session) {
                return navigate("/login")
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result])

    const handleLogin = () => {
        if (login.password.length < 6 || login.username.length < 1) {
            setInvalid(true)
            toast({
                title: "Error",
                description: "Username must be greater than 1 character and password must be greater than 6 characters",
                position: "bottom-right",
                status: "error",
                isClosable: true,
                duration: 5000
            })
        } else {
            setLoading(true)

            fetch("http://localhost:3000/sign-up", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(login)
            }).then((response) => {
                if (response.ok) {
                    return response.json()
                }
                return response.json()
            })
                .then((json) => setResult(json))
                .catch(() => {
                    setLoading(false)
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

    const handleChange = (e) => {
        if (e.target.id === "username") {
            setLogin({ ...login, username: e.target.value })
        } else if (e.target.id === "password") {
            setLogin({ ...login, password: e.target.value })
        } else if (e.target.id === "firstname") {
            setLogin({ ...login, firstname: e.target.value })
        } else if (e.target.id === "lastname") {
            setLogin({ ...login, lastname: e.target.value })
        }
    }
    if (session) {
        return navigate("/profile")
    }


    return (
        <>
            <Box paddingY="2em" margin="0 auto" maxW="25%">
                <Text marginBottom="1em">
                    Already have an account?{' '}
                    <Link color='teal.500' href='/login'>
                        login
                    </Link>
                </Text>
                <Stack spacing={5}>
                    <FormControl isRequired={true} onChange={handleChange}>
                        <FormLabel>Name</FormLabel>
                        <Input id="firstname" isInvalid={invalid && login.firstname.length < 1} placeholder="First Name" />
                        <Input id="lastname" isInvalid={invalid && login.lastname.length < 1} placeholder="Last Name" />
                        <FormHelperText>Enter your first and last name!</FormHelperText>
                    </FormControl>
                    <FormControl isRequired={true} isInvalid={invalid && login.username.length < 1} onChange={handleChange} id="username">
                        <FormLabel>Username:</FormLabel>
                        <Input placeholder="Username" />
                        <FormHelperText>Enter a user name!</FormHelperText>
                    </FormControl>
                    <FormControl isRequired={true} isInvalid={invalid && login.password < 1} onChange={handleChange}>
                        <FormLabel>Password:</FormLabel>
                        <InputGroup size='md'>
                            <Input
                                id="password"
                                pr='4.5rem'
                                type={show ? 'text' : 'password'}
                                placeholder='Enter password'
                            />
                            <InputRightElement width='4.5rem'>
                                <IconButton h='1.75rem' size='sm' icon={show ? <ViewOffIcon /> : <ViewIcon />} onClick={handleClick} />
                            </InputRightElement>
                        </InputGroup>
                        <FormHelperText>Enter a password!</FormHelperText>
                    </FormControl>

                </Stack>
                <Flex marginTop="1em" alignContent="center" justifyContent="center" >

                    <Button onClick={handleLogin} isLoading={loading}>Sign Up</Button>
                </Flex>
            </Box>
        </>
    )
}