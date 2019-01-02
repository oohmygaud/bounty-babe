import Web3 from 'web3';

/* UPORT IS GARBAGE
export let uport = new Connect('bounty-buddy', {
    clientId: '2optZdh2yvYUozD4StmHjMdAAgHnUkM2UEn',
    network: 'rinkeby',
    signer: SimpleSigner('8d1a93393d3832698f546995053ed4234ba976730e5be05f744f6777f1ac88ff')
})
*/

if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
        window.ethereum.enable();
    } catch(e) { console.log('Error getting Metamask', e) }
}