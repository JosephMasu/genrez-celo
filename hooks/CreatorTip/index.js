import { createContext, useCallback, useContext, useState } from "react";
import { useCelo } from "@celo/react-celo";
import BigNumber from "bignumber.js";


import contractArtifact from "../../abis/CreatorTip.json";
import { balanceOf, tipCreator, withdrawTip } from "../../services/creatorTip";
import { DECIMALS } from "../../constants";

const CreatorTipContext = createContext();

export function CreatorTipProvider({children}) {
    const [showModal, setShowModal] = useState(false);
    const [tipAddress, setTipAddress] = useState(null);

    return <CreatorTipContext.Provider value={{
        setShowModal,
        setTipAddress,
        showModal,
        tipAddress
    }}>
        {children}
    </CreatorTipContext.Provider>;
}

export function useCreatorTip(){
    const {showModal, setShowModal, setTipAddress, tipAddress} = useContext(CreatorTipContext);
    const { getConnectedKit, address } = useCelo();
    
    //get contract instance for CreatorSBT contract
    const getContract = useCallback(async () => {
        const kit = await getConnectedKit();

        const contract = new kit.connection.web3.eth.Contract(
            contractArtifact.abi,
            contractArtifact.address
        );

        return contract;
    },[getConnectedKit]);


    const sendCreatorTip = async(amount) => {
        const contract = await getContract();
        const amountInCelo = (new BigNumber(amount)).multipliedBy(DECIMALS);

        await tipCreator(contract, address, tipAddress, amountInCelo );
    }

    const withdrawCreatorTip = async() => {
        const contract = await getContract();

        await withdrawTip(contract, address, address);
    }

    const creatorBalance = async(address) => {
        const contract = await getContract();

        const balance = new BigNumber(await balanceOf(contract, address));

        return (balance?.dividedBy(DECIMALS))?.toNumber();
    }


    return {
        sendCreatorTip,
        creatorBalance,
        withdrawCreatorTip,
        setTipAddress,
        setShowModal,
        showModal
    }
}
