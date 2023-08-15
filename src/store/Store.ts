import { create } from "zustand";
import vaultManagerAbi from "../abis/vaultManager.ts";
import erc20Abi from "../abis/erc20.ts";
import chainlinkAbi from "../abis/priceFeeds/chainlink.ts";
import usdToEuroAbi from "../abis/priceFeeds/usdtoeuro.ts";
import smartVaultABI from "../abis/smartVault.ts";
import WBTCABI from "../abis/tokens/WBTCABI.ts";
import ethtousdAbi from "../abis/priceFeeds/ethtousd.ts";
import { Address } from "viem";

// interface PriceCalculatorState {
//   priceCalculatorabi: Array<any>;
// }
// //this one is eth to usd price calculator
// export const usePriceCalculatorStore = create<PriceCalculatorState>(() => ({
//   priceCalculatorabi: priceCalculatorAbi,
// }));
interface EthToUsdAbiState {
  ethToUsdAbi: Array<any>;
  getEthToUsdAbi: (ethToUsdAbi: Array<any>) => void;
}

export const useEthToUsdAbiStore = create<EthToUsdAbiState>()((set) => ({
  ethToUsdAbi: ethtousdAbi,
  getEthToUsdAbi: (ethToUsdAbi) => set(() => ({ ethToUsdAbi: ethToUsdAbi })),
}));
interface UsdToEuroState {
  usdToEuroAbi: Array<any>;
}

export const useUsdToEuroStore = create<UsdToEuroState>(() => ({
  usdToEuroAbi: usdToEuroAbi,
}));

interface ChainIdState {
  chainId: number;
  getChainId: (chainId: number) => void;
}

export const useChainIdStore = create<ChainIdState>((set) => ({
  chainId: 1,
  getChainId: (chainId) => set(() => ({ chainId: chainId })),
}));

interface ChainlinkAbiState {
  chainlinkAbi: Array<any>;
  getChainlinkAbi: (chainlinkAbi: Array<any>) => void;
}

export const useChainlinkAbiStore = create<ChainlinkAbiState>()((set) => ({
  chainlinkAbi: chainlinkAbi,
  getChainlinkAbi: (chainlinkAbi) =>
    set(() => ({ chainlinkAbi: chainlinkAbi })),
}));

interface USDToEuroAbiState {
  usdToEuroAbi: Array<any>;
  getUSDToEuroAbi: (usdToEuroAbi: Array<any>) => void;
}

export const useUSDToEuroAbiStore = create<USDToEuroAbiState>()((set) => ({
  usdToEuroAbi: usdToEuroAbi,
  getUSDToEuroAbi: (usdToEuroAbi) =>
    set(() => ({ usdToEuroAbi: usdToEuroAbi })),
}));

interface EthToUsdAddressState {
  ethToUsdAddress: Address;
  arbitrumGoerliethToUsdAddress: Address;
  arbitrumOneEthToUsdAddress: Address;
  getEthToUsdAddress: (ethToUsdAddress: Address) => void;
}

export const useEthToUsdAddressStore = create<EthToUsdAddressState>()(
  (set) => ({
    ethToUsdAddress: "0x10742171dD4aB632653869d3a03b2195a10C5f1F",
    arbitrumGoerliethToUsdAddress: "0x62CAe0FA2da220f43a51F86Db2EDb36DcA9A5A08",
    arbitrumOneEthToUsdAddress: "0x639fe6ab55c921f74e7fac1ee960c0b6293ba612",
    getEthToUsdAddress: (ethToUsdAddress) =>
      set(() => ({ ethToUsdAddress: ethToUsdAddress })),
  })
);

interface USDToEuroAddressState {
  usdToEuroAddress: Address;
  arbitrumGoerliUSDToEuroAddress: Address;
  arbitrumOneUSDToEuroAddress: Address;
  getUSDToEuroAddress: (usdToEuroAddress: Address) => void;
}

export const useUSDToEuroAddressStore = create<USDToEuroAddressState>()(
  (set) => ({
    usdToEuroAddress: "0x59a6A8357BD5Ae002DEd9A5F72ab526f9fDc573A",
    arbitrumGoerliUSDToEuroAddress:
      "0xe5CD8A83fc9E1bb87b2576B2999f99A1328D3888",
    arbitrumOneUSDToEuroAddress: "0xA14d53bC1F1c0F31B4aA3BD109344E5009051a84",
    getUSDToEuroAddress: (usdToEuroAddress: Address) =>
      set(() => ({ usdToEuroAddress: usdToEuroAddress })),
  })
);

interface sEuroAddressState {
  sEuroAddress: string;
  arbitrumGoerlisEuroAddress: string;
  arbitrumsEuroAddress: string;
  getsEuroAddress: (sEuroAddress: string) => void;
}

