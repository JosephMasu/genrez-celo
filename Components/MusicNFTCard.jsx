import { useMemo } from "react";
import { Button, Card, Modal, Stack } from "react-bootstrap";
import { useCreatorTip } from "../hooks/CreatorTip";
import { usePlayer } from "../hooks/Player";
import { capitalize, makeMusic } from "../utils";

/**
 * Generates MusicNFT Card from nft metadata
 * @param {Object} musicMetadata MusicNFT metadata
 * @returns
 */
export function MusicNFTCard({ musicMetadata }) {
    const music = useMemo(() => makeMusic(musicMetadata), [musicMetadata]);
    const { setShowModal, setTipAddress } = useCreatorTip();

    const { togglePlay, currentSong, paused, addToPlaylist } = usePlayer({ source: music });

    const isCurrentSong = useMemo(() => {
        return (
            currentSong?.uri !== music?.uri ||
            (currentSong?.uri === music?.uri && paused)
        );
    }, [currentSong, music.uri, paused]);

    if (!music) {
        return null;
    }

    const { name, description, image, artist, feature, uri, owner } = music;
    const title = capitalize(name);
    return (
        <Card className="bg-dark text-white">
            <Card.Img
                src={image || DEFAULT_MUSIC_COVER}
                alt="Card image"
                className="fluid"
            />
            <Card.ImgOverlay className="nft-card-overlay">
                <Button
                    title="add to playlist"
                    className="add-to-playlist"
                    size="sm"
                    block={false}
                    variant="outline-light"
                    active={!isCurrentSong}
                    onClick={addToPlaylist.bind(this, music)}
                >
                    <i className="bi bi-music-note-list"></i>
                </Button>
                <Stack gap={1}>
                    <span title={title}>
                        <b>
                            Title:{" "}
                            {name.length > 12
                                ? `${title.slice(0, 12)}...`
                                : title}
                        </b>
                    </span>
                    {description && (
                        <span title={description}>
                            {description.length > 17
                                ? description.slice(0, 17)
                                : description}
                        </span>
                    )}
                    <span title={artist}>Artist: {artist.slice(0, 8)}</span>
                    {feature && (
                        <span title={feature}>
                            Feature:{" "}
                            {feature.length > 9
                                ? `${feature.slice(0, 8)}...`
                                : feature}
                        </span>
                    )}
                    <Stack direction="horizontal" gap={5}>
                        <Button
                            size="sm"
                            block={false}
                            title={uri}
                            variant="outline-light"
                            active={!isCurrentSong}
                            onClick={togglePlay.bind(this)}
                        >
                            {isCurrentSong ? (
                                <i className="bi bi-play-circle-fill"></i>
                            ) : (
                                <i className="bi bi-pause-circle-fill"></i>
                            )}
                        </Button>
                        <Button
                            onClick={() => {
                                setTipAddress(owner);
                                setShowModal(true);
                            }}
                            variant="success"
                            block={false}
                            size="sm"
                            title={`Tip ${artist} & ${feature}`}
                        >
                            <i className="bi bi-cash-coin"></i>
                        </Button>
                    </Stack>
                </Stack>
            </Card.ImgOverlay>
        </Card>
    );
}
