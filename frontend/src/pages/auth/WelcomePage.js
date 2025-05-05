import {
  Stack,
  Typography,
  Box,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { GithubLogo, InstagramLogo, LinkedinLogo } from "phosphor-react";

import CatLogo from "../../assets/icons/logo/WeChat.png";

const WelcomePage = () => {
  const SocialArray = [
    {
      bg: "#2b3137",
      link: "https://github.com/Baohole",
      icon: <GithubLogo color="#fafbfc" weight="duotone" alt="github" />,
    }
  ];

  return (
    <Box widht={"100%"} sx={{ py: 4 }}>
      <Stack
        justifyContent={"center"}
        sx={{
          flexDirection: {
            xs: "column-reverse",
            md: "row",
          },
          gap: 2,
          alignItems: "center",
          backgroundColor: (theme) => theme.palette.background.paper,
          borderRadius: { xs: "20px 20px 0px 0px", md: "20px" },
          minHeight: { xs: 480, md: 430 },
        }}
        px={4}
      >
        <Box>
          <Typography
            component="h1"
            variant="h1"
            sx={{ fontSize: { xs: 35, md: 45 }, textAlign: "center" }}
          >
            Welcome to WeChat 😺
          </Typography>
          <Typography
            component="h2"
            variant="subtitle2"
            color="primary"
            sx={{ textAlign: "center", mb: { xs: 2, md: 0 } }}
          >
            A robust web-based Real-Time Chat App.
          </Typography>

          <Button
            fullWidth
            component={Link}
            to={"/auth/register"}
            size="large"
            variant="contained"
            sx={{
              mt: 4,
              display: { xs: "none", md: "flex" },
              bgcolor: "text.primary",
              color: (theme) =>
                theme.palette.mode === "light" ? "common.white" : "grey.800",
              "&:hover": {
                bgcolor: "text.primary",
                color: (theme) =>
                  theme.palette.mode === "light" ? "common.white" : "grey.800",
              },
            }}
          >
            Join Now To Start Chatting With Your Friends!
          </Button>

          <Stack direction={"row"} justifyContent={"center"} spacing={2} mt={2}>
            {SocialArray.map((e) => (
              <Box
                sx={{
                  borderRadius: 20,
                  width: 40,
                  height: 40,
                  background: e.bg,
                }}
              >
                <IconButton
                  component={"a"}
                  href={e.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {e.icon}
                </IconButton>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Image and enclosed Box */}
        <Box
          component="img"
          src={CatLogo}
          alt={"WeChat Logo"}
          sx={{ width: { xs: 200, md: 400 }, height: "100%" }}
        />
      </Stack>
      <Stack alignItems={"center"}>
        <Button
          component={Link}
          to={"/auth/login"}
          size="large"
          variant="contained"
          sx={{
            borderRadius: "0px 0px 20px 20px",
            width: { xs: "100%", md: "50%" },
          }}
        >
          Lets Get You Logged In!
        </Button>
      </Stack>

      <Box mt={10}>
        <Stack spacing={2}>
          <Divider>
            <Typography
              component="h2"
              variant="h2"
              sx={{ fontSize: { xs: 25, md: 35 } }}
            >
              What is WeChat?
            </Typography>
          </Divider>
          <Typography variant="body1">
            WeChat is a real-time web-based chat application. Boasting not only a visually appealing UI but also
            packed with an array of enticing features, WeChat is designed
            to provide with the best user experience. Powered by the dynamic
            MERN stack and enriched with the sleek design elements of
            Material-UI (MUI), this application delivers a seamless chatting
            experience. From connecting with friends to instant messaging
            system, WeChat ensures not just connectivity but a symphony of
            interactivity and speed for its users.
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default WelcomePage;
