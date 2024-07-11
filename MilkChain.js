import "react-native-get-random-values";
import 'text-encoding';
import Web3 from 'web3';
import MilkChainContract from './MilkChain.json';

// Configura Web3
const web3 = new Web3(new Web3.providers.HttpProvider(""));

// ABI e indirizzo del contratto
const contractABI = MilkChainContract.abi;
const contractAddress = "0x0DBA7665E9FE1D82D4FFE9041997C0351C5c9249";

// Crea un'istanza del contract
const contract = new web3.eth.Contract(contractABI, contractAddress); 

export default contract;
