// Dynamically import all assets in the '../assets/' directory
const importAll = (r) => {
    let assets = {};
    r.keys().forEach((item, index) => {
        const assetName = item.replace('./', '').replace(/\.[^/.]+$/, ""); // Removes './' and file extension
        assets[assetName] = r(item);
    });
    return assets;
};

// Import all assets using Webpack's require.context
const Assets = importAll(require.context('C:/Users/GRIMM-JAW/Desktop/HACKERTHON/agri-chain/src/assets', false, /\.(png|jpe?g|svg)$/));

export default Assets;
