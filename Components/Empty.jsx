import {Row, Col} from "react-bootstrap";

export function Empty({title}){
    return (
        <Row>
            <Col className="text-center p-5">
                <h3>{title}</h3>
            </Col>
        </Row>
    )
}

Empty.defaultProps = {
    title: "Empty Data"
}