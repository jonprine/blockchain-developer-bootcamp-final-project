import Web3 from 'web3';
import detectEthereumProvider from "@metamask/detect-provider";
import Concert from './contracts/Concert.json';

const getWeb3 = () =>
  new Promise(async (resolve, reject) => {
    let provider = await detectEthereumProvider();

    if (provider) {
      await provider.request({ method: "eth_requestAccounts" });

      try {
        const web3 = new Web3(window.ethereum);

        resolve(web3);
      } catch (error) {
        reject(error);
      }
    }
    reject("Install Metamask");
  });

const getConcert = async web3 => {
    const networkId = await web3.eth.net.getId();
    const contractDeployment = Concert.networks[networkId];
    return new web3.eth.Contract(
        Concert.abi,
        contractDeployment && contractDeployment.address
    );
};

export { getWeb3, getConcert}
