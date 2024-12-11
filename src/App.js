import "./App.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

function App() {
  


  const _created = (e) => {
    const layer = e.layer; // The created layer (marker, rectangle, polygon, etc.)
    if (layer instanceof L.Marker) {
      const { lat, lng } = layer.getLatLng(); // Get latitude and longitude
      layer.bindPopup("Loading information...").openPopup(); // Initial popup content

      // Fetch data from GeoNames API using lat and lng
      fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=67ce3a9c73234561bc3bedeeaa41afc9`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.results && data.results.length > 0) {
            const place = data.results[0];
            const placeInfo = `
              <b>Formatted Address:</b> ${place.formatted}<br />
              <b>Country:</b> ${place.components.country}<br />
              <b>State:</b> ${place.components.state || "N/A"}<br />
            `;
            layer.setPopupContent(placeInfo).openPopup();
          } else {
            layer
              .setPopupContent("No information available for this location.")
              .openPopup();
          }
        })
        .catch((error) => {
          layer
            .setPopupContent("Failed to fetch location info. Please try again.")
            .openPopup();
          console.error("API Error:", error);
        });
    }
  };
  

  return (
    
      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={13}
        
      >
        <FeatureGroup>
          <EditControl position="topright" onCreated={_created} />
        </FeatureGroup>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    
  );
}

export default App;
