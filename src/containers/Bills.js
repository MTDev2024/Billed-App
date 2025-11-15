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
    // Vérifie que le store (API mock) est disponible
    if (this.store) {
      // Appel API -> récupérer toutes les notes de frais
      return this.store
        .bills()
        .list()
        .then((snapshot) => {
          const bills = snapshot //  tableau des bills brutes avec dates format "2004-04-04"

            // Si b.date > a.date → nombre positif → b avant a
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // + récent au + ancien
            // TRANSFORMATION : formate chaque bill pour affichage
            .map((doc) => {
              try {
                return {
                  ...doc, // Garde toutes les propriétés existantes
                  date: formatDate(doc.date), // Transforme "2004-04-04" en "4 Avr. 04"
                  status: formatStatus(doc.status), // Transforme "pending" en "En attente"
                };
              } catch (e) {
                // Si formatDate échoue (données corrompues)-> log erreur mais on affiche quand même bill
                console.log(e, 'for', doc);
                return {
                  ...doc,
                  date: doc.date, // Garde la date brute en cas d'erreur
                  status: formatStatus(doc.status),
                };
              }
            });
          // Debug : affiche nombre total de bills récupérées
          console.log('length', bills.length);
          return bills; // Tableau trié + formaté
        });
    }
  };
}
