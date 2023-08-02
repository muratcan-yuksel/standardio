import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button } from "@mui/material";
import { ethers } from "ethers";
// import { Seaport } from "@opensea/seaport-js";
// import { ItemType } from "@opensea/seaport-js/lib/constants";
// import axios from "axios";
import { useAccount } from "wagmi";
import { OpenSeaSDK, Chain } from "opensea-js";
// import { OpenSeaAsset, TokenStandard } from "opensea-js/lib/types";
import {
  useVaultForListingStore,
  useContractAddressStore,
  useNFTListingModalStore,
  useUSDToEuroAbiStore,
  useUSDToEuroAddressStore,
  useEthToUsdAbiStore,
} from "../../store/Store";
import { formatUnits, fromHex } from "viem";
// import { getETHPrice } from "../../utils/getETHPrice";
// import axios from "axios";
import { useNetwork } from "wagmi";

interface StepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modalChildState: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tokenMap: any;
  onDataFromChild: (data: number) => void;
}
// const url =
//   "https://testnets-api.opensea.io/v2/orders/goerli/seaport/listings?limit=1";

const StepTwo: React.FC<StepProps> = ({
  modalChildState,
  tokenMap,
  onDataFromChild,
}) => {
  const { vaultForListing } = useVaultForListingStore();
  const { contractAddress } = useContractAddressStore();
  //this might be useless. where else do I use it?
  const { totalValue } = useNFTListingModalStore();
  const { usdToEuroAddress } = useUSDToEuroAddressStore();
  const { usdToEuroAbi } = useUSDToEuroAbiStore();
  // const { ethToUsdAddress } = useEthToUsdAddressStore();
  const { ethToUsdAbi } = useEthToUsdAbiStore();
  const { chain } = useNetwork();

  useEffect(() => {
    console.log("totalValue" + totalValue);
  }, []);

  const [userInput, setUserInput] = useState<string>("");
  const [euroValueConverted, setEuroValueConverted] = useState<any>(undefined);

  console.log(onDataFromChild);
  console.log(modalChildState);

  const { address } = useAccount();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  // console.log(signer);

  let openseaSDK: any;

  if (chain?.id === 1) {
    openseaSDK = new OpenSeaSDK(provider, {
      chain: Chain.Mainnet,
      // apiKey: import.meta.env.VITE_OPENSEA_API_KEY,
    });
  } else if (chain?.id === 42161) {
    openseaSDK = new OpenSeaSDK(provider, {
      chain: Chain.Arbitrum,
    });
  } else if (chain?.id === 421613) {
    openseaSDK = new OpenSeaSDK(provider, {
      chain: Chain.ArbitrumGoerli,
    });
  }

  console.log(openseaSDK);

  // Expire this auction one day from now.
  // Note that we convert from the JavaScript timestamp (milliseconds):

  const tokenIdBeforeConversion: any = vaultForListing[0];
  const accountAddress: any = address;
  const tokenId: any = fromHex(tokenIdBeforeConversion, "number").toString();
  const tokenAddress: any = contractAddress;

  console.log(tokenAddress);
  console.log(tokenId);

  const userValueInUsd = async (eth: number) => {
    try {
      const ethclAddr = vaultForListing[4].collateral[0].token.clAddr;
      console.log(ethclAddr);

      const contract = new ethers.Contract(ethclAddr, ethToUsdAbi, signer);
      const price = await contract.latestRoundData();

      const priceInUsd = fromHex(price.answer, "number");

      const priceFormatted = formatUnits(BigInt(priceInUsd), 8);

      console.log(priceFormatted);

      const ethValueInUSD = eth * Number(priceFormatted);
      console.log(ethValueInUSD);
      return convertUsdToEuro(ethValueInUSD);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    userValueInUsd(Number(userInput));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInput]);

  const convertUsdToEuro = async (ethValueInUsd: number) => {
    try {
      const contract = new ethers.Contract(
        usdToEuroAddress,
        usdToEuroAbi,
        signer
      );
      console.log(contract);
      const price = await contract.latestRoundData();
      console.log(price.answer);

      const priceInEuro = fromHex(price.answer, "number");
      console.log(priceInEuro);
      const priceInEuroFormatted = Number(formatUnits(BigInt(priceInEuro), 8));
      console.log(priceInEuroFormatted);
      const euroValueConverted = ethValueInUsd / priceInEuroFormatted;
      console.log(euroValueConverted);
      setEuroValueConverted(euroValueConverted);
      return priceInEuroFormatted;
    } catch (error) {
      console.log(error);
    }
  };

  const listSmartVault = async () => {
    try {
      const listing = await openseaSDK.createSellOrder({
        asset: {
          tokenId,
          //this one is actually the address of the smart vault manager for some reason
          tokenAddress,
        },
        accountAddress,
        startAmount: Number(userInput),
      });
      console.log(listing);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(tokenMap.get(modalChildState));
  const chosenNFT = tokenMap.get(modalChildState);
  return (
    <Box sx={{ color: "white" }}>
      <Box sx={{}}>
        <div
          style={{ width: "100%", height: "100%" }}
          dangerouslySetInnerHTML={{ __html: chosenNFT.image_data }}
        />{" "}
      </Box>{" "}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontStyle: "normal",
            fontWeight: "700",
            fontSize: {
              xs: "14px",
              sm: "24px",
            },
            lineHeight: "27px",
          }}
          variant="h6"
          component="div"
        >
          {tokenMap.get(modalChildState).name}
        </Typography>
        <Typography
          sx={{
            fontStyle: "normal",
            fontWeight: "400",
            fontSize: {
              xs: "12px",
              sm: "16px",
            },
            lineHeight: "141.5%",
            textAlign: "right",
            color: "#8E9BAE",
          }}
          variant="body2"
          component="div"
        >
          Smart Vault type:{" "}
          <span
            style={{
              color: "white",
            }}
          >
            {tokenMap.get(modalChildState).attributes[8].value}
          </span>
        </Typography>
      </Box>
      <Card
        sx={{
          background:
            "linear-gradient(110.28deg, rgba(26, 26, 26, 0.156) 0.2%, rgba(0, 0, 0, 0.6) 101.11%)",
          borderRadius: "10px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(13.9px)",
          WebkitBackdropFilter: "blur(13.9px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontStyle: "normal",
              fontWeight: "400",
              fontSize: {
                xs: "12px",
                sm: "16px",
              },
              lineHeight: "141.5%",
              color: "#8E9BAE",
            }}
            gutterBottom
          >
            Total value
          </Typography>{" "}
          <Typography
            sx={{
              fontSize: {
                xs: "12px",
                sm: "14px",
              },
              color: "white",
              fontFamily: "Poppins",
            }}
            gutterBottom
          >
            {/* {tokenMap.get(modalChildState).attributes[6].value} */}
            {tokenMap.get(modalChildState).attributes[3].value
              ? tokenMap.get(modalChildState).attributes[3].value
              : 0}{" "}
            sEURO
          </Typography>
        </CardContent>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontStyle: "normal",
              fontWeight: "400",
              fontSize: {
                xs: "12px",
                sm: "16px",
              },
              lineHeight: "141.5%",
              color: "#8E9BAE",
            }}
            gutterBottom
          >
            Total value minus debt
          </Typography>{" "}
          <Typography
            sx={{
              fontSize: {
                xs: "12px",
                sm: "14px",
              },
              color: "white",
              fontFamily: "Poppins",
            }}
            gutterBottom
          >
            {tokenMap.get(modalChildState).attributes[4].value}
            {/* {totalValueMinusDebt} */}
          </Typography>
        </CardContent>
      </Card>
      <Typography
        sx={{
          fontStyle: "normal",
          fontWeight: "400",
          fontSize: "16px",
          lineHeight: "141.5%",
          color: "#8E9BAE",
          margin: "25px 0 10px 0",
        }}
        variant="body2"
        component="div"
      >
        Enter the price you would like to sell for
      </Typography>
      <Card
        sx={{
          background:
            "linear-gradient(110.28deg, rgba(26, 26, 26, 0.156) 0.2%, rgba(0, 0, 0, 0.6) 101.11%)",
          borderRadius: "10px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(13.9px)",
          WebkitBackdropFilter: "blur(13.9px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        {" "}
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* <TextField
              id="outlined-basic"
              label="Outlined"
              variant="outlined"
            />{" "} */}
            <input
              type="text"
              placeholder="Enter the amount in ETH"
              style={{
                background: "transparent",
                color: "white",
                height: "100%",
                border: "none",
                borderBottom: "1px solid #8E9BAE",
                paddingLeft: "5px",
              }}
              onChange={(e: any) => {
                setUserInput(e.target.value);
              }}
            />
            <Typography
              sx={{
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: "16px",
                lineHeight: "141.5%",
                color: "#8E9BAE",
                margin: "25px 0 10px 0",
                textAlign: "right",
              }}
              variant="body2"
              component="div"
            >
              approx: {euroValueConverted} Euro
            </Typography>
          </Box>
        </CardContent>
      </Card>{" "}
      <Button
        onClick={listSmartVault}
        sx={{
          marginLeft: "10px",
          marginTop: "20px",
          padding: "10px 10px",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          boxShadow:
            "0 5px 15px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.2)",
          fontFamily: '"Poppins", sans-serif',
          color: "#ffffff",
          fontSize: "1rem",
          letterSpacing: "1px",
          backdropFilter: "blur(8px)",
          cursor: "pointer",
          borderRadius: "10px",
          transition: "0.5s",
          position: "relative",
          width: "100%",

          "&:after": {
            content: '""',
            position: "absolute",
            height: "100%",
            width: "100%",
            top: "0",
            left: "0",
            background:
              "linear-gradient(45deg, transparent 50%, rgba(255, 255, 255, 0.03) 58%, rgba(255, 255, 255, 0.16) 67%, transparent 68%)",
            backgroundSize: "200% 100%",
            backgroundPosition: "165% 0",
            transition: "0.7s",
          },
          "&:hover:after": {
            backgroundPosition: "-20% 0",
          },
          "&:hover": {
            boxShadow: "15px 30px 32px rgba(0, 0, 0, 0.5)",
            transform: "translateY(-5px)",
          },
          "&:active": {
            transform: "translateY(0)",
            border: "2px solid rgba(152, 250, 250, 0.5)",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
          },
          "&.activeBtn": {
            background:
              "linear-gradient(110.28deg, rgba(0, 0, 0, 0.156) 0.2%, rgba(14, 8, 8, 0.6) 101.11%)",
          },
        }}
        className="glowingCard"
        // onClick={() => write?.()}
      >
        <Typography
          sx={{
            color: "#afafaf",
          }}
        >
          List on opensea
        </Typography>
      </Button>{" "}
    </Box>
  );
};

export default StepTwo;
