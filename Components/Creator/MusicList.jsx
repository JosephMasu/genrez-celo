import { Row, Col} from "react-bootstrap";
import { Empty } from "../Empty";
import { MusicNFTCard } from "../MusicNFTCard";

/**
 * display music cards
 */
export function MusicList({musciCollection}) {

    
    return (
        <Row className="mt-5 mb-5">
            <Col xs={12}>
                <h4>Music Lists</h4>
            </Col>
            <Col xs={12}>
                <Row className="g-3 align-items-stretch">
                    {/* Render music nft cards */}
                    {(musciCollection && musciCollection.length) ?
                        musciCollection?.map((nft, idx) => (
                            <Col key={idx} sm={6} md={3} lg={2}>
                                <MusicNFTCard key={idx} musicMetadata={nft} />
                            </Col>
                        )) :
                        <Empty />
                    }
                </Row>
            </Col>
        </Row>
    );
}
