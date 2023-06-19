const messages: { [key: number]: string } = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  422: "Unprocessable Content",
};

class HttpError extends Error {
  status: number;

  constructor(status: number, message: string = messages[status]) {
    super(message);
    this.status = status;
  }
}

export default HttpError;
