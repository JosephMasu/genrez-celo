import {
    createContext,
    useEffect,
    useState,
    useContext,
    useCallback,
} from "react";
import { useCelo } from "@celo/react-celo";

import contractArtifact from "../../abis/CreatorSBT.json";
import {
    burnProfile,
    getProfileURI,
    getOwnerProfileURI,
    mintProfile,
    updateProfileURI,
    totalSupply,
    ownerOfProfile,
} from "../../services/createSBT";
import {
    fetchMetaData,
    makeCreator,
    subgraphQuery,
    uploadToIpfs,
} from "../../utils";
import { DEFAULT_PROFILE_IMAGE } from "../../constants";

const CreatorSBTContext = createContext();

//CreateSBT contract context provider for handling contract data
export function CreatorSBTProvider({ children }) {
    const [creator, setCreator] = useState(null);

    return (
        <CreatorSBTContext.Provider
            value={{
                creator,
                setCreator,
            }}
        >
            {children}
        </CreatorSBTContext.Provider>
    );
}

//CreateSBT contract hook for interacting with contract
export function useCreatorSBT() {
    const { getConnectedKit, address } = useCelo();
    const { creator, setCreator } = useContext(CreatorSBTContext);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [creatorsQueryResults, setCreatorsQueryResults] = useState([]);
    const [queryLoading, setQueryLoading] = useState(false);

    //get contract instance for CreatorSBT contract
    const getContract = useCallback(
        async (abi, address) => {
            const kit = await getConnectedKit();

            const contract = new kit.connection.web3.eth.Contract(
                contractArtifact.abi,
                contractArtifact.address
            );

            return contract;
        },
        [getConnectedKit]
    );

    //get profile nft metadata for address
    const getOwnerProfile = async (address) => {
        const contract = await getContract();
        try {
            setLoadingProfile(true);
            const profileURI = await getOwnerProfileURI(contract, address);

            if (!profileURI) {
                setCreator(null);
                return;
            }

            const profileMetadata = await fetchMetaData(profileURI);

            setCreator(profileMetadata);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingProfile(false);
        }
    };

    //get profile nft metadata for address
    const getProfile = async (address) => {
        const contract = await getContract();

        const profileURI = await getOwnerProfileURI(contract, address);

        if (!profileURI) {
            return null;
        }

        const profileMetadata = await fetchMetaData(profileURI);

        return profileMetadata;
    };

    //get profile nft metadata for token
    const getProfiles = useCallback(async () => {
        const contract = await getContract();

        let artists = [];

        const numberOfProfiles = await totalSupply(contract);

        for (let tokenId = 1; tokenId <= Number(numberOfProfiles); tokenId++) {
            const artistCall = new Promise(async (resolve) => {
                const profileURI = await getProfileURI(contract, tokenId);
                const owner = await ownerOfProfile(contract, tokenId);
                const profileMetadata = await fetchMetaData(profileURI);

                resolve({
                    ...profileMetadata,
                    owner,
                });
            });
            artists.push(artistCall);
        }

        return await Promise.all(artists);
    }, [getContract]);

    //load profile of address
    useEffect(() => {
        if (!address) {
            return;
        }
        getOwnerProfile(address);
    }, [address]);

    //create/mint profile nft on CreatorSBT contract
    const createProfile = async ({ username, description, file }) => {
        const contract = await getContract();

        let ipfsImage = DEFAULT_PROFILE_IMAGE;

        // upload profile image to ipfs
        if (file) {
            ipfsImage = await uploadToIpfs(file);
        }

        //construct sbt metadata to JSON format
        const data = JSON.stringify({
            name: username,
            description,
            image: ipfsImage,
        });

        const uri = await uploadToIpfs(data);

        await mintProfile(contract, address, uri, username);
        await getOwnerProfile(address);
    };

    //updating minted profile nft on CreatorSBT contract
    const updateProfile = async ({ username, description, file }) => {
        const contract = await getContract();

        let ipfsImage = "defaultImage_uri";

        //upload profile image to ipfs
        if (file) {
            ipfsImage = await uploadToIpfs(file);
        }

        //construct sbt metadata to JSON format
        const data = JSON.stringify({
            name: username,
            description,
            image: ipfsImage,
        });

        //upload metadata to ipfs
        const uri = await uploadToIpfs(data);

        await updateProfileURI(contract, address, uri, username);
    };

    //burn profile nft on CreatorSBT contract
    const removeProfile = async () => {
        const contract = await getContract(address);

        await burnProfile(contract, address);
    };

    //query creators from narteysarso/genrez-celo graph
    const searchCreators = async (searchKey) => {
        try {
            setQueryLoading(true);
            //if `searchkey` is not empty surround it with `''` to handle spaces
            //if not ignore
            searchKey = searchKey.length ? `'${searchKey}'` : searchKey;

            //query data from the graph
            const response = await subgraphQuery(`query{ 
                creatorSearch(text: "${searchKey}"){ 
                    uri 
                    name 
                    tokenId 
                    owner } 
            }`);

            const resultsLen = response?.creatorSearch.length;
            const artists = [];
            //fetach metadata for each of the returned results from graph query
            for (let i = 0; i < resultsLen; i++) {
                const { owner, uri } = response?.creatorSearch[i];
                const artistCall = new Promise(async (resolve) => {
                    const profileMetadata = await fetchMetaData(uri);
                    resolve({
                        ...profileMetadata,
                        owner,
                    });
                });
                artists.push(artistCall);
            }

            setCreatorsQueryResults(await Promise.all(artists));
        } catch (error) {
            console.log(error);
        } finally {
            setQueryLoading(false);
        }
    };

    return Object.freeze({
        getOwnerProfile,
        getProfiles,
        getProfile,
        removeProfile,
        createProfile,
        updateProfile,
        searchCreators,
        creator,
        loadingProfile,
        queryLoading,
        creatorsQueryResults,
    });
}
