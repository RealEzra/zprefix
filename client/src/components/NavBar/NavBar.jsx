import { Flex, Heading, Divider, Button, ButtonGroup } from "@chakra-ui/react";
import ToggleTheme from "../ThemeToggle/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
    const navigate = useNavigate();
    return (
        <>
            <Flex marginX="2em" marginY="1em" flexDir="row" justifyContent="space-between">
                <Heading><Link to="/">Lameazon</Link></Heading>
                <Flex>
                    <ButtonGroup>
                        <Button onClick={() => navigate("/login")}>Login</Button>
                        <ToggleTheme />
                    </ButtonGroup>

                </Flex>
            </Flex>
            <Divider />
        </>
    )
}