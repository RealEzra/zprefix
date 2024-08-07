import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckAuth() {
    const toast = useToast();
    const [result, setResult] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        fetch('http://localhost:3000/isvalid', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({session: localStorage.getItem('session')})
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
    }, [])

    useEffect(() => {
        if(result.invalid) {
            localStorage.removeItem('session')
            localStorage.removeItem('user')
            navigate('/login')
            toast({
                title: "Error",
                description: result.invalid,
                position: "bottom-right",
                status: "error",
                isClosable: true,
                duration: 5000
            })
        }  else if (result.error) {
            toast({
                title: "Error",
                description: result.error,
                position: "bottom-right",
                status: "error",
                isClosable: true,
                duration: 5000
            })
        }
    }, [result])
}