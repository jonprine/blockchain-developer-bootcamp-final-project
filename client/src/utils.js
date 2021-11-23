import Web3 from 'web3';
import Concert from './contracts/Concert.json';

const getWeb3 = () => {
    return new Web3('http://localhost:8545')
};

const getConcert = async web3 => {
    const networkId = await web3.eth.net.getId();
    const contractDeployment = Concert.networks[networkId];
    return new web3.eth.Contract(
        Concert.abi,
        contractDeployment && contractDeployment.address
    );
};

export { getWeb3, getConcert}
