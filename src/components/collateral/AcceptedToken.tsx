import { Box, Typography } from "@mui/material";
import { ethers } from "ethers";
import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import Actions from "./Actions";
import {
  useCollateralSymbolStore,
  useWidthStore,
  useVaultStore,
  useGreyProgressBarValuesStore,
  useUSDToEuroAbiStore,
  useUSDToEuroAddressStore,
  useChainlinkAbiStore,
} from "../../store/Store";
import LineChart from "./LineChart";
import ethereumlogo from "../../assets/ethereumlogo.svg";
import wbtclogo from "../../assets/wbtclogo.svg";
import linklogo from "../../assets/linklogo.svg";
import paxglogo from "../../assets/paxglogo.svg";
import arblogo from "../../assets/arblogo.svg";
import { formatUnits, fromHex } from "viem";
import axios from "axios";
import { getNetwork } from "@wagmi/core";
import { useAccount } from "wagmi";

interface AcceptedTokenProps {
  amount: any;
  token: any;
}

const useSyncWidth = (ref: React.RefObject<HTMLElement>) => {
  const setWidth = useWidthStore((state) => state.setWidth);

  useLayoutEffect(() => {
    const updateWidth = () => {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [ref, setWidth]);
};

const AcceptedToken: React.FC<AcceptedTokenProps> = ({
  amount,
  token,
}) => {
  const [activeElement, setActiveElement] = useState(0);
  const { getCollateralSymbol } = useCollateralSymbolStore();
  const [euroValueConverted, setEuroValueConverted] = useState<any>(undefined);
  const { chainlinkAbi } = useChainlinkAbiStore();
  const { vaultStore } = useVaultStore();
  const { getOperationType, getGreyBarUserInput } =
    useGreyProgressBarValuesStore();
  const { arbitrumOneUSDToEuroAddress } = useUSDToEuroAddressStore();
  const { usdToEuroAbi } = useUSDToEuroAbiStore();
  const { address } = useAccount();

  const provider = new ethers.providers.JsonRpcProvider(
    import.meta.env.VITE_ALCHEMY_URL
  );
  const signer = provider.getSigner(address);
  let myToken: any = undefined;
  // console.log('xxxx',vaultStore)
  // const myToken2 = vaultStore.status.collateral.filter(asset => console.log('xxx',asset));
  // console.log('xxx', symbol, myToken2);
  const symbol = ethers.utils.parseBytes32String(token.symbol) 

  const getUsdPriceOfToken = async () => {
    //the first [0] is the token type, so it should be dynamic
    if (symbol === "ETH") {
      myToken = vaultStore.status.collateral[0].token;
    } else if (symbol === "WBTC") {
      myToken = vaultStore.status.collateral[1].token;
      console.log(vaultStore.status.collateral[1].token);
    } else if (symbol === "ARB") {
      myToken = vaultStore.status.collateral[2].token;
      console.log(
        fromHex(vaultStore.status?.collateral[0].token.symbol, "string")
      );
    } else if (symbol === "LINK") {
      myToken = vaultStore.status.collateral[3].token;
    } else if (symbol === "PAXG") {
      myToken = vaultStore.status.collateral[4].token;
      console.log(
        fromHex(vaultStore.status?.collateral[4].token.symbol, "string")
      );
    } else if (symbol === "AGOR") {
      myToken = vaultStore.status.collateral[0].token;
      console.log(
        fromHex(vaultStore.status?.collateral[0].token.symbol, "string")
      );
    } else if (symbol === "SUSD6") {
      myToken = vaultStore.status.collateral[1].token;
      console.log(
        fromHex(vaultStore.status?.collateral[1].token.symbol, "string")
      );
    } else if (symbol === "SUSD18") {
      myToken = vaultStore.status.collateral[2].token;
      console.log(
        fromHex(vaultStore.status?.collateral[2].token.symbol, "string")
      );
    }
    const contract = new ethers.Contract(myToken.clAddr, chainlinkAbi, signer);
    console.log(contract);
    const price = await contract.latestRoundData();
    console.log(price);
    const priceInUsd = fromHex(price.answer, "number");
    console.log(BigInt(priceInUsd));
    const priceFormatted = formatUnits(BigInt(priceInUsd), 8);
    console.log(priceFormatted);
    console.log(amount);

    const amountFormatted = formatUnits(amount, token.dec);
    console.log(amountFormatted);

    const amountinUsd = Number(amountFormatted) * Number(priceFormatted);
    console.log(amountinUsd.toFixed(2));
    convertUsdToEuro(amountinUsd.toFixed(2));
  };

  const { chain } = getNetwork();

  const convertUsdToEuro = async (priceInUsd: any) => {
    try {
      const contract = new ethers.Contract(
        arbitrumOneUSDToEuroAddress,
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
      const euroValueConverted = priceInUsd / priceInEuroFormatted;
      console.log(euroValueConverted);
      setEuroValueConverted(euroValueConverted.toFixed(2));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsdPriceOfToken();
  }, []);

  useEffect(() => {
    console.log(amount);
    getUsdPriceOfToken();
  }, [amount]);

  //ref to width sharing
  const ref = useRef<HTMLDivElement>(null);
  useSyncWidth(ref);

  const [chartData, setChartData] = useState<any>(undefined);

  const getChartData = async () => {
    try {
      const response = await axios.get(
        "https://smart-vault-api.thestandard.io/"
      );
      console.log(response.data);
      setChartData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getChartData();
  }, []);

  const renderLineChartForArbitrum = () => {
    if (chartData) {
      if (symbol === "ETH") {
        return (
          <LineChart data={chartData.arbitrum.ETH.prices} symbol={symbol} />
        );
      } else if (symbol === "WBTC") {
        return (
          <LineChart data={chartData.arbitrum.WBTC.prices} symbol={symbol} />
        );
      } else if (symbol === "LINK") {
        return (
          <LineChart data={chartData.arbitrum.LINK.prices} symbol={symbol} />
        );
      } else if (symbol === "ARB") {
        return (
          <LineChart data={chartData.arbitrum.ARB.prices} symbol={symbol} />
        );
      } else if (symbol === "PAXG") {
        return (
          <LineChart data={chartData.arbitrum.PAXG.prices} symbol={symbol} />
        );
      }
    }
  };

  const renderLineChartForSepolia = () => {
    if (chartData) {
      if (symbol === "SUSD6") {
        return (
          <LineChart data={chartData.sepolia.SUSD6.prices} symbol={symbol} />
        );
      } else if (symbol === "SUSD18") {
        return (
          <LineChart data={chartData.sepolia.SUSD18.prices} symbol={symbol} />
        );
      } else {
        return (
          <LineChart data={chartData.sepolia.ETH.prices} symbol={symbol} />
        );
      }
    }

    return null; // Return null or some fallback content if chartData is not available yet.
  };

  const renderLineChartForArbitrumGoerli = () => {
    if (chartData) {
      if (symbol === "SUSD6") {
        return (
          <LineChart
            data={chartData.arbitrum_goerli.SUSD6.prices}
            symbol={symbol}
          />
        );
      } else if (symbol === "SUSD18") {
        return (
          <LineChart
            data={chartData.arbitrum_goerli.SUSD18.prices}
            symbol={symbol}
          />
        );
      } else {
        return (
          <LineChart
            data={chartData.arbitrum_goerli.AGOR.prices}
            symbol={symbol}
          />
        );
      }
    }

    return null; // Return null or some fallback content if chartData is not available yet.
  };

  const handleClick = (element: number) => {
    setActiveElement(element);
    console.log(symbol);
    getCollateralSymbol(symbol);
    getOperationType(element);
    getGreyBarUserInput(0);
  };

  return (
    <Box
      sx={{
        background:
          "linear-gradient(110.28deg, rgba(26, 26, 26, 0.156) 0.2%, rgba(0, 0, 0, 0.6) 101.11%)",

        borderRadius: "10px",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(13.9px)",
        WebkitBackdropFilter: "blur(13.9px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        width: "auto",
        padding: "1rem",
        marginTop: "0.5rem",
        marginBottom: "1rem",
        display: "flex",
        flexDirection: "column",
        height: "auto",
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Box
            sx={{
              // color: "#00FFF0",
              border: "1px solid #8E9BAE",
              borderRadius: "50%",
              width: "3.5rem",
              height: "3.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {symbol === "ETH" ? (
              <img
                style={{ height: "3rem", width: "3rem" }}
                src={ethereumlogo}
                alt="ethereum logo"
              />
            ) : symbol === "WBTC" ? (
              <img
                style={{ height: "3rem", width: "3rem" }}
                src={wbtclogo}
                alt="wbtc logo"
              />
            ) : symbol === "LINK" ? (
              <img
                style={{ height: "3rem", width: "3rem" }}
                src={linklogo}
                alt="link logo"
              />
            ) : symbol === "ARB" ? (
              <img
                style={{ height: "3rem", width: "3rem" }}
                src={arblogo}
                alt="arb logo"
              />
            ) : symbol === "PAXG" ? (
              <img
                style={{ height: "3rem", width: "3rem" }}
                src={paxglogo}
                alt="paxg logo"
              />
            ) : (
              <Typography variant="body2"> {symbol}</Typography>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                marginTop: "1rem",
                color: "white",
              }}
              variant="body1"
            >
              {formatUnits(amount, token.dec)} {symbol}
            </Typography>{" "}
            <Typography
              sx={{
                color: "white",
              }}
              variant="body1"
            >
              {euroValueConverted ? <div>€{euroValueConverted}</div> : null}
            </Typography>
          </Box>
        </Box>
        {/* line chart comes here */}
        <Box
          sx={{
            minWidth: { xs: "100%", lg: "400px" },
            width: "auto",
            height: { xs: "100px", sm: "150px", md: "200px" },
          }}
        >
          {chain?.id == 421613
            ? renderLineChartForArbitrumGoerli()
            : chain?.id == 11155111
            ? renderLineChartForSepolia()
            : chain?.id == 42161
            ? renderLineChartForArbitrum()
            : /* <LineChart /> */
              null}
          {/* <LineChart /> */}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          // background: " rgba(18, 18, 18, 0.5)",
          // boxShadow:
          //   " 0px 1.24986px 1.24986px rgba(255, 255, 255, 0.5), inset 0px 1.24986px 0px rgba(0, 0, 0, 0.25)",
          // borderRadius: "10px",
          // padding: "1%",
          marginTop: "2rem",
        }}
      >
        <Box
          sx={{
            margin: "2px",
            padding: "5px",
            width: "33%",
            cursor: "pointer",
            textAlign: "center",
            borderRadius: "10px",
            marginLeft: "10px",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            boxShadow:
              "0 5px 15px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.2)",
            fontFamily: '"Poppins", sans-serif',
            color: "#ffffff",
            fontSize: "1rem",
            letterSpacing: "1px",
            backdropFilter: "blur(8px)",
            transition: "0.5s",
            position: "relative",
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
              border: "1px solid white",
              boxShadow: "0 0 2px 2px rgba(255, 255, 255, 0.5)",
            },
          }}
          className={activeElement === 1 ? "activeBtn" : ""}
          onClick={() => handleClick(1)}
          ref={ref}
        >
          Deposit
        </Box>
        <Box
          sx={{
            margin: "2px",
            padding: "5px",
            width: "33%",
            cursor: "pointer",
            textAlign: "center",
            borderRadius: "10px",
            marginLeft: "10px",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            boxShadow:
              "0 5px 15px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.2)",
            fontFamily: '"Poppins", sans-serif',
            color: "#ffffff",
            fontSize: "1rem",
            letterSpacing: "1px",
            backdropFilter: "blur(8px)",
            transition: "0.5s",
            position: "relative",
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
              border: "1px solid white",
              boxShadow: "0 0 2px 2px rgba(255, 255, 255, 0.5)",
            },
          }}
          className={activeElement === 2 ? "activeBtn" : ""}
          onClick={() => handleClick(2)}
        >
          Withdraw
        </Box>{" "}
        <Box
          sx={{
            margin: "2px",
            padding: "5px",
            width: "33%",
            cursor: "pointer",
            textAlign: "center",
            borderRadius: "10px",
            marginLeft: "10px",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            boxShadow:
              "0 5px 15px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.2)",
            fontFamily: '"Poppins", sans-serif',
            color: "#ffffff",
            fontSize: "1rem",
            letterSpacing: "1px",
            backdropFilter: "blur(8px)",
            transition: "0.5s",
            position: "relative",
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
              border: "1px solid white",
              boxShadow: "0 0 2px 2px rgba(255, 255, 255, 0.5)",
            },
          }}
          className={activeElement === 3 ? "activeBtn" : ""}
          onClick={() => handleClick(3)}
        >
          Swap
        </Box>
      </Box>
      <Actions
        activeElement={activeElement}
        symbol={symbol}
        tokenAddress={token.addr}
        decimals={token.dec}
        token={token}
      />
    </Box>
  );
};

export default AcceptedToken;
