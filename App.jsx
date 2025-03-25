
import { useState, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MapPin, Wind, CloudRain, History, AlarmClock, LayoutDashboard, Bell } from "lucide-react";

export default function WeatherDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [weatherData, setWeatherData] = useState([]);
  const [selectedZip, setSelectedZip] = useState("");
  const [map, setMap] = useState(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: "YOUR_GOOGLE_MAPS_API_KEY",
      version: "weekly",
    });
    loader.load().then(() => {
      const mapInstance = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 39.8283, lng: -98.5795 },
        zoom: 5,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#1e1e1e" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#1e1e1e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#f9fafb" }] }
        ],
        disableDefaultUI: true,
      });
      setMap(mapInstance);
    });
  }, []);

  const fetchWeather = () => {
    fetch(`https://weather-backend-dusky.vercel.app/api/weather-alerts?zip=${selectedZip}`)
      .then((res) => res.json())
      .then((data) => {
        setWeatherData(data);
        if (map && data.length) {
          const { latitude, longitude } = data[0];
          map.setCenter({ lat: latitude, lng: longitude });
          map.setZoom(9);
        }
      });
  };

  return (
    <div className="flex h-screen text-white bg-[#0f172a]">
      <aside className="w-64 bg-[#1e293b] flex flex-col p-4 space-y-4">
        <h1 className="text-2xl font-bold">StormTrack AI</h1>
        <button onClick={() => setActiveTab("dashboard")} className="flex items-center gap-2">
          <LayoutDashboard /> Dashboard
        </button>
        <button onClick={() => setActiveTab("recent")} className="flex items-center gap-2">
          <Bell /> Recent Reports
        </button>
        <button onClick={() => setActiveTab("historical")} className="flex items-center gap-2">
          <History /> Historical Reports
        </button>
        <button onClick={() => setActiveTab("alerts")} className="flex items-center gap-2">
          <AlarmClock /> Alerts
        </button>
      </aside>

      <main className="flex-1 flex flex-col">
        <div className="p-4 bg-[#1e293b] flex justify-between items-center">
          <input
            className="p-2 bg-[#334155] rounded text-white"
            placeholder="Search by ZIP or City..."
            value={selectedZip}
            onChange={(e) => setSelectedZip(e.target.value)}
          />
          <button onClick={fetchWeather} className="ml-2 px-4 py-2 bg-blue-600 rounded">Search</button>
        </div>

        <div id="map" className="flex-1" style={{ height: "60vh" }}></div>

        <div className="p-4 overflow-y-auto h-[40vh] bg-[#1e293b]">
          {activeTab === "dashboard" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Storm Events</h2>
              {weatherData.map((event, index) => (
                <div key={index} className="p-4 mb-2 bg-[#334155] rounded">
                  <div className="flex items-center gap-2">
                    <MapPin /> <span className="font-bold">{event.zipCode}</span>
                  </div>
                  <div className="mt-1">Severity: {event.severity}</div>
                  <div className="flex items-center gap-2 mt-1">
                    {event.type === "Wind" ? <Wind /> : <CloudRain />} {event.description}
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === "recent" && <p>Recent storm reports will display here...</p>}
          {activeTab === "historical" && <p>Filter and view historical reports...</p>}
          {activeTab === "alerts" && <p>Manage your alert preferences here...</p>}
        </div>
      </main>
    </div>
  );
}
