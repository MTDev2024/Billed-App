import { ROUTES_PATH } from '../constants/routes.js';
import { formatDate, formatStatus } from '../app/format.js';
import Logout from './Logout.js';

export default class {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    const buttonNewBill = document.querySelector(
      `button[data-testid="btn-new-bill"]`
    );
    if (buttonNewBill)
      buttonNewBill.addEventListener('click', this.handleClickNewBill);

    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`);

    if (iconEye)
      iconEye.forEach((icon) => {
        icon.addEventListener('click', () => this.handleClickIconEye(icon));
      });
    new Logout({ document, localStorage, onNavigate });
  }

  handleClickNewBill = () => {
    this.onNavigate(ROUTES_PATH['NewBill']);
  };

  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute('data-bill-url');
    const imgWidth = Math.floor($('#modaleFile').width() * 0.5);
    $('#modaleFile')
      .find('.modal-body')
      .html(
        `<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`
      );
    $('#modaleFile').modal('show');
  };

  getBills = () => {
    // Vérifie que le store (API) est disponible
    if (this.store) {
      // Appel API pour récupérer les notes de frais
      return (
        this.store
          .bills()
          .list()

          // .then() : Traitement si l'API répond avec SUCCÈS
          .then((snapshot) => {
            const bills = snapshot // Tableau des bills brutes

              // TRI antichronologique : + au - récent
              .sort((a, b) => new Date(b.date) - new Date(a.date))

              // Formate chaque bill pour affichage
              .map((doc) => {
                try {
                  return {
                    ...doc, // Garde toutes les propriétés existantes
                    date: formatDate(doc.date), // "2004-04-04" → "4 Avr. 04"
                    status: formatStatus(doc.status), // "pending" → "En attente"
                  };
                } catch (e) {
                  // Si formatDate échoue (données corrompues)
                  // → log erreur mais affiche bill quand même
                  console.log(e, 'for', doc);
                  return {
                    ...doc,
                    date: doc.date, // Garde date brute en cas d'erreur
                    status: formatStatus(doc.status),
                  };
                }
              });

            // Debug : affiche nombre total de bills récupérées
            console.log('length', bills.length);

            // Retourne tableau trié + formaté
            return bills;
          })

          // .catch() : Gestion ERREURS API (404, 500, etc.)
          .catch((error) => {
            // 1. Log erreur dans console pour debug
            console.error('Error fetching bills:', error);

            // 2. Retourner erreur pour afficher ErrorPage(error)
            return error;
          })
      );
    }
  };
}
