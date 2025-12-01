import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Middleware Consumer
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const time = Date.now() - start;
      console.log({
        request: {
          IP: req.ip,
          METHOD: req.method,
          ENDPOINT: req.url,
          TIME: `${time}ms`,
        },
      });
    });
    next();
  }
}