export const usesEuroAddressStore = create<sEuroAddressState>()((set) => ({
  sEuroAddress: "0xf23F59316A2700D88F6F503B24aEE01118255645",
  arbitrumGoerlisEuroAddress: "0x9C777AD2575010E3ED67F6E849cfE1115BFE2A50",
  arbitrumsEuroAddress: "0x643b34980e635719c15a2d4ce69571a258f940e9",
  getsEuroAddress: (sEuroAddress) =>
    set(() => ({ sEuroAddress: sEuroAddress })),
}));

interface smartVaultABIState {
  smartVaultABI: Array<any>;
}

export const useSmartVaultABIStore = create<smartVaultABIState>(
  () => ({
    smartVaultABI,
  })
);

interface contractAddressState {
  contractAddress: any;
  arbitrumGoerliContractAddress: any;
  arbitrumContractAddress: any;
  getContractAddress: (contractAddress: string) => void;
}
//this is the smart vault manager, I need to change its name to it
export const useContractAddressStore = create<contractAddressState>()(
  (set) => ({
    contractAddress: "0x0b64cb41B81f631503a562D2ACd9EBF52ac09061",
    arbitrumGoerliContractAddress: "0x2342755a637451e9af75545e257Cb007EaC930B1",
    arbitrumContractAddress: "0xba169cceCCF7aC51dA223e04654Cf16ef41A68CC",
    getContractAddress: (contractAddress) =>
      set(() => ({ contractAddress: contractAddress })),
  })
);

interface TokenManagerAddressState {
  tokenManagerAddress: string;
  arbitrumGoerliTokenManagerAddress: string;
  arbitrumTokenManagerAddress: string;
  getTokenManagerAddress: (tokenManagerAddress: string) => void;
}

export const useTokenManagerAddressStore = create<TokenManagerAddressState>()(
  (set) => ({
    tokenManagerAddress: "0xEB704FE5B1F5C23f7062780CE23323027a58d996",
    arbitrumGoerliTokenManagerAddress:
      "0x08A9Aae3Fb5581D57fbE509451042cb446495b57",
    arbitrumTokenManagerAddress: "0x33c5A816382760b6E5fb50d8854a61b3383a32a0",
    getTokenManagerAddress: (tokenManagerAddress) =>
      set(() => ({ tokenManagerAddress: tokenManagerAddress })),
  })
);

interface TokenManagerAbiState {
  tokenManagerAbi: Array<any>;
  getTokenManagerAbi: (tokenManagerAbi: Array<any>) => void;
}

export const useTokenManagerAbiStore = create<TokenManagerAbiState>()(
  (set) => ({
    tokenManagerAbi: [],
    getTokenManagerAbi: (tokenManagerAbi) =>
      set(() => ({ tokenManagerAbi: tokenManagerAbi })),
  })
);

interface VaultManagerAbiState {
  vaultManagerAbi: Array<any>;
  getVaultManagerAbi: (vaultManagerAbi: Array<any>) => void;
}

export const useVaultManagerAbiStore = create<VaultManagerAbiState>()(
  (set) => ({
    vaultManagerAbi: vaultManagerAbi,
    getVaultManagerAbi: (vaultManagerAbi) =>
      set(() => ({ vaultManagerAbi: vaultManagerAbi })),
  })
);

interface Erc20AbiState {
  erc20Abi: Array<any>;
  getErc20Abi: (erc20Abi: Array<any>) => void;
}

export const useErc20AbiStore = create<Erc20AbiState>()((set) => ({
  erc20Abi: erc20Abi,
  getErc20Abi: (erc20Abi) => set(() => ({ erc20Abi: erc20Abi })),
}));

interface VaultIdState {
  vaultID: any;
  getVaultID: (id: any) => void;
}

export const useVaultIdStore = create<VaultIdState>()((set) => ({
  vaultID: 1,
  getVaultID: (id) => set(() => ({ vaultID: id })),
}));

interface VaultsState {
  vaultsStore: Array<any>;
  getVaultsStore: (vaultsStore: Array<any>) => void;
}

export const useVaultsStore = create<VaultsState>()((set) => ({
  vaultsStore: [],
  getVaultsStore: (vaultsStore) => set(() => ({ vaultsStore: vaultsStore })),
}));

//individual vault

interface VaultState {
  vaultStore: any;
  getVaultStore: (vaultStore: Array<any>) => void;
}

export const useVaultStore = create<VaultState>()((set) => ({
  vaultStore: [],
  getVaultStore: (vaultStore) => set(() => ({ vaultStore: vaultStore })),
}));

interface VaultAddressState {
  vaultAddress: string;
  getVaultAddress: (vaultAddress: string) => void;
}

export const useVaultAddressStore = create<VaultAddressState>((set) => ({
  vaultAddress: "",
  getVaultAddress: (vaultAddress) => set({ vaultAddress: vaultAddress }), // Corrected line
}));

