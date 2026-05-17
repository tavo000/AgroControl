import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';

import { Server } from 'socket.io';

import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class IotGateway
  implements OnGatewayInit
{
  @WebSocketServer()
  server!: Server;

  constructor(
    private prisma: PrismaService,
  ) {}

  afterInit() {
    console.log(
      'WebSocket IoT iniciado',
    );

    setInterval(async () => {
      const machines = [
  {
    id: 1,

    name: 'Tractor A12',

    lat:
      -32.955 +
      (Math.random() - 0.5) * 0.01,

    lng:
      -61.295 +
      (Math.random() - 0.5) * 0.01,

    fuel: 50 + Math.random() * 50,

    temperature:
      60 + Math.random() * 20,

    speed:
      5 + Math.random() * 20,

    active: true,
  },

  {
    id: 2,

    name: 'Cosechadora B7',

    lat:
      -32.965 +
      (Math.random() - 0.5) * 0.01,

    lng:
      -61.305 +
      (Math.random() - 0.5) * 0.01,

    fuel: 50 + Math.random() * 50,

    temperature:
      60 + Math.random() * 20,

    speed:
      5 + Math.random() * 20,

    active: true,
  },
];

      for (const machine of machines) {
  await this.prisma.telemetry.create({
    data: {
      machineName: machine.name,
      fuel: machine.fuel,
      temperature: machine.temperature,
      speed: machine.speed,
      lat: machine.lat,
      lng: machine.lng,
      active: machine.active,
    },
  });
}

      this.server.emit(
        'machines-update',
        machines,
      );
    }, 3000);
  }
}