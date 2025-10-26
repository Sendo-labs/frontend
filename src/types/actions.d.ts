interface ActionSuccessResponse<T> {
	success: true;
	data: T;
}

interface ActionErrorResponse {
	success: false;
	error: string;
}

type ActionResponse<T> = ActionSuccessResponse<T> | ActionErrorResponse;
