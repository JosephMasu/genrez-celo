export async function tipCreator(contract, address, to, amount){
    await contract.methods.tipCreator(to).send({from: address, value: amount})
}

export async function withdrawTip(contract, address, to){
    await contract.methods.withdrawTip(to).send({from: address});
}

export async function balanceOf(contract, address){
    return await contract.methods.balanceOf(address).call();
}