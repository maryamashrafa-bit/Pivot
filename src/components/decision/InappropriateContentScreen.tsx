export function InappropriateContentScreen({ onTryAgain }: { onTryAgain: () => void }) {
  return (
    <div className="ack-card">
      <p className="ack-p">
        This doesn&apos;t look like something Pivot can help with. Pivot works best for genuine
        life decisions — give it another try with something that matters to you.
      </p>

      <button className="btn-primary" style={{ width: '100%' }} onClick={onTryAgain} type="button">
        Try again
      </button>
    </div>
  );
}
