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

@WebSocketGateway({ namespace: '/notifications', cors: { origin: '*' } })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`[Notifications] Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[Notifications] Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('notifications.join')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { agenceId?: string; livreurId?: string },
  ) {
    if (data.agenceId) {
      client.join(`agency:${data.agenceId}`);
    }
    if (data.livreurId) {
      client.join(`livreur:${data.livreurId}`);
    }
  }

  emitToAgency(agenceId: string | number, event: string, payload: unknown) {
    this.server.to(`agency:${agenceId}`).emit(event, payload);
  }

  emitToLivreur(livreurId: string | number, event: string, payload: unknown) {
    this.server.to(`livreur:${livreurId}`).emit(event, payload);
  }
}
