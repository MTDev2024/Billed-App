/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from '@testing-library/dom';
import BillsUI from '../views/BillsUI.js';
import { bills } from '../fixtures/bills.js';
import { ROUTES_PATH } from '../constants/routes.js';
import { localStorageMock } from '../__mocks__/localStorage.js';
import Bills from '../containers/Bills.js';
import router from '../app/Router.js';

describe('Given I am connected as an employee', () => {
  describe('When I am on Bills Page', () => {
    //----------------------------------------------------------------------------------//
    // DEBUT TEST BILL ICON
    test('Then bill icon in vertical layout should be highlighted', async () => {
      // GIVEN : Je suis connecté en tant qu'employé
      // On simule localStorage
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
      });

      // On stocke les infos d'un utilisateur de type "Employee"
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee',
        })
      );

      // Création conteneur principal dans le DOM
      const root = document.createElement('div');
      root.setAttribute('id', 'root');
      document.body.append(root);

      // Initialisation du routeur
      router();

      // WHEN : Je navigue sur la page Bills
      window.onNavigate(ROUTES_PATH.Bills);

      // Attente chargement icône "window" (facture) dans le DOM
      await waitFor(() => screen.getByTestId('icon-window'));

      // Récupération icône "window" depuis le DOM
      const windowIcon = screen.getByTestId('icon-window');

      // THEN : L'icône devrait être mise en surbrillance
      // Vérification que l'icône possède la classe CSS 'active-icon'
      expect(windowIcon.classList.contains('active-icon')).toBeTruthy();
    });
    // FIN TEST BILL ICON
    //----------------------------------------------------------------------------------//
    test('Then bills should be ordered from earliest to latest', () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
    //----------------------------------------------------------------------------------//
    // DEBUT TEST_1_NEW_BILL_BUTTON_NAVIGATION
    test("Then clicking on 'Nouvelle note de frais' button should navigate to NewBill page", () => {
      // GIVEN
      // 1. Créer le HTML de la page Bills
      document.body.innerHTML = BillsUI({ data: bills });

      // 2. Créer une fonction mock (espion) pour surveiller onNavigate
      const onNavigate = jest.fn();

      // 3. Créer une instance de Bills pour attacher les événements
      // eslint-disable-next-line no-unused-vars
      const billsContainer = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });

      // WHEN
      // 1. Récupérer le bouton "Nouvelle note de frais"
      const buttonNewBill = screen.getByTestId('btn-new-bill');

      // 2. Simuler un clic
      buttonNewBill.click();

      // THEN
      // Vérifier que onNavigate a été appelée avec le bon chemin
      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH['NewBill']);
    });
    // FIN TEST_1_NEW_BILL_BUTTON_NAVIGATION
    //----------------------------------------------------------------------------------//
    // DEBUT TEST_2_ICON_EYE_MODAL_DISPLAY
    test('Then a modal should open with the bill image', () => {
      // GIVEN
      // 1. On crée le HTML de la page avec factures mockées
      document.body.innerHTML = BillsUI({ data: bills });

      // 2. On crée un "faux" jQuery pour la modale
      //    (sinon Jest plante car jQuery n'existe pas)
      $.fn.modal = jest.fn(); // eslint-disable-line

      // 3. On crée un mock de la fonction de navigation
      const onNavigate = jest.fn();

      // 4. On crée une vraie instance de Bills
      // -> Attacher les événements de clic aux icônes
      // eslint-disable-next-line no-unused-vars
      const billsInstance = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });

      // 5. On récupère la 1ere icône œil
      // (getAllByTestId retourne un tableau, on prend le 1er élément)
      const iconEye = screen.getAllByTestId('icon-eye')[0];

      // 6. On ajoute une fausse URL de facture à l'icône
      iconEye.setAttribute('data-bill-url', 'https://test.com/facture.jpg');

      // WHEN
      // On simule un clic sur l'icône œil
      iconEye.click();

      // THEN
      // On vérifie que la modale a été ouverte
      // ($.fn.modal devrait avoir été appelée avec 'show')
      expect($.fn.modal).toHaveBeenCalledWith('show'); // eslint-disable-line
    });
    // FIN TEST_2_ICON_EYE_MODAL_DISPLAY
    //-------------------------------------------------------------------------------------------------------//
    // DEBUT TEST_3_GET_BILLS_FORMATTING
    test('Then bills should be retrieved, sorted and formatted', async () => {
      // GIVEN
      const mockBills = [
        {
          id: '1',
          date: '2024-11-22',
          status: 'pending',
          amount: 100,
          name: 'Test 1',
        },
        {
          id: '2',
          date: '2024-11-20',
          status: 'accepted',
          amount: 200,
          name: 'Test 2',
        },
      ];

      const store = {
        bills: () => ({
          list: () => Promise.resolve(mockBills),
        }),
      };

      const billsInstance = new Bills({
        document,
        onNavigate: jest.fn(),
        store: store,
        localStorage: window.localStorage,
      });
      // WHEN
      const result = await billsInstance.getBills();
      // THEN
      // 1. Vérifier qu'on a bien 2 bills
      expect(result.length).toBe(2);

      // 2. Vérifier l'ordre (tri antichronologique)
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');

      // 3. Vérifier que la date a été formatée
      expect(result[0].date).not.toBe('2024-11-22');

      // 4. Vérifier le formatage du statut
      expect(result[0].status).toBe('En attente');
    });
    // FIN TEST_3_GET_BILLS_FORMATTING
    //-------------------------------------------------------------------------------------------------------//
    // DEBUT TEST_GET_BILLS_FORMAT_ERROR
    test('Then if formatDate fails, bills should still be returned with raw date', async () => {
      // GIVEN
      // Data avec date invalide -> déclencher erreur dans formatDate
      const mockBillsWithBadDate = [
        {
          id: '1',
          date: 'INVALID_DATE_FORMAT', // Date corrompue
          status: 'pending',
          amount: 100,
          name: 'Test corrupted',
        },
      ];

      const store = {
        bills: () => ({
          list: () => Promise.resolve(mockBillsWithBadDate),
        }),
      };

      // Spy sur console.log pour vérifier qu'on log l'erreur
      const consoleSpy = jest.spyOn(console, 'log');

      const billsInstance = new Bills({
        document,
        onNavigate: jest.fn(),
        store: store,
        localStorage: window.localStorage,
      });

      // WHEN
      const result = await billsInstance.getBills();

      // THEN
      // 1. La bill est quand même retournée (pas de crash)
      expect(result.length).toBe(1);

      // 2. La date reste au format brut (pas formatée car erreur)
      expect(result[0].date).toBe('INVALID_DATE_FORMAT');

      // 3. L'erreur a été loggée dans la console
      expect(consoleSpy).toHaveBeenCalled();

      // Nettoyage : on arrête spy console.log
      consoleSpy.mockRestore();
    });
    // FIN TEST_GET_BILLS_FORMAT_ERROR
  });
});
