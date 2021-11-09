import {useEffect, useState} from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  const checkIfWalletIsConnected = async () => {
    try {
      const {solana} = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found');

          /*
           * The solana object gives us a function that will allow us to connect
           * directly with the user's wallet! `onlyIfTrusted` allows users to
           * only need to connect the website to Phantom once and it will
           * automatically connect to Phantom on subsequent visits or page
           * refreshses (
           * https://docs.phantom.app/integrating/establishing-a-connection#eagerly-connecting)
           */
          const response = await solana.connect({onlyIfTrusted: true});
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString(),
          );

          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * Let's define this method so our code doesn't break.
   * We will write the logic for this next!
   */
  const connectWallet = async () => {};

  /*
   * We want to render this UI when the user hasn't connected
   * their wallet to our app yet.
   */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}>
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer">{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
