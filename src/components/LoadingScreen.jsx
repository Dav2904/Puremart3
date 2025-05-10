import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <img src="/PureMartNBG.png" alt="PureMart Logo" className="loading-logo" />
      <div className="loading-spinner"></div>
    </div>
  );
};

export default LoadingScreen;