import { Row, Col, Card, Image} from "react-bootstrap";
import { DEFAULT_BANNER_IMAGE, DEFAULT_PROFILE_IMAGE } from "../../constants";

import { MintMusic } from "./NewMusic";

export function Banner({creator}) {

  if(!creator){
    return null;
  }

  return (
    <Row>
      <Col xs={12}>
        <Card className="bg-dark text-white" style={{maxHeight: "50vh", overflowY: "hidden"}}>
          <Card.Img className="fluid" src={DEFAULT_BANNER_IMAGE} alt="Creator's cover" />
          <Card.ImgOverlay className="d-flex justify-content-start align-items-end pb-2">
            <div className="d-flex align-items-center">
            <Image src={creator?.image || DEFAULT_PROFILE_IMAGE} alt="Creator's profile" style={{width: "120px"}} roundedCircle={true} />
            <div className="d-flex flex-column ">
                <h3>{creator?.name}</h3>
                <p className="text-muted">{creator?.description}</p>
            </div>
            </div>
          </Card.ImgOverlay>
        </Card>
      </Col>
      <MintMusic />
    </Row>
  );
}
