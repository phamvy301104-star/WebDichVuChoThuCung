export const generateResponse = (success: boolean, message: string, data?: any) => {
  return {
    success,
    message,
    ...(data && { data }),
  };
};

export const generateError = (message: string, statusCode: number = 400) => {
  const error: any = new Error(message);
  error.statusCode = statusCode;
  return error;
};
