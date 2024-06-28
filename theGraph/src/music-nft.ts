import {
  MusicNFTApproval as MusicNFTApprovalEvent,
  MusicNFTApprovalForAll as MusicNFTApprovalForAllEvent,
  MusicBurnt as MusicBurntEvent,
  MusicMinted as MusicMintedEvent,
  MusicNFTTransfer as MusicNFTTransferEvent
} from "../generated/MusicNFT/MusicNFT"
import {
  MusicNFT,
} from "../generated/schema"



export function handleMusicBurnt(event: MusicBurntEvent): void {
  let entity = MusicNFT.load(
    event.params._tokenId.toString()
  )

  if(!entity){
    return;
  }
  entity.unset(event.params._tokenId.toString());
}

export function handleMusicMinted(event: MusicMintedEvent): void {
  let entity = new MusicNFT(
    event.params._tokenId.toString()
  )
  entity.tokenId = event.params._tokenId
  entity.owner = event.params._owner
  entity.uri = event.params.uri
  entity.title = event.params.title
  entity.artist = event.params.artist
  entity.feature = event.params.feature
  entity.save()
}