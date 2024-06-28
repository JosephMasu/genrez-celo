import { BigInt } from "@graphprotocol/graph-ts"
import {
  ProfileBurnt,
  ProfileMinted,
  ProfileUpdated,
} from "../generated/CreatorSBT/CreatorSBT"
import { CreatorSBT } from "../generated/schema"

export function handleProfileBurnt(event: ProfileBurnt): void {
  const entity = CreatorSBT.load(event.params._tokenId.toString());

  if(!entity){
    return;
  }

  entity.unset(event.params._tokenId.toString());
}

export function handleProfileMinted(event: ProfileMinted): void {
  const entity = new CreatorSBT(event.params._tokenId.toString());

  entity.tokenId = event.params._tokenId;
  entity.name = event.params.artist;
  entity.owner = event.params._owner;
  entity.uri = event.params.uri;
  entity.save();
}

export function handleProfileUpdated(event: ProfileUpdated): void {
  const entity = CreatorSBT.load(event.params._tokenId.toString());

  if(!entity){
    return;
  }

  entity.uri = event.params.uri;
  entity.name = event.params.artist;

  entity.save();
}
