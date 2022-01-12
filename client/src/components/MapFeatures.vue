<template>
	<div
		class="w-full md:w-auto absolute md:top-[40px] md:left-[60px] z-[2] flex gap-4 px-6 py-8 md:px-0 md:py-0 bg-transparent"
	>
		<div class="relative flex-1 md:min-w-[350px]">
			<input
				type="text"
				class="pl-9 pr-4 py-3 text-sm focus:outline-none w-full shadow-md rounded-md"
				placeholder="Start your search"
				v-model="searchQuery"
				@input="search"
			/>
			<div class="absolute top-0 left-[8px] h-full flex items-center">
				<i class="fas fa-search"></i>
			</div>
			<div class="absolute mt-2 w-full">
				<div
					class="h-[200px] overflow-scroll bg-white rounded-md"
					v-if="searchQuery"
				>
					<LoadingSpinner v-if="!searchData" />
					<div v-else>
						<div
							class="px-4 py-2 flex gap cursor-pointer hover:bg-slate-600 hover:text-white"
							v-for="(result, index) in searchData"
							:key="index"
							@click="selectResult(result)"
						>
							<i class="fas fa-map-marker-all"></i>
							<p class="text-xs">{{ result.place_name_en }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div
			class="px-4 bg-white flex items-center shadow-md rounded-md min-h-[45px]"
			:class="{ 'bg-slate-600': coords }"
			@click="emits('getGeolocation')"
		>
			<i
				class="fas fa-location-arrow text-state-600 text-[18px]"
				:class="{ 'text-white': coords, 'animate-pulse': fetchCoords }"
			></i>
		</div>
	</div>
</template>

<script setup>
import { ref, toRefs, defineEmits } from 'vue';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner.vue';

const searchQuery = ref(null);
const searchData = ref(null);
const queryTimeout = ref(null);

const search = () => {
	clearTimeout(queryTimeout.value);
	searchData.value = null;
	queryTimeout.value = setTimeout(async () => {
		if (searchQuery.value !== '') {
			const params = new URLSearchParams({
				fuzzyMatch: true,
				language: 'en',
				limit: 10,
				proximity: coords.value
					? `${coords.value.lat},${coords.value.lon}`
					: `0,0`,
			});
			const getData = await axios.get(
				`http://localhost:9000/api/search/${searchQuery.value}?${params}`
			);
			searchData.value = getData.data.data.features;
			console.log(searchData.value);
		}
	}, 750);
};

const selectResult = (result) => {
	emits('plotResult', result.geometry);
};

const props = defineProps({
	coords: {
		type: Object,
	},
	fetchCoords: {
		type: Boolean,
	},
});

const { coords, fetchCoords } = toRefs(props);

const emits = defineEmits(['getGeolocation', 'plotResult']);
</script>
