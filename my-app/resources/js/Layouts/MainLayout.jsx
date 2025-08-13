import React from "react";
import { Link as InertiaLink, usePage } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import {
    Box,
    Heading,
    HStack,
    Text,
    IconButton,
    Link,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    useDisclosure,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    VStack,
    // その他使用するコンポーネントも追加
} from "@chakra-ui/react";

import { HamburgerIcon, SettingsIcon } from "@chakra-ui/icons";
const MainLayout = ({ children, title }) => {
    const { auth } = usePage().props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();
    return (
        <>
            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                finalFocusRef={btnRef}
                size={{ base: "xs", md: "sm" }}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>menu</DrawerHeader>
                    <DrawerBody>
                        <VStack>
                            {auth.user ? (
                                <Box display={"block"}>
                                    <Box fontSize={"xs"} mb={4}>
                                        {auth.user.name}さん
                                    </Box>
                                    <VStack>
                                        <Link
                                            href={route("dashboard")}
                                            _hover={{ color: "gray.500" }}
                                        >
                                            ダッシュボード
                                        </Link>
                                        <Link
                                            href={route("shop.create")}
                                            _hover={{ color: "gray.500" }}
                                        >
                                            店舗の登録
                                        </Link>
                                        <InertiaLink
                                            href={route("logout")}
                                            method="post"
                                            onClick={onClose}
                                            _hover={{ color: "gray.500" }}
                                        >
                                            ログアウト
                                        </InertiaLink>
                                    </VStack>
                                </Box>
                            ) : (
                                <>
                                    <Link href={route("login")}>ログイン</Link>

                                    <Link href={route("register")}>
                                        新規登録
                                    </Link>
                                </>
                            )}
                            ;
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
            <header>
                <Box bg={"orange.800"}>
                    <HStack
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        py={{ base: 0, md: 3 }}
                        px={{ base: 0, md: 2 }}
                    >
                        <Heading
                            as="h1"
                            size={{ base: "xs", md: "md" }}
                            color={"white"}
                        >
                            <Link href="/" _hover={{ color: "gray.500" }}>
                                {import.meta.env.VITE_APP_NAME}
                            </Link>
                        </Heading>
                        {/* PC表示 */}
                        <HStack
                            display={{ base: "none", md: "flex" }}
                            color={"white"}
                            fontWeight={"Bold"}
                        >
                            {auth.user ? (
                                <Box>
                                    <Text
                                        onClick={onOpen}
                                        cursor={"pointer"}
                                        ref={btnRef}
                                        display={"flex"}
                                        alignItems={"cener"}
                                    >
                                        {auth.user.name}さん
                                        <SettingsIcon mx={1} />
                                    </Text>
                                </Box>
                            ) : (
                                <>
                                    <Box>
                                        <Link href={route("login")}>
                                            <Button
                                                colorScheme={"white"}
                                                variant={"outline"}
                                                _hover={{ bg: "gray.500" }}
                                            >
                                                ログイン
                                            </Button>
                                        </Link>
                                    </Box>
                                    <Box>
                                        <Link href={route("register")}>
                                            <Button colorScheme={"blue"}>
                                                新規登録
                                            </Button>
                                        </Link>
                                    </Box>
                                </>
                            )}
                        </HStack>
                        {/* SP表示 */}
                        <Box
                            display={{ base: "block", md: "none" }}
                            px={{ base: "1", md: "none" }}
                            py={{ base: "2", md: "none" }}
                        >
                            <HamburgerIcon
                                ref={btnRef}
                                onClick={onOpen}
                                cursor={"pointer"}
                                fontSize={"xl"}
                            />
                            {/* <Menu>
                                <MenuButton
                                    as={IconButton}
                                    aria-label="Options"
                                    icon={<HamburgerIcon />}
                                    variant="outlign"
                                    colorScheme={"white"}
                                />
                                <MenuList>
                                    <MenuItem icon={<SettingsIcon />}>
                                        マイページ
                                    </MenuItem>
                                    <MenuItem>店舗の登録</MenuItem>
                                </MenuList>
                            </Menu> */}
                        </Box>
                    </HStack>
                </Box>
            </header>
            <Box>{children}</Box>
            <Box
                bg={"orange.800"}
                color={"white"}
                fontWeight={"bold"}
                textAlign={"center"}
                py={{ base: 2, md: 3 }}
            >
                <Text fontSize={{ base: 13, md: 16 }}>
                    &copy; 2025 {import.meta.env.VITE_APP_NAME}
                </Text>
            </Box>
        </>
    );
};

export default MainLayout;
