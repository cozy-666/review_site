import MainLayout from "@/Layouts/MainLayout";
import React from "react";
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
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Icon,
    IconButton,
} from "@chakra-ui/react";
import { router, useForm, usePage } from "@inertiajs/react";
import { CloseIcon } from "@chakra-ui/icons";

const Edit = (props) => {
    const existingImages = props.shop.shop_images
        ? props.shop.shop_images.map((image) => ({
              id: image.id,
              file_name: image.file_name,
              file_path: image.file_path,
          }))
        : [];
    const { auth, csrf_token } = usePage().props;

    // デバッグログを追加（後で削除可能）
    console.log("Props received:", props);
    console.log("Shop data:", props.shop);

    // React Hooksのルール違反を防ぐため、useFormを必ず呼ぶ
    const { data, setData, post, errors } = useForm({
        id: props.shop?.id || "",
        name: props.shop?.name || "",
        location: props.shop?.location || "",
        description: props.shop?.description || "",
        images: [],
        existingImages: existingImages,
    });

    // props.shopがnullまたはundefinedの場合の対策
    if (!props.shop) {
        return (
            <Box p={4} m={4} w={{ base: "90%", md: 700 }}>
                <Text>
                    店舗データが見つかりません。データを読み込み中です...
                </Text>
                <Button onClick={() => window.location.reload()} mt={4}>
                    再読み込み
                </Button>
            </Box>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        router.post(route("shop.update"), {
            _token: csrf_token,
            ...data,
        });
    };

    const toast = useToast();

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length + data.existingImages.length > 3) {
            toast({
                title: "画像は３つまで選択可能です",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return; // 3つを超えた場合は処理を止める
        }
        setData("images", files);
    };

    const handleRemoveImage = (index, type) => {
        if (type === "existing") {
            return (e) => {
                const images = data.existingImages.filter((_, i) => i != index);
                images.splice(index, 1);
                setData("existingImages", images);
            };
        } else if(type === "new") {
            const images = data.images;
            images.splice(index, 1);
            setData("images", images);

            const dataTransfer = new DataTransfer();
            const imageFiles = document.getElementById("images").files;

            Array.from(imageFiles).forEach((file, i) => {
                if(i !== index) {
                    dataTransfer.items.add(file);
                }
            })
            document.getElementById("images").files = dataTransfer.files;

        }
    };

    const handleDelete = (e) => {
        e.preventDefault();
        router.delete(route("shop.destroy", { id: data.id }));
    };

    return (
        <>
            <Box p={4} m={4} w={{ base: "90%", md: 700 }}>
                <Heading as="h2" fontSize={{ base: 18, md: 24 }} mb={6}>
                    店舗の編集
                </Heading>
                <form onSubmit={handleSubmit}>
                    <FormControl id="name" mb={4}>
                        <FormLabel fontWeight={"bold"}>店舗名</FormLabel>
                        <Input
                            isRequired
                            type="text"
                            id="name"
                            name="name"
                            value={data.name || ""}
                            onChange={(e) => setData("name", e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="location" mb={4}>
                        <FormLabel fontWeight={"bold"}>場所</FormLabel>
                        <Input
                            isRequired
                            type="text"
                            id="location"
                            name="location"
                            value={data.location || ""}
                            onChange={(e) =>
                                setData("location", e.target.value)
                            }
                        />
                    </FormControl>
                    <FormControl id="description" mb={4}>
                        <FormLabel fontWeight={"bold"}>説明</FormLabel>
                        <Textarea
                            isRequired
                            id="description"
                            name="description"
                            value={data.description || ""}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                        />
                    </FormControl>
                    <FormControl id="images" mb={4}>
                        <FormLabel fontWeight={"bold"}>画像</FormLabel>
                        <Text mb={2}>プレビュー</Text>
                        <Box display={"flex"} p={4} bg={"gray.200"}>
                            {data.existingImages.length > 0 &&
                                data.existingImages.map((image, index) => (
                                    <Box
                                        key={image.id}
                                        px={2}
                                        position={"relative"}
                                    >
                                        <img
                                            src={
                                                import.meta.env.VITE_APP_URL +
                                                "/" +
                                                image.file_path
                                            }
                                            alt={image.file_name}
                                            style={{ width: 100 }}
                                        />
                                        <IconButton
                                            isRound={true}
                                            position={"absolute"}
                                            top={{ base: -4, md: -5 }}
                                            right="0"
                                            variant="solid"
                                            colorScheme="gray"
                                            aria-label="Done"
                                            fontSize={{ base: "xs", md: "sm" }}
                                            icon={<CloseIcon />}
                                            onClick={() =>
                                                handleRemoveImage(
                                                    index,
                                                    "existing"
                                                )
                                            }
                                        />
                                    </Box>
                                ))}
                            {data.images.length > 0 && (
                                <Box display={"flex"}>
                                    {data.images.map((image, index) => (
                                        <Box
                                            key={`${image.name}-${index}`}
                                            px={2}
                                            py={2}
                                            position={"relative"}
                                        >
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={image.name}
                                                style={{ width: 100 }}
                                            />
                                            <IconButton
                                                isRound={true}
                                                position={"absolute"}
                                                top={{ base: -4, md: -5 }}
                                                right="0"
                                                variant="solid"
                                                colorScheme="gray"
                                                aria-label="Done"
                                                fontSize={{
                                                    base: "xs",
                                                    md: "sm",
                                                }}
                                                icon={<CloseIcon />}
                                                onClick={() =>
                                                    handleRemoveImage(
                                                        index,
                                                        "new"
                                                    )
                                                }
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>
                        <Input
                            type="file"
                            id="images"
                            accept=".jpg,.jpeg,.png"
                            multiple
                            name="images"
                            onChange={handleImageChange}
                        />
                    </FormControl>
                    <Button type="submit" colorScheme="teal">
                        更新
                    </Button>
                </form>
            </Box>
            <Box display={"flex"} justifyContent={"center"}>
                <form onSubmit={handleDelete}>
                    <Button type="submit" colorScheme="red" m={4}>
                        削除する
                    </Button>
                </form>
            </Box>
        </>
    );
};

Edit.layout = (page) => <MainLayout children={page} title={"店舗の編集"} />;
export default Edit;
