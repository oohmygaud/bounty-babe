import { Connect, SimpleSigner } from 'uport-connect'

// export let uport = new Connect('TruffleBox')

export let uport = new Connect('bounty-buddy', {
    clientId: '2optZdh2yvYUozD4StmHjMdAAgHnUkM2UEn',
    network: 'rinkeby',
    signer: SimpleSigner('8d1a93393d3832698f546995053ed4234ba976730e5be05f744f6777f1ac88ff')
})

export const web3 = uport.getWeb3()
