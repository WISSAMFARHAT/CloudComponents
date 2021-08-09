﻿class VideoInfo {
	Duration: number;
	Width: number;
	Height: number;
}

export function init(component: HTMLElement) {

	const video = component.querySelector('video');

	video.onloadeddata = function () {

		const evt = document.createEvent("HTMLEvents");
		evt.initEvent("load", false, true);

		video.dispatchEvent(evt);
	};
}

export function getVideoInfo(component: HTMLElement): VideoInfo {

	const video = component.querySelector('video');

	const videoInfo = new VideoInfo();

	videoInfo.Duration = video.duration;
	videoInfo.Width = video.videoWidth;
	videoInfo.Height = video.videoHeight;

	return videoInfo;
}

export function setVideoPlaybackSpeed(component: HTMLElement, value: number) {

	const video = component.querySelector('video');

	video.playbackRate = value;
}

export function muteVolume(component: HTMLElement, mute: boolean) {

	const video = component.querySelector('video');

	video.muted = mute;
}

export function changeVolume(component: HTMLElement, newVolume: number) {

	const video = component.querySelector('video');

	video.volume = newVolume;
}

export function changeCurrentTime(component: HTMLElement, newCurrentTime: number) {

	const video = component.querySelector('video');

	video.currentTime = newCurrentTime;
}

export function play(component: HTMLElement) {

	const video = component.querySelector('video');

	video.play();

}

export function pause(component: HTMLElement) {

	const video = component.querySelector('video');

	video.pause();
}

export function stop(component: HTMLElement) {

	pause(component);

	const video = component.querySelector('video');
	video.currentTime = 0;

}

export function enterFullScreen(component: HTMLElement) {

	component.requestFullscreen({
		navigationUI: "hide"
	});
}

export function seeking(component: HTMLElement, value: number, total?: number): number {

	// Seek Info Position

	const seekInfo: HTMLElement = component.querySelector('.amc-videoplayer-seekinfo');
	const container: HTMLElement = component.querySelector('.amc-videoplayer-seekinfo-container');

	const seekInfoWidth = seekInfo.clientWidth;
	const seekInfoInnetWidth = Number(window.getComputedStyle(seekInfo, null).width.replace('px', ''));
	const containerWidth = container.clientWidth;

	if (!total) {

		const video = component.querySelector('video');
		total = video.duration;

		const progressBar = component.querySelector('.amc-videoplayer-progress');

		value = value - component.getBoundingClientRect().left;
		value = total * value / progressBar.clientWidth;
	}

	let position = (value * seekInfoWidth / total) - (containerWidth / 2);

	if (position < 0)
		position = 0;
	else if (position + containerWidth > seekInfoInnetWidth)
		position = seekInfoInnetWidth - containerWidth;

	container.style.setProperty('margin-left', position + 'px');

	return value;

	// Seek Info Frame Preview


	//const tempVideo = document.createElement('video');
	//tempVideo.width = video.width;
	//tempVideo.height = video.height;
	//tempVideo.src = video.src;
	//tempVideo.load();


	//const canvas = container.querySelector("canvas");
	//canvas.width = video.videoWidth;
	//canvas.height = video.videoHeight;

	//const maxSize = 150;

	//if (canvas.width > maxSize) {
	//	canvas.height = maxSize * canvas.height / canvas.width;
	//	canvas.width = maxSize;
	//}

	//if (canvas.height > maxSize) {
	//	canvas.width = maxSize * canvas.width / canvas.height;
	//	canvas.height = maxSize;
	//}

	//try {
	//	const canvasContext = canvas.getContext("2d");
	//	document.appendChild(tempVideo);
	//	tempVideo.currentTime = value;
	//	tempVideo.play();
	//	canvasContext.drawImage(tempVideo, 0, 0);
	//	tempVideo.pause();
	//} catch { }

	//document.removeChild(tempVideo);
	//tempVideo.remove();
}

export function exitFullScreen(component: HTMLElement) {

	document.exitFullscreen();
}

export function registerCustomEventHandler(component, eventName: string, payload) {

	const videoElement = component.querySelector('video');

	if (!(videoElement && eventName))
		return false

	if (!videoElement.hasOwnProperty('customEvent')) {
		videoElement['customEvent'] = function (eventName, payload) {

			this['value'] = getJSON(this, eventName, payload)

			var event
			if (typeof (Event) === 'function')
				event = new Event('change')
			else {
				event = document.createEvent('Event')
				event.initEvent('change', true, true)
			}

			this.dispatchEvent(event)
		}
	}

	videoElement.addEventListener(eventName, function () { videoElement.customEvent(eventName, payload) });

	// Craft a bespoke json string to serve as a payload for the event
	function getJSON(videoElement, eventName, payload) {

		if (payload && payload.length > 0) {
			// this syntax copies just the properties we request from the source element
			// IE 11 compatible
			let data = {};
			for (const obj in payload) {
				const item = payload[obj];

				if (videoElement[item])
					data[item] = videoElement[item]
			}

			// this stringify overload eliminates undefined/null/empty values
			return JSON.stringify(
				{ name: eventName, state: data }
				, function (k, v) { return (v === undefined || v == null || v.length === 0) ? undefined : v }
			)
		} else {
			return JSON.stringify(
				{ name: eventName }
			)
		}
	}
}