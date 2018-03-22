#bash

cd client/
npm run build
cd ../server
cp -rf ../client/dist .
npm start