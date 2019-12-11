import { useRouter } from "next/router";
import { FC, useEffect, useRef } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosTrendingUp } from "react-icons/io";

import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/core";

const Navigation: FC = () => {
  const { push, pathname } = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure(false);
  const buttonRef = useRef<HTMLElement>(null);
  useEffect(() => {
    switch (pathname) {
      case "/charts":
      case "/charts/upload":
      case "/survey/upload":
      case "/survey/[id]":
      case "/surveys":
        break;
      case "/":
      default:
        push("/charts");
        break;
    }
  }, [pathname]);
  return (
    <Box
      pos="fixed"
      backgroundColor="white"
      width="100%"
      top={0}
      left={0}
      borderBottom="1px"
      borderBottomColor="gray.300"
      pt={2}
      pb={2}
      zIndex={2}
    >
      <Box ref={buttonRef} pl={3}>
        <Box
          as={GiHamburgerMenu}
          size="32px"
          color="gray.500"
          onClick={onOpen}
          cursor="pointer"
        />
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={buttonRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <Text>Activismo Informática UACh</Text>
          </DrawerHeader>
          <DrawerBody>
            <Stack
              spacing="5px"
              fontFamily="sans-serif"
              justifyContent="flex-start"
            >
              <Flex
                cursor="pointer"
                onClick={() => {
                  push("/charts");
                  onClose();
                }}
                alignItems="center"
              >
                <Box as={IoIosTrendingUp} size="40px" />
                <Text pl={5}>Gráficos</Text>
              </Flex>
              <Flex
                cursor="pointer"
                onClick={() => {
                  push("/surveys");
                  onClose();
                }}
                alignItems="center"
              >
                <Box as={AiOutlineQuestionCircle} size="40px" />
                <Text pl={5}>Encuestas</Text>
              </Flex>
            </Stack>
          </DrawerBody>
          <DrawerFooter>
            <Icon
              name={isOpen ? "chevron-left" : "chevron-right"}
              size="35px"
              onClick={onClose}
              cursor="pointer"
            />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navigation;
