<br />
<div align="center">
  <img src="https://static.sismo.io/readme/top-main.png" alt="Logo" width="150" height="150" style="borderRadius: 20px">

  <h3 align="center">
    Commitment Signer
  </h3>

  <p align="center">
    Made by <a href="https://www.docs.sismo.io/" target="_blank">Sismo</a>
  </p>
  
  <p align="center">
    <a href="https://discord.gg/sismo" target="_blank">
        <img src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white"/>
    </a>
    <a href="https://twitter.com/sismo_eth" target="_blank">
        <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white"/>
    </a>
  </p>
  <a href="https://www.sismo.io/" target="_blank"></a>
</div>

# Commitment Signer

The Commitment Signer mechanism is part of the Sismo Pythia proving scheme. It allows an offchain service (issuer) to send data on chain without making a link between its internal offchain data (issuer identifier) and the ethereum account where the data is effectively sent on chain.

Example: An offchain service could verify phone numbers. We don't want to associate the phone number to an ethereum account. We could then create a ZK Badge "phone verified" where no one could know the phone number used for this ZK Badge, even the issuer.

The Commitment Signer has two steps:

- 1. the user makes an offchain `commitment` by calling the `/commit` route. The service sends back to the user an `issuerIdentifier` that allows the user to interact directly with the issuer.
- 2. the user retrieves an EdDSA signature of the `commitment`, by calling the `/retrieve-commitment-receipt` route. This signature is only made if the `issuer` validates the flow made with the `issuerIdentifier`

The signature of the commitment can be used inside a zk-SNARK circuit to verify that the user is the creator of the commitment (commitment = hash(secret), where the secret is only known by the user) and verify that the commitment will pass through the Commitment Signer (verifying the signature against the issuer public key).

## Commitment Signer Implementation

In order to add your own issuer logic to the commitment signer, you need to implement the abstract class `CommitmentSigner` in the `src/commitment-signer/commitment-signer.ts` and instantiate the object in the factory `src/commitment-signer/factory.ts`.

You can find a very basic implementation example that always validates commitments:

```typescript
export class CommitmentSignerExample extends CommitmentSigner {
  protected async _createIssuerIdentifier(): Promise<IssuerIdentifier> {
    return Promise.resolve("123-456-789");
  }

  protected async _isIssuerIdentifierValidated(
    issuerIdentifier: IssuerIdentifier
  ): Promise<boolean> {
    return Promise.resolve(true);
  }
}
```

The `_createIssuerIdentifier` will be called in the first step of the flow.  
The `_isIssuerIdentifierValidate` will be called in the second step of the flow.

## API Endpoint

### Commit

Endpoint: `https://sibgc1bwn8.execute-api.eu-west-1.amazonaws.com/commit`

Method: `POST`

Parameters:

- `commitment` : The commitment chosen by the user

Response:

- `issuerIdentifier` : The identifier sent by the Issuer.

Example:

```bash
$ curl -X POST -H 'content-type: application/json' https://dae6y9y3mc.execute-api.eu-west-1.amazonaws.com/commit -d @- <<EOF
{
    "commitment": "0x1234678900987654321"
}
EOF

{
  "issuerIdentifier": "094389ad-41a7189c-293411bb-aa936e60"
}
```

### Retrieve Signed Commitment

Endpoint: `https://dae6y9y3mc.execute-api.eu-west-1.amazonaws.com/retrieve-commitment-receipt`

Method: `POST`

Parameters:

- `commitment` : The commitment chosen by the user

Response:

- `commitmentMapperPubKey` : The EdDSA public key of the commitment signer. This public key will never change.
- `commitmentReceipt` : The Signature(Hash(Commitment,value))

Example:

```bash
$ curl -X POST -H 'content-type: application/json' https://dae6y9y3mc.execute-api.eu-west-1.amazonaws.com/retrieve-commitment-receipt -d @- <<EOF
{
    "commitment": "0x1234678900987654321"
}
EOF

{
  "commitmentSignerPubKey": [
    "0x0eeeffe58d278552cc06d9ffada205dbfef1da11288345fed10c916fdd8c6f13",
    "0x2d18d49c9e8045d34b6e8ae4262b1dbf73bc47a7fbe4b6748eafa6b5b28d0fa3"
  ],
  "commitmentReceipt": [
    "0x0253fb8b55f777d7b3865c1dfda9ff16b379063b8799d8a201508158863a5b3d",
    "0x0f44414019473279db9471da96ba5b2546f280f1679034113008d98c85638aee",
    "0x05d0b7d6d2e4439cf5362b41af58bf9ea71b1f9051b2388a2e25bef6a2f353bf"
  ]
}
EOF
```

### Get Public Key

Endpoint: `https://dae6y9y3mc.execute-api.eu-west-1.amazonaws.com/get-public-key`

Method: `GET`

Response:

- `commitmentSignerPubKey` : The EdDSA public key of the commitment signer. This public key will never change.

Example:

```bash
$ curl https://dae6y9y3mc.execute-api.eu-west-1.amazonaws.com/get-public-key

{
  "commitmentSignerPubKey": [
    "0x0eeeffe58d278552cc06d9ffada205dbfef1da11288345fed10c916fdd8c6f13",
    "0x2d18d49c9e8045d34b6e8ae4262b1dbf73bc47a7fbe4b6748eafa6b5b28d0fa3"
  ]
}

```

## Development

### Setup

Install the dependencies

```bash
yarn install
```

### Tests

Launch the test suite

```bash
yarn test
```

### Run in local

```bash
yarn serve:local
```

## Deployment

### Env variables

Env variables should be put in a .env.${stage} file or .env file.

### Deployment on AWS using serverless framework

Deploy on staging

```bash
sls deploy --stage staging
```

For the first deployment, we need to generate the secret by calling the `generateSecret` function.

```bash
sls invoke --stage staging  --function generateSecret --log
```

## License

Distributed under the MIT License.

## Contribute

Please, feel free to open issues, PRs or simply provide feedback!

## Contact

Prefer [Discord](https://discord.gg/sismo) or [Twitter](https://twitter.com/sismo_eth)

<br/>
<img src="https://static.sismo.io/readme/bottom-main.png" alt="bottom" width="100%" >
```
