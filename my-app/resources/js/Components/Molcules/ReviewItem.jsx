import React from "react";
import StarRating from "../Atoms/StarRating";
import UserName from "../Atoms/UserName";
import { Box, Heading, VStack, HStack, Image, Text, Link, Button } from "@chakra-ui/react";
import { usePage } from "@inertiajs/react";


const ReviewItem = ({ review }) => {
    const { auth } =usePage().props;
    return (
        <Box
            key={review.id}
            p={4}
            borderWidth={"1px"}
            borderRadius={"lg"}
            overflow={"hidden"}
            boxShadow={"lg"}
            mb={4}
        >
            <Text style={{ whiteSpace: "pre-wrap" }}>{review.comment}</Text>
            <UserName name={review.user.name} />
            <StarRating rating={review.rating} />
            <Box mt={3} w={"100%"} display={"flex"} justifyContent={"flex-end"}>
                {auth.user && auth.user.id === review.user_id &&(
                <Link href={`/review/edit/${review.id}`}><Button colorScheme={"blue"} fontSize={14}>編集</Button></Link>

                )}
            </Box>
        </Box>
    );
};

export default ReviewItem;
