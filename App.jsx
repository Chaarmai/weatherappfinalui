
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Wind, CloudRain, MapPin } from "lucide-react";

export default function WeatherTrackingApp() {
  const [weatherData, setWeatherData] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [zipInput, setZipInput] = useState("37027");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subscribe, setSubscribe] = useState(false);

  const fetchWeather = (zips) => {
    fetch(`https://weather-backend-dusky.vercel.app/api/weather-alerts?zip=${zips}`)
      .then((response) => response.json())
      .then((data) => setWeatherData(data));
  };

  const handleSubscription = () => {
    if (!email && !phone) return alert("Please enter email or phone number");
    const data = { email, phone, zipCodes: zipInput.split(",") };

    fetch("https://weather-backend-dusky.vercel.app/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => alert(res.message))
      .catch(() => alert("Something went wrong. Please try again later."));
  };

  useEffect(() => {
    fetchWeather(zipInput);
  }, []);

  return (
    <div className="flex flex-col items-center p-4 font-sans">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">Severe Weather Tracker</h1>

      <div className="flex flex-col gap-4 mb-6 w-full max-w-xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={zipInput}
            onChange={(e) => setZipInput(e.target.value)}
            placeholder="Enter ZIP codes, e.g., 37027,90210"
            className="flex-grow p-2 rounded-lg border border-gray-300"
          />
          <button onClick={() => fetchWeather(zipInput)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Search
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Get Real-Time Weather Alerts</h2>
          <input
            type="email"
            placeholder="Your email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="tel"
            placeholder="Your phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={subscribe}
              onChange={() => setSubscribe(!subscribe)}
            />
            <label>Send me alerts for these ZIP codes</label>
          </div>
          <button onClick={handleSubscription} className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Subscribe
          </button>
        </div>
      </div>

      <MapContainer center={[39.007, -86.791]} zoom={6} className="h-96 w-full rounded-lg shadow-lg">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {weatherData.map((alert, index) => (
          <Marker
            key={index}
            position={[alert.latitude, alert.longitude]}
            eventHandlers={{ click: () => setSelectedArea(alert) }}
          >
            <Popup>{alert.zipCode}: {alert.severity} Alert</Popup>
          </Marker>
        ))}
      </MapContainer>

      {selectedArea && (
        <div className="mt-4 p-4 w-full max-w-lg bg-gray-900 text-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold flex items-center">
            <MapPin className="mr-2" /> {selectedArea.zipCode}
          </h2>
          <p className="text-lg mt-2">Severity: {selectedArea.severity}</p>
          <p className="mt-2 flex items-center">
            {selectedArea.type === "Wind" ? <Wind className="mr-2" /> : <CloudRain className="mr-2" />} 
            {selectedArea.description}
          </p>
          <button className="mt-4 bg-red-500 hover:bg-red-600 w-full text-white py-2 rounded">
            Get Alerts
          </button>
        </div>
      )}
    </div>
  );
}
