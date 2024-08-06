import { IconButton, useColorMode } from "@chakra-ui/react"
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
export default function ToggleTheme() {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <IconButton isRound={true} icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />} onClick={toggleColorMode} />
    )
}