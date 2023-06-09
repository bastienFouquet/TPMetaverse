import React, { useEffect, useState } from "react";
import getContract from "./getContract";
import Store from "./Store";
import {
  Container,
  CssBaseline,
  Card,
  CardActions,
  Button,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  ThemeProvider,
  createTheme
} from "@mui/material";

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [collection, setCollection] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const getCollection = async () => {
    try {
      const contract = await getContract();
      const response = await contract.methods.contractURI().call();
      setCollection(JSON.parse(response));
    } catch (err) {
      console.log(err);
    }
  };

  const HomeCollection = () => {
    return (
      <Container>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: "100vh" }}
        >
          <Grid item>
            <Card sx={{ maxWidth: 1000 }}>
              <CardActionArea onClick={() => connectWalletHandler()}>
                <CardMedia
                  component="img"
                  height="300"
                  image={collection ? collection.image : ""}
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {collection ? collection.name : ""}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {collection ? collection.description : ""}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => connectWalletHandler()}
                >
                  CONNECT WALLET
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  };

  useEffect(() => {
    checkWalletIsConnected();
    getCollection();
  }, []);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <React.Fragment>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container className="box">
          {currentAccount ? <Store account={currentAccount}></Store> : HomeCollection()}
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
