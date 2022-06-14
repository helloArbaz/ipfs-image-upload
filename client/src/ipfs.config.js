import IPFS from "ipfs-api"
const IPFS_CONNECTION = new IPFS({
    host:"ipfs.infura.io",
    port:5001,
    protocol:"https"
})

export default IPFS_CONNECTION;