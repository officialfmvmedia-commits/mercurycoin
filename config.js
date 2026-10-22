// $MERCURY launch config. Fill these in at launch; every blank renders an honest AWAITING / SOON state.
window.MERCURY = {
  CA: '',            // mint address (base58). Empty = "AWAITING CA"
  BUY_URL: '',       // defaults to https://pump.fun/coin/<CA> once CA is set
  X_URL: '',         // e.g. https://x.com/<handle>
  COMMIT: '',        // sha256(entropy), 64 hex. Published BEFORE launch
  COMMIT_URL: '',    // link to the post that published the commitment (the receipt)
  REVEAL: ''         // the 32-byte entropy, 64 hex. Only AFTER the mint exists and authorities are revoked
};
