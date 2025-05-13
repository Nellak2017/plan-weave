
# How to get the Raw Firebase JSON

1. Go to Firebase project for Plan Weave
2. Next to Project Overview in top left, Gear Icon > Project Settings > Service accounts
3. Ensure Node.js is selected and Generate new private key
4. Rename private key to `appConfig.json`
5. In same directory as generated private key:
```bash
npx -p node-firestore-import-export firestore-export -a appConfig.json -b backup.json
```
6. This produces the exported Firebase JSON named as `backup.json`

