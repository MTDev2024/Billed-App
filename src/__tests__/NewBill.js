/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from '@testing-library/dom';
import NewBillUI from '../views/NewBillUI.js';
import NewBill from '../containers/NewBill.js';
import { ROUTES_PATH } from '../constants/routes.js';

//----------------------------------------------------------------//
//-----------------------TESTS UNITAIRES--------------------------//
//----------------------------------------------------------------//
describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    // DEBUT TEST_1_INVALID_FILE_EXTENSION
    test('Then uploading a file with invalid extension should show an alert', () => {
      // GIVEN
      // 1. Créer HTML du formulaire
      document.body.innerHTML = NewBillUI();

      // 2. Mocker alerte
      window.alert = jest.fn();

      // 3. Créer instance de NewBill
      const newBillInstance = new NewBill({
        document,
        onNavigate: jest.fn(),
        store: null,
        localStorage: window.localStorage,
      });

      // WHEN
      // 1. Récupérer input file
      const fileInput = screen.getByTestId('file');

      // 2. Créer faux .pdf
      const file = new File(['contenu'], 'facture.pdf', {
        type: 'application/pdf',
      });

      // 3. Simuler sélection du fichier
      Object.defineProperty(fileInput, 'files', {
        value: [file],
      });

      // 4. Créer événement change
      const event = {
        preventDefault: jest.fn(),
        target: {
          value: 'C:\\fakepath\\facture.pdf',
        },
      };

      // 5. Appel handleChangeFile
      newBillInstance.handleChangeFile(event);

      // THEN
      // 1. Vérifier que l'alerte a été affichée
      expect(window.alert).toHaveBeenCalled();

      // 2. Vérifier que le champ file a été réinitialisé
      expect(event.target.value).toBe('');
    });
    // FIN TEST_1_INVALID_FILE_EXTENSION

    //---------------------------------------------------------------------------------------//

    // DEBUT TEST_2A_JPG_FILE_EXTENSION
    test('Then uploading a file with jpg extension should be accepted', async () => {
      // GIVEN
      document.body.innerHTML = NewBillUI();

      window.localStorage.setItem(
        'user',
        JSON.stringify({
          email: 'employee@test.com',
        })
      );

      window.alert = jest.fn();

      // Mock du store
      const mockCreate = jest.fn().mockResolvedValue({
        fileUrl: 'https://localhost:3456/images/test.jpg',
        key: '1234',
      });

      const mockBills = {
        create: mockCreate,
      };

      const store = {
        bills: jest.fn(() => mockBills),
      };

      const newBillInstance = new NewBill({
        document,
        onNavigate: jest.fn(),
        store: store,
        localStorage: window.localStorage,
      });

      // WHEN
      const fileInput = screen.getByTestId('file');

      const file = new File(['contenu'], 'facture.jpg', {
        type: 'image/jpg',
      });

      Object.defineProperty(fileInput, 'files', {
        value: [file],
      });

      const event = {
        preventDefault: jest.fn(),
        target: {
          value: 'C:\\fakepath\\facture.jpg',
        },
      };

      newBillInstance.handleChangeFile(event);

      // Attendre promise résolue
      await new Promise(process.nextTick);

      // THEN
      expect(window.alert).not.toHaveBeenCalled();
      expect(event.target.value).not.toBe('');
      expect(mockCreate).toHaveBeenCalled();
    });
    // FIN TEST_2A_JPG_FILE_EXTENSION
    //---------------------------------------------------------------------------------------//
    // DEBUT TEST_2_B_JPEG_FILE_EXTENSION
    test('Then uploading a file with jpeg extension should be accepted', async () => {
      // GIVEN
      document.body.innerHTML = NewBillUI();

      window.localStorage.setItem(
        'user',
        JSON.stringify({
          email: 'employee@test.com',
        })
      );

      window.alert = jest.fn();

      // Mock du store
      const mockCreate = jest.fn().mockResolvedValue({
        fileUrl: 'https://localhost:3456/images/test.jpeg',
        key: '1234',
      });

      const mockBills = {
        create: mockCreate,
      };

      const store = {
        bills: jest.fn(() => mockBills),
      };

      const newBillInstance = new NewBill({
        document,
        onNavigate: jest.fn(),
        store: store,
        localStorage: window.localStorage,
      });

      // WHEN
      const fileInput = screen.getByTestId('file');

      const file = new File(['contenu'], 'facture.jpeg', {
        type: 'image/jpeg',
      });

      Object.defineProperty(fileInput, 'files', {
        value: [file],
      });

      const event = {
        preventDefault: jest.fn(),
        target: {
          value: 'C:\\fakepath\\facture.jpeg',
        },
      };

      newBillInstance.handleChangeFile(event);

      // Attendre promise résolue
      await new Promise(process.nextTick);

      // THEN
      expect(window.alert).not.toHaveBeenCalled();
      expect(event.target.value).not.toBe('');
      expect(mockCreate).toHaveBeenCalled();
    });
    // FIN TEST_2_B_JPEG_FILE_EXTENSION
    //---------------------------------------------------------------------------------------//
    // DEBUT TEST_2C_PNG_FILE_EXTENSION
    test('Then uploading a file with png extension should be accepted', async () => {
      // GIVEN
      document.body.innerHTML = NewBillUI();

      window.localStorage.setItem(
        'user',
        JSON.stringify({
          email: 'employee@test.com',
        })
      );

      window.alert = jest.fn();

      // Mock du store
      const mockCreate = jest.fn().mockResolvedValue({
        fileUrl: 'https://localhost:3456/images/test.png',
        key: '1234',
      });

      const mockBills = {
        create: mockCreate,
      };

      const store = {
        bills: jest.fn(() => mockBills),
      };

      const newBillInstance = new NewBill({
        document,
        onNavigate: jest.fn(),
        store: store,
        localStorage: window.localStorage,
      });

      // WHEN
      const fileInput = screen.getByTestId('file');

      const file = new File(['contenu'], 'facture.png', {
        type: 'image/png',
      });

      Object.defineProperty(fileInput, 'files', {
        value: [file],
      });

      const event = {
        preventDefault: jest.fn(),
        target: {
          value: 'C:\\fakepath\\facture.png',
        },
      };

      newBillInstance.handleChangeFile(event);

      // Attendre promise résolue
      await new Promise(process.nextTick);

      // THEN
      expect(window.alert).not.toHaveBeenCalled();
      expect(event.target.value).not.toBe('');
      expect(mockCreate).toHaveBeenCalled();
    });
    // FIN TEST_2C_PNG_FILE_EXTENSION
    // DEBUT TEST_3_HANDLE_SUBMIT
    describe('When I submit the form with valid data', () => {
      test('Then it should create a bill and navigate to Bills page', () => {
        //---------------------------------------------------------------------------------------//
      });
    });
  });
  // DEBUT TEST_3_HANDLE_SUBMIT
  describe('When I submit the new bill form', () => {
    test('Then it should create a bill and navigate to Bills page', () => {
      // GIVEN : Je suis sur la page NewBill avec un formulaire rempli
      // 1. Creation HTML formulaire
      document.body.innerHTML = NewBillUI();

      // 2. Simulation utilisateur connecté dans localStorage
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          email: 'employee@test.com',
        })
      );

      // 3. Creation mocks onNavigate & updateBill
      const onNavigate = jest.fn();

      // 4. Creation instance de NewBill
      const newBillInstance = new NewBill({
        document,
        onNavigate: onNavigate,
        store: null,
        localStorage: window.localStorage,
      });

      // 5. Mock méthode updateBill
      newBillInstance.updateBill = jest.fn();

      // 6. Simulation upload fichier valide effectué
      newBillInstance.fileUrl = 'https://localhost:3456/images/test.jpg';
      newBillInstance.fileName = 'test.jpg';

      // 7. Remplissage champs formulaire
      screen.getByTestId('expense-type').value = 'Transports';
      screen.getByTestId('expense-name').value = 'Vol Paris-Londres';
      screen.getByTestId('datepicker').value = '2024-04-15';
      screen.getByTestId('amount').value = '348';
      screen.getByTestId('vat').value = '70';
      screen.getByTestId('pct').value = '20';
      screen.getByTestId('commentary').value = 'Déplacement professionnel';

      // WHEN : Je soumets le formulaire
      // 1. Récuperation formulaire
      const form = screen.getByTestId('form-new-bill');

      // 2. Création événement submit
      const handleSubmit = jest.fn((e) => newBillInstance.handleSubmit(e));

      // 3. Ajout ecouteur d'événement
      form.addEventListener('submit', handleSubmit);

      // 4. Déclenchement soumission formulaire
      fireEvent.submit(form);

      // THEN : La bill devrait être créée et je devrais naviguer vers Bills
      // 1. Verification que handleSubmit appelé
      expect(handleSubmit).toHaveBeenCalled();

      // 2. Verification que updateBill appelé
      expect(newBillInstance.updateBill).toHaveBeenCalled();

      // 3. Verification que updateBill a reçu les bonnes données
      expect(newBillInstance.updateBill).toHaveBeenCalledWith({
        email: 'employee@test.com',
        type: 'Transports',
        name: 'Vol Paris-Londres',
        amount: 348,
        date: '2024-04-15',
        vat: '70',
        pct: 20,
        commentary: 'Déplacement professionnel',
        fileUrl: 'https://localhost:3456/images/test.jpg',
        fileName: 'test.jpg',
        status: 'pending',
      });

      // 4. Verification navigation vers page Bills
      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH['Bills']);
    });
  });
  // FIN TEST_3_HANDLE_SUBMIT
  //---------------------------------------------------------------------------------------//
});

