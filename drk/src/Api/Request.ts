async function request<T>(url: string, data: object): Promise<T> {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		const responseText = await response.text();
		var exception = JSON.parse(responseText);
		exception.status = response.status;
		throw exception;
	} else {
		const result = (await response.json()) as T;
		return result;
	}
}

async function authenticatedRequest<T>(url: string, data: object, token: string): Promise<T> {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		const responseText = await response.text();
		var exception = JSON.parse(responseText);
		exception.status = response.status;
		throw exception;
	} else {
		const result = (await response.json()) as T;
		return result;
	}
}

export { request, authenticatedRequest };
