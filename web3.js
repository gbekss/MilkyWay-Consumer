
import "react-native-get-random-values";
import 'text-encoding';
import MilkProcessFactory from './MilkProcessFactory.json';
import MilkProcess from './MilkProcess.json';

const getContract = async (web3, contractName, address = null) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = contractName === 'MilkProcessFactory'
    ? MilkProcessFactory.networks[networkId]
    : MilkProcess.networks[networkId];
  const contract = new web3.eth.Contract(
    contractName === 'MilkProcessFactory'
      ? MilkProcessFactory.abi
      : MilkProcess.abi,
    address || deployedNetwork && deployedNetwork.address,
  );
  return contract;
};

export { getContract };