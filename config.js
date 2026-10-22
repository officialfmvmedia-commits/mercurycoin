// $MERCURY launch config. Fill these in at launch; every blank renders an honest AWAITING / SOON state.
window.MERCURY = {
  CA: '25dWcJxAVvT5WNEj8LmB9BbNPk6j3ykM7NY6h7ADUZus',            // mint address (base58). Empty = "AWAITING CA"
  BUY_URL: '',       // defaults to https://pump.fun/coin/<CA> once CA is set
  X_URL: '',         // e.g. https://x.com/<handle>
  COMMIT: '55737de3c28e270da4c6b92c70df1dcc4fec1d1d30f12d841f4f64f94a2f4385',        // sha256(entropy), 64 hex. Published BEFORE launch
  COMMIT_URL: '',    // link to the post that published the commitment (the receipt)
  REVEAL: ''         // the 32-byte entropy, 64 hex. Only AFTER the mint exists and authorities are revoked
};