interface CollateralSymbolState {
  collateralSymbol: string;
  getCollateralSymbol: (collateralSymbol: string) => void;
}

export const useCollateralSymbolStore = create<CollateralSymbolState>()(
  (set) => ({
    collateralSymbol: "",
    getCollateralSymbol: (collateralSymbol) =>
      set(() => ({ collateralSymbol: collateralSymbol })),
  })
);

interface TransactionHashState {
  transactionHash: string;
  getTransactionHash: (transactionHash: string) => void;
}

export const useTransactionHashStore = create<TransactionHashState>()(
  (set) => ({
    transactionHash: "",
    getTransactionHash: (transactionHash) =>
      set(() => ({ transactionHash: transactionHash })),
  })
);

interface PositionState {
  setPosition: any;
  right: number;
  top: number;
}

export const usePositionStore = create<PositionState>((set) => ({
  right: 0,
  top: 0,
  setPosition: (position: PositionState) => set(position),
}));

type WidthState = {
  width: number;
  setWidth: (width: number) => void;
};

export const useWidthStore = create<WidthState>((set) => ({
  width: 0,
  setWidth: (width) => set({ width }),
}));

interface CirccularProgressState {
  circularProgress: boolean;
  progressType: number;
  getCircularProgress: (circularProgress: boolean) => void;
  getProgressType: (progressType: number) => void;
}

export const useCircularProgressStore = create<CirccularProgressState>(
  (set) => ({
    circularProgress: false,
    //1 for withdraw, 2 for deposit, 3 for new vault, 5 for repay with flex-end
    progressType: 1,
    getCircularProgress: (circularProgress) => set({ circularProgress }),
    getProgressType: (progressType: number) => set({ progressType }),
  })
);

interface SnackBarState {
  snackBar: number;
  getSnackBar: (snackBar: number) => void;
}

export const useSnackBarStore = create<SnackBarState>((set) => ({
  snackBar: 55,
  getSnackBar: (snackBar) => set({ snackBar }),
}));

interface VaultForListingState {
  vaultForListing: any;
  getVaultForListing: (vaultForListing: any) => void;
}

export const useVaultForListingStore = create<VaultForListingState>((set) => ({
  vaultForListing: [],
  getVaultForListing: (vaultForListing) => set({ vaultForListing }),
}));

interface BurgerMenuState {
  burgerMenu: boolean;
  getBurgerMenu: (burgerMenu: boolean) => void;
}

export const useBurgerMenuStore = create<BurgerMenuState>((set) => ({
  burgerMenu: false,
  getBurgerMenu: (burgerMenu) => set({ burgerMenu }),
}));

interface GreyProgressBarValuesState {
  userInputForGreyBarOperation: any;
  symbolForGreyBar: string;
  // 1 for deposit, 2 for withdraw, 3 for swap, 4 for Borrow, 5 for Repay
  operationType: number;

  getGreyBarUserInput: (userInputForGreyBarOperation: any) => void;
  getSymbolForGreyBar: (symbolForGreyBar: string) => void;
  getOperationType: (operationType: number) => void;
}

export const useGreyProgressBarValuesStore = create<GreyProgressBarValuesState>(
  (set) => ({
    userInputForGreyBarOperation: 0,
    symbolForGreyBar: "",
    operationType: 0,

    getGreyBarUserInput: (userInputForGreyBarOperation) =>
      set({ userInputForGreyBarOperation }),
    getSymbolForGreyBar: (symbolForGreyBar) => set({ symbolForGreyBar }),
    getOperationType: (operationType) => set({ operationType }),
  })
);

interface NFTListingModalState {
  totalValue: number;
  getNFTListingModalTotalValue: (totalValue: number) => void;
  totalValueMinusDebt: number;
  getNFTListingModalTotalValueMinusDebt: (totalValueMinusDebt: number) => void;
}

export const useNFTListingModalStore = create<NFTListingModalState>((set) => ({
  totalValue: 0,
  getNFTListingModalTotalValue: (totalValue) => set({ totalValue }),
  totalValueMinusDebt: 0,
  getNFTListingModalTotalValueMinusDebt: (totalValueMinusDebt) =>
    set({ totalValueMinusDebt }),
}));

interface InputValueAsGlobalState {
  inputValue: number;
  getInputValue: (inputValue: number) => void;
}

export const useInputValueStore = create<InputValueAsGlobalState>((set) => ({
  inputValue: 0,
  getInputValue: (inputValue) => set({ inputValue }),
}));

interface CounterState {
  counter: number;
  getCounter: (delta: number) => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  counter: 0,
  getCounter: (delta) => set((state) => ({ counter: state.counter + delta })),
}));

interface WBTCAbiState {
  WBTCAbi: any;
}

export const useWBTCAbiStore = create<WBTCAbiState>(() => ({
  WBTCAbi: WBTCABI,
}));
