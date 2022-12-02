import * as geolib from 'geolib';
export class Point {
	x: number;
	y: number;
	distance?(x: number, y: number) {
		return geolib.getDistance({ lat: y, lng: x }, { lat: this.y, lng: this.x });
	}
}
