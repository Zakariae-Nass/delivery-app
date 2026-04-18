import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SaveLocationDto } from './dto/save-location.dto';
import { TrackingService } from './tracking.service';

@WebSocketGateway({ namespace: '/tracking', cors: { origin: '*' } })
export class TrackingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly trackingService: TrackingService) {}

  handleConnection(client: Socket) {
    console.log(`[Tracking] Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[Tracking] Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('tracking.join')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { commandeId: string; role: 'livreur' | 'agence' },
  ) {
    const room = `commande:${data.commandeId}`;
    client.join(room);
    client.emit('tracking.joined', { commandeId: data.commandeId });
  }

  @SubscribeMessage('livreur.position.update')
  async handlePositionUpdate(
    @MessageBody() data: SaveLocationDto,
  ) {
    await this.trackingService.saveLocation(data);
    this.server
      .to(`commande:${data.commandeId}`)
      .emit('tracking.location', {
        livreurId: data.livreurId,
        lat: data.lat,
        lng: data.lng,
        speed: data.speed,
        heading: data.heading,
        timestamp: new Date(),
      });
  }
}
