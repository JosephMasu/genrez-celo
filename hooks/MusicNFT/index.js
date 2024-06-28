import {
    createContext,
    useState,
    useCallback,
} from "react";
import { useCelo } from "@celo/react-celo";

import contractArtifat from "../../abis/MusicNFT.json";
import { fetchMetaData, subgraphQuery, uploadToIpfs } from "../../utils";
import {
    getMusicNFT,
    getMusicNFTOwner,
    getMusicNFTURI,
    getOwnerMusicNFT,
    mintMusic,
    ownersTotalMusicNFT,
    totalMusicNFTs,
} from "../../services/musicNFT";
import { DEFAULT_MUSIC_COVER } from "../../constants";

const MusicNFTContext = createContext();

//MusicNFT contract context provider handling contract data
export function MusicNFTProvider({ children }) {
    const [collection, setCollection] = useState([]);

    return (
        <MusicNFTContext.Provider
            value={{
                collection,
                setCollection,
            }}
        >
            {children}
        </MusicNFTContext.Provider>
    );
}


//MusicNFT contract hook to interact with contract
export function useMusicNFT() {
    const { getConnectedKit, address } = useCelo();
    const [queryLoading, setQueryLoading] = useState(false);
    const [musicQueryResults, setMusicQueryResults] = useState([]);

    const getContract = useCallback(async () => {
        const kit = await getConnectedKit();

        const contract = new kit.connection.web3.eth.Contract(
            contractArtifat.abi,
            contractArtifat.address
        );

        return contract
    },[getConnectedKit])

    const mintMusicNFT = useCallback(async ({
		artist,
        title,
        coverFile,
        musicFile,
        description,
        language,
        copyright,
        encoding,
        date,
        publisher,
		feature
    }) => {

       const contract = await getContract();

        if (!musicFile) {
            toast.error("Can mint without a music file");
            return;
        }

        //upload music file to ipfs
        const musicURI = await uploadToIpfs(musicFile);

        let ipfsCoverImage = DEFAULT_MUSIC_COVER;

        if (coverFile) {
            //upload cover image to ipfs
            ipfsCoverImage = await uploadToIpfs(coverFile);
        }

        //prepare meta data
        const data = JSON.stringify({
            name: title,
            description,
            image: ipfsCoverImage,
            attributes: [
				{
					trait_type: "artist",
					value: artist
				},
				{
					trait_type: "feature",
					value: feature
				},
                {
                    trait_type: "language",
                    value: language,
                },
                {
                    trait_type: "encoding",
                    value: encoding,
                },
                {
                    trait_type: "date",
                    value: date,
                },
                {
                    trait_type: "copyright",
                    value: copyright,
                },
                {
                    trait_type: "publisher",
                    value: publisher,
                },
                {
                    trait_type: "musicURI",
                    value: musicURI,
                },
            ],
        });

        const metadataURI = await uploadToIpfs(data);

        await mintMusic(contract, address, metadataURI, title, artist, feature);
        await getOwnersMusicNFTs();
        
    },[address,getContract])

    const getOwnersMusicNFTs = async (owner = address) => {
        const contract = await getContract();

        const ownersNFTLength = await ownersTotalMusicNFT(contract, owner);

        const nfts = [];
        for (let i = 0; i < Number(ownersNFTLength); i++) {
            const nft = new Promise(async (resolve) => {
				try {
					const tokenId = await getOwnerMusicNFT(contract, owner, i);
					const uri = await getMusicNFTURI(contract, tokenId);
					const metadata = await fetchMetaData(uri);
					resolve({ ...metadata, owner});
				} catch (error) {
					resolve(null);
				}
            });

            nfts.push(nft);
        }

		const results = await Promise.all(nfts);

        return results;
    }

    const getMusicNFTs = useCallback(async () => {
		const contract = await getContract();

        const NFTLength = await totalMusicNFTs(contract, address);

        const nfts = [];
        for (let i = 0; i < NFTLength; i++) {
            const nft = new Promise(async (resolve) => {
				try {
					const tokenId = await getMusicNFT(contract, i);
					const uri = await getMusicNFTURI(contract, tokenId);
                    const owner = await getMusicNFTOwner(contract, tokenId);
					const metadata = await fetchMetaData(uri);
					resolve({ ...metadata, owner});
				} catch (error) {
					resolve(null);
				}
            });

            nfts.push(nft);
        }

		const results = await Promise.all(nfts);

        return results;
    },[getContract, address])

    //query creators from narteysarso/genrez-celo graph
    const searchMusic = async (searchKey) => {
       
        try{
            setQueryLoading(true);
             //if `searchkey` is not empty surround it with `''` to handle spaces
            //if not ignore
            searchKey = searchKey.length ? `'${searchKey}'`: searchKey;
            //query data from the graph
            const response = await subgraphQuery( `query{ 
                musicSearch(text: "${searchKey}"){ 
                    uri 
                    title
                    artist
                    feature
                    tokenId 
                    owner } 
            }`)
           
            const resultsLen = response?.musicSearch.length;
            const music = [];
            //fetach metadata for each of the returned results from graph query
            for(let i = 0; i < resultsLen; i++){
                const {owner, uri} = response?.musicSearch[i];
                const musicCall = new Promise(async (resolve) => {
                    const musicMetadata = await fetchMetaData(uri);
                    resolve({
                        ...musicMetadata,
                        owner
                    })
    
                });
                music.push(musicCall);
            } 
            
            setMusicQueryResults(await Promise.all(music));
        }catch(error){
            console.log(error);
        }finally{
            setQueryLoading(false);
        }
    }


    return Object.freeze({
        mintMusicNFT,
		getMusicNFTs,
        getOwnersMusicNFTs,
        searchMusic,
        musicQueryResults,
        queryLoading

    });
}
