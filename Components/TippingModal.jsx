import { useState } from "react";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { useCreatorTip } from "../hooks/CreatorTip";

export default function TippingModal() {
    const {sendCreatorTip, showModal, setShowModal} = useCreatorTip();
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(0.000001);

    const handleClose = () => {
        setShowModal(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            await sendCreatorTip(amount);
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }
    const resetForm = () => {};

    return (
        <Modal
            show={showModal}
            onHide={handleClose}
            backdrop="static"
            className="text-dark"
        >
            <Modal.Header closeButton>
                <Modal.Title>Tip Artist</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <InputGroup>
                            <Form.Control
                                type="number"
                                value={amount}
                                onChange={(event) =>
                                    setAmount((prev) => event.target.value)
                                }
                                placeholder="Enter Amount | minimum 0.001 Celo"
                                min={0.000001}
                                step={0.000001}
                            />
                            <InputGroup.Text id="basic-addon2">
                                Celo
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="d-flex justify-content-between mt-2">
                            
                                <Button
                                    disabled={loading }
                                    type="reset"
                                    variant="warning"
                                    block={false}
                                >
                                    Reset
                                </Button>
                            
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    variant="info"
                                >
                                    Tip Creator
                                    {(loading ) && (
                                        <div
                                            className="spinner-border text-light spinner-border-sm"
                                            role="status"
                                        >
                                            <span className="visually-hidden">
                                                Loading...
                                            </span>
                                        </div>
                                    )}
                                </Button>
                        
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
