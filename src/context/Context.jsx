import React, { createContext, useState, useContext, useEffect } from "react";
import Web3 from "web3";
import {
  types,
  Web3ZKsyncL2,
  ZKsyncPlugin,
  ZKsyncWallet,
  utils,
} from "web3-plugin-zksync";
import {
  CONTRACT_ADDRESS,
  abi,
  priceFeedAbi,
  nftAbi,
  NFT_ADDRESS,
} from "../constant";
import { Models, ORAPlugin, Chain } from "@ora-io/web3-plugin-ora";
import { ChainlinkPlugin } from "@chainsafe/web3-plugin-chainlink";
import { EnsPlugin } from "@namespace-ens/web3-plugin-ens";

const web3 = new Web3();
const chainlinkPlugin = new ChainlinkPlugin(
  "https://eth-sepolia.g.alchemy.com/v2/-1HcxcXHs_85UOch3fQuC3yUtDUl7OcU"
);
web3.registerPlugin(chainlinkPlugin);
web3.registerPlugin(new ZKsyncPlugin("https://sepolia.era.zksync.dev"));
const zksync = web3.ZKsync;

const priceFeedAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
// const priceFeed = new web3.eth.Contract(priceFeedABI, priceFeedAddress);

const WalletContext = createContext(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [tewoContract, setTewoContract] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [ensName, setEnsName] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      const contract = new web3Instance.eth.Contract(abi, CONTRACT_ADDRESS);
      setTewoContract(contract);
    } else {
      console.log("MetaMask is not installed");
    }
  }, []);

  const sendGiftcard = async (to, uri) => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);

        const accounts = await web3.eth.requestAccounts();
        const account = accounts[0];

        const contract = new web3.eth.Contract(nftAbi, NFT_ADDRESS);

        await contract.methods.mintNFT(to, uri).send({ from: account });

        console.log("NFT minted successfully");
      } else {
        console.error("Ethereum wallet not detected");
      }
    } catch (error) {
      console.error("Error minting NFT:", error);
    }
  };

  const generatePic = async (from, PROMPT) => {
    const web3 = new Web3("https://1rpc.io/sepolia");
    web3.registerPlugin(new ORAPlugin(Chain.SEPOLIA));
    const estimatedFee = await web3.ora.estimateFee(Models.LLAMA2);
    await web3.ora.estimateFee(Models.STABLE_DIFFUSION);
    await web3.ora.calculateAIResult(
      from,
      Models.STABLE_DIFFUSION,
      PROMPT,
      estimatedFee
    );
    await web3.ora.getAIResult(Models.STABLE_DIFFUSION, PROMPT);
    console.log("Estimated fee: ", estimatedFee);

    setTimeout(async () => {
      const result = await web3.ora.getAIResult(Models.LLAMA2, prompt);
      console.log("Inference result: ", result);
      return result;
    }, 30000);
  };

  const connectWallet = async () => {
    if (web3) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("context account", accounts);
        setAccount(accounts[0]);
        setIsWalletConnected(true);
        const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
        setTewoContract(contract);
      } catch (error) {
        console.log("Error connecting wallet. Please try again.");
        console.trace("Error connecting wallet:", error);
      }
    } else {
      console.log(
        "MetaMask is not installed. Please install it to use this feature."
      );
    }
  };

  const connectENS = async (name) => {
    if (web3) {
      try {
        const address = await resolveENS(name);
        console.log(address);
        setEnsName(name);
        setAccount(address);
        setIsWalletConnected(true);
        console.log(isWalletConnected);
        const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
        setTewoContract(contract);
      } catch (error) {
        console.log("Error connecting wallet. Please try again.");
        console.error("Error connecting wallet:", error);
      }
    } else {
      console.log(
        "MetaMask is not installed. Please install it to use this feature."
      );
    }
  };

  const registerFarmer = async () => {
    if (tewoContract && account) {
      try {
        await tewoContract.methods.registerFarmer().send({ from: account });
        console.log("Farmer registered successfully");
      } catch (error) {
        console.error("Error registering farmer:", error);
      }
    }
  };

  const listProduce = async (produceInput) => {
    if (tewoContract && account) {
      try {
        await tewoContract.methods
          .listProduce(produceInput)
          .send({ from: account });
        console.log("Produce listed successfully");
      } catch (error) {
        console.error("Error listing produce:", error);
      }
    }
  };

  const requestPurchase = async (produceId, quantity, value) => {
    if (tewoContract && account) {
      try {
        await tewoContract.methods
          .requestPurchase(produceId, quantity)
          .send({ from: account, value });
        console.log("Purchase request made successfully");
      } catch (error) {
        console.error("Error requesting purchase:", error);
      }
    }
  };
  const getAllProduce = async () => {
    console.log(tewoContract, account);
    if (tewoContract && account) {
      try {
        console.log("Fetching produce...");
        const produceList = await tewoContract.methods.getAllProduce().call();

        const formattedProduceList = await Promise.all(
          produceList.map(async (produce) => {
            // Convert price from wei to Ether
            const priceInEth = web3.utils.fromWei(produce[4], "ether");

            // Convert Ether price to Naira
            const priceInNaira =await  getETHinNaira(priceInEth)

            return {
              produceId: Number(produce[0]),
              farmer: produce[1],
              name: produce[2],
              description: produce[3],
              price: Number(priceInNaira), 
              quantity: Number(produce[5]),
              imageUrl: produce[6],
              available: produce[7],
              company: produce[8],
              location: produce[9],
            };
          })
        );

        console.log("Formatted Produce List:", formattedProduceList);
        return formattedProduceList;
      } catch (error) {
        console.error("Error fetching all produce:", error);
      }
    }
  };

  const getProduceById = async (produceId) => {
    if (tewoContract && account) {
      try {
        const produce = await tewoContract.methods
          .getProduceById(produceId)
          .call();

        const priceInEth = web3.utils.fromWei(produce[4], "ether");

        const priceInNaira =await  getETHinNaira(priceInEth)

        const formattedProduce = {
          produceId: Number(produce[0]),
          farmer: produce[1],
          name: produce[2],
          description: produce[3],
          price: Number(priceInNaira),
          quantity: Number(produce[5]),
          imageUrl: produce[6],
          available: produce[7],
          company: produce[8],
          location: produce[9],
        };

        console.log(
          `Formatted Produce with ID ${produceId}:`,
          formattedProduce
        );
        return formattedProduce;
      } catch (error) {
        console.error(`Error fetching produce with ID ${produceId}:`, error);
      }
    }
  };

  const confirmDelivery = async (requestId) => {
    if (tewoContract && account) {
      try {
        await tewoContract.methods
          .confirmDelivery(requestId)
          .send({ from: account });
        console.log("Delivery confirmed successfully");
      } catch (error) {
        console.error("Error confirming delivery:", error);
      }
    }
  };

  const payFarmer = async (requestId) => {
    if (tewoContract && account) {
      try {
        await tewoContract.methods.payFarmer(requestId).send({ from: account });
        console.log("Farmer paid successfully");
      } catch (error) {
        console.error("Error paying farmer:", error);
      }
    }
  };

  const getETHinNaira = async (amount) => {
   try{
    const web3 = new Web3(
      "https://eth-mainnet.g.alchemy.com/v2/-1HcxcXHs_85UOch3fQuC3yUtDUl7OcU"
    );
    const chainlinkPlugin = new ChainlinkPlugin();
    web3.registerPlugin(chainlinkPlugin);
    const rawPrice = await web3.chainlink.getPrice("0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419", priceFeedAbi);
    console.log(rawPrice, "price");
    const ethPriceInUSD = Number(rawPrice.answer.toString()) / 1e8;
    console.log(ethPriceInUSD)

    const usdToNairaRate = 1500;

    const ethInNaira = amount * ethPriceInUSD * usdToNairaRate;

    return ethInNaira;
   }catch(err){
    console.trace(err)
   }
  };

  const resolveENS = async (name) => {
    const web3 = new Web3(
      "https://eth-mainnet.g.alchemy.com/v2/-1HcxcXHs_85UOch3fQuC3yUtDUl7OcU"
    );
    web3.registerPlugin(new EnsPlugin(1));
    const resolvedName = await web3.ens.getAddress(name);
    console.log("name", resolvedName);
    return resolvedName;
  };

  const getPaymasterAddress = async () => {
    const paymaster = await zksync.rpc.getTestnetPaymasterAddress();
    return paymaster;
  };

  async function claimTokens(wallet, zksync, userAddress, amount) {
    const amountToTransfer = utils.parseEther(amount);
    const usdcAddress = "0xA1a9E8c73Ecf86AE7F4858D5Cb72E689cDc9eb3e";

    try {
      const transfer = await wallet.transfer({
        to: userAddress,
        amount: amountToTransfer,
        token: usdcAddress,
      });

      // Estimate gas fee
      const gasLimit = await transfer.estimateGas();
      const gasPrice = await wallet.provider.getGasPrice();
      const fee = gasLimit.mul(gasPrice);

      const balance = await wallet.getBalance(usdcAddress);
      if (balance.lt(amountToTransfer.add(fee))) {
        throw new Error("Insufficient balance to cover transfer and fee");
      }

      const paymasterParams = utils.getPaymasterParams(
        wallet.provider.chainId,
        {
          type: "General",
          innerInput: new Uint8Array(),
        }
      );

      // Send the transaction with paymaster
      const tx = await wallet.sendTransaction({
        ...transfer,
        maxFeePerGas: gasPrice,
        maxPriorityFeePerGas: gasPrice,
        gasLimit,
        paymasterParams,
      });

      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log("Transaction successful:", receipt.transactionHash);
      console.log(
        `Transferred ${utils.formatEther(
          amountToTransfer
        )} ETH to ${userAddress}`
      );
    } catch (error) {
      console.error("Error claiming tokens:", error);
    }
  }

  async function userBonus(amount) {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const web3 = new Web3(window.ethereum);

        web3.registerPlugin(
          new ZKsyncPlugin(
            Web3ZKsyncL2.initWithDefaultProvider(types.Network.Sepolia)
          )
        );

        const zksync = web3.ZKsync;

        const accounts = await web3.eth.getAccounts();
        const currentAccount = accounts[0];

        const wallet = new zksync.Wallet(currentAccount);

        console.log("Wallet address:", await wallet.getAddress());

        // Call the claimTokens function
        await claimTokens(wallet, zksync, currentAccount, amount);
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      console.log("Please install MetaMask!");
    }
  }
  return (
    <WalletContext.Provider
      value={{
        account,
        isWalletConnected,
        web3,
        tewoContract,
        generatePic,
        connectWallet,
        registerFarmer,
        listProduce,
        requestPurchase,
        confirmDelivery,
        payFarmer,
        getETHinNaira,
        connectENS,
        userBonus,
        getAllProduce,
        getProduceById,
        sendGiftcard,
        ensName,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
