import React, { useState, useEffect, useRef } from "react"; // 이거 하나만 남기기
import { MapContainer, TileLayer, Circle, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Home.css";
import profile from "./assets/profile.svg";
import Search from "./assets/Search.svg";
import Cash from "./assets/Cash.svg";
import Card from "./assets/Card.svg";
import openMarkerSvg from "./assets/Open.svg";
import closingSoonSvg from "./assets/SoonClosing.svg";
import closedMarkerSvg from "./assets/Closed.svg";
import { supabase } from "./supabase";


const MAIN_COLOR = "#fb86a3";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MARKER_ICONS = {
  OPEN: new L.Icon({
    iconUrl: openMarkerSvg,
    iconSize: [68, 51],
    iconAnchor: [34, 51],
  }),
  CLOSING_SOON: new L.Icon({
    iconUrl: closingSoonSvg,
    iconSize: [68, 51],
    iconAnchor: [34, 51],
  }),
  CLOSED: new L.Icon({
    iconUrl: closedMarkerSvg,
    iconSize: [68, 51],
    iconAnchor: [34, 51],
  }),
};

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    if (center) {
      map.flyTo(center, zoom || 15);
    }
  }, [center, map, zoom]);
  return null;
}

const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hourNum = i + 1;
  const hour = hourNum < 10 ? `0${hourNum}` : `${hourNum}`;
  return `${hour}:00`;
});

