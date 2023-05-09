import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface ModalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modalChildState: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tokenMap: any;
}

const ManageNFTModalContents: React.FC<ModalProps> = ({
  modalChildState,
  tokenMap,
}) => {
  console.log(modalChildState);
  console.log(tokenMap.get(modalChildState));
  //modal styles
  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    // bgcolor:
    //   "linear-gradient(110.28deg, rgba(26, 26, 26, 0.156) 0.2%, rgba(0, 0, 0, 0.6) 101.11%);",
    bgcolor: "#0C0C0C",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  return (
    <div>
      {" "}
      <Box sx={style}>
        <img src={tokenMap.get(modalChildState).image} alt="NFT" />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="div">
            {tokenMap.get(modalChildState).name}
          </Typography>
          <Typography variant="body2" component="div">
            Smart Vault type:{" "}
            {tokenMap.get(modalChildState).attributes[8].value}
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default ManageNFTModalContents;
