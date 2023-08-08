import { Box, Grid, Typography } from "@mui/material";
import VaultCard from "../components/vaultCard/VaultCard";
import Datagrid from "../components/dataGrid/Datagrid";

import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import seurologo from "../assets/EUROs.svg";
import swonlogo from "../assets/KRWs.svg";
import sgbplogo from "../assets/GBPs.svg";
import susdlogo from "../assets/USDs.svg";
// import { useVaultsStore } from "../store/Store.ts";
import { useAccount } from "wagmi";
import {
  useVaultManagerAbiStore,
  useContractAddressStore,
  usePositionStore,
} from "../store/Store.ts";
// import createClientUtil from "../utils/createClientUtil.ts";
import { getNetwork } from "@wagmi/core";
import { useNetwork } from "wagmi";

const items = [
  {
    title: "EUROs",
    para: "Euro pegged",
    borrowRate: "Borrow up to 90.91%",
    image: seurologo,
    isActive: true,
  },
  {
    title: "USDs",
    para: "USD pegged",
    borrowRate: "Borrow up to 90.91%",
    image: susdlogo,
    isActive: false,
  },
  {
    title: "GBPs",
    para: "Great Britain Pound pegged",
    borrowRate: "Borrow up to 90.91%",
    image: sgbplogo,
    isActive: false,
  },
  {
    title: "KRWs",
    para: "South Korean Won pegged",
    borrowRate: "Borrow up to 90.91%",
    image: swonlogo,
    isActive: false,
  },
];

const HomePage = () => {
  // const [tokenToId, setTokenToId] = useState<any[]>([]);
  // const [resolved, setResolved] = useState(false);
  const [myVaults, setMyVaults] = useState<any[]>([]);
  const { connector: isConnected, address } = useAccount();
  // const [loading, setLoading] = useState(true); // Add this line
  const { vaultManagerAbi } = useVaultManagerAbiStore();
  const {
    contractAddress,
    arbitrumGoerliContractAddress,
    arbitrumContractAddress,
  } = useContractAddressStore();

  const rectangleRef = useRef<HTMLDivElement | null>(null);
  const setPosition = usePositionStore((state) => state.setPosition);

  const { chain } = useNetwork();

  useLayoutEffect(() => {
    function updatePosition() {
      if (rectangleRef.current) {
        const { right, top } = rectangleRef.current.getBoundingClientRect();
        setPosition({ right, top });
      }
    }

    window.addEventListener("resize", updatePosition);
    updatePosition();

    return () => window.removeEventListener("resize", updatePosition);
  }, [setPosition]);

  useEffect(() => {
    if (isConnected) {
      console.log("connected");
    }
  });

  const getVaults = async (conditionalAddress: any) => {
    //change this to arbitrum one infura
    const provider = new ethers.providers.JsonRpcProvider(
      import.meta.env.VITE_ALCHEMY_URL
    );
    const signer = provider.getSigner(address);
    console.log(signer);
    const contract = new ethers.Contract(
      conditionalAddress,
      vaultManagerAbi,
      signer
    );
    console.log(contract);
    const vaults = await contract.vaults();

    console.log("vaults", vaults);
    setMyVaults(vaults);
  };

  const getCurrentChain = async () => {
    const { chain } = getNetwork();
    if (chain?.id == 421613) {
      getVaults(arbitrumGoerliContractAddress);
    } else if (chain?.id == 11155111) {
      getVaults(contractAddress);
    } else if (chain?.id == 42161) {
      getVaults(arbitrumContractAddress);
    }
  };

  useEffect(() => {
    if (isConnected) {
      //getVaults();
      getCurrentChain();
    }
  }, [isConnected, chain]);

  // useEffect(() => {
  //   if (address) {
  //     provider.on("chainChanged", () => {
  //       getCurrentChain();
  //     });
  //   }
  // }, []);

  return (
    <Box>
      <Grid
        sx={{
          padding: "0 12%",
          margin: "1.5rem 0",
        }}
        container
        spacing={2}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr " },
            width: "100%",
            gap: "2rem",
            marginRight: "1rem",
            marginTop: "1.5rem",
            //border: "2px solid red",
          }}
          ref={rectangleRef}
        >
          {address ? (
            items.map((item) => (
              <VaultCard
                key={item.title}
                title={item.title}
                para={item.para}
                borrowRate={item.borrowRate}
                image={item.image}
                isActive={item.isActive}
              />
            ))
          ) : (
            <Box>
              Please install Metamask or any other web3 wallet to continue
            </Box>
          )}
        </Box>
      </Grid>
      <Typography
        variant="body1"
        sx={{
          textAlign: "left",

          padding: "0 12%",
        }}
      >
        My Smart Vaults
      </Typography>
      {myVaults.length > 0 ? ( // Update this line
        <Datagrid vaults={myVaults} />
      ) : (
        <Box></Box>
      )}
    </Box>
  );
};

export default HomePage;
