import MainLayout from "@/Layouts/MainLayout";
import {
    Box,
    HStack,
    Text,
    Heading,
    FormControl,
    FormLabel,
    Button,
    Textarea,
    useDisclosure,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { StarIcon } from "@chakra-ui/icons";

const Create = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef();
    const [Loading, setLoading] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);
    const [values, setValues] = useState({
        shop_id: props.shop.id,
        rating: 1,
        comment: "",
    });

    const handleCheck = (e) => {
        e.preventDefault();
        onOpen();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        e.target.disabled = true;
        router.post(route("review.store"), values);
    };

    return (
        <Box
            p={4}
            m={4}
            mx={"auto"}
            bg={"gray.100"}
            borderRadius={"md"}
            boxShadow={"md"}
            w={{ base: "90%", md: 700 }}
        >
            <>
                <AlertDialog
                    isOpen={isOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader>最終確認</AlertDialogHeader>
                            <AlertDialogBody>
                                この内容で投稿しますか？
                            </AlertDialogBody>
                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={onClose}>
                                    キャンセル
                                </Button>
                                <Button colorScheme="blue" onClick={handleSubmit} ml={3}>
                                    {Loading ? <Spinner /> : "投稿する"}
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </>
            <Heading as="h2" size={"md"} mb={4} color={"blue.900"}>
                レビューを投稿
            </Heading>
            <Text fontSize={"xl"} color={"gray.500"} mb={2}>
                {props.shop.name}
            </Text>
            <form onSubmit={handleCheck}>
                <FormControl isRequired mb={4}>
                    <FormLabel htmlFor="rating" fontWeight={"bold"}>
                        評価
                    </FormLabel>
                    <HStack spacing={1} md={4}>
                        {Array(5)
                            .fill("")
                            .map((_, i) => (
                                <StarIcon
                                    key={i}
                                    color={
                                        i < values.rating
                                            ? "yellow.500"
                                            : "gray.300"
                                    }
                                    cursor={"pointer"}
                                    onClick={() =>
                                        setValues({ ...values, rating: i + 1 })
                                    }
                                    onMouseEnter={() => setHoverRating(i + 1)}
                                    onMouseLeave={() => setHoverRating(0)}
                                />
                            ))}
                    </HStack>
                </FormControl>
                <FormControl isRequired mb={4}>
                    <FormLabel htmlFor="comment" fontWeight={"bold"}>
                        コメント
                    </FormLabel>
                    <Textarea
                        id="comment"
                        name="comment"
                        onChange={handleChange}
                    ></Textarea>
                </FormControl>
                <Button type="submit" colorScheme={"blue"} mt={4}>
                    投稿する
                </Button>
            </form>
        </Box>
    );
};

Create.layout = (page) => <MainLayout children={page} title="レビュー投稿" />;

export default Create;
