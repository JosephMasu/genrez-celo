import { useState } from "react";
import {
    Button,
    Col,
    Container,
    FormControl,
    InputGroup,
    Row,
} from "react-bootstrap";
import { CreatorsListing } from "../Components/Home/CreatorsListing";
import { SongListings } from "../Components/Home/SongListing";
import { useCreatorSBT } from "../hooks/CreatorSBT";
import { useMusicNFT } from "../hooks/MusicNFT";

function SearchBar({ handleSearch, searchLoading = true }) {
    const [searchWord, setSearchWord] = useState("");

    return (
        <Row>
            <Col xs={12} md={8} lg={6}>
                <InputGroup className="mb-3">
                    <FormControl
                        aria-label="Example text with button addon"
                        aria-describedby="basic-addon1"
                        placeholder="Artists, albums, or songs"
                        value={searchWord}
                        onChange={(event) => setSearchWord(event.target.value)}
                    />
                    <Button
                        variant="outline-secondary"
                        id="button-addon1"
                        disabled={searchLoading}
                        onClick={(event) => {
                            handleSearch(searchWord);
                        }}
                    >
                        {searchLoading ? (
                            <div
                                className="spinner-border text-light spinner-border-sm"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>
                        ) : (
                            <i className="bi bi-search"></i>
                        )}
                    </Button>
                </InputGroup>
            </Col>
        </Row>
    );
}

export default function Home() {
    const {searchCreators, creatorsQueryResults, queryLoading: creatorsqueryloading} = useCreatorSBT();
    const {searchMusic, musicQueryResults, queryLoading: musicqueryloading} = useMusicNFT();
    
    const handleSearch = (searchKey) => {
        try {
            searchCreators(searchKey);
            searchMusic(searchKey);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Container className="py-5">
            <SearchBar handleSearch={handleSearch} searchLoading={creatorsqueryloading || musicqueryloading}/>
            <SongListings queryList={musicQueryResults} />
            <CreatorsListing key="creatorlist" queryList={creatorsQueryResults}/>
        </Container>
    );
}
