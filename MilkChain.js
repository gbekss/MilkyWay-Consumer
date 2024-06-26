import "react-native-get-random-values";
import 'text-encoding';
import Web3 from 'web3';
import MilkChainContract from './MilkChain.json';

// Configura Web3
const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.0.119:7545"));

// ABI e indirizzo del contratto
const contractABI = MilkChainContract.abi;
const contractAddress = "0x5109edFc21a37DE7d9D1A9F88B6df816588A793c";

// Crea un'istanza del contract
const contract = new web3.eth.Contract(contractABI, contractAddress); 

export default contract;
