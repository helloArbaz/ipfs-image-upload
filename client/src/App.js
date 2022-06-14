import React, { Component } from 'react'
import {
  Container,
  Box,
  Typography,
  Button,
  Input,
  Grid,
  Paper,
  ImageList,
  ImageListItem,
} from '@mui/material'

import './App.css'
import IPFS_CONNECTION from './ipfs.config'
import getWeb3 from './getWeb3'
import IpfsUpload from './contracts/IpfsUpload.json'

class App extends Component {
  // state = { storageValue: 0, web3: null, accounts: null, contract: null }

  constructor(props) {
    super(props)
    this.state = {
      fileObject: null,
      web3: null,
      accounts: null,
      instance: null,
      imageLists: null,
      ipfsConstPath: 'https://ipfs.io/ipfs/',
      loading: false,
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.captureFile = this.captureFile.bind(this)
    this.getFiles = this.getFiles.bind(this)
    this.delete = this.delete.bind(this)
  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3()
      const accounts = await web3.eth.getAccounts()
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = IpfsUpload.networks[networkId]

      const instance = new web3.eth.Contract(
        IpfsUpload.abi,
        deployedNetwork && deployedNetwork.address,
      )
      this.setState({ web3, accounts, instance }, this.getFiles)
    } catch (e) {}
  }

  async getFiles() {
    const { instance } = this.state
    const { methods } = instance
    const response = await methods.getFiles().call()
    this.setState({ imageLists: response, loading: false, fileObject: null })
    console.log(response, 'response')
  }

  captureFile(event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = () => {
      this.setState({ fileObject: Buffer(reader.result) })
    }
  }

  async onSubmit() {
    this.setState({ loading: true })
    const { instance, ipfsConstPath, accounts, loading } = this.state
    const result = await IPFS_CONNECTION.files.add(this.state.fileObject)
    const { methods } = instance
    let imagePath = ipfsConstPath + result[0]['hash']
    try {
      const response = await methods.addFile(imagePath).send({
        from: accounts[0],
      })
      this.getFiles()
    } catch (e) {
      this.setState({ loading: false })
    }
  }

  async delete(_index) {
    const { accounts, instance } = this.state
    this.setState({ loading: true })
    const { methods } = instance
    try {
      const response = await methods.deleteFile(_index).send({
        from: accounts[0],
      })
      this.getFiles()
    } catch (e) {
      this.setState({ loading: false })
    }
  }

  render() {
    const {
      fileObject,
      web3,
      accounts,
      instance,
      imageLists,
      loading,
    } = this.state
    console.log({
      web3,
      accounts,
      instance,
      loading,
    })

    return (
      <Container maxWidth="xl" disableGutters={2}>
        <Box>
          <Box textAlign={'center'} p={3} bgcolor="black">
            <Typography color={'primary'}>IPFS Image Upload</Typography>
          </Box>

          {loading && (
            <Box mt={5} textAlign={'center'}>
              <Typography
                style={{ fontWeight: 'bold' }}
                variant="h5"
                color={'red'}
              >
                {' '}
                Loading.....
              </Typography>{' '}
            </Box>
          )}

          {!loading && (
            <>
              <Box mt={5} p={2} display="flex" justifyContent={'center'}>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={8}>
                    <Paper>
                      <Box p={2.4}>
                        <Input
                          onChange={(e) => this.captureFile(e)}
                          fullWidth
                          type="file"
                        />
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Paper>
                      <Box p={2}>
                        <Button
                          disabled={!fileObject}
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={this.onSubmit}
                        >
                          Submit
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              <Box p={2}>
                {imageLists &&
                  imageLists.map((item, _index) => (
                    <img
                      onClick={() => {
                        this.delete(_index)
                      }}
                      src={item._path}
                      style={{ margin: 5 }}
                      height={150}
                      width={130}
                    />
                  ))}
              </Box>
            </>
          )}
        </Box>
      </Container>
    )
  }
}

export default App
