import { useMemo } from "react";
import { Button, Card, Stack } from "react-bootstrap";
import { capitalize, makeCreator} from "../utils";

/**
 * Generates MusicNFT Card from nft metadata
 * @param {Object} creatorMetadata MusicNFT metadata 
 * @returns 
 */
 export function CreatorSBTCard({creatorMetadata}) {

    const creator = useMemo( () => makeCreator(creatorMetadata), [creatorMetadata]);

  
    if(!creator){
        return null;
    }

    const {name, description, image, owner} = creator;

    return (
        
        <Card className="bg-dark text-white">
            <Card.Link href={`/creator/${owner.toString()}`} style={{textDecoration: "none", color: "inherit"}} >
            <Card.Img
                src={image || DEFAULT_MUSIC_COVER}
                alt="Card image"
                className="fluid"
            />
            <Card.Body className="mb-1">
                <Stack gap={1}>
                    <span><b>{capitalize(name)}</b></span>
                    {description && (
                        <span title={description} className="text-muted">
                            {description.length > 25
                                ? `${description.slice(0, 25)}...`
                                : description}
                        </span>
                    )} 
                </Stack>
            </Card.Body>
            </Card.Link>
        </Card>
        
    );
}
