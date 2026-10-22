// $MERCURY launch config. Fill these in at launch; every blank renders an honest AWAITING / SOON state.
window.MERCURY = {
  CA: '9AWq1k2Ld1SLEprWiKyTppXgVknpTED3CUZtjBsW11ot',            // mint address (base58). Empty = "AWAITING CA"
  BUY_URL: '',       // defaults to https://pump.fun/coin/<CA> once CA is set
  X_URL: '',         // e.g. https://x.com/<handle>
  COMMIT: '3ec11f85ffba5e6dc0e9c23d1636c1476223e58ad0226f79d15b02aca0f0810e',        // sha256(entropy), 64 hex. Published BEFORE launch
  COMMIT_URL: '',    // link to the post that published the commitment (the receipt)
  REVEAL: ''         // the 32-byte entropy, 64 hex. Only AFTER the mint exists and authorities are revoked
};
