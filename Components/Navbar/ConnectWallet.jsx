import { Button } from "react-bootstrap";
import { useCelo } from "@celo/react-celo";

export function ConnectWalletButton() {
  const { address, connect } = useCelo();

  if (address) {
    return null;
  }

  return (
    <span style={{ padding: "0 5px" }}>
      <Button variant="light" onClick={connect}>
        Connect Wallet
      </Button>
    </span>
  );
}
