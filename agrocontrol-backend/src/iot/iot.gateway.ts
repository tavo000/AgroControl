import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';

import { Server } from 'socket.io';

import { PrismaService } from '../prisma/prisma.service';

interface MachinePayload {
  id: number;
  name: string;
  lat: number;
  lng: number;
  fuel: number;
  temperature: number;
  speed: number;
  active: boolean;
}

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
      const machines =
        await this.prisma.machine.findMany({
          orderBy: {
            id: 'asc',
          },
        });

      const updatedMachines: MachinePayload[] =
        [];

      for (const machine of machines) {
        const updatedMachine =
          await this.prisma.machine.update({
            where: {
              id: machine.id,
            },
            data: {
              lat:
                machine.lat +
                (Math.random() - 0.5) *
                  0.002,

              lng:
                machine.lng +
                (Math.random() - 0.5) *
                  0.002,

              fuel: Math.max(
                0,
                machine.fuel -
                  Math.random() * 0.8,
              ),

              temperature:
                55 + Math.random() * 30,

              speed:
                machine.active
                  ? 5 + Math.random() * 35
                  : 0,
            },
          });

        await this.prisma.telemetry.create({
          data: {
            machineName:
              updatedMachine.name,
            fuel: updatedMachine.fuel,
            temperature:
              updatedMachine.temperature,
            speed: updatedMachine.speed,
            lat: updatedMachine.lat,
            lng: updatedMachine.lng,
            active: updatedMachine.active,
          },
        });

        await this.createAlertsIfNeeded(
          updatedMachine,
        );

        updatedMachines.push(
          updatedMachine,
        );
      }

      this.server.emit(
        'machines-update',
        updatedMachines,
      );
    }, 3000);
  }

  @SubscribeMessage('machine-command')
  async handleMachineCommand(
    @MessageBody()
    body: {
      machineId: number;
      active: boolean;
    },
  ) {
    const machine =
      await this.prisma.machine.update({
        where: {
          id: body.machineId,
        },
        data: {
          active: body.active,
        },
      });

    this.server.emit(
      'machine-command-result',
      machine,
    );

    return machine;
  }

  private async createAlertsIfNeeded(
    machine: MachinePayload,
  ) {
    if (machine.fuel < 20) {
      await this.prisma.alert.create({
        data: {
          machineName: machine.name,
          type: 'LOW_FUEL',
          severity: 'HIGH',
          message:
            'Combustible por debajo del 20%',
        },
      });
    }

    if (machine.temperature > 78) {
      await this.prisma.alert.create({
        data: {
          machineName: machine.name,
          type: 'HIGH_TEMPERATURE',
          severity: 'HIGH',
          message:
            'Temperatura elevada detectada',
        },
      });
    }

    if (machine.speed > 38) {
      await this.prisma.alert.create({
        data: {
          machineName: machine.name,
          type: 'HIGH_SPEED',
          severity: 'MEDIUM',
          message:
            'Velocidad operativa elevada',
        },
      });
    }
  }
}