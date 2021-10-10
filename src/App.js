import React from 'react';
import { useState } from "react";
import {
  ChakraProvider,
  Box,
  VStack,
  Grid,
  theme,
  Flex,
  Spacer,
  Button,
  Text
} from '@chakra-ui/react';
import detectEthereumProvider from '@metamask/detect-provider';

function App() {
  const [message, setMessage] = useState("");
  const [disableConnect, setDisableConnect] = useState(false);

  const configureMoonbaseAlpha = async () => {
    const provider = await detectEthereumProvider({
      mustBeMetaMask: true
    });
    const chainId = await provider.request({
      method: 'eth_chainId'
    });
    // Moonbase Alpha's chainId is 1287, which is 0x507 in hex
    if (chainId === '0x507') {
      // At this point, you might want to disable the "Connect" button
      // or inform the user that they are already connected to the
      // Moonbase Alpha testnet
      setMessage('Connected to Moonbase Alpha');
      setDisableConnect(true);
    }
    provider.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        // MetaMask is locked or the user doesn’t have any
        // connected accounts
        setMessage('Please connect to MetaMask.');
        setDisableConnect(false);
      }
    });
    provider.on('chainChanged', () => {
      // MetaMask recommends reloading the page unless you 
      // have good reason not to
      window.location.reload();
    });
    if (provider) {
      try {
        await provider.request({ method: 'eth_requestAccounts' })
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x507', // Moonbase Alpha’s chainId is 1287, which is 0x507 in hex 
            chainName: 'Moonbase Alpha',
            nativeCurrency: {
              name: 'DEV',
              symbol: 'DEV',
              decimals: 18
            },
            rpcUrls: ['https://rpc.testnet.moonbeam.network'],
            blockExplorerUrls: ['https://moonbase-blockscout.testnet.moonbeam.network/']
          }]
        })
      } catch (e) {
        console.error(e);
      }
    } else {
      console.error('Please install MetaMask');
    }
  }

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Flex justify="flex-end" p={2}>
          <Spacer />
          <Button disabled={disableConnect} onClick={configureMoonbaseAlpha()}>Connect to Moonbase Alpha</Button>
        </Flex>
        <Grid minH="100vh" p={3}>
          <VStack spacing={8}>
            <Text>{message}</Text>
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
