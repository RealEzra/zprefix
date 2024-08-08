import { Flex, Heading, Divider, Button, ButtonGroup, Avatar, Menu, MenuButton, MenuList, MenuItem, IconButton } from "@chakra-ui/react";
import ToggleTheme from "../ThemeToggle/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { TiHome } from "react-icons/ti";

export default function NavBar() {
    const navigate = useNavigate();
    const session = localStorage.getItem("session")
    return (
        <>
            <Flex marginX="2em" marginY="1em" flexDir="row" justifyContent="space-between">
                <Heading><Link to="/">Lameazon</Link></Heading>
                <Flex>
                    <ButtonGroup>
                        {session ?
                            <>
                                <Menu>
                                    <MenuButton>
                                        <Avatar name={localStorage.getItem('user')} size="sm" />
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
                                        <MenuItem onClick={() => {
                                            localStorage.removeItem("session")
                                            localStorage.removeItem('user')
                                            localStorage.removeItem('name')
                                            return navigate("/login")
                                        }} icon={<RiLogoutBoxRLine />}>Logout</MenuItem>
                                    </MenuList>
                                </Menu>
                                <IconButton onClick={() => navigate('/')} isRound={true} icon={<TiHome />} />
                            </>
                            : <Button onClick={() => navigate("/login")}>Login</Button>}
                        <ToggleTheme />
                    </ButtonGroup>

                </Flex>
            </Flex>
            <Divider />
        </>
    )
}