function Home() {
  const defaultCenter = [35.170915, 136.881537];
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [userLocation, setUserLocation] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(14);
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState([]);

  // 카테고리 선택 상태
  const [isTimeSelected, setIsTimeSelected] = useState(false);
  const [isCardSelected, setIsCardSelected] = useState(false);
  const [isCashSelected, setIsCashSelected] = useState(false);

  // 프로필 팝업 상태 추가
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // ⏰ 시간 필터 상태 관리
  const [selectedTime, setSelectedTime] = useState({
    start: "19:00",
    end: "24:00",
  });
  const [tempStart, setTempStart] = useState("19:00");
  const [tempEnd, setTempEnd] = useState("24:00");
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);

  // 바텀시트 드래그 관련
  const [sheetHeight, setSheetHeight] = useState(280); // 시트 초기 높이(px)
  const dragInfo = useRef({ dragging: false, startY: 0, startHeight: 280 });

  const MIN_HEIGHT = 120; // 최소로 접었을 때 높이
  const MAX_HEIGHT = window.innerHeight * 0.85; // 최대로 폈을 때 높이

  const handleDragStart = (e) => {
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragInfo.current = {
      dragging: true,
      startY: clientY,
      startHeight: sheetHeight,
    };
    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchmove", handleDragMove);
    window.addEventListener("touchend", handleDragEnd);
  };

  const handleDragMove = (e) => {
    if (!dragInfo.current.dragging) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const delta = dragInfo.current.startY - clientY; // 위로 드래그하면 양수
    let newHeight = dragInfo.current.startHeight + delta;
    newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight));
    setSheetHeight(newHeight);
  };

  const handleDragEnd = () => {
    dragInfo.current.dragging = false;
    window.removeEventListener("mousemove", handleDragMove);
    window.removeEventListener("mouseup", handleDragEnd);
    window.removeEventListener("touchmove", handleDragMove);
    window.removeEventListener("touchend", handleDragEnd);
  };

  const fetchUserLocation = () => {
    if (!navigator.geolocation) return;

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPos = [latitude, longitude];
        setUserLocation(newPos);
        setMapCenter(newPos);
        setZoomLevel(15);
        setLoading(false);
      },
      (error) => {
        console.warn("위치 정보 수집 실패:", error);
        setLoading(false);
      },
      { enableHighAccuracy: true },
    );
  };

  async function fetchRestaurant() {
  const { data, error } = await supabase.from("restaurant").select("*");

  if (error) {
    console.log("오류 : ", error);
  } else {
    setRestaurant(data);
  }

  console.log(data);
}


  
  useEffect(() => {
    fetchUserLocation();
  }, []);
  useEffect(() => {
  fetchRestaurant();
}, []);
  

  const handleApplyTime = () => {
    setSelectedTime({ start: tempStart, end: tempEnd });
    setIsTimeModalOpen(false);
  };

  const handleLogout = () => {
    alert("로그아웃 되었습니다.");
    setIsProfileMenuOpen(false);
  };

  return (
    <div className="home-container">
      {/* 🗺️ 전체 화면 지도 영역 */}
      <main className="map-container-wrapper">
        <MapContainer
          center={mapCenter}
          zoom={zoomLevel}
          className="leaflet-map-container"
          attributionControl={false}
          zoomControl={false}
        >
          <MapController center={mapCenter} zoom={zoomLevel} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {userLocation && (
            <Circle
              center={userLocation}
              pathOptions={{
                fillColor: MAIN_COLOR,
                color: MAIN_COLOR,
                fillOpacity: 0.25,
                weight: 1.5,
              }}
              radius={200}
            />
          )}
          <Marker position={defaultCenter} />
        </MapContainer>

        {/* 🔍 지도 위에 오버레이되는 반투명 헤더 */}
        <div className="floating-header">
          <div className="search-bar">
            <span className="search-icon">
              <img src={Search} alt="search" />
            </span>
            <input type="text" placeholder="나고야시 나카구 사카에" />

            {/* 👤 프로필 아이콘 영역 */}
            <div className="profile-container">
              <span
                className="profile-icon"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <img src={profile} alt="profile" />
              </span>

              {/* 👤 프로필 팝업 메뉴 */}
              {isProfileMenuOpen && (
                <>
                  {/* 외부 클릭 시 팝업 닫기를 위한 투명 오버레이 */}
                  <div
                    className="popup-backdrop"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div className="profile-popup">
                    <div className="popup-user-info">
                      <h4 className="user-name">조미료</h4>
                      <p className="user-email">s1234@e-mirim.hs.kr</p>
                    </div>
                    <div className="popup-divider" />
                    <button className="logout-btn" onClick={handleLogout}>
                      <span className="logout-icon">↪</span>
                      <span>로그아웃</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 🔍 반투명 카테고리 필터 스크롤 */}
          <div className="filter-scroll">
            <div
              className={`filter-chip ${isTimeSelected ? "active" : ""}`}
              onClick={() => setIsTimeSelected(!isTimeSelected)}
            >
              <span className="chip-text">{`${selectedTime.start} - ${selectedTime.end}`}</span>
              <span
                className="arrow-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setTempStart(selectedTime.start);
                  setTempEnd(selectedTime.end);
                  setIsTimeModalOpen(true);
                }}
              >
                ▼
              </span>
            </div>

            <div
              className={`filter-chip ${isCardSelected ? "active" : ""}`}
              onClick={() => setIsCardSelected(!isCardSelected)}
            >
              <span className="chip-icon">
                <img src={Card} alt="card" />
              </span>
              <span className="chip-text">카드 결제</span>
            </div>

            <div
              className={`filter-chip ${isCashSelected ? "active" : ""}`}
              onClick={() => setIsCashSelected(!isCashSelected)}
            >
              <span className="chip-icon">
                <img src={Cash} alt="cash" />
              </span>
              <span className="chip-text">현금 결제</span>
            </div>
          </div>
        </div>

        {/* 내 위치 버튼 */}
        <button className="location-btn" onClick={fetchUserLocation}>
          {loading ? "..." : "📍"}
        </button>
      </main>

      {/* 📥 하단 바텀 시트 */}
      <footer
        className="shop-bottom-sheet"
        style={{ height: `${sheetHeight}px` }}
      >
        <div
          className="sheet-handle"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        ></div>
        <h2 className="sheet-title">주변 영업 중인 가게</h2>
        <div className="shop-list">
          {restaurant.map((item) => (
            <div className="shop-item">
              <div className="shop-img-placeholder"><img src = {item.img_url} alt="" className="rst_img"/></div>
              <div className="shop-info">
                <h3 className="shop-name">{item.jpn_name}</h3>
                <p className="shop-kana">{item.eng_name}</p>
                <div className="shop-rating">
                  ⭐ <span className="rating-score">{item.avg_star}({item.review_cnt})</span>
                </div>
                <div className="shop-status">
                  <span className="status-badge open">영업 중</span>
                  <span className="status-time">~ {item.close_time.slice(0,5)}</span>
                  <span className="status-divider">|</span>
                  <div className="pay-icons">
                    <span className="pay-icon">
                      <img src={item.cash === true ? Cash : ""}  className="cash"/>
                      <img src={item.card === true ? Card : ""} className="card"/>
                    </span>
                  </div>
                </div>
              </div>
              <span className="item-arrow">〉</span>
            </div>
          ))}
        </div>
      </footer>

      {/* ⏰ 시간 선택 모달 오버레이 */}
      {isTimeModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsTimeModalOpen(false)}
        >
          <div
            className="time-picker-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>영업 시간 선택</h3>
              <button
                className="close-btn"
                onClick={() => setIsTimeModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="time-select-container">
              <div className="select-group">
                <label>시작 시간</label>
                <select
                  value={tempStart}
                  onChange={(e) => setTempStart(e.target.value)}
                >
                  {TIME_OPTIONS.map((time) => (
                    <option key={`start-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <span className="time-separator">~</span>
              <div className="select-group">
                <label>종료 시간</label>
                <select
                  value={tempEnd}
                  onChange={(e) => setTempEnd(e.target.value)}
                >
                  {TIME_OPTIONS.map((time) => (
                    <option key={`end-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button className="apply-btn" onClick={handleApplyTime}>
              적용하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
