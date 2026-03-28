import { Icon } from "@chakra-ui/react/icon"
import { FiMenu } from "react-icons/fi"

interface NavbarProps {
  onOpenDrawer: () => void
}

function Navbar({ onOpenDrawer }: NavbarProps) {
  return (
    <Icon size="lg" color="white" mr="3" onClick={onOpenDrawer}>
      <FiMenu />
    </Icon>
  )
}

export default Navbar
