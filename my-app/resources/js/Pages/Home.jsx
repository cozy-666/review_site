import React, { useState } from "react";
import {
    Box,
    Heading,
    VStack,
    HStack,
    Image,
    Text,
    useToast,
    Input,
    Button,
    Spinner,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import MainLayout from "@/Layouts/MainLayout";
import { Link, router } from "@inertiajs/react";
import ReviewList from "@/Components/Organisms/ReviewList";

const Home = (props) => {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    if (props.status === "review-success") {
        toast({
            position: "top",
            title: "レビュー投稿成功",
            description: "レビューの投稿が完了しました",
            status: "success",
            duration: 9000,
            isClosable: true,
        });
    } else if (props.status === "shop-created") {
        toast({
            position: "top",
            title: "店舗登録成功",
            description: "店舗の投稿が完了しました",
            status: "success",
            duration: 9000,
            isClosable: true,
        });
    } else if (props.status === "shop-deleted") {
        toast({
            position: "top",
            title: "店舗削除成功",
            description: "店舗の削除が完了しました",
            status: "error",
            duration: 9000,
            isClosable: true,
        });
    }
    const handlePageChange = (url) => {
        router.get(url);
    };
    const getButtonLabel = (label) => {
        if (label.includes("previous")) return "前へ";
        if (label.includes("next")) return "次へ";
        return label;
    };
    const handleSearch = (e) => {
        setLoading(true);
        e.preventDefault();
        const newSearch = document.getElementById("search").value;
        setSearch(newSearch);

        setTimeout(() => {
            setLoading(false);
            ///検索処理
            router.get(route("shop.index"), { search: newSearch });
        }, 2000);
    };
    return (
        <>
            <Box p={4}>
                <Heading fontSize={{ base: "24px", md: "40px", lg: "" }} mb="2">
                    ショップ一覧
                </Heading>
                <VStack spacing={4} mb={4}>
                    <Input
                        name="search"
                        id="search"
                        placeholder="検索..."
                    ></Input>
                    <Button onClick={handleSearch}>検索</Button>
                </VStack>
                {loading && <Spinner />}
                <VStack spacing={4} align="stretch">
                    {Array.isArray(props.shops.data) &&
                        props.shops.data.map((shop) => (
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
                                        {shop.shop_images.length > 0 ? (
                                            <Image
                                                boxSize="100px"
                                                objectFit="cover"
                                                src={
                                                    shop.shop_images[0]
                                                        .file_path
                                                }
                                                alt={shop.name}
                                            />
                                        ) : (
                                            <Image
                                                boxSize="100px"
                                                objectFit="cover"
                                                src="/demo-placeholder.svg"
                                                alt={shop.name}
                                            />
                                        )}
                                        <VStack align={"start"}>
                                            <Heading size="md">
                                                {shop.name}
                                            </Heading>
                                            <Text>{shop.description}</Text>
                                            {/* 店舗の平均評価とレビュー件数 */}
                                            <Text>
                                                レビュー平均:{" "}
                                                {shop.reviews_avg_rating}(
                                                {shop.reviews_count}件)
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Box>
                            </Link>
                        ))}
                    <HStack justifyContent={"center"} alignItems={"center"}>
                        {props.shops.links.map((link, index) => (
                            <Button
                                key={index}
                                onClick={() => handlePageChange(link.url)}
                                colorScheme={link.active ? "blue" : "gray"}
                                isDisabled={!link.url}
                            >
                                {getButtonLabel(link.label)}
                            </Button>
                        ))}
                    </HStack>
                </VStack>
                <Heading
                    as="h2"
                    fontSize={{ base: "24px", md: "40px", lg: "56px" }}
                    mt={8}
                    md={2}
                >
                    新着レビュー
                </Heading>
                <VStack spacing={4} align="stretch">
                    <ReviewList reviews={props.newReviews} />
                </VStack>
            </Box>
        </>
    );
};

Home.layout = (page) => <MainLayout children={page} title="レビュー一覧" />;

export default Home;
