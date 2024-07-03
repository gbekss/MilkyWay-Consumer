import "react-native-get-random-values";
import 'text-encoding';
import Web3 from 'web3';
import MilkChainContract from './MilkChain.json';

// Configura Web3
const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.0.119:7545"));

// ABI e indirizzo del contratto
const contractABI = MilkChainContract.abi;
const contractAddress = "0x06f808d8182674ed8ceDF72E88d0890F8b7Cb5aD";

// Crea un'istanza del contract
const contract = new web3.eth.Contract(contractABI, contractAddress); 

export default contract;
