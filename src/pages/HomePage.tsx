import { Box, Grid, Typography } from "@mui/material";
import VaultCard from "../components/vaultCard/VaultCard";
import Datagrid from "../components/dataGrid/Datagrid";
// import { useContractRead } from "wagmi";
// import { useEffect } from "react";
// import { ethers } from "ethers";
// import abi from "../abis/tokenManagerABI.ts";
// import { ethers } from "ethers";
// import abi from "../abis/vaultManager.ts";
import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import seurologo from "../assets/seurologo.png";
import sarslogo from "../assets/sarslogo.png";
import saudlogo from "../assets/saudlogo.png";
import susdlogo from "../assets/susdlogo.png";
// import { useVaultsStore } from "../store/Store.ts";
import { useAccount } from "wagmi";
import {
  useVaultManagerAbiStore,
  useContractAddressStore,
  usePositionStore,
  useChainIdStore,
} from "../store/Store.ts";

const items = [
  {
    title: "sEURO",
    para: "Euro pegged",
    borrowRate: "Borrow up to 90.91%",
    image: seurologo,
    isActive: true,
  },
  {
    title: "sUSD",
    para: "USD pegged",
    borrowRate: "Borrow up to 90.91%",
    image: susdlogo,
    isActive: false,
  },
  {
    title: "sAUD",
    para: "Aussie Dollar pegged",
    borrowRate: "Borrow up to 90.91%",
    image: saudlogo,
    isActive: false,
  },
  {
    title: "sARS",
    para: "Argentine Peso pegged",
    borrowRate: "Borrow up to 90.91%",
    image: sarslogo,
    isActive: false,
  },
];

const HomePage = () => {
  // const [tokenToId, setTokenToId] = useState<any[]>([]);
  // const [resolved, setResolved] = useState(false);
  const [myVaults, setMyVaults] = useState<any[]>([]);
  const { connector: isConnected } = useAccount();
  // const [loading, setLoading] = useState(true); // Add this line
  const { vaultManagerAbi } = useVaultManagerAbiStore();
  const { contractAddress, arbitrumContractAddress, sepoliaContractAddress } =
    useContractAddressStore();
  const { chainId } = useChainIdStore();

  const rectangleRef = useRef<HTMLDivElement | null>(null);
  const setPosition = usePositionStore((state) => state.setPosition);

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

  const returnContractAddress = () => {
    if (chainId) {
      if (chainId === 5) {
        return contractAddress;
      } else if (chainId === 421613) {
        return arbitrumContractAddress;
      } else if (chainId === 11155111) {
        return sepoliaContractAddress;
      }
    }
  };

  const getVaults = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      returnContractAddress(),
      vaultManagerAbi,
      signer
    );
    const vaults = await contract.vaults();
    console.log("vaults", vaults);
    setMyVaults(vaults);
  };

  useEffect(() => {
    if (isConnected) {
      getVaults();
    }
  }, [isConnected]);

  useEffect(() => {
    console.log("chainId", chainId);
  }, [chainId]);

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
          {items.map((item) => (
            <VaultCard
              title={item.title}
              para={item.para}
              borrowRate={item.borrowRate}
              image={item.image}
              isActive={item.isActive}
            />
          ))}
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
