import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useCelo } from "@celo/react-celo";

import { useCreatorSBT } from "../../hooks/CreatorSBT";
import { useCreatorTip } from "../../hooks/CreatorTip";

export function WithdrawTip() {
    const { address } = useCelo();
    const { creator } = useCreatorSBT();
    const { creatorBalance, withdrawCreatorTip } = useCreatorTip();
    const [balance, setBalance] = useState(0);

    const getBalance = () => {
        creatorBalance(address).then((result) => setBalance(result));
    };
    useEffect(() => {
        if (!creator) {
            return;
        }

        getBalance();
    }, [creator, address]);

    if (!creator) {
        return null;
    }

    return (
        <span style={{ padding: "0 5px" }}>
            <Button
                variant="outline-light"
                onClick={async () => {
                    await withdrawCreatorTip();
                    await getBalance();
                }}
            >
                Withdraw {balance} Celo
            </Button>
        </span>
    );
}
