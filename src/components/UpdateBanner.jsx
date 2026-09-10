import UpdateBannerStyled from './UpdateBanner.styled';

export default function UpdateBanner({ onUpdate, onDismiss }) {
  return (
    <UpdateBannerStyled>
      <div>
        <strong>Ny versjon tilgjengelig.</strong>
      </div>
      <div className="actions">
        <button onClick={onUpdate} className="primary">
          Oppdater nå
        </button>
        <button onClick={onDismiss} className="ghost">
          Senere
        </button>
      </div>
    </UpdateBannerStyled>
  );
}
