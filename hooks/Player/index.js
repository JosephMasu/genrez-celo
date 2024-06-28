import { createContext, useContext, useEffect, useRef, useState } from "react";

export const PlayerContext = createContext();

export function PlayerProvider({ children }) {
    //tracks playlist
    const [musicList, setMusiclist] = useState([]);
    //track current playing music
    const [currentSong, setCurrentSong] = useState(null);
    //track if the audio player is mute
    const [mute, setMute] = useState(false);
    //tracks audio player current time
    const [currentTime, setCurrentTime] = useState(0);
    //tracks audio player current time
    const [songDuration, setSongDuration] = useState(0);
    //tracks audio player volume level
    const [volume, setVolume] = useState(1);
    //tracks if the audio player is paused/playing
    const [paused, setPaused] = useState(true);
    //hooks into html audio player
    const playerRef = useRef();

    var convertTime = function (time) {

        if (isNaN(time) || time == "" || typeof time != 'number') return "00:00";

        var hours   = parseInt( time / 3600 ) % 24,
            minutes = parseInt( time / 60 ) % 60,
            seconds = parseInt( time % 60);

        if (hours > 0) {
            var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds); 
        } else {
            var result = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);    
        }

        return result;

    };

    //plays music.if `src` is a different music uri start the music else keep playing the `currentS
    const play = (music) => {
        if (music && music?.uri != currentSong) {
            playerRef.current.setAttribute("src", music?.uri);
            setCurrentSong(music);
        }

        playerRef.current.play();
        setPaused(false);
    };

    //pause
    const pause = () => {
        playerRef.current.pause();
        setPaused(true);
    };

    //mute and unmute
    const toggleMute = () => {
        playerRef.current.muted = !mute;
        setMute((prev) => !prev);
    };

    //change player volume
    const changeVolume = (value) => {
        if (isNaN(value)) {
            return;
        }
        const volume = value / 100;
        playerRef.current.volume = volume;
        setVolume(volume);
    };

    //seek player time
    const seekTime = (value) => {
        playerRef.current.currentTime = value;
    };

    /**
     * add a a list of music to `musicList`
     * @param {Array} list array of music
     */
    const addToPlaylist = (list = []) => {
        if (!Array.isArray(list)) {
            list = [list];
        }

        setMusiclist(prev => [...prev,...list]);
    };

    // move to the next music in `musicList` 
    const playnext = () => {

        const indexOfCurrentSong = musicList.findIndex((music, idx) => {
            return music.uri === currentSong?.uri;
        });

        console.log(indexOfCurrentSong);

        if(indexOfCurrentSong < 0){
            play(musicList[0]);
            return;
        }

        if (
            indexOfCurrentSong >= 0 &&
            indexOfCurrentSong < musicList.length - 1
        ) {
            const song = musicList[indexOfCurrentSong + 1];
            
            if(song){
                play(song);
            }
            return;
        }
    };
    // move to the prev music in `musicList` 
    const playprev = () => {
        const indexOfCurrentSong = musicList.findIndex((music, idx) => {
           return music?.uri == currentSong?.uri
        });

        console.log(indexOfCurrentSong);

        if (
            indexOfCurrentSong > 0 &&
            indexOfCurrentSong <= musicList.length - 1
        ) {
            const song = musicList[indexOfCurrentSong - 1]
            if(song){
                play(song);
            }

            return;
        }
    };

    useEffect(() => {
        const player = playerRef.current;
        const eventHandler = (event) => {
            playnext();
        };

        const timeHandler = (event) => {
            setCurrentTime((prev) => player.currentTime);
        };

        const loadedHandler = (event) => {
            setSongDuration(player.duration);
        }

        player.addEventListener("ended", eventHandler);
        player.addEventListener("timeupdate", timeHandler, false);
        player.addEventListener("loadeddata", loadedHandler,false)
        return () => {
            player.removeEventListener("ended", eventHandler);
            player.removeEventListener("timeupdate",timeHandler);
            player.removeEventListener("loadeddata", loadedHandler);
        };
    }, []);

    return (
        <PlayerContext.Provider
            value={{
                play,
                playnext,
                playprev,
                pause,
                toggleMute,
                changeVolume,
                seekTime,
                addToPlaylist,
                convertTime,
                songDuration,
                currentTime,
                paused,
                mute,
                volume,
                currentSong,
            }}
        >
            <audio ref={playerRef} />
            {children}
        </PlayerContext.Provider>
    );
}
export function usePlayer({ source }) {
    const playerContext = useContext(PlayerContext);

    //throw an error if this hook is not used in a `PlayerContext`
    if (!playerContext) {
        throw Error("usePlayer must be used in a PlayerContext");
    }

    //see {@ PlayerProvider}
    const {
        addToPlaylist,
        currentSong,
        play,
        playnext,
        playprev,
        convertTime,
        pause,
        mute,
        paused,
        seekTime,
        currentTime,
        toggleMute,
        changeVolume,
        songDuration,
        volume,
    } = playerContext;


    //handle pause and play
    const togglePlay = () => {
        //play for the first time if the current playing song is different
        if (source && currentSong?.uri != source?.uri) {
            play(source);
            return;
        }
        //pause and play subsequently
        if (!paused) {
            pause();
        } else {
            play();
        }
    };

    return {
        togglePlay,
        playnext,
        playprev,
        convertTime,
        seekTime,
        changeVolume,
        toggleMute,
        currentTime,
        paused,
        songDuration,
        addToPlaylist,
        mute,
        volume,
        currentSong
    };
}
