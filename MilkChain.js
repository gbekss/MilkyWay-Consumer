import Web3 from 'web3';
import MilkChainContract from './MilkChain.json';
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.1.19:7545"));

// ABI e indirizzo del contratto
const contractABI = MilkChainContract.abi

const contractAddress = "0xed370259b722C9001A56174a70eAbD7ca21CAe7E"

// Crea un'istanza del contratto
const contract = new web3.eth.Contract(contractABI, contractAddress);

export default contract;