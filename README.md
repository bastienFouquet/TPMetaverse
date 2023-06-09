# TP METAVERSE

### Description

Un univers metaverse basé sur une collection NFT.

L'appli permet de voir lister un collection NFT de maison une fois un wallet connecté. Ensuite l'utilsateur peut minter une maison qui est dispo. Une visualisation 3D de la maison est diponible dans le "DETAILS" (c'est un cube...)

### House

Caractéristiques :

- Numéro
- Couleur

### Contrat

/contracts/HousesCollection.sol

Déployé sur Mumbai (0xc0d912417e9606195885626Ddedac79672C1Fa3A)

### Build Contracts

```
# setup .env

PASS_PHRASE=
NODE_KEY=
```

```
$ truffle compile
```

### Front

Lancer le front

```
$ cd client
$ npm run start
```

Quand on mint une maison, les infos pour l'inportation du NFT sur le wallet apparraisent en alert() et dans la console

### Tester

Il est possible de test la fonction mint avec le script :

```
$ node /scripts/mint.js
```