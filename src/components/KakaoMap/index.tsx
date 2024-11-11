import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useEffect, useState } from 'react';
interface KakaoMapProps {
  address: string;
}

interface AddressSearchResult {
  address_name: string;
  y: string; // 위도 (latitude) 좌표를 문자열로 반환
  x: string; // 경도 (longitude) 좌표를 문자열로 반환
  address_type: string;
  road_address?: {
    address_name: string;
    building_name: string;
    main_building_no: string;
    region_1depth_name: string;
    region_2depth_name: string;
    road_name: string;
    sub_building_no: string;
    underground_yn: string;
    zone_no: string;
  };
}

const KakaoMap = ({ address }:KakaoMapProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [coordinates, setCoordinates] = useState({
    latitude: 37.5665,
    longitude: 126.978,
  }); // 기본 좌표 (서울 시청)

  const convertAddressToCoordinates = () => {
    if (!window.kakao || !window.kakao.maps) {
      console.error('Kakao 지도 API가 로드되지 않았습니다.');
      return;
    }

    //주소를 좌표로 변환
    const geocoder = new window.kakao.maps.services.Geocoder();

    //해당 주소를 기반으로 (latitude, longitude)를 반환
    //좌표값은 setCoordinates로 상태를 업데이트하여 저장
    geocoder.addressSearch(
      address,
      (result: AddressSearchResult[], status: string) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const { y: latitude, x: longitude } = result[0];
          setCoordinates({
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          });
        } else {
          console.error('주소 변환 실패');
        }
      }
    );
  };

  //kakao 지도 api 스크립트를 동적으로 로드
  //스크립트가 로드된 후 isLoaded상태를 변경하여 kakao api사용
  useEffect(() => {
    const existingScript = document.getElementById('kakao-map-script');

    if (!existingScript) {
      const kakaoMapsScript = document.createElement('script');
      kakaoMapsScript.id = 'kakao-map-script';
      kakaoMapsScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services,clusterer&autoload=false`;
      kakaoMapsScript.async = true;
      kakaoMapsScript.defer = true;

      kakaoMapsScript.onload = () => {
        window.kakao.maps.load(() => {
          setIsLoaded(true);
          // convertAddressToCoordinates();
        });
      };

      document.head.appendChild(kakaoMapsScript);
    } else {
      if (window.kakao && window.kakao.maps) {
        setIsLoaded(true); // 이미 스크립트가 로드되었으면 바로 로딩 완료
      }
    }
    // return () => {
    //   if (existingScript) {
    //     document.head.removeChild(existingScript);
    //   }
    // };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      convertAddressToCoordinates();
    }
  }, [isLoaded, address]);

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <Map
      center={{
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      }}
      level={3}
      style={{ width: '60%', height: '100%', borderRadius: '8px' }}
    >
      <MapMarker
        position={{
          lat: coordinates.latitude,
          lng: coordinates.longitude,
        }}
      ></MapMarker>
    </Map>
  );
};
export default KakaoMap;
