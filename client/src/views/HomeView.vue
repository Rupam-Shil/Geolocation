<template>
	<div class="h-screen relative">
		<div id="map" class="h-full z-[1]"></div>
	</div>
</template>

<script setup>
import leaflet from 'leaflet';
import { ref, onMounted } from 'vue';

let map;

onMounted(() => {
	map = leaflet.map('map').setView([13.0148318, 77.5775478], 13);
	leaflet
		.tileLayer(
			`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${
				import.meta.env.VITE_API_KEY
			}`,
			{
				attribution:
					'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				maxZoom: 18,
				id: 'mapbox/streets-v11',
				tileSize: 512,
				zoomOffset: -1,
				accessToken: `${import.meta.env.VITE_API_KEY}`,
			}
		)
		.addTo(map);

	getGeolocation();
});

const coords = ref(null);
const fetchCoords = ref(null);
const geoMarker = ref(null);

const getGeolocation = () => {
	const getFromSessionStorage = sessionStorage.getItem('coords');
	if (getFromSessionStorage) {
		coords.value = JSON.parse(getFromSessionStorage);
		plotGeolocation(coords.value);
	} else {
		fetchCoords.value = true;
		navigator.geolocation.getCurrentPosition(setCoords, getLocError);
	}
};
const setCoords = (pos) => {
	fetchCoords.value = null;

	const { latitude, longitude } = pos.coords;
	const setSessionCoords = {
		lat: latitude,
		lon: longitude,
	};
	sessionStorage.setItem('coords', JSON.stringify(setSessionCoords));

	coords.value = setSessionCoords;

	plotGeolocation(coords.value);
};
const getLocError = (err) => {
	console.log(err);
};

const plotGeolocation = ({ lat, lon }) => {
	const customMarker = leaflet.icon({
		iconUrl: '/map-marker-red.svg',
		iconSize: [35, 35],
	});
	geoMarker.value = leaflet
		.marker([lat, lon], { icon: customMarker })
		.addTo(map);

	map.setView([lat, lon], 10);
};
</script>
