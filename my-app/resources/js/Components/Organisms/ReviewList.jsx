import React from 'react';
import ReviewItem from '../Molcules/ReviewItem';
import { Box, Heading, VStack, HStack, Image, Text } from "@chakra-ui/react";


const ReviewList = ({ reviews }) => {
    return (
        <Box>
            {reviews.map((review, index)=>(
                <ReviewItem key={index} review={review} />
            ))}
        </Box>
    )
};

export default ReviewList;
