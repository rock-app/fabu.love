#bash

cd client/
npm run build
cd ../server
rm -rf ./dist
cp -rf ../client/dist .