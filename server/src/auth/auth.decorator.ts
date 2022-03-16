import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestAccessToken = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.headers.authorization.split(' ')[1];
  },
);
