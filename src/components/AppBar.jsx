import AppBarStyled from "./AppBar.styled";

export default function AppBar({ soundEnabled, onEnableSound, onEnableNotif }) {
  return (
    <AppBarStyled>
      <h1>🍼 Sovetid</h1>
      <div className="actions">
        <button
          onClick={onEnableSound}
          disabled={soundEnabled}
          title={soundEnabled ? "Lyd er aktivert" : "Aktiver lyd for alarm"}
        >
          {soundEnabled ? "Lyd aktivert ✅" : "Aktiver lyd"}
        </button>
        <button
          onClick={onEnableNotif}
          title="Tillat systemvarsler når barn skal vekkes"
        >
          Tillat varsler
        </button>
      </div>
    </AppBarStyled>
  );
}
