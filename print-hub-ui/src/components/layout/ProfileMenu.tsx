import { Menu, Portal } from "@chakra-ui/react"
import { FaRegUserCircle } from "react-icons/fa"
import { useNavigate } from "react-router"

function ProfileMenu() {
  const navigate = useNavigate()

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <FaRegUserCircle color="white" size={24} />
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="logout" onClick={() => navigate("/login")}>Logout</Menu.Item>
            <Menu.Item value="profile" onClick={() => navigate("/profile")}>Profile</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}

export default ProfileMenu
