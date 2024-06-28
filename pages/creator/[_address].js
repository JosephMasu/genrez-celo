import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Banner } from "../../Components/Creator/Banner";
import { MusicList } from "../../Components/Creator/MusicList";
import { useCreatorSBT } from "../../hooks/CreatorSBT";
import { useMusicNFT } from "../../hooks/MusicNFT";

export default function CreatorPage() {
    const { getProfile } = useCreatorSBT();
    const { getOwnersMusicNFTs } = useMusicNFT();
    const router = useRouter();
    const { _address } = router.query;
    const [profile, setProfile] = useState(null);
    const [musicCollection, setMusicCollection] = useState([]);
    useEffect(() => {
        (async () => {
            if (!_address) {
                return setProfile(null);
            }
            const [profileMetadata, musicCollection] = await Promise.all([
                getProfile(_address),
                getOwnersMusicNFTs(_address),
            ]);

            if (profileMetadata) {
                setProfile(profileMetadata);
            }

            if (musicCollection) {
                setMusicCollection(musicCollection);
            }
        })();
    }, [_address, getProfile, getOwnersMusicNFTs]);

    return (
        <Container className="py-5">
            <Banner creator={profile} />
            <MusicList musciCollection={musicCollection} />
        </Container>
    );
}
