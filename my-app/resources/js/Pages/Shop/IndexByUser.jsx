import MainLayout from "@/Layouts/MainLayout";
import { Box, Heading, HStack, Image, Link, Text, VStack } from "@chakra-ui/react";
import React from "react";


const IndexByUser = (props) => {
    return (
        <>
            <Box p={4}>
                {props.shops.length > 0 ? (
                    <Box>
                        <Heading fontSize={{ base: "24", md: "36" }}>
                            {props.user.name}さんの関連した店舗一覧
                        </Heading>
                        <VStack spacing={4} align="stretch">
                            {props.shops.map((shop) => (
                                <Link
                                    href={`/shop/${shop.id}`}
                                    key={shop.id}
                                    _hover={{ color: "gray.300" }}
                                >
                                    <Box
                                        key={shop.id}
                                        p={4}
                                        borderWidth={"1px"}
                                        borderRadius={"lg"}
                                        overflow={"hidden"}
                                        boxShadow={"lg"}
                                    >
                                        <HStack spacing={4}>
                                            <Image
                                                boxSize="100px"
                                                objectFit="cover"
                                                src="https://placehold.jp/100x100.png"
                                                alt={shop.name}
                                            />
                                            <VStack align={"start"}>
                                                <Heading size="md">
                                                    {shop.name}
                                                </Heading>
                                                <Text>{shop.description}</Text>
                                            </VStack>
                                        </HStack>
                                    </Box>
                                </Link>
                            ))}
                        </VStack>
                    </Box>
                ) : (
                    <Heading fontSize={{ base: "24", md: "36" }}>
                        関連した店舗はまだありません
                    </Heading>
                )}
            </Box>
        </>
    );
};

IndexByUser.layout = (page) => (
    <MainLayout children={page} title="ユーザーと関連した店舗情報" />
);
export default IndexByUser;
