import { Flex, Box, Text } from "@chakra-ui/react";
import * as React from 'react';

export const Thumb = ({ value, bgColor, thumbIndex, thumbProps }) => {
    return (
        <Box
            // top='1%'
            boxSize={6}
            bgColor={bgColor}
            borderRadius='full'
            _focusVisible={{
                outline: 'none',
            }}
            {...thumbProps}
        >
            <Flex w='100%' h='100%' alignItems='center' justifyContent='center'>
                <Text color='white'>{value}</Text>
            </Flex>
        </Box>
    );
};
