import Web3 from "web3";
import {setGlobalState, getGlobalState, setAlert} from './store'
import abi from './abis/NFTMarketplace.json'

const { ethereum } = window
window.web3 = new Web3(ethereum)
window.web3 = new Web3(window.web3.currentProvider)

async function enableMetaMask() {
    try {
      await window.ethereum.enable();
    } catch (error) {
      console.error('User denied account access or MetaMask not available', error);
    }
}

const getEthereumContract = async () => {
    const connectedAccount = getGlobalState('connectedAccount')

    if(connectedAccount) {
        const web3 = window.web3
        const networkId = await web3.eth.net.getId()
        const networkData = abi.networks[networkId]

        if(networkData) {
            const contract = new web3.eth.Contract(abi.abi, networkData.address)

            return contract
        }
        else {
            return null
        }
    }
    else {
        return getGlobalState('contract')
    }
}

const connectWallet = async () => {
    try {
        if(!ethereum) return alert('Please install Metamask')
        const accounts = await ethereum.request({method: 'eth_requestAccounts'})
        setGlobalState('connectedAccount', accounts[0].toLowerCase())
    } 
    catch (error) {
        reportError(error)
    }
}

const isWalletConnected = async () => {
    try {
        if(!ethereum) return alert('Please install Metamask')
        const accounts = await ethereum.request({method: 'eth_requestAccounts'})
        
        window.ethereum.on('chainChanged', async (chainId) => {
            window.location.reload()
        })
        
        window.ethereum.on('accountsChanged', async () => {
            setGlobalState('connectedAccount', accounts[0].toLowerCase())
            await isWalletConnected()
        })
        if(accounts.length) {
            setGlobalState('connectedAccount', accounts[0].toLowerCase())
        }
        else{
            alert('Please connect wallet')
            console.log('No accounts found')
        }
    } catch (error) {
        reportError(error)
    }
}

const reportError = (error) => {
    setAlert(JSON.stringify(error), 'red')
    throw new Error('No Ethereum Object.')
}

const mintNFT = async ({title, description, metadataURI, price}) => {
    try {
        price = window.web3.utils.toWei(price.toString(), 'ether')
        const contract = await getEthereumContract()
        const connectedAccount = getGlobalState('connectedAccount')
        const mintPrice = window.web3.utils.toWei('0.01', 'ether')

        alert("BS :" + metadataURI)
        await contract.methods.payToMint(title, description, metadataURI, price).send({from: connectedAccount, value: mintPrice})
        return true
    } catch (error) {
        reportError(error)
    }
}

const updateNFT = async ({id, cost}) => {
    try {
        cost = window.web3.utils.toWei(cost.toString(), 'ether')
        const contract = await getEthereumContract()
        const connectedAccount = getGlobalState('connectedAccount')
        alert(contract + " : " + connectedAccount)
        //id++;
        await contract.methods.changePrice(Number(id), cost).send({from: connectedAccount})

    } catch (error) {
        reportError(error)
    }
}

const buyNFT = async ({id, cost}) => {
    try {
        cost = window.web3.utils.toWei(cost.toString(), 'ether')
        const contract = await getEthereumContract()
        const connectedAccount = getGlobalState('connectedAccount')
        //id++
        await contract.methods.payToBuy(Number(id)).send({from: connectedAccount, value: cost})
    } catch (error) {
        reportError(error)
    }
}

const getAllNFTs = async () => {
    try {
        if(!ethereum) return alert('Please install Metamask')

        const contract = await getEthereumContract()

        const nfts = await contract.methods.getAllNFTs().call()
        const transactions = await contract.methods.getAllTransactions().call()

        setGlobalState('nfts', structuredNFTs(nfts))
        setGlobalState('transactions', structuredNFTs(transactions))
        alert("AL " + nfts[5].metadataURI)
    } catch (error) {
        reportError(error)
    }
}

const structuredNFTs = (nfts) => {
    return nfts.map((nft) => ({
        id: Number(nft.id),
        owner: nft.owner.toLowerCase(),
        cost: window.web3.utils.fromWei(nft.cost),
        title: nft.title,
        metadataURI: nft.metadataURI,
        description: nft.description,
        timestamp: nft.timestamp,
    })).reverse()
}

export {connectWallet, isWalletConnected, getAllNFTs, structuredNFTs, mintNFT, getEthereumContract as getEthereumContrat, updateNFT, buyNFT, enableMetaMask}