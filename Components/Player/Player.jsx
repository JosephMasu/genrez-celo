import { useMemo } from "react";
import { Row, Col, Button, Stack, Image } from "react-bootstrap";
import { DEFAULT_MUSIC_COVER } from "../../constants";

import { usePlayer } from "../../hooks/Player";
export function MainPlayer() {
    const {
        currentSong,
        mute,
        toggleMute,
        togglePlay,
        playnext,
        playprev,
        convertTime,
        paused,
        changeVolume,
        songDuration,
        currentTime,
        volume,
        seekTime,
    } = usePlayer({ source: null });

    const artists = useMemo(() => {
        if (!currentSong?.feature) {
            return currentSong?.artist;
        }
        return `${currentSong?.artist} | ft: ${currentSong?.feature}  `;
    }, [currentSong]);

    const volumeText = useMemo(() => {
        return Math.round(volume * 100);
    }, [volume]);

    if (!currentSong) {
        return null;
    }
    return (
        <Row
            className="align-items-center justify-content-center p-2"
            style={{
                background: "#212121d6",
                position: "fixed",
                bottom: 0,
                left: 0,
                width: "100vw",
            }}
        >
            <Col xs={0} md={4}>
                <Stack direction="horizontal" gap={2}>
                    <Image
                        src={currentSong?.image || DEFAULT_MUSIC_COVER}
                        rounded
                        className="fluid"
                        alt="music cover"
                        width={56}
                    />
                    <Stack>
                        <span>{currentSong?.name}</span>
                        <span className="text-muted">{artists}</span>
                    </Stack>
                </Stack>
            </Col>

            <Col xs={12} md={5}>
                <div className="d-flex justify-content-center">
                    <Button
                        size="sm"
                        className="mx-1"
                        variant="light"
                        onClick={playprev.bind(this)}
                    >
                        <i className="bi bi-skip-backward-circle-fill"></i>
                    </Button>
                    <Button
                        size="sm"
                        className="mx-1"
                        variant="light"
                        onClick={togglePlay.bind(this)}
                    >
                        {paused ? (
                            <i className="bi bi-play-circle-fill"></i>
                        ) : (
                            <i className="bi bi-pause-circle-fill"></i>
                        )}
                    </Button>
                    <Button
                        size="sm"
                        className="mx-1"
                        variant="light"
                        onClick={playnext.bind(this)}
                    >
                        <i className="bi bi-skip-forward-circle-fill"></i>
                    </Button>
                </div>
                <Stack direction="horizontal" gap={2}>
                    <input
                        type="range"
                        style={{ height: 0 }}
                        onChange={(event) => seekTime(event.target.value)}
                        size="sm"
                        className="form-range"
                        value={currentTime}
                        max={songDuration}
                    />
                    <span>{convertTime(songDuration)}</span>
                </Stack>
            </Col>

            <Col xs={12} md={3}>
                <Stack direction="horizontal" gap={2}>
                    <Button size="sm" onClick={toggleMute.bind(this)}>
                        {mute ? (
                            <i className="bi bi-volume-mute-fill"></i>
                        ) : (
                            <i className="bi bi-volume-up-fill"></i>
                        )}
                    </Button>
                    <input
                        type="range"
                        className="form-range"
                        onChange={(event) => changeVolume(event.target.value)}
                        disabled={mute}
                        min={0}
                        max={100}
                        step={1}
                        size="sm"
                        style={{ height: 0, width: "150px" }}
                        value={volumeText}
                    ></input>
                    <span>{volumeText}</span>
                </Stack>
            </Col>
        </Row>
    );
}
