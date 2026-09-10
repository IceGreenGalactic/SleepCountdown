import { FAQWrapper } from "./FAQSection.styled";

export default function FAQSection() {
  return (
    <FAQWrapper>
      <details>
        <summary>Ofte stilte spørsmål</summary>
        <ul>
          <li>
            <strong>Lagring:</strong> Data lagres i <code>localStorage</code> og
            ligger der til nettleserdata slettes.
          </li>
          <li>
            <strong>Lyd:</strong> Mobil-nettlesere krever et trykk først. Bruk
            "Aktiver lyd"-knappen øverst.
          </li>
          <li>
            <strong>Varsler:</strong> Trykk "Tillat varsler" for systemvarsel
            når det er tid for oppvåkning.
          </li>
          <li>
            <button
              type="button"
              className="ghost"
              onClick={() => location.reload()}
              title="Sjekk etter ny versjon og laste siden på nytt"
            >
              🔄 Sjekk oppdatering
            </button>
          </li>
        </ul>
      </details>
    </FAQWrapper>
  );
}
