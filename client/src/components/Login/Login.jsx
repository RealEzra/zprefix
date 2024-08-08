import { Box, FormControl, FormHelperText, FormLabel, Input, Stack, Link, Text, Button, Flex, InputGroup, InputRightElement, IconButton, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [login, setLogin] = useState({ username: "", password: "" });
    const [invalid, setInvalid] = useState(false);
    const [show, setShow] = useState(false)
    const [result, setResult] = useState({})
    const handleClick = () => setShow(!show)
    const toast = useToast();
    const navigate = useNavigate();


    useEffect(() => {
        if(result.error) {
            toast({
                title: "Error",
                description: "Login incorrect!",
                position: "bottom-right",
                status: "error",
                isClosable: true,
                duration: 5000 
            })
            setLoading(false)
        } else if (result.cookie) {
            localStorage.setItem('session', result.cookie)
            localStorage.setItem('user', login.username)
            localStorage.setItem('name', result.user)
            const session = localStorage.getItem("session")
            if (session) {
                return navigate("/profile")
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result])

    const handleLogin = () => {
        if (login.password === "" || login.username === "") {
            setInvalid(true)
            toast({
                title: "Error",
                description: "You must input a username and password!",
                position: "bottom-right",
                status: "error",
                isClosable: true,
                duration: 5000
            })
        } else {
            setLoading(true)
            fetch("http://localhost:3000/login", {
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
        } else {
            setLogin({ ...login, password: e.target.value })
        }
    }


    return (
        <>
        <Helmet>
            <title>Lameazon | Login</title>
        </Helmet>
            <Box paddingY="2em" margin="0 auto" maxW="25%">
                <Text marginBottom="1em">
                    Don&apos;t have an account?{' '}
                    <Link color='teal.500' href='/sign-up'>
                        sign up
                    </Link>
                </Text>
                <Stack spacing={5}>
                    <FormControl isRequired={true} isInvalid={invalid && login.username.length < 1} onChange={handleChange} id="username">
                        <FormLabel>Username:</FormLabel>
                        <Input placeholder="Username" />
                        <FormHelperText>Enter your user you used to sign up!</FormHelperText>
                    </FormControl>
                    <FormControl isRequired={true} isInvalid={invalid && login.password < 1} onChange={handleChange}>
                        <FormLabel>Password:</FormLabel>
                        <InputGroup size='md'>
                            <Input
                                pr='4.5rem'
                                type={show ? 'text' : 'password'}
                                placeholder='Enter password'
                            />
                            <InputRightElement width='4.5rem'>
                                <IconButton h='1.75rem' size='sm' icon={show ? <ViewOffIcon /> : <ViewIcon />} onClick={handleClick} />
                            </InputRightElement>
                        </InputGroup>
                        <FormHelperText>Enter your password you used to sign up!</FormHelperText>
                    </FormControl>

                </Stack>
                <Flex marginTop="1em" alignContent="center" justifyContent="center" >

                    <Button onClick={handleLogin} isLoading={loading}>Login</Button>
                </Flex>
            </Box>
        </>
    )
}