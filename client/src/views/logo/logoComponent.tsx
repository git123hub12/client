import { Grid, keyframes, styled } from "@mui/material";
import React from "react";
const LogoComponent: React.FC = () => {
  const blink = keyframes`
  from { opacity: 0; }
  to { opacity: 1;}
`;
  const BlinkedBox = styled(Grid)({
    width: "100%",
    height: "100%",
    animation: `${blink} 4s 1`,
  });
  return (
    <BlinkedBox
      xs={false}
      sm={7}
      md={7}
      sx={{
        backgroundImage: "url(/images/icon_light-removebg-preview.png)",
        backgroundRepeat: "no-repeat",
        backgroundColor: (t) =>
          t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
        backgroundSize: "contain",
        backgroundPosition: "center",
      }}
    ></BlinkedBox>
  );
};
const Logo = React.memo(() => <LogoComponent />);
export default Logo;
