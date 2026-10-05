import Identicon from 'react-identicons'
import { setGlobalState, truncate, useGlobalState } from '../store'
const Web3 = require('web3');

const imgLanding = "https://www.usatoday.com/gcdn/-mm-/2f6a179195a35bd5207a5e4f64cc5fac05773f98/c=255-0-2015-1320/local/-/media/2022/07/25/USATODAY/usatsports/nft-coins-tokens-getty.jpeg.jpg"
//const web3 = new Web3(new Web3.provider.HttpProvider('https://sepolia.infura.io/v3/<INFURA_PROJECT_ID>'));
const Hero = () => {

  const [connectedAccount] = useGlobalState('connectedAccount')
  return (
    <div className="flex flex-col md:flex-row w-4/5 justify-between items-center mx-auto py-10">
        <div className="md:w-3/6 w-full">
            <div>
                <h1 className="text-white text-5xl font-bold">
                  Buy and Sell 
                  <br /> 
                  Digital Arts, 
                  <br />
                  <span className="text-gradient">NTFs</span> 
                  Collection
                </h1>
                <p className="text-gray-500  font-semibold text-sm mt-3">Mint and collect the hottest NFTs around.</p>
            </div>

            <div className="flex mt-5">
              <button onClick={() => setGlobalState('modal', 'scale-100')} className="shadow-xl shadow-black text-white
               bg-[#2898a0] hover:bg-[#287fa0] rounded-full p-2">
                Create NTF
              </button>
            </div>

            <div className="w-3/4 flex justify-between items-center mt-5">

              <div className="text-white">
                <p className="font-bold">123k</p>
                <small className="text-gray-500">Users</small>
              </div>

              <div className="text-white">
                <p className="font-bold">152k</p>
                <small className="text-gray-500">Artworks</small>
              </div>

              <div className="text-white">
                <p className="font-bold">200k</p>
                <small className="text-gray-500">Artists</small>
              </div>

            </div>


        </div>

      <div className="shadow-xl shadow-black md:w-2/5 w-full mt-10 
        md:mt-0 rounded-md overflow-hidden bg-gray-800">

        <img className="h-60 w-full object-cover" src={imgLanding} alt="Hero" />

        <div className='flex justify-start items-center p-3'>
          <Identicon className="h-10 w-10 object-contain rounded-full mr-3" string={connectedAccount} size={50} />
        </div>
        <div className="p-3">
          <p className="text-white fonr-semibold">{truncate(connectedAccount, 4,4,11)}</p>
          <small className="text-blue-800 font-bold">@you</small>
        </div>

      </div>    
    </div>
  )
}

export default Hero