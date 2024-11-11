import { useEffect, useState } from 'react';
import { KakaoMapAddressStyled } from './styled';
import dotenv from 'dotenv';
import { Form, Input } from 'antd';
dotenv.config();
const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

declare global {
  interface Window {
    // kakao: any;
    daum: any;
  }
}
interface IAddr {
  address: string;
  zonecode: string;
}

interface KakaoMapAddressProps {
  onSelectAddress: (address: string) => void; // 주소 선택 시 호출할 콜백 함수
}

const KakaoMapAddress = ({ onSelectAddress }: KakaoMapAddressProps) => {
  const [map, setMap] = useState<any>();
  const [marker, setMarker] = useState<any>();
  const [addValue, setAddValue] = useState<any>();
  // 1. 카카오맵 초기화 함수
  const initializeMap = () => {
    const container: any = document.getElementById('map');
    if (!container || !window.kakao || !window.kakao.maps) {
      console.error('Kakao map container or API not available');
      return;
    }

    const options: any = {
      center: new window.kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };

    // 2. 맵과 마커 객체 초기화
    const mapInstance = new window.kakao.maps.Map(container, options);
    setMap(mapInstance);
    setMarker(new window.kakao.maps.Marker({ position: options.center }));
  };

  // 3. useEffect에서 스크립트 로드 확인 및 맵 초기화
  useEffect(() => {
    const kakaoScript = document.createElement('script');
    kakaoScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&libraries=services&autoload=false`;
    kakaoScript.async = true;

    kakaoScript.onload = () => {
      // SDK 로드 후 kakao maps API 로드
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          initializeMap();
        });
      } else {
        console.error('Kakao script load failed');
      }
    };
    document.head.appendChild(kakaoScript);

    // Daum 주소 검색 스크립트 로드
    const daumScript = document.createElement('script');
    daumScript.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    daumScript.async = true;
    document.head.appendChild(daumScript);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      document.head.removeChild(kakaoScript);
      document.head.removeChild(daumScript);
    };
  }, []);

  // 4. 주소 검색 및 좌표 표시 함수
  const onClickAddr = () => {
    new window.daum.Postcode({
      oncomplete: function (addrData: IAddr) {
        if (!window.kakao || !window.kakao.maps || !map || !marker) {
          console.error('Kakao map or API not available');
          return;
        }

        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(addrData.address, (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const currentPos = new window.kakao.maps.LatLng(result[0].y, result[0].x);
            (document.getElementById('addr') as HTMLInputElement).value = addrData.address;

            setAddValue(addrData.address);

            map.panTo(currentPos);

            marker.setMap(null);
            marker.setPosition(currentPos);
            marker.setMap(map);

            onSelectAddress(addValue);
          } else {
            console.error('Geocoding failed:', status);
          }
        });
      },
    }).open();
  };

  return (
    <KakaoMapAddressStyled>
      <div>
        <div onClick={onClickAddr}>
          <Input id="addr" value={addValue} required readOnly />
        </div>
        <div id="map" style={{ width: '100%', height: '400px' }}></div>
      </div>
    </KakaoMapAddressStyled>
  );
};

export default KakaoMapAddress;
