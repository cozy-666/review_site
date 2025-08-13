import MainLayout from "@/Layouts/MainLayout";
import React, { useEffect } from "react";
import {
    Box,
    Heading,
    VStack,
    HStack,
    Link,
    Button,
    Image,
    Text,
    useToast,
} from "@chakra-ui/react";
import { StarIcon, SmallAddIcon, EditIcon } from "@chakra-ui/icons";
import ReviewList from "@/Components/Organisms/ReviewList";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/themes/splide-default.min.css";
const Detail = (props) => {
    const toast = useToast();
    useEffect(() => {
        if (props.status === "review-success") {
            toast({
                position: "top",
                title: "レビュー投稿成功",
                description: "レビューの投稿が完了しました",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
        } else if (props.status === "review-deleted") {
            toast({
                position: "top",
                title: "レビュー削除成功",
                description: "レビューの投稿が完了しました",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } else if (props.status === "review-updated") {
            toast({
                position: "top",
                title: "レビュー更新成功",
                description: "レビューの更新が完了しました",
                status: "info",
                duration: 9000,
                isClosable: true,
            });
        } else if (props.status === "shop-updated") {
            toast({
                position: "top",
                title: "店舗の更新成功",
                description: "店舗の更新が完了しました",
                status: "info",
                duration: 9000,
                isClosable: true,
            });
        }
    }, [props.status]);

    const options = {
        type: "loop",
        gap: "1rem",
        autoplay: true,
        pauseOnHover: false,
        resetProgress: false,
        height: "15rem",
    };
    return (
        <Box p={4}>
            <HStack spacing={4}>
                <Heading as="h2" size={"xl"} mb={4}>
                    {props.shop.name}
                </Heading>
                <Link href={route("shop.edit", { id: props.shop.id })}>
                    <Button p={2} borderRadius={10} bg={"gray.200"}>
                        <EditIcon />
                    </Button>
                </Link>
            </HStack>
            <Box>
                {props.createdUser ? (
                    <Text fontSize={{ base: 12, md: 14 }}>
                        作成者：{" "}
                        <Link colorScheme={"blue.400"}
                            href={route("shop.indexByUser", {
                                userId: props.createdUser.id,
                            })}
                        >
                            {props.createdUser.name}さん
                        </Link>
                    </Text>
                ) : (
                    <Text fontSize={{ base: 12, md: 14 }}> 作成者：不明</Text>
                )}
                {props.updatedUser ? (
                    <Text fontSize={{ base: 12, md: 14 }}>
                        更新者：{" "}
                        <Link colorScheme={"blue.400"}
                            href={route("shop.indexByUser", {
                                userId: props.updatedUser.id,
                            })}
                        >
                            {props.updatedUser.name}さん
                        </Link>
                    </Text>
                ) : (
                    <Text fontSize={{ base: 12, md: 14 }}> 更新者：不明</Text>
                )}
            </Box>

            {props.shop.shop_images ? (
                <Box w={300}>
                    <Splide
                        options={options}
                        aria-labelledby="autoplay-example-heading"
                    >
                        {props.shop.shop_images.map((image) => (
                            <SplideSlide>
                                <Image
                                    key={image.id}
                                    boxSize="300px"
                                    objectFit="contain"
                                    src={
                                        import.meta.env.VITE_APP_URL +
                                        "/" +
                                        image.file_path
                                    }
                                    alt={image.file_name}
                                    mb={4}
                                />
                            </SplideSlide>
                        ))}
                    </Splide>
                </Box>
            ) : (
                <Image
                    boxSize="300px"
                    objectFit="contain"
                    src="https://placehold.jp/100x100.png"
                    alt={props.shop.name}
                    mb={4}
                />
            )}
            <Text mb={2}>{props.shop.description}</Text>
            <Text mb={2}>{props.shop.location}</Text>

            <Box mt={8}>
                <Heading as="h3" size={"lg"} mb={5}>
                    レビュー
                </Heading>
                <Box>
                    <Link href={`/review/create/shop/${props.shop.id}`}>
                        <Button my={4}>
                            <SmallAddIcon />
                            レビューを書く
                        </Button>
                    </Link>
                </Box>
                <Box>
                    {props.reviews && (
                        <Box mb={2}>({props.reviews.length})</Box>
                    )}
                </Box>
                <Box>
                    {props.reviews.length === 0 && (
                        <Text>レビューはまだありません。</Text>
                    )}
                    <ReviewList reviews={props.reviews} />
                </Box>
            </Box>
        </Box>
    );
};

Detail.layout = (page) => <MainLayout children={page} title="ショップ詳細" />;

export default Detail;
