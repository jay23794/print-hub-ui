import { Menu, Portal } from "@chakra-ui/react"
import { FaRegUserCircle } from "react-icons/fa"

function ProfileMenu() {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <FaRegUserCircle color="white" size={24} />
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="logout">Logout</Menu.Item>
            <Menu.Item value="profile">Profile</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}

export default ProfileMenu
