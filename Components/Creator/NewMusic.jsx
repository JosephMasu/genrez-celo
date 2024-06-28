import { useRef, useState } from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  Form,
  Image,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { DEFAULT_MUSIC_COVER } from "../../constants";
import { useCreatorSBT } from "../../hooks/CreatorSBT";
import { useMusicNFT } from "../../hooks/MusicNFT";

const today = new Date().toISOString().split('T')[0];

function MintMusciModal({ show, setShowModal, artistName }) {
  const [coverImage, setCoverImage] = useState(DEFAULT_MUSIC_COVER);
  const [coverFile, setCoverFile] = useState(null);
  const [musicFile, setMusicFile] = useState(null);
  const [musicPath, setMusicPath] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState(artistName);
  const [feature, setFeature] = useState("");
  const [encoding, setEncoding] = useState("");
  const [language, setLanguage] = useState("");
  const [date, setDate] = useState(today);
  const [copyright, setCopyright] = useState("");
  const [publisher, setPublisher] = useState("");
  const [playing, setPlaying] = useState(false);
  const musicRef = useRef();

  const { mintMusicNFT } = useMusicNFT();

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setMusicPath(null);
    setPlaying(false);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    try {
      if (!musicFile) {
        console.error("Can mint without a music file");
        return;
      }

      //prepare meta data
      await mintMusicNFT({
        title,
        description,
        coverFile,
        language,
        encoding,
        date: Date.parse(date),
        copyright,
        publisher,
        musicFile,
        feature,
        artist
      });
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    setCoverFile(file);

    if (!file) {
      setCoverImage(DEFAULT_MUSIC_COVER);
      return;
    }

    setCoverImage(window.URL.createObjectURL(file));
  };

  const handleMusicChange = (event) => {
    const file = event.target.files[0];

    setMusicFile(file);

    if (!file) {
      setMusicPath(null);
      return;
    }

    setMusicPath(window.URL.createObjectURL(file));
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleArtistChange = (event) => {
    setArtist(event.target.value);
  };
  
  const handleFeatureChange = (event) => {
    setFeature(event.target.value);
  };

  const handlePublisherChange = (event) => {
    setPublisher(event.target.value);
  };
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };
  const handleEncodingChange = (event) => {
    setEncoding(event.target.value);
  };
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };
  const handleCopyrightChange = (event) => {
    setCopyright(event.target.value);
  };

  const handleMusicPlay = (event) => {
    if (!musicRef.current) {
      return;
    }

    if (playing) {
      musicRef.current.pause();
    } else {
      musicRef.current.play();
    }
    setPlaying((prev) => !prev);
  };

  return (
    <Modal className="text-dark" centered show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Upload Work</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4 text-center" controlId="cover.Input">
            <Form.Label>
              <Image
                rounded
                fluid
                alt="cover picture"
                src={coverImage}
                style={{ maxWidth: "120px" }}
              />
            </Form.Label>
            <Form.Control accept=".jpg,.jpeg,.png" type="file" disabled={loading} onChange={handleImageChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Music</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Music file"
                aria-label="select music file"
                type="file"
                name="music"
                accept=".mp3,.wav,.ogg"
                required={true}
                disabled={loading}
                onChange={handleMusicChange}
              />
              {musicPath && (
                <Button
                  active={playing}
                  onClick={handleMusicPlay}
                  aria-label="play music file"
                  variant="outline-secondary"
                  id="button-addon1"
                >
                  {playing ? (
                    <i className="bi bi-pause-circle-fill"></i>
                  ) : (
                    <i className="bi bi-play-circle-fill"></i>
                  )}
                  <audio
                    hidden
                    ref={musicRef}
                    src={musicPath}
                    autoPlay={playing}
                  />
                </Button>
              )}
            </InputGroup>
          </Form.Group>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon11">
              <i className="bi bi-file-music"></i>
            </InputGroup.Text>
            <FormControl
              required={true}
              disabled={loading}
              placeholder="Title *"
              aria-label="music title"
              aria-describedby="basic-addon11"
              onChange={handleTitleChange}
              value={title}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon21">
            <i className="bi bi-mic-fill"></i>
            </InputGroup.Text>
            <FormControl
              required={true}
              placeholder="Artist *"
              disabled={loading}
              aria-label="music artist"
              aria-describedby="basic-addon21"
              onChange={handleArtistChange}
              value={artist}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon22">
            <i className="bi bi-people-fill"></i>
            </InputGroup.Text>
            <FormControl
              placeholder="Featuring"
              disabled={loading}
              aria-label="featuring"
              aria-describedby="basic-addon22"
              onChange={handleFeatureChange}
              value={feature}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon2">
              <i className="bi bi-vinyl-fill"></i>
            </InputGroup.Text>
            <FormControl
              placeholder="Publisher"
              disabled={loading}
              aria-label="music publisher"
              aria-describedby="basic-addon2"
              onChange={handlePublisherChange}
              value={publisher}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon3">&copy;</InputGroup.Text>
            <FormControl
              placeholder="Copyright"
              disabled={loading}
              aria-label="music copyright"
              aria-describedby="basic-addon3"
              onChange={handleCopyrightChange}
              value={copyright}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon4">
              <i className="bi bi-translate"></i>
            </InputGroup.Text>
            <FormControl
              placeholder="Language"
              disabled={loading}
              aria-label="language"
              aria-describedby="basic-addon4"
              onChange={handleLanguageChange}
              value={language}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon5" itemType="date">
              <i className="bi bi-calendar-event"></i>
            </InputGroup.Text>
            <FormControl
              placeholder="Date"
              disabled={loading}
              aria-label="select date"
              aria-describedby="basic-addon5"
              type="date"
              onChange={handleDateChange}
              value={date}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text ht id="basic-addon6" disabled={true}>
              <i className="bi bi-filetype-mp3"></i>
            </InputGroup.Text>
            <FormControl
              placeholder="Encoded by"
              disabled={loading}
              aria-label="music encoding"
              aria-disabled="true"
              aria-describedby="basic-addon6"
              onChange={handleEncodingChange}
              value={encoding}
            />
          </InputGroup>
          <Form.Group className="mb-3" controlId="bio.textarea">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              disabled={loading}
              rows={3}
              value={description}
              onChange={handleDescriptionChange}
            />
          </Form.Group>
          <Form.Group>
            <Row className="justify-content-between">
              <Col className="auto flex-grow-1">
                <Button onClick={resetForm.bind(this)} disabled={loading} type="reset" variant="warning">
                  Reset
                </Button>
              </Col>
              <Col>
                <Button disabled={loading} type="submit" variant="info">
                  Mint Music 
                  {loading && (
                    <div className="spinner-border text-light spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export function MintMusic() {
  const { creator } = useCreatorSBT();
  const [showModal, setShowModal] = useState(false);

  if (!creator) {
    return null;
  }

  return (
    <Row>
      <MintMusciModal show={showModal} setShowModal={setShowModal} artistName={creator?.name} />
      <Col xs={12} className="d-flex justify-content-end pt-2">
        <Button
          variant="light"
          className="bi bi-plus-circle-fill"
          roundedCircle
          onClick={setShowModal.bind(this, true)}
        />
      </Col>
    </Row>
  );
}
