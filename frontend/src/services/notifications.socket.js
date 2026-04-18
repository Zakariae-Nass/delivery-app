import { io } from 'socket.io-client';
import { WS_URL } from '../config/constants';

let socket = null;

export const notificationsSocket = {
  connect(userId, role, dispatch, actions) {
    if (socket?.connected) return;

    socket = io(`${WS_URL}/notifications`, { transports: ['websocket'] });

    socket.on('connect', () => {
      if (role === 'agency') {
        socket.emit('notifications.join', { agenceId: userId });
      } else if (role === 'delivery') {
        socket.emit('notifications.join', { livreurId: userId });
      }
    });

    socket.on('new.application', (data) => {
      dispatch(actions.addApplication(data));
      dispatch(actions.addNotification({
        type: 'new_application',
        message: `${data.livreur.username} a postulé`,
        data,
      }));
    });

    socket.on('commande.status.changed', (data) => {
      dispatch(actions.updateCommandeStatus({
        commandeId: data.commandeId,
        status: data.status,
      }));
    });

    socket.on('selection.timer', (data) => {
      dispatch(actions.updateSelectionTimer({
        commandeId: data.commandeId,
        secondsLeft: data.secondsLeft,
      }));
    });

    socket.on('commande.assigned', (data) => {
      dispatch(actions.setAssignedCommande(data.commande));
      dispatch(actions.addNotification({
        type: 'commande_assigned',
        message: `Commande ${data.commande.numero} assignée`,
        data,
      }));
    });

    socket.on('disconnect', () => {
      console.log('[Notifications] WS disconnected');
    });

    socket.on('connect_error', (e) => {
      console.error('[Notifications] WS error', e.message);
    });
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },
};
