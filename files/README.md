# MERCURY-MINT-v1

Sister scheme to MARS-MINT-v1. The $MERCURY mint keypair is seeded from **MESSENGER's final image of Mercury** plus 32 bytes of private entropy, committed before launch and revealed after.

## Source product (official NASA PDS archive, PDS Imaging Node)
| | |
|---|---|
| Product | `CN1072716050M_IF_5` (MDIS NAC calibrated I/F, CDR v1.0) |
| Source EDR | `EN1072716050M` (= MESSENGER image ID 8422953, "MESSENGER's Final Image", NASA PIA19448) |
| Data set | `MESS-E/V/H-MDIS-4-CDR-CALDATA-V1.0`, volume `MSGRMDS_2001` |
| URL | https://planetarydata.jpl.nasa.gov/img/data/messenger/MSGRMDS_2001/CDR/2015_120/CN1072716050M_IF_5.IMG |
| START_TIME | `2015-04-30T11:07:43.368128` (UTC, from the attached PDS3 label) |
| Size | 1,058,816 bytes (PDS3 attached label + 512×512 IEEE float32 image) |
| SHA-256 | `cec65107973de146a0dda7ee9fd30ccfec65554fcafc4f1230ccdb09c4ab7142` |
| MD5 | `7aac7b8b3aa04e3dd43a3572c9b67da6` |
| Geometry (label) | lat 69.94° N, lon 221.38° E, altitude 28.86 km, 1.52 m/px, incidence 75.57°, phase 90.08°, filter 748 nm |

Credit: NASA/Johns Hopkins University Applied Physics Laboratory/Carnegie Institution of Washington. Public domain.
Caveat: if the archive ever re-issues this product, the bytes change. Mirror the file (IPFS/Arweave/site) when publishing.

## Derivation
1. `mercury_hash = SHA-256(IMG bytes)`
2. `entropy = 32 random bytes` (made on the minting machine only), `commitment = SHA-256(entropy)`, published before launch
3. `seed = HKDF-SHA256(ikm = entropy || mercury_hash, salt = "MERCURY-MINT-v1", info = utf8("CN1072716050M_IF_5" || "2015-04-30T11:07:43.368128"), L = 32)`
4. `keypair = Ed25519 from 32-byte seed` (Solana `Keypair.fromSeed` / solana-keygen); `pubkey` (base58) = contract address
5. Reveal the entropy only after the mint exists and its mint/freeze authorities are revoked.

## Scripts (zero npm deps for derive.js)
```
curl -LO https://planetarydata.jpl.nasa.gov/img/data/messenger/MSGRMDS_2001/CDR/2015_120/CN1072716050M_IF_5.IMG
node derive.js --test                   # throwaway vector, see test-vector.json
node derive.js make-commit              # REAL, run on the Mac only. Writes ~/.mercury-mint/{mercury-secret.json, mercury-mint-keypair.json, public-commitment.json} chmod 600, refuses to overwrite
node derive.js verify --entropy <hex>   # anyone, after the reveal
python3 derive.py --test                # independent cross-check (PyNaCl + hand-rolled HKDF)
```

Test vector (entropy = 00 01 … 1f, **never mint with this**): commitment `630dcd29…10dd`, seed `b879fbe9…68ad`, pubkey `G34KduVxsrCf7DSMNPoTNjCb8CYCD8LL83gwU2oqvP2s`. Node and Python implementations agree.

## Why it can't be gamed
The image is fixed and public years before launch, so nobody can grind it. The entropy is locked by its commitment before launch, so it can't be swapped. Recovering the seed before the reveal needs a 2^256 search or a break of HMAC-SHA-256.
Tradeoff: nobody can verify the derivation until the reveal, and after the reveal anyone can rebuild the private key, so it must control nothing by then.
