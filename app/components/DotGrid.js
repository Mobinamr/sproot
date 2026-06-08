// DotGrid Component
// Dit component maakt een grid van punten als achtergrond
// We gebruiken SVG omdat dit scherp blijft op alle schermresoluties

export default function DotGrid() {
  return (
    <div className="dot-grid-container">
      <svg
        className="dot-grid"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/*
          Definieer een patroon dat herhaald wordt over het hele canvas
          patternUnits="userSpaceOnUse" betekent dat de waarden in pixels zijn
          width en height bepalen de afstand tussen de punten (40px)
        */}
        <defs>
          <pattern
            id="dot-pattern"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            {/*
              Teken een cirkel (punt) op positie 2,2
              r="2" is de straal van de punt (2px)
              fill bepaalt de kleur van de punten
            */}
            <circle
              cx="2"
              cy="2"
              r="2"
              fill="#d0d0d0"
            />
          </pattern>
        </defs>

        {/*
          Maak een rechthoek die het hele canvas vult
          en vul deze met het punt-patroon
        */}
        <rect
          width="100%"
          height="100%"
          fill="url(#dot-pattern)"
        />
      </svg>
    </div>
  )
}