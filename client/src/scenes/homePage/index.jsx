import { Box, useMediaQuery } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import UserWidget from "../widgets/userWidget";
import Navbar from "../navbar";
import MyPostWidget from "../widgets/MyPostWidget.jsx";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(Min-width: 1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "30%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        ></Box>
        <MyPostWidget picturePath={picturePath} />
        {isNonMobileScreens && <Box flexBasis="30%"></Box>}
      </Box>
    </Box>
  );
};

export default HomePage;