//----------------------------------------------------------------//
//-----------------TESTS D'INTEGRATION POST-----------------------//
//----------------------------------------------------------------//
describe('Given I am connected as an employee', () => {
  describe('When I upload a file on NewBill page', () => {
    // TEST 1 : POST RÉUSSI
    test('Then file is sent to API via POST and stored in instance', async () => {
      // GIVEN : Formulaire NewBill + fichier valide
      // 1. Préparer DOM avec formulaire NewBill
      document.body.innerHTML = NewBillUI();

      // 2. Simulation Employee connecté
      window.localStorage.setItem(
        'user',
        JSON.stringify({ email: 'employee@test.com' })
      );

      // 3. Mock du store qui retourne succès
      const mockCreate = jest.fn().mockResolvedValue({
        fileUrl: 'https://localhost:3456/images/test.jpg',
        key: '1234',
      });
      const mockBills = { create: mockCreate };
      const store = { bills: jest.fn(() => mockBills) };

      // 4. Creation instance de NewBill
      const onNavigate = jest.fn();
      const newBillInstance = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });

      // WHEN : L'employé upload un fichier valide
      // 1. Récupérer l'input file
      const fileInput = screen.getByTestId('file');

      // 2. Créer faux .jpg
      const file = new File(['contenu'], 'facture.jpg', {
        type: 'image/jpg',
      });

      // 3. Simulation sélection fichier
      Object.defineProperty(fileInput, 'files', {
        value: [file],
      });

      // 4. Creation événement change
      const event = {
        preventDefault: jest.fn(),
        target: {
          value: 'C:\\fakepath\\facture.jpg',
          files: [file],
        },
      };

      // 5. Appel handleChangeFile
      newBillInstance.handleChangeFile(event);

      // 6. Attendre résolution de promise
      await new Promise(process.nextTick);

      // THEN : APPEL API et STOCKAGE DATAS
      // 1. Vérification que create() a été appelé
      expect(mockCreate).toHaveBeenCalled();

      // 2. Vérification que formData contient le fichier
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.any(FormData),
          headers: expect.objectContaining({
            noContentType: true,
          }),
        })
      );

      // 3. Vérification fileUrl est stocké dans instance
      expect(newBillInstance.fileUrl).toBe(
        'https://localhost:3456/images/test.jpg'
      );

      // 4. Vérification billId (key) est stocké dans instance
      expect(newBillInstance.billId).toBe('1234');

      // 5. Vérification fileName est stocké
      expect(newBillInstance.fileName).toBe('facture.jpg');
    });

    // TESTS 2 & 3 : GESTION ERREURS API
    describe('When an error occurs on API', () => {
      // TEST 2 : ERREUR 404
      test('Then uploading a file fails with 404 error', async () => {
        // GIVEN : Mock du store qui retourne une erreur 404
        // 1. Préparation DOM
        document.body.innerHTML = NewBillUI();

        // 2. Simulation utilisateur connecté
        window.localStorage.setItem(
          'user',
          JSON.stringify({ email: 'employee@test.com' })
        );

        // 3. Mock qui rejette avec erreur 404
        const mockCreate = jest.fn().mockRejectedValue(new Error('Erreur 404'));
        const mockBills = { create: mockCreate };
        const store = { bills: jest.fn(() => mockBills) };

        // 4. Créer instance de NewBill
        const newBillInstance = new NewBill({
          document,
          onNavigate: jest.fn(),
          store,
          localStorage: window.localStorage,
        });

        // 5. Mock console.error pour capturer erreur
        console.error = jest.fn();

        // WHEN : Employé upload un fichier
        const fileInput = screen.getByTestId('file');
        const file = new File(['contenu'], 'facture.jpg', {
          type: 'image/jpg',
        });
        Object.defineProperty(fileInput, 'files', {
          value: [file],
        });

        const event = {
          preventDefault: jest.fn(),
          target: {
            value: 'C:\\fakepath\\facture.jpg',
            files: [file],
          },
        };

        newBillInstance.handleChangeFile(event);
        await new Promise(process.nextTick);

        // THEN : Erreur capturée
        // 1. Vérification que create() a été appelé
        expect(mockCreate).toHaveBeenCalled();

        // 2. Vérification erreur loggée
        expect(console.error).toHaveBeenCalled();

        // 3. Vérification fileUrl null ou undefined
        expect(newBillInstance.fileUrl).toBeFalsy();

        // 4. Vérification billId null ou undefined
        expect(newBillInstance.billId).toBeFalsy();
      });

      // TEST 3 : ERREUR 500
      test('Then uploading a file fails with 500 error', async () => {
        // GIVEN : Mock du store qui retourne erreur 500

        // 1. Préparation du DOM
        document.body.innerHTML = NewBillUI();

        // 2. Simulation employé connecté
        window.localStorage.setItem(
          'user',
          JSON.stringify({ email: 'employee@test.com' })
        );

        // 3. Mock qui rejette avec erreur 500
        const mockCreate = jest.fn().mockRejectedValue(new Error('Erreur 500'));
        const mockBills = { create: mockCreate };
        const store = { bills: jest.fn(() => mockBills) };

        // 4. Creation instance de NewBill
        const newBillInstance = new NewBill({
          document,
          onNavigate: jest.fn(),
          store,
          localStorage: window.localStorage,
        });

        // 5. Mock console.error pour capturer erreur
        console.error = jest.fn();

        // WHEN : L'employé upload un fichier
        const fileInput = screen.getByTestId('file');
        const file = new File(['contenu'], 'facture.jpg', {
          type: 'image/jpg',
        });
        Object.defineProperty(fileInput, 'files', {
          value: [file],
        });

        const event = {
          preventDefault: jest.fn(),
          target: {
            value: 'C:\\fakepath\\facture.jpg',
            files: [file],
          },
        };

        newBillInstance.handleChangeFile(event);
        await new Promise(process.nextTick);

        // THEN : Erreur capturée
        // 1. Vérification create() a été appelé
        expect(mockCreate).toHaveBeenCalled();

        // 2. Vérification erreur loggé
        expect(console.error).toHaveBeenCalled();

        // 3. Vérification fileUrl null ou undefined
        expect(newBillInstance.fileUrl).toBeFalsy();

        // 4. Vérification billId null ou undefined
        expect(newBillInstance.billId).toBeFalsy();
      });
    }); // FIN describe "When an error occurs on API"
  }); // FIN describe "When I upload a file on NewBill page"
}); // FIN describe "Given I am connected as an employee"
