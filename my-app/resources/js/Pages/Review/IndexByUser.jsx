import ReviewList from "@/Components/Organisms/ReviewList";
import MainLayout from "@/Layouts/MainLayout";
import { Box, Heading } from "@chakra-ui/react";
import React from "react";

const IndexByUser = (props) => {

    return(
        <>
        <Box p={4}>
            {props.reviews.length > 0 ? (
                <Box>
                    <Heading fontSize={{base:"24" ,md: "36"}}>
                        {props.user.name}のレビュー一覧
                    </Heading>
                    <ReviewList reviews={props.reviews} />
                </Box>
            ):(
                <Heading fontSize={{base:"24" ,md: "36"}}>レビューはまだありません</Heading>

            )}

        </Box>
        </>
    )
}
IndexByUser.layout = (page) => <MainLayout children={page} title="ユーザーレビュー一覧"/>
export default IndexByUser;
