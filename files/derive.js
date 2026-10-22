#!/usr/bin/env node
// MERCURY-MINT-v1 — derive the $MERCURY mint keypair from MESSENGER's final image + private entropy.
// Zero dependencies (Node >= 16: crypto.hkdfSync + native Ed25519). Run it next to the .IMG file.
//
//   node derive.js --test                     throwaway test vector (entropy = 00 01 .. 1f). NEVER use for a real mint.
//   node derive.js make-commit [--out DIR]    REAL: new 32-byte entropy -> prints commitment + pubkey only.
//                                             Secret files go to DIR (default ~/.mercury-mint), chmod 600, never overwritten.
//   node derive.js verify --entropy <hex>     after the reveal: anyone recomputes commitment + pubkey.
//   node derive.js hash                       just sha256 the image.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), crypto = require('crypto');

const FILE       = 'CN1072716050M_IF_5.IMG';
const URL        = 'https://planetarydata.jpl.nasa.gov/img/data/messenger/MSGRMDS_2001/CDR/2015_120/CN1072716050M_IF_5.IMG';
const PRODUCT_ID = 'CN1072716050M_IF_5';
const START_TIME = '2015-04-30T11:07:43.368128';
const SIZE       = 1058816;
const SHA256     = 'cec65107973de146a0dda7ee9fd30ccfec65554fcafc4f1230ccdb09c4ab7142';
const SALT       = 'MERCURY-MINT-v1';
const INFO       = PRODUCT_ID + START_TIME;

const sha = b => crypto.createHash('sha256').update(b).digest();
const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function b58(buf) {
  let n = BigInt('0x' + (buf.toString('hex') || '0')), s = '';
  while (n > 0n) { s = B58[Number(n % 58n)] + s; n /= 58n; }
  for (const x of buf) { if (x !== 0) break; s = '1' + s; }
  return s;
}
function mercuryHash() {
  const p = path.resolve(process.argv.includes('--file') ? process.argv[process.argv.indexOf('--file') + 1] : FILE);
  if (!fs.existsSync(p)) die(`missing ${p}\n  download it:  curl -LO ${URL}`);
  const b = fs.readFileSync(p);
  const h = sha(b);
  if (b.length !== SIZE || h.toString('hex') !== SHA256) die(`hash mismatch: got ${b.length} B ${h.toString('hex')}\n  expected ${SIZE} B ${SHA256}`);
  return h;
}
function derive(entropy, mh) {
  if (entropy.length !== 32) die('entropy must be exactly 32 bytes');
  const seed = Buffer.from(crypto.hkdfSync('sha256', Buffer.concat([entropy, mh]), SALT, INFO, 32));
  // Ed25519 from a raw 32-byte seed (same as Solana Keypair.fromSeed / solana-keygen)
  const der = Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), seed]);
  const priv = crypto.createPrivateKey({ key: der, format: 'der', type: 'pkcs8' });
  const pub = crypto.createPublicKey(priv).export({ format: 'der', type: 'spki' }).subarray(-32);
  return { seed, pub, pubkey: b58(pub) };
}
function die(m) { console.error('ERROR: ' + m); process.exit(1); }
const arg = k => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : undefined; };
const mode = process.argv[2];

if (mode === '--test' || mode === 'test') {
  const mh = mercuryHash(), ent = Buffer.from([...Array(32).keys()]), d = derive(ent, mh);
  console.log(JSON.stringify({ TEST_ONLY: 'throwaway vector, do not mint with this', mercury_hash: mh.toString('hex'),
    entropy: ent.toString('hex'), commitment: sha(ent).toString('hex'), salt: SALT, info: INFO,
    seed: d.seed.toString('hex'), pubkey: d.pubkey }, null, 1));
} else if (mode === 'make-commit') {
  const mh = mercuryHash(), dir = arg('--out') || path.join(os.homedir(), '.mercury-mint');
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  if (fs.existsSync(path.join(dir, 'mercury-secret.json'))) die(`${dir}/mercury-secret.json already exists. Refusing to overwrite a commitment.`);
  const ent = crypto.randomBytes(32), d = derive(ent, mh), commitment = sha(ent).toString('hex');
  const w = (f, s) => { const fd = fs.openSync(path.join(dir, f), 'wx', 0o600); fs.writeSync(fd, s); fs.closeSync(fd); };
  w('mercury-secret.json', JSON.stringify({ WARNING: 'SECRET until the mint exists and authorities are revoked',
    entropy: ent.toString('hex'), commitment, pubkey: d.pubkey, salt: SALT, info: INFO, mercury_hash: mh.toString('hex') }, null, 1));
  w('mercury-mint-keypair.json', JSON.stringify([...d.seed, ...d.pub])); // solana-keygen format
  w('public-commitment.json', JSON.stringify({ commitment, pubkey: d.pubkey, mercury_hash: mh.toString('hex'), salt: SALT, info: INFO,
    source: URL, created: new Date().toISOString() }, null, 1));
  console.log(JSON.stringify({ commitment, pubkey: d.pubkey, mercury_hash: mh.toString('hex'), secrets_in: dir,
    publish: 'ONLY the commitment (and optionally pubkey). Keep mercury-secret.json + keypair private.' }, null, 1));
} else if (mode === 'verify') {
  const hex = arg('--entropy'); if (!/^[0-9a-f]{64}$/i.test(hex || '')) die('usage: verify --entropy <64 hex chars>');
  const ent = Buffer.from(hex, 'hex'), mh = mercuryHash(), d = derive(ent, mh);
  console.log(JSON.stringify({ mercury_hash: mh.toString('hex'), commitment: sha(ent).toString('hex'), salt: SALT, info: INFO, pubkey: d.pubkey }, null, 1));
} else if (mode === 'hash') {
  console.log(mercuryHash().toString('hex'));
} else {
  console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 9).map(l => l.replace(/^\/\/ ?/, '')).join('\n'));
}
