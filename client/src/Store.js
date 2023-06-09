import React, { useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, useProgress } from "@react-three/drei";
import {
  Container,
  Card,
  CardActions,
  Button,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Modal,
  Box,
} from "@mui/material";
import House from "./House";
import getContract from "./getContract";
import getContractMetamask from "./getContractMetamask";
const axios = require("axios").default;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

function Store({ account }) {
  const [houses, setHouses] = useState([]);
  const [currentHouseOwner, setCurrentHouseOwner] = useState(null);
  const [currentHouse, setCurrentHouse] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isAlreadyOwned, setIsAlreadyOwned] = useState(false);
  const [cost, setCost] = useState(0);

  const [open, setOpen] = useState(false);
  const handleOpen = (house) => {
    setCurrentHouse(house);
    setOpen(true);
  };
  const handleClose = () => {
    setCurrentHouse(null);
    setOpen(false);
  };

  const { progress } = useProgress();

  const getAllHouses = async () => {
    try {
      const contract = await getContract();
      const response = await contract.methods.getHouses().call();
      const els = await Promise.all(
        response.map(async (el) => {
          return {
            number: el["number"],
            color: el["color"],
            tokenURI: `https://ipfs.io/ipfs/QmcypXjBsPak3xG524fdXwygMNqSwBqCjQTmrTU2BoX4L8/${el["number"]}.json`,
            metadata: await getMetadataHouseByNumber(el["number"]),
          };
        })
      );
      setHouses(els);
    } catch (err) {
      console.log(err);
    }
  };

  const getMetadataHouseByNumber = async (number) => {
    try {
      return (
        await axios.get(
          `https://ipfs.io/ipfs/QmcypXjBsPak3xG524fdXwygMNqSwBqCjQTmrTU2BoX4L8/${number}.json`
        )
      ).data;
    } catch (err) {
      console.log(err);
    }
  };

  const getHouseOwner = async () => {
    try {
      if (currentHouse && currentHouse.number) {
        const contract = await getContract();
        const owner = (
          await contract.methods.getOwnerOfTokenId(currentHouse.number).call()
        ).toLowerCase();
        setCurrentHouseOwner(owner);
        setIsOwner(account === owner);
        setIsAlreadyOwned(
          owner !== "0x0000000000000000000000000000000000000000"
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const mintNftHandler = async () => {
    try {
      if (currentHouse && currentHouse.number && cost) {
        const contract = await getContractMetamask();

        let nftTxn = await contract.methods
          .mint(currentHouse.number)
          .send({
            from: account,
            value: cost,
          })
          .on("receipt", function (result) {
            console.log(result);
            alert(
              `Receipt NFT ! Import (address: ${result.to}, id: ${currentHouse.number})`
            );
          });
        console.log("Mining...please wait");
        console.log("Mined: ", nftTxn.transactionHash);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getCost = async () => {
    try {
      const contract = await getContract();
      const response = await contract.methods.COST().call();
      setCost(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllHouses();
    getCost();
  }, []);

  useEffect(() => {
    getHouseOwner();
  }, [currentHouse]);

  const housesCards = houses.map((el) => (
    <Grid item xs={2} sm={4} md={4} key={el.number}>
      <Card sx={{ maxWidth: 1000 }}>
        <CardActionArea
          onClick={() => {
            handleOpen(el);
          }}
        >
          <CardMedia
            component="img"
            height="200"
            image={el.metadata.image}
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              #{el.number}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Color : {el.color}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={() => {
              handleOpen(el);
            }}
          >
            DETAILS
          </Button>
        </CardActions>
      </Card>
    </Grid>
  ));
  return (
    <Container>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {housesCards}
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <Canvas>
                <Suspense fallback={<Html center>{progress} % loaded</Html>}>
                  <ambientLight />
                  <House color={currentHouse ? currentHouse.color : "white"} />
                </Suspense>
              </Canvas>
            </Grid>
            <Grid item xs={9}>
              <Card>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    House #{currentHouse ? currentHouse.number : ""}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Color : {currentHouse ? currentHouse.color : ""}
                  </Typography>
                </CardContent>
                <CardActions>
                  {isAlreadyOwned ? (
                    currentHouseOwner + (isOwner ? " (YOU)" : "")
                  ) : (
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => {
                        mintNftHandler();
                      }}
                    >
                      BUY
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Container>
  );
}

export default Store;
