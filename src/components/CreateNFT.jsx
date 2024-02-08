import { useState } from 'react'
import {FaTimes} from 'react-icons/fa'
import { setAlert, setGlobalState, setLoadingMsg, useGlobalState } from '../store'
import { mintNFT } from "../Blockchain.services"
import { create } from 'ipfs-http-client'
import {uploadFileToIPFS} from "../pinata"

const imgHero = "https://www.usatoday.com/gcdn/-mm-/2f6a179195a35bd5207a5e4f64cc5fac05773f98/c=255-0-2015-1320/local/-/media/2022/07/25/USATODAY/usatsports/nft-coins-tokens-getty.jpeg.jpg"

const CreateNFT = () => {
    const [modal] = useGlobalState('modal')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [fileUrl, setFileUrl] = useState('')
    const [imgBase64, setImgBase64] = useState(null)
    const [file, setFile] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!title || !description || !price) return
        setGlobalState('modal', 'scale-0')
        setLoadingMsg('Uploading to Sepolia...')

        try {

            try {
                const response = await uploadFileToIPFS(file)
    
                if(response.success === true)
                {
                    alert("File upload success")
                    setFileUrl(response.pinataURL)
                }
            } catch (error) {
                alert("Change image error")
            }

            setLoadingMsg('Uploaded, approve transaction now...')
            var metadataURI = fileUrl
            alert("CN " + metadataURI)
            const nft = { title, description, metadataURI, price }
            await mintNFT(nft)
            //alert("PROSAO")
            closeModal()
            setAlert('Minting completed')
    
            window.location.reload()
        } catch (error) {
            console.log('Error uploading files', error)
            setAlert('Minting failed', 'red')
        }

    }

    const changeImage = async (e) => {
        var file = e.target.files[0]
        const reader = new FileReader()
        if (e.target.files[0]) reader.readAsDataURL(e.target.files[0])
     
        reader.onload = (readerEvent) => {
          const file = readerEvent.target.result
          setImgBase64(file)
        }
        setFile(file)
    }

    const closeModal = () => {
        setGlobalState('modal', 'scale-0')
        resetForm()
    }

    const resetForm = () => {
        setFileUrl('')
        setImgBase64(null)
        setTitle('')
        setPrice('')
        setDescription('')
    }
  return (
    <div 
        className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50
        transform transition-transform duration-300 ${modal}`}
    >
        <div className="bg-[#151c25] shadow-xl shadow-[#297ae3] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
            <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="flex justify-between items-center text-gray-400">
                    <p className="font-semibold">Add NFT</p>
                    <button onClick={closeModal} type="button" className="border-0 bg-transparent focus:outline-none">
                        <FaTimes />
                    </button>
                </div>

                <div className="flex justify-center items-center rounded-xl mt-5">
                    <div className="shrink-0 h-20 w-20 rounded-xl overflow-hidden">
                        <img className="h-full w-full object-cover cursor-pointer" src={imgBase64 || imgHero} alt="NFT" />
                    </div>
                </div>

                <div className="flex justify-between items-center bg-gray-800 rounded-xl mt-5">
                    <label className="block">
                        <span className="sr-only">Choose Profile Photo</span>
                        <input type="file" accept='image/png, image/gif, image/jpeg, image/jpg, image/webp' 
                        className="block w-full text-sm text-slate-500 
                            file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm 
                            file:font-semibold hover:file:bg-[#1d2631] focus:outline-none cursor-pointer
                            focus:ring-0"
                        onChange={changeImage}
                        required
                        />
                    </label>
                </div>

                <div className="flex justify-between items-center bg-gray-800 rounded-xl mt-5">
                    <input 
                        type="text" 
                        className="block w-full text-sm text-slate-500 
                            hover:file:bg-[#1d2631] focus:outline-none cursor-pointer
                            focus:ring-0 bg-transparent border-0"
                        placeholder='Title'
                        name='title'
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        required
                    />
                </div>

                <div className="flex justify-between items-center bg-gray-800 rounded-xl mt-5">
                    <input 
                        type="number" 
                        className="block w-full text-sm text-slate-500 
                            hover:file:bg-[#1d2631] focus:outline-none cursor-pointer
                            focus:ring-0 bg-transparent border-0"
                        placeholder='Price (ETH)'
                        min={0.01}
                        step={0.01}
                        name='price'
                        onChange={(e) => setPrice(e.target.value)}
                        value={price}
                        required
                    />
                </div>

                <div className="flex justify-between items-center bg-gray-800 rounded-xl mt-5">
                    <textarea 
                        type="text" 
                        className="block w-full text-sm text-slate-500 
                            hover:file:bg-[#1d2631] focus:outline-none cursor-pointer
                            focus:ring-0 bg-transparent border-0 h-20 resize-none"
                        placeholder='Description'
                        name='description'
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        required
                    ></textarea>
                </div>

                <button className="flex justify-center items-center shadow-lg shadow-black text-white p-2 mt-5 
                    bg-[#2898a0] hover:bg-[#287fa0] rounded-full"
                    type='submit'
                    onClick={handleSubmit}
                >
                    Mint now
                </button>

            </form>
        </div>
    </div>
  )
}

export default CreateNFT