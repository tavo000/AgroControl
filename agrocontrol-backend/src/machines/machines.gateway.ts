import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MachinesGateway {
  @WebSocketServer()
  server!: Server;

  emitMachinesUpdate(payload: unknown) {
    this.server.emit('machines:update', payload);
  }

  emitMachineAlert(payload: unknown) {
    this.server.emit('machines:alert', payload);
  }
}