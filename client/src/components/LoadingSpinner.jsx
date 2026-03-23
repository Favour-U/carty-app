// simple teal spinner for when we're waiting on API calls
import '../styles/LoadingSpinner.css';

export default function LoadingSpinner() {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" />
    </div>
  );
}
