import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const LocationInfo = () => {
    const mapContainer = useRef(null); // Reference to the map container DOM
    const { id } = useParams(); // Get the id from the URL params
    const [locationName, setLocationName] = useState(null);

    useEffect(() => {
        // Fetch the play info from the backend
        const fetchPlayInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/performances/${id}`);
                console.log('API Response:', response.data);
                setLocationName(response.data.performance.showAddress); // Assume address is part of the response //수정 
            } catch (error) {
                console.error('Error fetching play info:', error);
            }
        };

        fetchPlayInfo();
    }, [id]);

    console.log(locationName);

    useEffect(() => {
        if (!locationName) return;

        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=b68d291724dc4993214afcac7393be51&libraries=services&autoload=false`;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            console.log('Kakao Maps script loaded successfully');

            window.kakao.maps.load(() => {
                console.log('Kakao Maps API Loaded');
                // 지도 생성
                const map = new window.kakao.maps.Map(mapContainer.current, {
                    center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // Initial center (Seoul)
                    level: 3,
                });

                console.log('Map Initialized:', map);

                // Ensure services library is loaded
                if (window.kakao.maps.services) {
                    // 장소 이름을 좌표로 변환합니다
                    const geocoder = new window.kakao.maps.services.Geocoder();
                    console.log('Geocoder Initialized:', geocoder);

                    geocoder.addressSearch(locationName, (result, status) => {
                        if (status === window.kakao.maps.services.Status.OK) {
                            console.log('Address Search Result:', result);
                            if (result.length > 0) {
                                const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                                console.log('Coordinates:', coords);

                                const marker = new window.kakao.maps.Marker({
                                    map: map,
                                    position: coords,
                                });
                                console.log('Marker:', marker);
                                map.setCenter(coords);
                            } else {
                                console.error('No results found for the address:', locationName);
                            }
                        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                            console.error('No results found for the address:', locationName);
                        } else {
                            console.error('Address search failed:', status);
                        }
                    });
                } else {
                    console.error('Kakao Maps services library failed to load.');
                }
            });
        };

        script.onerror = () => {
            console.error('Failed to load Kakao Maps script');
        };

        return () => {
            // Cleanup script
            document.head.removeChild(script);
        };
    }, [locationName]);

    if (!locationName) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div
                ref={mapContainer}
                style={{ width: '100%', height: '750px' }}
            />
        </div>
    );
};

export default LocationInfo;