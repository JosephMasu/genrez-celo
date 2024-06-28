import { Button } from "react-bootstrap";
import { useCelo } from "@celo/react-celo";
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useCreatorSBT } from "../../hooks/CreatorSBT";

export function BeACreator() {
  const { address} = useCelo();
  const {creator} = useCreatorSBT();
  const router = useRouter();
    

  if (!address) {
    return null;
  }

  if(creator){
    return (
      <Link href="/creator" style={{ padding: "0 5px" }}>
      <Button active={router.pathname === "/creator"} variant="outline-light">Profile</Button>
    </Link>
    );
  }

  return (
    <Link href="/creator" style={{ padding: "0 5px" }}>
      <Button active={router.pathname === "/creator"} variant="outline-light">Be A Creator</Button>
    </Link>
  );
}
